import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import levelIcon1 from "../../assets/level/lv1.png";
import levelIcon2 from "../../assets/level/lv2.png";
import levelIcon3 from "../../assets/level/lv3.png";
import levelIcon4 from "../../assets/level/lv4.png";
import catCoin from "../../assets/level/cat_coin.png";
import { getFollowerInfo } from "../../api/memberAPI";
import { addFollower, removeFollower } from "../../api/followAPI";
import { getFollowers } from "../../api/mypageAPI";
import useUserStore from '../../store/userStore';
import useFollowStore from '../../store/followStore';
import './follow_btn.css';
import BookshelfList from "../Mypage/BookshelfModal.jsx"
import MemberPhotocardList from "./MemberPhotocardList.jsx"
import ReviewList from "../Mypage/ReviewListModal.jsx"
import TimeCat from "../../assets/onboard/time_cat.png"

const FollowButton = ({ isFollowing, onClick, isLoading }) => {
  return (
    <label className={`follow-btn-container ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={onClick}>
      <input type="checkbox" checked={isFollowing} readOnly />
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="40px" width="40px" className="like">
        <path d="M8 10V20M8 10L4 9.99998V20L8 20M8 10L13.1956 3.93847C13.6886 3.3633 14.4642 3.11604 15.1992 3.29977L15.2467 3.31166C16.5885 3.64711 17.1929 5.21057 16.4258 6.36135L14 9.99998H18.5604C19.8225 9.99998 20.7691 11.1546 20.5216 12.3922L19.3216 18.3922C19.1346 19.3271 18.3138 20 17.3604 20L8 20"></path>
      </svg>
      {isFollowing && (
        <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg" className="celebrate">
          <polygon points="0,0 10,10"></polygon>
          <polygon points="0,25 10,25"></polygon>
          <polygon points="0,50 10,40"></polygon>
          <polygon points="50,0 40,10"></polygon>
          <polygon points="50,25 40,25"></polygon>
          <polygon points="50,50 40,40"></polygon>
        </svg>
      )}
    </label>
  );
};

export default function Member() {
  const { memberId } = useParams();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [photocardModalIsOpen, setPhotocardModalIsOpen] = useState(false);
  const [reviewModalIsOpen, setReviewModalIsOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  const currentUser = useUserStore(state => state.user);
  const { followings, setFollowings, addFollowing, removeFollowing } = useFollowStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getFollowerInfo(memberId);
        setUserData(data);
        setUserId(data.memberResponse.id);
  
        if (currentUser) {
          const followingsData = await getFollowers(currentUser.id);
          console.log('Followings data:', followingsData);
          
          console.log('Follower IDs:', followingsData.map(follower => follower.followedId));
          console.log('Current member response ID:', data.memberResponse.id);

          const isAlreadyFollowing = followingsData.some(follower => follower.followedId === data.memberResponse.id);
          console.log('Is already following:', isAlreadyFollowing, 'Member ID:', memberId);
          
          setIsFollowing(isAlreadyFollowing);
          setFollowings(new Set(followingsData.map(follower => follower.id)));
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [memberId, currentUser, setFollowings]);

  const handleFollowClick = useCallback(async () => {
    if (isFollowLoading || !currentUser || !userId) {
      return;
    }
  
    setIsFollowLoading(true);
    try {
      const { id: currentUserId } = currentUser;
  
      if (isFollowing) {
        await removeFollower(currentUserId, userId);
        removeFollowing(userId);
        console.log('Successfully unfollowed');
        setIsFollowing(false);
      } else {
        if (!followings.has(userId)) {
          await addFollower(currentUserId, userId);
          addFollowing(userId);
          console.log('Successfully followed');
          setIsFollowing(true);
        } else {
          console.log('User is already following. No action taken.');
        }
      }
    } catch (error) {
      console.error('팔로우 작업 중 오류 발생:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        if (error.response.status === 500 && error.response.data.errorMessage.includes('Already following')) {
          setIsFollowing(true);
          console.log('User is already following. Updating state.');
        } else {
          alert(`팔로우 작업 중 오류가 발생했습니다: ${error.response.data.errorMessage || error.message}`);
        }
      } else {
        alert('팔로우 작업 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setIsFollowLoading(false);
    }
  }, [isFollowLoading, currentUser, userId, isFollowing, removeFollowing, addFollowing, followings]);
  
  const calculateLevel = (point) => {
    if (point < 1000) return 1;
    if (point < 2000) return 2;
    if (point < 3000) return 3;
    return 4;
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 1: return levelIcon1;
      case 2: return levelIcon2;
      case 3: return levelIcon3;
      case 4: return levelIcon4;
      default: return levelIcon1;
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const openPhotocardModal = () => {
    setPhotocardModalIsOpen(true);
  };

  const closePhotocardModal = () => {
    setPhotocardModalIsOpen(false);
  };

  const openReviewModal = () => {
    setReviewModalIsOpen(true);
  };

  const closeReviewModal = () => {
    setReviewModalIsOpen(false);
  };

  const MemberHeader = ({ user }) => {
    const levelIcon = getLevelIcon(calculateLevel(user.memberResponse.point));
    const isCurrentUserPage = currentUser && currentUser.id === user.memberResponse.id;

    return (
      <header className="flex justify-between items-center py-1 px-3 bg-white">
        <div className="flex-cols items-center mr-2">
          <img className="w-13 h-10 mr-2" src={levelIcon} alt="level" />
          <p className="font-bold text-center text-xl">Lv{calculateLevel(user.memberResponse.point)}</p>
        </div>

        <div>
          <div className="flex text-center">
            <h2 className="text-2xl font-bold mr-2">{user.memberResponse.nickname}</h2>
            {!isCurrentUserPage && (
              <FollowButton 
                isFollowing={isFollowing} 
                onClick={handleFollowClick} 
                isLoading={isFollowLoading} 
              />
            )}
          </div>
          <p className="text-base">{user.memberResponse.introduction}</p>
        </div>

        <div className="flex-1 flex justify-end items-end mr-6">
          <span className="text-base font-bold">{user.memberResponse.point}</span>
          <img className="w-6 h-6 ml-2" src={catCoin} alt="coin" />
        </div>
      </header>
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!userData) return <div>User not found</div>;

  const renderEmptyItems = (count) => {
    return Array(count)
      .fill()
      .map((_, index) => (
        <div key={`empty-${index}`} className="bg-gray-100 p-2 rounded w-[5rem] h-[6rem]"></div>
      ));
  };

  const renderItems = (items, renderFunction, emptyCount = 7) => {
    const displayItems = items.slice(0, 7);
    const emptySlots = Math.max(0, emptyCount - displayItems.length);
    
    return (
      <>
        {displayItems.map(renderFunction)}
        {renderEmptyItems(emptySlots)}
      </>
    );
  };

  return (
    <>
      <MemberHeader user={userData} />
      <div className="w-full p-4">
        <div className="flex space-x-6">
          <p className="font-bold text-2xl text-black ">{userData.memberResponse.nickname}님의 책장</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 mb-4 relative w-3/4 h-[9rem]">
          <div className="flex space-x-2 mb-2">
            {renderItems(
              userData.readBookResponse,
              (book, index) => (
                <div key={index} className="bg-gray-200 p-2 rounded">
                  <img src={book.image} alt={book.title} className="w-auto h-[6rem]" />
                </div>
              )
            )}
          </div>
          <div className="absolute top-4 right-4">
            <button onClick={openModal} className="text-blue-500 hover:text-blue-700 text-lg font-bold mr-1">
              <span className="text-custom-highlight">&gt;</span>{" "}
              <span className="text-[1rem] text-[#868686]">더보기</span>
            </button>
          </div>
        </div>

        <div className="mt-4">
          <div className="relative bg-white rounded-lg shadow p-4 mb-4 w-3/4 h-[11rem]">
            <h3 className="font-bold mb-2">{userData.memberResponse.nickname}님이 만든 포토카드</h3>
            <div className="flex flex-wrap gap-1">
              {renderItems(
                userData.photoCardResponse,
                (card, index) => (
                  <div key={index} className="bg-gray-200 p-2 rounded w-[5rem] h-[6rem] flex items-center justify-center">
                    <img src={card.photoCardImage} alt={card.photoCardText} className="w-full h-full object-cover"/>
                  </div>
                )
              )}
            </div>
            <div className="absolute top-4 right-4">
              <button onClick={openPhotocardModal} className="text-blue-500 hover:text-blue-700 text-lg font-bold mr-1">
                <span className="text-custom-highlight">&gt;</span>{" "}
                <span className="text-[1rem] text-[#868686]">더보기</span>
              </button>
            </div>
          </div>

          <div className="relative bg-white rounded-lg shadow p-4 w-3/4 h-[11rem]">
            <h3 className="font-bold mb-2">{userData.memberResponse.nickname}님이 남긴 한줄평</h3>
            <div className="flex flex-wrap gap-3">
              {renderItems(
                userData.reviewResponse,
                (review) => (
                  <div key={review.reviewId} className="w-[6rem] h-[7rem]">
                  <img
                    src={review.bookImage}
                    alt={review.bookTitle}
                    className="w-full h-full object-fill rounded"
                  />
                </div>
                )
              )}
            </div>
            <div className="absolute top-4 right-4">
              <button onClick={openReviewModal} className="text-blue-500 hover:text-blue-700 text-lg font-bold mr-1">
                <span className="text-custom-highlight">&gt;</span>{" "}
                <span className="text-[1rem] text-[#868686]">더보기</span>
              </button>
            </div>
          </div>
        </div>
        <div className="fixed bottom-10 right-40 flex flex-col items-end z-10">
            <img src={TimeCat} alt="timecat" className="w-[12rem] mb-2" />
          </div>
      </div>

      <BookshelfList
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        books={userData.readBookResponse}
      />

      <MemberPhotocardList
        isOpen={photocardModalIsOpen}
        onRequestClose={closePhotocardModal}
        photocards={userData.photoCardResponse}
      />

      <ReviewList 
        isOpen={reviewModalIsOpen} 
        onRequestClose={closeReviewModal} 
        reviews={userData.reviewResponse}
      />
    </>
  );
}