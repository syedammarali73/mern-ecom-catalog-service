import CategoryModel from './category-model.js';
import type { Category } from './category-types.js';

export class CategoryService {
    async create(category: Category) {
        const newCategory = new CategoryModel(category);
        return newCategory.save();
    }

    async getOne(categoryId: string) {
        return await CategoryModel.findOne({ _id: categoryId });
    }

    async update(
        categoryId: string,
        updateData: Partial<Category>,
    ): Promise<({ _id: string } & Category) | null> {
        return await CategoryModel.findByIdAndUpdate(categoryId, updateData, {
            returnDocument: 'after',
        });
    }
}
