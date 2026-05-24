-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT,
    email TEXT,
    bio TEXT,
    avatar_url TEXT,
    total_earnings NUMERIC DEFAULT 0,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Experiences Table
CREATE TABLE IF NOT EXISTS public.experiences (
    id TEXT PRIMARY KEY,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT,
    teaser TEXT,
    content TEXT,
    context_situation TEXT,
    what_was_tried TEXT,
    mistakes_made TEXT,
    final_outcome TEXT,
    secret_links TEXT,
    status TEXT DEFAULT 'published',
    category TEXT,
    price NUMERIC DEFAULT 0,
    is_anonymous BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Comments Table
CREATE TABLE IF NOT EXISTS public.comments (
    id BIGSERIAL PRIMARY KEY,
    post_id TEXT REFERENCES public.experiences(id) ON DELETE CASCADE,
    parent_id BIGINT,
    content TEXT NOT NULL,
    user_name TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    is_anonymous BOOLEAN DEFAULT false,
    likes_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Post Likes Table
CREATE TABLE IF NOT EXISTS public.post_likes (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    post_id TEXT REFERENCES public.experiences(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, post_id)
);

-- 5. Trigger for New User Profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, username, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'display_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

-- 7. Define RLS Policies
-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Experiences Policies
CREATE POLICY "Experiences are viewable by everyone." ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Users can insert their own experiences." ON public.experiences FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Users can update their own experiences." ON public.experiences FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Users can delete their own experiences." ON public.experiences FOR DELETE USING (auth.uid() = creator_id);

-- Comments & Likes Policies
CREATE POLICY "Comments are viewable by everyone." ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users can insert comments." ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id OR user_name IS NOT NULL);
CREATE POLICY "Users can update their own comments" ON public.comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Likes are viewable by everyone." ON public.post_likes FOR SELECT USING (true);
CREATE POLICY "Users can insert likes." ON public.post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own likes." ON public.post_likes FOR DELETE USING (auth.uid() = user_id);

-- 8. Enable Realtime Notifications (Replication)
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE public.comments, public.post_likes;
