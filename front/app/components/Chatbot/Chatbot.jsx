import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { FaWindowClose, FaRedo, FaHandPointer, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import { chats } from "../../utils/chats";
import { ChatBotLogic } from "../../utils/ChatBotLogic";
import { ResizeBar } from "../ResizeBar/ResizeBar";
import { useCart } from "../../context/CartContext";
import api from "../../services/api";

export const Chatbot = () => {
  const { cart, addToCart, clearCart, completeOrder } = useCart();
  const messagesEndRef = useRef(null);
  const chatRef = useRef(null);
  const navigate = useNavigate();
  const [chatWidth, setChatWidth] = useState(540);
  const [chatHeight, setChatHeight] = useState(null);
  const [botEvent, setBotEvent] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [sound, setSound] = useState(true);
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showTooltip, setShowTooltip] = useState(true);
  
  const chatbotRef = useRef(
    new ChatBotLogic({ 
      chats,
      delayResponse: 1000,
      timeOpen: 8,
      timeClose: 24,
      sound,
      navigate,
      messages,
      setMessages,
      cart,
      setBotEvent,
    })
  );
  const chatbot = chatbotRef.current;

  const toggleChat = () => setIsOpen(!isOpen);

  const toggleSound = () => {
    chatbot.sound = !sound;
    setSound(!sound)
  } 

  const resetChat = () => {
    chatbot.initChatBot();
  };

  const handleUserInput = async (value) => {
    chatbot.userInput(value, navigate);
    setUserMessage("");
  };

  const handleUserMessageChange = (e) => setUserMessage(e.target.value);

  const showOptions = (message) => message.sender === "bot" && message.options && message.options.length > 0 && !message.disabled;

  useEffect(() => {
    if (cart.items.length) {
      if (!isOpen) setIsOpen(true) 
      chatbot.notifyCartChange()
    }
    chatbot.update(cart)
  }, [cart]);
  
  
  useEffect(() => {
    switch (botEvent.action) {
      case "addToCart":
        addToCart(...botEvent.payload)
        break;
      case "clearCart":
        clearCart();
        break;
      case "completeOrder":
        completeOrder()
        break;
    }
  }, [botEvent]);
    
  useEffect(() => {
    if (messagesEndRef.current)
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    api.products.get().then(res => {
      chatbot.products = res.data;
      chatbot.initChatBot();
    })
    const timer = setTimeout(() => setShowTooltip(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <div
        className="fixed bottom-5 right-7 cursor-pointer transition duration-200 animate-bounce"
        onClick={toggleChat}
        data-tooltip-content="Abrir chat"
        data-tooltip-id="chatbot-tooltip"
      >
        {!isOpen && (
          <>
            {showTooltip && (
              <div className="absolute bottom-24 right-6 w-64 bg-gray-900 text-white text-s rounded-lg p-3 shadow-lg">
                ¡Hola! Estoy aquí para ayudarte. 😊
                <div className="absolute bottom-[-6px] right-4 w-3 h-3 bg-gray-900 transform rotate-45"></div>
              </div>
            )}
            <img className="h-28 rounded-full" src="/img/bot.png" />
            <Tooltip id="chatbot-tooltip" place="left" />
          </>
        )}
      </div>

      {isOpen && (
        <div
          ref={chatRef}
          className="fixed bottom-4 right-3 shadow-2xl rounded-md overflow-hidden z-30 p-5 flex flex-col bg-slate-100"
          style={{ width: chatWidth, height: chatHeight || "96%", maxWidth: "95%", maxHeight: "97%", userSelect: "none" }}
        >
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg text-blue-950 font-semibold">
              Chatea con nuestro chatbot
            </h3>
            <div>
              <button className="text-xl text-blue-950 hover:text-gray-800 mr-3" onClick={toggleSound}>
                {sound ? <FaVolumeUp /> : <FaVolumeMute />}
              </button>
              <button
                className="text-xl text-blue-950 hover:text-gray-800 mr-3"
                onClick={resetChat}
                data-tooltip-content="Reiniciar chat"
                data-tooltip-id="reset-tooltip"
              >
                <FaRedo />
                <Tooltip id="reset-tooltip" place="left" />
              </button>
              <button
                className="text-xl text-blue-950 hover:text-gray-800"
                onClick={toggleChat}
                data-tooltip-content="Cerrar chat"
                data-tooltip-id="close-tooltip"
              >
                <FaWindowClose />
                <Tooltip id="close-tooltip" place="left" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto mb-4 space-y-3">
            {messages.map((message, index) => (
              <div key={index}>
                <div className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`p-3 py-2 rounded-lg max-w-[85%] font-medium ${message.sender === "user" ? "bg-blue-950 text-white" : "bg-slate-400 text-white"}`}>
                    <img className="h-8 rounded-full inline mr-2" src={`/img/${message.sender}.png`}/>
                    {message.bot_text || "..."}
                  </div>
                </div>
                {showOptions(message) && (
                  <div className="flex-col justify-end ">
                    <div className="mt-2 grid justify-end ">
                      {message.options.map((option, idx) => (
                        <button
                          key={idx}
                          className={`${option.bg || 'bg-orange-500'} text-white p-2 rounded-lg m-1 font-medium`}
                          onClick={() => handleUserInput(option.user_input)}
                        >
                          {option.user_input}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-end m-1 mt-2 animate-bounce text-gray-500">
                      Escriba en el chat o elija una opción{" "}
                      <FaHandPointer className="m-1 ml-2 " />
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>

          <div className="flex items-center">
            <input
              type="text"
              className="border rounded-lg p-2 w-full mr-2"
              value={userMessage}
              onChange={handleUserMessageChange}
              placeholder="Escribe un mensaje..."
              onKeyDown={(e) => { if (e.key === "Enter") handleUserInput(userMessage) }}
            />
            <button
              className={`${!userMessage.trim() ? "bg-orange-200" : "bg-orange-500"} text-white p-2 rounded-lg`}
              onClick={() => handleUserInput(userMessage)}
              disabled={!userMessage.trim()}
            >
              Enviar
            </button>
          </div>

          <ResizeBar typeBar={"height"} minpx={300} max={0.97} setChatHeight={setChatHeight} chatRef={chatRef} />
          <ResizeBar typeBar={"width"} minpx={350} maxpx={1300} max={0.95} setChatWidth={setChatWidth} chatRef={chatRef} />
        </div>
      )}
    </div>
  );
};