import create from "zustand";
import { IRedacoes } from "../models/user";
import { API } from "../services/api";

interface IRedacaoStore {
    redacoes: IRedacoes[];
    corrigir: IRedacoes | null;

    getAllCorretor: (page?: number) => void;
    // delete: (id: string) => void;

    setRedacaoNull: () => void;

}

const redacaoStore = create<IRedacaoStore>((set, get) => ({
    redacoes: [],
    corrigir: null,
    getAllCorretor: (page = 1) => {
        API.post('/painel/redacao/getAllCorretor', { page }).then((response) => {
            if (response.status === 200) {
                const redacoes = response.data.data as IRedacoes[];
                var filtred:any = [];

                redacoes.map((redacaosUser: any ) => {
                    return redacaosUser.redacoes.map((redacao: IRedacoes) => {
                        filtred.push({ _id: redacaosUser._id, email: redacaosUser.email, redacoes: [redacao] });
                        return [];
                    });
                });

                filtred.sort((a: any, b: any) => (new Date(b.redacoes[0].createdAt).getTime() || -Infinity) - (new Date(a.redacoes[0].createdAt).getTime() || -Infinity))

                set({ redacoes: filtred as IRedacoes[]});
            }
        })
    },

    // delete: async (id) => {
    //     const response = await API.post('/painel/redacao/delete', { id });
    //     if(response.status === 200 ){
    //         get().getAllCorretor();
    //     }
    // },

    setRedacaoNull: () => {
        set(() => ({ corrigir: null }))
    }
}))

export const useRedacaoStore = redacaoStore;