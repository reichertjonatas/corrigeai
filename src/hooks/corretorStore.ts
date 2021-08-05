import create from "zustand";
import { ICompetencias, IObsEnem, IRedacoes } from "../models/user";
import { API } from "../services/api";
// @ts-ignore
import Annotation from 'react-image-annotation'
import {
    RectangleSelector,
    // @ts-ignore
} from 'react-image-annotation/lib/selectors'
import { initialCompetencias, IObsEnemFilter, obs_enem } from "../utils/helpers";

const corretorStore = create<{
    redacao: IRedacoes | null,
    annotations: any[],
    annotation: any,
    type: any,
    editorType: number,
    competencia: number,
    competenciasOffline: ICompetencias[],
    initData: (id: string) => void,
    setAnnotations: (annotations: any[]) => void,
    setAnnotation: (annotation: any) => void,
    setType: (type: any) => void,
    setEditorType: (type: number) => void,
    setCompetencia: (competencia: number) => void,
    setNota: (nota: number, index: number) => void,
    setCorrecaoNull: () => void,
}>((set) => ({
    redacao: null,
    annotations: [],
    annotation: {},
    type: RectangleSelector.TYPE,
    editorType: 1,
    competencia: 1,
    competenciasOffline: initialCompetencias,
    initData: async (id: string) => {
        API.post('/painel/redacao/readCorretor', { _id: id }).then(response => {
            if (response.status === 200) {
                set({ redacao: response.data.data as IRedacoes });
                console.log('initData redacao', response.data.data)
            }
        })
    },
    setAnnotations: (annotations) => set({ annotations: annotations }),
    setAnnotation: (annotation) => set({ annotation: annotation }),
    setType: (type) => set({ type: type }),
    setEditorType: (editorType) => set({ editorType: editorType }),
    setCompetencia: (competencia) => set({ competencia: competencia }),
    setNota: (nota: number, index: number) => set((state) => set({
        competenciasOffline: state.competenciasOffline.map((item: ICompetencias, indexMap: number) => {
            const filterObsEnem: IObsEnemFilter[] = obs_enem[index].filter(item => item.nota === nota);

            console.log('filterObsEnem ====>' , filterObsEnem, ' nota ====> ', nota, ' index ====> ', index);

            return (indexMap === index ?
            // item.nota == nota ?
            //     { ...item, nota: item.nota = -1 }
            //     :
                { ...item, nota: item.nota = nota, obs_enem: nota === 200 ? null : filterObsEnem[0] }
            :
            item);})
    })),
    setCorrecaoNull: () => set({ redacao: null }),
}));

export const useCorretorStore = corretorStore;