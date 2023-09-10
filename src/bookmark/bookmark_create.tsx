import { useState } from "react";
import BookmarkDataStorage from "./bookmark_datastorage";
import { BookmarkForm } from "./bookmark_form";
import { CreateBookmarkProps } from "./types/bookmark.types";
import { ChatGPTResponse } from "./types/chatgpt_response.type";


function CreateBookmark(properties: CreateBookmarkProps){
  // get information about keys
  const [chatgptResponse, setChatgptResponse] = useState<ChatGPTResponse | undefined>(undefined);
  
  if (chatgptResponse) {
    return <BookmarkForm 
      onClose={properties.onClose} 
      onResponse={onChatGPTResponse} 
      chatgptResponse={chatgptResponse} 
      />;
  }
  return <BookmarkDataStorage onResponse={onChatGPTResponse} />;

  /**
   * This is an event that will be fired when the bookmark data storage finishes executing
   * with the aim of obtaining the chatgpt response of this web page
   * this allows the bookmark creation form to be displayed
   * @param response {ChatGPTResponse}
   */
  function onChatGPTResponse(response?: ChatGPTResponse): void {
    setChatgptResponse(response);
  }
}

export default CreateBookmark;