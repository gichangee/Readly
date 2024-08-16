import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoButton from "../../components/GoButton/GoButton";
import FormField from "../../components/Form/FormField";
import TagFormField from "../../components/Form/TagFormField";
import NumberInputField from "../../components/Form/NumberInputField";
import { createGroup } from "../../api/communityAPI";
import useUserStore from "../../store/userStore.js";

export default function MakeCommunity() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(2);
  const [tags, setTags] = useState([]);
  const { user } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const groupData = {
      memberId: user.id,
      title,
      description,
      createdDate: new Date().toISOString(),
      maxParticipants,
      roomId: null,
      tags,
    };

    try {
      const response = await createGroup(groupData);
      if (response.status === 201 && response.data && response.data.groupId) {
        console.log("Group created successfully");
        alert("소모임이 성공적으로 생성되었습니다.");
        navigate(`/activity/${response.data.groupId}`);
      } else {
        console.error("Unexpected response:", response);
        alert(`소모임 생성 중 오류가 발생했습니다. (상태 코드: ${response.status})`);
      }
    } catch (error) {
      console.error("Error creating group:", error);
      alert(
        `소모임 생성 중 오류가 발생했습니다: ${
          error.response ? error.response.data : error.message
        }`
      );
    }
  };

  return (
    <div className="flex w-full h-4/5">
      <div className="w-2/5 p-4 mt-10 bg-[#F5F5F5] rounded-xl shadow-md relative">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            label="소모임 이름을 입력해주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <FormField
            label="소모임 설명을 입력해주세요"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline={true}
          />
          <NumberInputField
            label="참여 인원을 입력해주세요"
            value={maxParticipants}
            onChange={setMaxParticipants}
            min={1}
            max={12}
          />
          <TagFormField
            label="태그를 입력해주세요"
            tags={tags}
            setTags={setTags}
            placeholder="입력 후, 엔터"
          />
          <div className="absolute bottom-4 right-4">
            <GoButton text="소모임 생성" onClick={handleSubmit} />
          </div>
        </form>
      </div>
    </div>
  );
}