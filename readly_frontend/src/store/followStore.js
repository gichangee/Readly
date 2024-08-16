import { create } from 'zustand';

const useFollowStore = create((set) => ({
  followings: new Set(),
  addFollowing: (userId) => set((state) => ({ followings: new Set(state.followings).add(userId) })),
  removeFollowing: (userId) => set((state) => {
    const newFollowings = new Set(state.followings);
    newFollowings.delete(userId);
    return { followings: newFollowings };
  }),
  setFollowings: (followings) => set({ followings: new Set(followings) }),
}));

export default useFollowStore;