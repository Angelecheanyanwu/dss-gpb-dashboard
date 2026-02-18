import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  event_type: string;
  camera_id: string;
  camera_type: string;
  camera_location: string;
  timestamp: string;
  person_id: string;
  person_name: string;
  confidence: number;
  bbox: [number, number, number, number];
  face_quality: number;
  tracking_id: string;
  frame_metadata: {
    frame_number: number;
    timestamp: number;
  };
  id: string; // Internal unique ID
  isRead: boolean;
  classification?: 'Simple' | 'Minor' | 'Serious' | 'Severe' | 'Grievous';
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'isRead'>>) => {
      const newNotification: Notification = {
        ...action.payload,
        id: Math.random().toString(36).substr(2, 9),
        isRead: false,
      };
      state.notifications.unshift(newNotification);
      state.unreadCount += 1;
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((n) => (n.isRead = true));
      state.unreadCount = 0;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount -= 1;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const { addNotification, markAllAsRead, markAsRead, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
