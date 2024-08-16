import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import usePhotocardStore from '../../store/photocardStore';
import '../../pages/Photocard/photocard_flip.css';

export default function HomePhotocard({ onPhotoCardClick }) {
  const navigate = useNavigate();
  const { photocards, fetchHomePhotocards, currentPage, totalPages, isLoading, error } = usePhotocardStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    fetchHomePhotocards();
  }, []);

  const handleShowMore = () => {
    setIsAnimating(true);
    setTimeout(() => {
      if (currentPage < totalPages) {
        fetchHomePhotocards(currentPage + 1);
      } else {
        fetchHomePhotocards(1);
      }
      setIsAnimating(false);
    }, 500);
  };

  const handleMorePhotocards = () => {
    navigate('/sharedboard');
  };

  const currentPhotocards = [...photocards.slice(currentIndex, currentIndex + 6)];
  while (currentPhotocards.length < 6) {
    currentPhotocards.push({ photoCardId: `dummy-${currentPhotocards.length}`, photoCardImage: null });
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full ml-3 bg-gray-100 mb-2">
      <div className="max-w-full mx-auto px-2 lg:px-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
          <h2 className="font-bold text-xl sm:text-2xl mb-2 sm:mb-0">사용자들이 만든 <span className="text-custom-highlight">포토카드</span></h2>
          <button
            onClick={handleMorePhotocards}
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="text-xs sm:text-sm text-[#868686] font-bold p-2 sm:p-4">
              더 많은 포토카드를 보고싶으신가요?
            </span>
          </button>
        </div>
        <div className="relative overflow-hidden">
          <div
            className={`flex flex-col sm:flex-row justify-between items-center transition-transform duration-500 ${isAnimating ? 'translate-x-full' : 'translate-x-0'}`}
            key={currentIndex}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 p-2 flex-grow">
              {currentPhotocards.map((photocard, index) => (
                <div 
                  key={`${currentIndex}-${index}`} 
                  className="flex-none w-full sm:w-36 h-40 cursor-pointer"
                  onClick={() => onPhotoCardClick(photocard)}
                >
                  {photocard.photoCardImage ? (
                    <div className="flip-container relative w-full h-full photocard rounded-lg overflow-hidden">
                      <div className="flip-card w-full h-full">
                        <div className="flip-card-front w-full h-full">
                          <img
                            src={photocard.photoCardImage}
                            alt={photocard.bookTitle || 'Photocard'}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full photocard bg-gray-200 rounded-lg"></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center mt-4 sm:mt-0 sm:ml-2">
              <button
                onClick={handleShowMore}
                className="text-blue-500 hover:text-blue-700 text-lg font-bold"
              >
                <span className="text-custom-highlight">&gt;</span> <span className="text-[0.875rem] sm:text-[1rem] text-[#868686] mr-4 sm:mr-12"> 더보기</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}