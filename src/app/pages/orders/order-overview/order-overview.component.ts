import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { TableComponent } from '../../../shared/components/table/table.component';
import { ActionMenuComponent } from '../../../shared/components/action-menu/action-menu.component';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { OrderService } from '../../../firebase/services/order.service';
import { CommonModule } from '@angular/common';
import { Order } from '../../../shared/interfaces/order.interface';
import { Router } from '@angular/router';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { GeneralService } from '../../../states/general.service';
import { AddOrderComponent } from '../../../modals/add-order/add-order.component';
import { Observable, forkJoin, map, of, take, tap } from 'rxjs';
import { ProductService } from '../../../firebase/services/product.service';

@Component({
  selector: 'app-order-overview',
  standalone: true,
  imports: [CommonModule, TableComponent, ActionMenuComponent, SearchComponent, AddOrderComponent, ConfirmModalComponent],
  templateUrl: './order-overview.component.html',
  styleUrl: './order-overview.component.scss'
})
export class OrderOverviewComponent implements OnInit {
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
  reservedOrders: number = 0;
  notPackedOrders: number = 0;
  packedOrders: number = 0;
  completedOrders: number = 0;
  cancelledOrders: number = 0;
  toUpdate: { item: Order | undefined, status: 'Reserved' | 'Packed' | 'Not Packed' | 'Cancelled' | 'Completed' } = { item: undefined, status: 'Reserved' }

  public ngOnInit(): void {
    if (this.router.url.includes('reserved')) {
      this.items$ = this.orderService.getOrdersByStatus('Reserved')
      this.url = 'reserved-orders';
      this.tableActions = ['Update', 'Confirm Order', 'Cancel Order'];
      this.actions = ['Add']
    }
    else if (this.router.url.includes('completed')) {
      this.items$ = this.orderService.getOrdersByStatus('Completed')
      this.url = 'completed-orders';
      this.tableActions = ['View'];
      this.actions = []
    }
    else if (this.router.url.includes('queue')) {
      this.items$ = this.orderService.getOrdersByStatus(['Not Packed', 'Packed'])
      this.url = 'order-queue';
      this.tableActions = ['Reserve Order Again', 'Pack Order', 'Cancel Order', 'Complete Order'];
      this.actions = []
    }
    else if (this.router.url.includes('cancelled')) {
      this.items$ = this.orderService.getOrdersByStatus('Cancelled')
      this.url = 'cancelled-orders';
      this.tableActions = ['View'];
      this.actions = []
    }
    this.getStats();
  }

  public getStats() {
    this.orderService.getAllOrders().subscribe(orders => {
      this.completedOrders = orders.filter(order => order.status === 'Completed').length;
      this.packedOrders = orders.filter(order => order.status === 'Packed').length;
      this.notPackedOrders = orders.filter(order => order.status === 'Not Packed').length;
      this.cancelledOrders = orders.filter(order => order.status === 'Cancelled').length;
    });
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
      case "Update": {
        this.router.navigate([this.url, (data.item as Order).code]);
        return;
      }
      case "View": {
        this.router.navigate([this.url, (data.item as Order).code]);
        return;
      }

      case "Reserve Order Again": {
        this.toUpdate = { item: data.item as Order, status: 'Reserved' }
        this.confirmUpdateStatusModal?.openModal({ title: 'Reserve Order', message: 'Are you sure you want to reserve the order?' })
        return;
      }

      case "Pack Order": {
        this.toUpdate = { item: data.item as Order, status: 'Packed' }
        this.confirmUpdateStatusModal?.openModal({ title: 'Pack Order', message: 'Are you sure you want to change status of order to Packed?' })
        return;
      }

      case "Confirm Order": {
        this.toUpdate = { item: data.item as Order, status: 'Not Packed' }
        this.confirmUpdateStatusModal?.openModal({ title: 'Confirm Order', message: 'Are you sure you want to confirm the order?' })
        return;
      }
      case "Complete Order": {
        this.toUpdate = { item: data.item as Order, status: 'Completed' }
        this.confirmUpdateStatusModal?.openModal({ title: 'Complete Order', message: 'Are you sure you want to complete the order?' })
        return;
      }

      case "Cancel Order": {
        this.toUpdate = { item: data.item as Order, status: 'Cancelled' }
        this.confirmUpdateStatusModal?.openModal({ title: 'Cancel Order', message: 'Are you sure you want to cancel the order?' })
        return;
      }

    }
  }

  public async updateStatus() {
    const order = this.toUpdate?.item
    const orderSubscription: Observable<any>[] = [];
    try {
      if (order) {
        if ((this.toUpdate.status === 'Cancelled' && (order.status === 'Not Packed' || order.status === 'Reserved' || order.status === 'Packed'))) {
          Object.keys(order.products).forEach((key: string) => {
            const product = order.products[parseInt(key)];
            if (product) {
              orderSubscription.push(this.productService.getProduct(product.code).pipe(
                take(1),
                tap(async (data) => {
                  const newStock = parseInt(data[0].availableStocks.toString()) + parseInt(product.quantity.toString());
                  await this.productService.updateProduct({ ...data[0], availableStocks: newStock })
                  return data;
                })))
            }
          })
        }
        const subscription = forkJoin(orderSubscription).subscribe({
          next: (d) => {
            subscription.unsubscribe();
          },
          error: (e) => {
            subscription.unsubscribe();
          },
        })

        order.status = this.toUpdate.status;
        await this.orderService.updateOrder(order);
        this.confirmUpdateStatusModal?.closeModal();
        this.generalService.toast.set({ show: true, message: 'Order successfully updated', type: 'alert-success' });
      }
    } catch (e) {
      console.log(e)
    }
  }


  public filterOrders(searchItem: string) {
    let status: 'Not Packed' | 'Packed' | 'Reserved' | 'Completed' | 'Cancelled' = 'Reserved';
    if (this.router.url.includes('reserved')) {
      status = 'Reserved';
    }
    else if (this.router.url.includes('completed')) {
      status = 'Completed';
    }
    else if (this.router.url.includes('queue')) {
      status = 'Not Packed';
    }

    else if (this.router.url.includes('cancelled')) {
      status = 'Cancelled';
    }
    this.items$ = this.orderService.getOrders(searchItem, status);
  }


}
