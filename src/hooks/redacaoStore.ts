import {Subscription} from "react-hook-form/dist/utils/Subject";
import create from "zustand";
import {redacaoById, redacaoPerUser} from "../graphql/query";
import {IRedacoes} from "../models/User";
import {API} from "../services/api";
import {strapi} from "../services/strapi";
import {ISubscription} from "./subscriptionStore";

interface IRedacaoStore {
   redacoes: any[];
   currentRedacao: any | null;
   setRedacoes: (redacoes : any) => void;
   updateRedacoes: (id : string, token : string | unknown) => void;
   createRedacao: (body : any, subscription : ISubscription, id : string, token : string | unknown) => Promise<{error: boolean, data: any}>;
   removerRedacao: (subscription : ISubscription, id : string, token : string | unknown) => Promise<{error: boolean, data: any}>;
}

const redacaoStore = create < IRedacaoStore > ((set, get) => ({
   redacoes: [],
   currentRedacao: null,
   setRedacoes: (redacoes : any) => {
      set({redacoes})
   },

   updateRedacoes: async (id : string, token : string | unknown) => {
      const redacoes = await strapi(token).graphql({query: redacaoPerUser(id)});
      set({redacoes: redacoes as any})
   },

   createRedacao: async (body : any, subscription : ISubscription, id : string, token : string | unknown) => {
      if (subscription.envios > 0) {
         const response: any = await strapi(token).delete("redacaos", body).catch((error) => {
            console.log("body", body, "error ==> ", error)
         });

         if (response) {
            const nEnvios = subscription.envios - 1;
            await strapi(token).update("subscriptions", subscription.id, {
               envios: nEnvios < 0 ? 0 : nEnvios
            });

            await get().updateRedacoes(id, token);
            console.log("redacao Res", response)

            return {
               error: false,
               data: {
                  message: 'Redação enviada!',
                  redacaoId: response.id
               }
            };
         }
         return {
            error: true,
            data: {
               message: 'Error ao enviar redação!'
            }
         };
      }
      return {
         error: true,
         data: {
            message: 'Você não possui envios disponíveis!'
         }
      };
   },

   removerRedacao: async (subscription : ISubscription, id : string, token : string | unknown) => {
    
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMWY5ZjcxMjE3ZWNiMWI2MGUyNmRmNSIsImlhdCI6MTY0MTQ5NDgyOSwiZXhwIjoxNjQ0MDg2ODI5fQ.Tt-VHZfouCchH1Ui_932C6iqIf83NZmyRYf9H4wFlrQ";  
    
    
         const response: any = await strapi(token).delete("correcao", id)
         const nRetorno = subscription.envios + 1;

         await strapi(token).update("subscriptions", subscription.id, {
               envios: subscription.envios + 1
            });

         // if (response) {
            
         //    console.log(nRetorno)
            

         //    await get().updateRedacoes(id, token);
         //    console.log("id", subscription.id, "envios", subscription.envios)

         //    return {
         //       error: false,
         //       data: {
         //          message: 'Redação Resetada',
         //          redacaoId: response.id
         //       }
         //    }
         // }

         return {
            error: true,
            data: {
               message: 'Error ao resetar redação!'
            }
         }
   }
}))

export const useRedacaoStore = redacaoStore;


/* Page


backup 




interface IRedacaoStore {
    redacoes: any[];
    
    corrigir: IRedacoes | null;

    getAllCorretor: (revisaoType: number, page?: number, ) => void;
    // delete: (id: string) => void;

    setNullRedacoes: () => void;

    setRedacaoNull: () => void;

}

const redacaoStore = create<IRedacaoStore>((set, get) => ({
    redacoes: [],
    corrigir: null,
    getAllCorretor: (revisaoType = 0, page = 1) => {
        API.post('/painel/redacao/getAllCorretor', { revisaoType, page }).then((response) => {
            if (response.status === 200) {
                const redacoes = response.data.data as IRedacoes[];
                var filtred:any = [];

                redacoes?.map((redacaosUser: any ) => {
                    return redacaosUser.redacoes.map((redacao: IRedacoes) => {
                        filtred.push({ _id: redacaosUser._id, email: redacaosUser.email, redacoes: [redacao] });
                        return [];
                    });
                });

                // @ts-ignore
                filtred.sort(function(a:any, b: any) { return new Date(a.redacoes[0].createdAt) - new Date(b.redacoes[0].createdAt) }); // .sort((a: any, b: any) => (new Date(b.redacoes[0].createdAt).getTime() || -Infinity) - (new Date(a.redacoes[0].createdAt).getTime() || -Infinity))

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

    setNullRedacoes: () => {
        set({redacoes: []});
    },

    setRedacaoNull: () => {
        set(() => ({ corrigir: null }))
    }
}))


*/
