import { create } from 'zustand';
import { getReviews, postReview } from '../api/reviewAPI';

const useReviewStore = create((set, get) => ({
  reviews: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  orderType: 'DESC',
  searchType: 'TimeStamp',

  fetchReviews: async (page = 1) => {
    set({ loading: true, error: null });
    try {
      const { searchType, orderType } = get();
      const response = await getReviews(searchType, orderType, 10, page, 'E');
      set({
        reviews: response.reviews,
        currentPage: page,
        totalCount: response.total_count,
        totalPages: Math.ceil(response.total_count / 10),
        loading: false
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addReview: async (memberId, bookId, text, visibility) => {
    set({ loading: true, error: null });
    try {
      const result = await postReview(memberId, bookId, text, visibility);
      if (result.status === 'success') {
        await get().fetchReviews();
      } else {
        set({ error: result.message, loading: false });
      }
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  setOrderType: (newOrderType) => set({ orderType: newOrderType }),
  setSearchType: (newSearchType) => set({ searchType: newSearchType }),
}));

export default useReviewStore;