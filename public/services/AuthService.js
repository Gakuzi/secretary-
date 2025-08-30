/**
 * AuthService - Сервис аутентификации через Firebase
 */
import { FirebaseService } from './FirebaseService.js';

export class AuthService {
    constructor() {
        this.isInitialized = false;
        this.currentUser = null;
        this.accessToken = null;
        this.firebaseService = null;
        
        // Google API конфигурация для дополнительных сервисов
        this.googleConfig = {
            apiKey: this.getGoogleApiKey(),
            clientId: this.getGoogleClientId()
        };
    }

    /**
     * Инициализация сервиса аутентификации
     */
    async init() {
        try {
            // Инициализируем Firebase
            this.firebaseService = new FirebaseService();
            await this.firebaseService.init();
            
            // Проверяем статус аутентификации
            await this.checkAuthState();
            
            this.isInitialized = true;
            console.log('✅ AuthService инициализирован');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации AuthService:', error);
            throw error;
        }
    }

    /**
     * Получение Google API ключа
     */
    getGoogleApiKey() {
        return localStorage.getItem('google-api-key') || '';
    }

    /**
     * Получение Google Client ID
     */
    getGoogleClientId() {
        return localStorage.getItem('google-client-id') || '';
    }

    /**
     * Проверка состояния аутентификации
     */
    async checkAuthState() {
        try {
            if (this.firebaseService && this.firebaseService.isAuthenticated()) {
                this.currentUser = this.firebaseService.getCurrentUser();
                this.accessToken = await this.firebaseService.getGoogleAccessToken();
                
                console.log('✅ Пользователь аутентифицирован через Firebase');
                return true;
            }
            return false;
        } catch (error) {
            console.warn('⚠️ Ошибка проверки состояния аутентификации:', error);
            return false;
        }
    }

    /**
     * Google аутентификация через Firebase
     */
    async authenticateWithGoogle() {
        try {
            if (!this.firebaseService) {
                throw new Error('FirebaseService не инициализирован');
            }

            // Выполняем аутентификацию через Firebase
            const user = await this.firebaseService.signInWithGoogle();
            
            if (user) {
                this.currentUser = user;
                this.accessToken = await this.firebaseService.getGoogleAccessToken();
                
                // Сохраняем информацию о пользователе
                await this.saveUserProfile(user);
                
                console.log('✅ Пользователь аутентифицирован:', user.email);
                return user;
            }
            
        } catch (error) {
            console.error('❌ Ошибка Google аутентификации:', error);
            throw error;
        }
    }

    /**
     * Сохранение профиля пользователя
     */
    async saveUserProfile(user) {
        try {
            const userProfile = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                createdAt: new Date(),
                lastLogin: new Date(),
                provider: 'google',
                settings: {
                    theme: 'dark',
                    language: 'ru',
                    notifications: true
                }
            };

            await this.firebaseService.saveUserData(userProfile);
            
        } catch (error) {
            console.warn('⚠️ Не удалось сохранить профиль пользователя:', error);
        }
    }

    /**
     * Выход из системы
     */
    async signOut() {
        try {
            if (this.firebaseService) {
                await this.firebaseService.signOut();
            }
            
            this.currentUser = null;
            this.accessToken = null;
            
            console.log('✅ Пользователь вышел из системы');
            return true;
            
        } catch (error) {
            console.error('❌ Ошибка выхода:', error);
            throw error;
        }
    }

    /**
     * Получение текущего пользователя
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Получение токена доступа
     */
    getAccessToken() {
        return this.accessToken;
    }

    /**
     * Проверка аутентификации
     */
    isAuthenticated() {
        return !!this.currentUser && !!this.accessToken;
    }

    /**
     * Обновление профиля пользователя
     */
    async updateUserProfile(updates) {
        try {
            if (!this.currentUser) {
                throw new Error('Пользователь не аутентифицирован');
            }

            const userData = await this.firebaseService.getUserData() || {};
            const updatedProfile = { ...userData, ...updates };
            
            await this.firebaseService.saveUserData(updatedProfile);
            
            // Обновляем локальный объект пользователя
            this.currentUser = { ...this.currentUser, ...updates };
            
            console.log('✅ Профиль пользователя обновлен');
            return updatedProfile;
            
        } catch (error) {
            console.error('❌ Ошибка обновления профиля:', error);
            throw error;
        }
    }

    /**
     * Получение разрешений пользователя
     */
    getUserPermissions() {
        if (!this.currentUser) {
            return [];
        }

        const permissions = ['basic'];
        
        if (this.accessToken) {
            permissions.push('calendar', 'gmail', 'contacts', 'files');
        }
        
        if (this.firebaseService && this.firebaseService.isReady()) {
            permissions.push('database', 'storage');
        }

        return permissions;
    }

    /**
     * Проверка разрешения
     */
    hasPermission(permission) {
        return this.getUserPermissions().includes(permission);
    }

    /**
     * Получение статистики аутентификации
     */
    async getAuthStats() {
        try {
            const firebaseStats = await this.firebaseService.getStatistics();
            
            return {
                isAuthenticated: this.isAuthenticated(),
                isTokenValid: !!this.accessToken,
                userEmail: this.currentUser?.email || null,
                userUid: this.currentUser?.uid || null,
                permissions: this.getUserPermissions(),
                lastActivity: firebaseStats?.lastActivity || null,
                totalChats: firebaseStats?.totalChats || 0,
                totalMessages: firebaseStats?.totalMessages || 0,
                firebaseReady: this.firebaseService?.isReady() || false
            };
        } catch (error) {
            console.error('❌ Ошибка получения статистики аутентификации:', error);
            return {
                isAuthenticated: this.isAuthenticated(),
                isTokenValid: !!this.accessToken,
                userEmail: this.currentUser?.email || null,
                permissions: this.getUserPermissions(),
                firebaseReady: this.firebaseService?.isReady() || false
            };
        }
    }

    /**
     * Обновление времени последней активности
     */
    async updateLastActivity() {
        try {
            if (this.currentUser) {
                await this.updateUserProfile({ lastActivity: new Date() });
            }
        } catch (error) {
            console.warn('⚠️ Не удалось обновить время активности:', error);
        }
    }

    /**
     * Проверка готовности сервиса
     */
    isReady() {
        return this.isInitialized && !!this.firebaseService;
    }

    /**
     * Настройка Google API
     */
    configureGoogleAPI(apiKey, clientId) {
        let updated = false;
        
        if (apiKey) {
            localStorage.setItem('google-api-key', apiKey);
            this.googleConfig.apiKey = apiKey;
            updated = true;
        }
        
        if (clientId) {
            localStorage.setItem('google-client-id', clientId);
            this.googleConfig.clientId = clientId;
            updated = true;
        }
        
        if (updated) {
            console.log('✅ Google API настроен');
        }
        
        return updated;
    }

    /**
     * Настройка Firebase
     */
    async configureFirebase(config) {
        try {
            if (this.firebaseService) {
                this.firebaseService.configureFirebase(config);
                await this.firebaseService.init();
                console.log('✅ Firebase переконфигурирован');
                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ Ошибка настройки Firebase:', error);
            return false;
        }
    }

    /**
     * Получение конфигурации OAuth
     */
    getOAuthConfig() {
        return {
            apiKey: this.googleConfig.apiKey,
            clientId: this.googleConfig.clientId,
            isConfigured: !!(this.googleConfig.apiKey && this.googleConfig.clientId)
        };
    }

    /**
     * Получение Firebase сервиса
     */
    getFirebaseService() {
        return this.firebaseService;
    }

    /**
     * Проверка состояния всех сервисов
     */
    async checkServicesHealth() {
        const health = {
            auth: this.isReady(),
            firebase: this.firebaseService?.isReady() || false,
            google: !!(this.googleConfig.apiKey && this.googleConfig.clientId),
            user: !!this.currentUser
        };
        
        return health;
    }
} 