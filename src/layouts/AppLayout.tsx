import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserRound, Briefcase, Layers, 
  CreditCard, Calendar, Landmark, Star, Megaphone, 
  Settings, Bell, LogOut, ChevronRight, ChevronDown,
  Headphones, FileText, BarChart3, Presentation, Search as SearchIcon
} from 'lucide-react';
import { cn } from '../lib/utils';
import { PremiumBackground } from '../components/UI';
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
    // { name: "Ads Management", icon: Presentation, path: "/ads" },
    // { name: "Analytics", icon: BarChart3, path: "/analytics" },
  ]},
  { group: "System", items: [
    { name: "Support", icon: Headphones, path: "/support" },
    // { name: "CMS", icon: FileText, path: "/cms" },
    { name: "Notifications", icon: Bell, path: "/notifications" },
    { name: "Settings", icon: Settings, path: "/settings" },
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
      "h-screen transition-all duration-500 ease-in-out glass-premium flex flex-col fixed left-0 top-0 z-50 border-r border-white/40",
      collapsed ? "w-20" : "w-72"
    )}>
      <div className="p-6 flex  mb-4">
        <NavLink to="/" className="flex items-start justify-center focus:outline-none">
          <img
            src="/logo.png"
            alt="OrganizerHub"
            className={cn("object-contain", collapsed ? "w-10 h-10" : "h-10 w-auto max-w-[180px]")}
          />
        </NavLink>
      </div>

      <div className="flex-1 overflow-y-auto premium-scrollbar px-4 space-y-7 pb-10">
        {menuItems.map((group, idx) => (
          <div key={idx} className="space-y-2">
            {!collapsed && (
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] mb-3 px-4 opacity-70">
                {group.group}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => (
                <div key={item.name}>
                  {item.subItems ? (
                    <>
                      <button
                        onClick={() => toggleExpand(item.name)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative",
                          isSubActive(item)
                            ? "bg-primary/5 text-primary" 
                            : "text-slate-500 hover:bg-slate-100/40 hover:text-primary"
                        )}
                      >
                        <item.icon className={cn("w-5 h-5 shrink-0", collapsed && "mx-auto")} />
                        {!collapsed && <span className="text-[13px] font-bold tracking-tight">{item.name}</span>}
                        {!collapsed && (
                          <div className="ml-auto opacity-40 group-hover:opacity-100 transition-all">
                            {expandedMenus.includes(item.name) 
                              ? <ChevronDown className="w-3.5 h-3.5" /> 
                              : <ChevronRight className="w-3.5 h-3.5" />
                            }
                          </div>
                        )}
                      </button>
                      {!collapsed && expandedMenus.includes(item.name) && (
                        <div className="ml-6 mt-1 space-y-1 border-l border-slate-200 pl-4 py-1">
                          {item.subItems.map((sub: MenuSubItem) => (
                            <NavLink
                              key={sub.name}
                              to={sub.path}
                              className={({ isActive }) => cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-[12px] font-bold",
                                isActive 
                                  ? "text-primary bg-primary/5" 
                                  : "text-slate-400 hover:text-primary"
                              )}
                            >
                              <sub.icon className="w-3.5 h-3.5" />
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
                        "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative",
                        isActive 
                          ? "nav-active-item" 
                          : "text-slate-500 hover:bg-slate-100/40 hover:text-primary"
                      )}
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon className={cn("w-5 h-5 shrink-0", collapsed && "mx-auto")} />
                          {!collapsed && <span className="text-[13px] font-bold tracking-tight">{item.name}</span>}
                          {isActive && !collapsed && (
                            <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
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
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-4 top-10 w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-lg text-slate-400 hover:text-primary transition-all hover:scale-110 active:scale-90 z-60"
      >
        <ChevronRight className={cn("w-4 h-4 transition-transform duration-500", !collapsed && "rotate-180")} />
      </button>
    </div>
  );
};

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <nav className="h-20 glass-premium px-8 flex items-center justify-between border-b border-white/40 sticky top-4 rounded-3xl z-60 mb-8 backdrop-blur-xl">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Search resources..." 
            className="w-full bg-slate-100/50 border border-transparent rounded-2xl py-2.5 pl-11 pr-4 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none font-medium text-sm"
          />
          <SearchIcon className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => navigate('/notifications')}
            aria-label="Go to notifications"
            className="p-2.5 rounded-2xl hover:bg-white/80 relative text-slate-500 hover:text-primary transition-all"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-secondary rounded-full border-2 border-white animate-pulse"></span>
          </button>
          {/* <button className="p-2.5 rounded-2xl hover:bg-white/80 text-slate-500 hover:text-primary transition-all">
            <Settings className="w-5 h-5" />
          </button> */}
        </div>
        
        <div className="h-8 w-[1.5px] bg-slate-200/50 rounded-full mx-1"></div>

        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 group outline-none"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-slate-800 leading-none group-hover:text-primary transition-colors">Admin</p>
              {/* <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Global Executive</p> */}
            </div>
            <div className="w-10 h-10 rounded-xl border-2 border-white shadow-xl overflow-hidden group-hover:scale-105 transition-all duration-300">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=executive" 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
          </button>

          {showDropdown && (
              <>
                <div className="fixed inset-0 z-[-1]" onClick={() => setShowDropdown(false)} />
                <div 
                  className="absolute right-0 mt-3 w-56 bg-white p-2 rounded-2xl border border-slate-100 shadow-[0_20px_70px_-10px_rgba(0,0,0,0.15)] z-100 animate-in fade-in zoom-in-95 duration-200"
                >
                  <button 
                    onClick={() => {
                      setShowDropdown(false);
                      navigate('/profile');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-primary/5 hover:text-primary transition-all text-xs font-black uppercase tracking-widest"
                  >
                    <UserRound className="w-4 h-4" />
                    View Profile
                  </button>
                  <div className="h-px bg-slate-100 my-1 mx-2" />
                  <button 
                    onClick={() => {
                      setShowDropdown(false);
                      logout();
                      navigate('/login', { replace: true });
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-all text-xs font-black uppercase tracking-widest"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout Profile
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
    <div className="min-h-screen bg-[#FAFAFB] overflow-x-hidden">
      <PremiumBackground />
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={cn(
        "transition-all duration-500 ease-in-out min-h-screen pb-12 flex flex-col",
        collapsed ? "ml-20" : "ml-72"
      )}>
        <div className="px-4 md:px-8 pt-4">
          <Navbar />
          <main className="relative z-10 w-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
