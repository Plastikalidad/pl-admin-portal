import { Injectable, inject } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable, filter, map } from 'rxjs';
import { Size } from '../../shared/interfaces/size.interface';

@Injectable({
  providedIn: 'root'
})
export class SizeService {
  public db = inject(AngularFireDatabase);
  public SizesRef: AngularFireList<Size> = this.db.list<Size>('sizes');


  public getSizes(searchItem?: string): Observable<Size[]> {
    return this.db.list('sizes').snapshotChanges()
      .pipe(
        map((changes) => {
          return changes
            .map((c) => {
              const sizes = ({ ...c.payload.toJSON(), key: c.payload.key } as Size)
              return sizes;
            })
        }),

      ).pipe(
        map(items =>
          searchItem ? items.filter(item => item.code.toLocaleLowerCase().includes(searchItem as string)) : items
        )
      )

  }

  public getSize(id: string) {
    return this.db.list('sizes', (ref) => ref.orderByChild('code').equalTo(id)).snapshotChanges()
      .pipe(
        map((changes) => {
          return changes
            .map((c) => {
              const Size = ({ key: c.payload.key, ...c.payload.toJSON() } as Size)
              return Size;
            })
        }),

      );
  }

  public addSize(size: Size) {
    return this.SizesRef.push(size);
  }

  public updateSize(size: Size) {
    return this.SizesRef.update(size.key, { ...size });
  }

  public deleteSize(key: string) {
    return this.SizesRef.remove(key);
  }
}
