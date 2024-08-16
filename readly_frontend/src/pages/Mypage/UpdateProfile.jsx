import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMemberInfo, updateUserInfo } from "../../api/authAPI.js";
import useUserStore from "../../store/userStore.js";

export default function UpdateProfile() {
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();
  const [formData, setFormData] = useState({
    loginId: "",
    nickname: "",
    memberName: "",
    phoneNumber: "",
    email: "",
    birthday: "",
    gender: "",
    introduction: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = useUserStore.getState().token;
    console.log("Token in EditProfile:", token); // 추가된 부분
    if (token) {
      fetchUserData();
    } else {
      console.log("No token found, redirecting to login"); // 추가된 부분
      navigate("/login");
    }
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const userData = await getMemberInfo(user.id);
      setFormData((prevState) => ({
        ...prevState,
        ...Object.fromEntries(
          Object.entries(userData).map(([key, value]) => [key, value ?? ""])
        ),
      }));
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      alert("사용자 정보를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // memberName을 제외한 나머지 정보만 업데이트
      const { memberName, ...updateData } = formData;
      await updateUserInfo(updateData);
      alert("회원 정보가 성공적으로 업데이트되었습니다.");
  
      // 업데이트된 정보를 다시 가져옵니다.
      const updatedUserData = await getMemberInfo(user.id);
      setUser(updatedUserData);
      setFormData(updatedUserData);
  
      navigate("/mypage");
    } catch (error) {
      console.error("Failed to update user info:", error);
      alert("회원 정보 업데이트에 실패했습니다.");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="login-content login-content-edit-profile">
      <h2>회원 정보 수정</h2>
      <form className="wrapper-box" onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-control"
          id="loginId"
          name="loginId"
          placeholder="아이디"
          value={formData.loginId}
          disabled
        />
        <input
          type="text"
          className="form-control"
          id="nickname"
          name="nickname"
          placeholder="닉네임"
          value={formData.nickname}
          onChange={handleChange}
        />
        <input
          type="text"
          className="form-control"
          id="memberName"
          name="memberName"
          placeholder="이름"
          value={formData.memberName}
          disabled
        />
        <input
          type="tel"
          className="form-control"
          id="phoneNumber"
          name="phoneNumber"
          placeholder="전화번호 (숫자만 입력)"
          value={formData.phoneNumber}
          onChange={handleChange}
        />
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          placeholder="이메일"
          value={formData.email}
          onChange={handleChange}
        />
        <div>
          <input
            type="date"
            className="form-control"
            id="birthday"
            name="birthday"
            placeholder="생년월일"
            value={formData.birthday}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="mr-4">
            <input
              type="radio"
              name="gender"
              value="M"
              checked={formData.gender === "M"}
              onChange={handleChange}
            />
            남성
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="F"
              checked={formData.gender === "F"}
              onChange={handleChange}
            />
            여성
          </label>
        </div>
        <textarea
          className="form-control"
          id="introduction"
          name="introduction"
          placeholder="자기소개"
          value={formData.introduction}
          onChange={handleChange}
        />
        <div>
          <button type="submit" className="btn btn-submit">
            정보 수정
          </button>
        </div>
      </form>
    </div>
  );
}
