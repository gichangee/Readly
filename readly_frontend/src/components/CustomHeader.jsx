import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import searchIcon from "../assets/header/search.png";
import infoIcon from "../assets/header/info_img.png";
import BookModal from "./BookModal";
import cloudImg from "../assets/header/cloudImg.png";
import useBookStore from "../store/bookStore";
import LogoutButton from "../pages/Login/Logout";
import useUserStore from "../store/userStore.js";
import TimecapsuleIcon from "./TimecapsuleIcon.jsx";

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

export default function CustomHeader() {
  const user = useUserStore((state) => state.user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const modalRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { searchResults, fetchBooks, searchBooks } = useBookStore();

  useEffect(() => {
    fetchBooks().catch((err) => console.error("Failed to fetch books:", err));
  }, [fetchBooks]);

  const openModal = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
    setShowSuggestions(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

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
    closeModal();
    setSearchQuery("");
    useBookStore.getState().setSearchResults([]);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    useBookStore.getState().setSearchResults([]);
    setShowSuggestions(false);
  }, []);

  const handleDropdownToggle = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMyPageClick = () => {
    navigate("/mypage");
    setIsDropdownOpen(false);
  };

  return (
    <header className="flex justify-between items-center py-1 px-3 ml-32 bg-white">
      <div className="flex-1 flex items-center">
        <img src={cloudImg} alt="클라우드" className="w-96 h-12 opacity-10" />
      </div>
      <div className="flex-1 flex justify-center">
        <div className="relative w-[20rem]">
          <input
            type="text"
            placeholder="검색할 책을 입력하세요"
            className="w-full px-3 py-1 pr-8 text-xs rounded-full border"
            onFocus={openModal}
          />
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onFocus={openModal}
          >
            <img src={searchIcon} alt="검색" className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 flex justify-end items-center mr-6 relative" ref={dropdownRef}>
        <div className="flex items-center space-x-8 mr-4"> {/* 간격을 8로 설정하여 더 넓게 조정 */}
          
          <TimecapsuleIcon /> 
          
          
        </div>
        <div className="flex" onClick={handleDropdownToggle}>
          <img
            src={infoIcon}
            alt="프로필"
            className="w-[3rem] h-6 rounded-lg mr-2 cursor-pointer"
          />
          <span className="text-base font-bold cursor-pointer">
            {user?.nickname || "닉네임"}
          </span>
        </div>
        {isDropdownOpen && (
          <div className="absolute right-0 top-10 mt-2 w-[9rem] bg-[#F2F2F2] rounded-lg shadow-lg z-20 w-[9rem] h-[6rem] flex flex-col justify-center">
            <div className="flex items-center px-4 py-2 hover:bg-gray-300 cursor-pointer">
              <button
                onClick={handleMyPageClick}
                className="text-sm ml-4 font-bold"
              >
                마이페이지
              </button>
            </div>
            <div className="w-full flex px-4 py-2">
              <LogoutButton textColor="#878787" textSize="sm" />
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-[#000000] bg-opacity-40 flex justify-center items-center z-10">
          <div
            ref={modalRef}
            className="bg-[#F5F5F5] rounded-lg shadow-lg p-6 relative"
            style={customModalStyles.content}
          >
            <div className="flex flex-col h-full">
              <div className="mb-4 relative ml-20 mr-20">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="검색할 책을 입력하세요"
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
                      {searchResults.map((book) => (
                        <li
                          key={book.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            handleSuggestionClick(book);
                            setShowSuggestions(false);
                          }}
                        >
                          {book.title}
                          <div className="border-b border-custom-border w-full"></div>
                        </li>
                      ))}
                    </ul>
                  )}
              </div>

              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <BookModal
        isOpen={isBookModalOpen}
        onRequestClose={() => {
          setIsBookModalOpen(false);
          clearSearch();
        }}
        book={selectedBook}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleInputChange={handleInputChange}
        handleSearch={handleSearch}
        suggestions={searchResults}
        setSuggestions={useBookStore.getState().setSearchResults}
        handleSuggestionClick={(book) => {
          handleSuggestionClick(book);
          clearSearch();
        }}
        clearSearch={clearSearch}
      />
    </header>
  );
}
