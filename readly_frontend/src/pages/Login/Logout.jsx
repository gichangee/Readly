// src/components/Logout.jsx
import { useNavigate } from 'react-router-dom';
import logoutIcon from "../../assets/header/logout.png";
import { logout } from '../../api/authAPI';
import useUserStore from "../../store/userStore";

function LogoutButton({ textColor = "#878787", textSize = "base" }) {
  const navigate = useNavigate();
  const clearUser = useUserStore(state => state.clearUser);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        await logout(token);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userInfo');
      clearUser();
      navigate('/');
    }
  };

  return (
    <div className="flex items-center">
      <img className="w-6 h-6 mr-3" src={logoutIcon} alt="logout" />
      <button 
        onClick={handleLogout} 
        className={`text-${textSize} font-bold`}
        style={{ color: textColor }}
      >
        로그아웃
      </button>
    </div>
  );
}

export default LogoutButton;