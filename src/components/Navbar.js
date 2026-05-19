'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Bed, CalendarCheck, CreditCard, FileBarChart } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Guests', href: '/guests', icon: Users },
  { name: 'Rooms', href: '/rooms', icon: Bed },
  { name: 'Bookings', href: '/bookings', icon: CalendarCheck },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Reports', href: '/reports', icon: FileBarChart },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="glass sticky top-0 z-50 w-full mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
              LuxeHotel
            </span>
          </div>
          <div className="flex items-center space-x-1 overflow-x-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
