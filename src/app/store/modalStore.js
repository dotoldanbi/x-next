import { create } from "zustand";

// Zustand store for managing comments
// create는 set을 파라미터로 받고 javascript 객체를 반환합니다.
export const useModalStore = create((set) => ({
  modalState: false,
  setModalState: (value) => set({ modalState: value }),
}));

export const usePostIdStore = create((set) => ({
  postId: null,
  setPostId: (value) => set({ postId: value }),
}));
