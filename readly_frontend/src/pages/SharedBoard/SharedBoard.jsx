import { useState, useEffect } from "react";
import CustomRadioButton from "../../components/RadioButton/CustomRadioButton";
import GridDisplay from "./GridDisplay.jsx";
import usePhotocardStore from "../../store/photocardStore";
import useReviewStore from "../../store/reviewStore";
import Pagination from "../../components/Pagination/Pagination";

export default function SharedBoard() {
  const {
    photocards,
    loading: photocardsLoading,
    error: photocardsError,
    fetchPhotocards,
    setOrderType: setPhotocardOrderType,
    setSearchType: setPhotocardSearchType,
    currentPage: photocardCurrentPage,
    totalPages: photocardTotalPages,
  } = usePhotocardStore();

  const {
    reviews,
    loading: reviewsLoading,
    error: reviewsError,
    fetchReviews,
    setOrderType: setReviewOrderType,
    setSearchType: setReviewSearchType,
    currentPage: reviewCurrentPage,
    totalPages: reviewTotalPages,
  } = useReviewStore();

  const [activeLink, setActiveLink] = useState("photocard");

  useEffect(() => {
    if (activeLink === "photocard") {
      fetchPhotocards(photocardCurrentPage);
    } else {
      fetchReviews(reviewCurrentPage);
    }
  }, [activeLink, photocardCurrentPage, reviewCurrentPage]);

  const handleOrderChange = (value) => {
    const orderType = "DESC";
    const searchType = value === "latest" ? "TimeStamp" : "Like";
    
    if (activeLink === "photocard") {
      setPhotocardOrderType(orderType);
      setPhotocardSearchType(searchType);
      fetchPhotocards(1);
    } else {
      setReviewOrderType(orderType);
      setReviewSearchType(searchType);
      fetchReviews(1);
    }
  };

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const handlePageChange = (page) => {
    if (activeLink === "photocard") {
      fetchPhotocards(page);
    } else {
      fetchReviews(page);
    }
  };

  const loading = activeLink === "photocard" ? photocardsLoading : reviewsLoading;
  const error = activeLink === "photocard" ? photocardsError : reviewsError;
  const items = activeLink === "photocard" ? photocards : reviews;
  const currentPage = activeLink === "photocard" ? photocardCurrentPage : reviewCurrentPage;
  const totalPages = activeLink === "photocard" ? photocardTotalPages : reviewTotalPages;

  return (
    <>
      <div className="flex-col">
        {/* 포토카드, 한줄평 탭 */}
        <div className="w-full p-4">
          <div className="flex space-x-6">
            <a
              href="#"
              className={`font-bold text-2xl ${
                activeLink === "photocard"
                  ? "text-black border-b-2 border-black"
                  : "text-[#B5B5B5]"
              }`}
              onClick={() => handleLinkClick("photocard")}
            >
              포토카드
            </a>
            <a
              href="#"
              className={`font-bold text-2xl ${
                activeLink === "review"
                  ? "text-black border-b-2 border-black"
                  : "text-[#B5B5B5]"
              }`}
              onClick={() => handleLinkClick("review")}
            >
              한줄평
            </a>
          </div>
        </div>

        {/* 최신순, 좋아요순 */}
        {/* <div className="ml-3 justify-start sm:w-40 lg:w-48">
          <CustomRadioButton
            options={[
              { label: "최신순", value: "latest" },
              { label: "좋아요순", value: "popular" },
            ]}
            selectedOption={
              activeLink === "photocard"
                ? usePhotocardStore.getState().searchType === "TimeStamp"
                  ? "latest"
                  : "popular"
                : useReviewStore.getState().searchType === "TimeStamp"
                ? "latest"
                : "popular"
            }
            onChange={handleOrderChange}
          />
        </div> */}
      </div>
      <div className="mt-5 -ml-1">
        {loading && <p>로딩 중...</p>}
        {error && <p>에러: {error}</p>}
        {!loading && !error && items && items.length > 0 && (
          <>
            <GridDisplay items={items} type={activeLink} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
        {!loading && !error && (!items || items.length === 0) && (
          <p>표시할 항목이 없습니다.</p>
        )}
      </div>
    </>
  );
}