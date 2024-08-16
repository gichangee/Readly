import { useState, useEffect } from "react";
import axios from "axios";
import GoButton from "../../components/GoButton/GoButton.jsx";
import useUserStore from "../../store/userStore.js";
import ProgressBar from "../../components/ProgressBar/ProgressBar.jsx";
import CurrentPageModal from "../../components/ProgressBar/CurrentPageModal.jsx";
import BookModal from "../../components/BookModal.jsx";
import useBookStore from "../../store/bookStore";
import CreateReview from "../../components/Review/CreateReview";
import { postReview } from "../../api/reviewAPI";
import { BASE_URL } from '../../api/authAPI.js';

export default function MyPageProgress({ userId }) {
  const [proceedingBooks, setProceedingBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [error, setError] = useState(null);
  const [currentPageModalIsOpen, setCurrentPageModalIsOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const { token, user } = useUserStore();
  const { searchResults, fetchBooks, searchBooks } = useBookStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [reviewInputs, setReviewInputs] = useState({});
  const [reviewModalIsOpen, setReviewModalIsOpen] = useState(false);

  useEffect(() => {
    fetchBooks().catch((err) => console.error("Failed to fetch books:", err));
  }, [fetchBooks]);

  const fetchProceedingBooks = async () => {
    if (!userId) {
      console.log("UserId is not available yet");
      return;
    }

    setError(null);
    try {
      console.log(`Fetching data for userId: ${userId}`);
      const response = await axios.get(
        `${BASE_URL}/member/proceeding-books/${userId}`,
      );
      console.log("API Response:", response.data);

      if (response.data && response.data.proceedingBooks) {
        setProceedingBooks(response.data.proceedingBooks);
      } else {
        console.error("Invalid data structure in API response");
        setError("데이터 구조가 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("Error fetching proceeding books:", error);
      setError("데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    fetchProceedingBooks();
  }, [userId, token]);

  const updateCurrentPage = async (bookId, newPage) => {
    console.log(`Updating page for bookId: ${bookId}, newPage: ${newPage}`);
    try {
      const requestData = {
        bookId: bookId,
        memberId: userId,
        currentPage: newPage,
      };
      console.log("Update request data:", requestData);

      const response = await axios.put(
        `${BASE_URL}/member/proceeding-books/update`,
        requestData,
      );
      console.log("Update response:", response.data);

      setProceedingBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.bookId === bookId ? { ...book, currentPage: newPage } : book
        )
      );
      console.log(`Updated page for book ${bookId} to ${newPage}`);

      fetchProceedingBooks();
    } catch (error) {
      console.error("Error updating current page:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
      }
    }
  };

  const openCurrentPageModal = (bookId, event) => {
    console.log(`Opening modal for bookId: ${bookId}`);
    const rect = event.target.getBoundingClientRect();
    setModalPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setSelectedBook(proceedingBooks.find((book) => book.bookId === bookId));
    setCurrentPageModalIsOpen(true);
  };

  const closeCurrentPageModal = () => {
    console.log("Closing current page modal");
    setSelectedBook(null);
    setCurrentPageModalIsOpen(false);
  };

  const handleSaveCurrentPage = async (newPage) => {
    console.log(`Saving new page: ${newPage}`);
    if (selectedBook) {
      await updateCurrentPage(selectedBook.bookId, parseInt(newPage, 10));
    }
    closeCurrentPageModal();
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value) {
      searchBooks(e.target.value);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchBooks(searchQuery);
  };

  const handleSuggestionClick = (book) => {
    setSelectedBook(book);
    setIsBookModalOpen(true);
    setSearchQuery("");
  };

  const handleAddBook = async (book) => {
    try {
      console.log("Book being added:", book);
      const requestData = {
        memberId: userId,
        bookId: book.bookId,
      };
      console.log("Add book request data:", requestData);

      const response = await axios.post(
        `${BASE_URL}/user/add`,
        requestData,
      );
      console.log("Add book response:", response.data);

      fetchProceedingBooks();
    } catch (error) {
      console.error("Error adding book to user's list:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
      throw error;
    }
  };

  const openReviewModal = (book) => {
    setSelectedBook(book);
    setReviewInputs((prev) => ({
      ...prev,
      [book.bookId]: prev[book.bookId] || "",
    }));
    setReviewModalIsOpen(true);
  };

  const closeReviewModal = () => {
    setSelectedBook(null);
    setReviewModalIsOpen(false);
  };

  const handleReviewInputChange = (bookId, value) => {
    setReviewInputs((prev) => ({ ...prev, [bookId]: value }));
  };

  const handleCreateReview = async ({ bookId, reviewText, visibility }) => {
    try {
      console.log("Submitting review:", { bookId, reviewText, visibility });
      const result = await postReview(
        userId,
        bookId,
        reviewText,
        visibility === "A" // 'A'는 공개, 'E'는 비공개
      );

      console.log("Review submission result:", result);

      if (result.status === "success") {
        setProceedingBooks(
          proceedingBooks.map((book) =>
            book.bookId === bookId ? { ...book, review: reviewText } : book
          )
        );
        setReviewInputs((prev) => ({ ...prev, [bookId]: "" }));
        closeReviewModal();
      } else {
        console.error("Failed to create review:", result.message);
        alert(`리뷰 생성에 실패했습니다: ${result.message}`);
      }
    } catch (error) {
      console.error("Error creating review:", error);
      alert("리뷰 생성 중 오류가 발생했습니다.");
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (proceedingBooks.length === 0) return <div>Loading...</div>;

  return (
    <div className="container mx-auto">
      <h2 className="font-bold text-xl mb-4 mt-5">
        현재 <span className="text-custom-highlight">읽고 있는</span> 책
      </h2>
      {proceedingBooks.map((book) => (
        <div
          key={book.bookId}
          className="bg-white p-4 rounded-lg mb-4 flex z-100 w-4/7"
        >
          <div>
            <img
              src={book.image}
              alt={book.title}
              className="w-[8rem] h-[12rem] mr-4"
            />
          </div>
          <div className="flex-1 ml-4">
            <h3 className="font-bold mb-2">{book.title}</h3>
            <p>{book.author}</p>
            <div className="flex items-center">
              <div className="w-3/6">
                <ProgressBar
                  currentPage={book.currentPage}
                  totalPages={book.totalPages}
                  onUpdateCurrentPage={(newPage) =>
                    updateCurrentPage(book.bookId, newPage)
                  }
                />
              </div>
            </div>
            <div>
              <h2 className="font-bold mt-2">
                <span className="text-custom-highlight">책 </span>에 대한{" "}
                <span className="text-custom-highlight">한줄평</span>을 남기고
                싶으신가요?
              </h2>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="w-[30rem] mt-1 p-2 border rounded-lg"
                  placeholder="한줄평을 입력해주세요"
                  value={reviewInputs[book.bookId] || ""}
                  onChange={(e) =>
                    handleReviewInputChange(book.bookId, e.target.value)
                  }
                />
                <GoButton text="생성" onClick={() => openReviewModal(book)} />
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="mt-4 flex justify-start">
        <GoButton text="책 등록하기" onClick={() => setIsBookModalOpen(true)} />
      </div>

      <CurrentPageModal
        isOpen={currentPageModalIsOpen}
        onRequestClose={closeCurrentPageModal}
        onSave={handleSaveCurrentPage}
        position={modalPosition}
      />

      {selectedBook && (
        <CreateReview
          isOpen={reviewModalIsOpen}
          onRequestClose={closeReviewModal}
          book={selectedBook}
          reviewText={reviewInputs[selectedBook.bookId] || ""}
          onReviewSubmit={handleCreateReview}
        />
      )}

      <BookModal
        isOpen={isBookModalOpen}
        onRequestClose={() => setIsBookModalOpen(false)}
        book={selectedBook}
        searchQuery={searchQuery}
        handleInputChange={handleInputChange}
        handleSearch={handleSearch}
        suggestions={searchResults}
        handleSuggestionClick={handleSuggestionClick}
        clearSearch={() => setSearchQuery("")}
        onAddBook={handleAddBook}
        addButtonText="내 책장에 추가하기"
      />
    </div>
  );
}
