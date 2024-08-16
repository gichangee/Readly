import { create } from 'zustand';
import { createPhotoCard, updatePhotoCard, getPhotoCard } from '../api/photocardAPI';

const usePhotocardStore = create((set, get) => ({
  photoCard: null,
  photocards: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  orderType: 'DESC',
  searchType: 'TimeStamp',

  createPhotoCard: async (bookId, text, visibility, memberId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await createPhotoCard(bookId, text, visibility, memberId);
      set({ photoCard: response, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  updatePhotoCard: async (imageLink, photoCardId) => {
    set({ isLoading: true, error: null });
    try {
      const updatedPhotoCard = await updatePhotoCard(imageLink, photoCardId);
      set({ photoCard: updatedPhotoCard, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  setPhotoCard: (photoCard) => set({ photoCard }),

  fetchPhotocards: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const { searchType, orderType } = get();
      const response = await getPhotoCard(
        searchType,
        orderType,
        10, // 페이지 크기
        page,
        'E'
      );
      set({
        photocards: response.reviews,
        currentPage: page,
        totalCount: response.total_count,
        totalPages: Math.ceil(response.total_count / 10),
        isLoading: false
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchHomePhotocards: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getPhotoCard(
        'Like',
        'DESC',
        6,
        page,
        'E'
      );
      console.log("Fetched home photocards:", response);
      set({
        photocards: response.reviews || [],
        currentPage: page,
        totalCount: response.total_count || 0,
        totalPages: Math.ceil((response.total_count || 0) / 6),
        isLoading: false
      });
    } catch (error) {
      console.error("Error fetching home photocards:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  setOrderType: (newOrderType) => set({ orderType: newOrderType }),

  setSearchType: (newSearchType) => set({ searchType: newSearchType }),

  // 필요한 경우 추가 메서드를 여기에 구현할 수 있습니다.
}));

export default usePhotocardStore;