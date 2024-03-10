import { Component, OnInit } from '@angular/core';
import { AgChartsAngular } from 'ag-charts-angular';
import { AgChartOptions, AgChartTheme } from 'ag-charts-community';

var theme: AgChartTheme = {
  baseTheme: 'ag-default-dark',
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
  imports: [AgChartsAngular],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  public lineOptions: AgChartOptions | undefined;
  public barOptions: AgChartOptions | undefined;

  constructor() {
    this.getLine();
    this.getBar();
  }

  public getLine() {
    this.lineOptions = {
      theme,
      title: {
        text: "Annual Fuel Expenditure",
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

  public getBar() {
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
