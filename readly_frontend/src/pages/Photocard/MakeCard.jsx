import { useState, useCallback, useEffect } from "react";
import CustomRadioButton from "../../components/RadioButton/CustomRadioButton.jsx";
import "../../components/RadioButton/CustomRadioButton.css";
import GoButton from "../../components/GoButton/GoButton.jsx";
import FormField from "../../components/Form/FormField.jsx";
import AutoCompleteWrapper from "../../components/Form/AutoCompleteWrapper.jsx";
import Logo from "../../assets/logo/readly_logo.png";
import useBookStore from "../../store/bookStore";
import usePhotocardStore from "../../store/photocardStore";
import CardModal from "./CardModal.jsx";
import { CardGenerator } from "./CardGenerator.js";
import useUserStore from "../../store/userStore";
const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap";
const FONT_NAME = "Noto Sans KR";

export default function MakeCard() {
  const [bookInfo, setBookInfo] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [quote, setQuote] = useState("");
  const [visibility, setVisibility] = useState("A");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { user } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCardImage, setSelectedCardImage] = useState(null);
  const [infoCardImage, setInfoCardImage] = useState(null);
  const [combinedCardImage, setCombinedCardImage] = useState(null);
  const [selectedBookInfo, setSelectedBookInfo] = useState(null);

  const { searchResults, searchBooks, loading: isSearching } = useBookStore();
  const {
    photoCard,
    isLoading: isCreatingPhotocard,
    updatePhotoCard,
    createPhotoCard,
  } = usePhotocardStore();

  useEffect(() => {
    if (bookInfo.trim() !== "") {
      searchBooks(bookInfo);
    }
  }, [bookInfo, searchBooks]);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = FONT_URL;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    document.fonts.ready.then(() => {
      console.log("Fonts have loaded.");
    });
  }, []);

  const handleBookInfoChange = useCallback((e) => {
    const value = e.target.value;
    setBookInfo(value);
    setShowSuggestions(value.trim() !== "");
    setSelectedBook(null);
  }, []);

  const handleSuggestionClick = useCallback((book) => {
    console.log("Selected book:", book);
    setBookInfo(book.title);
    setSelectedBook(book);
    setShowSuggestions(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBook) {
      alert("책을 입력해주세요.");
      return;
    }
    if (!quote.trim()) {
      alert("글귀를 입력해주세요.");
      return;
    }

    try {
      await createPhotoCard(selectedBook.id, quote, visibility, user.id); // selectedBook.id 사용
      setSelectedBookInfo({
        title: selectedBook.title,
        author: selectedBook.author,
        quote: quote,
      });
    } catch (error) {
      console.error("Error creating photo card:", error);
      if (error.response && error.response.data) {
        console.error("Server error:", error.response.data);
        alert(
          `포토카드 생성에 실패했습니다. 오류: ${error.response.data.message}`
        );
      } else {
        alert("포토카드 생성에 실패했습니다. 서버 오류가 발생했습니다.");
      }
      return;
    }

    setBookInfo("");
    setSelectedBook(null);
    setQuote("");
    setVisibility("A");
  };
  const handleCardSelect = async (imageUrl) => {
    setSelectedCardImage(imageUrl);
    if (!selectedBookInfo || !photoCard) {
      alert(
        "책 정보나 포토카드 정보가 없습니다. 먼저 포토카드를 생성해주세요."
      );
      return;
    }
    try {
      const { infoCard, combinedCard } = await CardGenerator(
        selectedBookInfo.title,
        selectedBookInfo.author,
        selectedBookInfo.quote,
        FONT_NAME,
        imageUrl
      );
      setInfoCardImage(infoCard);
      setCombinedCardImage(combinedCard);
      setIsModalOpen(true);

      // PUT request to update the selected image
      await updatePhotoCard(imageUrl, photoCard.photoCardId);
    } catch (error) {
      console.error("Error creating or updating cards:", error);
      alert("카드 생성 또는 업데이트에 실패했습니다.");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row w-full h-full sm:h-4/5">
      <div className="w-full sm:w-2/5 p-4 mt-4 sm:mt-10 bg-[#F5F5F5] rounded-xl shadow-md relative">
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-12 font-bold">
          <AutoCompleteWrapper
            label="책 이름을 입력해주세요"
            value={bookInfo}
            onChange={handleBookInfoChange}
            suggestions={searchResults}
            onSuggestionClick={handleSuggestionClick}
            showSuggestions={showSuggestions && !isSearching}
          />
          <FormField
            label="글귀를 입력해주세요"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            multiline={true}
          />
          <div>
            <label className="block text-base sm:text-lg font-bold text-gray-700 mb-2">
              공개 범위
            </label>
            <div className="flex justify-start">
              <CustomRadioButton
                options={[
                  { value: "A", label: "공개" },
                  { value: "E", label: "비공개" },
                ]}
                selectedOption={visibility}
                onChange={setVisibility}
              />
            </div>
          </div>
          <div className="sm:absolute bottom-4 right-4 mt-6 sm:mt-0">
            <GoButton
              text="포토카드 제작"
              onClick={handleSubmit}
              disabled={isCreatingPhotocard}
            />
          </div>
        </form>
      </div>
      <div className="w-full sm:w-3/5 flex items-center justify-center mt-8 sm:mt-0">
        {isCreatingPhotocard ? (
          <div className="animate-bounce">
            <img src={Logo} alt="Loading" className="w-32 h-32 sm:w-48 sm:h-48" />
            <p className="text-center text-custom-highlight mt-2 text-xl sm:text-2xl">
              Loading ....
            </p>
          </div>
        ) : photoCard && photoCard.images && photoCard.images.length > 0 ? (
          <div className="w-full sm:w-3/4 px-4 sm:px-0">
            <div className="flex-grow grid grid-cols-2 gap-4 mb-4">
              {photoCard.images.map((imageUrl, index) => (
                <div
                  key={index}
                  className="relative aspect-w-3 aspect-h-4 cursor-pointer transition-transform duration-300 hover:scale-105"
                  onClick={() => handleCardSelect(imageUrl)}
                >
                  <img
                    src={imageUrl}
                    alt={`Generated image ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg shadow-md"
                  />
                </div>
              ))}
            </div>
            <p className="text-center mt-4 text-lg sm:text-xl font-bold text-[#878787]">
              마음에 드는 포토카드를 선택해주세요
            </p>
          </div>
        ) : (
          <p className="text-lg sm:text-xl text-[#7a7a7a] text-bold">
            포토카드가 여기에 나타납니다
          </p>
        )}
      </div>

      <CardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCard={selectedCardImage}
        infoCard={infoCardImage}
        combinedCard={combinedCardImage}
      />
    </div>
  );
}