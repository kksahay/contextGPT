import { useState, useRef, useEffect } from "react";
import React from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { io } from "socket.io-client";
import { useModel } from "../context/ModelContext";

function ChatMessage({message}) {
  if (message.role === "assistant" || message.author === '1') {
    return (
      <div className="col-start-1 col-end-8 p-3 rounded-lg">
        <div className="flex flex-row items-center">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
            A
          </div>
          <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl text-left">
            <ReactMarkdown className="prose" remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    );
  } else if (message.role === "user" || message.author === '0') {
    return (
      <div className="col-start-6 col-end-13 p-3 rounded-lg">
        <div className="flex items-center justify-start flex-row-reverse">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-500 flex-shrink-0">
            U
          </div>
          <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl text-left">
            <div className='prose'>{message.content}</div>
          </div>
        </div>
      </div>
    );
  }
}

function Chatbot() {
  const {model} = useModel();
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [socket, setSocket] = useState(io());

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history]);
  
  const chatRequest = async (message) => {
    try {
      socket.emit('sendMessage', message);
    } catch (error) {
      console.error("Failed to send chat history:", error);
    }
  }
  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("history"));
    if(data && data.length > 0) {
      setHistory(data);
    }
    const socket = io(`${import.meta.env.VITE_BASE_URL}/api/chat`);
    setSocket(socket);
    socket.emit('session', model, data);
    socket.on("response", (conversationHistory) => {
      setHistory([...history, ...conversationHistory]);
      sessionStorage.setItem("history", JSON.stringify(conversationHistory));
    });
    return () => {
      socket.off("response");
    };
  }, [])
  
  return (
    <div className="flex h-screen antialiased text-gray-800">
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        <div className="flex flex-col flex-auto h-full p-6 ">
          <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
            <div className="flex flex-col h-full overflow-x-auto mb-4">
              <div className="grid grid-cols-12 gap-y-2">
                {history.map((message, idx) => (
                  <ChatMessage message={message} key={idx} />
                ))}
                <div ref={chatEndRef}></div>
              </div>
            </div>
            <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
              <div className="flex-grow ml-4">
                <div className="relative w-full">
                  <input
                    type="text"
                    className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const newMessage = {
                          content: input,
                          role: "user",
                        };
                        setHistory([...history, newMessage]);
                        chatRequest(input);
                        setInput("");
                      }
                    }}
                  />
                </div>
              </div>
              <div className="ml-4">
                <button
                  className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
                  onClick={() => {
                    const newMessage = {
                      content: input,
                      role: "user",
                    };
                    setHistory([...history, newMessage]);
                    setInput("");
                    chatRequest([...history, newMessage], botState);
                  }}
                >
                  <span>Send</span>
                  <span className="ml-2">
                    <svg
                      className="w-4 h-4 transform rotate-45 -mt-px"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      ></path>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> 
  );
}

export default Chatbot;
