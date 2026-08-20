import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  FaRobot,
  FaTimes,
  FaPaperPlane,
  FaHeart,
} from "react-icons/fa";

import "./AIAssistant.css";

const API_URL = "https://weddingbloom-production.up.railway.app/api";
function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hello! 👋 I'm Wedding Bloom AI. How can I help you with your wedding planning?",
    },
  ]);

  const handleSend = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    const newMessage = {
      id: Date.now(),
      sender: "user",
      text: trimmedMessage,
    };

    setMessages((previous) => [
      ...previous,
      newMessage,
    ]);

    setMessage("");

    try {
      const response = await fetch(
        "https://weddingbloomai-production.up.railway.app/api/ai",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            message: trimmedMessage,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "AI response failed."
        );
      }

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: data.reply,
        },
      ]);

    } catch (error) {
      console.error("AI Assistant Error:", error);

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: "Sorry, I couldn't generate a response.",
        },
      ]);
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !loading) {
      handleSend();
    }
  };

  return (
    <>
      {/* =========================
          FLOATING AI BUTTON
      ========================= */}

      {!isOpen && (
        <button
          className="ai-floating-button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Wedding Bloom AI"
        >
          <FaRobot />

          <span className="ai-floating-heart">
            <FaHeart />
          </span>
        </button>
      )}

      {/* =========================
          AI CHAT WINDOW
      ========================= */}

      {isOpen && (
        <div className="ai-assistant">

          {/* HEADER */}

          <div className="ai-header">

            <div className="ai-header-info">

              <div className="ai-avatar">
                <FaRobot />
              </div>

              <div>
                <h3>
                  Wedding Bloom AI
                </h3>

                <span>
                  Your wedding planning assistant
                </span>
              </div>

            </div>

            <button
              className="ai-close-button"
              onClick={() => setIsOpen(false)}
              aria-label="Close AI Assistant"
            >
              <FaTimes />
            </button>

          </div>


          {/* MESSAGES */}

          <div className="ai-messages">

            {messages.map((item) => (
              <div
                key={item.id}
                className={`ai-message-row ${item.sender === "user"
                    ? "user-message"
                    : "assistant-message"
                  }`}
              >

                {item.sender === "ai" && (
                  <div className="ai-small-avatar">
                    <FaRobot />
                  </div>
                )}

                <div className="ai-message-bubble">
                  {item.sender === "ai" ? (
                    <ReactMarkdown>
                      {item.text.replace(/\\\|/g, "|")}
                    </ReactMarkdown>
                  ) : (
                    item.text
                  )}
                </div>
              </div>
            ))}


            {/* AI LOADING MESSAGE */}

            {loading && (
              <div className="ai-message-row assistant-message">

                <div className="ai-small-avatar">
                  <FaRobot />
                </div>

                <div className="ai-message-bubble">
                  Thinking... 💕
                </div>

              </div>
            )}

          </div>


          {/* INPUT */}

          <div className="ai-input-area">

            <input
              type="text"
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask Wedding Bloom AI..."
              disabled={loading}
            />

            <button
              onClick={handleSend}
              disabled={!message.trim() || loading}
              aria-label="Send message"
            >
              <FaPaperPlane />
            </button>

          </div>

        </div>
      )}
    </>
  );
}

export default AIAssistant;