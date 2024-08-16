import { create } from 'zustand';
import { addLike, removeLike } from '../api/likeAPI';

const useLikeStore = create((set, get) => ({
  likes: JSON.parse(localStorage.getItem('likes')) || {},
  
  toggleLike: async (memberId, itemId, isReview = false) => {
    const currentLikes = get().likes;
    const isLiked = currentLikes[itemId];
    
    try {
      if (isLiked) {
        // 좋아요 취소
        await removeLike(memberId, isReview ? itemId : null, isReview ? null : itemId);
        const updatedLikes = { ...currentLikes, [itemId]: false };
        localStorage.setItem('likes', JSON.stringify(updatedLikes));
        set({ likes: updatedLikes });
        return false;
      } else {
        // 좋아요 추가
        await addLike(memberId, isReview ? itemId : null, isReview ? null : itemId);
        const updatedLikes = { ...currentLikes, [itemId]: true };
        localStorage.setItem('likes', JSON.stringify(updatedLikes));
        set({ likes: updatedLikes });
        return true;
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // 에러 발생 시 상태를 변경하지 않음
      return isLiked;
    }
  },

  setInitialLikeStatus: (itemId, status) => {
    set((state) => {
      const updatedLikes = { ...state.likes, [itemId]: status };
      localStorage.setItem('likes', JSON.stringify(updatedLikes));
      return { likes: updatedLikes };
    });
  },
}));

export default useLikeStore;