import React from 'react';
import { TabType } from '../types';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

interface NavItem {
  id: TabType;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: 'water_drop' },
  { id: 'trends', label: 'Trends', icon: 'monitoring' },
  { id: 'friends', label: 'Friends', icon: 'group' },
  { id: 'challenges', label: 'Challenges', icon: 'trophy' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-[#e7eeff]/80 glass shadow-[0_-1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 px-4 flex items-center justify-around max-w-md mx-auto sm:max-w-xl">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors duration-200 cursor-pointer ${
                isActive ? 'text-[#00677f]' : 'text-[#3c494e] hover:text-[#00677f]'
              }`}
            >
              <span
                className="material-symbols-outlined text-2xl"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="font-['Inter'] text-[12px] font-semibold tracking-wider">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
