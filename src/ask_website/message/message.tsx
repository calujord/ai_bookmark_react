import { MessageProperties } from "./message.types";

/**
 * Render message in chat
 * @param properties {MessageProperties}
 * @returns {JSX.Element}
 */
export function ChatMessage(properties: MessageProperties): JSX.Element{
  return <div className={`message sent ${properties.username === 'user' ? 'user' : 'bot'}`}>
    <div className={`row ${properties.username === 'user' ? 'user' : 'bot'}`}>
      <p className={`wrapper message-${properties.username}`}>{properties.message}</p>
    </div>
  </div>

}
export default ChatMessage;