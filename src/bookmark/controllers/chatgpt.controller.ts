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
        if (result && result.chatgptApiKey) {
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
      this.getApiKeyFromCookie("__Secure-next-auth.session-token.1").then(
        (apiKey?: string) => {
          if (apiKey) {
            console.log("API key found in cookie");
            return resolve(apiKey);
          } else {
            this.getApiKeyFromCookie("__Secure-next-auth.session-token.0").then(
              (apiKey?: string) => {
                if (apiKey) {
                  console.log("API key found in cookie2");
                  return resolve(apiKey);
                } else {
                  this.getApiKeyFromCookie(
                    "__Secure-next-auth.session-token"
                  ).then((apiKey?: string) => {
                    if (apiKey) {
                      console.log("API key found in cookie3");
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
