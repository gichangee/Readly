import { useState, useRef, useEffect } from "react";
import Modal from "react-modal";
import GoButton from "../components/GoButton/GoButton.jsx";
import aladinLogo from "../assets/onboard/aladinLogo.png";
import searchIcon from "../assets/header/search.png";
import useBookStore from "../store/bookStore.js";
import useUserStore from "../store/userStore.js";
import { useNavigate } from "react-router-dom";
import {
  addBookToGroup,
  fetchBookDetailsWithPhotoAndReview,
} from "../api/bookAPI.js";
import SimpleReview from "./Review/SimpleReview.jsx";

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
export default function GroupBookModal({
  isOpen,
  onRequestClose,
  book,
  searchQuery,
  handleInputChange,
  handleSearch,
  suggestions,
  handleSuggestionClick,
  clearSearch,
  onAddBook,
  groupId,
  oldBookId,
  addButtonText = "책 등록하기",
}) {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [bookDetails, setBookDetails] = useState(null);
  const [photoard, setPhotoard] = useState(null);
  const [review, setReview] = useState(null);

  const modalRef = useRef(null);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [addBookStatus, setAddBookStatus] = useState(null);

  useEffect(() => {
    setLocalSearchQuery(""); // 모달이 열릴 때마다 검색 쿼리 초기화
  }, [isOpen]);

  useEffect(() => {
    if (book && book.id) {
      fetchBookDetails(book.id);
    }
  }, [book]);

  const fetchBookDetails = async (bookId) => {
    try {
      const data = await fetchBookDetailsWithPhotoAndReview(bookId);
      setBookDetails(data.book);
      setPhotoard(data.photoard);
      setReview(data.review);
    } catch (error) {
      console.error("Error fetching book details:", error);
    }
  };

  const handleLocalInputChange = (e) => {
    const newValue = e.target.value;
    setLocalSearchQuery(newValue);
    handleInputChange(e);
    setShowSuggestions(newValue.trim() !== "");
  };

  const handleLocalSuggestionClick = async (suggestion) => {
    console.log("선택된 책:", suggestion);
    handleSuggestionClick(suggestion);
    await fetchBookDetails(suggestion.id);
    setLocalSearchQuery("");
    setShowSuggestions(false);
  };

  const handleAddBook = async () => {
    console.log("handleAddBook 함수 호출됨");
    setAddBookStatus("loading");
    try {
      if (!bookDetails) {
        console.error("Book object is missing");
        throw new Error("Book object is missing");
      }
      if (groupId === undefined || groupId === null) {
        console.error("groupId is missing");
        throw new Error("groupId is missing");
      }
      // oldBookId는 없을 수 있으므로 검증하지 않습니다.
      
      console.log("그룹에 책 추가 시도:", {
        oldBookId,
        groupId,
        bookId: bookDetails.id,
      });
      console.log("addBookToGroup 함수 호출 직전");
      const result = await addBookToGroup(oldBookId, groupId, bookDetails.id);
      console.log("addBookToGroup 함수 호출 완료, 결과:", result);
      setAddBookStatus("success");
      console.log("onAddBook 함수 호출 직전");
      onAddBook(bookDetails);
      console.log("onAddBook 함수 호출 완료");
      onRequestClose();
    } catch (error) {
      console.error("Error adding book to group:", error);
      setAddBookStatus("error");
      alert("책을 그룹에 추가하는 데 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleGoToSharedBoard = () => {
    navigate("/sharedboard");
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customModalStyles}
      ariaHideApp={false}
    >
      <div ref={modalRef} className="flex flex-col h-full">
        <SearchForm
          searchQuery={localSearchQuery}
          handleInputChange={handleLocalInputChange}
          handleSearch={handleSearch}
          suggestions={suggestions}
          handleSuggestionClick={handleLocalSuggestionClick}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
        />
        {bookDetails && (
          <>
            <div className="flex flex-col md:flex-row mt-2">
              <div className="w-32 h-40">
                <img
                  src={bookDetails.image}
                  alt={bookDetails.title}
                  className="w-full h-full object-fill"
                />
              </div>
              <div className="md:w-3/4 md:pl-2 mt-2 md:mt-0">
                <h2 className="text-lg font-bold mb-1">{bookDetails.title}</h2>
                <p className="text-gray-600 text-sm mb-4">
                  작가: {bookDetails.author}
                </p>
                <p className="text-xs mb-2 max-h-16 overflow-y-auto">
                  {bookDetails.detail}
                </p>
              </div>
            </div>

            <div className="w-full my-4">
              <div className="border-b border-gray-300 w-full"></div>
            </div>

            <div className="flex flex-col">
              <h2 className="font-bold text-xl">
                가장 <span className="text-custom-highlight">인기</span> 많은{" "}
                <span className="text-custom-highlight">콘텐츠</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center h-[20rem]">
                  {photoard ? (
                    <>
                      <img
                        src={photoard.photoCardImage}
                        alt="포토카드"
                        className="w-48 h-full object-cover rounded-[20px]"
                      />
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">
                      포토카드가 없습니다.
                    </p>
                  )}
                  <button
                    className="text-[#848484] px-4 py-2 rounded-full text-sm font-bold mt-auto"
                    onClick={handleGoToSharedBoard}
                  >
                    포토카드 더 보러가기
                  </button>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center h-[20rem]">
                  {review ? (
                    <SimpleReview
                      bookImage={bookDetails.image}
                      reviewText={review.reviewText}
                    />
                  ) : (
                    <p className="text-sm text-gray-500">한줄평이 없습니다.</p>
                  )}
                  <button
                    className="text-[#848484] px-4 py-2 rounded-full text-sm font-bold mt-auto"
                    onClick={handleGoToSharedBoard}
                  >
                    한줄평 더 보러가기
                  </button>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg flex flex-col h-64 justify-between items-end">
                  <div className="self-start w-full">
                    <h2 className="font-bold text-xl mb-4">
                      <span className="text-custom-highlight">구매</span>를
                      원하시나요?
                    </h2>
                    <div className="pr-8 flex justify-end">
                      <a
                        href={bookDetails.purchase_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block h-12 rounded-full overflow-hidden hover:opacity-80 transition-opacity duration-200"
                      >
                        <img
                          src={aladinLogo}
                          alt="알라딘으로 이동"
                          className="h-full w-auto object-contain"
                        />
                      </a>
                    </div>
                  </div>
                  <div className="w-full mt-[10rem] flex justify-end">
                    <div className="w-full">
                      <GoButton
                        text={
                          addBookStatus === "loading"
                            ? "등록 중..."
                            : addButtonText
                        }
                        className="w-full"
                        onClick={() => {
                          console.log("GoButton 클릭됨");
                          handleAddBook();
                        }}
                        disabled={addBookStatus === "loading"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <button
          onClick={() => {
            onRequestClose();
            clearSearch();
          }}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <span className="text-2xl">&times;</span>
        </button>
      </div>
    </Modal>
  );
}

function SearchForm({
  searchQuery,
  handleInputChange,
  handleSearch,
  suggestions,
  handleSuggestionClick,
  showSuggestions,
  setShowSuggestions,
}) {
  return (
    <div className="mb-4 relative ml-20 mr-20">
      <form onSubmit={handleSearch} className="relative">
        <input
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
        suggestions.length > 0 && (
          <ul className="bg-[#F5F5F5] border rounded-lg shadow-lg mt-1 absolute z-10 w-full">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.bookId}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  handleSuggestionClick(suggestion);
                  setShowSuggestions(false);
                }}
              >
                {suggestion.title}
                <div className="border-b border-custom-border w-full"></div>
              </li>
            ))}
          </ul>
        )}
    </div>
  );
}
