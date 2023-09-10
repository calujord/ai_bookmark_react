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
    let content = "Please could you give a resumen about this content ";
    for (let index = 0; index < contentList.length; index++) {
      const element = contentList[index];
      /// check more inteligent the content
      content += element.content + " ";
    }
    return content;
  },
};
