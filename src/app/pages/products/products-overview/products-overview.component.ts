import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { TableComponent } from '../../../shared/components/table/table.component';
import { ActionMenuComponent } from '../../../shared/components/action-menu/action-menu.component';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { AddProductComponent } from '../../../modals/add-product/add-product.component';
import { ProductService } from '../../../firebase/services/product.service';
import { CommonModule } from '@angular/common';
import { Product } from '../../../shared/interfaces/product.interface';
import { filter, map } from 'rxjs';
import { Router } from '@angular/router';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { GeneralService } from '../../../states/general.service';

@Component({
  selector: 'app-products-overview',
  standalone: true,
  imports: [CommonModule, TableComponent, ActionMenuComponent, SearchComponent, AddProductComponent, ConfirmModalComponent],
  templateUrl: './products-overview.component.html',
  styleUrl: './products-overview.component.scss'
})
export class ProductsOverviewComponent {
  @ViewChild('addProduct') addProduct: AddProductComponent | undefined;
  @ViewChild('confirmDeleteModal') confirmDeleteModal: ConfirmModalComponent | undefined;
  @ViewChild('confirmDeleteAllModal') confirmDeleteAllModal: ConfirmModalComponent | undefined;
  public productService = inject(ProductService);
  public router = inject(Router);
  public productsToDelete: Product[] = [];
  public generalService = inject(GeneralService)
  items$ = this.productService.getProducts();
  keys: Array<keyof Product> = ['code', 'design', 'size', 'capColors'];
  columns = ['Code', 'Design', 'Size', 'Cap Color'];
  actions = ['Add', 'Delete'];
  tableActions = ['Update', 'Delete'];


  public executeAction(action: string) {
    switch (action) {
      case "Add": {
        this.addProduct?.openModal();
        return;
      }
      case "Delete": {
        if (this.productsToDelete.length) {
          this.confirmDeleteAllModal?.openModal({ title: 'Delete selected products', message: 'Are you sure you want to delete the selected products?' });
          return;
        }
        this.generalService.toast.set({ show: true, message: 'No products selected', type: 'alert-error' });
        return;
      }
    }
  }

  public executeTableAction(data: { action: string, item: unknown }) {
    switch (data.action) {
      case "Update": {
        this.router.navigate(['manage-inventory', (data.item as Product).code]);
        return;
      }

      case "Delete": {
        this.productsToDelete.push(data.item as Product)
        this.confirmDeleteModal?.openModal({ title: 'Delete Product', message: `Are you sure you want to delete Product ${(data.item as Product).code}` });
        return;
      }

    }
  }

  public async deleteProduct() {
    try {
      await this.productService.deleteProduct(this.productsToDelete[0]?.key);
      this.confirmDeleteModal?.closeModal();
      this.productsToDelete = [];
      this.generalService.toast.set({ show: true, message: 'Product deleted sucessfully', type: 'alert-success' });
    } catch (e) {

    }
  }

  public async deleteAllProduct() {
    try {
      for (let product of this.productsToDelete) {
        await this.productService.deleteProduct(product.key);
        this.confirmDeleteAllModal?.closeModal();
        this.productsToDelete = [];
        this.generalService.toast.set({ show: true, message: 'Products deleted sucessfully', type: 'alert-success' });
      }
    } catch (e) {

    }
  }

  public clearProductsToDelete() {
    this.productsToDelete = [];
  }

  public filterProducts(searchItem: string) {
    this.items$ = this.productService.getProducts(searchItem);
  }

  public onCheck(item: { value: boolean, data: unknown }) {
    if (Array.isArray(item.data)) {
      this.productsToDelete = item.value ? item.data : []
    }
    else {
      if (item.value) {
        this.productsToDelete.push(item.data as Product)
      }
      else {
        this.productsToDelete = this.productsToDelete.filter(product => product.key !== (item.data as Product).key);
      }
    }
  }
}
