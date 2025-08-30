-- Миграции базы данных для приложения "Секретарь+"
-- Выполните эти скрипты в Supabase SQL Editor

-- Включение расширений
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Создание пользовательских типов
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'user');
CREATE TYPE sync_status AS ENUM ('idle', 'syncing', 'success', 'error', 'paused');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
CREATE TYPE contact_type AS ENUM ('personal', 'work', 'family', 'other');
CREATE TYPE note_type AS ENUM ('text', 'list', 'drawing', 'voice');
CREATE TYPE notification_type AS ENUM ('success', 'error', 'warning', 'info');

-- Таблица профилей пользователей
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица настроек пользователей
CREATE TABLE user_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица сессий
CREATE TABLE sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_data JSONB DEFAULT '{}',
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица истории чата
CREATE TABLE chat_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT,
    message_type TEXT NOT NULL,
    sender TEXT NOT NULL,
    content TEXT NOT NULL,
    attachments JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица долговременной памяти чата
CREATE TABLE chat_memory (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    memory_key TEXT NOT NULL,
    memory_value TEXT NOT NULL,
    importance INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица статистики действий
CREATE TABLE action_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    service TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица событий календаря
CREATE TABLE calendar_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    google_event_id TEXT UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT,
    attendees JSONB DEFAULT '[]',
    meet_link TEXT,
    event_type TEXT,
    all_day BOOLEAN DEFAULT FALSE,
    color TEXT,
    reminders JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица контактов
CREATE TABLE contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    google_contact_id TEXT,
    name TEXT NOT NULL,
    emails JSONB DEFAULT '[]',
    phones JSONB DEFAULT '[]',
    company TEXT,
    job_title TEXT,
    avatar_url TEXT,
    contact_type contact_type DEFAULT 'personal',
    groups JSONB DEFAULT '[]',
    address JSONB,
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица файлов
CREATE TABLE files (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    google_file_id TEXT,
    name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size BIGINT NOT NULL,
    url TEXT,
    thumbnail_url TEXT,
    parent_folder_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    modified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    tags JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}'
);

-- Таблица задач
CREATE TABLE tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    google_task_id TEXT,
    title TEXT NOT NULL,
    description TEXT,
    status task_status DEFAULT 'pending',
    priority task_priority DEFAULT 'medium',
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    tags JSONB DEFAULT '[]',
    parent_task_id UUID REFERENCES tasks(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица писем
CREATE TABLE emails (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    google_email_id TEXT,
    subject TEXT NOT NULL,
    from_email TEXT NOT NULL,
    to_emails JSONB DEFAULT '[]',
    cc_emails JSONB DEFAULT '[]',
    bcc_emails JSONB DEFAULT '[]',
    body TEXT,
    attachments JSONB DEFAULT '[]',
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    labels JSONB DEFAULT '[]',
    thread_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица заметок
CREATE TABLE notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    note_type note_type DEFAULT 'text',
    tags JSONB DEFAULT '[]',
    is_pinned BOOLEAN DEFAULT FALSE,
    color TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица общих ключей Gemini
CREATE TABLE shared_gemini_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key_name TEXT NOT NULL,
    api_key TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    quota INTEGER,
    used_quota INTEGER DEFAULT 0,
    last_used TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица общих прокси-серверов
CREATE TABLE shared_proxies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    proxy_url TEXT NOT NULL,
    username TEXT,
    password TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    priority INTEGER DEFAULT 5,
    last_tested TIMESTAMP WITH TIME ZONE,
    is_working BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание индексов для оптимизации запросов
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX idx_chat_history_session_id ON chat_history(session_id);
CREATE INDEX idx_chat_history_created_at ON chat_history(created_at);
CREATE INDEX idx_chat_memory_user_id ON chat_memory(user_id);
CREATE INDEX idx_chat_memory_key ON chat_memory(memory_key);
CREATE INDEX idx_action_stats_user_id ON action_stats(user_id);
CREATE INDEX idx_action_stats_action ON action_stats(action);
CREATE INDEX idx_action_stats_created_at ON action_stats(created_at);
CREATE INDEX idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX idx_calendar_events_google_event_id ON calendar_events(google_event_id);
CREATE INDEX idx_calendar_events_start_time ON calendar_events(start_time);
CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_contacts_google_contact_id ON contacts(google_contact_id);
CREATE INDEX idx_files_user_id ON files(user_id);
CREATE INDEX idx_files_google_file_id ON files(google_file_id);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_google_task_id ON tasks(google_task_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_emails_user_id ON emails(user_id);
CREATE INDEX idx_emails_google_email_id ON emails(google_email_id);
CREATE INDEX idx_emails_date ON emails(date);
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_is_pinned ON notes(is_pinned);
CREATE INDEX idx_shared_gemini_keys_is_active ON shared_gemini_keys(is_active);
CREATE INDEX idx_shared_proxies_is_active ON shared_proxies(is_active);
CREATE INDEX idx_shared_proxies_priority ON shared_proxies(priority);

-- Включение Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_gemini_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_proxies ENABLE ROW LEVEL SECURITY;

-- Политики безопасности для profiles
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- Политики безопасности для user_settings
CREATE POLICY "Users can view own settings" ON user_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
    FOR UPDATE USING (auth.uid() = user_id);

-- Политики безопасности для sessions
CREATE POLICY "Users can manage own sessions" ON sessions
    FOR ALL USING (auth.uid() = user_id);

-- Политики безопасности для chat_history
CREATE POLICY "Users can view own chat history" ON chat_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat history" ON chat_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat history" ON chat_history
    FOR DELETE USING (auth.uid() = user_id);

-- Политики безопасности для chat_memory
CREATE POLICY "Users can manage own chat memory" ON chat_memory
    FOR ALL USING (auth.uid() = user_id);

-- Политики безопасности для action_stats
CREATE POLICY "Users can view own action stats" ON action_stats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own action stats" ON action_stats
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all action stats" ON action_stats
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- Политики безопасности для calendar_events
CREATE POLICY "Users can manage own calendar events" ON calendar_events
    FOR ALL USING (auth.uid() = user_id);

-- Политики безопасности для contacts
CREATE POLICY "Users can manage own contacts" ON contacts
    FOR ALL USING (auth.uid() = user_id);

-- Политики безопасности для files
CREATE POLICY "Users can manage own files" ON files
    FOR ALL USING (auth.uid() = user_id);

-- Политики безопасности для tasks
CREATE POLICY "Users can manage own tasks" ON tasks
    FOR ALL USING (auth.uid() = user_id);

-- Политики безопасности для emails
CREATE POLICY "Users can manage own emails" ON emails
    FOR ALL USING (auth.uid() = user_id);

-- Политики безопасности для notes
CREATE POLICY "Users can manage own notes" ON notes
    FOR ALL USING (auth.uid() = user_id);

-- Политики безопасности для shared_gemini_keys (только для админов)
CREATE POLICY "Admins can manage shared gemini keys" ON shared_gemini_keys
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- Политики безопасности для shared_proxies (только для админов)
CREATE POLICY "Admins can manage shared proxies" ON shared_proxies
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- Функции для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для автоматического обновления updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_memory_updated_at BEFORE UPDATE ON chat_memory
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON calendar_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Функция для создания профиля пользователя при регистрации
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, avatar_url, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.raw_user_meta_data->>'avatar_url',
        CASE 
            WHEN (SELECT COUNT(*) FROM public.profiles) = 0 THEN 'owner'
            ELSE 'user'
        END
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Триггер для автоматического создания профиля
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Функция для очистки старых сессий
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Создание cron job для очистки сессий (если используется pg_cron)
-- SELECT cron.schedule('cleanup-sessions', '0 2 * * *', 'SELECT cleanup_expired_sessions();');

-- Комментарии к таблицам
COMMENT ON TABLE profiles IS 'Профили пользователей приложения';
COMMENT ON TABLE user_settings IS 'Настройки пользователей';
COMMENT ON TABLE sessions IS 'Сессии пользователей';
COMMENT ON TABLE chat_history IS 'История чата';
COMMENT ON TABLE chat_memory IS 'Долговременная память чата';
COMMENT ON TABLE action_stats IS 'Статистика использования инструментов';
COMMENT ON TABLE calendar_events IS 'События календаря';
COMMENT ON TABLE contacts IS 'Контакты пользователей';
COMMENT ON TABLE files IS 'Файлы пользователей';
COMMENT ON TABLE tasks IS 'Задачи пользователей';
COMMENT ON TABLE emails IS 'Письма пользователей';
COMMENT ON TABLE notes IS 'Заметки пользователей';
COMMENT ON TABLE shared_gemini_keys IS 'Общие ключи API Gemini';
COMMENT ON TABLE shared_proxies IS 'Общие прокси-серверы'; 