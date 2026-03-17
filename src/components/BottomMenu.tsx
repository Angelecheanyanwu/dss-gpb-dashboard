"use client";

import React, { useState } from 'react';
import { Menu, LayoutGrid, X, Home, Users, Settings, FileText } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BottomMenuProps {
  handleMenu: () => void;
  handleGridCount: () => void;
  router: any;
}

const BottomMenu: React.FC<BottomMenuProps> = ({ handleMenu, handleGridCount, router }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Home",      icon: Home,     onClick: () => { router.push('/');          setMenuOpen(false); } },
    { name: "Personnel", icon: Users,    onClick: () => { router.push('/personnel'); setMenuOpen(false); } },
    { name: "Reports",   icon: FileText, onClick: () => { router.push('/reports');   setMenuOpen(false); } },
    { name: "Settings",  icon: Settings, onClick: () => { router.push('/settings');  setMenuOpen(false); } },
  ];

  // Spread items in a semicircular arc above the button
  const getArcPosition = (index: number, total: number) => {
    const startAngle = -155;
    const endAngle   = -25;
    const angle  = startAngle + (index / (total - 1)) * (endAngle - startAngle);
    const radius = 100;
    const rad    = (angle * Math.PI) / 180;
    return { x: Math.cos(rad) * radius, y: Math.sin(rad) * radius };
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
    handleMenu();
  };

  return (
    <>
      {/* Full-screen blur backdrop */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="menu-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Fan-out nav items */}
      <AnimatePresence>
        {menuOpen && navItems.map((item, i) => {
          const pos = getArcPosition(i, navItems.length);
          return (
            <motion.button
              key={item.name}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.3 }}
              animate={{ opacity: 1, x: pos.x, y: pos.y, scale: 1 }}
              exit={{ opacity: 0, x: 0, y: 0, scale: 0.3 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 22,
                delay: i * 0.05,
              }}
              onClick={item.onClick}
              // Anchored to the same center point as the bottom bar
              className="fixed bottom-[34px] left-1/2 z-50 -translate-x-1/2 flex flex-col items-center gap-1.5 group"
              style={{ marginLeft: '-20px' }}
            >
              {/* Icon circle — bigger, with glass bg */}
              <div className="w-14 h-14 rounded-2xl bg-white/95 border border-slate-100 shadow-xl flex items-center justify-center text-slate-700 group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:scale-110 transition-all duration-200">
                <item.icon className="h-6 w-6" strokeWidth={1.75} />
              </div>
            </motion.button>
          );
        })}
      </AnimatePresence>

      {/* Bottom pill bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-xl border-2 border-primary p-1.5 shadow-xl">

          {/* Menu / Close toggle — icon swaps, NO rotation */}
          <button
            className={cn(
              "flex items-center gap-2 py-2.5 px-5 rounded-full transition-all duration-200 group",
              menuOpen
                ? "bg-primary text-white"
                : "hover:bg-blue-50 text-slate-600 hover:text-primary"
            )}
            onClick={toggleMenu}
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.span
                  key="x"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.12 }}
                  className="flex items-center"
                >
                  <X className="h-4 w-4" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.12 }}
                  className="flex items-center"
                >
                  <Menu className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </motion.span>
              )}
            </AnimatePresence>
            <span className="text-[11px] font-black uppercase tracking-widest">
              {menuOpen ? 'Close' : 'Menu'}
            </span>
          </button>

          {/* Divider */}
          <div className="w-px h-5 bg-slate-200 mx-0.5" />

          {/* Layout */}
          <button
            className="flex items-center gap-2 py-2.5 px-5 rounded-full hover:bg-blue-50 text-slate-600 hover:text-primary transition-all group"
            onClick={handleGridCount}
          >
            <LayoutGrid className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-black uppercase tracking-widest">Layout</span>
          </button>

        </div>
      </div>
    </>
  );
};

export default BottomMenu;