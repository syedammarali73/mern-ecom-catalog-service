import productModel, { type Product } from './product-model.js';

export class ProductService {
    async createProduct(product: Product) {
        return await productModel.create(product);
    }

    async getProductImage(productId: string) {
        const product = await productModel.findById(productId);
        return product?.image;
    }

    async updateProduct(productId: string, product: Product) {
        return await productModel.findOneAndUpdate(
            { _id: productId },
            { $set: product },
            { returnDocument: 'after' },
        );
    }

    async getProduct(productId: string): Promise<Product | null> {
        return await productModel.findOne({ _id: productId });
    }

}
