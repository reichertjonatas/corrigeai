import create from "zustand";
import { ITemas } from "../models/tema";
import { API } from "../services/api";
import { debugPrint } from "../utils/debugPrint";


interface ITemasStore {
    temas: ITemas[];
    currentTema: ITemas | null;
    getAllTemas: () => void;
    setCurrentTema: (currentTemaNovo: ITemas) => void;


    numPages: number | null;
    setNumPages: (numPages:number) => void;
    pageNumber: number; 
    setPagerNumber: (pageNumber:number) => void;
}

const temaStore = create<ITemasStore>((set, get) => ({
    temas: [],
    currentTema: null,
    getAllTemas: async () => {
        API.post('/painel/tema/getAll').then((response) => {
            if (response.status === 200) {
                const temas = response.data.data as ITemas[];

                if(get().currentTema == null) {
                    set({ currentTema: temas[0], temas: temas})
                    return;
                }

                set({temas: temas});
            }
        })
    },

    setCurrentTema: (currentTemaNovo: ITemas) => {
        set({currentTema: currentTemaNovo})
    },

    numPages: null,
    setNumPages: (numPages:number) => {
        set({numPages: numPages})
    },

    pageNumber: 1,
    setPagerNumber: (pageNumber:number) => {
        set({pageNumber: pageNumber})
    }
}))

export const useTemaStore = temaStore