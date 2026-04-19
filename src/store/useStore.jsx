import { create } from "zustand";
import createAppSlice from "./appSlice";

/**
 * Global Client Store
 */
export const useStore = create((...a) => ({
  ...createAppSlice(...a),
}));