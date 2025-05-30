import { apiClient } from './apiClient';

// Utility functions for dare website

// Generate a unique ID for user sessions (keeping for compatibility)
export const generateUniqueId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Store a new user session
export const createNewDare = async (): Promise<string> => {
  try {
    const response = await apiClient.createDare();
    const sessionId = response.dareId;
    const timestamp = new Date().toISOString();
    
    // Store in localStorage for user session tracking
    localStorage.setItem('myDareId', sessionId);
    localStorage.setItem('myDareCreatedAt', timestamp);
    
    return sessionId;
  } catch (error) {
    console.error('Error creating dare:', error);
    throw new Error('Failed to create dare. Please try again.');
  }
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

export const saveMessage = async (dareId: string, message: string): Promise<void> => {
  try {
    await apiClient.sendMessage(dareId, message);
  } catch (error) {
    console.error('Error saving message:', error);
    throw new Error('Failed to send message. Please try again.');
  }
};

// Get all messages for a specific dare
export const getMessages = async (dareId: string): Promise<DareMessage[]> => {
  try {
    const response = await apiClient.getMessages(dareId);
    return response.messages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

// Clear a dare session
export const clearDare = async (): Promise<void> => {
  const dareId = localStorage.getItem('myDareId');
  
  try {
    if (dareId) {
      await apiClient.deleteDare(dareId);
    }
  } catch (error) {
    console.error('Error deleting dare:', error);
  } finally {
    // Always clear localStorage
    localStorage.removeItem('myDareId');
    localStorage.removeItem('myDareCreatedAt');
  }
};

// Validate if a dare exists
export const validateDare = async (dareId: string): Promise<boolean> => {
  try {
    const response = await apiClient.checkDare(dareId);
    return response.exists;
  } catch (error) {
    console.error('Error validating dare:', error);
    return false;
  }
};

// Format a shareable URL for a dare
export const formatShareableUrl = (dareId: string): string => {
  return `${window.location.origin}/send/${dareId}`;
};
