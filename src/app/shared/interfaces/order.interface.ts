import { Customer } from "./customer.interface";

export interface Order {
  key: string;
  code: string;
  date: string;
  customer: Customer;
  products: { code: string, design: string, size: string, availableStocks: number, quantity: number, regPricePerBundle: number, qtyPerBundle: number; }[];
  totalPrice: number;
  notes: string;
  status: 'Reserved' | 'Not Packed' | 'Packed' | 'Completed' | 'Cancelled'
}
