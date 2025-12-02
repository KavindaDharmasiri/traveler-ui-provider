import { LayoutDashboard, Briefcase, PlusCircle, PackageOpen } from 'lucide-react';

export const navItems = [
  { name: 'Home', icon: LayoutDashboard, page: 'dashboard' },
  { name: 'My Services', icon: Briefcase, page: 'services' },
  // { name: 'Add Item', icon: PlusCircle, page: 'add' },
  { name: 'Received Orders', icon: PackageOpen, page: 'orders' },
];
