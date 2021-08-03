import create from "zustand";

const menuStore = create<{
    menuOpen: boolean;
    setMenuOpen: () => void;
}>((set) => ({
    menuOpen: false,
    setMenuOpen: () => set((state) => ({menuOpen: !state.menuOpen })),
}))

export const useMenuStore = menuStore;