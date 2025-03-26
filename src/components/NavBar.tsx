
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';
import { Menu, X, Sparkles, User, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const getInitials = () => {
    if (profile?.username) {
      return profile.username.substring(0, 2).toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/80 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/" className="flex items-center">
              <Sparkles className="h-6 w-6 text-primary mr-2" />
              <span className="text-xl font-mythical">Mythosphere</span>
            </Link>
          </motion.div>
          
          <div className="hidden md:flex items-center space-x-1">
            <NavLinks />
            <ThemeToggle />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm" className="ml-4">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
          
          <div className="md:hidden flex items-center">
            <ThemeToggle className="mr-2" />
            {user ? (
              <Link to="/profile" className="mr-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Link to="/auth" className="mr-2">
                <Button variant="outline" size="sm">
                  <LogIn className="h-4 w-4" />
                </Button>
              </Link>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
              className="focus:ring-0"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div 
          className="md:hidden bg-card/95 backdrop-blur-md shadow-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <MobileNavLinks />
              {user ? (
                <button 
                  onClick={() => signOut()} 
                  className="text-lg font-medium px-2 py-2 hover:text-primary transition-colors flex items-center"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign out
                </button>
              ) : (
                <Link to="/auth" className="text-lg font-medium px-2 py-2 hover:text-primary transition-colors flex items-center">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

const NavLinks: React.FC = () => {
  const location = useLocation();
  
  const links = [
    { to: "/", label: "Home" },
    { to: "/stories", label: "Stories" },
  ];
  
  return (
    <>
      {links.map((link) => (
        <Link to={link.to} key={link.to}>
          <Button 
            variant="ghost" 
            className={`relative ${location.pathname === link.to ? 'text-primary' : 'text-foreground'}`}
          >
            {link.label}
            {location.pathname === link.to && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" 
                layoutId="navbar-indicator"
              />
            )}
          </Button>
        </Link>
      ))}
    </>
  );
};

const MobileNavLinks: React.FC = () => {
  const links = [
    { to: "/", label: "Home" },
    { to: "/stories", label: "Stories" },
    { to: "/profile", label: "Profile" },
  ];
  
  return (
    <>
      {links.map((link) => (
        <Link to={link.to} key={link.to} className="text-lg font-medium px-2 py-2 hover:text-primary transition-colors">
          {link.label}
        </Link>
      ))}
    </>
  );
};

export default NavBar;
