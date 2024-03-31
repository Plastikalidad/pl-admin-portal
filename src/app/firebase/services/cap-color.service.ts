import { Injectable, inject } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable, filter, map } from 'rxjs';
import { CapColor } from '../../shared/interfaces/cap-color.interface';


@Injectable({
  providedIn: 'root'
})
export class CapColorService {
  public db = inject(AngularFireDatabase);
  public CapColorsRef: AngularFireList<CapColor> = this.db.list<CapColor>('capcolors');


  public getCapColors(searchItem?: string): Observable<CapColor[]> {
    return this.db.list('capcolors').snapshotChanges()
      .pipe(
        map((changes) => {
          return changes
            .map((c) => {
              const capcolor = ({ ...c.payload.toJSON(), key: c.payload.key } as CapColor)
              return capcolor;
            })
        }),

      ).pipe(
        map(items =>
          searchItem ? items.filter(item => item.code.includes(searchItem as string)) : items
        )
      )

  }

  public getCapColor(id: string) {
    return this.db.list('capcolors', (ref) => ref.orderByChild('code').equalTo(id)).snapshotChanges()
      .pipe(
        map((changes) => {
          return changes
            .map((c) => {
              const capcolor = ({ key: c.payload.key, ...c.payload.toJSON() } as CapColor)
              return capcolor;
            })
        }),

      );
  }

  public addCapColor(capcolor: CapColor) {
    return this.CapColorsRef.push(capcolor);
  }

  public updateCapColor(capcolor: CapColor) {
    return this.CapColorsRef.update(capcolor.key, { ...capcolor });
  }

  public deleteCapColor(key: string) {
    return this.CapColorsRef.remove(key);
  }
}
