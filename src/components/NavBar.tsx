import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const NavBar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isTop = window.scrollY < 100;
      setScrolled(!isTop);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed w-full top-0 z-50 transition-all duration-300" style={{ backgroundColor: scrolled ? "rgba(9, 9, 11, 0.85)" : "transparent", backdropFilter: scrolled ? "blur(10px)" : "none" }}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="MythoAI Logo" className="h-8 w-8" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">MythoAI</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
          <Link to="/stories" className="text-sm font-medium hover:text-primary transition-colors">Stories</Link>
          <Link to="/community" className="text-sm font-medium hover:text-primary transition-colors">Community</Link>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="outline-none focus:outline-none rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback>{profile?.username?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mr-2">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => window.location.href = '/profile'}>Profile</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth" className="text-sm font-medium hover:text-primary transition-colors">Sign In</Link>
          )}
        </div>
        
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-gray-500 hover:text-primary focus:outline-none">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="bg-secondary/80 backdrop-blur-md absolute top-full left-0 w-full py-4 px-6 z-50">
          <div className="flex flex-col items-center space-y-4">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors" onClick={closeMobileMenu}>Home</Link>
            <Link to="/stories" className="text-sm font-medium hover:text-primary transition-colors" onClick={closeMobileMenu}>Stories</Link>
            <Link to="/community" className="text-sm font-medium hover:text-primary transition-colors" onClick={closeMobileMenu}>Community</Link>
            {user ? (
              <>
                <Link to="/profile" className="text-sm font-medium hover:text-primary transition-colors" onClick={closeMobileMenu}>Profile</Link>
                <button onClick={() => { signOut(); closeMobileMenu(); }} className="text-sm font-medium hover:text-primary transition-colors">Sign Out</button>
              </>
            ) : (
              <Link to="/auth" className="text-sm font-medium hover:text-primary transition-colors" onClick={closeMobileMenu}>Sign In</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
