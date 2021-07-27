import mongoose, { Schema } from 'mongoose';

export interface IUser {
    id: string 
    name: string
    password: string,
    email: string 
    image?: string | null
    userType: number 
    nivel: number
    recompensas: IRecompensa[]
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