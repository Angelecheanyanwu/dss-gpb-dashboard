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
      <div className="flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-xl border-2 border-primary p-1.5 shadow-xl">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="flex items-center gap-2 py-2.5 px-5 rounded-full hover:bg-blue-50 text-slate-600 hover:text-primary transition-all group"
            onClick={item.onClick}
          >
            <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-black uppercase tracking-widest">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomMenu;
