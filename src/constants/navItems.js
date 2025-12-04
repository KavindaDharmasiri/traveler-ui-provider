import Profile from "../pages/Profile.jsx";

import { LayoutDashboard, Briefcase, PlusCircle, PackageOpen } from "lucide-react";

export const navItems = [
  { name: "Home", icon: LayoutDashboard, page: "dashboard" },
  { name: "My Services", icon: Briefcase, page: "services" },
  { name: "Received Orders", icon: PackageOpen, page: "orders" },
  { name: "Profile", page: "profile", icon: "fa-user-circle" },
];
