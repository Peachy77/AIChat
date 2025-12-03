import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export interface ChatRoom {
  id: number;
  name?: string;
  createdAt?: string;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export const chatApi = {
  async sendMessage(roomId: number, userPrompt: string): Promise<string> {
    const response = await apiClient.post(`/${roomId}/chat`, null, {
      params: { userPrompt },
    });
    return response.data;
  },

  async getRoomList(): Promise<ChatRoom[]> {
    const response = await apiClient.get<ChatRoom[]>('/rooms');
    return response.data;
  },
};
