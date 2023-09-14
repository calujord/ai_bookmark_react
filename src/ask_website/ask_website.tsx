import './css/ask_website.css';
export function AskWebsite(){
  return <div className="ask-website">
    <div className="chat">
        <div className="message received">
            <p>Hola, ¿cómo estás?</p>
        </div>
        <div className="message sent">
            <p>¡Hola! Estoy bien, ¿y tú?</p>
        </div>
    </div>
    <div className="input-box">
        <input type="text" id="message-input" placeholder="Escribe tu mensaje..." />
        <button id="send-button">Enviar</button>
    </div>
  </div>
}