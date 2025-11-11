-- Clean schema for Render PostgreSQL deployment

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    verified BOOLEAN DEFAULT false,
    profile_pic TEXT,
    reset_token TEXT,
    is_therapist BOOLEAN DEFAULT false,
    role VARCHAR(10) DEFAULT 'user'
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    category VARCHAR(50),
    is_anonymous BOOLEAN DEFAULT FALSE,
    photo TEXT,
    video TEXT,
    edited_at TIMESTAMP DEFAULT NULL
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) DEFAULT 'like',
    CONSTRAINT unique_reaction_per_post UNIQUE(user_id, post_id)
);

-- Create follows table
CREATE TABLE IF NOT EXISTS follows (
    id SERIAL PRIMARY KEY,
    follower_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_follow UNIQUE (follower_id, following_id)
);

-- Create communities table
CREATE TABLE IF NOT EXISTS communities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    member_count INTEGER DEFAULT 0,
    icon VARCHAR(10) NOT NULL,
    tags JSONB NOT NULL,
    is_joined BOOLEAN DEFAULT FALSE
);

-- Insert initial communities
INSERT INTO communities (name, description, member_count, icon, tags, is_joined)
VALUES
    ('Anxiety Support Circle', 'A safe space to share experiences, coping strategies, and encouragement for those managing anxiety.', 1247, '🧠', '["anxiety", "support", "cbt"]', true),
    ('Depression Warriors', 'You are not alone. Share your story, find hope, and connect with others walking the same path.', 893, '💙', '["depression", "hope", "peer-support"]', false),
    ('Mindful Living Group', 'Daily mindfulness, meditation tips, and gentle reminders to breathe and be present.', 2105, '🧘', '["mindfulness", "meditation", "calm"]', true),
    ('PTSD Healing Space', 'Trauma-informed support group for survivors. Trigger warnings enabled. Moderated 24/7.', 568, '🛡️', '["ptsd", "trauma", "safe-space"]', false)
ON CONFLICT DO NOTHING;

-- Create badge_types table
CREATE TABLE IF NOT EXISTS badge_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial badge types
INSERT INTO badge_types (name, description, image_url) VALUES
    ('Cheerleader', 'Give 20 likes or reactions', '/uploads/badges/cheerleader.png'),
    ('Popular', 'Receive 50 comments on your posts', '/uploads/badges/popular.png'),
    ('Supportive Soul', 'Leave 20 comments on other people''s posts', '/uploads/badges/supportive_soul.png'),
    ('Story Teller', 'Write 10 posts', '/uploads/badges/story_teller.png')
ON CONFLICT (name) DO NOTHING;

-- Create user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id INTEGER NOT NULL REFERENCES badge_types(id) ON DELETE CASCADE,
    awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, badge_id)
);

-- Create messages table (for community chat)
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    community_id INTEGER NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMPTZ DEFAULT NULL
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    type VARCHAR(50),
    reference_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create delete_tokens table
CREATE TABLE IF NOT EXISTS delete_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    confirmed BOOLEAN DEFAULT FALSE
);

-- Create therapist_certifications table
CREATE TABLE IF NOT EXISTS therapist_certifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT NOW()
);

-- Create private_conversations table
CREATE TABLE IF NOT EXISTS private_conversations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    therapist_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    last_message_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, therapist_id)
);

-- Create private_messages table
CREATE TABLE IF NOT EXISTS private_messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER NOT NULL REFERENCES private_conversations(id) ON DELETE CASCADE,
    sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    edited_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN DEFAULT false,
    is_edited BOOLEAN DEFAULT false
);

-- Success message
SELECT 'Database schema created successfully!' AS status;
