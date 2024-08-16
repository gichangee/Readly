// ShareModal.jsx
import React, { useState, useEffect } from 'react';
import GoButton from "../../components/GoButton/GoButton.jsx";

const ShareModal = ({ onClose, onShare, photoCards, reviews }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleItemSelect = (item) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(item)
        ? prevSelectedItems.filter((i) => i !== item)
        : [...prevSelectedItems, item]
    );
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    onShare(selectedItems);
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-10 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-opacity-20 rounded-lg shadow-lg p-6 w-[80%] max-w-4xl max-h-[80vh] overflow-y-auto"
        onClick={handleModalClick}
      >
        {/* 포토카드 섹션 */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">
            내가 만든 <span className="text-custom-highlight">포토카드</span>
          </h3>
          <div className="grid grid-cols-8 gap-2">
            {photoCards &&
              photoCards.map((card) => (
                <div
                  key={card.photocardId}
                  className="bg-white rounded-md shadow-sm overflow-hidden relative"
                >
                  <div className="aspect-w-3 aspect-h-4">
                    <img
                      src={card.photocardImage}
                      alt={card.photocardText}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <input
                    type="checkbox"
                    className="absolute top-0.5 right-0.5 w-4 h-4"
                    onChange={(e) => {
                      e.stopPropagation();
                      handleItemSelect(card);
                    }}
                    checked={selectedItems.includes(card)}
                  />
                </div>
              ))}
          </div>
        </div>

        <hr className="my-6 border-gray-300" />

        {/* 한줄평 섹션 */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">
            내가 만든 <span className="text-custom-highlight">한줄평</span>
          </h3>
          <div className="grid grid-cols-7 gap-2">
            {reviews &&
              reviews.map((review) => (
                <div
                  key={review.reviewId}
                  className="bg-white rounded-md shadow-sm overflow-hidden relative"
                >
                  <div className="aspect-w-3 aspect-h-4">
                    <img
                      src={review.bookImage}
                      alt={review.bookTitle}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <input
                    type="checkbox"
                    className="absolute top-0.5 right-0.5 w-4 h-4"
                    onChange={(e) => {
                      e.stopPropagation();
                      handleItemSelect(review);
                    }}
                    checked={selectedItems.includes(review)}
                  />
                </div>
              ))}
          </div>
        </div>

        {/* 버튼 섹션 */}
        <div className="flex justify-end mt-6">
          <GoButton text="공유하기" onClick={handleShareClick} />
          <button
            onClick={onClose}
            className="px-2 py-2 bg-[#cfc4c4] font-bold text-white rounded-full shadow-lg text-lg hover:bg-gray-600 transition duration-300 ml-4"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;