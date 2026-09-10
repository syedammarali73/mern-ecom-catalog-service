import mongoose from 'mongoose';
import type { Topping } from './topping-types.js';

const toppingSchema = new mongoose.Schema<Topping>(
    {
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        tenantId: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

export default mongoose.model<Topping>('Topping', toppingSchema);
