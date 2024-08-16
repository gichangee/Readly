import { useEffect } from "react";
import { create } from "zustand";
import { fetchPersonalRanking, fetchGroupRanking, fetchUserGroupsRank, fetchUserSpecificRank } from "../../api/rankingAPI";
import CrownImg from "../../assets/level/crown.png";
import InfoImg from "../../assets/header/info_img.png";
import GroupImg from "../../assets/header/group_img.png";
import PersonalRanking from "./PersonalRanking";
import GroupRanking from "./GroupRanking";
import useUserStore from "../../store/userStore";

const useRankStore = create((set) => ({
  personalRanking: [],
  groupRanking: [],
  userGroupsRank: [],
  userSpecificRank: null,
  setPersonalRanking: (data) => set({ personalRanking: Array.isArray(data) ? data : [] }),
  setGroupRanking: (data) => set({ groupRanking: Array.isArray(data) ? data : [] }),
  setUserGroupsRank: (data) => set({ userGroupsRank: Array.isArray(data) ? data : [] }),
  setUserSpecificRank: (data) => set({ userSpecificRank: data }),
}));

export default function Ranking() {
  const { personalRanking, groupRanking, userGroupsRank, userSpecificRank, setPersonalRanking, setGroupRanking, setUserGroupsRank, setUserSpecificRank } = useRankStore();
  const { user } = useUserStore();

  useEffect(() => {
    const fetchRankings = async () => {
      if (!user) return;

      try {
        const [personalData, groupData, userGroupsData, userSpecificData] = await Promise.all([
          fetchPersonalRanking(),
          fetchGroupRanking(),
          fetchUserGroupsRank(user.id),
          fetchUserSpecificRank(user.id),
        ]);
        
        // 데이터 변환 (필요한 경우)
        const transformedPersonalData = personalData.map(item => ({
          ...item,
          readBookCount: item.booksReadCount || item.readBookCount || 0
        }));

        setPersonalRanking(transformedPersonalData);
        setGroupRanking(groupData);
        setUserGroupsRank(userGroupsData);
        setUserSpecificRank(userSpecificData);

        console.log("Transformed Personal Ranking:", transformedPersonalData);
      } catch (error) {
        console.error("Error fetching rankings:", error);
        setPersonalRanking([]);
        setGroupRanking([]);
        setUserGroupsRank([]);
        setUserSpecificRank(null);
      }
    };

    fetchRankings();
  }, [user]);

  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (!user) {
    return <div>로그인이 필요합니다.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="font-bold text-4xl mb-10">
        <span className="text-custom-highlight">{today}</span> 기준 랭킹
      </h1>
      <div className="flex flex-wrap gap-x-10 justify-center space-x-10">
        <div className="bg-[#F5F5F5] shadow-md rounded-lg p-6 w-[30rem]">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <img src={CrownImg} alt="crown" className="w-[3rem] h-[3rem]" />
              <h2 className="text-yellow-500 text-3xl font-bold ml-2">
                개인랭킹
              </h2>
            </div>
            <img src={InfoImg} alt="info" className="w-[5rem] h-[4rem]" />
          </div>
          <PersonalRanking personalRanking={personalRanking} currentUser={user} userSpecificRank={userSpecificRank} />
        </div>
        <div className="bg-[#F5F5F5] shadow-md rounded-lg p-6 w-[30rem]">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <img src={CrownImg} alt="crown" className="w-[3rem] h-[3rem]" />
              <h2 className="text-yellow-500 text-3xl font-bold ml-2">
                소모임랭킹
              </h2>
            </div>
            <img src={GroupImg} alt="group" className="w-[5rem] h-[4rem]" />
          </div>
          <GroupRanking groupRanking={groupRanking} userGroupsRank={userGroupsRank} userName={user.nickname} />
        </div>
      </div>
    </div>
  );
}