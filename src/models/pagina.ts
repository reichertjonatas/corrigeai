import mongoose, { Schema } from 'mongoose';
import { IPagina } from '../hooks/paginaStore';
// @ts-ignore
import URLSlug from "mongoose-slug-generator";

mongoose.plugin(URLSlug);

const MODEL_NAME = 'Pagina';

const schema = new Schema<IPagina>({
    title: String,
    slug: {type: String, slug: "title", unique: true },
    contentHtml: String,
    isFaq: {type: Boolean, default: false}
});

schema.pre("save", function(next) {
    this.slug = this.title.split(" ").join("-");
    next();
});

schema.set('timestamps', true);

const Pagina = mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, schema);

export default Pagina