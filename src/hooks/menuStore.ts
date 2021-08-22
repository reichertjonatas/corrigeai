import create from "zustand";

const menuStore = create<{
    menuOpen: boolean;
    setMenuOpen: () => void;
}>((set) => ({
    menuOpen: true,
    setMenuOpen: () => set((state) => ({menuOpen: !state.menuOpen })),
}))

export const useMenuStore = menuStore;