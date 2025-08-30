// Основной файл приложения "Секретарь+"
import { CONFIG, validateConfig } from './config.js';
import { 
    MESSAGE_TYPES, 
    MESSAGE_SENDERS, 
    AUTH_STATUS, 
    THEME_MODES,
    STORAGE_KEYS 
} from './constants.js';
import { AuthService } from './services/supabase/AuthService.js';
import { ChatService } from './services/ChatService.js';
import { UIManager } from './components/UIManager.js';
import { NotificationManager } from './utils/NotificationManager.js';
import { ThemeManager } from './utils/ThemeManager.js';
import { StorageManager } from './utils/StorageManager.js';

/**
 * Главный класс приложения
 */
class SecretaryPlusApp {
    constructor() {
        this.config = CONFIG;
        this.authService = null;
        this.chatService = null;
        this.uiManager = null;
        this.notificationManager = null;
        this.themeManager = null;
        this.storageManager = null;
        
        this.currentUser = null;
        this.currentSession = null;
        this.isInitialized = false;
        
        // Привязка методов к контексту
        this.handleAuthStateChange = this.handleAuthStateChange.bind(this);
        this.handleError = this.handleError.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    /**
     * Инициализация приложения
     */
    async init() {
        try {
            console.log('🚀 Инициализация Секретарь+...');
            
            // Проверка конфигурации
            if (!validateConfig()) {
                throw new Error('Неверная конфигурация приложения');
            }
            
            // Инициализация менеджеров
            await this.initializeManagers();
            
            // Инициализация сервисов
            await this.initializeServices();
            
            // Инициализация UI
            await this.initializeUI();
            
            // Загрузка темы
            await this.themeManager.loadTheme();
            
            // Проверка аутентификации
            await this.checkAuthState();
            
            this.isInitialized = true;
            console.log('✅ Секретарь+ успешно инициализирован');
            
            // Скрытие загрузочного экрана
            this.hideLoadingScreen();
            
        } catch (error) {
            console.error('❌ Ошибка инициализации:', error);
            this.handleError(error);
        }
    }

    /**
     * Инициализация менеджеров
     */
    async initializeManagers() {
        this.storageManager = new StorageManager();
        this.themeManager = new ThemeManager(this.storageManager);
        this.notificationManager = new NotificationManager();
    }

    /**
     * Инициализация сервисов
     */
    async initializeServices() {
        this.authService = new AuthService(this.config.SUPABASE);
        this.chatService = new ChatService(this.config.GEMINI);
        
        // Подписка на изменения состояния аутентификации
        this.authService.onAuthStateChange(this.handleAuthStateChange);
    }

    /**
     * Инициализация UI
     */
    async initializeUI() {
        this.uiManager = new UIManager({
            authService: this.authService,
            chatService: this.chatService,
            notificationManager: this.notificationManager,
            themeManager: this.themeManager,
            onLogout: this.handleLogout,
            onError: this.handleError
        });
        
        await this.uiManager.init();
    }

    /**
     * Проверка состояния аутентификации
     */
    async checkAuthState() {
        try {
            const session = await this.authService.getCurrentSession();
            
            if (session) {
                this.currentSession = session;
                this.currentUser = session.user;
                await this.handleAuthenticated(session);
            } else {
                await this.handleUnauthenticated();
            }
        } catch (error) {
            console.error('Ошибка проверки состояния аутентификации:', error);
            await this.handleUnauthenticated();
        }
    }

    /**
     * Обработчик изменения состояния аутентификации
     */
    async handleAuthStateChange(event, session) {
        console.log('🔄 Изменение состояния аутентификации:', event);
        
        switch (event) {
            case 'SIGNED_IN':
                this.currentSession = session;
                this.currentUser = session.user;
                await this.handleAuthenticated(session);
                break;
                
            case 'SIGNED_OUT':
                this.currentSession = null;
                this.currentUser = null;
                await this.handleUnauthenticated();
                break;
                
            case 'TOKEN_REFRESHED':
                this.currentSession = session;
                await this.handleTokenRefreshed(session);
                break;
                
            case 'USER_UPDATED':
                this.currentUser = session.user;
                await this.handleUserUpdated(session);
                break;
        }
    }

    /**
     * Обработка успешной аутентификации
     */
    async handleAuthenticated(session) {
        try {
            console.log('👤 Пользователь аутентифицирован:', session.user.email);
            
            // Создание профиля пользователя, если это первый вход
            await this.authService.createUserProfile(session.user);
            
            // Инициализация чата
            await this.chatService.init(session);
            
            // Показ основного интерфейса
            this.uiManager.showMainInterface();
            
            // Уведомление о входе
            this.notificationManager.show({
                type: 'success',
                title: 'Добро пожаловать!',
                message: `Вы вошли как ${session.user.email}`
            });
            
        } catch (error) {
            console.error('Ошибка обработки аутентификации:', error);
            this.handleError(error);
        }
    }

    /**
     * Обработка выхода из системы
     */
    async handleUnauthenticated() {
        console.log('🚪 Пользователь не аутентифицирован');
        
        // Очистка данных чата
        this.chatService.clear();
        
        // Показ экрана аутентификации
        this.uiManager.showAuthScreen();
    }

    /**
     * Обработка обновления токена
     */
    async handleTokenRefreshed(session) {
        console.log('🔄 Токен обновлен');
        
        // Обновление сессии в чате
        await this.chatService.updateSession(session);
    }

    /**
     * Обработка обновления пользователя
     */
    async handleUserUpdated(session) {
        console.log('👤 Данные пользователя обновлены');
        
        // Обновление UI с новыми данными пользователя
        this.uiManager.updateUserInfo(session.user);
    }

    /**
     * Обработка выхода
     */
    async handleLogout() {
        try {
            await this.authService.signOut();
            
            this.notificationManager.show({
                type: 'info',
                title: 'Выход выполнен',
                message: 'Вы успешно вышли из системы'
            });
            
        } catch (error) {
            console.error('Ошибка выхода:', error);
            this.handleError(error);
        }
    }

    /**
     * Обработка ошибок
     */
    handleError(error) {
        console.error('❌ Ошибка приложения:', error);
        
        let message = 'Произошла неизвестная ошибка';
        let type = 'error';
        
        if (error.message) {
            message = error.message;
        }
        
        if (error.type) {
            type = error.type;
        }
        
        this.notificationManager.show({
            type,
            title: 'Ошибка',
            message
        });
        
        // Если ошибка критическая, показываем экран ошибки
        if (error.critical) {
            this.uiManager.showErrorScreen(error);
        }
    }

    /**
     * Скрытие загрузочного экрана
     */
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 200);
        }
    }

    /**
     * Получение текущего пользователя
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Получение текущей сессии
     */
    getCurrentSession() {
        return this.currentSession;
    }

    /**
     * Проверка, инициализировано ли приложение
     */
    isAppInitialized() {
        return this.isInitialized;
    }

    /**
     * Проверка, аутентифицирован ли пользователь
     */
    isAuthenticated() {
        return !!this.currentSession;
    }

    /**
     * Получение конфигурации
     */
    getConfig() {
        return this.config;
    }

    /**
     * Обновление конфигурации
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
}

// Глобальный экземпляр приложения
window.secretaryPlusApp = new SecretaryPlusApp();

// Инициализация приложения при загрузке DOM
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await window.secretaryPlusApp.init();
    } catch (error) {
        console.error('Критическая ошибка инициализации:', error);
        
        // Показ экрана ошибки
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.innerHTML = `
                <div class="text-center">
                    <div class="text-red-500 text-4xl mb-4">❌</div>
                    <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Ошибка инициализации
                    </h2>
                    <p class="text-gray-500 dark:text-gray-400 mb-4">
                        Не удалось запустить приложение
                    </p>
                    <button 
                        onclick="location.reload()" 
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Перезагрузить страницу
                    </button>
                </div>
            `;
        }
    }
});

// Обработка ошибок window
window.addEventListener('error', (event) => {
    console.error('Глобальная ошибка:', event.error);
    if (window.secretaryPlusApp) {
        window.secretaryPlusApp.handleError(event.error);
    }
});

// Обработка необработанных промисов
window.addEventListener('unhandledrejection', (event) => {
    console.error('Необработанная ошибка промиса:', event.reason);
    if (window.secretaryPlusApp) {
        window.secretaryPlusApp.handleError(event.reason);
    }
});

// Экспорт для использования в других модулях
export default window.secretaryPlusApp; 