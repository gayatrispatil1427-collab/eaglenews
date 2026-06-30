import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sun, Cloud, Search, Bell, Menu, X, User, LogOut, ChevronDown, 
  Tv, Radio, Shield, Settings
} from 'lucide-react';

const Facebook = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const Twitter = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const Youtube = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/>
    <polygon points="10 15 15 12 10 9"/>
  </svg>
);

const Instagram = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

export default function Header() {
  const { 
    darkMode, toggleDarkMode, 
    user, login, logout, 
    notifications, markAllNotificationsAsRead, 
    weather, changeWeatherCity 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBellOpen, setIsBellOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWeatherDropdownOpen, setIsWeatherDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleCitySelect = (city) => {
    changeWeatherCity(city);
    setIsWeatherDropdownOpen(false);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <header className="sticky top-0 z-50 w-full glass-header transition-all duration-300">
        {/* Top bar (Hidden on mobile) */}
        <div className="hidden lg:flex justify-between items-center px-6 py-2 border-b border-gray-100 dark:border-neutral-800 text-xs">
          {/* Weather & Date */}
          <div className="flex items-center gap-4 relative">
            <button 
              onClick={() => setIsWeatherDropdownOpen(!isWeatherDropdownOpen)}
              className="flex items-center gap-1.5 font-medium hover:text-primary transition-colors duration-200"
            >
              <Sun className="w-3.5 h-3.5 text-accent" />
              <span>{weather.city}: {Math.round(weather.temp)}°C</span>
              <span className="text-gray-400">({weather.condition})</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {isWeatherDropdownOpen && (
              <div className="absolute top-6 left-0 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-md shadow-lg py-1 z-50 w-36">
                {["मुंबई", "पुणे", "नागपूर", "नाशिक", "कोल्हापूर"].map(city => (
                  <button
                    key={city}
                    onClick={() => handleCitySelect(city)}
                    className="w-full text-left px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors duration-200 text-xs dark:text-gray-200"
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}

            <div className="h-3 w-px bg-gray-300 dark:bg-neutral-700" />
            <span className="text-gray-500 dark:text-gray-400 font-medium">
              {new Date().toLocaleDateString('mr-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>

          {/* Social icons & Lang switcher */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 text-gray-500 dark:text-gray-400">
              <a href="#" className="hover:text-primary transition-colors duration-200"><Facebook className="w-3.5 h-3.5" /></a>
              <a href="#" className="hover:text-primary transition-colors duration-200"><Twitter className="w-3.5 h-3.5" /></a>
              <a href="#" className="hover:text-primary transition-colors duration-200"><Youtube className="w-3.5 h-3.5" /></a>
              <a href="#" className="hover:text-primary transition-colors duration-200"><Instagram className="w-3.5 h-3.5" /></a>
            </div>
            <div className="h-3 w-px bg-gray-300 dark:bg-neutral-700" />
            <div className="flex gap-2">
              <button className="font-bold text-primary">मराठी</button>
              <button className="text-gray-400 hover:text-primary transition-colors duration-200">English</button>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="px-4 lg:px-6 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div
              className="eagle-logo-box font-black text-xl md:text-2xl px-3 py-1.5 rounded tracking-tighter shadow-glow"
            >
              EAGLE
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black text-lg md:text-xl leading-none text-secondary dark:text-white tracking-wide">
                ईगल न्यूज
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold">
                २४x७ डिजिटल महाराष्ट्र
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 font-heading text-[15px] font-bold text-secondary dark:text-gray-200">
            <Link to="/" className="hover:text-primary transition-colors duration-200">मुख्य पान</Link>
            <Link to="/?category=maharashtra" className="hover:text-primary transition-colors duration-200">महाराष्ट्र</Link>
            <Link to="/?category=politics" className="hover:text-primary transition-colors duration-200">राजकारण</Link>
            <Link to="/?category=crime" className="hover:text-primary transition-colors duration-200">गुन्हेगारी</Link>
            <Link to="/?category=agriculture" className="hover:text-primary transition-colors duration-200">कृषी</Link>
            <Link to="/?category=sports" className="hover:text-primary transition-colors duration-200">क्रीडा</Link>
            <Link to="/live-tv" className="flex items-center gap-1 text-primary animate-pulse-slow">
              <Tv className="w-4 h-4" /> थेट टीव्ही
            </Link>
            <Link to="/podcasts" className="flex items-center gap-1 hover:text-primary transition-colors duration-200">
              <Radio className="w-4 h-4 text-accent" /> पॉडकास्ट
            </Link>
          </nav>

          {/* Utility Buttons */}
          <div className="flex items-center gap-3 relative">
            {/* Search */}
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)} 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors duration-200 text-secondary dark:text-gray-300"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Dark Mode */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors duration-200 text-secondary dark:text-gray-300"
            >
              {darkMode ? <Sun className="w-5 h-5 text-accent" /> : <Cloud className="w-5 h-5 text-gray-600" />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => {
                  setIsBellOpen(!isBellOpen);
                  if (!isBellOpen) markAllNotificationsAsRead();
                }}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors duration-200 text-secondary dark:text-gray-300"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary text-white text-[9px] font-black rounded-full flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isBellOpen && (
                <div className="absolute right-0 mt-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg shadow-xl w-80 py-2 z-50 text-xs text-left">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center">
                    <span className="font-bold text-sm dark:text-white">सूचना (Notifications)</span>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.map(not => (
                      <div 
                        key={not.id} 
                        className={`px-4 py-3 border-b border-gray-50 dark:border-neutral-800/50 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors duration-200 ${!not.read ? 'bg-red-50/30 dark:bg-red-950/10' : ''}`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-bold text-primary">{not.title}</span>
                          <span className="text-[10px] text-gray-400 shrink-0">{not.time}</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">{not.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Buttons / Auth Trigger */}
            {user ? (
              <div className="flex items-center gap-2">
                {/* Admin Quick access */}
                {(user.role === 'admin' || user.role === 'superadmin') && (
                  <Link 
                    to="/admin" 
                    className="hidden md:flex items-center gap-1 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 px-3 py-1.5 rounded-full text-xs font-bold text-secondary dark:text-gray-200 transition-colors duration-200"
                  >
                    <Settings className="w-3.5 h-3.5 text-primary" /> डॅशबोर्ड
                  </Link>
                )}
                
                {/* User avatar dropdown */}
                <button 
                  onClick={logout}
                  className="flex items-center justify-center p-2 rounded-full hover:bg-red-100/50 dark:hover:bg-red-950/20 text-red-600 hover:text-red-700 transition-colors duration-200"
                  title="लॉगआउट करा"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 hover:shadow-glow"
              >
                <User className="w-3.5 h-3.5" /> लॉगिन
              </button>
            )}

            {/* Mobile Hamburger menu */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-secondary dark:text-gray-300"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar Slide Down */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 w-full bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 px-6 py-4 shadow-lg animate-fadeIn z-40">
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="बातम्या शोधा (उदा. राजकारण, पुणे पाऊस, क्रीडा)..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-md bg-transparent text-secondary dark:text-white focus:outline-none focus:border-primary text-sm"
              />
              <button type="submit" className="bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-md font-bold text-sm">
                शोधा
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Sliding Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden flex justify-end">
          <div className="w-4/5 max-w-sm bg-white dark:bg-neutral-950 h-full p-6 shadow-2xl relative flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex justify-between items-center mb-8">
                <span className="font-heading font-black text-xl text-primary">ईगल न्यूज</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-900 rounded-full">
                  <X className="w-6 h-6 dark:text-gray-200" />
                </button>
              </div>

              {/* Mobile Navigation links */}
              <nav className="flex flex-col gap-5 font-heading text-lg font-bold text-secondary dark:text-gray-200">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors duration-200 border-b border-gray-100 dark:border-neutral-800 pb-2">मुख्य पान</Link>
                <Link to="/?category=maharashtra" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors duration-200 border-b border-gray-100 dark:border-neutral-800 pb-2">महाराष्ट्र</Link>
                <Link to="/?category=politics" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors duration-200 border-b border-gray-100 dark:border-neutral-800 pb-2">राजकारण</Link>
                <Link to="/?category=crime" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors duration-200 border-b border-gray-100 dark:border-neutral-800 pb-2">गुन्हेगारी</Link>
                <Link to="/?category=agriculture" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors duration-200 border-b border-gray-100 dark:border-neutral-800 pb-2">कृषी</Link>
                <Link to="/?category=sports" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors duration-200 border-b border-gray-100 dark:border-neutral-800 pb-2">क्रीडा</Link>
                <Link to="/live-tv" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-primary border-b border-gray-100 dark:border-neutral-800 pb-2">
                  <Tv className="w-5 h-5 animate-pulse" /> थेट टीव्ही
                </Link>
                <Link to="/podcasts" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 hover:text-primary transition-colors duration-200 border-b border-gray-100 dark:border-neutral-800 pb-2">
                  <Radio className="w-5 h-5 text-accent" /> पॉडकास्ट
                </Link>
                {user && (user.role === 'admin' || user.role === 'superadmin') && (
                  <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-secondary dark:text-white border-b border-gray-100 dark:border-neutral-800 pb-2">
                    <Settings className="w-5 h-5 text-primary" /> डॅशबोर्ड (Admin)
                  </Link>
                )}
              </nav>
            </div>

            {/* Social media and info at bottom of sidebar */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-neutral-800">
              {user ? (
                <div className="mb-4">
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.roleLabel}</p>
                  <button 
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded text-sm transition-colors duration-200"
                  >
                    लॉगआउट
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-2.5 rounded text-sm transition-colors duration-200 mb-4"
                >
                  लॉगिन करा
                </button>
              )}
              <div className="flex gap-4 justify-center text-gray-400">
                <a href="#" className="hover:text-primary"><Facebook className="w-5 h-5" /></a>
                <a href="#" className="hover:text-primary"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="hover:text-primary"><Youtube className="w-5 h-5" /></a>
                <a href="#" className="hover:text-primary"><Instagram className="w-5 h-5" /></a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Authentication Mock Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-xl shadow-2xl p-6 md:p-8 max-w-md w-full relative animate-scaleIn">
            <button 
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full"
            >
              <X className="w-5 h-5 dark:text-gray-200" />
            </button>

            <h3 className="font-heading font-black text-2xl text-secondary dark:text-white mb-2 text-center">
              ईगल न्यूज वर आपले स्वागत आहे!
            </h3>
            <p className="text-gray-500 text-center text-sm mb-6">
              आपापल्या भूमिकेनुसार लॉगिन करून वेबसाइटचे सर्व फिचर्स तपासा.
            </p>

            <div className="flex flex-col gap-4">
              {/* Role: Reader */}
              <button 
                onClick={() => {
                  login('reader');
                  setIsAuthModalOpen(false);
                }}
                className="flex items-center justify-between border border-gray-200 dark:border-neutral-800 hover:border-primary dark:hover:border-primary p-4 rounded-lg bg-gray-50/50 dark:bg-neutral-800/40 hover:bg-primary/5 dark:hover:bg-primary/5 text-left transition-all duration-300"
              >
                <div>
                  <span className="font-bold text-sm text-secondary dark:text-white block">वाचक म्हणून लॉगिन करा (Reader)</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">प्रतिक्रिया देणे, कमेंट करणे, लेख सेव्ह करणे</span>
                </div>
                <User className="w-5 h-5 text-primary" />
              </button>

              {/* Role: Admin/Journalist */}
              <button 
                onClick={() => {
                  login('admin');
                  setIsAuthModalOpen(false);
                }}
                className="flex items-center justify-between border border-gray-200 dark:border-neutral-800 hover:border-primary dark:hover:border-primary p-4 rounded-lg bg-gray-50/50 dark:bg-neutral-800/40 hover:bg-primary/5 dark:hover:bg-primary/5 text-left transition-all duration-300"
              >
                <div>
                  <span className="font-bold text-sm text-secondary dark:text-white block">प्रशासक / पत्रकार (Editor/Admin)</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">नवीन बातमी जोडणे, बदल करणे, जाहिराती सांभाळणे</span>
                </div>
                <Shield className="w-5 h-5 text-primary" />
              </button>

              {/* Role: Super Admin */}
              <button 
                onClick={() => {
                  login('superadmin');
                  setIsAuthModalOpen(false);
                }}
                className="flex items-center justify-between border border-gray-200 dark:border-neutral-800 hover:border-primary dark:hover:border-primary p-4 rounded-lg bg-gray-50/50 dark:bg-neutral-800/40 hover:bg-primary/5 dark:hover:bg-primary/5 text-left transition-all duration-300"
              >
                <div>
                  <span className="font-bold text-sm text-secondary dark:text-white block">मुख्य संपादक (Super Admin)</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">महसूल चार्ट, सर्व ॲडमिन कृती लॉग्स, मंजुरी प्रक्रिया</span>
                </div>
                <Shield className="w-5 h-5 text-accent" />
              </button>
            </div>
            
            <p className="text-[10px] text-gray-400 mt-6 text-center leading-relaxed">
              * ही एक सुरक्षित चाचणी लॉगिन सिस्टीम आहे जेणेकरून तुम्हाला सर्व स्तरांचे अधिकार (Permissions) तपासता येतील.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
