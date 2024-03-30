import { Injectable, inject } from '@angular/core';
import { Product } from '../../shared/interfaces/product.interface';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable, filter, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public db = inject(AngularFireDatabase);
  public productsRef: AngularFireList<Product> = this.db.list<Product>('products');


  public getProducts(searchItem?: string): Observable<Product[]> {
    return this.db.list('products').snapshotChanges()
      .pipe(
        map((changes) => {
          return changes
            .map((c) => {
              const product = ({ key: c.payload.key, ...c.payload.toJSON() } as Product)
              return product;
            })
        }),

      ).pipe(
        map(items =>
          searchItem ? items.filter(item => item.code.includes(searchItem as string) || item.design.includes(searchItem as string) || item.size.includes(searchItem as string)) : items
        )
      )

  }

  public getProduct(id: string) {
    return this.db.list('products', (ref) => ref.orderByChild('code').equalTo(id)).snapshotChanges()
      .pipe(
        map((changes) => {
          return changes
            .map((c) => {
              const product = ({ key: c.payload.key, ...c.payload.toJSON() } as Product)
              return product;
            })
        }),

      );
  }

  public addProduct(product: Product) {
    return this.productsRef.push(product);
  }

  public updateProduct(product: Product) {
    return this.productsRef.update(product.key, { ...product });
  }

  public deleteProduct(key: string) {
    return this.productsRef.remove(key);
  }
}
