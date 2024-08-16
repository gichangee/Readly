import { create } from 'zustand';

const useVideoStore = create((set) => ({
  isVideoConferenceActive: false,
  participants: [],
  sharedItems: [],
  setVideoConferenceActive: (active) => set({ isVideoConferenceActive: active }),
  setParticipants: (participants) => set({ participants }),
  addSharedItem: (item) => set((state) => ({ sharedItems: [...state.sharedItems, item] })),
}));

export default useVideoStore;