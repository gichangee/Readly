import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../api/authAPI';

export function GroupDelete({ groupId, onDeleteSuccess }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleDeleteGroup = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteGroup = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/group/read-books/${groupId}`);
      if (response.data.readBooks.length > 1) {
        alert("그룹 내 인원이 1명 이상입니다. 그룹을 삭제할 수 없습니다.");
        setIsDeleteModalOpen(false);
        return;
      }
      
      await axios.delete(`${BASE_URL}/group/${groupId}`);
      
      alert("그룹이 성공적으로 삭제되었습니다.");
      onDeleteSuccess();
      navigate('/community');
    } catch (error) {
      console.error("Error deleting group:", error);
      alert("그룹 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-4 text-red-600">그룹 삭제</h2>
        <p className="mb-6 text-gray-700">
          <span className="font-semibold">주의:</span> 그룹을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.
        </p>
        <div className="flex justify-center">
          <button 
            onClick={handleDeleteGroup} 
            className="font-bold px-6 py-2 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
          >
            그룹 삭제
          </button>
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed top-0 bottom-0 right-0 bg-black bg-opacity-50 flex items-center justify-center left-[8rem]">
          <div className="bg-[#eae8e8] p-6 rounded-lg shadow-xl">
            <h2 className="text-xl justify-center text-center text-[#ff4141] font-bold mb-4">정말로 삭제하시겠습니까?</h2>
            <p className="mb-6 text-gray-700">
              <span className="font-semibold">주의:</span> 그룹을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.
            </p>
            <div className="flex justify-end mt-6">
              <button 
                onClick={confirmDeleteGroup} 
                className="font-bold px-4 py-2 rounded-full mr-4 transition duration-300"
              >
                예
              </button>
              <button 
                onClick={() => setIsDeleteModalOpen(false)} 
                className="px-4 py-2 rounded-full mr-4 transition duration-300"
              >
                아니오
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function GroupLeave({ groupId, userId, onLeaveSuccess }) {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLeaveGroup = () => {
    setIsLeaveModalOpen(true);
  };

  const confirmLeaveGroup = async () => {
    try {
      await axios.delete(`${BASE_URL}/group/${groupId}/member/${userId}`);
      
      alert("그룹에서 성공적으로 탈퇴했습니다.");
      onLeaveSuccess(groupId);
      navigate('/community');
    } catch (error) {
      console.error("Error leaving group:", error);
      alert("그룹에서 성공적으로 탈퇴했습니다.");
      onLeaveSuccess(groupId);
      navigate('/community');
    } finally {
      setIsLeaveModalOpen(false);
    }
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-4 text-yellow-600">그룹 탈퇴</h2>
        <p className="mb-6 font-bold text-center text-[#ff4141]">해당 그룹에서 탈퇴하시겠습니까?</p>
        <div className="flex justify-center">
          <button 
            onClick={handleLeaveGroup} 
            className="font-bold px-6 py-2 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
          >
            그룹 탈퇴
          </button>
        </div>
      </div>

      {isLeaveModalOpen && (
        <div className="fixed top-0 bottom-0 right-0 bg-black bg-opacity-50 flex items-center justify-center left-[8rem]">
        <div className="bg-[#eae8e8] p-6 rounded-lg shadow-xl">
            <h2 className="text-xl justify-center text-center text-[#ff4141] font-bold mb-4">탈퇴하시겠습니까?</h2>
            <div className="flex justify-end mt-6">
              <button 
                onClick={confirmLeaveGroup} 
                className="font-bold px-4 py-2 rounded-full mr-4 transition duration-300"
              >
                예
              </button>
              <button 
                onClick={() => setIsLeaveModalOpen(false)} 
                className="px-4 py-2 rounded-full mr-4 transition duration-300"
              >
                아니오
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}