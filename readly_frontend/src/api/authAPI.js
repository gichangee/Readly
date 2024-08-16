import axios from "axios";
import useUserStore from "../store/userStore"; // userStore의 실제 경로로 수정해주세요

 export const BASE_URL = "https://i11c207.p.ssafy.io/api";


// axios 인스턴스 생성
const api = axios.create({
  baseURL: BASE_URL,
});

axios.interceptors.request.use(
  (config) => {
    const id = useUserStore.getState().user.id;
    const token = useUserStore.getState().token;
    if (config.url !== `${BASE_URL}/member/${id}/token` && token) {
      config.headers["Authorization"] = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 추가
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config; // 원래 요청 정보 저장
    if (error.response && error.response.status === 401) {
      try {
        const id = useUserStore.getState().user.id;
        const response = await api({
          url: `${BASE_URL}/member/${id}/token`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // 쿠키를 보내기 위한 설정
        });

        useUserStore.getState().setToken(response.data.accessToken);
        originalRequest.headers["Authorization"] = `${response.data.accessToken}`;

        // 원래 요청을 다시 시도
        return axios(originalRequest);
      } catch (refreshError) {
        useUserStore.getState().clearUser();
        throw new Error("인증에 실패했습니다. 다시 로그인해주세요.");
      }
    }
    return Promise.reject(error);
  }
);

export const login = async (loginData) => {
  try {
    const response = await api.post("/member/login", loginData);
    useUserStore.getState().setUser(response.data.loginInfo);
    useUserStore.getState().setToken(response.data.accessToken);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const signUp = async (signUpData) => {
  try {
    const response = await api.post("/member/signup", signUpData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const logout = async () => {
  try {
    const response = await api.delete("/member/logout");
    useUserStore.getState().clearUser();
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getUserInfo = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/member/info`);
    return response.data.memberInfo || response.data;
  } catch (error) {
    alert("사용자 정보를 가져오는 데 문제가 발생했습니다. 나중에 다시 시도해 주세요.");
  }
};

export const updateUserInfo = async (updateData) => {
  try {
    const response = await axios.patch(`${BASE_URL}/member`, updateData);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to update user info");
    }
  } catch (error) {
    console.error("Error updating user info:", error);
    throw error;
  }
};

export const getMemberInfo = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/member/${id}`);
    return response.data.memberInfo;
  } catch (error) {
    if (error) {
      alert("사용자 정보를 가져오는 데 문제가 발생했습니다. 나중에 다시 시도해 주세요.");
    }
    throw error.response?.data || error.message;
  }
};
