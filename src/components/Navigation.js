'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, Car, Users, Calendar, 
  AlertTriangle, Settings, Shield 
} from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  
  if (pathname === '/admin' || pathname === '/security') {
    return null;
  }

  const isAdmin = typeof window !== 'undefined' && 
    (localStorage.getItem('adminAuthenticated') === 'true' || 
     localStorage.getItem('securityAuthenticated') === 'true');

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/checkin', icon: Car, label: 'Check In' },
    { href: '/retrieve', icon: Users, label: 'Retrieve' },
    { href: '/issues', icon: AlertTriangle, label: 'Issues' },
    { href: '/calendar', icon: Calendar, label: 'Calendar' },
  ];

  if (isAdmin) {
    navItems.push(
      { href: '/admin', icon: Settings, label: 'Admin' },
      { href: '/security', icon: Shield, label: 'Security' }
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 max-w-md mx-auto z-50">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center p-2 ${
                isActive ? 'text-parking-blue' : 'text-gray-600'
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}