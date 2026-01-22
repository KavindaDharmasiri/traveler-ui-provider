import Profile from "../pages/Profile.jsx";

import { LayoutDashboard, Briefcase, UserCircle, PackageOpen, Loader, Wallet, } from "lucide-react";

export const navItems = [
  { name: "Home", icon: LayoutDashboard, page: "dashboard", path: "/" },
  { name: "My Services", icon: Briefcase, page: "services", path: "/services" },
  { name: "Received Orders", icon: PackageOpen, page: "orders", path: "/orders" },
  { name: "Ongoing Orders", page: "ongoing", icon: Loader, path: "/ongoing" },
  { name: "Wallet", page: "wallet", icon: Wallet, path: "/wallet" },
  { name: "Profile", page: "profile", icon: UserCircle, path: "/profile" },
];

