import { Bookmark } from "../models/bookmark.models";
import { ChatGPTResponse } from "./chatgpt_response.type";

export interface CreateBookmarkProps {
  /**
   * this function will be called when the modal is closed
   * @param bookmark
   * @returns
   */
  onClose?: (bookmark: Bookmark) => void;

  /**
   * chatgpt response
   * @type {ChatGPTResponse}
   */
  chatgptResponse?: ChatGPTResponse;
}
export interface BookmarkListProps {
  show: boolean;
  bookmarks: Bookmark[];
}

export interface SettingsProps {
  navigator: string;
}
