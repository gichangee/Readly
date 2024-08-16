import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import GoButton from "../../components/GoButton/GoButton.jsx";
import GroupCreateReview from "../../components/Review/GroupCreateReview.jsx";
import useUserStore from "../../store/userStore.js";
import GroupProgressBar from "../../components/ProgressBar/Group/GroupProgressBar.jsx";
import GroupCurrentPageModal from "../../components/ProgressBar/Group/GroupCurrentPageModal.jsx";
import GroupBookModal from "../../components/GroupBookModal.jsx";
import BookModal from "../../components/BookModal.jsx";
import useBookStore from "../../store/bookStore";
import { postReview } from "../../api/reviewAPI";
import { BASE_URL } from "../../api/authAPI.js";

const getLayoutClasses = (memberCount) => {
  if (memberCount <= 4) {
    return {
      container: "w-3/5",
      grid: "grid-cols-1",
      padding: "",
    };
  } else if (memberCount <= 8) {
    return {
      container: "w-full",
      grid: "grid-cols-2",
      padding: "pr-0",
    };
  } else {
    return {
      container: "w-full",
      grid: "grid-cols-3",
      padding: "pr-0",
    };
  }
};

export default function ActivityProgress({ groupId }) {
  const [bookInfo, setBookInfo] = useState(null);
  const [readBooks, setReadBooks] = useState([]);
  const [reviewInput, setReviewInput] = useState("");
  const [reviewModalIsOpen, setReviewModalIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [currentPageModalIsOpen, setCurrentPageModalIsOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const { token, user } = useUserStore();
  const { books, searchResults, fetchBooks, searchBooks } = useBookStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);

  const layoutClasses = getLayoutClasses(readBooks.length);

  useEffect(() => {
    fetchBooks().catch((err) => console.error("Failed to fetch books:", err));
  }, [fetchBooks]);

  const fetchGroupData = async () => {
    if (!groupId) {
      console.log("GroupId is not available yet");
      return;
    }

    setError(null);
    try {
      console.log(`Fetching data for groupId: ${groupId}`);
      const response = await axios.get(
        `${BASE_URL}/group/read-books/${groupId}`
      );
      console.log("API Response1:", response.data);

      if (response.data && response.data.bookInfo && response.data.readBooks) {
        setBookInfo(response.data.bookInfo);
        const updatedReadBooks = response.data.readBooks.map((book) => ({
          ...book,
          currentPage: book.currentPage || 0,
        }));
        setReadBooks(updatedReadBooks);
      } else {
        console.error("Invalid data structure in API response");
        setError("데이터 구조가 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("Error fetching group data:", error);
      setError("데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    fetchGroupData();
  }, [groupId, token]);

  const updateCurrentPage = async (memberId, newPage) => {
    try {
      await axios.patch(`${BASE_URL}/user/update-page`, {
        bookId: bookInfo.book_id,
        memberId,
        currentPage: newPage,
      });

      setReadBooks((prevReadBooks) =>
        prevReadBooks.map((book) =>
          book.member_id === memberId ? { ...book, currentPage: newPage } : book
        )
      );
      console.log(`Updated page for member ${memberId} to ${newPage}`);

      const storedPages = JSON.parse(
        localStorage.getItem(`group_${groupId}_pages`) || "{}"
      );
      storedPages[memberId] = newPage;
      localStorage.setItem(
        `group_${groupId}_pages`,
        JSON.stringify(storedPages)
      );

      fetchGroupData();
    } catch (error) {
      console.error("Error updating current page:", error);
    }
  };

  const handleReviewInputChange = (e) => {
    setReviewInput(e.target.value);
  };

  const openReviewModal = () => {
    setReviewModalIsOpen(true);
  };

  const closeReviewModal = () => {
    setReviewModalIsOpen(false);
  };

  const openCurrentPageModal = (memberId, event) => {
    if (memberId === user.id) {
      const rect = event.target.getBoundingClientRect();
      setModalPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
      setSelectedMemberId(memberId);
      setCurrentPageModalIsOpen(true);
    }
  };

  const closeCurrentPageModal = () => {
    setSelectedMemberId(null);
    setCurrentPageModalIsOpen(false);
  };

  const handleSaveCurrentPage = async (newPage) => {
    await updateCurrentPage(selectedMemberId, parseInt(newPage, 10));
    closeCurrentPageModal();
  };

  const handleCreateReview = async ({ bookId, reviewText, visibility }) => {
    try {
      console.log("Submitting review:", { bookId, reviewText, visibility });
      const result = await postReview(
        user.id,
        bookId,
        reviewText,
        visibility === "A" // 'A'는 공개, 'E'는 비공개
      );

      console.log("Review submission result:", result);

      if (result.status === "success") {
        setReviewInput("");
        closeReviewModal();
        fetchGroupData(); // 리뷰 생성 후 그룹 데이터를 다시 가져옵니다.
      } else {
        console.error("Failed to create review:", result.message);
        alert(`리뷰 생성에 실패했습니다: ${result.message}`);
      }
    } catch (error) {
      console.error("Error creating review:", error);
      alert("리뷰 생성 중 오류가 발생했습니다.");
    }
  };

  const handleInputChange = useCallback(
    (e) => {
      setSearchQuery(e.target.value);
      if (e.target.value) {
        searchBooks(e.target.value);
      }
    },
    [searchBooks]
  );

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      searchBooks(searchQuery);
    },
    [searchQuery, searchBooks]
  );

  const handleSuggestionClick = useCallback((book) => {
    setSelectedBook(book);
    setIsBookModalOpen(true);
    setSearchQuery("");
  }, []);

  const handleAddBook = async (book) => {
    try {
      console.log("Book being added:", book);
      const requestData = {
        oldBookId: bookInfo ? bookInfo.book_id : null,
        groupId: groupId,
        bookId: book.id,
      };
      console.log("Request data:", requestData);
  
      const response = await axios.post(`${BASE_URL}/group/add`, requestData);
      console.log("Server response:", response.data);
  
      // 기존 bookInfo를 유지하면서 새로운 책 정보만 업데이트
      setBookInfo(prevBookInfo => ({
        ...prevBookInfo,
        book_id: book.id,
        book_title: book.title,
        book_author: book.author,
        book_totalPage: book.total_page || prevBookInfo.book_totalPage,
        book_image: book.image || prevBookInfo.book_image,
      }));
  
      // readBooks 상태 업데이트 (기존 진행도 유지)
      setReadBooks(prevReadBooks => prevReadBooks.map(readBook => ({
        ...readBook,
        currentPage: 0, // 새 책으로 변경되었으므로 진행도 초기화
      })));
  
      // 성공 메시지 표시
      alert(`책이 "${book.title}"로 변경되었습니다. 모든 멤버의 진행도가 초기화되었습니다.`);
  
      // 모달 닫기
      setIsBookModalOpen(false);
  
      // 페이지 새로고침
      window.location.reload();
  
    } catch (error) {
      console.error("Error adding book to group:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
        alert(`책 추가 실패: ${error.response.data.errorMessage || '알 수 없는 오류가 발생했습니다.'}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("서버로부터 응답을 받지 못했습니다. 네트워크 연결을 확인해주세요.");
      } else {
        console.error("Error setting up request:", error.message);
        alert("요청 설정 중 오류가 발생했습니다.");
      }
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (!bookInfo) return <div>Loading...</div>;

  return (
    <>
      <h2 className="font-bold text-xl mb-1 mt-5">
        현재 <span className="text-custom-highlight">읽고 있는</span> 책
      </h2>
      <div className={`container mx-auto p-4 ${layoutClasses.padding}`}>
        <div
          className={`bg-white p-4 rounded-lg flex z-100 ${layoutClasses.container}`}
        >
          <div>
            <img
              src={bookInfo.book_image}
              alt={bookInfo.book_title}
              className="w-[8rem] h-[12rem] mr-4"
            />
            <div className="mt-4 flex justify-start">
              <GoButton
                text="책 등록하기"
                onClick={() => setIsBookModalOpen(true)}
              />
            </div>
          </div>
          <div className={`flex-1 ml-4 ${readBooks.length > 4 ? "pr-4" : ""}`}>
            <h3 className="font-bold mb-2">{bookInfo.book_title}</h3>
            <p className="mb-2">{bookInfo.book_author}</p>
            <div className={`grid ${layoutClasses.grid} gap-2`}>
              {readBooks.map((book) => (
                <div key={book.member_id} className="flex items-center">
                  <p
                    className={`mr-2 w-16 truncate text-sm ${
                      book.member_id === user.id
                        ? "text-[#000000] cursor-pointer font-bold"
                        : "text-[#dadada]"
                    }`}
                    onClick={(event) =>
                      openCurrentPageModal(book.member_id, event)
                    }
                  >
                    {book.member_info.member_name}
                  </p>
                  <div className="flex-1">
                    <GroupProgressBar
                      key={`progress-${book.member_id}`}
                      currentPage={book.currentPage}
                      totalPages={bookInfo.book_totalPage}
                      onUpdateCurrentPage={(newPage) =>
                        updateCurrentPage(book.member_id, newPage)
                      }
                      isEditable={book.member_id === user.id}
                      memberName={book.member_info.member_name}
                      openModal={(event) =>
                        openCurrentPageModal(book.member_id, event)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2 className="font-bold mb-2 text-xl">
          <span className="text-custom-highlight">책 </span>에 대한{" "}
          <span className="text-custom-highlight">한줄평</span>을 남기고
          싶으신가요?
        </h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="w-[30rem] mt-1 p-2 border rounded-lg"
            placeholder="한줄평을 입력해주세요"
            value={reviewInput}
            onChange={handleReviewInputChange}
          />
          <GoButton text="생성" onClick={openReviewModal} />
        </div>
      </div>

      <GroupCurrentPageModal
        isOpen={currentPageModalIsOpen}
        onRequestClose={closeCurrentPageModal}
        onSave={handleSaveCurrentPage}
        position={modalPosition}
        memberName={
          readBooks.find((book) => book.member_id === selectedMemberId)
            ?.member_info.member_name || ""
        }
      />

      <GroupCreateReview
        isOpen={reviewModalIsOpen}
        onRequestClose={closeReviewModal}
        book={{
          bookId: bookInfo.book_id,
          title: bookInfo.book_title,
          author: bookInfo.book_author,
          cover: bookInfo.book_image,
          totalPages: bookInfo.book_totalPage,
        }}
        reviewText={reviewInput}
        onReviewSubmit={handleCreateReview}
      />

      <GroupBookModal
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
        groupId={groupId}
        oldBookId={bookInfo ? bookInfo.book_id : null}
        addButtonText="그룹에 책 등록하기"
      />
    </>
  );
}
