import React, { useState } from 'react';
import { Bell, Search, LogOut, UserCircle2, Plane, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  title?: string;
  subtitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  title,
  subtitle
}) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const displayName = user ? user.name.split(' ')[0] : 'Chandu';
  const headerTitle = title || (isAuthenticated && user ? `Good day, ${displayName}` : "AI Travel Copilot");
  const headerSubtitle = subtitle || "Where would you like to explore today?";

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'C';

  return (
    <header className="h-20 bg-[#F5EFE6]/90 backdrop-blur-md border-b border-[#DDCFBD] px-8 flex items-center justify-between sticky top-0 z-30 font-sans">
      <div>
        <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-[#0C0A09] tracking-tight">{headerTitle}</h2>
        <p className="text-xs font-bold text-[#44403C]">{headerSubtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Quick Search */}
        <div 
          onClick={() => navigate('/explore')}
          className="hidden md:flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#FAF6F0] border border-[#DDCFBD] rounded-full text-xs text-[#292524] font-medium cursor-pointer transition w-64 shadow-warm-sm"
        >
          <Search className="w-3.5 h-3.5 text-[#9E3816]" />
          <span>Search destinations, hotels, flights...</span>
        </div>

        {/* Notifications Button */}
        <button 
          onClick={() => navigate('/disruptions')}
          className="w-10 h-10 rounded-full bg-white border border-[#DDCFBD] flex items-center justify-center text-[#0C0A09] hover:bg-[#FAF6F0] transition relative shadow-warm-sm"
          title="Disruption Radar & Advisories"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-[#9E3816] absolute top-2.5 right-2.5 animate-pulse" />
        </button>

        {/* User Profile / Auth State */}
        {isAuthenticated && user ? (
          <div className="relative">
            <div 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 pl-2 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-[#9E3816] text-white font-bold text-sm flex items-center justify-center shadow-warm-sm group-hover:ring-2 group-hover:ring-[#9E3816]/40 transition">
                {userInitial}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-extrabold text-[#0C0A09] leading-tight">{user.name}</p>
                <p className="text-xs text-[#44403C] font-semibold">{user.travel_style || "Explorer"}</p>
              </div>
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-[#DDCFBD] shadow-warm-lg py-2 z-50 animate-fade-in text-xs">
                <div className="px-4 py-2 border-b border-[#DDCFBD]/60">
                  <p className="font-bold text-[#0C0A09] truncate">{user.name}</p>
                  <p className="text-[#44403C] truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => { setShowDropdown(false); navigate('/profile'); }}
                  className="w-full px-4 py-2.5 text-left text-[#0C0A09] hover:bg-[#FAF6F0] flex items-center gap-2 font-bold"
                >
                  <UserCircle2 className="w-4 h-4 text-[#9E3816]" />
                  <span>Profile & Preferences</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 text-left text-[#9E3816] hover:bg-[#FDECE4] flex items-center gap-2 font-bold border-t border-[#DDCFBD]/60"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 rounded-full bg-[#9E3816] hover:bg-[#832C0E] text-white font-bold text-xs shadow-warm-sm transition"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};
