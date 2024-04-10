import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Config, NgxPrintElementDirective, NgxPrintElementModule, NgxPrintElementService } from 'ngx-print-element';
import { Product } from '../../shared/interfaces/product.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-simple-view-stock',
  standalone: true,
  imports: [NgxPrintElementModule],
  templateUrl: './simple-view-stock.component.html',
  styleUrl: './simple-view-stock.component.scss'
})
export class SimpleViewStockComponent {
  @ViewChild('dialogModal') dialogModal: ElementRef | undefined;
  @ViewChild('table') table: ElementRef<HTMLTableElement> | undefined;
  products: any[] = [];
  print = inject(NgxPrintElementService);
  public config: Config = {
    printMode: 'template', // template-popup
    popupProperties: 'toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,fullscreen=yes',
    pageTitle: 'Restock Overview',
    // htmlType: 'text',
    templateString: '<header>I\'Restock Overview </header>{{printBody}}',
    stylesheets: [{ rel: 'stylesheet', href: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css' }],
    styles: [
      'header, footer{ text-align: center; }',
      'body .bg-success{ background-color: #4dcf83 !important; }',
      'body .bg-danger{ background-color: #f96868 !important; }',
    ]
  }


  public openModal(product: any) {
    this.products = [];
    Object.keys(product).forEach((d) => {
      this.products.push(product[d]);
    });
    this.dialogModal?.nativeElement.showModal()
  }


  public onCancel() {

    (this.dialogModal?.nativeElement as HTMLDialogElement).close()
  }

  public onPrint() {
    if (this.table) {

      const sub: Subscription = this.print.print(this.table, { ...this.config, printMode: 'template-popup' }).subscribe(() => sub.unsubscribe());
    }
  }
}
