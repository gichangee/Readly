import { useState } from "react";
import Modal from "react-modal";
import GoButton from "../GoButton/GoButton";

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
    width: "22%",
    height: "20%",
    minHeight: "15%",
    zIndex: "150",
    borderRadius: "10px",
    boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.25)",
    backgroundColor: "#E5E5E5",
    padding: "20px",
    overflow: "auto",
  },
};

export default function CurrentPageModal({
  isOpen,
  onRequestClose,
  onSave,
  position,
}) {
  const [newPage, setNewPage] = useState("");

  const handleInputChange = (event) => {
    setNewPage(event.target.value);
  };

  const handleSave = () => {
    if (newPage !== "") {
      onSave(newPage);
      setNewPage(""); // Clear input after saving
    } else {
      console.log("New page value is empty");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        ...customModalStyles,
        content: {
          ...customModalStyles.content,
          top: `${position.top}px`,
          left: `${position.left}px`,
        },
      }}
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
      <h2 className="text-lg font-bold mb-4">읽은 페이지를 입력해주세요!</h2>
      <div className="flex gap-4">
        <input
          type="text"
          className="border rounded p-2 w-2/5"
          value={newPage}
          onChange={handleInputChange}
        />

        <GoButton text="저장" onClick={handleSave} />
      </div>
    </Modal>
  );
}
