'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { DEFAULT_NAV_ITEMS } from '@/types/auth';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, Search, ChevronDown } from "lucide-react";

export const Navbar = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const navItems = user ? DEFAULT_NAV_ITEMS[user.role] : DEFAULT_NAV_ITEMS.PUBLIC;

  const handleMenuClick = (href: string) => {
    setActiveMenu(activeMenu === href ? null : href);
  };

  const renderDesktopNav = () => (
    <div className="hidden md:flex space-x-4">
      <Link href="/" className="font-bold">
        Course Portal
      </Link>
      {navItems.map((item) => (
        <div key={item.href} className="relative">
          {item.children ? (
            <>
              <Button
                variant="ghost"
                onClick={() => handleMenuClick(item.href)}
                className={`${activeMenu === item.href ? 'bg-accent' : ''}`}
              >
                {item.title}
              </Button>
              {activeMenu === item.href && (
                <div className="absolute top-full left-0 mt-1 w-48 py-1 bg-background rounded-md shadow-lg border z-50">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-4 py-2 text-sm hover:bg-accent"
                      onClick={() => setActiveMenu(null)}
                    >
                      {child.title}
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <Link href={item.href}>
              <Button variant="ghost">{item.title}</Button>
            </Link>
          )}
        </div>
      ))}
    </div>
  );

  const renderMobileNav = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col space-y-4 mt-8">
          <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center">
            <span className="font-bold text-lg">Course Portal</span>
          </Link>
          {user && (
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <div key={item.href} className="space-y-3">
                  {item.children ? (
                    <>
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      <div className="pl-4 flex flex-col space-y-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
          {user && (
            <div className="pt-4 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  logout();
                  setIsOpen(false);
                  router.push('/');
                }}
              >
                退出登录
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('button')) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 container mx-auto">
        {renderMobileNav()}
        {renderDesktopNav()}

        <div className="ml-auto flex items-center space-x-4">
          <div className="relative hidden md:flex items-center">
            <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索课程..."
              className="w-[300px] pl-8"
            />
          </div>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.username}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/account/profile')}>
                  个人信息
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  logout();
                  router.push('/');
                }}>
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => router.push('/login')}
              >
                登录
              </Button>
              <Button
                onClick={() => router.push('/register')}
              >
                注册
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};