import mongoose, { Schema } from 'mongoose';


export interface ICalenderEvents {
    id: number;
    title: string;
    start: any;
    end: any;
    eventProps: {
        color: string;
    };
    allDay?: boolean;
}


export interface IRecompensa {
    title: string;
    description: string;
    icon: string;
    nivel: number;
    isActive: boolean;
}

export interface ICompetencias {
    title: string;
    nota: number;
    obs: string;
    obs_enem: any[];
}

export interface ICorrecoes {
    competencias: ICompetencias[];
    marcacoes: any[];
}

export interface IRedacoes {
    redacao: string;
    nota_final: number;
    correcoes: any[];
    tema_redacao: string;
    user_owner: string;
}


export interface IUser {
    id: string 
    name: string
    password: string,
    email: string 
    image?: string | null
    userType: number 
    nivel: number
    recompensas: IRecompensa[]
    redacoes: IRedacoes[]
    eventos: ICalenderEvents[]
    subscription: {
        envios: number
        subscriptioName: String
        subscriptionType: number
        subscriptionDate: string
        subscriptionExpr: string
    }
}

export interface IRecompensa {
    data: string,
    recompensa_id: string, 
    isActive: boolean,
}

const MODEL_NAME = 'User';

const schema = new Schema<IUser>({
    email: {
        type: String,
        index: { unique: true }
    },
    password: String,
    name: {type: String, default: '' },
    image: {type: String, default: null },
    emailVerified: { type: Date, default: null },
    userType: { type: Number, default: 0 },
    nivel: { type: Number, default: 1 },
    recompensas: { type: Array, default: [] },
    redacoes: { type: Array, default: [] },
    eventos: { type: Array, default: [] },
    //     {
    //         id: Number,
    //         title: String,
    //         start: Date,
    //         end: Date,
    //         eventProps: {
    //             color: String,
    //         },
    //         allDay: { type: Boolean, default: false }
    //     }
    // ],
    subscription: {
        envios: {type: Number, default: 0},
        subscriptionName: {type: String, default: 'Grátis'},
        subscriptionType: {type: Number, default: 0},
        subscriptionDate: {type: Date, default: null},
        subscriptionExpr: {type: Date, default: null}
    } 
});

schema.set('timestamps', true);

const User = mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, schema);

export default User