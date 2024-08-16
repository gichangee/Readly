import { useState, useEffect } from "react";
import { signUp } from "../../api/authAPI";

export default function SignupForm() {
  const [values, setValues] = useState({
    loginId: "",
    loginPwd: "",
    nickname: "",
    memberName: "",
    phoneNumber: "",
    email: "",
    birthday: "",
    gender: "M",
    social: "R",
    text: "",
  });

  const [tooltips, setTooltips] = useState({
    loginId: false,
    loginPwd: false,
    nickname: false,
    memberName: false,
    phoneNumber: false,
    email: false,
  });

  const maxLengths = {
    loginId: 15,
    loginPwd: 16,
    nickname: 10,
    memberName: 8,
    phoneNumber: 11,
    email: 40,
  };

  useEffect(() => {
    if (values.nickname) {
      setValues((prev) => ({
        ...prev,
        text: `${values.nickname} 유저에 대한 설명입니다.`,
      }));
    }
  }, [values.nickname]);

  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    }
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(
      3,
      7
    )}-${phoneNumber.slice(7, 11)}`;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    let updatedValue = value;

    if (id in maxLengths) {
      if (id === "phoneNumber") {
        updatedValue = value.replace(/[^\d]/g, "");
      }
      updatedValue = updatedValue.slice(0, maxLengths[id]);

      setTooltips((prev) => ({
        ...prev,
        [id]: updatedValue.length >= maxLengths[id],
      }));

      if (updatedValue.length >= maxLengths[id]) {
        setTimeout(() => {
          setTooltips((prev) => ({ ...prev, [id]: false }));
        }, 1000);
      }
    }

    setValues((prevValues) => ({
      ...prevValues,
      [id]: updatedValue,
    }));
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    let updatedValue = value.slice(0, maxLengths.loginPwd);

    setValues((prevValues) => ({
      ...prevValues,
      loginPwd: updatedValue,
    }));

    const isValid =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/.test(
        updatedValue
      );
    const isTooShort = updatedValue.length > 0 && updatedValue.length < 8;

    setTooltips((prev) => ({
      ...prev,
      loginPwd: !isValid && (updatedValue.length > 0 || isTooShort),
    }));

    if ((!isValid && updatedValue.length > 0) || isTooShort) {
      setTimeout(() => {
        setTooltips((prev) => ({ ...prev, loginPwd: false }));
      }, 1000);
    }
  };

  const handleGenderChange = (selectedGender) => {
    setValues((prevValues) => ({
      ...prevValues,
      gender: selectedGender,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const formattedValues = {
      ...values,
      phoneNumber: formatPhoneNumber(values.phoneNumber),
    };

    try {
      const signUpResponse = await signUp(formattedValues);
      console.log("회원가입 응답:", signUpResponse);

      alert("회원가입에 성공했습니다! 로그인 페이지로 이동합니다.");
      window.location.href = "/login";
    } catch (error) {
      console.error("Signup failed:", error);
      console.log("Signup failed:", error.errorMessage);
      alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="login-content login-content-signup p-12">
      <div className="mt-4">
        <form className="wrapper-box" onSubmit={handleRegister}>
          <div className="relative">
            <input
              type="text"
              className="form-control"
              id="loginId"
              placeholder="아이디"
              onChange={handleChange}
              value={values.loginId}
              required
              maxLength={maxLengths.loginId}
            />
            {tooltips.loginId && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-300 rounded shadow-lg p-2 text-sm text-[#000000] z-10">
                아이디는 16자 이하로 입력해주세요.
              </div>
            )}
          </div>
          <div className="relative">
            <input
              type="password"
              className="form-control"
              id="loginPwd"
              placeholder="비밀번호"
              onChange={handlePasswordChange}
              value={values.loginPwd}
              required
              minLength={8}
              maxLength={maxLengths.loginPwd}
            />
            {tooltips.loginPwd && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-300 rounded shadow-lg p-2 text-sm text-[#000000] z-10">
                비밀번호는 영문, 숫자 및 특수기호가 각각 최소 1개
                이상 포함되어야 하며, 길이는 8자 이상 16자 이하이어야 합니다.
              </div>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              className="form-control"
              id="nickname"
              placeholder="닉네임"
              onChange={handleChange}
              value={values.nickname}
              required
              maxLength={maxLengths.nickname}
            />
            {tooltips.nickname && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-300 rounded shadow-lg p-2 text-sm text-[#000000] z-10">
                닉네임은 16자 이하로 입력해주세요.
              </div>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              className="form-control"
              id="memberName"
              placeholder="이름"
              onChange={handleChange}
              value={values.memberName}
              required
              maxLength={maxLengths.memberName}
            />
            {tooltips.memberName && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-300 rounded shadow-lg p-2 text-sm text-[#000000] z-10">
              </div>
            )}
          </div>
          <div className="relative">
            <input
              type="tel"
              className="form-control"
              id="phoneNumber"
              placeholder="전화번호 (숫자만 입력)"
              onChange={handleChange}
              value={values.phoneNumber}
              required
              maxLength={maxLengths.phoneNumber}
            />
            {tooltips.phoneNumber && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-300 rounded shadow-lg p-2 text-sm text-[#000000] z-10">
                전화번호는 숫자만 11자리 이하로 입력해주세요.
              </div>
            )}
          </div>
          <div className="relative">
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="이메일"
              onChange={handleChange}
              value={values.email}
              required
              maxLength={maxLengths.email}
            />
            {tooltips.email && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-300 rounded shadow-lg p-2 text-sm text-[#000000] z-10">
                이메일은 30자 이하로 입력해주세요.
              </div>
            )}
          </div>
          <div className="mb-4">
            <input
              type="date"
              className="form-control"
              id="birthday"
              placeholder="생년월일"
              onChange={handleChange}
              value={values.birthday}
              required
            />
          </div>
          <div className="flex space-x-2 w-full max-w-[160px] ml-2">
            <button
              type="button"
              className={`flex-1 px-1 py-0.5 text-xs font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                values.gender === "M"
                  ? "bg-[#3B82F6] text-[#FFFFFF] ring-[#3B82F6]"
                  : "bg-[#E5E7EB] text-[#374151] hover:bg-[#D1D5DB]"
              }`}
              style={{ lineHeight: "1", height: "24px" }} // 추가된 부분
              onClick={() => handleGenderChange("M")}
            >
              남성
            </button>
            <button
              type="button"
              className={`flex-1 px-1 py-0.5 text-xs font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                values.gender === "F"
                  ? "bg-[#EC4899] text-[#FFFFFF] ring-[#3B82F6]"
                  : "bg-[#E5E7EB] text-[#374151] hover:bg-[#D1D5DB]"
              }`}
              style={{ lineHeight: "1", height: "24px" }} // 추가된 부분
              onClick={() => handleGenderChange("F")}
            >
              여성
            </button>
          </div>

          <div className="w-full mt-12 justify-center object-center">
            <button
              type="submit"
              className="btn btn-submit"
              style={{ width: "60%" }}
            >
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
