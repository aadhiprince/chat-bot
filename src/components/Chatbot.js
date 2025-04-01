import { useState } from "react";
import axios from "axios";
import "./Chatbot.css";

function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY; // Ensure .env.local is set

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { sender: "user", message: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    try {
      console.log("Using Gemini API Key:", API_KEY);

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
        {
          contents: [{ role: "user", parts: [{ text: input }] }]
        },
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      console.log("Gemini API Response:", response.data);

      const botMessageText =
        response.data?.candidates?.[0]?.content || "No valid response from Gemini.";

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", message: botMessageText }
      ]);
    } catch (error) {
      console.error("Error fetching response:", error);

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", message: `Error: ${error.message}` }
      ]);
    }
  }

  return (
    <div className="chatbot-container">
      <h2 className="chatbot-title">ChatBot</h2>

      <div className="message-container">
        {messages.map((msg, index) => (
          <p key={index} className={`message ${msg.sender}-message`}>
            {msg.message.split("\n").map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </p>
        ))}
      </div>

      <div className="input-container">
        <input
          className="message-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
