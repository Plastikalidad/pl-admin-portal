import { Product } from "./product.interface";

export interface Restock {
  key: string;
  code: string;
  date: string;
  products: { code: string, design: string, size: string, availableStocks: number, addStock: number, regPricePerBundle: number, qtyPerBundle: number; }[];
  usedDiscount: string;
  totalPrice: number;
  notes: string;
  status: 'Pending' | 'Confirmed'
}
