import React, { useState, useEffect } from "react";
import { Layout } from "../components/layout/Layout";
import { Bell, Heart, MessageCircle, UserPlus, Star } from "lucide-react";
import { cn } from "../lib/utils";
import { useLocalStorage } from "../hooks/useShared";

type NotificationType = "like" | "comment" | "follow" | "mention";

interface Notification {
  id: string;
  type: NotificationType;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  time: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "like",
    user: { name: "Anjali Sharma", avatar: "A" },
    content: "liked your story 'A reality check on remote work'",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    type: "comment",
    user: { name: "Rahul Verma", avatar: "R" },
    content: "commented on your story 'The unspoken rules of the gym'",
    time: "5 hours ago",
    read: false,
  },
  {
    id: "3",
    type: "follow",
    user: { name: "Priya Patel", avatar: "P" },
    content: "started following you",
    time: "1 day ago",
    read: true,
  },
  {
    id: "4",
    type: "mention",
    user: { name: "Aman Gupta", avatar: "AG" },
    content: "mentioned you in a comment: '@mohdshahim you should read this!'",
    time: "2 days ago",
    read: true,
  },
  {
    id: "5",
    type: "like",
    user: { name: "Sneha Reddy", avatar: "SR" },
    content: "liked your comment on 'Why I quit my job at 25'",
    time: "3 days ago",
    read: true,
  }
];

export function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useLocalStorage<Notification[]>("expbox_notifications", []);
  const [user] = useLocalStorage("expbox_user_profile", { id: "11111111-1111-1111-1111-111111111111" });

  useEffect(() => {
    async function fetchNotifs() {
      if (!user?.id) return;
      const { supabase } = await import('../lib/supabase');
      if (supabase) {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          const mapped = data.map(n => ({
            id: n.id,
            type: n.type as NotificationType,
            user: {
              name: n.actor_name || "Someone",
              avatar: n.actor_avatar || "👤",
            },
            content: n.content,
            time: new Date(n.created_at).toLocaleDateString(),
            read: n.is_read || n.read || false,
          }));
          setNotifications(mapped);
        }
      } else {
        if (notifications.length === 0 && !localStorage.getItem("expbox_notifications_cleared")) {
          setNotifications(MOCK_NOTIFICATIONS);
        }
      }
    }
    
    fetchNotifs();
  }, [user?.id]);

  const clearNotifications = async () => {
    setNotifications([]);
    localStorage.setItem("expbox_notifications_cleared", "true");
    const { supabase } = await import('../lib/supabase');
    if (supabase && user?.id) {
       await supabase.from('notifications').delete().eq('user_id', user.id);
    }
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "like": return <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />;
      case "comment": return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case "follow": return <UserPlus className="w-4 h-4 text-emerald-500" />;
      case "mention": return <Star className="w-4 h-4 text-amber-500" />;
    }
  };

  const filteredNotifications = notifications.filter(n => filter === "all" || !n.read);

  const markAllAsRead = async () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    const { supabase } = await import('../lib/supabase');
    if (supabase && user?.id) {
       await supabase.from('notifications').update({ read: true, is_read: true }).eq('user_id', user.id).eq('read', false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto w-full px-4 sm:px-0">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2.5 rounded-full">
              <Bell className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
              <p className="text-slate-500 text-sm font-medium mt-0.5">Stay updated with your activities</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={markAllAsRead}
              className="text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Mark all as read
            </button>
            <button 
              onClick={clearNotifications}
              className="text-sm font-bold text-rose-600 hover:text-rose-700 hover:underline"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-slate-200 overflow-hidden bg-white/50">
          <div className="rounded-t-2xl flex border-b border-slate-100 bg-slate-50/80 p-2 gap-2">
            <button 
              onClick={() => setFilter("all")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                filter === "all" ? "bg-white shadow-sm text-indigo-600" : "bg-transparent text-slate-500 hover:text-slate-700"
              )}
            >
              All
            </button>
            <button 
              onClick={() => setFilter("unread")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
                filter === "unread" ? "bg-white shadow-sm text-indigo-600" : "bg-transparent text-slate-500 hover:text-slate-700"
              )}
            >
              Unread
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredNotifications.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-1">No notifications matched</h3>
                <p className="text-slate-500 text-sm">When you get notifications, they'll show up here.</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  onClick={async () => {
                     setNotifications(notifications.map(n => n.id === notification.id ? { ...n, read: true } : n));
                     const { supabase } = await import('../lib/supabase');
                     if (supabase && user?.id) {
                        await supabase.from('notifications').update({ read: true, is_read: true }).eq('id', notification.id);
                     }
                  }}
                  className={cn(
                    "p-4 flex gap-4 hover:bg-slate-50 transition-colors cursor-pointer group",
                    !notification.read ? "bg-indigo-50" : ""
                  )}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border border-white flex items-center justify-center font-bold text-indigo-700 flex-shrink-0">
                      {notification.user.avatar}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center">
                      {getIcon(notification.type)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <p className="text-sm text-slate-700">
                      <span className="font-bold text-slate-900">{notification.user.name}</span>{" "}
                      {notification.content}
                    </p>
                    <span className="text-xs font-medium text-slate-400 mt-1">{notification.time}</span>
                  </div>

                  {!notification.read && (
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 mt-2 flex-shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
