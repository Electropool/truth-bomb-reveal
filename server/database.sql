
-- Create database
CREATE DATABASE IF NOT EXISTS dare_messages;
USE dare_messages;

-- Create dares table
CREATE TABLE IF NOT EXISTS dares (
  id VARCHAR(255) PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id VARCHAR(255) PRIMARY KEY,
  dare_id VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  sender_ip VARCHAR(45) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dare_id) REFERENCES dares(id) ON DELETE CASCADE,
  UNIQUE KEY unique_dare_ip (dare_id, sender_ip)
);

-- Create indexes for better performance
CREATE INDEX idx_messages_dare_id ON messages(dare_id);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);
