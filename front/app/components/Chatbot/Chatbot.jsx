import { useState, useEffect } from 'react';
import { chats } from './chats';

export const Chatbot = () => {
  const buildChatBot = () => {
    chats.forEach(chat => {
      chat.options = chats.filter(c => c.id_parent === chat.id);
    })
  }
  buildChatBot();
  
  const root = chats.find(c=>c.root);
  const [isOpen, setIsOpen] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [currentNode, setCurrentNode] = useState(root);
  const [messages, setMessages] = useState([{ sender: 'bot', ...root }]);

  setTimeout(() => {
    setIsOpen(true)
  }, 3000)

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  const showOptions = (message) => {
    return message.sender === 'bot' && message.options && !message.disabled
  }

  const handleUserMessageChange = (e) => {
    setUserMessage(e.target.value);
  };
  
  const addMessage = (message) => {
    setMessages((prevMessages) => {
      prevMessages.forEach(m => m.disabled = true)
      return [...prevMessages, message];
    });
  }

  const userInput = (select) => {
    const value = select || userMessage;
    if (value.trim() === '') return;
    addMessage({ sender: 'user', text: value })
    let nextNode = chats.find((chat) => chat.answer === value);
    setUserMessage('');
    
    if (nextNode) {
      if (nextNode.action) nextNode.action();
      addMessage({ sender: 'bot', ...nextNode})
      setCurrentNode(nextNode);
    } else if (currentNode.type === "input") {
      addMessage({ sender: 'bot', ...currentNode, text: 'Gracias por tu información.' })
    } else {
      setCurrentNode(root);
      addMessage({ sender: 'bot', ...currentNode, text: "Lo siento, no puedo entender tu mensaje. ¿En qué puedo ayudarte?" })
    }
  }
  
  const handleUserMessage = () => {
    userInput(false)
  };
  
  const handleUserSelect = (select) => {
    userInput(select)
  };


  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].sender === 'user') {
      const delayBot = 1000;
      setTimeout(() => {
        if (currentNode.type === "select") {
          addMessage({ sender: 'bot', ...currentNode})
        } else if (currentNode.type === "input") {
          addMessage({ sender: 'bot', ...currentNode })
        }
      }, delayBot);
    }
  }, [messages, currentNode]);

  return (
    <div>
      <div
        className="fixed bottom-5 right-5 bg-blue-500 text-white p-4 rounded-full shadow-lg cursor-pointer hover:bg-blue-600 transition duration-200"
        onClick={toggleChat}
        title={isOpen ? 'Cerrar chat' : 'Abrir chat'}
      >
        {isOpen ? 'Cerrar' : 'Chat'}
      </div>

      {isOpen && (
        <div className="fixed bottom-4 right-4 top-4 w-80 md:w-96 lg:w-2/5 bg-white shadow-lg rounded-lg p-5 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Chatea con nosotros</h3>
            <button
              className="text-xl text-gray-500 hover:text-gray-800"
              onClick={toggleChat}
            >
              X
            </button>
          </div>

          <div className="flex-1 overflow-y-auto mb-4 space-y-3">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-lg max-w-xs ${message.sender === 'user' ? 'bg-blue-800 text-white' : 'bg-gray-200 text-black'}`}>
                  {message.text || '...'}
                  {showOptions(message) && (
                    <div className="mt-2">
                      {message.options.map((option, idx) => (
                        <button key={idx} className="bg-blue-500 text-white p-2 rounded-lg m-1" onClick={() => handleUserSelect(option.answer)}>
                          {option.answer}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center">
            <input
              type="text"
              className="border rounded-lg p-2 w-full mr-2"
              value={userMessage}
              onChange={handleUserMessageChange}
              placeholder="Escribe un mensaje..."
            />
            <button
              className={`${!userMessage.trim() ? 'bg-orange-200' : 'bg-orange-500'}  text-white p-2 rounded-lg`}
              onClick={handleUserMessage}
              disabled={!userMessage.trim()}
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};