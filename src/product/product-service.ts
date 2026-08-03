import type { Filter, PaginateQuery } from '../common/types/index.js';
import { paginationLabels } from '../config/pagination.js';
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

    async getProducts(q: string, filters: Filter, paginateQuery: PaginateQuery){
        const searchQueryRegex = new RegExp(q, "i");

        const matchQuery = {
            ...filters,
            name: searchQueryRegex
        }

        const aggregate = productModel.aggregate([
            {
                $match: matchQuery
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                attributes: 1,
                                priceConfiguration: 1
                            }
                        }
                    ]
                }
            },
            {
                $unwind: "$category"
            }
        ])


        return await productModel.aggregatePaginate(aggregate, {...paginateQuery, customLabels: paginationLabels});
    }

}
