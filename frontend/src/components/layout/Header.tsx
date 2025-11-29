import React, { useState, useEffect } from 'react';
import { Bell, Search, Menu, X, Calendar, Mail } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: 'dashboard' | 'consulting') => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (page: 'dashboard' | 'consulting') => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  const handleContactClick = () => {
    window.location.href = 'mailto:support@tresidus.com';
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-md py-4'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => handleNavClick('dashboard')}>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <img 
                src="/tresidus-logo.png" 
                alt="Tresidus Logo" 
                className="h-12 w-12"
              />
            </div>
            <img 
              src="/tresidus-name.png" 
              alt="Tresidus" 
              className="ml-3 h-16"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => handleNavClick('consulting')}
              className={`nav-link flex items-center ${currentPage === 'consulting' ? 'active' : ''}`}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Consulting
            </button>
            <a href="#projects" className="nav-link">
              Projects
            </a>
            <button
              onClick={handleContactClick}
              className="nav-link flex items-center"
            >
              <Mail className="h-4 w-4 mr-1" />
              Contact
            </button>
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              className="rounded-full p-2 text-navy-600 hover:bg-navy-100 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              className="rounded-full p-2 text-navy-600 hover:bg-navy-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>
            <div className="h-8 w-8 rounded-full bg-teal-500 text-white flex items-center justify-center overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="User Avatar" 
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden rounded-full p-2 text-navy-600 hover:bg-navy-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 flex flex-col space-y-2">
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`nav-link text-left ${currentPage === 'dashboard' ? 'active' : ''}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => handleNavClick('consulting')}
              className={`nav-link text-left flex items-center ${currentPage === 'consulting' ? 'active' : ''}`}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Consulting
            </button>
            <a href="#projects" className="nav-link">
              Projects
            </a>
            <button
              onClick={handleContactClick}
              className="nav-link text-left flex items-center"
            >
              <Mail className="h-4 w-4 mr-1" />
              Contact
            </button>
            <div className="flex items-center space-x-4 pt-2">
              <button
                className="rounded-full p-2 text-navy-600 hover:bg-navy-100 transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <button
                className="rounded-full p-2 text-navy-600 hover:bg-navy-100 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
              </button>
              <div className="h-8 w-8 rounded-full bg-teal-500 text-white flex items-center justify-center overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="User Avatar" 
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;