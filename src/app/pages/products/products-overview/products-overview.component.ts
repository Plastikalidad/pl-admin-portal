import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { TableComponent } from '../../../shared/components/table/table.component';
import { ActionMenuComponent } from '../../../shared/components/action-menu/action-menu.component';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { AddProductComponent } from '../../../modals/add-product/add-product.component';
import { ProductService } from '../../../firebase/services/product.service';
import { CommonModule } from '@angular/common';
import { Product } from '../../../shared/interfaces/product.interface';

@Component({
  selector: 'app-products-overview',
  standalone: true,
  imports: [CommonModule, TableComponent, ActionMenuComponent, SearchComponent, AddProductComponent],
  templateUrl: './products-overview.component.html',
  styleUrl: './products-overview.component.scss'
})
export class ProductsOverviewComponent {
  @ViewChild('addProduct') addProduct: AddProductComponent | undefined;
  public productService = inject(ProductService);
  items$ = this.productService.getProducts().valueChanges()
  keys: Array<keyof Product> = ['code', 'design', 'size', 'capColors'];
  columns = ['Code', 'Design', 'Size', 'Cap Color'];
  actions = ['Add', 'Delete'];
  tableActions = ['Update', 'Delete']


  public executeAction(action: string) {
    switch (action) {
      case "Add": {
        this.addProduct?.openModal();
        return;
      }
      case "Delete": {

        return;
      }
    }
  }
}
