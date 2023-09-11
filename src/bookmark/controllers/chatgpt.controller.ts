import { ChatGPTResponse } from "../types/chatgpt_response.type";
/**
 * ChatGPTController
 * @description
 * It is an implementation that allows you to manage all the methods related to the chatgpt API.
 * to obtain the api_key information through cookies.
 * - Set the api_key in storage.
 * - Get the response from chatgpt.
 */
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
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get({ chatgptApiKey: null }, (result) => {
        if (result && result.chatgptApiKey) {
          return resolve(result.chatgptApiKey);
        }
        return this.getApikeyFromSession().then((apiKey) => {
          if (apiKey) {
            return resolve(apiKey);
          } else {
            return reject("ChatGPTError, plase login in chatgpt.com");
          }
        });
      });
    });
  },

  /**
   * Delete the API key from the storage.
   */
  async deleteApiKey(): Promise<void> {
    return new Promise((resolve, _) => {
      chrome.storage.sync.remove(["chatgptApiKey"], () => {
        return resolve();
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
  async getApikeyFromSession(): Promise<string> {
    return new Promise((resolve, reject) => {
      fetch("https://chat.openai.com/api/auth/session").then((response) => {
        if (response.status === 200) {
          return response.json().then((data) => {
            return resolve(data.accessToken);
          });
        } else {
          return reject("Error to get api key from cookie");
        }
      });
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
      ///build fetch using stream
      const data = {
        action: "next",
        messages: [
          {
            id: this.generateUuid(),
            author: { role: "user" },
            content: {
              content_type: "text",
              parts: [content.substring(0, 4095)],
            },
          },
        ],
        model: "text-davinci-002-render-sha",
        parent_message_id: this.generateUuid(),
      };
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
            ///string to json
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
