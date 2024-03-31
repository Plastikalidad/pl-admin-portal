import { Component, ViewChild, inject } from '@angular/core';
import { DiscountService } from '../../../firebase/services/discount.service';
import { Discount } from '../../../shared/interfaces/discount.interface';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { GeneralService } from '../../../states/general.service';
import { Router } from '@angular/router';
import { AddDiscountComponent } from '../../../modals/add-discount/add-discount.component';
import { CommonModule } from '@angular/common';
import { ActionMenuComponent } from '../../../shared/components/action-menu/action-menu.component';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { TableComponent } from '../../../shared/components/table/table.component';

@Component({
  selector: 'app-discount-overview',
  standalone: true,
  imports: [CommonModule, TableComponent, ActionMenuComponent, SearchComponent, AddDiscountComponent, ConfirmModalComponent],
  templateUrl: './discount-overview.component.html',
  styleUrl: './discount-overview.component.scss'
})
export class DiscountOverviewComponent {
  @ViewChild('addDiscount') addDiscount: AddDiscountComponent | undefined;
  @ViewChild('confirmDeleteModal') confirmDeleteModal: ConfirmModalComponent | undefined;
  @ViewChild('confirmDeleteAllModal') confirmDeleteAllModal: ConfirmModalComponent | undefined;
  discountService = inject(DiscountService);
  public generalService = inject(GeneralService);
  public discountsToDelete: Discount[] = [];
  public router = inject(Router);
  items$ = this.discountService.getDiscounts();
  keys: Array<keyof Discount> = ['code', 'fromPrice', 'toPrice', 'discountOne', 'discountTwo', 'discountThree', 'discountFour'];
  columns = ['Code', 'Price from', 'Price to', 'Discount 1', 'Discount 2', 'Discount 3', 'Discount 4'];
  actions = ['Add', 'Delete'];
  tableActions = ['Update', 'Delete'];


  public executeAction(action: string) {
    switch (action) {
      case "Add": {
        this.addDiscount?.openModal();
        return;
      }
      case "Delete": {
        if (this.discountsToDelete.length) {
          this.confirmDeleteAllModal?.openModal({ title: 'Delete selected discounts', message: 'Are you sure you want to delete the selected discounts?' });
          return;
        }
        this.generalService.toast.set({ show: true, message: 'No discounts selected', type: 'alert-error' });
        return;
      }
    }
  }

  public executeTableAction(data: { action: string, item: unknown }) {
    switch (data.action) {
      case "Update": {
        this.addDiscount?.openModal(true, data.item as Discount);
        return;
      }

      case "Delete": {
        this.discountsToDelete.push(data.item as Discount)
        this.confirmDeleteModal?.openModal({ title: 'Delete Discount', message: `Are you sure you want to delete Discount ${(data.item as Discount).code}` });
        return;
      }

    }
  }

  public async deleteDiscount() {
    try {
      await this.discountService.deleteDiscount(this.discountsToDelete[0]?.key);
      this.confirmDeleteModal?.closeModal();
      this.discountsToDelete = [];
      this.generalService.toast.set({ show: true, message: 'Discount deleted sucessfully', type: 'alert-success' });
    } catch (e) {

    }
  }

  public async deleteAllDiscounts() {
    try {
      for (let product of this.discountsToDelete) {
        await this.discountService.deleteDiscount(product.key);
        this.confirmDeleteAllModal?.closeModal();
        this.discountsToDelete = [];
        this.generalService.toast.set({ show: true, message: 'Products deleted sucessfully', type: 'alert-success' });
      }
    } catch (e) {

    }
  }

  public cleardiscountsToDelete() {
    this.discountsToDelete = [];
  }

  public filterDiscounts(searchItem: string) {
    this.items$ = this.discountService.getDiscounts(searchItem);
  }

  public onCheck(item: { value: boolean, data: unknown }) {
    if (Array.isArray(item.data)) {
      this.discountsToDelete = item.value ? item.data : []
    }
    else {
      if (item.value) {
        this.discountsToDelete.push(item.data as Discount)
      }
      else {
        this.discountsToDelete = this.discountsToDelete.filter(product => product.key !== (item.data as Discount).key);
      }
    }
  }
}
