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
  }
];
