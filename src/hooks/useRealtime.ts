import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useRealtimeNotifications(userId: string | undefined, onNotification: (payload: any) => void) {
  useEffect(() => {
    if (!supabase || !userId) return;

    // Listen to new notifications for the current user
    const channel = supabase
      .channel(`realtime_notifications_${userId}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          onNotification(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, onNotification]);
}
