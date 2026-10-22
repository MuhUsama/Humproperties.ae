"use client";

import Link from "next/link";
import Image from "next/image";
import AnimatedLogo from "@/components/common/AnimatedLogo";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  PlusCircle, 
  List as ListIcon, 
  Settings, 
  LogOut,
  Menu,
  X,
  BookOpen,
  Building,
  Home,
  Factory,
  Users,
  Layers,
  HelpCircle,
  Loader2,
  MessageSquare,
  Construction,
  Building2
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Add Residential", href: "/admin/add-listing/residential", icon: Home },
  { name: "Add Commercial", href: "/admin/add-listing/commercial", icon: Building },
  { name: "Add Industrial", href: "/admin/add-listing/industrial", icon: Factory },
  { name: "All Listings", href: "/admin/listings", icon: ListIcon },
  { name: "Off Plan Developers", href: "/admin/developers", icon: Building2 },
  { name: "Client Leads", href: "/admin/leads", icon: MessageSquare },
  { name: "Site Pages", href: "/admin/pages", icon: Layers },
  { name: "Under Construction", href: "/admin/under-construction", icon: Construction },
  { name: "FAQs", href: "/admin/faqs", icon: HelpCircle },
  { name: "Blogs", href: "/admin/blogs", icon: BookOpen },
  { name: "Team / Agents", href: "/admin/team", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch("/api/admin/logout", { method: "POST" });
      toast.success("Logged out successfully");
      router.replace("/admin/login");
    } catch (e) {
      toast.error("Logout failed");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={toggleSidebar}
          className="p-2 bg-brand-black text-white rounded-md shadow-md"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-40 h-screen max-h-screen w-64 flex-shrink-0 bg-brand-black text-white 
        transition-transform duration-300 ease-in-out flex flex-col overflow-hidden
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="p-5 pb-4 shrink-0 border-b border-white/10">
          <Link href="/admin" className="flex flex-col gap-2 group">
            <AnimatedLogo light className="w-44" />
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-gold">
                Admin Panel
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-3 space-y-1 overflow-y-auto min-h-0">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex w-full items-center px-3.5 py-2.5 rounded-xl transition-all whitespace-nowrap text-sm ${
                  isActive 
                    ? "bg-brand-gold text-brand-black font-semibold shadow-sm" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white font-medium"
                }`}
              >
                <item.icon className={`w-4 h-4 mr-3 flex-shrink-0 transition-colors ${isActive ? "text-brand-black" : "text-gray-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10 shrink-0 bg-brand-black">
          <button 
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center w-full px-3.5 py-2.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all whitespace-nowrap text-sm font-medium cursor-pointer disabled:opacity-50"
          >
            {loggingOut ? (
              <Loader2 className="w-4 h-4 mr-3 flex-shrink-0 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4 mr-3 flex-shrink-0" />
            )}
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}
