import { ChatGPTResponse } from "../types/chatgpt_response.type";

export const ChatGPTController = {
  async setApiKey(apiKey: string): Promise<void> {
    return new Promise((resolve, _) => {
      chrome.storage.sync.set({ chatgptApiKey: apiKey }, () => {
        return resolve();
      });
    });
  },
  /**
   * Get the API key from the storage or cookie.
   * @returns {Promise<string>}
   */
  async getApiKey(): Promise<string> {
    return new Promise((resolve, _) => {
      chrome.storage.sync.get({ chatgptApiKey: null }, (result) => {
        if (result) {
          return resolve(result.chatgptApiKey);
        }
        return this.tryGetApiKeyFromCookie();
      });
    });
  },
  /**
   * Get the API key from the cookie.
   * @param name {String} can be __Secure-next-auth.session-token.0 or __Secure-next-auth.session-token.1 or __Secure-next-auth.session-token
   * @returns
   */
  async getApiKeyFromCookie(name: string): Promise<string | undefined> {
    return new Promise((resolve, _) => {
      return chrome.cookies.get(
        {
          url: "https://chat.openai.com/",
          name: name,
        },
        function (cookie) {
          if (cookie) {
            // save in storage in chatgptApiKey
            chrome.storage.sync.set({ chatgptApiKey: cookie.value });
            return resolve(cookie.value);
          } else {
            return resolve(undefined);
          }
        }
      );
    });
  },
  /**
   * Try to get the API key from the cookie.
   */
  async tryGetApiKeyFromCookie(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.getApiKeyFromCookie("__Secure-next-auth.session-token").then(
        (apiKey?: string) => {
          if (apiKey) {
            return resolve(apiKey);
          } else {
            this.getApiKeyFromCookie("__Secure-next-auth.session-token.0").then(
              (apiKey?: string) => {
                if (apiKey) {
                  return resolve(apiKey);
                } else {
                  this.getApiKeyFromCookie(
                    "__Secure-next-auth.session-token.1"
                  ).then((apiKey?: string) => {
                    if (apiKey) {
                      return resolve(apiKey);
                    } else {
                      return reject(
                        "API key not found, please login using chat.openai.com"
                      );
                    }
                  });
                }
              }
            );
          }
        }
      );
    });
  },

  async getChatgptResponse(
    urlPage: string,
    titlePage: string,
    apikey: string,
    content: string
  ): Promise<ChatGPTResponse> {
    apikey =
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1UaEVOVUpHTkVNMVFURTRNMEZCTWpkQ05UZzVNRFUxUlRVd1FVSkRNRU13UmtGRVFrRXpSZyJ9.eyJodHRwczovL2FwaS5vcGVuYWkuY29tL3Byb2ZpbGUiOnsiZW1haWwiOiJjYWx1am9yZEBqa29hbGEuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWV9LCJodHRwczovL2FwaS5vcGVuYWkuY29tL2F1dGgiOnsidXNlcl9pZCI6InVzZXItWlYyMjlMbE1kd250TXBqRWY2eVY5a25HIn0sImlzcyI6Imh0dHBzOi8vYXV0aDAub3BlbmFpLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExMzU4NzA1OTIxMDMxNDQ0OTMwOSIsImF1ZCI6WyJodHRwczovL2FwaS5vcGVuYWkuY29tL3YxIiwiaHR0cHM6Ly9vcGVuYWkub3BlbmFpLmF1dGgwYXBwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2OTMzODYyNDUsImV4cCI6MTY5NDU5NTg0NSwiYXpwIjoiVGRKSWNiZTE2V29USHROOTVueXl3aDVFNHlPbzZJdEciLCJzY29wZSI6Im9wZW5pZCBlbWFpbCBwcm9maWxlIG1vZGVsLnJlYWQgbW9kZWwucmVxdWVzdCBvcmdhbml6YXRpb24ucmVhZCBvcmdhbml6YXRpb24ud3JpdGUgb2ZmbGluZV9hY2Nlc3MifQ.mLDDKaVXaFuLHdtUCu5pwaEkRuhjkPU8GzYnR3UTfJkGt6jwcdA4d5l9NeNyLfI50RXMp3AqQqiQ9HtPxBNeMe8_P6JNNct6uG3HaxSufDnH4MQHuYwQ3dS0_NlbOjaayw1e5_BiISminQs-c8poo2_8r3J4K-T8YvCcB1KpiiGtX1B72NSJsvqqTuduMcC4H9aacdfye3x6LEnNHN99aMgrMlCyEbQCZKMwD79AcX_HLo0v785xs8Wv7sxn9TCNR56B9MJmqjC40thd3a6aHPca6rS2e_K0Qgds95l_uLFoapukBr3a2l1fHcfr9oInH1qUVlxxruB2Mo3H5TTNnw";
    return new Promise((resolve, reject) => {
      const url = "https://chat.openai.com/backend-api/conversation";
      /// build fetch using stream
      const data = {
        action: "next",
        messages: [
          {
            id: this.generateUuid(),
            author: { role: "user" },
            content: {
              content_type: "text",
              parts: [content.substring(0, 255)],
            },
          },
        ],
        model: "text-davinci-002-render-sha",
        parent_message_id: this.generateUuid(),
      };
      console.log(data);
      return fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apikey}`,
          accept: "text/event-stream",
        },
      })
        .then(async (stream) => {
          if (stream.body) {
            const reader = stream.body.getReader();
            let re = "";
            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                break;
              }
              const chunk = new TextDecoder("utf-8").decode(value);
              if (chunk !== "[done]") {
                re += chunk;
              }
            }
            const resultData = re.replaceAll("data: ", "").split("\n");
            // remove all elements of array is empty
            resultData.forEach((element, index) => {
              if (element === "") {
                resultData.splice(index, 1);
              }
            });
            re = resultData[resultData.length - 4];
            /// string to json
            const responseChatGPT = {
              text: JSON.parse(re).message.content.parts[0],
              title: titlePage,
              url: urlPage,
            } as ChatGPTResponse;
            return resolve(responseChatGPT);
          }
          return reject("API key is invalid");
        })
        .catch((error) => {
          return reject(error);
        });
    });
  },

  generateUuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        let r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  },
};
