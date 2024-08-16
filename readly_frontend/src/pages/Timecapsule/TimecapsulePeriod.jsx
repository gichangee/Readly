import Modal from "react-modal";
import { useState } from "react";
import GoButton from "../../components/GoButton/GoButton.jsx";
import TimecapsuleSelect from "./TimecapsuleSelect.jsx";
import { getTimeCapsuleItems } from '../../api/timecapsuleAPI.js';
import useUserStore from '../../store/userStore';

Modal.setAppElement("#root");

const customModalStyles = {
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
    width: "24%",
    height: "30%",
    maxHeight: "80vh",
    zIndex: "150",
    position: "absolute",
    bottom: "80px",
    right: "60px",
    left: "auto",
    top: "auto",
    transform: "none",
    borderRadius: "10px",
    boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.25)",
    backgroundColor: "#E5E5E5",
    padding: "20px",
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
};

export default function TimecapsulePeriod({ isOpen, onRequestClose }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredItems, setFilteredItems] = useState({ reviews: [], photoCards: [] });
  const user = useUserStore(state => state.user);

  const openModal = async () => {
    if (!startDate || !endDate) {
      alert("시작 날짜와 종료 날짜를 모두 입력해주세요.");
      return;
    }

    try {
      const items = await getTimeCapsuleItems(user.id, startDate, endDate);
      console.log("Retrieved time capsule items:", items);

      setFilteredItems(items);
      setModalIsOpen(true);
    } catch (error) {
      console.error("Error fetching time capsule items:", error);
      alert("데이터를 가져오는 데 실패했습니다.");
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customModalStyles}
      ariaHideApp={false}
      shouldCloseOnOverlayClick={true}
      closeTimeoutMS={300}
    >
      <button
        onClick={onRequestClose}
        className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
      >
        X
      </button>
      <h2 className="text-xl font-bold mb-4">기간을 입력해주세요!</h2>
      <div className="flex gap-4 mb-4">
        <input
          type="date"
          className="border rounded w-[7rem]"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        ~
        <input
          type="date"
          className="border rounded w-[7rem]"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div className="flex justify-end">
        <GoButton text="확인" onClick={openModal} />
      </div>

      <TimecapsuleSelect
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        reviews={filteredItems.reviews}
        photoCards={filteredItems.photoCards}
        startDate={startDate}
        endDate={endDate}
      />
    </Modal>
  );
}