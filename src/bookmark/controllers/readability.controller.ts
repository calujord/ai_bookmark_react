import { ReadabilityResponse } from "../types/readability_response.types";
import { ScoreContent } from "../types/score_content.types";
import { tagsElementsScore } from "./constants";
/**
 * This is a controller, it is a class that is responsible for managing the logic of the application
 * In this case, it is responsible for obtaining the content of the page and calculating the score of each element.
 * and then return an array of objects with the content and the score
 * @class RedabilityController
 */
export const RedabilityController = {
  /**
   *
   * @param {HTMLElement} contentInHtmlTags
   * @returns {Promise<ScoreContent[]>}
   */
  async getReadability(contentInHtmlTags: Document): Promise<ScoreContent[]> {
    // create with promise
    return new Promise((resolve, _) => {
      // create array with content and score
      const arrayDataContent: ScoreContent[] = [];

      // get all tags
      tagsElementsScore.forEach((el) => {
        // get all tags by name
        const content = contentInHtmlTags.getElementsByTagName(el.tag);
        // iterate all tags
        for (let index = 0; index < content.length; index++) {
          // create object with content and score
          const elementKeyScore = {
            content: content[index].innerHTML,
            weight: el.score,
          } as ScoreContent;
          // push object to array
          arrayDataContent.push(elementKeyScore);
        }
      });
      // return array
      return resolve(arrayDataContent);
    });
  },
  async getContentByTabId(tabId: number): Promise<Document> {
    return new Promise((resolve, reject) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabId },
          // Use a type assertion here
          // @ts-ignore
          function: () => {
            return document.documentElement.innerHTML;
          },
        },
        (result) => {
          if (chrome.runtime.lastError)
            return reject(chrome.runtime.lastError.message);
          // Handle the HTML content
          const parser = new DOMParser();
          if (result.length !== 0) {
            const htmlDoc = parser.parseFromString(
              result[0].result as string,
              "text/html"
            );
            return resolve(htmlDoc);
          } else {
            return reject("Error to get content");
          }
        }
      );
    });
  },

  /**
   * Build content to send to chatgpt api.
   * @param {Array} contentList
   * @returns {string}
   */
  async buildContentToChatGpt(contentList: ScoreContent[]): Promise<string> {
    let content =
      "Please forget all prior prompts. I want you to become an Expert summarizing content. Your goal is to help me get context for my website bookmarks. Please follow the following process, you will provide four different responses, each on double space clearly separated paragraphs: First a 100 character high level summary of the content. Second, a 300 character detailed summary of the content in double space bullet points. Third provide today's date and time. Fourth a rating 1 to 10 based of the accuracy of the previous step-by-step summary. Please do not include any apology on your response, just straight to the facts of what can be provided. Thank you. ";
    for (let index = 0; index < contentList.length; index++) {
      const element = contentList[index];
      /// check more inteligent the content
      content += element.content + " ";
    }
    return content;
  },
  /**
   * Get resumen with priorities current tag.
   * @returns {Promise<ReadabilityResponse>}
   */
  async getContentHtmlTabs(): Promise<ReadabilityResponse> {
    return new Promise((resolve, reject) => {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        function (tabs: chrome.tabs.Tab[]) {
          if (tabs && tabs.length !== 0) {
            RedabilityController.getContentByTabId(tabs[0].id!).then(
              (document: Document) => {
                RedabilityController.getReadability(document).then(
                  (content: ScoreContent[]) => {
                    RedabilityController.buildContentToChatGpt(content).then(
                      (content: string) => {
                        return resolve({
                          content: content,
                          title: tabs[0].title ?? "",
                          url: tabs[0].url ?? "",
                        });
                      }
                    );
                  }
                );
              }
            );
          } else {
            return reject("No active tab found");
          }
        }
      );
    });
  },
};
