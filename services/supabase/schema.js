// Описание схемы базы данных Supabase
import { DATABASE_TABLES } from '../../constants.js';

/**
 * Схема базы данных приложения "Секретарь+"
 */
export const DATABASE_SCHEMA = {
    // Таблица профилей пользователей
    [DATABASE_TABLES.PROFILES]: {
        table: 'profiles',
        columns: {
            id: { type: 'uuid', primary: true, references: 'auth.users(id)' },
            email: { type: 'text', unique: true, notNull: true },
            name: { type: 'text' },
            avatar_url: { type: 'text' },
            role: { type: 'user_role', default: 'user' },
            created_at: { type: 'timestamptz', default: 'now()' },
            updated_at: { type: 'timestamptz', default: 'now()' }
        },
        indexes: ['email', 'role'],
        rls: true
    },

    // Таблица настроек пользователей
    [DATABASE_TABLES.USER_SETTINGS]: {
        table: 'user_settings',
        columns: {
            id: { type: 'uuid', primary: true, default: 'gen_random_uuid()' },
            user_id: { type: 'uuid', references: 'auth.users(id)', unique: true },
            settings: { type: 'jsonb', default: '{}' },
            created_at: { type: 'timestamptz', default: 'now()' },
            updated_at: { type: 'timestamptz', default: 'now()' }
        },
        indexes: ['user_id'],
        rls: true
    },

    // Таблица сессий
    [DATABASE_TABLES.SESSIONS]: {
        table: 'sessions',
        columns: {
            id: { type: 'uuid', primary: true, default: 'gen_random_uuid()' },
            user_id: { type: 'uuid', references: 'auth.users(id)' },
            session_data: { type: 'jsonb', default: '{}' },
            expires_at: { type: 'timestamptz' },
            created_at: { type: 'timestamptz', default: 'now()' }
        },
        indexes: ['user_id', 'expires_at'],
        rls: true
    },

    // Таблица истории чата
    [DATABASE_TABLES.CHAT_HISTORY]: {
        table: 'chat_history',
        columns: {
            id: { type: 'uuid', primary: true, default: 'gen_random_uuid()' },
            user_id: { type: 'uuid', references: 'auth.users(id)' },
            session_id: { type: 'text' },
            message_type: { type: 'text', notNull: true },
            sender: { type: 'text', notNull: true },
            content: { type: 'text', notNull: true },
            attachments: { type: 'jsonb', default: '[]' },
            metadata: { type: 'jsonb', default: '{}' },
            created_at: { type: 'timestamptz', default: 'now()' }
        },
        indexes: ['user_id', 'session_id', 'created_at'],
        rls: true
    },

    // Таблица долговременной памяти чата
    [DATABASE_TABLES.CHAT_MEMORY]: {
        table: 'chat_memory',
        columns: {
            id: { type: 'uuid', primary: true, default: 'gen_random_uuid()' },
            user_id: { type: 'uuid', references: 'auth.users(id)' },
            memory_key: { type: 'text', notNull: true },
            memory_value: { type: 'text', notNull: true },
            importance: { type: 'integer', default: 1 },
            created_at: { type: 'timestamptz', default: 'now()' },
            updated_at: { type: 'timestamptz', default: 'now()' }
        },
        indexes: ['user_id', 'memory_key'],
        rls: true
    },

    // Таблица статистики действий
    [DATABASE_TABLES.ACTION_STATS]: {
        table: 'action_stats',
        columns: {
            id: { type: 'uuid', primary: true, default: 'gen_random_uuid()' },
            user_id: { type: 'uuid', references: 'auth.users(id)' },
            action: { type: 'text', notNull: true },
            service: { type: 'text', notNull: true },
            metadata: { type: 'jsonb', default: '{}' },
            created_at: { type: 'timestamptz', default: 'now()' }
        },
        indexes: ['user_id', 'action', 'created_at'],
        rls: true
    },

    // Таблица событий календаря
    [DATABASE_TABLES.CALENDAR_EVENTS]: {
        table: 'calendar_events',
        columns: {
            id: { type: 'uuid', primary: true, default: 'gen_random_uuid()' },
            user_id: { type: 'uuid', references: 'auth.users(id)' },
            google_event_id: { type: 'text', unique: true },
            title: { type: 'text', notNull: true },
            description: { type: 'text' },
            start_time: { type: 'timestamptz', notNull: true },
            end_time: { type: 'timestamptz', notNull: true },
            location: { type: 'text' },
            attendees: { type: 'jsonb', default: '[]' },
            meet_link: { type: 'text' },
            event_type: { type: 'text' },
            all_day: { type: 'boolean', default: false },
            color: { type: 'text' },
            reminders: { type: 'jsonb', default: '{}' },
            created_at: { type: 'timestamptz', default: 'now()' },
            updated_at: { type: 'timestamptz', default: 'now()' }
        },
        indexes: ['user_id', 'google_event_id', 'start_time'],
        rls: true
    },

    // Таблица контактов
    [DATABASE_TABLES.CONTACTS]: {
        table: 'contacts',
        columns: {
            id: { type: 'uuid', primary: true, default: 'gen_random_uuid()' },
            user_id: { type: 'uuid', references: 'auth.users(id)' },
            google_contact_id: { type: 'text' },
            name: { type: 'text', notNull: true },
            emails: { type: 'jsonb', default: '[]' },
            phones: { type: 'jsonb', default: '[]' },
            company: { type: 'text' },
            job_title: { type: 'text' },
            avatar_url: { type: 'text' },
            contact_type: { type: 'contact_type', default: 'personal' },
            groups: { type: 'jsonb', default: '[]' },
            address: { type: 'jsonb' },
            notes: { type: 'text' },
            metadata: { type: 'jsonb', default: '{}' },
            created_at: { type: 'timestamptz', default: 'now()' },
            updated_at: { type: 'timestamptz', default: 'now()' }
        },
        indexes: ['user_id', 'google_contact_id'],
        rls: true
    },

    // Таблица файлов
    [DATABASE_TABLES.FILES]: {
        table: 'files',
        columns: {
            id: { type: 'uuid', primary: true, default: 'gen_random_uuid()' },
            user_id: { type: 'uuid', references: 'auth.users(id)' },
            google_file_id: { type: 'text' },
            name: { type: 'text', notNull: true },
            file_type: { type: 'text', notNull: true },
            mime_type: { type: 'text', notNull: true },
            size: { type: 'bigint', notNull: true },
            url: { type: 'text' },
            thumbnail_url: { type: 'text' },
            parent_folder_id: { type: 'text' },
            created_at: { type: 'timestamptz', default: 'now()' },
            modified_at: { type: 'timestamptz', default: 'now()' },
            tags: { type: 'jsonb', default: '[]' },
            metadata: { type: 'jsonb', default: '{}' }
        },
        indexes: ['user_id', 'google_file_id'],
        rls: true
    },

    // Таблица задач
    [DATABASE_TABLES.TASKS]: {
        table: 'tasks',
        columns: {
            id: { type: 'uuid', primary: true, default: 'gen_random_uuid()' },
            user_id: { type: 'uuid', references: 'auth.users(id)' },
            google_task_id: { type: 'text' },
            title: { type: 'text', notNull: true },
            description: { type: 'text' },
            status: { type: 'task_status', default: 'pending' },
            priority: { type: 'task_priority', default: 'medium' },
            due_date: { type: 'timestamptz' },
            completed_at: { type: 'timestamptz' },
            tags: { type: 'jsonb', default: '[]' },
            parent_task_id: { type: 'uuid', references: 'tasks(id)' },
            metadata: { type: 'jsonb', default: '{}' },
            created_at: { type: 'timestamptz', default: 'now()' },
            updated_at: { type: 'timestamptz', default: 'now()' }
        },
        indexes: ['user_id', 'google_task_id', 'status', 'due_date'],
        rls: true
    },

    // Таблица писем
    [DATABASE_TABLES.EMAILS]: {
        table: 'emails',
        columns: {
            id: { type: 'uuid', primary: true, default: 'gen_random_uuid()' },
            user_id: { type: 'uuid', references: 'auth.users(id)' },
            google_email_id: { type: 'text' },
            subject: { type: 'text', notNull: true },
            from_email: { type: 'text', notNull: true },
            to_emails: { type: 'jsonb', default: '[]' },
            cc_emails: { type: 'jsonb', default: '[]' },
            bcc_emails: { type: 'jsonb', default: '[]' },
            body: { type: 'text' },
            attachments: { type: 'jsonb', default: '[]' },
            date: { type: 'timestamptz', notNull: true },
            is_read: { type: 'boolean', default: false },
            labels: { type: 'jsonb', default: '[]' },
            thread_id: { type: 'text' },
            created_at: { type: 'timestamptz', default: 'now()' }
        },
        indexes: ['user_id', 'google_email_id', 'date'],
        rls: true
    },

    // Таблица заметок
    [DATABASE_TABLES.NOTES]: {
        table: 'notes',
        columns: {
            id: { type: 'uuid', primary: true, default: 'gen_random_uuid()' },
            user_id: { type: 'uuid', references: 'auth.users(id)' },
            title: { type: 'text', notNull: true },
            content: { type: 'text', notNull: true },
            note_type: { type: 'note_type', default: 'text' },
            tags: { type: 'jsonb', default: '[]' },
            is_pinned: { type: 'boolean', default: false },
            color: { type: 'text' },
            metadata: { type: 'jsonb', default: '{}' },
            created_at: { type: 'timestamptz', default: 'now()' },
            updated_at: { type: 'timestamptz', default: 'now()' }
        },
        indexes: ['user_id', 'is_pinned'],
        rls: true
    },

    // Таблица общих ключей Gemini
    [DATABASE_TABLES.SHARED_GEMINI_KEYS]: {
        table: 'shared_gemini_keys',
        columns: {
            id: { type: 'uuid', primary: true, default: 'gen_random_uuid()' },
            key_name: { type: 'text', notNull: true },
            api_key: { type: 'text', notNull: true },
            is_active: { type: 'boolean', default: true },
            quota: { type: 'integer' },
            used_quota: { type: 'integer', default: 0 },
            last_used: { type: 'timestamptz' },
            created_by: { type: 'uuid', references: 'auth.users(id)' },
            created_at: { type: 'timestamptz', default: 'now()' }
        },
        indexes: ['is_active'],
        rls: true
    },

    // Таблица общих прокси-серверов
    [DATABASE_TABLES.SHARED_PROXIES]: {
        table: 'shared_proxies',
        columns: {
            id: { type: 'uuid', primary: true, default: 'gen_random_uuid()' },
            proxy_url: { type: 'text', notNull: true },
            username: { type: 'text' },
            password: { type: 'text' },
            is_active: { type: 'boolean', default: true },
            priority: { type: 'integer', default: 5 },
            last_tested: { type: 'timestamptz' },
            is_working: { type: 'boolean', default: true },
            created_by: { type: 'uuid', references: 'auth.users(id)' },
            created_at: { type: 'timestamptz', default: 'now()' }
        },
        indexes: ['is_active', 'priority'],
        rls: true
    }
};

/**
 * Пользовательские типы данных
 */
export const CUSTOM_TYPES = {
    user_role: ['owner', 'admin', 'user'],
    sync_status: ['idle', 'syncing', 'success', 'error', 'paused'],
    task_priority: ['low', 'medium', 'high', 'urgent'],
    task_status: ['pending', 'in_progress', 'completed', 'cancelled'],
    contact_type: ['personal', 'work', 'family', 'other'],
    note_type: ['text', 'list', 'drawing', 'voice'],
    notification_type: ['success', 'error', 'warning', 'info']
};

/**
 * Индексы для оптимизации запросов
 */
export const INDEXES = {
    profiles: [
        { name: 'idx_profiles_email', columns: ['email'] },
        { name: 'idx_profiles_role', columns: ['role'] }
    ],
    user_settings: [
        { name: 'idx_user_settings_user_id', columns: ['user_id'] }
    ],
    sessions: [
        { name: 'idx_sessions_user_id', columns: ['user_id'] },
        { name: 'idx_sessions_expires_at', columns: ['expires_at'] }
    ],
    chat_history: [
        { name: 'idx_chat_history_user_id', columns: ['user_id'] },
        { name: 'idx_chat_history_session_id', columns: ['session_id'] },
        { name: 'idx_chat_history_created_at', columns: ['created_at'] }
    ],
    chat_memory: [
        { name: 'idx_chat_memory_user_id', columns: ['user_id'] },
        { name: 'idx_chat_memory_key', columns: ['memory_key'] }
    ],
    action_stats: [
        { name: 'idx_action_stats_user_id', columns: ['user_id'] },
        { name: 'idx_action_stats_action', columns: ['action'] },
        { name: 'idx_action_stats_created_at', columns: ['created_at'] }
    ],
    calendar_events: [
        { name: 'idx_calendar_events_user_id', columns: ['user_id'] },
        { name: 'idx_calendar_events_google_event_id', columns: ['google_event_id'] },
        { name: 'idx_calendar_events_start_time', columns: ['start_time'] }
    ],
    contacts: [
        { name: 'idx_contacts_user_id', columns: ['user_id'] },
        { name: 'idx_contacts_google_contact_id', columns: ['google_contact_id'] }
    ],
    files: [
        { name: 'idx_files_user_id', columns: ['user_id'] },
        { name: 'idx_files_google_file_id', columns: ['google_file_id'] }
    ],
    tasks: [
        { name: 'idx_tasks_user_id', columns: ['user_id'] },
        { name: 'idx_tasks_google_task_id', columns: ['google_task_id'] },
        { name: 'idx_tasks_status', columns: ['status'] },
        { name: 'idx_tasks_due_date', columns: ['due_date'] }
    ],
    emails: [
        { name: 'idx_emails_user_id', columns: ['user_id'] },
        { name: 'idx_emails_google_email_id', columns: ['google_email_id'] },
        { name: 'idx_emails_date', columns: ['date'] }
    ],
    notes: [
        { name: 'idx_notes_user_id', columns: ['user_id'] },
        { name: 'idx_notes_is_pinned', columns: ['is_pinned'] }
    ],
    shared_gemini_keys: [
        { name: 'idx_shared_gemini_keys_is_active', columns: ['is_active'] }
    ],
    shared_proxies: [
        { name: 'idx_shared_proxies_is_active', columns: ['is_active'] },
        { name: 'idx_shared_proxies_priority', columns: ['priority'] }
    ]
};

/**
 * Политики безопасности RLS
 */
export const RLS_POLICIES = {
    profiles: [
        {
            name: 'Users can view own profile',
            operation: 'SELECT',
            condition: 'auth.uid() = id'
        },
        {
            name: 'Users can update own profile',
            operation: 'UPDATE',
            condition: 'auth.uid() = id'
        },
        {
            name: 'Admins can view all profiles',
            operation: 'SELECT',
            condition: 'EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN (\'owner\', \'admin\'))'
        }
    ],
    user_settings: [
        {
            name: 'Users can view own settings',
            operation: 'SELECT',
            condition: 'auth.uid() = user_id'
        },
        {
            name: 'Users can insert own settings',
            operation: 'INSERT',
            condition: 'auth.uid() = user_id'
        },
        {
            name: 'Users can update own settings',
            operation: 'UPDATE',
            condition: 'auth.uid() = user_id'
        }
    ],
    // ... остальные политики для каждой таблицы
};

/**
 * Утилиты для работы со схемой
 */
export class SchemaUtils {
    /**
     * Получение информации о таблице
     * @param {string} tableName - Название таблицы
     * @returns {Object} Информация о таблице
     */
    static getTableInfo(tableName) {
        return DATABASE_SCHEMA[tableName];
    }

    /**
     * Получение колонок таблицы
     * @param {string} tableName - Название таблицы
     * @returns {Object} Колонки таблицы
     */
    static getTableColumns(tableName) {
        const tableInfo = this.getTableInfo(tableName);
        return tableInfo ? tableInfo.columns : null;
    }

    /**
     * Проверка существования таблицы
     * @param {string} tableName - Название таблицы
     * @returns {boolean} Существует ли таблица
     */
    static tableExists(tableName) {
        return !!DATABASE_SCHEMA[tableName];
    }

    /**
     * Получение всех названий таблиц
     * @returns {Array} Массив названий таблиц
     */
    static getAllTableNames() {
        return Object.keys(DATABASE_SCHEMA);
    }

    /**
     * Получение индексов таблицы
     * @param {string} tableName - Название таблицы
     * @returns {Array} Индексы таблицы
     */
    static getTableIndexes(tableName) {
        return INDEXES[tableName] || [];
    }

    /**
     * Проверка, включен ли RLS для таблицы
     * @param {string} tableName - Название таблицы
     * @returns {boolean} Включен ли RLS
     */
    static hasRLS(tableName) {
        const tableInfo = this.getTableInfo(tableName);
        return tableInfo ? tableInfo.rls : false;
    }
}

export default DATABASE_SCHEMA; 