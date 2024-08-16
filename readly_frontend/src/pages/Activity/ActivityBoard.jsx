import { useState, useEffect } from "react";
import axios from "axios";
import { AlertCircle, Plus, Eye, EyeOff, Edit2, Trash2 } from "lucide-react";
import { BASE_URL } from '../../api/authAPI';
const CreateOrEditPostModal = ({ isOpen, onClose, onSubmit, post }) => {
  const [formData, setFormData] = useState({ title: "", content: "" });

  useEffect(() => {
    if (post) {
      setFormData(post);
    } else {
      setFormData({ title: "", content: "" }); // Reset the form data when there's no post
    }
  }, [post]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    console.log("Submitting post data:", formData);

    const updatedFormData = post ? { ...formData, id: post.id } : formData;

    onSubmit(updatedFormData);

    if (!post) {
      setFormData({ title: "", content: "" });
    }
  };

  return (
    <div className="fixed inset-0 bg-[#00000080] flex justify-center items-center z-50">
      <div className="bg-[#FFFFFF] p-8 rounded-lg w-[480px] shadow-[0_10px_25px_rgba(0,0,0,0.1)]">
        <h3 className="text-2xl font-bold mb-6 text-[#333333]">
          {post ? "글 수정" : "새 글 작성"}
        </h3>
        <input
          type="text"
          placeholder="제목"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="border border-[#E0E0E0] p-3 mb-4 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] transition duration-200"
        />
        <textarea
          placeholder="내용"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          className="border border-[#E0E0E0] p-3 mb-6 w-full h-40 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#4A90E2] transition duration-200"
        />
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-4 px-6 py-2 bg-[#F5F5F5] text-[#333333] rounded-md hover:bg-[#E0E0E0] transition duration-200"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-[#4A90E2] text-[#FFFFFF] rounded-md hover:bg-[#3A7BC8] transition duration-200"
          >
            {post ? "수정 완료" : "생성"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ViewPostModal = ({ isOpen, onClose, post }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#00000080] flex justify-center items-center z-50">
      <div className="bg-[#FFFFFF] p-8 rounded-lg w-[480px] shadow-[0_10px_25px_rgba(0,0,0,0.1)]">
        <h3 className="text-2xl font-bold mb-6 text-[#333333]">{post.title}</h3>
        <p className="whitespace-pre-wrap text-[#666666]">{post.content}</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#4A90E2] text-[#FFFFFF] rounded-md hover:bg-[#3A7BC8] transition duration-200"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ActivityBoard({ groupId }) {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [editingPost, setEditingPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingPost, setViewingPost] = useState(null);
  const [error, setError] = useState(null);

  const pageSize = 10;

  useEffect(() => {
    fetchPosts();
  }, [groupId, currentPage]);

  const fetchPosts = async () => {
    try {
      setError(null);
      console.log("Fetching posts with params:", { groupId, currentPage, pageSize });

      const response = await axios.get(`${BASE_URL}/proceeding`, {
        params: {
          groupId: groupId,
          pageNumber: currentPage,
          pageSize: pageSize,
        },
      });

      console.log("Server response:", response.data);

      setPosts(response.data.proceedings);
      setTotalPosts(response.data.totalProceedings || 0);
    } catch (error) {
      console.error("Error fetching posts:", error);
      let errorMessage = "글 목록을 불러오는 데 실패했습니다. ";
      if (error.response) {
        console.error("Error response:", error.response);
        if (error.response.status === 500) {
          errorMessage += "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
          console.error("Server error details:", error.response.data);
        } else {
          errorMessage += `오류 코드: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage += "서버로부터 응답이 없습니다.";
      } else {
        errorMessage += "알 수 없는 오류가 발생했습니다.";
      }
      setError(errorMessage);
    }
  };

  const handleViewPost = async (id) => {
    try {
      setError(null);
      const response = await axios.get(`${BASE_URL}/proceeding/${id}`);
      setViewingPost(response.data);
    } catch (error) {
      console.error("Error fetching post details:", error);
      setError("글 상세 정보를 불러오는 데 실패했습니다.");
    }
  };

  const handleCreatePost = async (newPost) => {
    try {
      setError(null);
      console.log("Creating new post:", { ...newPost, groupId });
      const response = await axios.post(
        `${BASE_URL}/proceeding`,
        {
          ...newPost,
          groupId,
        },
      );
      console.log("Create post response:", response.data);
      setIsModalOpen(false);
      fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
      setError("글 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  const handleEditPost = async (id) => {
    try {
      setError(null);
      const response = await axios.get(`${BASE_URL}/proceeding/${id}`);
      console.log("Fetched post for editing:", response.data); // Debugging line
      setEditingPost(response.data);
      setIsModalOpen(true); // 수정할 글을 설정한 후 모달 열기
    } catch (error) {
      console.error("Error fetching post details:", error);
      setError("글 정보를 불러오는 데 실패했습니다.");
    }
  };

  const handleUpdatePost = async (updatedPost) => {
    try {
      setError(null);
      console.log("Updating post:", updatedPost); // Debugging line
      if (!updatedPost.proceedingId) {
        throw new Error("Post ID is undefined.");
      }
      await axios.put(
        `${BASE_URL}/proceeding/${updatedPost.proceedingId}`,
        updatedPost,
      );
      setIsModalOpen(false);
      setEditingPost(null);
      fetchPosts();
    } catch (error) {
      console.error("Error updating post:", error);
      setError("글 수정에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  const handleDeletePost = async (id) => {
    try {
      setError(null);
      await axios.delete(`${BASE_URL}/proceeding/${id}`);
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      setError("글 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <div className="container mx-auto p-8 bg-[#F8F8F8] rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-[#333333]">게시판</h2>
        <button
          onClick={() => {
            setEditingPost(null); // Reset editing post first
            setIsModalOpen(true); // Open the modal
          }}
          className="bg-[#4A90E2] text-[#FFFFFF] px-6 py-3 rounded-md hover:bg-[#3A7BC8] transition duration-200 shadow-md flex items-center"
        >
          <Plus size={20} className="mr-2" />
          새 글 작성
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-[#FEECED] text-[#D32F2F] rounded-md flex items-center">
          <AlertCircle size={20} className="mr-2" />
          <span>{error}</span>
        </div>
      )}

      <CreateOrEditPostModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPost(null); // Close modal and reset editing post
        }}
        onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
        post={editingPost}
      />

      {viewingPost && (
        <ViewPostModal
          isOpen={!!viewingPost}
          onClose={() => setViewingPost(null)}
          post={viewingPost}
        />
      )}

      {/* Posts List */}
      <div className="overflow-x-auto bg-[#FFFFFF] rounded-lg shadow-md">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F5F5F5]">
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#666666] uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#666666] uppercase tracking-wider">
                일시
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#666666] uppercase tracking-wider">
                제목
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#666666] uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E0E0E0]">
            {posts.map((post) => (
              <tr
                key={post.id}
                className="hover:bg-[#F8F8F8] transition duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap text-[#333333]">
                  {post.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-[#333333]">
                  {post.createdDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-[#333333]">
                  {post.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleViewPost(post.id)}
                    className="text-[#4A90E2] hover:text-[#3A7BC8] mr-4 transition duration-200 flex items-center"
                  >
                    {viewingPost?.proceedingId === post.id ? (
                      <EyeOff size={18} className="mr-1" />
                    ) : (
                      <Eye size={18} className="mr-1" />
                    )}
                    {viewingPost?.proceedingId === post.id
                      ? "내용 숨기기"
                      : "내용 보기"}
                  </button>
                  <button
                    onClick={() => handleEditPost(post.id)}
                    className="text-[#4CAF50] hover:text-[#3D8B40] mr-4 transition duration-200 flex items-center"
                  >
                    <Edit2 size={18} className="mr-1" />
                    수정
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="text-[#F44336] hover:text-[#D32F2F] transition duration-200 flex items-center"
                  >
                    <Trash2 size={18} className="mr-1" />
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="mx-1 px-4 py-2 bg-[#F5F5F5] text-[#333333] rounded-md hover:bg-[#E0E0E0] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          이전
        </button>
        <span className="mx-2 px-4 py-2 bg-[#FFFFFF] rounded-md shadow-md text-[#333333]">
          페이지 {currentPage} / {Math.ceil(totalPosts / pageSize)}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(prev + 1, Math.ceil(totalPosts / pageSize))
            )
          }
          disabled={currentPage === Math.ceil(totalPosts / pageSize)}
          className="mx-1 px-4 py-2 bg-[#F5F5F5] text-[#333333] rounded-md hover:bg-[#E0E0E0] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          다음
        </button>
      </div>
    </div>
  );
}
