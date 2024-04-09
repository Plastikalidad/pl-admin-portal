import { Component, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../firebase/services/product.service';
import { Restock } from '../../../shared/interfaces/restock.interface';
import { GeneralService } from '../../../states/general.service';
import { StockAdjustmentService } from '../../../firebase/services/stock-adjustment.service';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { CommonModule } from '@angular/common';
import { ActionMenuComponent } from '../../../shared/components/action-menu/action-menu.component';
import { TableComponent } from '../../../shared/components/table/table.component';
import { StockAdjustment } from '../../../shared/interfaces/stock-adjustment.interface';

@Component({
  selector: 'app-stock-adjustment-overview',
  standalone: true,
  imports: [CommonModule, TableComponent, ActionMenuComponent, SearchComponent],
  templateUrl: './stock-adjustment-overview.component.html',
  styleUrl: './stock-adjustment-overview.component.scss'
})
export class StockAdjustmentOverviewComponent {
  public stockAdjustmentService = inject(StockAdjustmentService);
  public router = inject(Router);
  public generalService = inject(GeneralService);
  public productService = inject(ProductService)
  items$ = this.stockAdjustmentService.getStockAdjustments();
  keys: Array<keyof Restock> = ['date', 'code', 'notes'];
  columns = ['Date', 'code', 'Notes'];
  actions = [];
  tableActions = ['View'];
  confirmedRestock: Restock | null = null;




  public filterAdjustment(searchItem: string) {
    this.items$ = this.stockAdjustmentService.getStockAdjustments(searchItem);
  }


  public executeTableAction(data: { action: string, item: unknown }) {
    switch (data.action) {
      case "View": {
        this.router.navigate(['stock-adjustments-history', (data.item as StockAdjustment).code]);
        return;
      }

    }
  }
}
