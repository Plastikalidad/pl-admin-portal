import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(c => c.DashboardComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(c => c.ProfileComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.component').then(c => c.SettingsComponent)
  },
  {
    path: 'manage-inventory',
    loadComponent: () => import('./pages/products/products-overview/products-overview.component').then(c => c.ProductsOverviewComponent)
  },
  {
    path: 'manage-inventory/:code',
    loadComponent: () => import('./pages/products/products-detail/products-detail.component').then(c => c.ProductsDetailComponent)
  },
  {
    path: 'available-stocks',
    loadComponent: () => import('./pages/stocks/available-stocks/available-stocks-overview/available-stocks-overview.component').then(c => c.AvailableStocksOverviewComponent)
  },
  {
    path: 'restock-history',
    loadComponent: () => import('./pages/stocks/restock-history/restock-history-overview/restock-history-overview.component').then(c => c.RestockHistoryOverviewComponent)
  },
  {
    path: 'restock-history/:code',
    loadComponent: () => import('./pages/stocks/restock-history/restock-history-detail/restock-history-detail.component').then(c => c.RestockHistoryDetailComponent)
  },
  {
    path: 'customer-directory',
    loadComponent: () => import('./pages/customer/customer-overview/customer-overview.component').then(c => c.CustomerOverviewComponent)
  },
  {
    path: 'customer-directory/:code',
    loadComponent: () => import('./pages/customer/customer-detail/customer-detail.component').then(c => c.CustomerDetailComponent)
  },
  {
    path: 'reserved-orders',
    loadComponent: () => import('./pages/orders/order-overview/order-overview.component').then(c => c.OrderOverviewComponent)
  },
  {
    path: 'completed-orders',
    loadComponent: () => import('./pages/orders/order-overview/order-overview.component').then(c => c.OrderOverviewComponent)
  },
  {
    path: 'cancelled-orders',
    loadComponent: () => import('./pages/orders/order-overview/order-overview.component').then(c => c.OrderOverviewComponent)
  },
  {
    path: 'order-queue',
    loadComponent: () => import('./pages/orders/order-overview/order-overview.component').then(c => c.OrderOverviewComponent)
  },
  {
    path: 'reserved-orders/:code',
    loadComponent: () => import('./pages/orders/order-detail/order-detail.component').then(c => c.OrderDetailComponent)
  },
  {
    path: 'completed-orders/:code',
    loadComponent: () => import('./pages/orders/order-detail/order-detail.component').then(c => c.OrderDetailComponent)
  },
  {
    path: 'cancelled-orders/:code',
    loadComponent: () => import('./pages/orders/order-detail/order-detail.component').then(c => c.OrderDetailComponent)
  },
  {
    path: 'order-queue/:code',
    loadComponent: () => import('./pages/orders/order-detail/order-detail.component').then(c => c.OrderDetailComponent)
  },
  {
    path: 'customer-order-history',
    loadComponent: () => import('./pages/customer/customer-history/customer-history.component').then(c => c.CustomerHistoryComponent)
  },
  {
    path: 'customer-order-history/:code',
    loadComponent: () => import('./pages/orders/order-detail/order-detail.component').then(c => c.OrderDetailComponent)
  },
  {
    path: 'sales-history',
    loadComponent: () => import('./pages/sales/sales-history/sales-history.component').then(c => c.SalesHistoryComponent)
  },
  {
    path: 'sales-history/:code',
    loadComponent: () => import('./pages/orders/order-detail/order-detail.component').then(c => c.OrderDetailComponent)
  },
];
