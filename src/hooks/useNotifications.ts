import { useEffect, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { addNotification } from '@/store/slices/notificationSlice';

export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const { accessToken, isAuthenticated } = useAppSelector((state) => state.auth);
  const { user } = useAppSelector((state) => state.userData);
  const socketRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    // ONLY connect if we have a token and are authenticated
    if (!accessToken || !isAuthenticated) {
      console.log('🔇 WebSocket: Not authenticated or token missing. Skipping connection.');
      return;
    }
    
    // Don't connect if already connecting or open
    if (socketRef.current?.readyState === WebSocket.OPEN || socketRef.current?.readyState === WebSocket.CONNECTING) {
      console.log('✅ WebSocket: Already active or connecting.');
      return;
    }

    const envWsUrl = process.env.NEXT_PUBLIC_WS_URL;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    // RESTORED: Using query parameter as per your specific endpoint reminder
    const wsUrl = `${envWsUrl}/ws/notifications?token=${accessToken}`;

    console.log('--- 🚀 WebSocket: Initializing Connection ---');
    console.log('URL:', wsUrl);

    try {
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log(' WebSocket Connected successfully with JWT');
      };

      socket.onmessage = (event) => {
        console.log('WebSocket: Data received');
        try {
          const data = JSON.parse(event.data);
          dispatch(addNotification(data));
        } catch (error) {
          console.error('❌ WebSocket: Parse error:', error);
        }
      };

      socket.onerror = (error) => {
        console.error(' WebSocket Error:', error);
      };

      socket.onclose = () => {
        console.log('🔌 WebSocket Connection Closed');
        socketRef.current = null;
        
        // Reconnect if authenticated
        if (isAuthenticated && accessToken) {
          console.log('🔄 Reconnecting in 5s...');
          setTimeout(() => connect(), 5000);
        }
      };

      socketRef.current = socket;
    } catch (err) {
      console.error('❌ WebSocket Initialization failed:', err);
    }
  }, [accessToken, isAuthenticated, user, dispatch]);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      connect();
    }

    return () => {
      if (socketRef.current) {
        console.log('🧹 Cleaning up socket...');
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated, accessToken, connect]);
};
