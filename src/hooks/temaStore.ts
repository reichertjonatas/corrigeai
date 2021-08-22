import create from "zustand";
import { queryTemas } from "../graphql/query";
import { strapi } from "../services/strapi";


interface ITemasStore {
    temas: any[];
    currentTema: any | null;
    categoria: string;
    isLoading: boolean;
    getAllTemas: (token: string | undefined | unknown) => void;
    setCurrentTema: (currentTemaNovo: any) => void;
    setCategoria: (categoria: string,token: string | undefined | unknown) => void;
}

const temaStore = create<ITemasStore>((set, get) => ({
    temas: [],
    currentTema: null,
    categoria: 'corrigeai',
    isLoading: true,
    getAllTemas: async (token: string | undefined | unknown) => {
        const temas = await strapi(token).graphql({ query: queryTemas(get().categoria) });
        set({ temas: (temas as any[])?.length > 0 ? temas as any[] : [], currentTema: (temas as any)[0], isLoading: false });
    },

    setCurrentTema: (currentTemaNovo: any) => {
        set({ currentTema: currentTemaNovo })
    },

    setCategoria: async (categoria: string, token: string | undefined | unknown) => {
        set({ isLoading: true })
        const temas = await strapi(token).graphql({ query: queryTemas(categoria) });
        set({ categoria: categoria, temas: temas as any[], currentTema: (temas as any)[0], isLoading: false })
    }
}))

export const useTemaStore = temaStore