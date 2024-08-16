// src/api/communityAPI.js
import axios from 'axios';
import { BASE_URL } from './authAPI';

export const joinGroup = async (groupId, memberId) => {
  console.log(`Attempting to join group. GroupID: ${groupId}, MemberID: ${memberId}`);
  try {
    const response = await axios.post(`${BASE_URL}/joingroup`, {
      groupId,
      memberId
    },
    );
    console.log('Full API response:', response);
    return response.status;
  } catch (error) {
    console.error('Error joining group:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const createGroup = async (groupData) => {
  try {
    console.log("Sending group data:", groupData);
    const response = await axios.post(`${BASE_URL}/makegroup`, groupData);
    console.log("Server response:", response);
    return response.status;
  } catch (error) {
    console.error('Error creating group:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getMemberGroups = async (memberId) => {
  try {
    const response = await axios.get(`${BASE_URL}/membergroups/${memberId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching member groups:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getAvailableGroups = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/groups`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching available groups:', error.response ? error.response.data : error.message);
    throw error;
  }
};
