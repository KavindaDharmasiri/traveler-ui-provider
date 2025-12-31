import Profile from "../pages/Profile.jsx";

import { LayoutDashboard, Briefcase, UserCircle, PackageOpen, Loader, Wallet, } from "lucide-react";

export const navItems = [
  { name: "Home", icon: LayoutDashboard, page: "dashboard" },
  { name: "My Services", icon: Briefcase, page: "services" },
  { name: "Received Orders", icon: PackageOpen, page: "orders" },
  { name: "Ongoing Orders", page: "ongoing", icon: Loader },
  { name: "Wallet", page: "wallet", icon: Wallet },
  { name: "Profile", page: "profile", icon: UserCircle },
];
