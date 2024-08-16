import ShowReview from "./ShowReview";

const ShowReviewModal = ({ review, isOpen, onClose, onLike }) => {
  if (!isOpen || !review) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-[90%] max-w-[600px] max-h-[80%] overflow-y-auto bg-white rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <ShowReview review={review} isModal={true} onLike={onLike} />
      </div>
    </div>
  );
};

export default ShowReviewModal;
