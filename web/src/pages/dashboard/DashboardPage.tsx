import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const DashboardPage: React.FC = () => {
  const { walletAddress } = useAuth();
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI assistant. How can I help you today?", sender: "bot" }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (inputText.trim()) {
      setMessages([...messages, { text: inputText, sender: "user" }]);
      setInputText("");
      // Simulate bot typing and response
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          text: "I'm an AI assistant. I notice you're connecting from wallet: " +
            `${walletAddress?.slice(0, 6)}...${walletAddress?.slice(-4)}. How else may I help you?`,
          sender: "bot"
        }]);
      }, 2000);
    }
  };

  return (
    <div className="mt-10 md:mt-0 w-full h-full bg-gray-50 flex flex-col ">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mx-2 ${message.sender === 'user' ? 'bg-blue-500' : 'bg-emerald-500'
                }`}>
                {message.sender === 'user' ? '👤' : '🤖'}
              </div>
              <div className={`rounded-2xl px-4 py-3 ${message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
                }`}>
                <p className="text-sm sm:text-base">{message.text}</p>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
              🤖
            </div>
            <div className="bg-gray-100 rounded-full px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="w-full py-10 px-5">
        <div className="flex gap-4 max-w-6xl mx-auto">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Message AI assistant..."
            className="flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};