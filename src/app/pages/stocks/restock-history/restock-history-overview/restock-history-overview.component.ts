import { CommonModule } from "@angular/common";
import { Component, ViewChild, inject } from "@angular/core";
import { Router } from "@angular/router";
import { ActionMenuComponent } from "../../../../shared/components/action-menu/action-menu.component";
import { ConfirmModalComponent } from "../../../../shared/components/confirm-modal/confirm-modal.component";
import { SearchComponent } from "../../../../shared/components/search/search.component";
import { TableComponent } from "../../../../shared/components/table/table.component";
import { Product } from "../../../../shared/interfaces/product.interface";
import { GeneralService } from "../../../../states/general.service";
import { Restock } from "../../../../shared/interfaces/restock.interface";
import { RestockService } from "../../../../firebase/services/restock.service";
import { ProductService } from "../../../../firebase/services/product.service";
import { Observable, catchError, forkJoin, map, take, tap } from "rxjs";

@Component({
  selector: 'app-restock-history-overview',
  standalone: true,
  imports: [CommonModule, TableComponent, ActionMenuComponent, SearchComponent, ConfirmModalComponent],
  templateUrl: './restock-history-overview.component.html',
  styleUrl: './restock-history-overview.component.scss'
})
export class RestockHistoryOverviewComponent {
  @ViewChild('confirmModal') confirmModal: ConfirmModalComponent | undefined;
  public restockService = inject(RestockService);
  public router = inject(Router);
  public generalService = inject(GeneralService);
  public productService = inject(ProductService)
  items$ = this.restockService.getRestocks();
  keys: Array<keyof Restock> = ['date', 'code', 'totalPrice', 'status', 'notes'];
  columns = ['Date', 'code', 'totalPrice', 'Status', 'Notes'];
  actions = [];
  tableActions = ['Update', 'Confirm'];
  confirmedRestock: Restock | null = null;


  public executeTableAction(data: { action: string, item: unknown }) {
    switch (data.action) {
      case "Update": {
        this.router.navigate(['restock-history', (data.item as Restock).code]);
        return;
      }

      case "Confirm": {
        if ((data.item as Restock).status === 'Confirmed') {
          this.generalService.toast.set({ show: true, message: 'Restock is already confirmed', type: 'alert-error' });
          return;
        }
        this.confirmedRestock = data.item as Restock;
        this.confirmModal?.openModal({ title: 'Confirm', message: `Confirming restock will add to the products, Are you sure you want to continue?` });
        return;
      }

    }
  }

  public async confirmRestock() {
    try {
      if (this.confirmedRestock) {
        const stock: Restock = { ...this.confirmedRestock, status: 'Confirmed' };
        await this.restockService.updateRestock(stock);
        this.addStocksToProducts();
      }
    } catch (e) {

    }
  }

  public async addStocksToProducts() {
    const stockSubscription: Observable<any>[] = [];
    try {
      if (this.confirmedRestock) {
        Object.keys(this.confirmedRestock.products).forEach((key: string) => {
          const product = this.confirmedRestock?.products[parseInt(key)];
          if (product) {
            stockSubscription.push(this.productService.getProduct(product.code).pipe(
              take(1),
              tap(async (data) => {
                const newStock = parseInt(data[0].availableStocks.toString()) + parseInt(product.addStock.toString());
                await this.productService.updateProduct({ ...data[0], availableStocks: newStock })
                return data;
              })))
          }
        })

        const subscription = forkJoin(stockSubscription).subscribe({
          next: (d) => {
            this.generalService.toast.set({ show: true, message: 'Restock confirmed successfully', type: 'alert-success' });
            this.confirmModal?.closeModal();
            subscription.unsubscribe();
          },
          error: (e) => {
            subscription.unsubscribe();
          },
        })
      }
    }
    catch (e) {
      console.log(e)
    }
  }

  public filterRestock(searchItem: string) {
    this.items$ = this.restockService.getRestocks(searchItem);
  }
}
