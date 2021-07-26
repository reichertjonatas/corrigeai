import mongoose, { Schema } from 'mongoose';

export interface ITemas {
    tema: string;
    content: string;
    category: number;
    visible: boolean
}

const MODEL_NAME = 'Tema';

const schema = new Schema<ITemas>({
    tema: String,
    content: String,
    category: {type: Number, default: 1},
    visible: {type: Boolean, default: true}
});

schema.set('timestamps', true);

const Tema = mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, schema);

export default Tema