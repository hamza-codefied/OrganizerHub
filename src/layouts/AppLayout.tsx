import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserRound,
  Briefcase,
  Layers,
  CreditCard,
  Calendar,
  Landmark,
  Star,
  Megaphone,
  Settings,
  Bell,
  LogOut,
  ChevronRight,
  ChevronDown,
  Headphones,
  Search as SearchIcon,
  Menu,
  X,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../contexts/AuthContext";

type LucideIcon = React.ComponentType<{ className?: string }>;

interface MenuSubItem {
  name: string;
  icon: LucideIcon;
  path: string;
}

interface MenuItem {
  name: string;
  icon: LucideIcon;
  path: string;
  subItems?: MenuSubItem[];
}

const menuItems: { group: string; items: MenuItem[] }[] = [
  {
    group: "General",
    items: [
      { name: "Dashboard", icon: LayoutDashboard, path: "/" },
      { name: "Home Owners", icon: UserRound, path: "/users/home-owners" },
      { name: "Organizers", icon: Briefcase, path: "/users/organizers" },
    ],
  },
  {
    group: "Operation",
    items: [
      { name: "Services", icon: Layers, path: "/services" },
      { name: "Subscriptions", icon: CreditCard, path: "/subscriptions" },
      { name: "Bookings", icon: Calendar, path: "/bookings" },
      { name: "Finance", icon: Landmark, path: "/finance" },
      { name: "Reviews", icon: Star, path: "/reviews" },
    ],
  },
  {
    group: "Strategy",
    items: [{ name: "Promotions", icon: Megaphone, path: "/promotions" }],
  },
  {
    group: "System",
    items: [
      { name: "Support", icon: Headphones, path: "/support" },
      { name: "Notifications", icon: Bell, path: "/notifications" },
      { name: "Settings", icon: Settings, path: "/settings" },
    ],
  },
];

interface LayoutProps {
  children: React.ReactNode;
}

const Sidebar = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const location = useLocation();

  useEffect(() => {
    // Close mobile sidebar on route change
    setMobileOpen(false);
  }, [location.pathname, setMobileOpen]);

  const toggleExpand = (name: string) => {
    setExpandedMenus((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  };

  const isSubActive = (item: MenuItem) => {
    return item.subItems?.some((sub) => location.pathname === sub.path);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-[60] lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={cn(
          "h-screen bg-white flex flex-col fixed left-0 top-0 border-r border-slate-200 transition-all duration-300 ease-in-out",
          // Mobile styles: toggle visibility based on mobileOpen
          mobileOpen
            ? "translate-x-0 w-64 z-[70]"
            : "-translate-x-full lg:translate-x-0 z-50",
          // Desktop styles: toggle width based on collapsed
          collapsed ? "lg:w-20" : "lg:w-64",
        )}
      >
        <div className="p-4 flex items-center justify-between mb-2">
          <NavLink
            to="/"
            className="flex items-start justify-center focus:outline-none"
          >
            <img
              src="/logo.png"
              alt="OrganizerHub"
              className={cn(
                "object-contain transition-all",
                collapsed && !mobileOpen
                  ? "w-10 h-10"
                  : "h-9 w-auto max-w-[160px]",
              )}
            />
          </NavLink>
          {/* Close button for mobile */}
          <button
            className="lg:hidden p-2 text-slate-500 hover:text-primary transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto premium-scrollbar px-3 space-y-6 pb-8">
          {menuItems.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {(!collapsed || mobileOpen) && (
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-2 px-3">
                  {group.group}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <div key={item.name}>
                    {item.subItems ? (
                      <>
                        <button
                          type="button"
                          onClick={() => toggleExpand(item.name)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                            isSubActive(item)
                              ? "bg-primary/10 text-primary"
                              : "text-slate-600 hover:bg-slate-50",
                          )}
                        >
                          <item.icon
                            className={cn(
                              "w-5 h-5 shrink-0",
                              collapsed && !mobileOpen && "mx-auto",
                            )}
                          />
                          {(!collapsed || mobileOpen) && (
                            <span className="font-medium text-left flex-1">
                              {item.name}
                            </span>
                          )}
                          {(!collapsed || mobileOpen) && (
                            <div className="ml-auto text-slate-400">
                              {expandedMenus.includes(item.name) ? (
                                <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                              ) : (
                                <ChevronRight className="w-4 h-4 transition-transform duration-200" />
                              )}
                            </div>
                          )}
                        </button>
                        {(!collapsed || mobileOpen) &&
                          expandedMenus.includes(item.name) && (
                            <div className="ml-4 mt-1 space-y-0.5 border-l border-slate-200 pl-3 py-1">
                              {item.subItems.map((sub: MenuSubItem) => (
                                <NavLink
                                  key={sub.name}
                                  to={sub.path}
                                  className={({ isActive }) =>
                                    cn(
                                      "flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-all",
                                      isActive
                                        ? "text-primary font-medium bg-primary/5 translate-x-1"
                                        : "text-slate-500 hover:text-slate-800 hover:translate-x-1",
                                    )
                                  }
                                >
                                  <sub.icon className="w-4 h-4" />
                                  {sub.name}
                                </NavLink>
                              ))}
                            </div>
                          )}
                      </>
                    ) : (
                      <NavLink
                        to={item.path}
                        end={item.path === "/"}
                        className={({ isActive }) =>
                          cn(
                            "relative flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all",
                            isActive
                              ? "nav-active-item font-medium"
                              : "text-slate-600 hover:bg-slate-50",
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <item.icon
                              className={cn(
                                "w-5 h-5 shrink-0",
                                collapsed && !mobileOpen && "mx-auto",
                              )}
                            />
                            {(!collapsed || mobileOpen) && (
                              <span className="font-medium">{item.name}</span>
                            )}
                            {isActive && (!collapsed || mobileOpen) && (
                              <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white/90 shadow-sm" />
                            )}
                          </>
                        )}
                      </NavLink>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Collapse Toggle for Desktop */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-8 w-7 h-7 rounded border border-slate-200 bg-white items-center justify-center text-slate-500 hover:text-slate-800 z-60 shadow-sm"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronRight
            className={cn(
              "w-4 h-4 transition-transform duration-300",
              !collapsed && "rotate-180",
            )}
          />
        </button>
      </div>
    </>
  );
};

const Navbar = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <nav className="h-14 bg-white px-4 md:px-6 flex items-center justify-between border-b border-slate-200 sticky top-0 z-40 mb-6 rounded-lg lg:rounded-none">
      <div className="flex items-center gap-4 flex-1">
        {/* Hamburger Menu - Only on mobile */}
        <button
          className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-primary transition-colors"
          onClick={onMenuClick}
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search resources..."
              className="w-full bg-slate-50 border border-slate-200 rounded-md py-1.5 pl-9 pr-3 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none text-sm transition-all"
            />
            <SearchIcon className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search for mobile icon */}
        <button className="sm:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
          <SearchIcon className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => navigate("/notifications")}
          aria-label="Go to notifications"
          className="p-2 rounded-md hover:bg-slate-100 text-slate-600 relative transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full border border-white" />
        </button>

        <div className="h-6 w-px bg-slate-200 hidden xs:block" />

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 outline-none group"
          >
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-slate-800 group-hover:text-primary transition-colors">
                Admin
              </p>
            </div>
            <div className="w-9 h-9 rounded-md border border-slate-200 overflow-hidden bg-slate-50 group-hover:border-primary transition-all shadow-sm">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=executive"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </button>

          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
                aria-hidden
              />
              <div className="absolute right-0 mt-2 w-52 bg-white py-1 rounded-md border border-slate-200 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowDropdown(false);
                    navigate("/profile");
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 text-left transition-colors"
                >
                  <UserRound className="w-4 h-4" />
                  View Profile
                </button>
                <div className="h-px bg-slate-100 my-1" />
                <button
                  type="button"
                  onClick={() => {
                    setShowDropdown(false);
                    void logout().finally(() => {
                      navigate("/login", { replace: true });
                    });
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-rose-600 hover:bg-rose-50 text-left transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export const AppLayout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div
        className={cn(
          "min-h-screen pb-8 flex flex-col transition-all duration-300",
          // Desktop margins
          collapsed ? "lg:ml-20" : "lg:ml-64",
          // Mobile margin (none, as sidebar is overlay)
          "ml-0",
        )}
      >
        <div className="px-2 sm:px-6 pt-2 sm:pt-4">
          <Navbar onMenuClick={() => setMobileOpen(true)} />
          <main className="relative w-full max-w-full">{children}</main>
        </div>
      </div>
    </div>
  );
};
