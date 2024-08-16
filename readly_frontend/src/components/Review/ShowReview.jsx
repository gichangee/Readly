import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import useUserStore from "../../store/userStore.js";
import { getFollowerInfo } from "../../api/memberAPI.js";

const ShowReview = ({
  review,
  isModal = false,
}) => {
  const {
    bookImage,
    bookTitle,
    bookAuthor,
    memberId,
    reviewText,
  } = review;

  const [isHovered, setIsHovered] = useState(false);
  const { user } = useUserStore()
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // memberId가 변경될 때마다 해당 유저 정보를 가져오는 함수
    const fetchUserInfo = async () => {
      try {
        const data = await getFollowerInfo(memberId); // API 호출
        setUserInfo(data);
        console.log("Fetched User Info:", data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    if (memberId) {
      fetchUserInfo();
    }
  }, [memberId]);

  

  const containerClasses = isModal
    ? "w-full bg-[#F5F5F5] rounded-lg shadow-md overflow-hidden flex flex-col"
    : "w-full bg-[#F5F5F5] rounded-lg shadow-md overflow-hidden flex flex-col";

  const imageClasses = isModal
    ? "w-full h-[200px] relative"
    : "w-full h-0 pb-[50%] relative";

  const contentClasses = isModal
    ? "p-6 flex flex-col flex-grow"
    : "p-2 flex flex-col flex-grow";

  const titleClasses = isModal
    ? "font-bold text-xl mb-2"
    : "font-bold text-xs line-clamp-1";

  const authorClasses = isModal
    ? "text-base text-gray-600"
    : "text-[10px] text-gray-600 line-clamp-1";

  const reviewTextClasses = isModal
    ? "text-base mb-4 max-h-[300px] overflow-y-auto font-bold"
    : "text-[10px] mb-1 flex-grow overflow-hidden line-clamp-2 font-bold";

  const isCurrentUser = user.loginId === memberId;

  return (
    <div className={containerClasses}>
      <div className={imageClasses}>
        <img
          src={bookImage}
          alt={bookTitle}
          className="absolute inset-0 w-full h-full object-contain"
        />
      </div>

      <div className={contentClasses}>
        <div className="border-b pb-2 mb-2">
          <h3 className={titleClasses}>{bookTitle}</h3>
          <p className={authorClasses}>{bookAuthor}</p>
        </div>
        <p className={reviewTextClasses}>{reviewText}</p>
        <div className="flex justify-between items-center text-xs text-gray-600">
          <div className="relative">
            {isCurrentUser ? (
              <Link
                to="/mypage"
                className="flex items-center group cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <User
                  size={isModal ? 16 : 12}
                  className="text-gray-600 mr-1 transition-transform duration-100 group-hover:scale-125"
                />
                <span
                  className={`font-bold text-gray-600 group-hover:text-blue-600 ${
                    isModal ? "text-sm" : "text-[10px]"
                  }`}
                >
                  {userInfo ? userInfo.memberResponse.nickname : memberId}
                </span>
                {isHovered && (
                  <span className="absolute left-0 bottom-full mb-2 bg-white px-2 py-1 rounded shadow-md text-xs whitespace-nowrap z-10 font-bold">
                    마이페이지로 이동
                  </span>
                )}
              </Link>
            ) : (
              <Link
                to={`/member/${memberId}`}
                className="flex items-center group cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <User
                  size={isModal ? 16 : 12}
                  className="text-gray-600 mr-1 transition-transform duration-100 group-hover:scale-125"
                />
                <span
                  className={`font-bold text-gray-600 group-hover:text-blue-600 ${
                    isModal ? "text-sm" : "text-[10px]"
                  }`}
                >
                  {userInfo ? userInfo.memberResponse.nickname : memberId}
                </span>
                {isHovered && (
                  <span className="absolute left-0 bottom-full mb-2 bg-white px-2 py-1 rounded shadow-md text-xs whitespace-nowrap z-10 font-bold">
                    작성자 페이지로 이동
                  </span>
                )}
              </Link>
            )}
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default ShowReview;
