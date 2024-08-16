import axios from "axios";
import { BASE_URL } from './authAPI';

export const createPhotoCard = async (bookId, text, visibility, memberId) => {
  try {
    console.log("Sending data:", { bookId, text, visibility, memberId });
    const response = await axios.post(`${BASE_URL}/photocard/createimage`, {
      bookId,
      text,
      visibility,
      memberId,
    });
    console.log("Received response:", response.data);
    return response.data.CreatePhotoCardResponse;
  } catch (error) {
    console.error("Error creating photo card:", error);
    if (error.response) {
      console.error("Error response:", error.response.data);
    }
    throw error;
  }
};

export const updatePhotoCard = async (imageLink, photoCardId) => {
  try {
    console.log("Updating photo card:", { imageLink, photoCardId });
    const response = await axios.put(`${BASE_URL}/photocard/createcard`, {
      imageLink,
      photoCardId,
    });
    console.log("Received response:", response.data);
    return response.data.photoCard;
  } catch (error) {
    console.error("Error updating photo card:", error);
    if (error.response) {
      console.error("Error response:", error.response.data);
    }
    throw error;
  }
};

export const getPhotoCard = async (
  searchType,
  orderType,
  pageSize,
  pageNumber,
  visibility,
) => {
  try {
    console.log("get photo card send:", {
      searchType,
      orderType,
      pageSize,
      pageNumber,
      visibility,
    });
    const response = await axios.post(`${BASE_URL}/photocard/getPhotoCards`, {
      searchType,
      orderType,
      pageSize,
      pageNumber,
      visibility,
    });
    console.log("Received response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error get photo card:", error);
    if (error.response) {
      console.error("Error response:", error.response.data);
    }
    throw error;
  }
};