"use client";

import React from 'react';
import { Menu, Users, LayoutGrid } from "lucide-react";
import { cn } from '@/lib/utils';

interface MenuItem {
  name: string;
  icon: any;
  onClick: () => void;
}

interface BottomMenuProps {
  handleMenu: () => void;
  handleGridCount: () => void;
  router: any;
}

const BottomMenu: React.FC<BottomMenuProps> = ({ handleMenu, handleGridCount, router }) => {
  const menuItems: MenuItem[] = [
    {
      name: "Menu",
      icon: Menu,
      onClick: handleMenu,
    },
    {
      name: "Layout",
      icon: LayoutGrid,
      onClick: handleGridCount,
    },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center gap-1.5 rounded-full bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 p-1.5 shadow-2xl">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="flex items-center gap-2 py-2.5 px-5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-all group"
            onClick={item.onClick}
          >
            <item.icon className="text-lg group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-black uppercase tracking-widest">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomMenu;
