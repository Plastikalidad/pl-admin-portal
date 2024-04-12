import { Injectable, inject } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable, map } from 'rxjs';
import { Order } from '../../shared/interfaces/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  public db = inject(AngularFireDatabase);
  public OrdersRef: AngularFireList<Order> = this.db.list<Order>('orders');

  public getAllOrders(): Observable<Order[]> {
    return this.db.list('orders').snapshotChanges()
      .pipe(
        map((changes) => {
          return changes
            .map((c) => {
              const orders = ({ ...c.payload.toJSON(), key: c.payload.key } as Order)
              return orders;
            })
        }),

      )
  }



  public getOrders(searchItem?: string, status: 'Reserved' | 'Completed' | 'Packed' | 'Not Packed' | 'Cancelled' = 'Reserved'): Observable<Order[]> {
    return this.db.list('orders').snapshotChanges()
      .pipe(
        map((changes) => {
          return changes
            .map((c) => {
              const orders = ({ ...c.payload.toJSON(), key: c.payload.key } as Order)
              return orders;
            })
        }),

      ).pipe(
        map(items =>
          searchItem ? ((items.filter(item => item.code.includes(searchItem as string) && item.status === status) ||
            items.filter(item => item.customer.firstName.includes(searchItem as string) && item.status === status) ||
            items.filter(item => item.customer.lastName.includes(searchItem as string) && item.status === status) ||
            items.filter(item => item.code.includes(searchItem as string) && item.status === status))) : items.filter(item => item.status === status)
        )
      )

  }

  public getOrdersByCustomer(code: string, status: 'Reserved' | 'Completed' | 'Packed' | 'Not Packed' | 'Cancelled' = 'Completed'): Observable<Order[]> {
    return this.db.list('orders').snapshotChanges()
      .pipe(
        map((changes) => {
          return changes
            .map((c) => {
              const orders = ({ ...c.payload.toJSON(), key: c.payload.key } as Order)
              return orders;
            })
        }),

      ).pipe(
        map(items =>
          code ? items.filter(item => item.customer.code === code && item.status === status) : items
        )
      )

  }

  public getOrdersByProduct(code: string, status: 'Reserved' | 'Completed' | 'Packed' | 'Not Packed' | 'Cancelled' = 'Completed'): Observable<Order[]> {

    return this.db.list('orders').snapshotChanges()
      .pipe(
        map((changes) => {
          return changes
            .map((c) => {
              const orders = ({ ...c.payload.toJSON(), key: c.payload.key } as Order)
              return orders;
            })
        }),

      ).pipe(
        map(items => {

          return items.filter(item => {
            const prod: any[] = [];
            Object.keys(item.products).forEach((d: any) => {
              prod.push(item.products[d]);
            })
            return prod.find(product => product.code === code) && item.status === status
          })
        }
        )
      )

  }

  public getOrdersByStatus(searchItem: string | Array<string>): Observable<Order[]> {
    if (typeof searchItem === 'string') {
      return this.db.list('orders').snapshotChanges()
        .pipe(
          map((changes) => {
            return changes
              .map((c) => {
                const orders = ({ ...c.payload.toJSON(), key: c.payload.key } as Order)
                return orders;
              })
          }),

        ).pipe(
          map(items =>
            items.filter(item => item.status === searchItem))
        )
    }

    return this.db.list('orders').snapshotChanges()
      .pipe(
        map((changes) => {
          return changes
            .map((c) => {
              const orders = ({ ...c.payload.toJSON(), key: c.payload.key } as Order)
              return orders;
            })
        }),

      ).pipe(
        map(items =>
          items.filter(item => searchItem.includes(item.status)))
      )
  }

  public getOrder(id: string) {
    return this.db.list('orders', (ref) => ref.orderByChild('code').equalTo(id)).snapshotChanges()
      .pipe(
        map((changes) => {
          return changes
            .map((c) => {
              const Order = ({ key: c.payload.key, ...c.payload.toJSON() } as Order)
              return Order;
            })
        }),

      );
  }

  public addOrder(customer: Order) {
    return this.OrdersRef.push(customer);
  }

  public updateOrder(customer: Order) {
    return this.OrdersRef.update(customer.key, { ...customer });
  }

  public deleteOrder(key: string) {
    return this.OrdersRef.remove(key);
  }
}
