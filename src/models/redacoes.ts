import mongoose, { Schema } from 'mongoose';

export interface IRedacoes {
    redacao: string;
    competencias: any[];
    correcoes: any[];
    tema_redacao: string;
    user_owner: string;
}

const MODEL_NAME = 'Redacao';

const schema = new Schema<IRedacoes>({
    redacao: { type: String, required: true },
    competencias: [],
    correcoes: [],
    tema_redacao: { type: Schema.Types.ObjectId, ref: 'Tema' },
    user_owner: { type: Schema.Types.ObjectId, ref: 'User' }
});

schema.set('timestamps', true);

const Redacao = mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, schema);

export default Redacao