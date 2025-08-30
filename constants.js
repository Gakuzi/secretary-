// Глобальные константы приложения

// Типы сообщений
export const MESSAGE_TYPES = {
    USER: 'user',
    ASSISTANT: 'assistant',
    SYSTEM: 'system',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
};

// Типы отправителей
export const MESSAGE_SENDERS = {
    USER: 'user',
    ASSISTANT: 'assistant',
    SYSTEM: 'system',
};

// Роли пользователей
export const USER_ROLES = {
    OWNER: 'owner',
    ADMIN: 'admin',
    USER: 'user',
};

// Статусы аутентификации
export const AUTH_STATUS = {
    LOADING: 'loading',
    AUTHENTICATED: 'authenticated',
    UNAUTHENTICATED: 'unauthenticated',
    ERROR: 'error',
};

// Статусы синхронизации
export const SYNC_STATUS = {
    IDLE: 'idle',
    SYNCING: 'syncing',
    SUCCESS: 'success',
    ERROR: 'error',
    PAUSED: 'paused',
};

// Типы файлов
export const FILE_TYPES = {
    IMAGE: 'image',
    PDF: 'pdf',
    DOCUMENT: 'document',
    SPREADSHEET: 'spreadsheet',
    PRESENTATION: 'presentation',
    OTHER: 'other',
};

// Типы событий календаря
export const CALENDAR_EVENT_TYPES = {
    MEETING: 'meeting',
    TASK: 'task',
    REMINDER: 'reminder',
    BIRTHDAY: 'birthday',
    HOLIDAY: 'holiday',
    OTHER: 'other',
};

// Приоритеты задач
export const TASK_PRIORITIES = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent',
};

// Статусы задач
export const TASK_STATUS = {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
};

// Типы контактов
export const CONTACT_TYPES = {
    PERSONAL: 'personal',
    WORK: 'work',
    FAMILY: 'family',
    OTHER: 'other',
};

// Действия с контактами
export const CONTACT_ACTIONS = {
    CALL: 'call',
    EMAIL: 'email',
    MESSAGE: 'message',
    MEETING: 'meeting',
};

// Типы заметок
export const NOTE_TYPES = {
    TEXT: 'text',
    LIST: 'list',
    DRAWING: 'drawing',
    VOICE: 'voice',
};

// Статусы API запросов
export const API_STATUS = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error',
};

// Типы ошибок
export const ERROR_TYPES = {
    NETWORK: 'network',
    AUTH: 'auth',
    PERMISSION: 'permission',
    VALIDATION: 'validation',
    RATE_LIMIT: 'rate_limit',
    SERVER: 'server',
    UNKNOWN: 'unknown',
};

// Коды ошибок
export const ERROR_CODES = {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    RATE_LIMITED: 429,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
};

// Названия инструментов Gemini
export const GEMINI_TOOLS = {
    // Календарь
    GET_CALENDAR_EVENTS: 'get_calendar_events',
    CREATE_CALENDAR_EVENT: 'create_calendar_event',
    DELETE_CALENDAR_EVENT: 'delete_calendar_event',
    
    // Задачи
    GET_TASKS: 'get_tasks',
    CREATE_TASK: 'create_task',
    UPDATE_TASK: 'update_task',
    DELETE_TASK: 'delete_task',
    
    // Email
    GET_RECENT_EMAILS: 'get_recent_emails',
    SEND_EMAIL: 'send_email',
    DELETE_EMAIL: 'delete_email',
    
    // Документы
    FIND_DOCUMENTS: 'find_documents',
    GET_RECENT_FILES: 'get_recent_files',
    CREATE_GOOGLE_DOC: 'create_google_doc',
    CREATE_GOOGLE_DOC_WITH_CONTENT: 'create_google_doc_with_content',
    CREATE_GOOGLE_SHEET: 'create_google_sheet',
    
    // Контакты
    FIND_CONTACTS: 'find_contacts',
    PERFORM_CONTACT_ACTION: 'perform_contact_action',
    
    // Заметки
    CREATE_NOTE: 'create_note',
    FIND_NOTES: 'find_notes',
    
    // Память
    PROPOSE_DOCUMENT_WITH_CONTENT: 'propose_document_with_content',
    SUMMARIZE_AND_SAVE_MEMORY: 'summarize_and_save_memory',
    RECALL_MEMORY: 'recall_memory',
};

// Названия таблиц базы данных
export const DATABASE_TABLES = {
    PROFILES: 'profiles',
    USER_SETTINGS: 'user_settings',
    SESSIONS: 'sessions',
    CHAT_HISTORY: 'chat_history',
    CHAT_MEMORY: 'chat_memory',
    ACTION_STATS: 'action_stats',
    CALENDAR_EVENTS: 'calendar_events',
    CONTACTS: 'contacts',
    FILES: 'files',
    TASKS: 'tasks',
    EMAILS: 'emails',
    NOTES: 'notes',
    SHARED_GEMINI_KEYS: 'shared_gemini_keys',
    SHARED_PROXIES: 'shared_proxies',
};

// Названия сервисов Google
export const GOOGLE_SERVICES = {
    CALENDAR: 'calendar',
    TASKS: 'tasks',
    GMAIL: 'gmail',
    DRIVE: 'drive',
    CONTACTS: 'contacts',
    DOCS: 'docs',
    SHEETS: 'sheets',
    SLIDES: 'slides',
};

// Типы уведомлений
export const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
};

// Режимы голосового ввода
export const VOICE_MODES = {
    TAP_TO_TALK: 'tap_to_talk',
    HOLD_TO_TALK: 'hold_to_talk',
    CONTINUOUS: 'continuous',
};

// Режимы темы
export const THEME_MODES = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system',
};

// Языки
export const LANGUAGES = {
    RU: 'ru',
    EN: 'en',
};

// Размеры экранов
export const BREAKPOINTS = {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
};

// Анимации
export const ANIMATIONS = {
    FADE_IN: 'fade-in',
    FADE_OUT: 'fade-out',
    SLIDE_UP: 'slide-up',
    SLIDE_DOWN: 'slide-down',
    SCALE_IN: 'scale-in',
    SCALE_OUT: 'scale-out',
};

// Клавиши клавиатуры
export const KEYBOARD_KEYS = {
    ENTER: 'Enter',
    ESCAPE: 'Escape',
    TAB: 'Tab',
    SPACE: ' ',
    BACKSPACE: 'Backspace',
    DELETE: 'Delete',
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
    CTRL: 'Control',
    SHIFT: 'Shift',
    ALT: 'Alt',
    META: 'Meta',
};

// Комбинации клавиш
export const KEYBOARD_SHORTCUTS = {
    NEW_CHAT: ['Control', 'N'],
    SEND_MESSAGE: ['Enter'],
    VOICE_INPUT: ['Control', 'Shift', 'V'],
    ATTACH_FILE: ['Control', 'Shift', 'F'],
    CAMERA: ['Control', 'Shift', 'C'],
    SETTINGS: ['Control', ','],
    LOGOUT: ['Control', 'Shift', 'L'],
    TOGGLE_THEME: ['Control', 'Shift', 'T'],
    SEARCH: ['Control', 'F'],
    HELP: ['F1'],
};

// Локальное хранилище
export const STORAGE_KEYS = {
    THEME: 'secretary-plus-theme',
    LANGUAGE: 'secretary-plus-language',
    USER_SETTINGS: 'secretary-plus-user-settings',
    CHAT_HISTORY: 'secretary-plus-chat-history',
    AUTH_TOKEN: 'secretary-plus-auth-token',
    LAST_SYNC: 'secretary-plus-last-sync',
    NOTIFICATION_SETTINGS: 'secretary-plus-notification-settings',
    VOICE_SETTINGS: 'secretary-plus-voice-settings',
    CAMERA_SETTINGS: 'secretary-plus-camera-settings',
};

// Временные интервалы (в миллисекундах)
export const TIME_INTERVALS = {
    SECOND: 1000,
    MINUTE: 60 * 1000,
    HOUR: 60 * 60 * 1000,
    DAY: 24 * 60 * 60 * 1000,
    WEEK: 7 * 24 * 60 * 60 * 1000,
    MONTH: 30 * 24 * 60 * 60 * 1000,
    YEAR: 365 * 24 * 60 * 60 * 1000,
};

// Форматы дат
export const DATE_FORMATS = {
    SHORT: 'DD.MM.YYYY',
    LONG: 'DD MMMM YYYY',
    TIME: 'HH:mm',
    DATETIME: 'DD.MM.YYYY HH:mm',
    ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
    RELATIVE: 'relative',
};

// Единицы измерения
export const UNITS = {
    BYTES: ['B', 'KB', 'MB', 'GB', 'TB'],
    TIME: ['сек', 'мин', 'час', 'дн', 'нед', 'мес', 'год'],
    PERCENTAGE: '%',
    PIXELS: 'px',
    PERCENT: '%',
};

// Регулярные выражения
export const REGEX = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^[\+]?[1-9][\d]{0,15}$/,
    URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
    DATE: /^\d{4}-\d{2}-\d{2}$/,
    TIME: /^\d{2}:\d{2}$/,
    DATETIME: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
    BASE64: /^data:([A-Za-z-+\/]+);base64,(.+)$/,
    UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
};

// Цвета
export const COLORS = {
    PRIMARY: '#3B82F6',
    SECONDARY: '#6B7280',
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
    INFO: '#06B6D4',
    LIGHT: '#F9FAFB',
    DARK: '#111827',
    WHITE: '#FFFFFF',
    BLACK: '#000000',
    TRANSPARENT: 'transparent',
};

// Градиенты
export const GRADIENTS = {
    PRIMARY: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    SUCCESS: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    WARNING: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    ERROR: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    DARK: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
};

// Тени
export const SHADOWS = {
    SM: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    MD: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    LG: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    XL: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2XL': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    INNER: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    NONE: 'none',
};

// Радиусы скругления
export const BORDER_RADIUS = {
    NONE: '0',
    SM: '0.125rem',
    DEFAULT: '0.25rem',
    MD: '0.375rem',
    LG: '0.5rem',
    XL: '0.75rem',
    '2XL': '1rem',
    '3XL': '1.5rem',
    FULL: '9999px',
};

// Z-индексы
export const Z_INDEX = {
    DROPDOWN: 1000,
    STICKY: 1020,
    FIXED: 1030,
    MODAL_BACKDROP: 1040,
    MODAL: 1050,
    POPOVER: 1060,
    TOOLTIP: 1070,
    TOAST: 1080,
};

// Экспорт по умолчанию
export default {
    MESSAGE_TYPES,
    MESSAGE_SENDERS,
    USER_ROLES,
    AUTH_STATUS,
    SYNC_STATUS,
    FILE_TYPES,
    CALENDAR_EVENT_TYPES,
    TASK_PRIORITIES,
    TASK_STATUS,
    CONTACT_TYPES,
    CONTACT_ACTIONS,
    NOTE_TYPES,
    API_STATUS,
    ERROR_TYPES,
    ERROR_CODES,
    GEMINI_TOOLS,
    DATABASE_TABLES,
    GOOGLE_SERVICES,
    NOTIFICATION_TYPES,
    VOICE_MODES,
    THEME_MODES,
    LANGUAGES,
    BREAKPOINTS,
    ANIMATIONS,
    KEYBOARD_KEYS,
    KEYBOARD_SHORTCUTS,
    STORAGE_KEYS,
    TIME_INTERVALS,
    DATE_FORMATS,
    UNITS,
    REGEX,
    COLORS,
    GRADIENTS,
    SHADOWS,
    BORDER_RADIUS,
    Z_INDEX,
}; 