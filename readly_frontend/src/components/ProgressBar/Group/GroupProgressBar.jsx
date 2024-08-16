import { useState, useRef, useEffect } from 'react';
import GroupCurrentPageModal from './GroupCurrentPageModal';

export default function GroupProgressBar({ 
  currentPage, 
  totalPages,
  onUpdateCurrentPage, 
  isEditable, 
  memberName,
  openModal 
}) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const progressBarRef = useRef(null);

  useEffect(() => {
    console.log('GroupProgressBar props:', { currentPage, totalPages, isEditable, memberName });
  }, [currentPage, totalPages, isEditable, memberName]);

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleSave = (newPage) => {
    const parsedPage = parseInt(newPage, 10);
    if (!isNaN(parsedPage)) {
      onUpdateCurrentPage(parsedPage);
      closeModal();
    } else {
      console.error("Invalid page number");
    }
  };

  const percentage = currentPage && totalPages ? Math.round((currentPage / totalPages) * 100) : 0;

  return (
    <div ref={progressBarRef}>
      <div className="w-full h-10 bg-[#F8F8F8] rounded-full mt-1 overflow-hidden">
        <div
          className="h-full bg-[#E3F7FF] font-bold text-xs text-center text-black p-[0.7rem] leading-4"
          style={{ width: `${percentage}%` }}
        >
          {percentage}%
        </div>
      </div>
      <div className="flex justify-between text-xs mt-0.5">
        <button 
          onClick={isEditable ? openModal : undefined} 
          className={isEditable ? "cursor-pointer" : "cursor-default"}
        >
          p {currentPage || 0}
        </button>
        <span>p {totalPages || 100}</span>
      </div>

      <GroupCurrentPageModal 
        isOpen={modalIsOpen} 
        onRequestClose={closeModal} 
        onSave={handleSave}
        position={modalPosition}
        memberName={memberName}
      />
    </div>
  );
}