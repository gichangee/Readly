import { create } from 'zustand';
import { fetchBooks, searchBooksByTitle, fetchBookDetailsWithPhotoAndReview } from '../api/bookAPI.js';

const useBookStore = create((set) => ({
  books: [],
  searchResults: [],
  loading: false,
  error: null,

  selectedBook: null,
  photoard: null,
  review: null,

  fetchBooks: async () => {
    set({ loading: true, error: null });
    try {
      const books = await fetchBooks();
      set({ books, loading: false });
    } catch (error) {
      set({ error: error.message || 'Failed to fetch books', loading: false });
    }
  },

  searchBooks: async (title) => {
    set({ loading: true, error: null });
    try {
      const searchResults = await searchBooksByTitle(title);
      set({ searchResults, loading: false });
    } catch (error) {
      set({ error: error.message || 'Failed to search books', loading: false });
    }
  },

  setSearchResults: (results) => set({ searchResults: results }),

  fetchBookDetailsWithPhotoAndReview: async (bookId) => {
    set({ loading: true, error: null });
    try {
      const data = await fetchBookDetailsWithPhotoAndReview(bookId);
      set({ 
        selectedBook: data.book, 
        photoard: data.photoard, 
        review: data.review, 
        loading: false 
      });
    } catch (error) {
      set({ error: error.message || 'Failed to fetch book details', loading: false });
    }
  },

}));

export default useBookStore;