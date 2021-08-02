import mongoose, { Schema } from 'mongoose';

export interface ITemas {
    _id: string;
    tema: string;
    content: string;
    category: number;
    visible: boolean
}

const MODEL_NAME = 'Tema';

const schema = new Schema<ITemas>({
    tema: {type: String, required: true},
    content: {type: String, required: true},
    category: {type: Number, default: 1},
    visible: {type: Boolean, default: true}
});

schema.set('timestamps', true);

const Tema = mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, schema);

export default Tema