import CategoryModel from './category-model.js';
import type { Category } from './category-types.js';

export class CategoryService {
    async create(category: Category) {
        const newCategory = new CategoryModel(category);
        return newCategory.save();
    }
}
