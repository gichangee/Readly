import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import useUserStore from "../store/userStore"; // userStore import
import { BASE_URL } from "../api/authAPI";
import TimeCat from "../assets/onboard/time_cat.png"
Modal.setAppElement("#root");

const Timecapsule = () => {
  const { user } = useUserStore(); // user 정보를 가져옴
  const memberId = user.id; // user의 id를 memberId로 설정

  const [unreadAlarmsCount, setUnreadAlarmsCount] = useState(0);
  const [alarms, setAlarms] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCapsule, setSelectedCapsule] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // 추가: 클릭된 이미지 정보를 저장

  useEffect(() => {
    // 로그인 후 알람 개수 불러오기
    const fetchUnreadCount = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/timecapsule/${memberId}/alarm/unread-count`
        );
        setUnreadAlarmsCount(response.data);
        console.log("Unread Alarm Count:", response.data); // Log the unread alarm count
      } catch (error) {
        console.error("Failed to fetch unread alarm count:", error);
      }
    };

    fetchUnreadCount();
  }, [memberId]);

  const handleIconClick = async () => {
    if (!isDropdownOpen) {
      try {
        const response = await axios.get(
          `${BASE_URL}/timecapsule/${memberId}/alarm`
        );
        setAlarms(response.data);
        setUnreadAlarmsCount(
          response.data.filter((alarm) => !alarm.isRead).length
        );
        setIsDropdownOpen(true);
      } catch (error) {
        console.error("Failed to fetch alarms:", error);
      }
    } else {
      setIsDropdownOpen(false);
    }
  };

  const handleAlarmClick = async (timeCapsuleId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/timecapsule/${timeCapsuleId}`
      );
      setSelectedCapsule(response.data);
      setIsModalOpen(true);
      // 특정 알람을 클릭하면 해당 알람을 읽음 처리할 수 있습니다.
      setUnreadAlarmsCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("Failed to fetch time capsule details:", error);
    }
  };

  const handleDeleteAlarm = async (timeCapsuleId) => {
    try {
      await axios.delete(`${BASE_URL}/timecapsule/${timeCapsuleId}`);
      setAlarms((prevAlarms) =>
        prevAlarms.filter((alarm) => alarm.timeCapsuleId !== timeCapsuleId)
      );
      setUnreadAlarmsCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("Failed to delete alarm:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCapsule(null);
    setSelectedImage(null); // 추가: 모달을 닫을 때 선택된 이미지 초기화
    setIsDropdownOpen(false); // 모달을 닫을 때 드롭다운도 닫음
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  // 날짜 간의 차이를 일수로 계산하는 함수
  const calculateDaysAgo = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    const differenceInTime = now.getTime() - start.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
  };

  return (
    <div className="relative">
      <div
        className="cursor-pointer flex items-center relative"
        onClick={handleIconClick}
      >
        <span className="text-2xl">⏳</span>
        {unreadAlarmsCount > 0 && <span className="notification-dot"></span>}
      </div>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-[20rem] bg-white shadow-lg rounded-lg z-10">
          {alarms.length === 0 ? (
            <div className="p-4 text-center">No new alarms</div>
          ) : (
            <ul className="p-2">
              {alarms.map((alarm) => (
                <li
                  key={alarm.timeCapsuleId}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between ${
                    alarm.isRead ? "text-gray-500" : "text-black font-bold"
                  }`}
                >
                  <span onClick={() => handleAlarmClick(alarm.timeCapsuleId)}>
                    {`${alarm.createdDate}에 온 타임캡슐`}
                  </span>
                  {!alarm.isRead && (
                    <span className="ml-2 bg-red-500 w-3 h-3 rounded-full"></span>
                  )}
                  <button
                    onClick={() => handleDeleteAlarm(alarm.timeCapsuleId)}
                    className="text-red-500 hover:text-red-700 ml-4"
                  >
                    ✖
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

{isModalOpen && selectedCapsule && (
  <Modal
    isOpen={isModalOpen}
    onRequestClose={closeModal}
    contentLabel="Time Capsule Details"
    style={{
      overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        width: "100%",
        height: "100vh",
        zIndex: "10",
        position: "fixed",
        top: "0",
        left: "0",
      },
      content: {
        width: "80%",
        maxWidth: "800px",
        height: "80%",
        maxHeight: "80vh",
        zIndex: "150",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        borderRadius: "10px",
        boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.25)",
        backgroundColor: "#F5F5F5",
        padding: "20px",
        overflow: "auto",
      },
    }}
  >
    <h2 className="text-2xl font-bold mb-2 text-purple-600 text-left">
      <span className="text-[#5d5d5d]">{user.nickname}</span>님의{" "}
      <span className="text-custom-highlight">
        {calculateDaysAgo(selectedCapsule.timeCapsuleDate.startDate)}일 전 기록
      </span>
      이에요
    </h2>
    <hr className="border-t-2 border-gray-200 mb-6" />

    {/* 리뷰 섹션 */}
    <div className="mb-6">
      <h3 className="font-semibold text-lg mb-4">📚 Reviews:</h3>
      <div className="grid grid-cols-6 gap-4">
        {selectedCapsule.reviews.map((review) => (
          <div
            key={review.reviewId}
            className="w-[8rem] h-36 cursor-pointer"
            onClick={() => handleImageClick(review)}
          >
            <img
              src={review.bookImage}
              alt={review.bookTitle}
              className="w-full h-full object-fill"
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              {calculateDaysAgo(review.createdDate)}일 전
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* 포토카드 섹션 */}
    <div className="mb-6">
      <h3 className="font-semibold text-lg mb-4">📸 Photo Cards:</h3>
      <div className="grid grid-cols-6 gap-4">
        {selectedCapsule.photoCards.map((photoCard) => (
          <div
            key={photoCard.photoCardId}
            className="w-[8rem] h-36 cursor-pointer"
            onClick={() => handleImageClick(photoCard)}
          >
            <img
              src={photoCard.photoCardImage}
              alt={photoCard.bookTitle}
              className="w-full h-full object-fill"
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              {calculateDaysAgo(photoCard.photoCardCreatedDate)}일 전
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* 모달의 X 버튼 */}
    <button
      onClick={closeModal}
      className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
    >
      ✖
    </button>

    {/* 오른쪽 하단에 추가할 이미지 */}
    <img
      src={TimeCat} // 추가할 이미지의 URL
      alt="decorative"
      className="absolute bottom-4 right-4 w-24 h-24 object-contain"
      style={{ zIndex: "50", pointerEvents: "none" }} // 클릭 불가능하게 설정
    />
  </Modal>
)}


      {/* 이미지 클릭 시 표시되는 세부 정보 모달 */}
      {selectedImage && (
        <Modal
          isOpen={!!selectedImage}
          onRequestClose={() => setSelectedImage(null)}
          contentLabel="Image Details"
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              zIndex: "100",
            },
            content: {
              width: "60%",
              maxWidth: "600px",
              height: "auto",
              zIndex: "200",
              margin: "auto",
              borderRadius: "10px",
              boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.25)",
              backgroundColor: "#FFF",
              padding: "20px",
              position: "relative", // X 버튼 포지셔닝을 위해 relative로 설정
            },
          }}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-lg"
          >
            ✖
          </button>
          <h3
            className={`mb-4 font-bold ${
              selectedImage.bookTitle.length > 15 ? "text-md" : "text-xl"
            }`}
          >
            {selectedImage.bookTitle}
          </h3>
          <img
            src={selectedImage.bookImage || selectedImage.photoCardImage}
            alt={selectedImage.bookTitle}
            className="w-[20rem] h-[18rem] object-fill rounded-lg shadow-md mb-4"
          />
          <p>{selectedImage.reviewText || selectedImage.photoCardText}</p>
          <p className="text-xs text-gray-500 mt-2">
            {calculateDaysAgo(
              selectedImage.createdDate || selectedImage.photoCardCreatedDate
            )}
            일 전
          </p>
        </Modal>
      )}
    </div>
  );
};

export default Timecapsule;
