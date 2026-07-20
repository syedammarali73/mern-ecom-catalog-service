import productModel, { type Product } from './product-model.js';

export class ProductService {
    async createProduct(product: Product) {
        return await productModel.create(product);
    }
}
