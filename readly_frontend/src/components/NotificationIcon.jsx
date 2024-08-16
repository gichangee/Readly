import { useState, useEffect } from "react";
import axios from "axios";
import useUserStore from "../store/userStore";
import { BASE_URL } from '../api/authAPI';

const NotificationIcon = ({ initialNotifications = [] }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const { user } = useUserStore();
  const [eventSource, setEventSource] = useState(null);

  const fetchUnreadNotifications = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/notifications/unread/${user.id}`);
      const notificationsData = Array.isArray(response.data) ? response.data : [];
      setNotifications(notificationsData);
    } catch (error) {
      console.error("Failed to fetch unread notifications:", error);
      setNotifications([]); // 에러 발생 시 빈 배열로 초기화
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await axios.post(`${BASE_URL}/notifications/mark-as-read/${user.id}/${notificationId}`);
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== notificationId)
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const toggleNotifications = async () => {
    setShowNotifications((prev) => !prev);
  
    if (!showNotifications) {
      await fetchUnreadNotifications(); // 알림 아이콘을 클릭할 때마다 읽지 않은 알림을 가져옵니다.
      setShowNotifications(true); // 알림이 있으면 빨간 점을 표시합니다.
    }
  };

  const handleNotificationClick = async (notificationId) => {
    await markNotificationAsRead(notificationId);
  };

  const initializeSSE = () => {
    if (eventSource) {
      eventSource.close(); // 기존 연결을 닫습니다.
    }
  
    const newEventSource = new EventSource(`${BASE_URL}/notifications/subscribe/${user.id}`);
  
    newEventSource.addEventListener("addMessage", function (event) {
      console.log("Notification received: ", event.data);
  
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        { id: new Date().getTime(), message: event.data }, // 임시 ID와 메시지 추가
      ]);
  
      //setShowNotifications(true); // 빨간 점을 표시합니다.
    });
  
    newEventSource.addEventListener("open", () => {
      console.log("SSE 연결이 성공적으로 열렸습니다.");
    });
  
    newEventSource.addEventListener("error", (err) => {
      console.error("SSE 연결 오류:", err);
      newEventSource.close(); // 오류 발생 시 연결을 닫습니다.
      setTimeout(() => {
        initializeSSE(); // 3초 후에 연결을 재시도합니다.
      }, 3000);
    });
  
    setEventSource(newEventSource);
  };
  

  useEffect(() => {
    if (user && user.id) {
      initializeSSE();
      fetchUnreadNotifications(); // 로그인 시 읽지 않은 알림을 확인합니다.
  
      return () => {
        if (eventSource) {
          eventSource.close(); // 컴포넌트가 언마운트될 때 SSE 연결을 닫습니다.
        }
      };
    }
  }, [user]);

  return (
    <div className="relative">
      <div className="notification-icon cursor-pointer" onClick={toggleNotifications}>
        🔔 {/* 아이콘 */}
        {notifications.length > 0 && (
          <span className="notification-dot"></span>
        )}
      </div>
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-50">
          {Array.isArray(notifications) && notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="p-4 border-b cursor-pointer"
                onClick={() => handleNotificationClick(notification.id)}
              >
                {notification.message}
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">No new notifications</div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;

