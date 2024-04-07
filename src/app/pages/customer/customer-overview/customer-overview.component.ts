import { Component, ViewChild, inject } from '@angular/core';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { CustomerService } from '../../../firebase/services/customer.service';
import { Router } from '@angular/router';
import { Customer } from '../../../shared/interfaces/customer.interface';
import { GeneralService } from '../../../states/general.service';
import { AddCustomerComponent } from '../../../modals/add-customer/add-customer.component';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../../shared/components/table/table.component';
import { ActionMenuComponent } from '../../../shared/components/action-menu/action-menu.component';
import { SearchComponent } from '../../../shared/components/search/search.component';

@Component({
  selector: 'app-customer-overview',
  standalone: true,
  imports: [CommonModule, TableComponent, ActionMenuComponent, SearchComponent, AddCustomerComponent, ConfirmModalComponent],
  templateUrl: './customer-overview.component.html',
  styleUrl: './customer-overview.component.scss'
})
export class CustomerOverviewComponent {
  @ViewChild('addCustomer') addCustomer: AddCustomerComponent | undefined;
  @ViewChild('confirmDeleteModal') confirmDeleteModal: ConfirmModalComponent | undefined;
  @ViewChild('confirmDeleteAllModal') confirmDeleteAllModal: ConfirmModalComponent | undefined;
  public customerService = inject(CustomerService);
  public router = inject(Router);
  public customersToDelete: Customer[] = [];
  public generalService = inject(GeneralService)
  items$ = this.customerService.getCustomers();
  keys: Array<keyof Customer> = ['code', 'firstName', 'lastName', 'contactNumber'];
  columns = ['Code', 'First Name', 'Last Name', 'Contact Number'];
  actions = ['Add', 'Delete'];
  tableActions = ['Update', 'Delete'];


  public executeAction(action: string) {
    switch (action) {
      case "Add": {
        this.addCustomer?.openModal();
        return;
      }
      case "Delete": {
        if (this.customersToDelete.length) {
          this.confirmDeleteAllModal?.openModal({ title: 'Delete selected customers', message: 'Are you sure you want to delete the selected customers?' });
          return;
        }
        this.generalService.toast.set({ show: true, message: 'No customers selected', type: 'alert-error' });
        return;
      }
    }
  }

  public executeTableAction(data: { action: string, item: unknown }) {
    switch (data.action) {
      case "Update": {
        this.router.navigate(['customer-directory', (data.item as Customer).code]);
        return;
      }

      case "Delete": {
        this.customersToDelete.push(data.item as Customer)
        this.confirmDeleteModal?.openModal({ title: 'Delete Customer', message: `Are you sure you want to delete Customer ${(data.item as Customer).code}` });
        return;
      }

    }
  }

  public async deleteCustomer() {
    try {
      await this.customerService.deleteCustomer(this.customersToDelete[0]?.key);
      this.confirmDeleteModal?.closeModal();
      this.customersToDelete = [];
      this.generalService.toast.set({ show: true, message: 'Customer deleted sucessfully', type: 'alert-success' });
    } catch (e) {

    }
  }

  public async deleteAllCustomer() {
    try {
      for (let customer of this.customersToDelete) {
        await this.customerService.deleteCustomer(customer.key);
        this.confirmDeleteAllModal?.closeModal();
        this.customersToDelete = [];
        this.generalService.toast.set({ show: true, message: 'Customers deleted sucessfully', type: 'alert-success' });
      }
    } catch (e) {

    }
  }

  public clearCustomersToDelete() {
    this.customersToDelete = [];
  }

  public filterCustomers(searchItem: string) {
    this.items$ = this.customerService.getCustomers(searchItem);
  }

  public onCheck(item: { value: boolean, data: unknown }) {
    if (Array.isArray(item.data)) {
      this.customersToDelete = item.value ? item.data : []
    }
    else {
      if (item.value) {
        this.customersToDelete.push(item.data as Customer)
      }
      else {
        this.customersToDelete = this.customersToDelete.filter(customer => customer.key !== (item.data as Customer).key);
      }
    }
  }
}
