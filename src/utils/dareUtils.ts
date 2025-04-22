
// Utility functions for dare website

// Generate a unique ID for user sessions
export const generateUniqueId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Store a new user session
export const createNewDare = (): string => {
  const sessionId = generateUniqueId();
  const timestamp = new Date().toISOString();
  
  // Store in localStorage
  localStorage.setItem('myDareId', sessionId);
  localStorage.setItem('myDareCreatedAt', timestamp);
  
  // Initialize empty messages array
  localStorage.setItem(`messages_${sessionId}`, JSON.stringify([]));
  
  return sessionId;
};

// Check if current user has an active dare
export const hasActiveDare = (): boolean => {
  return localStorage.getItem('myDareId') !== null;
};

// Get current user's dare ID
export const getMyDareId = (): string | null => {
  return localStorage.getItem('myDareId');
};

// Save a message to a specific dare
export interface DareMessage {
  id: string;
  message: string;
  timestamp: string;
}

export const saveMessage = (dareId: string, message: string): void => {
  const messagesKey = `messages_${dareId}`;
  const existingMessagesJSON = localStorage.getItem(messagesKey) || '[]';
  const existingMessages: DareMessage[] = JSON.parse(existingMessagesJSON);
  
  const newMessage: DareMessage = {
    id: generateUniqueId(),
    message,
    timestamp: new Date().toISOString()
  };
  
  existingMessages.push(newMessage);
  localStorage.setItem(messagesKey, JSON.stringify(existingMessages));
};

// Get all messages for a specific dare
export const getMessages = (dareId: string): DareMessage[] => {
  const messagesKey = `messages_${dareId}`;
  const messagesJSON = localStorage.getItem(messagesKey) || '[]';
  return JSON.parse(messagesJSON);
};

// Clear a dare session
export const clearDare = (): void => {
  const dareId = localStorage.getItem('myDareId');
  if (dareId) {
    localStorage.removeItem(`messages_${dareId}`);
  }
  localStorage.removeItem('myDareId');
  localStorage.removeItem('myDareCreatedAt');
};

// Format a shareable URL for a dare
export const formatShareableUrl = (dareId: string): string => {
  return `${window.location.origin}/send/${dareId}`;
};
