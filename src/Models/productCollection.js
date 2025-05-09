import mongoose from "mongoose";
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true }
}, { timestamps: true });


export const Products = mongoose.model('Product', ProductSchema);