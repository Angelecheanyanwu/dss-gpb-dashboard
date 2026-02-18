import { useEffect, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { addNotification } from '@/store/slices/notificationSlice';

export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const { accessToken, isAuthenticated } = useAppSelector((state) => state.auth);
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
    const fallbackWsUrl = apiUrl.replace(/^http/, 'ws');
    
    // Use the JWT Access Token in the URL
    const wsUrl = `${envWsUrl || fallbackWsUrl}/ws/notifications?token=${accessToken}`;

    console.log('--- 🚀 WebSocket: Initializing Connection ---');
    console.log('URL:', wsUrl);
    console.log('JWT Source: Auth State');
    console.log('Timestamp:', new Date().toISOString());

    try {
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log('✅ WebSocket: Connected successfully with JWT');
      };

      socket.onmessage = (event) => {
        console.log('📩 WebSocket: Data received');
        try {
          const data = JSON.parse(event.data);
          if (data.event_type === 'poi_detection') {
            console.log(`🎯 Detection Alert [${data.classification || 'Simple'}]:`, data.person_name);
            console.log('Data:', data);
            dispatch(addNotification(data));
          }
        } catch (error) {
          console.error('❌ WebSocket: Parse error:', error);
        }
      };

      socket.onerror = (error) => {
        console.error('❌ WebSocket: Connection error. Verify JWT validity and server status.');
      };

      socket.onclose = (event) => {
        console.log(`🔌 WebSocket: Connection Closed (${event.code}).`);
        socketRef.current = null;
        
        // Only attempt reconnect if still authenticated
        if (isAuthenticated && accessToken) {
          console.log('🔄 WebSocket: Reconnecting in 5s...');
          setTimeout(() => connect(), 5000);
        }
      };

      socketRef.current = socket;
    } catch (err) {
      console.error('❌ WebSocket: Initialization failed:', err);
    }
  }, [accessToken, isAuthenticated, dispatch]);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      connect();
    }

    // Cleanup: Close socket on unmount or when auth state changes
    return () => {
      if (socketRef.current) {
        console.log('🧹 WebSocket: Cleaning up connection...');
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated, accessToken, connect]);
};
