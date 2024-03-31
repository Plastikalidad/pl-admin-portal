import { Injectable, inject } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable, filter, map } from 'rxjs';
import { Discount } from '../../shared/interfaces/discount.interface';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  public db = inject(AngularFireDatabase);
  public DiscountsRef: AngularFireList<Discount> = this.db.list<Discount>('discounts');


  public getDiscounts(searchItem?: string): Observable<Discount[]> {
    return this.db.list('discounts').snapshotChanges()
      .pipe(
        map((changes) => {
          return changes
            .map((c) => {
              const discount = ({ ...c.payload.toJSON(), key: c.payload.key } as Discount)
              return discount;
            })
        }),

      ).pipe(
        map(items =>
          searchItem ? items.filter(item => item.code.includes(searchItem as string)) : items
        )
      )

  }

  public getDiscount(id: string) {
    return this.db.list('discounts', (ref) => ref.orderByChild('code').equalTo(id)).snapshotChanges()
      .pipe(
        map((changes) => {
          return changes
            .map((c) => {
              const discount = ({ key: c.payload.key, ...c.payload.toJSON() } as Discount)
              return discount;
            })
        }),

      );
  }

  public addDiscount(discount: Discount) {
    return this.DiscountsRef.push(discount);
  }

  public updateDiscount(discount: Discount) {
    return this.DiscountsRef.update(discount.key, { ...discount });
  }

  public deleteDiscount(key: string) {
    return this.DiscountsRef.remove(key);
  }
}
