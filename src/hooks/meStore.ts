import create from "zustand";
import { strapi } from "../services/strapi";

export interface IMeInterface {
    user: {
        id: string;
        email: string;
        name: string;
        image?: string
        corretor_type?: string;
        createdAt: string;

    } | null,
    setMe: (token: string | undefined | unknown) => Promise<void>;
    changePassword: () => Promise<boolean>;
}

const meStore = create<IMeInterface>((set, get) => ({
    user: null,
    setMe: async (token: string | undefined | unknown) => {
        const response = await strapi(token).find('users/me');
        const user: any = response as any;
        if (user) {
            set({
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user?.foto != null ? user.foto.url : null,
                    corretor_type: user?.corretor_type ? user.corretor_type : null,
                    createdAt: user.createdAt
                }
            });
        }
    },
    changePassword: async () => {
        return false;
    }
}))

export const useMeStore = meStore;