import create from "zustand";
import { strapi } from "../services/strapi";

export interface IPlano {
    name: string
    total_envios: number
    plano_type: string
}

export interface ISubscription {
    id:	string
    envios: number
    enviosAvulsos:	number
    subscriptionDate: string | null
    subscriptionExpr: string | null
    plano: IPlano
}

export interface ISubscriptionInterface {
    subscription: ISubscription | null,
    setSubscription: (subscription: ISubscription, token?: string | unknown, force?: boolean) => void,
    updateSubscription: (id: string, token?: string | unknown) => void;
}

const subscriptionStore = create<ISubscriptionInterface>((set, get) => ({
    subscription: null,
    setSubscription: async (subscription: ISubscription, token?: string | unknown, force = true) => {
        if(force){
            const subscriptionRes = await strapi(token).findOne('subscriptions', subscription.id);
            set({ subscription: subscriptionRes as ISubscription });
        }else 
            set({subscription})
        
    },
    updateSubscription: async (id: string, token: string | undefined | unknown) => {
        console.log(" ==> subscription <== id: ", id, token);
        const subscription = await strapi(token).findOne('subscriptions', id);
        set({subscription: subscription as ISubscription})
    }
}))

export const useSubscriptionStore = subscriptionStore; 