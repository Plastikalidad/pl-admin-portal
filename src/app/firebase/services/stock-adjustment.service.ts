import { Injectable, inject } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable, map } from 'rxjs';
import { StockAdjustment } from '../../shared/interfaces/stock-adjustment.interface';

@Injectable({
  providedIn: 'root'
})
export class StockAdjustmentService {
  public db = inject(AngularFireDatabase);
  public stockadjustmentsRef: AngularFireList<StockAdjustment> = this.db.list<StockAdjustment>('stockadjustments');


  public getStockAdjustments(searchItem?: string): Observable<StockAdjustment[]> {
    return this.db.list('stockadjustments').snapshotChanges()
      .pipe(
        map((changes) => {
          return changes
            .map((c) => {
              const stockadjustment = ({ ...c.payload.toJSON(), key: c.payload.key } as StockAdjustment)
              return stockadjustment;
            })
        }),

      ).pipe(
        map(items =>
          searchItem ? items.filter(item => item.code.includes(searchItem as string)) : items
        )
      )

  }

  public getStockAdjustment(id: string) {
    return this.db.list('stockadjustments', (ref) => ref.orderByChild('code').equalTo(id)).snapshotChanges()
      .pipe(
        map((changes) => {
          return changes
            .map((c) => {
              const stockadjustment = ({ ...c.payload.toJSON(), key: c.payload.key, } as StockAdjustment)
              return stockadjustment;
            })
        }),

      );
  }

  public addStockAdjustment(stockadjustment: StockAdjustment) {
    return this.stockadjustmentsRef.push(stockadjustment);
  }

  public updateStockAdjustment(stockadjustment: StockAdjustment) {
    return this.stockadjustmentsRef.update(stockadjustment.key, { ...stockadjustment });
  }

  public deleteStockAdjustment(key: string) {
    return this.stockadjustmentsRef.remove(key);
  }
}
