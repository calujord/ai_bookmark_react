import { Bookmark } from "../models/bookmark.models";
import { ChatGPTResponse } from "./chatgpt_response.type";

export interface BookmarkFormProps {
  /**
   * This function will be called when the modal is closed
   * and return ChatGPTResponse
   *
   */
  onResponse: (data?: ChatGPTResponse) => void;

  /**
   * onclose
   */
  onClose?: (data: Bookmark) => void;

  chatgptResponse?: ChatGPTResponse;
}
