import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import LevelIcon1 from "../../assets/level/lv1.png";
import LevelIcon2 from "../../assets/level/lv2.png";
import LevelIcon3 from "../../assets/level/lv3.png";
import LevelIcon4 from "../../assets/level/lv4.png";
import InfoIcon from "../../assets/header/info_img.png";

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
    width: "60%",
    maxWidth: "100%",
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
};

export default function FollowList({ isOpen, onRequestClose, follows }) {
  const navigate = useNavigate();

  const levelIcons = {
    1: LevelIcon1,
    2: LevelIcon2,
    3: LevelIcon3,
    4: LevelIcon4,
  };

  const navigateToMemberPage = (followedId) => {
    console.log("Navigating to member page 팔로우모달:", followedId);
    navigate(`/member/${followedId}`);
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
      <h2 className="text-2xl font-bold mb-4">팔로우 하는 사람들이에요!</h2>
      <div className="flex flex-wrap space-x-2 mb-2 gap-4">
        {follows &&
          follows.map((user) => (
            <div
              key={user.followedId}
              onClick={() => navigateToMemberPage(user.followedId)}
              className="bg-gray-200 w-[9rem] h-[10rem] p-2 rounded-xl flex-cols items-center bg-[#FFFFFF]"
            >
              <img
                src={levelIcons[user.level]}
                alt={`Level ${user.level}`}
                className="w-8 h-8 mr-2"
              />
              <div className="ml-4">
                <img src={InfoIcon} alt="info" className="w-14 h-12" />
                <p className="font-semibold">{user.followedName}</p>
                <p className="text-sm text-gray-600">{user.followedText}</p>
              </div>
            </div>
          ))}
      </div>
    </Modal>
  );
}
