import { Injectable, inject } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable, filter, map } from 'rxjs';
import { Restock } from '../../shared/interfaces/restock.interface';

@Injectable({
  providedIn: 'root'
})
export class RestockService {
  public db = inject(AngularFireDatabase);
  public restocksRef: AngularFireList<Restock> = this.db.list<Restock>('restocks');


  public getRestocks(searchItem?: string): Observable<Restock[]> {
    return this.db.list('restocks').snapshotChanges()
      .pipe(
        map((changes) => {
          return changes
            .map((c) => {
              const restock = ({ ...c.payload.toJSON(), key: c.payload.key } as Restock)
              return restock;
            })
        }),

      ).pipe(
        map(items =>
          searchItem ? items.filter(item => item.code.toLocaleLowerCase().includes(searchItem as string)) : items
        )
      )

  }

  public getRestock(id: string) {
    return this.db.list('restocks', (ref) => ref.orderByChild('code').equalTo(id)).snapshotChanges()
      .pipe(
        map((changes) => {
          return changes
            .map((c) => {
              const restock = ({ ...c.payload.toJSON(), key: c.payload.key, } as Restock)
              return restock;
            })
        }),

      );
  }

  public addRestock(restock: Restock) {
    return this.restocksRef.push(restock);
  }

  public updateRestock(restock: Restock) {
    return this.restocksRef.update(restock.key, { ...restock });
  }

  public deleteRestock(key: string) {
    return this.restocksRef.remove(key);
  }
}
