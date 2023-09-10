import { ChatGPTResponse } from "./chatgpt_response.type";

export interface BookmarkDataStorageProps {
  /**
   * This function will be called when the modal is closed
   * and return ChatGPTResponse
   *
   */
  onResponse?: (data: ChatGPTResponse) => void;
}
