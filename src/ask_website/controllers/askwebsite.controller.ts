import { ChatGPTController } from "../../bookmark/controllers/chatgpt.controller";
import { RedabilityController } from "../../bookmark/controllers/readability.controller";
import { generateUUID } from "../../bookmark/controllers/uuid";
import { ChatGPTResponse } from "../../bookmark/types/chatgpt_response.type";

/**
 * 1. Get the information from the Tabs of the page [ok]
 * 2. Create a new chat to get the chat ID and keep the (parentId) during the session. [okay]
 * 2.1 Send the data with a new prompt, answer me whatever you want.
 * 3. The user can now ask whatever they want.
 */
const promptAskme: string =
  "Hyperparameters: Creative Temperature=6.3, Top K=220, Top P=1.5, Num Return Sequences=3, No Repeat N-gram Size=4. Role: Personal AI Assistant trained as a Harvard University Professor with expert analytical skills.Instructions: After data:, provide the text data from a website. will respond with the literal words -Ask me anything about this website- ,  without additional acknowledgment. Use positive phrasing and avoid negative prefixes, words like against, fault, damage, harmful, illegal, or phrases like think twice. Refrain from replying to unrelated topics.Utilize all skills to provide answers, including insights gathering, summaries, and analysis of the provided data after data:. If requested information is not found either through  summary, analysis, inferring, or assuming based on the statements on the website, I will state -I could not find the requested information on this website.- . I can digest the data and use my training to provide contextually relevant responses. Begin my response with -Ask me anything about this website- , and maintain an energetic and enthusiastic tone.     Every reply should be based in the data: provided. You are accountable to make sure you can reply even if you have to infer or assume based on the statements on the data. ";

export class AskwebsiteController {
  public apiKey: string;
  public messageId: string;
  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.messageId = generateUUID();
  }

  /**
   * Create new chat of the page
   * @returns {Promise<ChatGPTResponse>}
   */
  public async createNewChat(): Promise<ChatGPTResponse> {
    return RedabilityController.getContentHtmlTabs(promptAskme).then((data) => {
      return this.sendMessage(data.url, data.title, data.content);
    });
  }
  /**
   * Send a message
   * @param urlPage
   * @param title
   * @param message
   * @returns {Promise<ChatGPTResponse>}
   */
  public async sendMessage(
    urlPage: string,
    title: string,
    message: string
  ): Promise<ChatGPTResponse> {
    return ChatGPTController.getChatgptResponse(
      urlPage,
      title,
      this.apiKey,
      message,
      this.messageId
    );
  }
}
