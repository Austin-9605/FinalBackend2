import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";


const productSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        code: {
            type: String,
            unique: true
        },
        price: Number,
        status: Boolean,
        stock: Number,
        category: String,
        thumbnail: Array
    },
    {
        timestamps: true
    }
)

productSchema.plugin(mongoosePaginate)

export const productoModelo = mongoose.model(
    "products",
    productSchema
)

