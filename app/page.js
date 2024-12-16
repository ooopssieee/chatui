"use client";
import React, { useState, useEffect } from "react";
import { FiSend } from "react-icons/fi"; 
import ReactMarkdown from "react-markdown"; 
import "./ChatInterface.css"; 

const ChatInterface = ({ messagesProp = [] }) => {
  const [messages, setMessages] = useState(messagesProp);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    if (!storedUserId) {
      const newUserId = `user-${Math.floor(Math.random() * 10000)}`;
      localStorage.setItem("userId", newUserId);
      setUserId(newUserId);
    } else {
      setUserId(storedUserId);
    }
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim() && userId) {
      try {
        const response = await fetch("http://nxmtxb.duckdns.org:5000/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: newMessage,
            user_id: userId,
          }),
        });

        console.log("Server response:", response);

        if (!response.ok) {
          throw new Error("Failed to fetch response from the server.");
        }

        const data = await response.json();
        console.log("Parsed response data:", data);

        const serverMessage = data.message; 

        setMessages([
          ...messages,
          { text: newMessage, sender: "user" },
          { text: serverMessage, sender: "server" },
        ]);

        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender}`}
            style={{
              textAlign: msg.sender === "user" ? "right" : "left",
            }}
          >
            <div className="message-content">
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>

      <div className="message-input-container">
        <input
          type="text"
          className="message-input"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className="send-button" onClick={handleSendMessage}>
          <FiSend />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
