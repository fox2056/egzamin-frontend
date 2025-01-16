import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Footer } from './Footer';
import { useAuth } from '@/contexts/AuthContext';
import { getUserAvatar } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, logout } = useAuth();

  const { data: avatarUrl } = useQuery({
    queryKey: ['avatar', user?.id],
    queryFn: () => user?.id ? getUserAvatar(user.id) : null,
    enabled: !!user?.id,
  });

  const navigation = [
    { href: '/', label: 'Strona główna' },
    { href: '/disciplines', label: 'Przedmioty' },
    { href: '/questions', label: 'Pytania' },
    { href: '/questions/import', label: 'Import Pytań' },
    { href: '/tests/new', label: 'Rozpocznij Test' },
  ];

  const handleLogout = () => {
    logout();
  };

  const NavLinks = () => (
    <>
      {navigation.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "transition-colors hover:text-foreground/80",
            location.pathname === item.href
              ? "text-foreground font-semibold"
              : "text-foreground/60"
          )}
          onClick={() => setIsOpen(false)}
        >
          {item.label}
        </Link>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-bold">System Egzaminacyjny</span>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] sm:w-[300px]">
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Nawigacja systemu egzaminacyjnego
                </SheetDescription>
                <nav className="flex flex-col space-y-4 mt-6">
                  <NavLinks />
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Wyloguj się
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>

            {/* Desktop Menu */}
            <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
              <NavLinks />
            </nav>

            {/* User Menu */}
            <div className="hidden lg:flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={avatarUrl || user?.avatar} 
                        alt={user?.name} 
                        className="object-cover"
                      />
                      <AvatarFallback>{user?.name?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Wyloguj się</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-4 sm:p-6">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout; 