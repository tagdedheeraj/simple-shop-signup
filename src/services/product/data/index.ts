
import { Product } from '@/types/product';
import { wheatProducts } from './wheat';
import { riceProducts } from './rice';

// Only include wheat and rice products - other categories removed
export const products: Product[] = [
  ...wheatProducts,
  ...riceProducts
];
