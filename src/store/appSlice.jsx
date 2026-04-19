import { create } from "zustand";

const createAppSlice = (set) => ({
  isNavbarCollapse: false,

  openNavbar: () => set({ isNavbarCollapse: true }),

  closeNavbar: () => set({ isNavbarCollapse: false }),

  toggleNavbar: () =>
    set((state) => ({
      isNavbarCollapse: !state.isNavbarCollapse,
    })),
});

export default createAppSlice;