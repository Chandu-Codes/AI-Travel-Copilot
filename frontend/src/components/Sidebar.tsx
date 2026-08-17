import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Compass, 
  CalendarDays, 
  Building2, 
  Globe2, 
  Bot, 
  CloudSun, 
  Wallet, 
  UserCircle2, 
  LogOut, 
  Plane, 
  AlertTriangle, 
  LogIn 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'AI Copilot', path: '/assistant', icon: Bot },
    { name: 'Trips', path: '/plan-trip', icon: Compass },
    { name: 'Flights', path: '/flights', icon: Plane },
    { name: 'Hotels', path: '/hotels', icon: Building2 },
    { name: 'Destinations', path: '/explore', icon: Globe2 },
    { name: 'Itinerary', path: '/itinerary/1', icon: CalendarDays },
    { name: 'Disruptions', path: '/disruptions', icon: AlertTriangle },
    { name: 'Weather', path: '/weather', icon: CloudSun },
    { name: 'Budget', path: '/budget', icon: Wallet },
    { name: 'Profile', path: '/profile', icon: UserCircle2 },
  ];

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <aside className="w-64 bg-[#F5EFE6] border-r border-[#DDCFBD] min-h-screen flex flex-col justify-between py-6 px-4 shrink-0 font-sans">
      <div>
        {/* Brand Logo with Pure Airplane Icon */}
        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 px-3 mb-8 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-full bg-[#9E3816] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition">
            <Plane className="w-5 h-5 -rotate-45 text-white" />
          </div>
          <h1 className="font-extrabold text-lg text-[#0C0A09] tracking-tight">AI Travel Copilot</h1>
        </div>

        {/* Nav Links with High Contrast Bold Labels */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#9E3816] text-white shadow-terracotta'
                      : 'text-[#292524] hover:bg-[#EAE0D2] hover:text-[#0C0A09]'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Info & Auth Action */}
      <div className="pt-4 border-t border-[#DDCFBD]/80 space-y-2">
        {isAuthenticated && user ? (
          <>
            <div 
              onClick={() => navigate('/profile')}
              className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-white border border-[#DDCFBD] cursor-pointer hover:bg-[#FAF6F0] transition shadow-warm-sm"
            >
              <div className="w-8 h-8 rounded-full bg-[#9E3816] text-white font-bold text-xs flex items-center justify-center shrink-0">
                {userInitial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-extrabold text-[#0C0A09] truncate">{user.name}</p>
                <p className="text-[10px] text-[#44403C] font-semibold truncate">{user.travel_style || "Explorer"}</p>
              </div>
            </div>

            <button
              onClick={handleLogoutClick}
              className="flex items-center gap-2 px-3 py-2 w-full rounded-2xl text-xs font-bold text-[#44403C] hover:text-[#9E3816] hover:bg-[#FDECE4] transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 w-full rounded-full text-xs font-bold bg-[#9E3816] hover:bg-[#832C0E] text-white shadow-warm-sm transition"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </aside>
  );
};
