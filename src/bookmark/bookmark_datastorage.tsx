import { useEffect, useState } from "react";
import { FidgetSpinner } from 'react-loader-spinner';
import { ChatGPTController } from "./controllers/chatgpt.controller";
import { RedabilityController } from "./controllers/readability.controller";
import { BookmarkDataStorageProps } from "./types/bookmark_data_storage.types";
import { ChatGPTResponse } from "./types/chatgpt_response.type";
import { ReadabilityResponse } from "./types/readability_response.types";

/**
 * 
 * BookmarkDataStorage
 * This component is responsible for obtaining the information of the current web page
 * and send it to the ChatGPT API
 * and then send the response to the parent component
 * @param props {BookmarkDataStorageProps}
 * @returns {JSX.Element}
 */
const promptStorage = "Please forget all prior prompts. I want you to become an Expert summarizing content. Your goal is to help me get context for my website bookmarks. Please follow the following process, you will provide four different responses, each on double space clearly separated paragraphs: First a 100 character high level summary of the content. Second, a 300 character detailed summary of the content in double space bullet points. Third provide today's date and time. Fourth a rating 1 to 10 based of the accuracy of the previous step-by-step summary. Please do not include any apology on your response, just straight to the facts of what can be provided. Thank you. ";

/**
 * 
 * @param props {BookmarkDataStorageProps}
 * @returns {JSX.Element}
 */
function BookmarkDataStorage(props: BookmarkDataStorageProps): JSX.Element{
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string|undefined>(undefined);
  useEffect(() => {
    getPageResumen();
  });
  if (error) {
    return <div>
      <h1>Ups, Sorry </h1>
      <p>{error}</p>
      <button onClick={() => tryAgain()} className="btn">Try again</button>
    </div>
  }
  else if (isLoading) {
    return (
      <div className="loading">
        <h1>Bookmark Data Storage</h1>
        <FidgetSpinner
          visible={true}
          height="80"
          width="80"
          ariaLabel="dna-loading"
          wrapperStyle={{}}
          wrapperClass="dna-wrapper"
          ballColors={['#D9D9D9', '#6B6B6B', '#B0B0B0']}
          backgroundColor="#FFFFFF"
        />
        <p>Getting information about API ChatGPT </p>
      </div>
    )
  }
  return(
    <div>
        <h1>Bookmark Data Storage</h1>
    </div>
  )
  /**
   * Get page resumen
   * This function is responsible for obtaining the information of the current web page
   * and send it to the ChatGPT API
   * and then send the response to the parent component
   * @returns void
   */
  function getPageResumen(): void {
    // get content html tabs
    RedabilityController.getContentHtmlTabs(promptStorage).then((readabilityResponse: ReadabilityResponse) => {
      // get api key
      ChatGPTController.getApiKey().then((apiKey) => {
        // get chatgpt response
        ChatGPTController.getChatgptResponse(
          readabilityResponse.url,
          readabilityResponse.title,
          apiKey, 
          readabilityResponse.content,
        ).then((response: ChatGPTResponse) => {
          setIsLoading(false);
          if(props.onResponse){
            props.onResponse(response);
          }
        }, onError);
      }, onError);
    }, onError);
  }
  /**
   * Delete cookies, 
   * try to get the api key again
   */
  function tryAgain(): void {
    setError(undefined);
    setIsLoading(true);
    ChatGPTController.deleteApiKey().then(() => {
      getPageResumen();
    });
  }
  /**
   * Manage error
   * @param error {any}
   * @returns void
   */
  function onError(error: any): void {
    setIsLoading(false);
    setError("Error: " + error  + ", Please try again");
  }
}
export default BookmarkDataStorage;