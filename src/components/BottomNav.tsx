"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Utensils, Dumbbell, TrendingUp, BookOpen } from 'lucide-react';
import { clsx } from 'clsx';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/diet', icon: Utensils, label: 'Diet' },
    { href: '/workout', icon: Dumbbell, label: 'Workout' },
    { href: '/exercises', icon: BookOpen, label: 'Library' },
    { href: '/progress', icon: TrendingUp, label: 'Progress' },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-gray-950 border-t border-gray-800 px-6 py-3 z-50">
      <ul className="flex justify-between items-center w-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link 
                href={item.href} 
                className={clsx(
                  "flex flex-col items-center justify-center gap-1 transition-colors",
                  isActive ? "text-fitness-green" : "text-gray-500 hover:text-gray-300"
                )}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
