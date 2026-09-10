import toppingModel from './topping-model.js';
import type { Topping } from './topping-types.js';

export class ToppingService {
    async create(topping: Topping) {
        return await toppingModel.create(topping);
    }

    async getAll(tenantId: string, page: number, limit: number) {
        const skip = (page - 1) * limit;
        const filter = tenantId ? { tenantId } : {};

        const [data, total] = await Promise.all([
            toppingModel.find(filter).skip(skip).limit(limit),

            toppingModel.countDocuments(filter),
        ]);

        return { data, total };
    }
}
