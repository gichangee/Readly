import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomHeader from "../../components/CustomHeader";

export default function ActivityHeader({
  isGroupListOpen,
  setIsGroupListOpen,
  setSelectedGroupId,
  selectedGroup,
  groupList
}) {
  const groupListRef = useRef(null);
  const navigate = useNavigate();

  const toggleGroupList = () => {
    setIsGroupListOpen(!isGroupListOpen);
  };

  const selectGroup = (group) => {
    console.log("ActivityHeader: Selecting group", group);
    setSelectedGroupId(group.groupId);
    setIsGroupListOpen(false);
    navigate(`/activity/${group.groupId}`);
  };

  useEffect(() => {
    console.log("ActivityHeader: selectedGroup updated", selectedGroup);
  }, [selectedGroup]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        groupListRef.current &&
        !groupListRef.current.contains(event.target)
      ) {
        setIsGroupListOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [groupListRef, setIsGroupListOpen]);

  return (
    <div className="flex-1 items-center relative">
      <CustomHeader />
      <h2
        className="absolute text-2xl font-bold top-1/2 left-[20rem] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-40 whitespace-nowrap"
        onClick={toggleGroupList}
      >
        <span
          className={`text-custom-highlight ${
            selectedGroup?.title?.length > 8 ? "text-xl" : "text-2xl"
          }`}
        >
          {selectedGroup?.title}
        </span>{" "}
        <span className="text-2xl">소모임</span>
      </h2>
      {isGroupListOpen && (
        <div
          ref={groupListRef}
          className="absolute top-full left-[20rem] transform -translate-x-1/2 mt-2 z-50"
        >
          <ul className="bg-[#F5F5F5] border rounded-lg shadow-lg mt-1 absolute z-10 w-96">
            {groupList.map((group, index) => (
              <li
                key={group.groupId}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => selectGroup(group)}
              >
                {group.title}
                {index !== groupList.length - 1 && (
                  <div className="border-b border-custom-border w-full"></div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}