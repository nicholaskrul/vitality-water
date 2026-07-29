import React from 'react';
import { TabType } from '../types';
import { LOGO_URL } from '../data';

interface HeaderProps {
  activeTab: TabType;
  userAvatar: string;
  onAvatarClick: () => void;
}

const TAB_TITLES: Record<TabType, string> = {
  home: 'Home',
  trends: 'Trends',
  friends: 'Friends',
  challenges: 'Challenges',
  settings: 'Settings',
};

export const Header: React.FC<HeaderProps> = ({ activeTab, userAvatar, onAvatarClick }) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#f9f9ff]/80 glass pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={LOGO_URL}
            alt="Vitality Water Logo"
            className="h-8 w-auto object-contain"
          />
          <span className="font-['Montserrat'] text-2xl font-bold text-[#00677f]">
            {TAB_TITLES[activeTab]}
          </span>
        </div>
        
        <button
          onClick={onAvatarClick}
          className="relative group transition-transform active:scale-95 focus:outline-none"
          title="Go to Settings"
        >
          <img
            src={userAvatar}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover border border-[#bbc9cf] shadow-sm hover:border-[#00677f]"
          />
        </button>
      </div>
    </header>
  );
};
