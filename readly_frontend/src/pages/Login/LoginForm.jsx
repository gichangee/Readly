// src/components/LoginForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/authAPI";
// import useUserStore from "../../store/userStore";

export default function LoginForm() {
    const [values, setValues] = useState({
        loginId: "",
        loginPwd: "",
    });
    // const setUser = useUserStore(state => state.setUser);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.id]: e.target.value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await login(values);
            // setUser(response.loginInfo);
            navigate('/home');
            console.log(response)
        } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
            alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
        }
    };

    return (
        <div className="login-content login-content-signin">
            <div>
                <form className="wrapper-box" onSubmit={handleLogin}>
                    <input type="text" className="form-control" id="loginId" placeholder="아이디" onChange={handleChange} value={values.loginId} required />
                    <input type="password" className="form-control" id="loginPwd" placeholder="비밀번호" onChange={handleChange} value={values.loginPwd} required />
                    <button type="submit" className="btn btn-submit">로그인</button>
                </form>
            </div>
        </div>
    );
}