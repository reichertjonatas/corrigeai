import create from "zustand";
import { IRedacoes } from "../models/userTeste";
import { API } from "../services/api";
import { debugPrint } from "../utils/debugPrint";

export interface IEnviosInterface {
    envios: any[];
    currentRedacao: any | null;
    getLastsRedacoes: (redacoes: any) => void;
    setCurrentRedacao: (redacao: IRedacoes) => void;

    setNullRedacoes: () => void;
    setNullCurrentRedacao: () => void
}

const enviosStore = create<IEnviosInterface>((set, get) => ({
    envios: [],
    currentRedacao: null,
    getLastsRedacoes: async (redacoes:any) => {

        set({ envios: redacoes })
        
        // const response = await API.post('/painel/redacao/getAllSeusEnvios');
        // if(response.status === 200 && !response.data.error) {
        //     set({envios: response.data.data as IRedacoes[]});
        // }
    },
    setCurrentRedacao: (redacao: IRedacoes) => {},

    setNullRedacoes: () => {},
    setNullCurrentRedacao: () => {},
}));

export const useEnviosStore = enviosStore; 