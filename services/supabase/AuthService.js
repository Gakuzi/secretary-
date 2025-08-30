// Сервис аутентификации Supabase
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

/**
 * Класс для работы с аутентификацией через Supabase
 */
export class AuthService {
    constructor(config) {
        this.config = config;
        this.client = null;
        this.currentSession = null;
        this.authStateChangeCallbacks = [];
        
        this.init();
    }

    /**
     * Инициализация клиента Supabase
     */
    init() {
        try {
            this.client = createClient(this.config.URL, this.config.ANON_KEY);
            
            // Подписка на изменения состояния аутентификации
            this.client.auth.onAuthStateChange((event, session) => {
                this.handleAuthStateChange(event, session);
            });
            
            console.log('✅ Supabase клиент инициализирован');
        } catch (error) {
            console.error('❌ Ошибка инициализации Supabase клиента:', error);
            throw error;
        }
    }

    /**
     * Обработка изменения состояния аутентификации
     * @param {string} event - Событие
     * @param {Object} session - Сессия
     */
    handleAuthStateChange(event, session) {
        console.log('🔄 Изменение состояния аутентификации:', event, session?.user?.email);
        
        this.currentSession = session;
        
        // Уведомляем всех подписчиков
        this.authStateChangeCallbacks.forEach(callback => {
            try {
                callback(event, session);
            } catch (error) {
                console.error('Ошибка в обработчике изменения состояния аутентификации:', error);
            }
        });
    }

    /**
     * Подписка на изменения состояния аутентификации
     * @param {Function} callback - Функция обратного вызова
     */
    onAuthStateChange(callback) {
        this.authStateChangeCallbacks.push(callback);
        
        // Возвращаем функцию для отписки
        return () => {
            const index = this.authStateChangeCallbacks.indexOf(callback);
            if (index > -1) {
                this.authStateChangeCallbacks.splice(index, 1);
            }
        };
    }

    /**
     * Получение текущей сессии
     * @returns {Promise<Object|null>} Текущая сессия
     */
    async getCurrentSession() {
        try {
            const { data: { session }, error } = await this.client.auth.getSession();
            
            if (error) {
                console.error('Ошибка получения сессии:', error);
                return null;
            }
            
            this.currentSession = session;
            return session;
        } catch (error) {
            console.error('Ошибка получения текущей сессии:', error);
            return null;
        }
    }

    /**
     * Получение текущего пользователя
     * @returns {Promise<Object|null>} Текущий пользователь
     */
    async getCurrentUser() {
        try {
            const { data: { user }, error } = await this.client.auth.getUser();
            
            if (error) {
                console.error('Ошибка получения пользователя:', error);
                return null;
            }
            
            return user;
        } catch (error) {
            console.error('Ошибка получения текущего пользователя:', error);
            return null;
        }
    }

    /**
     * Вход через Google OAuth
     * @returns {Promise<Object>} Результат входа
     */
    async signInWithGoogle() {
        try {
            const { data, error } = await this.client.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                    scopes: 'email profile'
                }
            });
            
            if (error) {
                console.error('Ошибка входа через Google:', error);
                throw error;
            }
            
            return data;
        } catch (error) {
            console.error('Ошибка входа через Google:', error);
            throw error;
        }
    }

    /**
     * Выход из системы
     * @returns {Promise<void>}
     */
    async signOut() {
        try {
            const { error } = await this.client.auth.signOut();
            
            if (error) {
                console.error('Ошибка выхода:', error);
                throw error;
            }
            
            this.currentSession = null;
            console.log('✅ Выход выполнен успешно');
        } catch (error) {
            console.error('Ошибка выхода из системы:', error);
            throw error;
        }
    }

    /**
     * Обновление токена
     * @returns {Promise<Object>} Обновленная сессия
     */
    async refreshToken() {
        try {
            const { data, error } = await this.client.auth.refreshSession();
            
            if (error) {
                console.error('Ошибка обновления токена:', error);
                throw error;
            }
            
            this.currentSession = data.session;
            return data.session;
        } catch (error) {
            console.error('Ошибка обновления токена:', error);
            throw error;
        }
    }

    /**
     * Создание профиля пользователя
     * @param {Object} user - Пользователь
     * @returns {Promise<Object>} Созданный профиль
     */
    async createUserProfile(user) {
        try {
            // Проверяем, существует ли уже профиль
            const { data: existingProfile } = await this.client
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            
            if (existingProfile) {
                console.log('Профиль пользователя уже существует');
                return existingProfile;
            }
            
            // Проверяем, есть ли уже пользователи в системе
            const { data: userCount } = await this.client
                .from('profiles')
                .select('id', { count: 'exact' });
            
            // Определяем роль пользователя
            const role = userCount === 0 ? 'owner' : 'user';
            
            // Создаем новый профиль
            const { data: profile, error } = await this.client
                .from('profiles')
                .insert({
                    id: user.id,
                    email: user.email,
                    name: user.user_metadata?.full_name || user.email,
                    avatar_url: user.user_metadata?.avatar_url,
                    role: role,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();
            
            if (error) {
                console.error('Ошибка создания профиля пользователя:', error);
                throw error;
            }
            
            console.log('✅ Профиль пользователя создан:', profile);
            return profile;
        } catch (error) {
            console.error('Ошибка создания профиля пользователя:', error);
            throw error;
        }
    }

    /**
     * Обновление профиля пользователя
     * @param {Object} updates - Обновления профиля
     * @returns {Promise<Object>} Обновленный профиль
     */
    async updateUserProfile(updates) {
        try {
            const user = await this.getCurrentUser();
            if (!user) {
                throw new Error('Пользователь не аутентифицирован');
            }
            
            const { data: profile, error } = await this.client
                .from('profiles')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id)
                .select()
                .single();
            
            if (error) {
                console.error('Ошибка обновления профиля:', error);
                throw error;
            }
            
            console.log('✅ Профиль пользователя обновлен:', profile);
            return profile;
        } catch (error) {
            console.error('Ошибка обновления профиля пользователя:', error);
            throw error;
        }
    }

    /**
     * Получение профиля пользователя
     * @param {string} [userId] - ID пользователя (если не указан, берется текущий)
     * @returns {Promise<Object|null>} Профиль пользователя
     */
    async getUserProfile(userId = null) {
        try {
            const targetUserId = userId || (await this.getCurrentUser())?.id;
            
            if (!targetUserId) {
                throw new Error('ID пользователя не найден');
            }
            
            const { data: profile, error } = await this.client
                .from('profiles')
                .select('*')
                .eq('id', targetUserId)
                .single();
            
            if (error) {
                if (error.code === 'PGRST116') {
                    // Профиль не найден
                    return null;
                }
                console.error('Ошибка получения профиля:', error);
                throw error;
            }
            
            return profile;
        } catch (error) {
            console.error('Ошибка получения профиля пользователя:', error);
            throw error;
        }
    }

    /**
     * Проверка роли пользователя
     * @param {string} role - Роль для проверки
     * @returns {Promise<boolean>} Есть ли у пользователя указанная роль
     */
    async hasRole(role) {
        try {
            const profile = await this.getUserProfile();
            return profile?.role === role;
        } catch (error) {
            console.error('Ошибка проверки роли:', error);
            return false;
        }
    }

    /**
     * Проверка, является ли пользователь владельцем
     * @returns {Promise<boolean>} Является ли пользователь владельцем
     */
    async isOwner() {
        return this.hasRole('owner');
    }

    /**
     * Проверка, является ли пользователь администратором
     * @returns {Promise<boolean>} Является ли пользователь администратором
     */
    async isAdmin() {
        const isOwner = await this.isOwner();
        const isAdmin = await this.hasRole('admin');
        return isOwner || isAdmin;
    }

    /**
     * Получение provider token для Google API
     * @returns {Promise<string|null>} Provider token
     */
    async getProviderToken() {
        try {
            const session = await this.getCurrentSession();
            return session?.provider_token || null;
        } catch (error) {
            console.error('Ошибка получения provider token:', error);
            return null;
        }
    }

    /**
     * Проверка, аутентифицирован ли пользователь
     * @returns {Promise<boolean>} Аутентифицирован ли пользователь
     */
    async isAuthenticated() {
        try {
            const session = await this.getCurrentSession();
            return !!session;
        } catch (error) {
            console.error('Ошибка проверки аутентификации:', error);
            return false;
        }
    }

    /**
     * Получение настроек пользователя
     * @returns {Promise<Object>} Настройки пользователя
     */
    async getUserSettings() {
        try {
            const user = await this.getCurrentUser();
            if (!user) {
                throw new Error('Пользователь не аутентифицирован');
            }
            
            const { data: settings, error } = await this.client
                .from('user_settings')
                .select('*')
                .eq('user_id', user.id)
                .single();
            
            if (error && error.code !== 'PGRST116') {
                console.error('Ошибка получения настроек:', error);
                throw error;
            }
            
            return settings || {};
        } catch (error) {
            console.error('Ошибка получения настроек пользователя:', error);
            return {};
        }
    }

    /**
     * Сохранение настроек пользователя
     * @param {Object} settings - Настройки для сохранения
     * @returns {Promise<Object>} Сохраненные настройки
     */
    async saveUserSettings(settings) {
        try {
            const user = await this.getCurrentUser();
            if (!user) {
                throw new Error('Пользователь не аутентифицирован');
            }
            
            const { data, error } = await this.client
                .from('user_settings')
                .upsert({
                    user_id: user.id,
                    settings: settings,
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();
            
            if (error) {
                console.error('Ошибка сохранения настроек:', error);
                throw error;
            }
            
            return data;
        } catch (error) {
            console.error('Ошибка сохранения настроек пользователя:', error);
            throw error;
        }
    }

    /**
     * Получение клиента Supabase
     * @returns {Object} Клиент Supabase
     */
    getClient() {
        return this.client;
    }

    /**
     * Получение текущей сессии (синхронно)
     * @returns {Object|null} Текущая сессия
     */
    getCurrentSessionSync() {
        return this.currentSession;
    }
} 