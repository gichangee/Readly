import { useState, useEffect } from "react";
import "../../pages/Photocard/photocard_flip.css";
import ShowCardModal from "../Photocard/ShowCardModal.jsx";
import ShowReview from "../../components/Review/ShowReview.jsx";
import ShowReviewModal from "../../components/Review/ShowReviewModal.jsx";
import { addLike, removeLike } from "../../api/likeAPI";
import useUserStore from "../../store/userStore";

const GridDisplay = ({ items, type }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const { user } = useUserStore();

  const handleItemClick = (item) => {
    console.log('Item clicked:', item);
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  useEffect(() => {
    console.log('Selected item:', selectedItem);
  }, [selectedItem]);

  const handleLike = async (reviewId, isLiked) => {
    if (!user) {
      console.error('User not logged in');
      return;
    }

    try {
      if (isLiked) {
        await addLike(user.id, reviewId);
      } else {
        await removeLike(user.id, reviewId);
      }
      console.log('Like action successful');
      // You might want to update the state of the liked item here
      // For example, update the items array with the new like status
    } catch (error) {
      console.error('Error in liking:', error);
    }
  };

  const gridCols = type === "photocard" 
    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
    : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
  const itemSize = type === "review" ? "w-full h-48" : "w-36 h-48"; // 크기 조정
  const gap = "gap-12"; // 간격 조정

  const renderItem = (item) => {
    if (type === "photocard") {
      return (
        <div
          className="w-full h-full rounded-lg overflow-hidden cursor-pointer shadow-lg"
          onClick={() => handleItemClick(item)}
        >
          <img
            src={item.photoCardImage}
            alt={item.bookTitle}
            className="w-full h-full object-fill"
          />
        </div>
      );
    } else if (type === "review") {
      return (
        <div onClick={() => handleItemClick(item)} className="cursor-pointer h-full">
          <ShowReview 
            review={{
              id: item.reviewId,
              bookImage: item.bookImage,
              bookTitle: item.bookTitle,
              bookAuthor: item.bookAuthor,
              memberId: item.memberId,
              reviewText: item.reviewText,
              likeCount: item.likeCount,
              likeCheck: item.likeCheck
            }} 
            isModal={false}
            onLike={handleLike}
          />
        </div>
      );
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className={`grid ${gridCols} ${gap}`}>
        {items.map((item) => (
          <div
            key={type === "photocard" ? item.photoCardId : item.reviewId}
            className={`${itemSize}`}
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
      {type === "photocard" ? (
        <ShowCardModal 
          item={selectedItem} 
          isOpen={!!selectedItem} 
          onClose={handleCloseModal}
        />
      ) : (
<ShowReviewModal
  review={{
    ...selectedItem,
    id: selectedItem?.reviewId  // 여기서 id를 명시적으로 추가
  }}
  isOpen={!!selectedItem}
  onClose={handleCloseModal}
  onLike={handleLike}
/>
      )}
    </div>
  );
};

export default GridDisplay;