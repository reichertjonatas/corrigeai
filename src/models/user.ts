import mongoose, { Schema } from 'mongoose';

export interface ISubscription {
    envios: number;
    subscriptionName: string;
    subscriptionType: number;
    subscriptionDate?: string | null;
    subscriptionExpr?: string | null;
}

export interface ICalenderEvents {
    _id?: string;
    title: string;
    start: any;
    end: any;
    eventProps: {
        color: string;
    };
    allDay?: boolean;
}


export interface IRecompensa {
    _id?: string;
    title: string;
    description: string;
    icon: string;
    nivel: number;
    isActive: boolean;
}

export interface IItemObsEnem {
    section?: string | null;
    text: string;
}

export interface IObsEnem {
    color: string;
    nota: number;
    items: IItemObsEnem[]
}

export interface ICompetencias {
    _id?: string;
    title: string;
    nota: number;
    obs: string;
    obs_enem?: IObsEnem | null;
}

export interface ICorrecoes {
    _id: string;
    competencias: ICompetencias[];
    marcacoes: any[];
    corretor: string;
    createdAt: string;
}

export interface IRedacoes {
    _id: string;
    redacao: string;
    nota_final: number;
    in_review: number;
    correcoes: ICorrecoes[];
    tema_redacao: string;
    createdAt: string;
}


export interface IUser {
    _id: string
    name: string
    password: string,
    email: string
    image?: string | null
    userType: number
    nivel: number
    recompensas: IRecompensa[]
    redacoes: IRedacoes[]
    eventos: ICalenderEvents[]
    subscription: ISubscription
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
    name: { type: String, default: '' },
    image: { type: String, default: null },
    emailVerified: { type: Date, default: null },
    userType: { type: Number, default: 0 },
    nivel: { type: Number, default: 1 },
    recompensas: { type: Array, default: [] },
    redacoes: [
        {
            redacao: { type: String, required: true },
            nota_final: { type: Number, default: 0 },
            in_review: { type: Number, default: 0 },
            correcoes: [
                {
                    competencias: {
                        type: Array, default: [
                            {
                                title: String,
                                nota: { type: Number, required: true },
                                obs: String,
                                obs_enem: {
                                    type: {
                                        nota: { type: Number, required: true },
                                        color: { type: String, required: true },
                                        items: [{
                                            section: { type: String, required: null },
                                            text: { type: String, required: true },
                                        }]
                                    }, default: null
                                },
                            }
                        ]
                    },
                    marcacoes: Array,
                    corretor: String,
                    createdAt: { type: Date, default: Date.now },
                }
            ],
            tema_redacao: String,
            createdAt: { type: Date, default: Date.now },
        }
    ],
    eventos: [
        {
            title: String,
            start: Date,
            end: Date,
            eventProps: {
                color: String,
            },
            allDay: Boolean,
        }
    ],
    subscription: {
        envios: { type: Number, default: 0 },
        subscriptionName: { type: String, default: 'Grátis' },
        subscriptionType: { type: Number, default: 0 },
        subscriptionDate: { type: Date, default: null },
        subscriptionExpr: { type: Date, default: null }
    }
});

schema.set('timestamps', true);

const User = mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, schema);

export default User