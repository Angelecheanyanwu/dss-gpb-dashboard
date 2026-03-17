"use client";

import { useAppSelector } from '@/store';

export const useUnreadCount = () => {
  const { notifications } = useAppSelector((state) => state.notifications);
  return notifications.filter((n) => !n.isRead).length;
};