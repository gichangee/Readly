import { useState, useEffect } from "react";
import useUserStore from "../../store/userStore.js";
import Modal from "react-modal";
import axios from "axios";
import GoButton from "../../components/GoButton/GoButton.jsx";
import FormField from "../../components/Form/FormField.jsx";
import Logo from "../../assets/logo/readly_logo.png";
import normal from "../../assets/emoji/normal.png";
import joyful from "../../assets/emoji/joy.png";
import tired from "../../assets/emoji/tired.png";
import sad from "../../assets/emoji/sad.png";
import angry from "../../assets/emoji/angry.png";
import happy from "../../assets/emoji/happy.png";
import aladinLogo from "../../assets/onboard/aladinLogo.png";
import { BASE_URL } from "../../api/authAPI.js";
import {
  addBookToUser,
  fetchBookDetailsWithPhotoAndReview,
} from "../../api/bookAPI.js";
import SimpleReview from "../../components/Review/SimpleReview.jsx";
import { useNavigate } from "react-router-dom";

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

export default function Recommend() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [eventText, setEventText] = useState("");
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendedBooksInfo, setRecommendedBooksInfo] = useState([]);
  const [addBookStatus, setAddBookStatus] = useState(null);
  const [photoard, setPhotoard] = useState(null);
  const [review, setReview] = useState(null);

  useEffect(() => {
    fetchInitialRecommendation();
  }, []);

  const fetchInitialRecommendation = async () => {
    console.log(`Attempting to fetch initial book recommendation.`);
    try {
      const response = await axios.get(`${BASE_URL}/book/firstRecommand`);
      console.log("Full API response:", response);

      if (response.data && response.data.book) {
        const bookId = response.data.book.id;
        await fetchBookDetails(bookId);
      } else {
        console.error("Unexpected response format:", response.data);
      }

      return response.status;
    } catch (error) {
      console.error(
        "Error fetching initial book recommendation:",
        error.response ? error.response.data : error.message
      );
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchBookDetails = async (bookId) => {
    try {
      const data = await fetchBookDetailsWithPhotoAndReview(bookId);
      setBook(data.book);
      setPhotoard(data.photoard);
      setReview(data.review);
    } catch (error) {
      console.error("Error fetching book details:", error);
    }
  };

  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
  };

  const handleEventTextChange = (e) => {
    setEventText(e.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedEmotion) {
      alert("감정을 선택해주세요.");
      return;
    }

    setLoading(true);

    try {
      const query = `오늘은 ${selectedEmotion} 감정을 느꼈고, ${eventText}`;

      const aiResponse = await axios.post(
        `https://i11c207.p.ssafy.io/ai/recommand`,
        {
          query: query,
        }
      );

      console.log("AI 추천 응답:", aiResponse.data);
      const bookIds = aiResponse.data.bar.map((item) => item.foo);

      const bookInfoPromises = bookIds.map((id) =>
        axios
          .get(`${BASE_URL}/book/searchBook/${id}`)
          .then((res) => res.data)
          .catch((err) => {
            console.error(`Error fetching book info with id ${id}:`, err);
            return null;
          })
      );

      const booksInfo = await Promise.all(bookInfoPromises);
      setRecommendedBooksInfo(booksInfo.filter((info) => info !== null));
      setShowRecommendations(true);
    } catch (error) {
      console.error("에러 발생:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
      alert("추천을 받는 데 문제가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (bookToAdd) => {
    if (!bookToAdd || !user) {
      alert("책 정보가 없거나 로그인되지 않았습니다.");
      return;
    }
  
    setAddBookStatus("loading");
    try {
      await addBookToUser(user.id, bookToAdd.id);
      setAddBookStatus("success");
      alert("책이 성공적으로 등록되었습니다.");
      setModalIsOpen(false);  // 모달 닫기
      navigate('/mypage');  // '/mypage'로 이동
    } catch (error) {
      console.error("Error adding book:", error);
      setAddBookStatus("error");
      alert("책 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleGoToSharedBoard = () => {
    navigate("/sharedboard");
  };

  const emotions = [
    { text: "평범해요", emoji: normal },
    { text: "기뻐요", emoji: joyful },
    { text: "피곤해요", emoji: tired },
    { text: "슬퍼요", emoji: sad },
    { text: "화나요", emoji: angry },
    { text: "행복해요", emoji: happy },
  ];

  const openModal = () => {
    setModalIsOpen(true);
    setShowRecommendations(false);
  };

  const RecommendedBooks = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recommendedBooksInfo.map((info, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col h-full">
            <div className="mb-4">
              {info.book && info.book.image ? (
                <img
                  src={info.book.image}
                  alt={info.book.title}
                  className="w-full h-48 object-cover rounded"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded">
                  이미지 없음
                </div>
              )}
            </div>
            <h3 className="font-bold text-lg mb-2">
              {info.book?.title || "제목 없음"}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {info.book?.author || "저자 미상"}
            </p>
            <p className="text-sm text-gray-700 mb-4 flex-grow">
              {info.book?.detail?.slice(0, 100)}...
            </p>

            <div className="flex justify-between items-center mt-4">
              {info.book && info.book.purchase_link ? (
                <a
                  href={info.book.purchase_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <img
                    src={aladinLogo}
                    alt="알라딘으로 이동"
                    className="h-6 w-auto object-contain rounded-full"
                  />
                </a>
              ) : (
                <p className="text-xs text-gray-500">구매 링크 없음</p>
              )}
              <GoButton
                text="책 등록하기"
                onClick={() => handleAddBook(info.book)}
                className="ml-2"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className="ml-3 mb-2 lg:px-4">
        <h2 className="font-bold text-xl sm:text-2xl">
          <span>리들리</span> <span className="text-custom-highlight">AI</span>
          가 <span className="text-custom-highlight">추천</span>하는{" "}
          <span className="text-custom-highlight">책</span>
        </h2>
      </div>
      <div className="mx-auto max-w-5xl lg:px-6">
        <div className="flex flex-col sm:flex-row bg-[#F1EFEF] p-4 sm:p-6 rounded-lg shadow-md w-full">
          <div className="w-full sm:w-1/4 mb-4 sm:mb-0 sm:pr-6">
            <img
              src={book?.image}
              alt="Book Cover"
              className="w-full h-[13rem] rounded-md object-contain sm:object-cover"
            />
          </div>
          <div className="w-full sm:w-3/4 sm:pl-6">
            <div className="flex flex-col justify-between h-full">
              <div className="mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-0">
                    {book?.title}
                  </h3>
                  <button
                    onClick={openModal}
                    className="flex items-center text-blue-500"
                  >
                    <span className="text-sm text-[#868686] font-bold hover:underline">
                      다른 책을 원하시나요?{" "}
                    </span>
                    <span className="text-xl text-custom-highlight ml-2">
                      &gt;
                    </span>
                  </button>
                </div>
                <p className="text-md sm:text-lg mb-2">{book?.author}</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {book?.detail}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <a
                    href={book?.purchase_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block h-10 sm:h-12 hover:opacity-80 transition-opacity duration-200"
                  >
                    <img
                      src={aladinLogo}
                      alt="알라딘으로 이동"
                      className="h-full w-auto object-contain rounded-full"
                      style={{
                        filter: "drop-shadow(0px 0px 1px rgba(0,0,0,0.3))",
                      }}
                    />
                  </a>
                  <GoButton
                    text={
                      addBookStatus === "loading" ? "등록 중..." : "책 등록하기"
                    }
                    onClick={handleAddBook}
                    disabled={addBookStatus === "loading"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customModalStyles}
        contentLabel="다른 책 추천"
      >
        <div className="flex flex-col h-full w-full mx-auto sm:overflow-y-auto">
          <div className="flex justify-between items-center mb-8 sm:mb-16">
            <h2 className="font-bold text-xl sm:text-2xl">
              <span className="text-black">리들리</span>{" "}
              <span className="text-custom-highlight">AI</span>가{" "}
              <span className="text-custom-highlight">추천</span>하는{" "}
              <span className="text-custom-highlight">책</span>
            </h2>
            <button
              onClick={() => setModalIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>

          {loading ? (
            <div className="flex-grow flex items-center justify-center">
              <div className="animate-bounce">
                <img
                  src={Logo}
                  alt="Loading"
                  className="w-32 h-32 sm:w-48 sm:h-48"
                />
                <p className="text-center text-custom-highlight mt-2 text-xl sm:text-2xl">
                  Loading ....
                </p>
              </div>
            </div>
          ) : showRecommendations ? (
            <RecommendedBooks />
          ) : (
            <div className="flex flex-col sm:flex-row justify-between items-start w-full mt-8 sm:mt-12">
              <div className="w-full sm:w-1/2 sm:pr-12 flex flex-col items-center mb-8 sm:mb-0">
                <h3 className="text-lg sm:text-xl mb-6 sm:mb-8 text-center font-bold">
                  <span className="text-custom-highlight">오늘</span> 느꼈던{" "}
                  <span className="text-custom-highlight">감정</span>을
                  골라주세요
                </h3>
                <div className="grid grid-cols-3 gap-x-4 sm:gap-x-8 gap-y-4 sm:gap-y-6">
                  {emotions.map((emotion, index) => (
                    <button
                      key={index}
                      className={`flex flex-col items-center ${
                        selectedEmotion === emotion.text
                          ? "ring-2 ring-blue-500 rounded-lg"
                          : ""
                      }`}
                      onClick={() => handleEmotionSelect(emotion.text)}
                    >
                      <img
                        src={emotion.emoji}
                        alt={emotion.text}
                        className="w-12 h-12 sm:w-16 sm:h-16 mb-2"
                      />
                      <span className="text-xs sm:text-sm font-bold text-[#868686]">
                        {emotion.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="w-full sm:w-1/2 sm:pl-12 flex flex-col">
                <h3 className="text-md mb-6 sm:mb-8 font-bold text-[#767676]">
                  오늘 어떤 일이 있으셨나요?
                </h3>
                <FormField
                  label="있었던 일을 알려주세요"
                  value={eventText}
                  onChange={handleEventTextChange}
                  multiline={true}
                />
                <div className="flex justify-end mt-4">
                  <GoButton
                    text="AI에게 추천받기"
                    className="w-auto px-4 py-2 text-sm"
                    onClick={handleSubmit}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
