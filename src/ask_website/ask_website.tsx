import { useEffect, useState } from 'react';
import ChatMessage from './message/message';
import { Message } from './message/message.types';
import { FidgetSpinner } from 'react-loader-spinner';
import { ChatGPTController } from '../bookmark/controllers/chatgpt.controller';
import { AskwebsiteController } from './controllers/askwebsite.controller';
// css 
import './css/ask_website.css';

/**
 * AskWebsite
 * 
 * @returns {JSX.Element}
 */
export function AskWebsite(): JSX.Element{
  /**
   * Welcome message from bot
   */
  useEffect(() => {
    setIsLoading(true);
    ChatGPTController.getApiKey().then((apiKey) => {
      const _askWebsite = new AskwebsiteController(apiKey);
      setAskwebsiteController(_askWebsite);
      _askWebsite.createNewChat().then((response) => {
        setIsLoading(false);
      }, onError);
    }, onError);
  }, []);

  
  const welcomeMessage = "Hello, I'm bot. How can I help you?";

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMessageLoading, setIsMessageLoading] = useState<boolean>(false);

  const [askWebsite, setAskwebsiteController] = useState<AskwebsiteController|undefined>(undefined);

  
  const [error, setError] = useState<string|undefined>(undefined);
  
  /** messageTxt */
  const [messageTxt, setMessageTxt] = useState<string>('');

  /**
   * Chats messages list
   */
  const [messages, setMessages] = useState<Message[]>([]);
  
  if(isLoading){
    return <div className='loading-askme'>
      <div className="loading">
        <h1> Ask me </h1>
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
    </div>
  }
  else if (error) {
    return <div>
      <h1>Ups, Sorry </h1>
      <p>{error}</p>
      <button onClick={() => tryAgain()} className="btn">Try again</button>
    </div>
  }
  return <div className="ask-website">
    <div className="chat">
      <ChatMessage username="bot" message={welcomeMessage} />
      {messages.map((message, index) => {
        return <ChatMessage key={index} username={message.username} message={message.message} />
      })}
    </div>
    <form onSubmit={onSubmit}>
      <div className="input-box">
          <input 
            type="text" 
            id="message-input" 
            placeholder="Write your message..." 
            value={messageTxt} 
            onChange={onChangeMessageTxt} 
            disabled={isMessageLoading}
          />
          <button id="send-button" type='submit' disabled={isMessageLoading}>Enviar</button>
      </div>
    </form>
  </div>
  /**
   * Event on change message text
   * @param event {React.ChangeEvent<HTMLInputElement>}
   */
  function onChangeMessageTxt(event: React.ChangeEvent<HTMLInputElement>){
    setMessageTxt(event.target.value);
  }

  /**
   * Event on submit form
   * @param event {React.FormEvent<HTMLFormElement>}
   */
  function onSubmit(event: React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    if(messageTxt){
      messages.push({username: 'user', message: messageTxt});
      setMessages(messages);
      setIsMessageLoading(true);
      setMessageTxt('');
      if(askWebsite){
        askWebsite.sendMessage(
          "",
          "",
          messageTxt
        ).then((response) => {
          const responseBot: Message = {
            username: 'bot',
            message: response.text
          };
          messages.push(responseBot);
          setMessages(messages);
          setIsMessageLoading(false);
        });
      }
      else{
        setIsMessageLoading(false);
      }

    }
  }
  function tryAgain(){
    setError(undefined);
    ChatGPTController.getApiKey().then((apiKey) => {
      const _askWebsite = new AskwebsiteController(apiKey);
      setAskwebsiteController(_askWebsite);
      _askWebsite.createNewChat().then((response) => {
        setIsLoading(false);
      }, onError);
    }, onError);
  }

  function onError(error: any){
    console.log(error);
    setIsLoading(false);
    setError("Error: " + error  + ", Please try again");
  }


}