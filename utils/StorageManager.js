// Менеджер локального хранилища
import { STORAGE_KEYS } from '../constants.js';

/**
 * Класс для работы с локальным хранилищем браузера
 */
export class StorageManager {
    constructor() {
        this.storage = window.localStorage;
        this.prefix = 'secretary_plus_';
    }

    /**
     * Получить значение из хранилища
     * @param {string} key - Ключ
     * @param {*} defaultValue - Значение по умолчанию
     * @returns {*} Значение
     */
    get(key, defaultValue = null) {
        try {
            const fullKey = this.getFullKey(key);
            const value = this.storage.getItem(fullKey);
            
            if (value === null) {
                return defaultValue;
            }
            
            return JSON.parse(value);
        } catch (error) {
            console.error('Ошибка получения данных из хранилища:', error);
            return defaultValue;
        }
    }

    /**
     * Установить значение в хранилище
     * @param {string} key - Ключ
     * @param {*} value - Значение
     */
    set(key, value) {
        try {
            const fullKey = this.getFullKey(key);
            const serializedValue = JSON.stringify(value);
            this.storage.setItem(fullKey, serializedValue);
        } catch (error) {
            console.error('Ошибка сохранения данных в хранилище:', error);
            throw error;
        }
    }

    /**
     * Удалить значение из хранилища
     * @param {string} key - Ключ
     */
    remove(key) {
        try {
            const fullKey = this.getFullKey(key);
            this.storage.removeItem(fullKey);
        } catch (error) {
            console.error('Ошибка удаления данных из хранилища:', error);
        }
    }

    /**
     * Проверить наличие ключа в хранилище
     * @param {string} key - Ключ
     * @returns {boolean} Существует ли ключ
     */
    has(key) {
        const fullKey = this.getFullKey(key);
        return this.storage.getItem(fullKey) !== null;
    }

    /**
     * Получить все ключи с префиксом
     * @returns {Array<string>} Массив ключей
     */
    keys() {
        const keys = [];
        for (let i = 0; i < this.storage.length; i++) {
            const key = this.storage.key(i);
            if (key && key.startsWith(this.prefix)) {
                keys.push(key.substring(this.prefix.length));
            }
        }
        return keys;
    }

    /**
     * Очистить все данные приложения
     */
    clear() {
        try {
            const keys = this.keys();
            keys.forEach(key => this.remove(key));
        } catch (error) {
            console.error('Ошибка очистки хранилища:', error);
        }
    }

    /**
     * Получить размер хранилища в байтах
     * @returns {number} Размер в байтах
     */
    getSize() {
        let size = 0;
        const keys = this.keys();
        
        keys.forEach(key => {
            const value = this.get(key);
            size += JSON.stringify(value).length;
        });
        
        return size;
    }

    /**
     * Получить полный ключ с префиксом
     * @param {string} key - Ключ
     * @returns {string} Полный ключ
     */
    getFullKey(key) {
        return `${this.prefix}${key}`;
    }

    /**
     * Получить настройки пользователя
     * @returns {Object} Настройки
     */
    getUserSettings() {
        return this.get(STORAGE_KEYS.USER_SETTINGS, {
            theme: 'system',
            language: 'ru',
            notifications: true,
            soundEnabled: true,
            desktopNotifications: false,
            voice: {
                language: 'ru-RU',
                continuous: false,
                interimResults: true,
                maxAlternatives: 1,
                mode: 'tap_to_talk'
            },
            camera: {
                quality: 0.8,
                maxWidth: 1920,
                maxHeight: 1080,
                format: 'image/jpeg',
                flash: false,
                facingMode: 'user'
            },
            sync: {
                enabled: true,
                interval: 300000,
                batchSize: 50,
                maxRetries: 3,
                services: {
                    calendar: true,
                    tasks: true,
                    email: true,
                    drive: true,
                    contacts: true
                }
            }
        });
    }

    /**
     * Сохранить настройки пользователя
     * @param {Object} settings - Настройки
     */
    setUserSettings(settings) {
        this.set(STORAGE_KEYS.USER_SETTINGS, settings);
    }

    /**
     * Получить историю чата
     * @returns {Array} История чата
     */
    getChatHistory() {
        return this.get(STORAGE_KEYS.CHAT_HISTORY, []);
    }

    /**
     * Сохранить историю чата
     * @param {Array} history - История чата
     */
    setChatHistory(history) {
        this.set(STORAGE_KEYS.CHAT_HISTORY, history);
    }

    /**
     * Добавить сообщение в историю
     * @param {Object} message - Сообщение
     */
    addMessageToHistory(message) {
        const history = this.getChatHistory();
        history.push(message);
        
        // Ограничиваем историю 1000 сообщениями
        if (history.length > 1000) {
            history.splice(0, history.length - 1000);
        }
        
        this.setChatHistory(history);
    }

    /**
     * Очистить историю чата
     */
    clearChatHistory() {
        this.setChatHistory([]);
    }

    /**
     * Получить токен аутентификации
     * @returns {string|null} Токен
     */
    getAuthToken() {
        return this.get(STORAGE_KEYS.AUTH_TOKEN, null);
    }

    /**
     * Сохранить токен аутентификации
     * @param {string} token - Токен
     */
    setAuthToken(token) {
        this.set(STORAGE_KEYS.AUTH_TOKEN, token);
    }

    /**
     * Удалить токен аутентификации
     */
    removeAuthToken() {
        this.remove(STORAGE_KEYS.AUTH_TOKEN);
    }

    /**
     * Получить время последней синхронизации
     * @returns {string|null} Время синхронизации
     */
    getLastSync() {
        return this.get(STORAGE_KEYS.LAST_SYNC, null);
    }

    /**
     * Сохранить время последней синхронизации
     * @param {string} timestamp - Временная метка
     */
    setLastSync(timestamp) {
        this.set(STORAGE_KEYS.LAST_SYNC, timestamp);
    }

    /**
     * Получить настройки уведомлений
     * @returns {Object} Настройки уведомлений
     */
    getNotificationSettings() {
        return this.get(STORAGE_KEYS.NOTIFICATION_SETTINGS, {
            enabled: true,
            soundEnabled: true,
            desktopEnabled: false,
            permissionRequested: false
        });
    }

    /**
     * Сохранить настройки уведомлений
     * @param {Object} settings - Настройки
     */
    setNotificationSettings(settings) {
        this.set(STORAGE_KEYS.NOTIFICATION_SETTINGS, settings);
    }

    /**
     * Получить настройки голосового ввода
     * @returns {Object} Настройки голоса
     */
    getVoiceSettings() {
        return this.get(STORAGE_KEYS.VOICE_SETTINGS, {
            language: 'ru-RU',
            continuous: false,
            interimResults: true,
            maxAlternatives: 1,
            mode: 'tap_to_talk'
        });
    }

    /**
     * Сохранить настройки голосового ввода
     * @param {Object} settings - Настройки
     */
    setVoiceSettings(settings) {
        this.set(STORAGE_KEYS.VOICE_SETTINGS, settings);
    }

    /**
     * Получить настройки камеры
     * @returns {Object} Настройки камеры
     */
    getCameraSettings() {
        return this.get(STORAGE_KEYS.CAMERA_SETTINGS, {
            quality: 0.8,
            maxWidth: 1920,
            maxHeight: 1080,
            format: 'image/jpeg',
            flash: false,
            facingMode: 'user'
        });
    }

    /**
     * Сохранить настройки камеры
     * @param {Object} settings - Настройки
     */
    setCameraSettings(settings) {
        this.set(STORAGE_KEYS.CAMERA_SETTINGS, settings);
    }

    /**
     * Экспорт всех данных
     * @returns {Object} Экспортированные данные
     */
    export() {
        const data = {};
        const keys = this.keys();
        
        keys.forEach(key => {
            data[key] = this.get(key);
        });
        
        return data;
    }

    /**
     * Импорт данных
     * @param {Object} data - Данные для импорта
     */
    import(data) {
        try {
            Object.keys(data).forEach(key => {
                this.set(key, data[key]);
            });
        } catch (error) {
            console.error('Ошибка импорта данных:', error);
            throw error;
        }
    }

    /**
     * Проверить доступность хранилища
     * @returns {boolean} Доступно ли хранилище
     */
    isAvailable() {
        try {
            const testKey = '__test__';
            this.storage.setItem(testKey, 'test');
            this.storage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    }
} 