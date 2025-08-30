/**
 * AuthService - Сервис аутентификации и управления пользователями
 */
export class AuthService {
    constructor() {
        this.isInitialized = false;
        this.currentUser = null;
        this.accessToken = null;
        this.refreshToken = null;
        this.tokenExpiry = null;
        
        // Google OAuth конфигурация
        this.googleConfig = {
            clientId: this.getClientId(),
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/calendar',
                'https://www.googleapis.com/auth/gmail.readonly',
                'https://www.googleapis.com/auth/gmail.send',
                'https://www.googleapis.com/auth/contacts.readonly'
            ].join(' ')
        };
    }

    /**
     * Инициализация сервиса аутентификации
     */
    async init() {
        try {
            // Загружаем Google Identity Services
            await this.loadGoogleIdentityServices();
            
            // Проверяем сохраненную сессию
            await this.checkSavedSession();
            
            this.isInitialized = true;
            console.log('✅ AuthService инициализирован');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации AuthService:', error);
            throw error;
        }
    }

    /**
     * Загрузка Google Identity Services
     */
    loadGoogleIdentityServices() {
        return new Promise((resolve, reject) => {
            if (window.google && window.google.accounts) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = () => resolve();
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Получение Client ID из конфигурации
     */
    getClientId() {
        return localStorage.getItem('google-client-id') || '';
    }

    /**
     * Проверка сохраненной сессии
     */
    async checkSavedSession() {
        try {
            const savedUser = localStorage.getItem('secretary-plus-user');
            const savedToken = localStorage.getItem('secretary-plus-token');
            const savedExpiry = localStorage.getItem('secretary-plus-token-expiry');

            if (savedUser && savedToken && savedExpiry) {
                const expiry = new Date(savedExpiry);
                if (expiry > new Date()) {
                    this.currentUser = JSON.parse(savedUser);
                    this.accessToken = savedToken;
                    this.tokenExpiry = expiry;
                    console.log('✅ Восстановлена сохраненная сессия');
                    return true;
                } else {
                    // Токен истек, очищаем
                    this.clearSavedSession();
                }
            }
            return false;
        } catch (error) {
            console.warn('⚠️ Ошибка восстановления сессии:', error);
            this.clearSavedSession();
            return false;
        }
    }

    /**
     * Очистка сохраненной сессии
     */
    clearSavedSession() {
        localStorage.removeItem('secretary-plus-user');
        localStorage.removeItem('secretary-plus-token');
        localStorage.removeItem('secretary-plus-token-expiry');
    }

    /**
     * Google OAuth аутентификация
     */
    async authenticateWithGoogle() {
        try {
            if (!window.google || !window.google.accounts) {
                throw new Error('Google Identity Services не загружены');
            }

            return new Promise((resolve, reject) => {
                const client = window.google.accounts.oauth2.initTokenClient({
                    client_id: this.googleConfig.clientId,
                    scope: this.googleConfig.scope,
                    callback: async (response) => {
                        try {
                            if (response.error) {
                                reject(new Error(response.error));
                                return;
                            }

                            this.accessToken = response.access_token;
                            this.tokenExpiry = new Date(Date.now() + response.expires_in * 1000);

                            // Получаем информацию о пользователе
                            const userInfo = await this.getGoogleUserInfo();
                            this.currentUser = userInfo;

                            // Сохраняем сессию
                            this.saveSession();

                            console.log('✅ Пользователь аутентифицирован:', userInfo.email);
                            resolve(userInfo);

                        } catch (error) {
                            reject(error);
                        }
                    }
                });

                client.requestAccessToken();
            });

        } catch (error) {
            console.error('❌ Ошибка Google аутентификации:', error);
            throw error;
        }
    }

    /**
     * Получение информации о пользователе Google
     */
    async getGoogleUserInfo() {
        try {
            const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка получения информации о пользователе');
            }

            const userInfo = await response.json();
            
            return {
                id: userInfo.id,
                email: userInfo.email,
                name: userInfo.name,
                givenName: userInfo.given_name,
                familyName: userInfo.family_name,
                picture: userInfo.picture,
                locale: userInfo.locale,
                verifiedEmail: userInfo.verified_email,
                provider: 'google'
            };

        } catch (error) {
            console.error('❌ Ошибка получения информации о пользователе:', error);
            throw error;
        }
    }

    /**
     * Сохранение сессии
     */
    saveSession() {
        try {
            localStorage.setItem('secretary-plus-user', JSON.stringify(this.currentUser));
            localStorage.setItem('secretary-plus-token', this.accessToken);
            localStorage.setItem('secretary-plus-token-expiry', this.tokenExpiry.toISOString());
        } catch (error) {
            console.warn('⚠️ Не удалось сохранить сессию:', error);
        }
    }

    /**
     * Выход из системы
     */
    async signOut() {
        try {
            // Очищаем локальные данные
            this.currentUser = null;
            this.accessToken = null;
            this.tokenExpiry = null;
            this.clearSavedSession();

            // Отзываем Google токен
            if (this.accessToken) {
                try {
                    await fetch(`https://oauth2.googleapis.com/revoke?token=${this.accessToken}`, {
                        method: 'POST'
                    });
                } catch (error) {
                    console.warn('⚠️ Не удалось отозвать Google токен:', error);
                }
            }

            console.log('✅ Пользователь вышел из системы');
            return true;

        } catch (error) {
            console.error('❌ Ошибка выхода:', error);
            throw error;
        }
    }

    /**
     * Обновление токена
     */
    async refreshAccessToken() {
        try {
            if (!this.refreshToken) {
                throw new Error('Refresh token не доступен');
            }

            const response = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    client_id: this.googleConfig.clientId,
                    client_secret: '', // Для веб-приложений не требуется
                    refresh_token: this.refreshToken,
                    grant_type: 'refresh_token'
                })
            });

            if (!response.ok) {
                throw new Error('Ошибка обновления токена');
            }

            const tokenData = await response.json();
            this.accessToken = tokenData.access_token;
            this.tokenExpiry = new Date(Date.now() + tokenData.expires_in * 1000);

            // Сохраняем обновленную сессию
            this.saveSession();

            console.log('✅ Токен обновлен');
            return true;

        } catch (error) {
            console.error('❌ Ошибка обновления токена:', error);
            // При ошибке обновления токена выходим из системы
            await this.signOut();
            throw error;
        }
    }

    /**
     * Проверка срока действия токена
     */
    isTokenValid() {
        if (!this.accessToken || !this.tokenExpiry) {
            return false;
        }

        // Проверяем, не истек ли токен (с запасом в 5 минут)
        const now = new Date();
        const expiryWithBuffer = new Date(this.tokenExpiry.getTime() - 5 * 60 * 1000);
        
        return now < expiryWithBuffer;
    }

    /**
     * Получение валидного токена
     */
    async getValidToken() {
        if (!this.isTokenValid()) {
            await this.refreshAccessToken();
        }
        return this.accessToken;
    }

    /**
     * Проверка аутентификации
     */
    isAuthenticated() {
        return !!this.currentUser && this.isTokenValid();
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
     * Обновление профиля пользователя
     */
    async updateUserProfile(updates) {
        try {
            if (!this.currentUser) {
                throw new Error('Пользователь не аутентифицирован');
            }

            this.currentUser = { ...this.currentUser, ...updates };
            this.saveSession();

            console.log('✅ Профиль пользователя обновлен');
            return this.currentUser;

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
            permissions.push('calendar', 'gmail', 'contacts');
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
    getAuthStats() {
        return {
            isAuthenticated: this.isAuthenticated(),
            isTokenValid: this.isTokenValid(),
            userEmail: this.currentUser?.email || null,
            tokenExpiry: this.tokenExpiry,
            permissions: this.getUserPermissions(),
            lastActivity: localStorage.getItem('secretary-plus-last-activity')
        };
    }

    /**
     * Обновление времени последней активности
     */
    updateLastActivity() {
        try {
            localStorage.setItem('secretary-plus-last-activity', new Date().toISOString());
        } catch (error) {
            console.warn('⚠️ Не удалось обновить время активности:', error);
        }
    }

    /**
     * Проверка готовности сервиса
     */
    isReady() {
        return this.isInitialized;
    }

    /**
     * Настройка Google OAuth
     */
    configureGoogleOAuth(clientId) {
        if (clientId) {
            localStorage.setItem('google-client-id', clientId);
            this.googleConfig.clientId = clientId;
            console.log('✅ Google OAuth настроен');
            return true;
        }
        return false;
    }

    /**
     * Получение конфигурации OAuth
     */
    getOAuthConfig() {
        return {
            clientId: this.googleConfig.clientId,
            scope: this.googleConfig.scope,
            isConfigured: !!this.googleConfig.clientId
        };
    }
} 