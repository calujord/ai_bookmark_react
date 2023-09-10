import { useState } from "react";
import { ChatGPTController } from "./controllers/chatgpt.controller";
import { RedabilityController } from "./controllers/readability.controller";
import { BookmarkDataStorageProps } from "./types/bookmark_data_storage.types";
import { ChatGPTResponse } from "./types/chatgpt_response.type";
import { ReadabilityResponse } from "./types/readability_response.types";
import { ScoreContent } from "./types/score_content.types";
import { FidgetSpinner } from  'react-loader-spinner'


function BookmarkDataStorage(props: BookmarkDataStorageProps){
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string|undefined>(undefined);
  getChromeStorage();
  if (error) {
    return <div>
      <p>{error}</p>
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
  function getChromeStorage(): void {
    ChatGPTController.getApiKey().then((apiKey) => {
      getContentHtmlTabs().then((readabilityResponse: ReadabilityResponse) => {
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
        });
      }, (error) => {
        setError(error);
        setIsLoading(false);
      });
    }, (error) => {
      setError(error);
      setIsLoading(false);
    });
  }
  async function getContentHtmlTabs(): Promise<ReadabilityResponse>{
    return new Promise((resolve, reject) => {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs: chrome.tabs.Tab[]) {
        console.log(tabs);
        if(tabs && tabs.length !== 0){
          RedabilityController.getContentByTabId(tabs[0].id!).then((document: Document) => {
            RedabilityController.getReadability(document).then((content: ScoreContent[]) => {
              RedabilityController.buildContentToChatGpt(content).then((content: string) => {
                return resolve({
                  content: content,
                  title: tabs[0].title!,
                  url: tabs[0].url!
                });
              });
            });
          });
        }          
        else{
          return reject("No active tab found");
        }
      });
    });
  }

  
}
export default BookmarkDataStorage;