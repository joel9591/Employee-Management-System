import express from "express";
import db from "../utils/db.js"; 


const router = express.Router();

// Route to send a message
router.post("/send", (req, res) => {
  const { sender_id, receiver_id, message_text } = req.body;

  // SQL query to insert a new message
  const sql = "INSERT INTO messages (sender_id, receiver_id, message_text) VALUES (?, ?, ?)";
  db.query(sql, [sender_id, receiver_id, message_text], (err, result) => {
      if (err) {
          console.error("Error sending message:", err); // Log full error
          return res.status(500).json({
              Status: false,
              Error: "Database error",
              Details: err.sqlMessage || err.message, // Include SQL error details if available
          });
      }
      res.status(200).json({ Status: true, Message: "Message sent successfully" });
  });
});

// Route to get messages for a specific user with another user
router.get("/:userId/:chatUserId", (req, res) => {
    const { userId, chatUserId } = req.params;

    // SQL query to fetch messages between two users
    const sql = `
        SELECT * FROM messages
        WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
        ORDER BY timestamp ASC
    `;
    db.query(sql, [userId, chatUserId, chatUserId, userId], (err, result) => {
        if (err) {
            console.error("Error fetching messages:", err);
            return res.status(500).json({ Status: false, Error: "Database error" });
        }
        res.status(200).json({ Status: true, Messages: result });
    });
});

export default router;
