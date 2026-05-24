import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useRealtimeNotifications(userId: string | undefined, onNotification: (payload: any) => void) {
  useEffect(() => {
    if (!supabase || !userId) return;

    // Listen to new comments on the user's posts
    // Note: In Supabase Dashboard, you must enable Realtime for the 'comments' and 'post_likes' tables
    const channel = supabase
      .channel('realtime_notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments' },
        (payload) => {
          onNotification({ type: 'comment', data: payload.new });
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'post_likes' },
        (payload) => {
          onNotification({ type: 'like', data: payload.new });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, onNotification]);
}
