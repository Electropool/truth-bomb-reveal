
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
    console.log('Creating new dare...');
    
    // First, test if the API is reachable with a health check
    try {
      await apiClient.healthCheck();
      console.log('API health check passed');
    } catch (healthError) {
      console.error('API health check failed:', healthError);
      throw new Error('Cannot connect to server. Please check if the backend is running.');
    }
    
    const response = await apiClient.createDare();
    const sessionId = response.dareId;
    const timestamp = new Date().toISOString();
    
    console.log('Dare created successfully:', sessionId);
    
    // Store in localStorage for user session tracking
    localStorage.setItem('myDareId', sessionId);
    localStorage.setItem('myDareCreatedAt', timestamp);
    
    return sessionId;
  } catch (error) {
    console.error('Error creating dare:', error);
    
    // Provide more specific error messages
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please check your internet connection.');
    }
    
    if (error.message.includes('Cannot connect to server')) {
      throw error; // Re-throw our custom health check error
    }
    
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
    console.log('Attempting to save message:', { dareId, messageLength: message.length });
    
    const response = await apiClient.sendMessage(dareId, message);
    console.log('Message save response:', response);
    
  } catch (error: any) {
    console.error('Error saving message:', error);
    
    // Check if it's a duplicate message error (409)
    if (error.message.includes('409') || error.message.includes('already sent')) {
      throw new Error('You have already sent a message for this dare');
    }
    
    // Check if it's a dare not found error (404)
    if (error.message.includes('404') || error.message.includes('not found')) {
      throw new Error('This dare link is invalid or has expired');
    }
    
    // Check if it's a connection error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please check your internet connection.');
    }
    
    // Generic error
    throw new Error(`Failed to send message: ${error.message}`);
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
    console.log('Validating dare:', dareId);
    const response = await apiClient.checkDare(dareId);
    console.log('Dare validation response:', response);
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
