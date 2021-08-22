import create from "zustand";
import { strapi } from "../services/strapi";

export interface IMeInterface {
    user: {
        id: string;
        email: string;
        name: string;
        foto: {
            url: string;
        }
    } | null,
    setMe: (token: string | undefined | unknown) => void;
    changePassword: () => Promise<boolean>;
}

const meStore = create<IMeInterface>((set, get) => ({
    user: null,
    setMe: async (token: string | undefined | unknown) => {
        const response = await strapi(token).find('users/me');
        const user:any = response as any;
        if (user) {
            set({ user: { id: user.id, name: user.name, email: user.email, foto: { url: user.foto.url } } });
        }
    },
    changePassword: async () => {
        return false;
    }
}))

export const useMeStore = meStore; 