import { Component, OnInit, inject } from '@angular/core';
import { AgChartsAngular } from 'ag-charts-angular';
import { AgChartOptions, AgChartTheme } from 'ag-charts-community';
import { OrderService } from '../../firebase/services/order.service';
import { CustomerService } from '../../firebase/services/customer.service';
import { ProductService } from '../../firebase/services/product.service';
import { CommonModule } from '@angular/common';
import { Order } from '../../shared/interfaces/order.interface';
import { Customer } from '../../shared/interfaces/customer.interface';
import { Product } from '../../shared/interfaces/product.interface';

var theme: AgChartTheme = {
  baseTheme: 'ag-sheets',
  palette: {
    fills: ['#5C2983', '#0076C5', '#21B372', '#FDDE02', '#F76700', '#D30018'],
    strokes: ['black'],
  },
  overrides: {
    common: {
      title: {
        fontSize: 24,
      },
    },
    bar: {
      series: {
        label: {
          enabled: true,
          color: 'black',
        },
      },
    },
  },
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AgChartsAngular, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  public lineOptions: AgChartOptions | undefined;
  public barOptions: AgChartOptions | undefined;

  public orderService = inject(OrderService);
  public customService = inject(CustomerService);
  public productService = inject(ProductService);
  public orders: Order[] = [];
  public reservedOrders: Order[] = [];
  public confirmedOrders: Order[] = [];
  public completedOrders: Order[] = [];
  public cancelledOrders: Order[] = [];
  public customers: Customer[] = [];
  public products: Product[] = [];
  public latestReservedOrder: Order | undefined = undefined;
  public latestConfirmedOrder: Order | undefined = undefined;
  public totalStockValue = 0;


  constructor() {
    this.getTopProducts();
    this.getTopCustomers();
    this.getRunningOutOfStock();
    this.getTopSalesForCurrentMonth();
    this.orderService.getAllOrders().subscribe(d => {
      this.orders = d;
      this.reservedOrders = this.orders.filter(order => order.status === 'Reserved');
      this.confirmedOrders = this.orders.filter(order => order.status === 'Confirmed');
      this.completedOrders = this.orders.filter(order => order.status === 'Completed');
      this.cancelledOrders = this.orders.filter(order => order.status === 'Cancelled');
      this.latestReservedOrder = this.reservedOrders[this.reservedOrders.length - 1];
      this.latestConfirmedOrder = this.confirmedOrders[this.confirmedOrders.length - 1];
    });
    this.customService.getCustomers().subscribe(d => {
      this.customers = d;
    });
    this.productService.getProducts().subscribe(d => {
      this.products = d;
      this.products.map(d => {
        this.totalStockValue = this.totalStockValue + (d.availableStocks * d.sellingPricePer100);
      })
      this.totalStockValue = parseFloat(this.totalStockValue.toFixed(2));
    })
  }



  public getTopProducts() {
    this.lineOptions = {
      theme,
      title: {
        text: "Top Products (Sales)",
      },
      data: [],
      series: [
        {
          type: "line",
          xKey: "quarter",
          yKey: "petrol",
          yName: "Petrol",
        },
        {
          type: "line",
          xKey: "quarter",
          yKey: "diesel",
          yName: "Diesel",
        },
      ],
    };
  }


  public getTopSalesForCurrentMonth() {

  }

  // 300 and below
  public getRunningOutOfStock() {
    this.barOptions = {
      // Data: Data to be displayed in the chart
      theme,
      data: [
        { month: 'Jan', avgTemp: 2.3, iceCreamSales: 162000 },
        { month: 'Mar', avgTemp: 6.3, iceCreamSales: 302000 },
        { month: 'May', avgTemp: 16.2, iceCreamSales: 800000 },
        { month: 'Jul', avgTemp: 22.8, iceCreamSales: 1254000 },
        { month: 'Sep', avgTemp: 14.5, iceCreamSales: 950000 },
        { month: 'Nov', avgTemp: 8.9, iceCreamSales: 200000 },
      ],
      // Series: Defines which chart type and data to use
      series: [{ type: 'bar', xKey: 'month', yKey: 'iceCreamSales' }]
    };
  }

  public getTopCustomers() {
    this.barOptions = {
      // Data: Data to be displayed in the chart
      theme,
      data: [
        { month: 'Jan', avgTemp: 2.3, iceCreamSales: 162000 },
        { month: 'Mar', avgTemp: 6.3, iceCreamSales: 302000 },
        { month: 'May', avgTemp: 16.2, iceCreamSales: 800000 },
        { month: 'Jul', avgTemp: 22.8, iceCreamSales: 1254000 },
        { month: 'Sep', avgTemp: 14.5, iceCreamSales: 950000 },
        { month: 'Nov', avgTemp: 8.9, iceCreamSales: 200000 },
      ],
      // Series: Defines which chart type and data to use
      series: [{ type: 'bar', xKey: 'month', yKey: 'iceCreamSales' }]
    };
  }

}
