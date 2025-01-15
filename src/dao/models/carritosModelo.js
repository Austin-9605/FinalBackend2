import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
    {
        products: {
            type: [
                {
                    product: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "products"
                    },
                    quantity: {
                        type: Number,
                        min: 1
                    }
                }
            ],
            default: [] 
        }
    },
    {
        timestamps: true
    }
)


export const carritoModelo = mongoose.model(
    "carts",
    cartSchema
)