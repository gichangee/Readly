import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ActivityProgress from "./ActivityProgress";
import ActivityChat from "./ActivityChat";
import ActivityRTC from "./ActivityRTC";
import ActivityBoard from "./ActivityBoard";
import ActivityHeader from "./ActivityHeader";
import { getMemberGroups } from "../../api/communityAPI";
import useUserStore from "../../store/userStore";
import axios from 'axios';
import { GroupDelete, GroupLeave } from './DeleteGroup.jsx';
import { BASE_URL } from '../../api/authAPI.js';

export default function Activity() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('진행도');
  const [isGroupListOpen, setIsGroupListOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [groupList, setGroupList] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const { user, token } = useUserStore();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const getTabs = () => {
    const baseTabs = ['진행도', '소통', '화상', '게시판'];
    if (userRole === 'L') {
      return [...baseTabs, '그룹 삭제'];
    } else if (userRole === 'M') {
      return [...baseTabs, '그룹 탈퇴'];
    }
    return baseTabs;
  };

  const tabs = getTabs();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        if (!user || !user.id) {
          console.error("User information not found");
          return;
        }

        const groups = await getMemberGroups(user.id, token);
        setGroupList(groups);

        if (groups.length > 0) {
          const initialGroupId = parseInt(groupId) || groups[0].groupId;
          setSelectedGroupId(initialGroupId);
          setSelectedGroup(groups.find(group => group.groupId === initialGroupId));
          if (!groupId) {
            navigate(`/activity/${initialGroupId}`);
          }
        } else {
          alert("현재 소모임이 없습니다");
          navigate('/Home');
        }
      } catch (error) {
        console.error("Failed to fetch groups:", error);
        alert("그룹 정보를 가져오는 데 실패했습니다");
        navigate('/Home');
      }
    };

    fetchGroups();
  }, [groupId, navigate, user, token]);

  useEffect(() => {
    if (groupList.length > 0 && selectedGroupId) {
      setSelectedGroup(groupList.find(group => group.groupId === selectedGroupId));
    }
  }, [selectedGroupId, groupList]);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/group/read-books/${selectedGroupId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userInfo = response.data.readBooks.find(book => book.member_id === user.id);
        if (userInfo) {
          setUserRole(userInfo.member_info.roles);
        }
      } catch (error) {
        console.error("Failed to fetch group data:", error);
      }
    };

    if (selectedGroupId) {
      fetchGroupData();
    }
  }, [selectedGroupId, user.id, token]);

  const handleDeleteSuccess = () => {
    setGroupList(prevGroups => prevGroups.filter(group => group.groupId !== selectedGroupId));
  };

  const handleLeaveSuccess = (leftGroupId) => {
    setGroupList(prevGroups => prevGroups.filter(group => group.groupId !== leftGroupId));
  };

  return (
    <>
      {isGroupListOpen && (
        <div 
          className="fixed inset-0 bg-[#000000] bg-opacity-50 z-30" 
          onClick={() => setIsGroupListOpen(false)}
        ></div>
      )}
      <div className="-ml-[7rem]">
        <ActivityHeader 
          isGroupListOpen={isGroupListOpen} 
          setIsGroupListOpen={setIsGroupListOpen} 
          setSelectedGroupId={setSelectedGroupId}
          selectedGroupId={selectedGroupId}
          selectedGroup={selectedGroup}
          groupList={groupList}
        />
      </div>
      <div className="flex space-x-6 mt-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`font-bold text-2xl ${
              activeTab === tab
                ? "text-black border-b-2 border-black"
                : "text-[#B5B5B5]"
            }`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div>
        {activeTab === "진행도" && <ActivityProgress groupId={selectedGroupId} />}
        {activeTab === "소통" && <ActivityChat groupId={selectedGroupId} />}
        {activeTab === "화상" && <ActivityRTC groupId={selectedGroupId} isActiveTab={activeTab === "화상"} />}
        {activeTab === "게시판" && <ActivityBoard groupId={selectedGroupId} />}
        {activeTab === "그룹 삭제" && userRole === 'L' && (
          <GroupDelete 
            groupId={selectedGroupId} 
            token={token} 
            onDeleteSuccess={handleDeleteSuccess}
          />
        )}
        {activeTab === "그룹 탈퇴" && userRole === 'M' && (
          <GroupLeave 
            groupId={selectedGroupId} 
            userId={user.id} 
            token={token} 
            onLeaveSuccess={handleLeaveSuccess}
          />
        )}
      </div>
    </>
  )
}