import toppingModel from './topping-model.js';
import type { Topping } from './topping-types.js';

export class ToppingService {
    async create(topping: Topping) {
        return await toppingModel.create(topping);
    }

    async getAll(tenantId: string) {
        return [{ name: 'topping' }];
    }
}
