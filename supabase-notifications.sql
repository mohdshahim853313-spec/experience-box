-- Supabase SQL Script for Notifications Table & Triggers

-- 1. Create Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- User who receives the notification
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- User who did the action
    actor_name TEXT, -- Fallback for anonymous or deleted users
    actor_avatar TEXT,
    type TEXT NOT NULL, -- 'like', 'comment', 'follow', 'new_post'
    post_id TEXT REFERENCES public.experiences(id) ON DELETE CASCADE, -- The post this relates to
    content TEXT, -- Auto-generated message or comment snippet
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can read their own notifications
CREATE POLICY "Users can read their own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

-- Users can update (mark as read) their own notifications
CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their notifications
CREATE POLICY "Users can delete their own notifications"
ON public.notifications FOR DELETE
USING (auth.uid() = user_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- 3. Triggers for Automatic Notifications
-- (A) When someone comments on a post
CREATE OR REPLACE FUNCTION handle_new_comment_notification()
RETURNS TRIGGER AS $$
DECLARE
    post_author UUID;
    post_title TEXT;
BEGIN
    -- Get the author and title of the post
    SELECT creator_id, title INTO post_author, post_title FROM public.experiences WHERE id = NEW.post_id;
    
    -- Don't notify if the user commented on their own post
    IF post_author != NEW.user_id AND post_author IS NOT NULL THEN
        INSERT INTO public.notifications (user_id, actor_id, actor_name, actor_avatar, type, post_id, content)
        VALUES (
            post_author, 
            NEW.user_id, 
            NEW.user_name, 
            'https://api.dicebear.com/7.x/notionists/svg?seed=' || COALESCE(NEW.user_id::text, NEW.user_name, 'Anon'), 
            'comment', 
            NEW.post_id, 
            'commented on your post: ' || substring(post_title from 1 for 30) || '...'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_new_comment ON public.comments;
CREATE TRIGGER on_new_comment
    AFTER INSERT ON public.comments
    FOR EACH ROW EXECUTE PROCEDURE handle_new_comment_notification();


-- (B) When someone likes a post
CREATE OR REPLACE FUNCTION handle_new_like_notification()
RETURNS TRIGGER AS $$
DECLARE
    post_author UUID;
    post_title TEXT;
    liker_name TEXT;
BEGIN
    SELECT creator_id, title INTO post_author, post_title FROM public.experiences WHERE id = NEW.post_id;
    SELECT username INTO liker_name FROM public.profiles WHERE id = NEW.user_id;

    IF post_author != NEW.user_id AND post_author IS NOT NULL THEN
        INSERT INTO public.notifications (user_id, actor_id, actor_name, actor_avatar, type, post_id, content)
        VALUES (
            post_author, 
            NEW.user_id, 
            COALESCE(liker_name, 'Someone'), 
            'https://api.dicebear.com/7.x/notionists/svg?seed=' || NEW.user_id::text, 
            'like', 
            NEW.post_id, 
            'liked your post: ' || substring(post_title from 1 for 30) || '...'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_new_like ON public.post_likes;
CREATE TRIGGER on_new_like
    AFTER INSERT ON public.post_likes
    FOR EACH ROW EXECUTE PROCEDURE handle_new_like_notification();

