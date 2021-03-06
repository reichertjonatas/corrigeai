import {Token} from 'graphql';
import create from "zustand";
import {ICompetencias, ICorrecoes, IObsEnem, IRedacoes} from "../models/User";
import {API} from "../services/api";
// @ts-ignore
import Annotation from 'react-image-annotation'
import {
   RectangleSelector,
   // @ts-ignore
} from 'react-image-annotation/lib/selectors'
import {
   checkDiscrepancia,
   corretor_type,
   initialCompetencias,
   IObsEnemFilter,
   notaTotalRedacao,
   obs_enem
} from "../utils/helpers";
import {debugPrint} from "../utils/debugPrint";
import {session} from "next-auth/client";
import {strapi} from "../services/strapi";
import {redacaoParaCorrigir} from "../graphql/query";

export interface ICorrecoesCorretor {
   _id: string;
   email: string;
   redacoes: IRedacoes[]
}

const corretorStore = create < {
   redacoes: any[],
   redacao: any | null,
   annotations: any[],
   annotation: any,
   type: any,
   editorType: number,
   competencia: number,
   competenciasOffline: ICompetencias[],

   minhasCorrecoes: ICorrecoesCorretor[],

   correcao: any | null,

   setCorrecao: (correcao : any) => void,

   setRedacoes: (redacoes : any[]) => void,

   updateRedacoes: (role : string, token : string | undefined | unknown) => void;

   setRedacao: (redacao : any) => void,
   setAnnotations: (annotations : any[]) => void,
   setAnnotation: (annotation : any) => void,
   setType: (type : any) => void,
   setEditorType: (type : number) => void,
   setCompetencia: (competencia : number) => void,
   setNota: (nota : number, index : number) => void,
   setObs: (obs : string, index : number) => void,

   salvarCorrecao: (idRedacao : string, session : any | undefined | unknown) => Promise < {
      error: boolean,
      message: string
   } >,
   removerCorrecao: (idRedacao : string, session : any | undefined | unknown, message : string) => Promise < {
      error: boolean,
      message: string
   } >,

   setCorrecaoNull: () => void,

   getMinhasCorrecoes: () => void,
   setNullCorrecoes: () => void,
   setNullRedacoes: () => void,
   setNullFrontEnd: () => void,
   setCorrecaoFrontEnd: (correcao : ICorrecoes) => void,

   setCompetenciaOffline: (competenciasOffline : ICompetencias[]) => void,

   corretorId: string
} > ((set, get) => ({
   redacoes: [],
   redacao: null,
   annotations: [],
   annotation: {},
   type: RectangleSelector.TYPE,
   editorType: 1,
   competencia: 1,
   competenciasOffline: initialCompetencias,
   minhasCorrecoes: [],
   correcao: null,

   setCorrecao: (correcao : any) => {
      set({correcao: correcao});
   },

   setRedacoes: (redacoes : any[]) => {
      set({
         redacoes: redacoes ?. length >= 0 ? redacoes : []
      });
   },


   updateRedacoes: async (role : string, token : string | undefined | unknown) => {
      const redacoes: any = await strapi(token).graphql({
         query: redacaoParaCorrigir(corretor_type(role))
      })
      set({
         redacoes: redacoes ?. length >= 0 ? redacoes : []
      });
   },

   setRedacao: async (redacao : any) => {
      set({redacao: redacao});
   },

   setAnnotations: (annotations) => set(
      {annotations: annotations}
   ),
   setAnnotation: (annotation) => set(
      {annotation: annotation}
   ),
   setType: (type) => set(
      {type: type}
   ),
   setEditorType: (editorType) => set(
      {editorType: editorType}
   ),
   setCompetencia: (competencia) => set(
      {competencia: competencia}
   ),
   setNota: (nota : number, index : number) => set((state) => set({
      competenciasOffline: state.competenciasOffline.map(
         (item : ICompetencias, indexMap : number) => {
            const filterObsEnem: IObsEnemFilter[] = obs_enem[index].filter(item => item.nota === nota);

            // console.log(filterObsEnem[0], 'filterObsEnem ====>', filterObsEnem, ' nota ====> ', nota, ' index ====> ', index);

            return(indexMap === index ?
            // item.nota == nota ?
            //     { ...item, nota: item.nota = -1 }
            //     :
               {
               ...item,
               nota: item.nota = nota,
               obs_enem: filterObsEnem.length <= 0 ? null : filterObsEnem[0]
            } : item);
         }
      )
   })),
   setObs: (message : string, index : number) => set((state) => set({
      competenciasOffline: state.competenciasOffline.map(
         (item : ICompetencias, indexMap : number) => {
            debugPrint(" ====> corretorStore ", message, " index ==>", index === indexMap)
            return(indexMap === index ? {
               ...item,
               obs: message
            } : item);
         }
      )
   })),

   salvarCorrecao: async (idRedacao : string, session : any | undefined | unknown) => {
      try {

         const novaCorrecao: any = await strapi((session as any).jwt).create('correcaos', {
            marcacoes: get().annotations,
            competencias: get().competenciasOffline,
            corretor: (session as any).id
         });
         // console.log("novaCorrecao", novaCorrecao)
         if (! novaCorrecao ?. id) 
            throw new Error("Erro ao salvar corre????o.")


         


         const redacao: any = await strapi((session as any).jwt).findOne('redacaos', idRedacao)
         // console.log("redacao ====> above", redacao)
         if (! redacao ?. id) 
            throw new Error("A reda????o n??o foi encontrada no sistema para salvar a corre????o.")


         


         // console.log("redacao ====> before ", redacao)

         const correcoes: any[] = redacao.correcaos;
         // console.log("salvarCorrecao: ===> ", correcoes)
         correcoes.push(novaCorrecao.id);
         // console.log("salvarCorrecao: ===> ", correcoes)

         let novoStatus
         const oldStatus = redacao.status_correcao;
         if (redacao.status_correcao) {
            switch (redacao.status_correcao) {
               case "redacao_simples": novoStatus = "finalizada"
                  break;

               case "correcao_um": novoStatus = "correcao_dois"
                  break;

               case "correcao_dois":
                  var discrepancia = false

                  // console.log("aqui vai calc discrepancia");

                  novoStatus = discrepancia ? "discrepancia" : "finalizada"
                  break;
            }
         }
         // console.log("before switch")

         const updated: any = await strapi((session as any).jwt).update('redacaos', idRedacao, {
            status_correcao: novoStatus,
            correcaos: correcoes
         })

         if (novoStatus == "finalizada") {
            const redacaoFinalStatus = await strapi((session as any).jwt).findOne('redacaos', redacao.id);
            await strapi((session as any).jwt).update('redacaos', redacao.id, {nota_final: notaTotalRedacao(redacaoFinalStatus)})

            if (oldStatus == 'correcao_dois') {
               const discrepante = checkDiscrepancia(redacaoFinalStatus, 100);
               if (discrepante) {
                  await strapi((session as any).jwt).update('redacaos', idRedacao, {
                     status_correcao: 'discrepancia',
                     correcaos: correcoes
                  })

                  const redacaoFinalStatus = await strapi((session as any).jwt).findOne('redacaos', redacao.id);
                  await strapi((session as any).jwt).update('redacaos', redacao.id, {nota_final: notaTotalRedacao(redacaoFinalStatus)})
               }
            }
         }

         if (! updated ?. id) 
            throw new Error("Corre????o n??o foi salva!")


         


         get().updateRedacoes((session as any).role.type, (session as any).jwt);

         return {error: false, message: "Corre????o salva com sucesso!"}

      } catch (error) { // @ts-ignore
         return {error: true, message: error.message}
      }

      // return { error: true, message: 'Erro ao salvar sua corre????o!'}
   },


   removerCorrecao: async (idRedacao : string, session : any | undefined | unknown, message : string) => {
      try {
         const messageDefault = `
                        <h2>Fala, cara p??lida!</h2>
                        A gente n??o conseguiu corrigir sua reda????o por algum motivo espec??fico. 
                        N??o se preocupe, o seu cr??dito j?? foi inserido novamente. Cuide no pr??ximo envio!
                        Qualquer d??vida, voc?? pode contatar nosso suporte!
                        At?? j??, 
                        Corrige A??


                        Motivo:
                           ${message}
                     `

         console.log("idRedacao", idRedacao)
         const redacao: any = await strapi((session as any).jwt).findOne('redacaos', idRedacao)
         const correcoes: any[] = redacao.correcaos;
         let novoStatus

         if (redacao.status_correcao) {
            switch (redacao.status_correcao) {
               case "redacao_simples": novoStatus = "rejeitada"
                  break;

               case "correcao_um": novoStatus = "rejeitada"
                  break;

               case "correcao_dois": novoStatus = "rejeitada"
                  break;
            }
         }

         console.log(novoStatus)

         const updated: any = await strapi((session as any).jwt).update('redacaos', idRedacao, {
            status_correcao: novoStatus,
            correcaos: correcoes,
            msg_rejeicao: messageDefault
         })

         if (! updated ?. id) 
            throw new Error("Reda????o n??o foi rejeitada!")

         

         get().updateRedacoes((session as any).role.type, (session as any).jwt);

         return {error: false, message: "Reda????o rejeitada com sucesso!"}

      } catch (error) { // @ts-ignore
         return {error: true, message: error.message}
      }
   },

   setCorrecaoNull: () => set(
      {redacao: null}
   ),

   getMinhasCorrecoes: async () => {
      const response = await API.post('/painel/redacao/getMinhasCorrecoes');
      if (response.status === 200) {
         set({minhasCorrecoes: response.data.data as ICorrecoesCorretor[]});
      }
   },

   setCompetenciaOffline: (competenciasOffline : ICompetencias[]) => {
      set({competenciasOffline: competenciasOffline})
   },
   setNullRedacoes: () => {
      set({redacoes: []});
   },
   setNullCorrecoes: () => set(
      {
         redacao: null,
         annotations: [],
         annotation: {},
         type: RectangleSelector.TYPE,
         editorType: 1,
         competencia: 1,
         competenciasOffline: initialCompetencias,
         minhasCorrecoes: []
      }
   ),
   setNullFrontEnd: () => set(
      {
         redacao: null,
         annotations: [],
         annotation: {},
         type: RectangleSelector.TYPE,
         editorType: 1,
         competencia: 1,
         competenciasOffline: initialCompetencias,
         minhasCorrecoes: []
      }
   ),
   setCorrecaoFrontEnd: (correcao : ICorrecoes) => set(
      {correcao: correcao}
   ),
   corretorId: ''
}));

export const useCorretorStore = corretorStore;
