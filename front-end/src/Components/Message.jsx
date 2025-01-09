import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Message.css";

const Message = () => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [receiverId, setReceiverId] = useState(""); 
  const userId = 1; 

  
  useEffect(() => {
    if (receiverId) {
      axios
        .get(`https://employee-management-system-9jz6.onrender.com/messages/${userId}/${receiverId}`)
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
  }, [receiverId]); 

 
  const sendMessage = () => {
    if (messageText.trim() !== "") {
      axios
        .post(`https://employee-management-system-9jz6.onrender.com/messages/send`, {
          sender_id: userId,
          receiver_id: receiverId,
          message_text: messageText,
        })
        .then((res) => {
          if (res.data.Status) {
            setMessages((prev) => [
              ...prev,
              {
                sender_id: userId,
                receiver_id: receiverId,
                message_text: messageText,
                timestamp: new Date().toISOString(),
              },
            ]);
            setMessageText(""); 
          } else {
            alert("Message failed to send");
          }
        })
        .catch((error) => {
          console.error(
            "Error sending message:",
            error.response ? error.response.data : error.message
          );
          console.log("Detailed Error:", error.response?.data); 
          alert("Error sending message");
        });
    }
  };

  return (
    <div className="message-container border-0 bg-dark text-white">
      <div className="message-list bg-dark text-dark width-fit" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className=  {`message-item ${
              msg.sender_id === userId ? "sent" : "received"
            }`}
          >
            <p>{msg.message_text}</p>
            <small>{new Date(msg.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </div>

      <div className="message-input bg-white rounded-top d-flex align-items-center position-fixed bottom-0 custom-width p-20 m-10">
        <input 
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type a message..."
          className="form-control me-2 w-75 border-none "
        />
        <button className="btn btn-success rounded-md p-20 " onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Message;
