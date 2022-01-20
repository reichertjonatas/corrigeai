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

   createRedacao: async (body: any, subscription: ISubscription, id: string, token: string | unknown) => {
      if (subscription.envios > 0) {
          const response:any = await strapi(token).create("redacaos", body).catch( (error) => {
              console.log("body", body, "error ==> ", error)
          });
          
          if (response) {
              const nEnvios = subscription.envios - 1;
              await strapi(token).update("subscriptions", subscription.id, {
                  envios:  nEnvios < 0 ? 0 : nEnvios  
              });
              
              await get().updateRedacoes(id, token);
              console.log("redacao Res", response)
              
              return { error: false, data: { message: 'Redação enviada!', redacaoId: response.id}};
          }
          return { error: true, data: { message: 'Error ao enviar redação!'}};
      }
      return {error: true, data: { message: 'Você não possui envios disponíveis!' }};
  },

   removerRedacao: async (subscription : ISubscription, id : string, token : string | unknown) => {
      const idRedacaoGet:any = await strapi(token).findOne('redacaos', id)
      const idClient = idRedacaoGet.user.id;
      const clientSubcriptionId = idRedacaoGet.user.subscription

      const subscriptionGet:any = await strapi(token).findOne('subscriptions', clientSubcriptionId)

      console.log(idRedacaoGet)
      console.log(subscriptionGet)
      
      const nRetorno = subscriptionGet.envios + 1;

      await strapi(token).update("subscriptions", clientSubcriptionId, {
         envios: nRetorno
      });

      return {
         error: false,
         data: {
            message: 'Error ao resetar redação!'
         }
      }
   }
}))

export const useRedacaoStore = redacaoStore;