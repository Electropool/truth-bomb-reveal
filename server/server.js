
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dare_messages'
};

let db;

// Initialize database connection
async function initDB() {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database');
    
    // Create tables if they don't exist
    await createTables();
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

// Create necessary tables
async function createTables() {
  const createDaresTable = `
    CREATE TABLE IF NOT EXISTS dares (
      id VARCHAR(255) PRIMARY KEY,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  const createMessagesTable = `
    CREATE TABLE IF NOT EXISTS messages (
      id VARCHAR(255) PRIMARY KEY,
      dare_id VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      sender_ip VARCHAR(45) NOT NULL,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (dare_id) REFERENCES dares(id) ON DELETE CASCADE,
      UNIQUE KEY unique_dare_ip (dare_id, sender_ip)
    )
  `;

  await db.execute(createDaresTable);
  await db.execute(createMessagesTable);
  console.log('Database tables created successfully');
}

// Get client IP address
function getClientIP(req) {
  return req.headers['x-forwarded-for'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null);
}

// Routes

// Create a new dare
app.post('/api/dares', async (req, res) => {
  try {
    const dareId = uuidv4();
    await db.execute('INSERT INTO dares (id) VALUES (?)', [dareId]);
    res.json({ dareId, success: true });
  } catch (error) {
    console.error('Error creating dare:', error);
    res.status(500).json({ error: 'Failed to create dare' });
  }
});

// Check if dare exists
app.get('/api/dares/:dareId', async (req, res) => {
  try {
    const { dareId } = req.params;
    const [rows] = await db.execute('SELECT id FROM dares WHERE id = ?', [dareId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Dare not found' });
    }
    
    res.json({ exists: true });
  } catch (error) {
    console.error('Error checking dare:', error);
    res.status(500).json({ error: 'Failed to check dare' });
  }
});

// Send a message to a dare
app.post('/api/dares/:dareId/messages', async (req, res) => {
  try {
    const { dareId } = req.params;
    const { message } = req.body;
    const senderIP = getClientIP(req);

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if dare exists
    const [dareRows] = await db.execute('SELECT id FROM dares WHERE id = ?', [dareId]);
    if (dareRows.length === 0) {
      return res.status(404).json({ error: 'Dare not found' });
    }

    // Check if this IP already sent a message for this dare
    const [existingMessages] = await db.execute(
      'SELECT id FROM messages WHERE dare_id = ? AND sender_ip = ?',
      [dareId, senderIP]
    );

    if (existingMessages.length > 0) {
      return res.status(409).json({ error: 'You have already sent a message for this dare' });
    }

    const messageId = uuidv4();
    await db.execute(
      'INSERT INTO messages (id, dare_id, message, sender_ip) VALUES (?, ?, ?, ?)',
      [messageId, dareId, message.trim(), senderIP]
    );

    res.json({ 
      success: true, 
      messageId,
      message: 'Message sent successfully' 
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get all messages for a dare
app.get('/api/dares/:dareId/messages', async (req, res) => {
  try {
    const { dareId } = req.params;

    // Check if dare exists
    const [dareRows] = await db.execute('SELECT id FROM dares WHERE id = ?', [dareId]);
    if (dareRows.length === 0) {
      return res.status(404).json({ error: 'Dare not found' });
    }

    const [messages] = await db.execute(
      'SELECT id, message, timestamp FROM messages WHERE dare_id = ? ORDER BY timestamp DESC',
      [dareId]
    );

    res.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Delete a dare and all its messages
app.delete('/api/dares/:dareId', async (req, res) => {
  try {
    const { dareId } = req.params;
    
    await db.execute('DELETE FROM dares WHERE id = ?', [dareId]);
    res.json({ success: true, message: 'Dare deleted successfully' });
  } catch (error) {
    console.error('Error deleting dare:', error);
    res.status(500).json({ error: 'Failed to delete dare' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
