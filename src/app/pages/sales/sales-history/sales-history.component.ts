import { Component, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { OrderService } from '../../../firebase/services/order.service';
import { ProductService } from '../../../firebase/services/product.service';
import { AddOrderComponent } from '../../../modals/add-order/add-order.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { Order } from '../../../shared/interfaces/order.interface';
import { GeneralService } from '../../../states/general.service';
import { CommonModule } from '@angular/common';
import { ActionMenuComponent } from '../../../shared/components/action-menu/action-menu.component';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { TableComponent } from '../../../shared/components/table/table.component';

@Component({
  selector: 'app-sales-history',
  standalone: true,
  imports: [CommonModule, TableComponent, ActionMenuComponent, SearchComponent, AddOrderComponent, ConfirmModalComponent],
  templateUrl: './sales-history.component.html',
  styleUrl: './sales-history.component.scss'
})
export class SalesHistoryComponent {
  @ViewChild('addOrder') addOrder: AddOrderComponent | undefined;
  @ViewChild('confirmUpdateStatusModal') confirmUpdateStatusModal: ConfirmModalComponent | undefined;
  public productService = inject(ProductService);
  public orderService = inject(OrderService);
  public router = inject(Router);
  public generalService = inject(GeneralService);
  items$ = of<Order[]>([]);
  keys: Array<keyof Order> = ['code', 'date', 'status', 'totalPrice'];
  columns = ['Code', 'Date', 'status', 'Total Price'];
  actions: string[] = [];
  tableActions = [''];
  url: string = '';
  toUpdate: { item: Order | undefined, status: 'Reserved' | 'Not Packed' | 'Packed' | 'Cancelled' | 'Completed' } = { item: undefined, status: 'Reserved' }

  products = this.productService.getProducts();

  public ngOnInit(): void {
    this.items$ = this.orderService.getOrdersByStatus('Completed');
    this.url = 'sales-history';
    this.tableActions = ['View'];
    this.actions = []

  }


  public executeAction(action: string) {
    switch (action) {
      case "Add": {
        this.addOrder?.openModal();
        return;
      }
    }
  }

  public executeTableAction(data: { action: string, item: unknown }) {
    switch (data.action) {

      case "View": {
        this.router.navigate([this.url, (data.item as Order).code]);
        return;
      }

    }
  }


  public filterOrders(searchItem: string) {
    this.items$ = this.orderService.getOrders(searchItem);
  }



  public filterByProduct(product: Event) {
    const productCode = (product.target as HTMLOptionElement).value;
    if (productCode) {
      this.items$ = this.orderService.getOrdersByProduct(productCode);
      return;
    }
    this.items$ = this.orderService.getOrders();

  }
}
