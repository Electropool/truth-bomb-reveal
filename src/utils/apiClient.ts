
// API client for communicating with the backend server

// In production, try to auto-detect the API URL if not set
const getApiUrl = (): string => {
  // Check if we have an explicit API URL set
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // In production, use the same domain with /api path
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `${window.location.protocol}//${window.location.host}/api`;
  }
  
  // Fallback to localhost for development
  return 'http://localhost:3001/api';
};

const API_BASE_URL = getApiUrl();

export interface DareMessage {
  id: string;
  message: string;
  timestamp: string;
}

export interface ApiResponse<T> {
  success?: boolean;
  error?: string;
  data?: T;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    console.log('API Client initialized with URL:', this.baseUrl);
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    console.log('Making API request to:', url);
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      console.log('API response status:', response.status);
      
      const data = await response.json();
      console.log('API response data:', data);

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      console.error('Request URL:', url);
      console.error('Request config:', config);
      throw error;
    }
  }

  // Create a new dare
  async createDare(): Promise<{ dareId: string }> {
    return this.request<{ dareId: string }>('/dares', {
      method: 'POST',
    });
  }

  // Check if dare exists
  async checkDare(dareId: string): Promise<{ exists: boolean }> {
    return this.request<{ exists: boolean }>(`/dares/${dareId}`);
  }

  // Send a message to a dare
  async sendMessage(dareId: string, message: string): Promise<{ success: boolean; messageId: string }> {
    return this.request<{ success: boolean; messageId: string }>(`/dares/${dareId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // Get all messages for a dare
  async getMessages(dareId: string): Promise<{ messages: DareMessage[] }> {
    return this.request<{ messages: DareMessage[] }>(`/dares/${dareId}/messages`);
  }

  // Delete a dare
  async deleteDare(dareId: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/dares/${dareId}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

export const apiClient = new ApiClient();
