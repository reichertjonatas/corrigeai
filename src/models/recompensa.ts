import mongoose, { Schema } from 'mongoose';

export interface IRecompensa {
    title: string;
    description: string;
    icon: string;
    nivel: number;
    isActive: boolean;
}

const MODEL_NAME = 'Recompensa';

const schema = new Schema<IRecompensa>({
    redacao: { type: String, required: true },
    competencias: [],
    correcoes: [],
    tema_redacao: { type: Schema.Types.ObjectId, ref: 'Tema' },
    user_owner: { type: Schema.Types.ObjectId, ref: 'User' }
});

schema.set('timestamps', true);

const Recompensa = mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, schema);

export default Recompensa