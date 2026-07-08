import mongoose from 'mongoose';

interface PriceConfiguration {
    [key: string]: {
        priceType: 'base' | 'additional';
        availableOptions: string[];
    };
}

interface Attributes {
    name: string;
    widgetType: 'switch' | 'radio';
    defaultValue: string;
    availableOptions: string[];
}

export interface Category {
    name: string;
    priceCofiguration: PriceConfiguration;
    attributes: Attributes[];
}

const priceCofigurationSchema = new mongoose.Schema<PriceConfiguration>({
    priceType: {
        type: String,
        enum: ['base', 'additional'],
        required: true,
    },
    availableOptions: {
        type: [String],
        required: true,
    },
});

const attributeSchema = new mongoose.Schema<Attributes>({
    name: {
        type: String,
        required: true,
    },
    widgetType: {
        type: String,
        enum: ['switch', 'radio'],
        required: true,
    },
    defaultValue: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    availableOptions: {
        type: [String],
        required: true,
    },
});

const categorySchema = new mongoose.Schema<Category>({
    name: {
        type: String,
        required: true,
    },
    priceCofiguration: {
        type: Map,
        of: priceCofigurationSchema,
        required: true,
    },
    attributes: {
        type: [attributeSchema],
        required: true,
    },
});

export default mongoose.model('Category', categorySchema);
