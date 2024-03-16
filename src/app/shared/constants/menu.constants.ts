import { Menu } from "../interfaces/menu.interface";

export const MenuItems: Menu[] = [
  {
    name: 'Dashboard',
    path: '',
    children: []
  },
  {
    name: 'Inventory Management',
    path: '',
    children: [{
      name: 'Manage Inventory',
      path: 'manage-inventory',
      children: []
    }]
  },
  {
    name: 'Stocks',
    path: '',
    children: [{
      name: 'Restock History',
      path: 'restock-history',
      children: []
    }, {
      name: 'Available Stocks',
      path: 'available-stocks',
      children: []
    }]
  },
  {
    name: 'Sales',
    path: '',
    children: [{
      name: 'Sales History',
      path: 'sales-history',
      children: []
    }]
  },
  {
    name: 'Order Management',
    path: '',
    children: [{
      name: 'Reserved Orders',
      path: 'reserved-orders',
      children: []
    },
    {
      name: 'Completed Orders',
      path: 'completed-orders',
      children: []
    },
    {
      name: 'Cancelled Orders',
      path: 'cancelled-orders',
      children: []
    }, {
      name: 'Order Queue',
      path: 'order-queue',
      children: []
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
        children: []
      },
      {
        name: 'Customer Order History',
        path: 'customer-order-history',
        children: []
      }
    ]
  }
]
