// src/components/Message.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const Message = () => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [receiverId, setReceiverId] = useState(""); // ID of the user to whom the message is sent
  const userId = 1; // Replace with the logged-in user’s ID

  // Fetch messages between the logged-in user and selected receiver
  useEffect(() => {
    if (receiverId) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/messages/${userId}/${receiverId}`)
        .then((res) => {
          if (res.data.Status) {
            setMessages(res.data.Messages);
          } else {
            alert("Failed to load messages");
          }
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });
    }
  }, [receiverId]); // Reload messages when the receiverId changes

  // Send a new message
  const sendMessage = () => {
    if (messageText.trim() !== "") {
      axios
        .post(`${process.env.REACT_APP_API_URL}/messages/send`, {
          sender_id: userId,
          receiver_id: receiverId,
          message_text: messageText,
        })
        .then((res) => {
          if (res.data.Status) {
            // Update messages locally to display the sent message immediately
            setMessages((prev) => [
              ...prev,
              {
                sender_id: userId,
                receiver_id: receiverId,
                message_text: messageText,
                timestamp: new Date().toISOString(),
              },
            ]);
            setMessageText(""); // Clear input field
          } else {
            alert("Message failed to send");
          }
        })
        .catch((error) => {
          console.error(
            "Error sending message:",
            error.response ? error.response.data : error.message
          );
          console.log("Detailed Error:", error.response?.data); // Log detailed error response
          alert("Error sending message");
        });
    }
  };

  return (
    <div className="message-container">
      {/* Message display */}
      <div className="message-list">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message-item ${
              msg.sender_id === userId ? "sent" : "received"
            }`}
          >
            <p>{msg.message_text}</p>
            <small>{new Date(msg.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </div>

      {/* Message input */}
      <div className="message-input">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Message;
