export interface PriceConfiguration {
    [key: string]: {
        priceType: 'base' | 'additional';
        availableOptions: string[];
    };
}

export interface Attributes {
    name: string;
    widgetType: 'switch' | 'radio';
    defaultValue: string;
    availableOptions: string[];
}

export interface Category {
    name: string;
    priceConfiguration: PriceConfiguration;
    attributes: Attributes[];
}

export type UpdateCategory = Partial<Category>;
