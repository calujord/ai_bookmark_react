/**
 * ChatGPTResponse
 * This interface defines the data type of the ChatGPT API response
 * adding the url and title property of the web page.
 * @interface
 * @property {string} text -ChatGPT API response text
 * @property {string} title -Title of the web page
 * @property {string} url -URL of the web page
 */
export interface ChatGPTResponse {
  /**
   * ChatGPT API response text
   * @type {string}
   * @memberof ChatGPTResponse
   */
  text: string;
  /**
   * Website Title
   * @type {string}
   * @memberof ChatGPTResponse
   */
  title: string;
  /**
   * Website URL
   * @type {string}
   * @memberof ChatGPTResponse
   */
  url: string;
}
