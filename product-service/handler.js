import { getProductById } from './src/lambdas/get-product-by-id.ts';
import { getProductsList } from './src/lambdas/get-all-products.ts';
import { addProduct } from './src/lambdas/add-product.ts';
import { catalogBatchProcess } from './src/lambdas/catalog-batch-process';

export {
  getProductById,
  getProductsList,
  addProduct,
  catalogBatchProcess
}
