import { useState, useEffect } from 'react';
import PhotocardBack from '../SharedBoard/PhotocardBack.jsx';


const ShowCardModal = ({ item, isOpen, onClose }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleFlip = (e) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const handleLikeClick = (event) => {
    event.stopPropagation();
    // 여기에 좋아요 기능 구현
    console.log("Like clicked for item:", item);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="w-[360px] h-[500px] bg-transparent rounded-lg shadow-lg flip-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flip-card ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
          <div className="flip-card-front">
            <div className="img-container">
              <img
                src={item.photoCardImage}
                alt={item.bookTitle}
              />
            </div>
          </div>
          <div className="flip-card-back bg-gray-100 rounded-lg overflow-hidden">
            <PhotocardBack
              photoCardText={item.photoCardText}
              memberId={item.memberId}
              bookTitle={item.bookTitle}
              bookAuthor={item.bookAuthor}
              likeCount={item.likeCount}
              likeCheck={item.likeCheck}
              onLikeClick={handleLikeClick}
              photoCardCreatedDate={item.photoCardCreatedDate}
              photoCardId={item.photoCardId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowCardModal;