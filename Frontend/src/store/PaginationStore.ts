import { create } from "zustand";

interface PaginationState {
  currentPage: number;
}

export const usePaginationStore = create<PaginationState>((set) => ({
  currentPage: 1,
}));
