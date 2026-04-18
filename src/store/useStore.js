import { create } from "zustand";

const useStore = create((set) => ({
  isNavbarCollapse: false,

  toggleNavbar: () =>
    set((state) => ({
      isNavbarCollapse: !state.isNavbarCollapse,
    })),
}));

export default useStore;