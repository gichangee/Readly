import axios from 'axios';
import { BASE_URL } from './authAPI';

export const fetchTimeCapsuleItems = async (memberId, startDate, endDate) => {
  if (!memberId || !startDate || !endDate) {
    throw new Error('Missing required parameters: memberId, startDate, or endDate');
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/items/date`, 
      { memberId, startDate, endDate },
    );
    console.log('Fetched time capsule items:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching time capsule items:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export async function createTimeCapsule(memberId, startDate, endDate, reviewIds, photoCardIds) {
  // 데이터 유효성 검사
  if (!memberId || !startDate || !endDate) {
    throw new Error('필수 파라미터가 누락되었습니다: memberId, startDate, endDate');
  }

  try {
    const payload = {
      memberId,
      startDate,
      endDate,
      reviewIds,
      photoCardIds
    };

    console.log('타임캡슐 생성을 위한 페이로드:', payload);

    const response = await axios.post(`${BASE_URL}/timecapsule`, payload);
    
    console.log('타임캡슐 생성 응답 상태:', response.status);

    // HTTP 상태 코드로 성공 여부 확인
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      console.log('타임캡슐이 성공적으로 생성되었습니다.');
      return true;
    } else {
      throw new Error("예상치 못한 응답 상태: " + response.status);
    }
  } catch (error) {
    console.error("타임캡슐 생성 중 오류 발생:", error);
    if (error.response) {
      console.error("서버 응답 상태:", error.response.status);
      console.error("서버 응답 데이터:", error.response.data);
    }
    throw new Error(error.response?.data?.message || error.message || "타임캡슐 생성에 실패했습니다.");
  }
}

export const openTimeCapsule = async (timeCapsuleId) => {
  if (!timeCapsuleId) {
    throw new Error('필수 파라미터가 누락되었습니다: timeCapsuleId');
  }

  try {
    const response = await axios.get(
      `${BASE_URL}/timecapsule/${timeCapsuleId}`
    );

    console.log('타임캡슐 개봉 응답:', response.data);

    // 응답 데이터 구조 확인
    const { timeCapsuleDate, reviews, photoCards } = response.data;

    // 데이터 형식 변환 (필요한 경우)
    const formattedData = {
      timeCapsuleDate: {
        startDate: new Date(timeCapsuleDate.startDate),
        endDate: new Date(timeCapsuleDate.endDate)
      },
      reviews: reviews.map(review => ({
        ...review,
        createdDate: new Date(review.createdDate)
      })),
      photoCards: photoCards.map(photoCard => ({
        ...photoCard,
        photoCardCreatedDate: new Date(photoCard.photoCardCreatedDate)
      }))
    };

    return formattedData;
  } catch (error) {
    console.error('타임캡슐 개봉 중 오류 발생:', error);
    if (error.response) {
      console.error("서버 응답 상태:", error.response.status);
      console.error("서버 응답 데이터:", error.response.data);
    }
    throw new Error(error.response?.data?.message || error.message || "타임캡슐 개봉에 실패했습니다.");
  }
};

export const getTimeCapsuleItems = async (memberId, startDate, endDate) => {
  try {
    const response = await axios.post(`${BASE_URL}/items/date`, {
      memberId,
      startDate,
      endDate
    },
    );
    
    console.log('Retrieved time capsule items:', JSON.stringify(response.data, null, 2));
    return {
      reviews: response.data.reviews || [],
      photoCards: response.data.photoCards || []
    };
  } catch (error) {
    console.error('Error fetching time capsule items:', error.response ? error.response.data : error.message);
    throw error;
  }
};