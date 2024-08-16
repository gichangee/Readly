import { useState, useCallback, useEffect, useRef } from "react";
import Modal from "react-modal";
import axios from "axios";
import searchIcon from "../assets/header/search.png";
import useBookStore from "../store/bookStore";
import BookModal from "./BookModal";
import useUserStore from "../store/userStore";
import { BASE_URL } from '../api/authAPI';
import GroupBookModal from "./GroupBookModal.jsx"
const customModalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: "10",
  },
  content: {
    width: "90%",
    maxWidth: "800px",
    height: "90vh",
    margin: "auto",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.25)",
    backgroundColor: "#F5F5F5",
    overflow: "auto",
  },
};

export default function GroupBookSearch({ isOpen, onRequestClose, groupId, currentBookId, onBookRegister }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const inputRef = useRef(null);

  const { searchResults, searchBooks } = useBookStore();
  const { token } = useUserStore();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchQuery(value);
      setShowSuggestions(value.trim() !== "");
      if (value) {
        searchBooks(value);
      } else {
        useBookStore.getState().setSearchResults([]);
      }
    },
    [searchBooks]
  );

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      if (searchQuery) {
        searchBooks(searchQuery);
      }
    },
    [searchQuery, searchBooks]
  );

  const handleSuggestionClick = useCallback((book) => {
    setSelectedBook(book);
    setIsBookModalOpen(true);
    setShowSuggestions(false);
  }, []);

  const handleBookRegister = useCallback(
    async (book) => {
      try {
        await onBookRegister(book);
        setIsBookModalOpen(false);
        onRequestClose();
      } catch (error) {
        console.error("Error registering book:", error);
        // 여기에 에러 처리 로직 추가
      }
    },
    [onBookRegister, onRequestClose]
  );

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customModalStyles}
      contentLabel="Group Book Search Modal"
      shouldCloseOnOverlayClick={true}
    >
      <div className="flex flex-col h-full">
        <div className="mb-4 relative ml-20 mr-20">
          <form onSubmit={handleSearch} className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="그룹에 등록할 책을 검색하세요"
              className="w-full px-3 py-2 pr-8 text-sm rounded-full border"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => setShowSuggestions(true)}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <img src={searchIcon} alt="검색" className="w-5 h-5" />
            </button>
          </form>
          {showSuggestions &&
            searchQuery.trim() !== "" &&
            searchResults.length > 0 && (
              <ul className="bg-[#F5F5F5] border rounded-lg shadow-lg mt-1 absolute z-10 w-full">
                {searchResults.map((book, index) => (
                  <li
                    key={`${book.id || 'book'}-${index}`}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSuggestionClick(book)}
                  >
                    {book.title}
                    <div className="border-b border-custom-border w-full"></div>
                  </li>
                ))}
              </ul>
            )}
        </div>

        <button
          onClick={onRequestClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <span className="text-2xl">&times;</span>
        </button>
      </div>

      {selectedBook && (
        <GroupBookModal
          isOpen={isBookModalOpen}
          onRequestClose={() => setIsBookModalOpen(false)}
          book={selectedBook}
          onAddBook={handleBookRegister}
          searchQuery={searchQuery}
          handleInputChange={handleInputChange}
          handleSearch={handleSearch}
          suggestions={searchResults}
          handleSuggestionClick={handleSuggestionClick}
          clearSearch={() => setSearchQuery("")}
          groupId={groupId}
          oldBookId={currentBookId}
        />
      )}
    </Modal>
  );
}