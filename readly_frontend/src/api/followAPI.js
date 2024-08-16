import axios from 'axios';
import { BASE_URL } from './authAPI';

export const addFollower = async (memberId, followerMemberId) => {
  try {
    console.log("Adding follower:", { memberId, followerMemberId });
    const response = await axios.post(`${BASE_URL}/follower`,
      {
        memberId,
        followerMemberId
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    console.log('Follower added successfully', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding follower:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    throw error;
  }
};

export const removeFollower = async (memberId, followerMemberId) => {
  try {
    console.log("Removing follower:", { memberId, followerMemberId });
    const response = await axios.delete(`${BASE_URL}/follower`,
      {
        data: {
          memberId,
          followerMemberId
        },
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    console.log('Follower removed successfully');
    return response.data;
  } catch (error) {
    console.error('Error removing follower:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    throw error;
  }
};