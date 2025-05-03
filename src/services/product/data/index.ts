
import { Product } from '@/types/product';
import { wheatProducts } from './wheat';
import { riceProducts } from './rice';
import { vegetableProducts } from './vegetables';
import { onionProducts } from './onions';
import { fruitProducts } from './fruits';

// Combine all product categories into a single array
export const products: Product[] = [
  ...wheatProducts,
  ...riceProducts,
  ...vegetableProducts,
  ...onionProducts,
  ...fruitProducts
];
