import { Injectable, inject } from '@angular/core';
import { Product } from '../../shared/interfaces/product.interface';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public db = inject(AngularFireDatabase);
  public productsRef: AngularFireList<Product> = this.db.list<Product>('products');


  public getProducts(): AngularFireList<Product> {
    return this.db.list('products');
  }

  public addProduct(product: Product) {
    return this.productsRef.push(product);
  }
}
