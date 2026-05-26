import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

let cachedAccessToken: string | null = null;
let currentSessionUser: User | null = null;

export const requireAuthAction = (callback: Function) => {
  if (!currentSessionUser) {
    window.dispatchEvent(new Event('trigger-action-login'));
    return;
  }
  callback();
};

export const initAuth = (
  onAuthSuccess?: (user: User, token?: string | null) => void,
  onAuthFailure?: () => void
) => {
  if (!supabase) {
    if (onAuthFailure) onAuthFailure();
    return () => {};
  }
  
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session?.user) {
      cachedAccessToken = session.access_token;
      currentSessionUser = session.user;
      if (onAuthSuccess) onAuthSuccess(session.user, cachedAccessToken);
    } else {
      cachedAccessToken = null;
      currentSessionUser = null;
      if (onAuthFailure) onAuthFailure();
    }
  });

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      cachedAccessToken = session.access_token;
      currentSessionUser = session.user;
      if (onAuthSuccess) onAuthSuccess(session.user, cachedAccessToken);
    } else {
      cachedAccessToken = null;
      currentSessionUser = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
  
  return () => subscription.unsubscribe();
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  if (!supabase) throw new Error("Supabase is not configured.");
  
  const redirectUrl = (window.location.origin === "null" || !window.location.origin)
    ? undefined
    : window.location.origin;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl
    }
  });
  
  if (error) throw error;
  // Note: OAuth often redirects, so this won't return immediately if redirecting.
  // In a popup environment we'd use skipBrowserRedirect or popup, but supabase-js v2
  // manages its own flow. We'll return null for the initial call, state change will catch it.
  return null;
};

export const emailSignUp = async (email: string, password: string, displayName: string) => {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      }
    }
  });
  if (error) throw error;
  return data;
};

export const emailSignIn = async (email: string, password: string) => {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  if (!supabase) return;
  await supabase.auth.signOut();
  cachedAccessToken = null;
};
