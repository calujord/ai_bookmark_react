import { useEffect, useState } from "react";
import { FidgetSpinner } from 'react-loader-spinner';
import { ChatGPTController } from "./controllers/chatgpt.controller";
import { RedabilityController } from "./controllers/readability.controller";
import { BookmarkDataStorageProps } from "./types/bookmark_data_storage.types";
import { ChatGPTResponse } from "./types/chatgpt_response.type";
import { ReadabilityResponse } from "./types/readability_response.types";


function BookmarkDataStorage(props: BookmarkDataStorageProps){
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string|undefined>(undefined);
  useEffect(() => {
    getPageResumen();
  });
  if (error) {
    return <div>
      <h1>Ups, Sorry </h1>
      <p>We have an error, try again</p>
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
  function getPageResumen(): void {
    // get content html tabs
    RedabilityController.getContentHtmlTabs().then((readabilityResponse: ReadabilityResponse) => {
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

  function onError(error: any): void {
    setError("Error: " + error  + ", Please try again");
    setIsLoading(false);
  }


  
}
export default BookmarkDataStorage;