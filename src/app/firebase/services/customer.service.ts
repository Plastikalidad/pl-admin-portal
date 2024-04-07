import { Injectable, inject } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable, filter, map } from 'rxjs';
import { Customer } from '../../shared/interfaces/customer.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  public db = inject(AngularFireDatabase);
  public CustomersRef: AngularFireList<Customer> = this.db.list<Customer>('customers');


  public getCustomers(searchItem?: string): Observable<Customer[]> {
    return this.db.list('customers').snapshotChanges()
      .pipe(
        map((changes) => {
          return changes
            .map((c) => {
              const customers = ({ ...c.payload.toJSON(), key: c.payload.key } as Customer)
              return customers;
            })
        }),

      ).pipe(
        map(items =>
          searchItem ? items.filter(item => item.code.includes(searchItem as string)) ||
            items.filter(item => item.firstName.includes(searchItem as string)) ||
            items.filter(item => item.lastName.includes(searchItem as string)) ||
            items.filter(item => item.address.includes(searchItem as string)) : items
        )
      )

  }

  public getCustomer(id: string) {
    return this.db.list('customers', (ref) => ref.orderByChild('code').equalTo(id)).snapshotChanges()
      .pipe(
        map((changes) => {
          return changes
            .map((c) => {
              const Customer = ({ key: c.payload.key, ...c.payload.toJSON() } as Customer)
              return Customer;
            })
        }),

      );
  }

  public addCustomer(customer: Customer) {
    return this.CustomersRef.push(customer);
  }

  public updateCustomer(customer: Customer) {
    return this.CustomersRef.update(customer.key, { ...customer });
  }

  public deleteCustomer(key: string) {
    return this.CustomersRef.remove(key);
  }
}
