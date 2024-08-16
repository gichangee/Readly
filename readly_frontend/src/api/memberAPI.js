import axios from 'axios';
import { BASE_URL } from './authAPI';

export const getFollowerInfo = async (memberId) => {
  try {
    const response = await axios.get(`${BASE_URL}/follower`, {
      params: { memberId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching follower info:', error.response ? error.response.data : error.message);
    throw error;
  }
};