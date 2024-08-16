import { useState, useCallback, useEffect } from "react";
import HomePhotocard from "./Photocard/HomePhotoCard.jsx";
import Recommend from "./Recommend/Recommend.jsx";
import BookModal from "../components/BookModal.jsx";
import ShowCardModal from "./Photocard/ShowCardModal.jsx";
import useBookStore from "../store/bookStore.js";

export default function Home() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPhotoCard, setSelectedPhotoCard] = useState(null);
  const [showCardModalIsOpen, setShowCardModalIsOpen] = useState(false);

  const { books, searchResults, fetchBooks, searchBooks } = useBookStore();

  useEffect(() => {
    fetchBooks().catch((err) => console.error("Failed to fetch books:", err));
  }, []);

  const openModal = (book) => {
    setSelectedBook(book);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedBook(null);
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
    setModalIsOpen(true);
    setSearchQuery("");
  }, []);

  const handlePhotoCardClick = (photocard) => {
    setSelectedPhotoCard(photocard);
    setShowCardModalIsOpen(true);
  };

  const closeShowCardModal = () => {
    setShowCardModalIsOpen(false);
    setSelectedPhotoCard(null);
  };

  return (
    <div className="overflow-y-auto h-screen">
      <div className="mt-1 ml-2 max-w-6xl lg:px-1">
        <h2 className="font-bold text-2xl mb-2">
          가장 <span className="text-custom-highlight">인기</span> 많은{" "}
          <span className="text-custom-highlight">책</span>
        </h2>
        <div className="grid grid-cols-2 mb-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-1 pr-4 sm:pr-36">
          {books.slice(0, 8).map((book) => (
            <div key={book.isbn} className="flex flex-col items-center">
              <div className="w-20 h-24 sm:w-24 sm:h-28 gap-1">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-full object-fill cursor-pointer"
                  onClick={() => openModal(book)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <HomePhotocard onPhotoCardClick={handlePhotoCardClick} />
      <Recommend />
      <BookModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        book={selectedBook}
        searchQuery={searchQuery}
        handleInputChange={handleInputChange}
        handleSearch={handleSearch}
        suggestions={searchResults}
        handleSuggestionClick={handleSuggestionClick}
      />
      <ShowCardModal
        item={selectedPhotoCard}
        isOpen={showCardModalIsOpen}
        onClose={closeShowCardModal}
      />
    </div>
  );
}