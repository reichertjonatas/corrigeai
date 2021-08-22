import create from "zustand";
import { API } from "../services/api";

export interface IPagina {
    _id: string;
    title: string;
    slug: string;
    contentHtml: string;
    isFaq: boolean;
}

interface IPaginaStore {
    paginas: IPagina[];

    pagina: IPagina | null,

    getAll: (isFaq: boolean, page?: number) => void;
    read: (id: string) => void;
    create: (pagina: IPagina) => void;
    update: (pagina: IPagina) => void;
    delete: (id: string, isFaq: boolean) => void;

    setPageNull: () => void;

    getAllPages: () => void;

}

const paginaStore = create<IPaginaStore>((set, get) => ({
    paginas: [],
    pagina: null,
    getAll: (isFaq, page = 1) => {
        API.post('/painel/admin/pagina/getAll', { isFaq, page }).then((response) => {
            if (response.status === 200) {
                set({ paginas: response.data.data as IPagina[] });
            }
        })
    },
    read: async id => {
        const response = await API.post('/painel/admin/pagina/read', { id });

        if (response.status === 200)
            set(() => ({ pagina: response.data.data as IPagina }))
    },
    
    create: async (pagina) => {
        const response = await API.post('/painel/admin/pagina/create', { title: pagina.title, contentHtml: pagina.contentHtml, isFaq: pagina.isFaq });
        if(response.status === 200) 
            get().getAll(pagina.isFaq);
    },
    
    update: async (pagina: IPagina) => {
        const response = await API.post('/painel/admin/pagina/update', { id: pagina._id, title: pagina.title, contentHtml: pagina.contentHtml, isFaq: pagina.isFaq });
        if(response.status === 200) {
            get().getAll(pagina.isFaq);
        }
    },

    delete: async (id, isFaq) => {
        const response = await API.post('/painel/admin/pagina/delete', { id});
        if(response.status === 200 ){
            console.log(isFaq);
            get().getAll(isFaq);
        }
    },

    setPageNull: () => {
        set(() => ({ pagina: null }))
    },

    getAllPages: async () => {
        const response = await API.get('/painel/caed?faq=true')
        if(response.status === 200){
            set({ paginas: response.data.data })
        }
    }
}))

export const usePaginaStore = paginaStore;