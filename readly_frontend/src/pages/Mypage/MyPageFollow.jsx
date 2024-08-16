import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LevelIcon1 from "../../assets/level/lv1.png";
import LevelIcon2 from "../../assets/level/lv2.png";
import LevelIcon3 from "../../assets/level/lv3.png";
import LevelIcon4 from "../../assets/level/lv4.png";
import InfoIcon from "../../assets/header/info_img.png";
import FollowList from "./FollowModal";
import { getFollowers } from "../../api/mypageAPI";

export default function MypageFollow({ userId }) {
  const [followListModalIsOpen, setFollowListModalIsOpen] = useState(false);
  const [follows, setFollows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        setIsLoading(true);
        const fetchedFollowers = await getFollowers(userId);
        console.log("Fetched followers:", fetchedFollowers); // 추가된 로그

        const followersWithLevel = fetchedFollowers.map(user => ({
          ...user,
          level: calculateLevel(user.followedPoint)
        }));

        console.log("Followers with level:", followersWithLevel); // 추가된 로그
        setFollows(followersWithLevel);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching followers:', error);
        setError('팔로워 목록을 불러오는 중 오류가 발생했습니다.');
        setIsLoading(false);
      }
    };

    fetchFollowers();
  }, [userId]);

  const openFollowListModal = () => {
    console.log("Opening follow list modal"); // 추가된 로그
    setFollowListModalIsOpen(true);
  };

  const closeFollowListModal = () => {
    console.log("Closing follow list modal"); // 추가된 로그
    setFollowListModalIsOpen(false);
  };

  const navigateToMemberPage = (followedId) => {
    console.log("Navigating to member page 팔로우페이지:", followedId);
    navigate(`/member/${followedId}`);
  };

  const levelIcons = {
    1: LevelIcon1,
    2: LevelIcon2,
    3: LevelIcon3,
    4: LevelIcon4,
  };

  const renderEmptyItems = (count) => {
    return Array(count)
      .fill()
      .map((_, index) => (
        <div key={`empty-${index}`} className="bg-gray-200 p-2 rounded-xl flex items-center w-36 h-[5rem]"></div>
      ));
  };

  if (isLoading) {
    return <div>팔로워 목록을 불러오는 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const displayFollows = follows.slice(0, 7);
  const emptySlots = Math.max(0, 7 - displayFollows.length);

  console.log("Displaying followers:", displayFollows); // 추가된 로그

  return (
    <>
      <div className="bg-white rounded-lg shadow p-4 mb-4 relative w-3/4 h-[9rem]">
        <div className="flex space-x-2 mb-2 gap-4 flex-wrap">
          {displayFollows.map((user) => (
            <div
              key={user.followedId}
              // onClick={() => navigateToMemberPage(user.followedId)}
              className="bg-gray-200 p-2 rounded-xl flex items-center bg-[#F5F5F5] w-36 h-[5rem]"
            >
              <img
                src={levelIcons[user.level]}
                alt={`Level ${user.level}`}
                className="w-7 h-7 mb-9"
              />
              <div className="ml-4">
                <img src={InfoIcon} alt="info" className="w-12 h-10" />
                <p className="font-semibold">{user.followedName}</p>
              </div>
            </div>
          ))}
          {renderEmptyItems(emptySlots)}
        </div>
        {/* <div className="absolute top-4 right-4">
          <button
            onClick={openFollowListModal}
            className="text-blue-500 hover:text-blue-700 text-lg font-bold"
          >
            <span className="text-custom-highlight">&gt;</span>{" "}
            <span className="text-[1rem] text-[#868686]">더보기</span>
          </button>
        </div> */}
      </div>

      <FollowList
        isOpen={followListModalIsOpen}
        onRequestClose={closeFollowListModal}
        follows={follows}
        onUserClick={navigateToMemberPage}
      />
    </>
  );
}

function calculateLevel(point) {
  if (point < 1000) return 1;
  if (point < 2000) return 2;
  if (point < 3000) return 3;
  return 4;
}