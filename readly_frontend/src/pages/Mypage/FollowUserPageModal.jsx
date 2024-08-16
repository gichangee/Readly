
import Modal from "react-modal";
import FollowButton from "../../components/Follow/Follow.jsx"; // Ensure the FollowButton is correctly imported
import LevelIcon1 from "../../assets/level/lv1.png"; // Ensure these are correctly imported
import LevelIcon2 from "../../assets/level/lv2.png";

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

export default function FollowUserPageModal({ isOpen, onRequestClose, user }) {
  if (!user) return null;

  const levelIcons = {
    1: LevelIcon1,
    2: LevelIcon2,
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

      <div className="flex gap-4 mb-4">
        <img
          src={levelIcons[user.level]}
          alt={`Level ${user.level}`}
          className="w-10 h-10"
        />
        <div className="flex">
          <h2 className="w-40 h-2 font-bold text-xl">
          {user.nickname}
          </h2>
          <FollowButton/>
        </div>
      </div>

      <h2 className="font-bold text-xl mb-1">
          <span className="text-custom-highlight">{user.nickname}</span>님이 읽은 책들이에요!
        </h2>
      <h2 className="text-2xl font-bold mb-4"></h2>
      <div className="flex flex-col gap-4 mb-8">
        {user.readBooks.map(book => (
          <div key={book.id} className="flex items-center gap-4">
            <img src={book.cover} alt={book.title} className="w-20 h-28" />
            <div>
              <h3 className="font-semibold">{book.title}</h3>
              <p className="text-gray-600">{book.description}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="font-bold text-xl mb-1">
          <span className="text-custom-highlight">{user.nickname}</span>님이 만든 포토카드
        </h2>
      <div className="flex gap-4 mb-8">
        {user.photocards.map(card => (
          <div key={card.id} className="flex-col items-center gap-4">
            <img src={card.cover} alt={card.title} className="w-20 h-28" />
            <div>
              <h3 className="font-semibold">{card.title}</h3>
            </div>
          </div>
        ))}
      </div>


      <h2 className="font-bold text-xl mb-1">
          <span className="text-custom-highlight">{user.nickname}</span>님이 남긴 한줄평
        </h2>
      <div className="flex gap-4">
        {user.reviews.map(review => (
          <div key={review.id} className="flex-col items-center gap-4">
            <img src={review.cover} alt={review.title} className="w-20 h-28" />
            <div>
              <h3 className="font-semibold">{review.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
