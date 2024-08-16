import { useState } from "react";
import Modal from "react-modal";
import GoButton from "../../components/GoButton/GoButton.jsx";
import Review from "../../components/Review/Review.jsx";
import { createTimeCapsule } from "../../api/timecapsuleAPI.js";
import useUserStore from "../../store/userStore";

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

export default function TimecapsuleSelect({
  isOpen,
  onRequestClose,
  photoCards = [],
  reviews = [],
  startDate,
  endDate,
}) {
  const [selectedPhotoCards, setSelectedPhotoCards] = useState([]);
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const user = useUserStore((state) => state.user);
  const memberId = user ? user.id : null;

  const toggleSelection = (id, type) => {
    if (type === "photoCard") {
      setSelectedPhotoCards((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else if (type === "review") {
      setSelectedReviews((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    }
  };

  const handleCreateTimeCapsule = async () => {
    setIsLoading(true);
    try {
      const success = await createTimeCapsule(
        memberId,
        startDate,
        endDate,
        selectedReviews,
        selectedPhotoCards
      );
      if (success) {
        alert("타임캡슐이 성공적으로 생성되었습니다!");
        onRequestClose(); // Close the modal after successful creation
      } else {
        alert("타임캡슐 생성에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("Error creating time capsule:", error);
      alert(`타임캡슐 생성 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
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
      <h2 className="text-2xl font-bold mb-4">
        어떤 걸 타임캡슐에 넣어드릴까요?
      </h2>
      <div className="flex-col gap-4">
        <h3 className="font-bold mb-2">내가 만든 포토카드</h3>
        <div className="flex flex-wrap gap-2">
          {photoCards.length > 0 ? (
            photoCards.map((card) => (
              <div
                key={card.photoCardId}
                className="flex items-center"
                onClick={() => toggleSelection(card.photoCardId, "photoCard")}
              >
                <img
                  src={card.photoCardImage}
                  alt={card.bookTitle}
                  className={`h-[7rem] rounded cursor-pointer ${
                    selectedPhotoCards.includes(card.photoCardId)
                      ? "border-2 border-[red]"
                      : ""
                  }`}
                />
              </div>
            ))
          ) : (
            <p>포토카드가 없습니다.</p>
          )}
        </div>
      </div>

      <div className="flex-col gap-4 mt-4">
        <h3 className="font-bold mb-2">내가 남긴 한줄평</h3>
        <div className="flex flex-wrap gap-2">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review.reviewId}
                className={`flex items-center w-[10rem] h-[15rem] rounded cursor-pointer ${
                  selectedReviews.includes(review.reviewId)
                    ? "border-2 border-[red]"
                    : ""
                }`}
                onClick={() => toggleSelection(review.reviewId, "review")}
              >
                <Review
                  key={review.reviewId}
                  bookImage={review.bookImage}
                  title={review.bookTitle}
                  author={review.bookAuthor}
                  review={review.reviewText}
                  likeCount={review.likeCount}
                />
              </div>
            ))
          ) : (
            <p>한줄평이 없습니다.</p>
          )}
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <GoButton 
          text={isLoading ? "생성 중..." : "타임캡슐 생성"} 
          onClick={handleCreateTimeCapsule}
          disabled={isLoading}
        />
      </div>
    </Modal>
  );
}