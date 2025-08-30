// Конфигурация приложения
export const CONFIG = {
    // Supabase конфигурация
    SUPABASE: {
        URL: 'https://your-project.supabase.co', // Замените на ваш URL
        ANON_KEY: 'your-anon-key', // Замените на ваш ключ
    },
    
    // Google API конфигурация
    GOOGLE: {
        CLIENT_ID: 'your-google-client-id.apps.googleusercontent.com', // Замените на ваш Client ID
        SCOPES: [
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events',
            'https://www.googleapis.com/auth/tasks',
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/gmail.send',
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/contacts',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile'
        ].join(' '),
    },
    
    // Gemini конфигурация
    GEMINI: {
        MODEL: 'gemini-2.0-flash-exp',
        MAX_TOKENS: 8192,
        TEMPERATURE: 0.7,
        TOP_P: 0.8,
        TOP_K: 40,
    },
    
    // Настройки приложения
    APP: {
        NAME: 'Секретарь+',
        VERSION: '1.0.0',
        MAX_MESSAGE_LENGTH: 4000,
        MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
        SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        SUPPORTED_DOCUMENT_TYPES: ['application/pdf'],
        AUTO_SAVE_INTERVAL: 30000, // 30 секунд
        SYNC_INTERVAL: 300000, // 5 минут
    },
    
    // Настройки UI
    UI: {
        THEME_STORAGE_KEY: 'secretary-plus-theme',
        LANGUAGE_STORAGE_KEY: 'secretary-plus-language',
        DEFAULT_THEME: 'system', // 'light', 'dark', 'system'
        DEFAULT_LANGUAGE: 'ru',
        ANIMATION_DURATION: 200,
        TYPING_INDICATOR_DELAY: 1000, // 1 секунда
    },
    
    // Настройки безопасности
    SECURITY: {
        SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 часа
        MAX_LOGIN_ATTEMPTS: 5,
        LOCKOUT_DURATION: 15 * 60 * 1000, // 15 минут
    },
    
    // Настройки API
    API: {
        TIMEOUT: 30000, // 30 секунд
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 1000, // 1 секунда
        RATE_LIMIT: {
            REQUESTS_PER_MINUTE: 60,
            REQUESTS_PER_HOUR: 1000,
        },
    },
    
    // Настройки уведомлений
    NOTIFICATIONS: {
        ENABLED: true,
        SOUND_ENABLED: true,
        DESKTOP_ENABLED: true,
        PERMISSION_REQUESTED: false,
    },
    
    // Настройки голосового ввода
    SPEECH: {
        LANGUAGE: 'ru-RU',
        CONTINUOUS: false,
        INTERIM_RESULTS: true,
        MAX_ALTERNATIVES: 1,
    },
    
    // Настройки камеры
    CAMERA: {
        QUALITY: 0.8,
        MAX_WIDTH: 1920,
        MAX_HEIGHT: 1080,
        FORMAT: 'image/jpeg',
    },
    
    // Настройки синхронизации
    SYNC: {
        ENABLED: true,
        INTERVAL: 5 * 60 * 1000, // 5 минут
        BATCH_SIZE: 50,
        MAX_RETRIES: 3,
        SERVICES: {
            CALENDAR: true,
            TASKS: true,
            EMAIL: true,
            DRIVE: true,
            CONTACTS: true,
        },
    },
};

// Проверка конфигурации
export function validateConfig() {
    const required = [
        'SUPABASE.URL',
        'SUPABASE.ANON_KEY',
        'GOOGLE.CLIENT_ID'
    ];
    
    const missing = [];
    
    for (const path of required) {
        const keys = path.split('.');
        let value = CONFIG;
        
        for (const key of keys) {
            value = value[key];
            if (value === undefined) break;
        }
        
        if (value === undefined || value === '') {
            missing.push(path);
        }
    }
    
    if (missing.length > 0) {
        console.error('Отсутствуют обязательные настройки:', missing);
        return false;
    }
    
    return true;
}

// Утилиты для работы с конфигурацией
export function getConfig(path) {
    const keys = path.split('.');
    let value = CONFIG;
    
    for (const key of keys) {
        value = value[key];
        if (value === undefined) return null;
    }
    
    return value;
}

export function setConfig(path, value) {
    const keys = path.split('.');
    let obj = CONFIG;
    
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!obj[key]) obj[key] = {};
        obj = obj[key];
    }
    
    obj[keys[keys.length - 1]] = value;
}

// Экспорт по умолчанию
export default CONFIG; 