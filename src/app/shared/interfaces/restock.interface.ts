import { Product } from "./product.interface";

export interface Restock {
  key: string;
  id: string;
  products: Product[];
  usedDiscount: string;
  totalPrice: number;
}
