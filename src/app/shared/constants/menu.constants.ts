import { Menu } from "../interfaces/menu.interface";

export const MenuItems: Menu[] = [
  {
    name: 'Dashboard',
    path: '',
  },
  {
    name: 'Inventory Management',
    path: '',
    children: [{
      name: 'Manage Inventory',
      path: 'manage-inventory',
    }]
  },
  {
    name: 'Stocks',
    path: '',
    children: [{
      name: 'Restock History',
      path: 'restock-history',
    }, {
      name: 'Available Stocks',
      path: 'available-stocks',
    }, {
      name: 'Stock Adjustments',
      path: 'stock-adjustments',
    }, {
      name: 'Stock Adjustments History',
      path: 'stock-adjustments-history',
    }]
  },
  {
    name: 'Sales',
    path: '',
    children: [{
      name: 'Sales History',
      path: 'sales-history',
    }]
  },
  {
    name: 'Order Management',
    path: '',
    children: [{
      name: 'Reserved Orders',
      path: 'reserved-orders',
    },
    {
      name: 'Order Queue',
      path: 'order-queue',
    },
    {
      name: 'Completed Orders',
      path: 'completed-orders',
    },
    {
      name: 'Cancelled Orders',
      path: 'cancelled-orders',
    }
    ]
  },
  {
    name: 'Customer',
    path: '',
    children: [
      {
        name: 'Customer Directory',
        path: 'customer-directory',
      },
      {
        name: 'Customer Order History',
        path: 'customer-order-history',
      }
    ]
  }
]
