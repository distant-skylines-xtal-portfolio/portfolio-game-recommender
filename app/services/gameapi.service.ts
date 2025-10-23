import axios from 'axios';


const API_BASE_URL = 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  
});

export const gameApi = {
  getRecommendations: async (filters: any) => {
    const response = await apiClient.post('/api/games/recommend', filters);
    return response.data.result;
  },
  
  getGenres: async () => {
    const response = await apiClient.get('/api/games/genres');
    return response.data.genres;
  },
  
  getPlatforms: async () => {
    const response = await apiClient.get('/api/games/platforms');
    return response.data.platforms;
  },

  searchByName: async (searchText: string) => {
    const searchBody = {
      search: searchText,
    }
    const response = await apiClient.post('/api/games/search', searchBody);
    return response.data.result;
  }
};