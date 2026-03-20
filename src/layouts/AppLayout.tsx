import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserRound, Briefcase, Layers, 
  CreditCard, Calendar, Landmark, Star, Megaphone, 
  Settings, Bell, LogOut, ChevronRight, ChevronDown,
  Headphones, FileText, BarChart3, Presentation, Search as SearchIcon
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

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
  { group: "General", items: [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Home Owners", icon: UserRound, path: "/users/home-owners" },
    { name: "Organizers", icon: Briefcase, path: "/users/organizers" },
  ]},
  { group: "Operation", items: [
    { name: "Services", icon: Layers, path: "/services" },
    { name: "Subscriptions", icon: CreditCard, path: "/subscriptions" },
    { name: "Bookings", icon: Calendar, path: "/bookings" },
    { name: "Finance", icon: Landmark, path: "/finance" },
    { name: "Reviews", icon: Star, path: "/reviews" },
  ]},
  { group: "Strategy", items: [
    { name: "Promotions", icon: Megaphone, path: "/promotions" },
  ]},
  { group: "System", items: [
    { name: "Support", icon: Headphones, path: "/support" },
    { name: "Notifications", icon: Bell, path: "/notifications" },
    { name: "Controller", icon: Settings, path: "/settings" },
  ]}
];

interface LayoutProps {
  children: React.ReactNode;
}

const Sidebar = ({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (v: boolean) => void }) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const location = useLocation();

  const toggleExpand = (name: string) => {
    setExpandedMenus(prev => 
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const isSubActive = (item: MenuItem) => {
    return item.subItems?.some((sub) => location.pathname === sub.path);
  };

  return (
    <div className={cn(
      "h-screen bg-white flex flex-col fixed left-0 top-0 z-50 border-r border-slate-200",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="p-4 flex mb-2">
        <NavLink to="/" className="flex items-start justify-center focus:outline-none">
          <img
            src="/logo.png"
            alt="OrganizerHub"
            className={cn("object-contain", collapsed ? "w-10 h-10" : "h-9 w-auto max-w-[160px]")}
          />
        </NavLink>
      </div>

      <div className="flex-1 overflow-y-auto premium-scrollbar px-3 space-y-6 pb-8">
        {menuItems.map((group, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && (
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
                          "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm",
                          isSubActive(item)
                            ? "bg-primary/10 text-primary"
                            : "text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        <item.icon className={cn("w-5 h-5 shrink-0", collapsed && "mx-auto")} />
                        {!collapsed && <span className="font-medium">{item.name}</span>}
                        {!collapsed && (
                          <div className="ml-auto text-slate-400">
                            {expandedMenus.includes(item.name) 
                              ? <ChevronDown className="w-4 h-4" /> 
                              : <ChevronRight className="w-4 h-4" />
                            }
                          </div>
                        )}
                      </button>
                      {!collapsed && expandedMenus.includes(item.name) && (
                        <div className="ml-4 mt-1 space-y-0.5 border-l border-slate-200 pl-3 py-1">
                          {item.subItems.map((sub: MenuSubItem) => (
                            <NavLink
                              key={sub.name}
                              to={sub.path}
                              className={({ isActive }) => cn(
                                "flex items-center gap-2 px-2 py-1.5 rounded text-sm",
                                isActive 
                                  ? "text-primary font-medium bg-primary/5" 
                                  : "text-slate-500 hover:text-slate-800"
                              )}
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
                      className={({ isActive }) => cn(
                        "relative flex items-center gap-3 px-3 py-2 rounded-md text-sm",
                        isActive 
                          ? "nav-active-item font-medium" 
                          : "text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon className={cn("w-5 h-5 shrink-0", collapsed && "mx-auto")} />
                          {!collapsed && <span className="font-medium">{item.name}</span>}
                          {isActive && !collapsed && (
                            <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white/90" />
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

      <button 
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 w-7 h-7 rounded border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-slate-800 z-60"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <ChevronRight className={cn("w-4 h-4", !collapsed && "rotate-180")} />
      </button>
    </div>
  );
};

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <nav className="h-14 bg-white px-4 md:px-6 flex items-center justify-between border-b border-slate-200 sticky top-0 z-40 mb-6">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search resources..." 
            className="w-full bg-white border border-slate-200 rounded-md py-2 pl-9 pr-3 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none text-sm"
          />
          <SearchIcon className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/notifications')}
          aria-label="Go to notifications"
          className="p-2 rounded-md hover:bg-slate-100 text-slate-600 relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full border border-white" />
        </button>
        
        <div className="h-6 w-px bg-slate-200" />

        <div className="relative">
          <button 
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 outline-none"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-800">Admin</p>
            </div>
            <div className="w-9 h-9 rounded-md border border-slate-200 overflow-hidden bg-slate-50">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=executive" 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
          </button>

          {showDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} aria-hidden />
                <div 
                  className="absolute right-0 mt-2 w-52 bg-white py-1 rounded-md border border-slate-200 shadow-md z-50"
                >
                  <button 
                    type="button"
                    onClick={() => {
                      setShowDropdown(false);
                      navigate('/profile');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 text-left"
                  >
                    <UserRound className="w-4 h-4" />
                    View Profile
                  </button>
                  <div className="h-px bg-slate-100 my-1" />
                  <button 
                    type="button"
                    onClick={() => {
                      setShowDropdown(false);
                      logout();
                      navigate('/login', { replace: true });
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 text-left"
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

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={cn(
        "min-h-screen pb-8 flex flex-col",
        collapsed ? "ml-20" : "ml-64"
      )}>
        <div className="px-4 md:px-6 pt-4">
          <Navbar />
          <main className="relative w-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
