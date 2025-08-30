/**
 * Секретарь+ - Главное приложение
 * Интеллектуальный веб-ассистент для управления продуктивностью
 */

import { UIManager } from './components/UIManager.js';
import { ChatService } from './services/ChatService.js';
import { AuthService } from './services/AuthService.js';
import { GeminiService } from './services/GeminiService.js';
import { GoogleCalendarService } from './services/GoogleCalendarService.js';
import { GmailService } from './services/GmailService.js';

/**
 * Главный класс приложения
 */
class SecretaryPlusApp {
    constructor() {
        this.uiManager = null;
        this.chatService = null;
        this.authService = null;
        this.geminiService = null;
        this.calendarService = null;
        this.gmailService = null;
        this.isInitialized = false;
        
        // Состояние приложения
        this.state = {
            isAuthenticated: false,
            currentUser: null,
            currentTheme: 'dark',
            services: {
                gemini: false,
                calendar: false,
                gmail: false
            }
        };
    }

    /**
     * Инициализация приложения
     */
    async init() {
        try {
            console.log('🚀 Инициализация Секретарь+...');
            
            // Показываем экран загрузки
            this.showLoadingScreen();
            
            // Инициализируем сервисы
            await this.initializeServices();
            
            // Инициализируем UI
            await this.initializeUI();
            
            // Проверяем аутентификацию
            await this.checkAuthentication();
            
            // Скрываем экран загрузки
            this.hideLoadingScreen();
            
            this.isInitialized = true;
            console.log('✅ Секретарь+ успешно инициализирован');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации приложения:', error);
            this.showErrorScreen(error);
        }
    }

    /**
     * Инициализация сервисов
     */
    async initializeServices() {
        console.log('🔧 Инициализация сервисов...');
        
        // Инициализируем AuthService
        this.authService = new AuthService();
        await this.authService.init();
        
        // Инициализируем GeminiService если есть API ключ
        const geminiApiKey = localStorage.getItem('gemini-api-key');
        if (geminiApiKey) {
            try {
                this.geminiService = new GeminiService(geminiApiKey);
                await this.geminiService.init();
                this.state.services.gemini = true;
                console.log('✅ Gemini AI подключен');
            } catch (error) {
                console.warn('⚠️ Не удалось инициализировать Gemini AI:', error);
            }
        }
        
        // Инициализируем Google сервисы
        try {
            this.calendarService = new GoogleCalendarService();
            await this.calendarService.init();
            this.state.services.calendar = true;
            console.log('✅ Google Calendar подключен');
        } catch (error) {
            console.warn('⚠️ Не удалось инициализировать Google Calendar:', error);
        }
        
        try {
            this.gmailService = new GmailService();
            await this.gmailService.init();
            this.state.services.gmail = true;
            console.log('✅ Gmail подключен');
        } catch (error) {
            console.warn('⚠️ Не удалось инициализировать Gmail:', error);
        }
        
        // Инициализируем ChatService
        this.chatService = new ChatService();
        await this.chatService.init();
        
        console.log('✅ Сервисы инициализированы');
    }

    /**
     * Инициализация пользовательского интерфейса
     */
    async initializeUI() {
        console.log('🎨 Инициализация UI...');
        
        // Инициализируем UIManager
        this.uiManager = new UIManager();
        await this.uiManager.init();
        
        // Устанавливаем ChatService в UIManager
        this.uiManager.setChatService(this.chatService);
        
        console.log('✅ UI инициализирован');
    }

    /**
     * Проверка аутентификации
     */
    async checkAuthentication() {
        console.log('🔐 Проверка аутентификации...');
        
        if (this.authService && this.authService.isAuthenticated()) {
            this.state.isAuthenticated = true;
            this.state.currentUser = this.authService.getCurrentUser();
            
            // Обновляем состояние сервисов
            await this.updateServicesState();
            
            // Показываем основное приложение
            if (this.uiManager) {
                this.uiManager.showApp();
                this.uiManager.updateUserInterface();
            }
        } else {
            // Показываем экран аутентификации
            if (this.uiManager) {
                this.uiManager.showAuthScreen();
            }
        }
        
        console.log('✅ Проверка аутентификации завершена');
    }

    /**
     * Обновление состояния сервисов
     */
    async updateServicesState() {
        try {
            // Проверяем Gemini AI
            if (this.geminiService && this.geminiService.isReady()) {
                this.state.services.gemini = true;
            }
            
            // Проверяем Google сервисы
            if (this.calendarService && this.calendarService.isReady()) {
                this.state.services.calendar = true;
            }
            
            if (this.gmailService && this.gmailService.isReady()) {
                this.state.services.gmail = true;
            }
            
            console.log('✅ Состояние сервисов обновлено:', this.state.services);
            
        } catch (error) {
            console.error('❌ Ошибка обновления состояния сервисов:', error);
        }
    }

    /**
     * Показать экран загрузки
     */
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
        }
    }

    /**
     * Скрыть экран загрузки
     */
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }

    /**
     * Показать экран ошибки
     */
    showErrorScreen(error) {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.innerHTML = `
                <div class="text-center">
                    <div class="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                    </div>
                    <h2 class="text-2xl font-bold text-red-400 mb-2">Ошибка загрузки</h2>
                    <p class="text-red-300 mb-4">Не удалось инициализировать приложение</p>
                    <p class="text-red-200 text-sm mb-6">${error.message}</p>
                    <button onclick="location.reload()" class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                        Перезагрузить страницу
                    </button>
                </div>
            `;
        }
    }

    /**
     * Обработка аутентификации
     */
    async handleAuthentication(user) {
        try {
            console.log('🔐 Обработка аутентификации для пользователя:', user);
            
            this.state.isAuthenticated = true;
            this.state.currentUser = user;
            
            // Обновляем состояние сервисов
            await this.updateServicesState();
            
            // Скрываем экран аутентификации
            if (this.uiManager) {
                this.uiManager.hideAuthScreen();
                this.uiManager.showApp();
                this.uiManager.updateUserInterface();
            }
            
            // Показываем приветственное сообщение
            this.showWelcomeMessage();
            
        } catch (error) {
            console.error('❌ Ошибка аутентификации:', error);
            this.showNotification('Ошибка аутентификации', 'error');
        }
    }

    /**
     * Показать приветственное сообщение
     */
    showWelcomeMessage() {
        if (this.uiManager && this.uiManager.getElement('chatArea')) {
            const welcomeMessage = `
                <div class="text-center text-blue-300 animate-fade-in">
                    <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h3 class="text-2xl font-semibold mb-2">Добро пожаловать, ${this.state.currentUser?.name || 'пользователь'}!</h3>
                    <p class="text-blue-200 mb-4">Я - ваш AI-помощник Секретарь+</p>
                    <p class="text-blue-300 text-sm">Доступные сервисы:</p>
                    <div class="grid grid-cols-2 gap-4 mt-4 text-left max-w-md mx-auto">
                        <div class="flex items-center space-x-2">
                            <div class="w-3 h-3 ${this.state.services.gemini ? 'bg-green-500' : 'bg-gray-400'} rounded-full"></div>
                            <span class="text-sm">Gemini AI</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-3 h-3 ${this.state.services.calendar ? 'bg-green-500' : 'bg-gray-400'} rounded-full"></div>
                            <span class="text-sm">Google Calendar</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-3 h-3 ${this.state.services.gmail ? 'bg-green-500' : 'bg-gray-400'} rounded-full"></div>
                            <span class="text-sm">Gmail</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span class="text-sm">Чат</span>
                        </div>
                    </div>
                    <p class="text-blue-300 text-sm mt-4">Начните разговор или используйте кнопки выше для различных функций</p>
                </div>
            `;
            
            this.uiManager.getElement('chatArea').innerHTML = welcomeMessage;
        }
    }

    /**
     * Показать уведомление
     */
    showNotification(message, type = 'info') {
        if (this.uiManager) {
            this.uiManager.showNotification(message, type);
        }
    }

    /**
     * Обработка выхода из системы
     */
    async handleLogout() {
        try {
            console.log('🚪 Обработка выхода из системы...');
            
            // Сбрасываем состояние
            this.state.isAuthenticated = false;
            this.state.currentUser = null;
            this.state.services = {
                gemini: false,
                calendar: false,
                gmail: false
            };
            
            // Очищаем историю чата
            if (this.chatService) {
                this.chatService.clearHistory();
            }
            
            // Показываем экран аутентификации
            if (this.uiManager) {
                this.uiManager.hideApp();
                this.uiManager.showAuthScreen();
            }
            
            this.showNotification('Вы успешно вышли из системы', 'success');
            
        } catch (error) {
            console.error('❌ Ошибка выхода из системы:', error);
        }
    }

    /**
     * Получение статистики приложения
     */
    getAppStatistics() {
        const stats = {
            isInitialized: this.isInitialized,
            isAuthenticated: this.state.isAuthenticated,
            currentUser: this.state.currentUser,
            currentTheme: this.state.currentTheme,
            services: this.state.services,
            chatService: this.chatService ? this.chatService.getStatistics() : null,
            uiManager: this.uiManager ? this.uiManager.isReady() : false,
            authService: this.authService ? this.authService.getAuthStats() : null
        };
        
        return stats;
    }

    /**
     * Переключение темы
     */
    toggleTheme() {
        this.state.currentTheme = this.state.currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.state.currentTheme);
        
        // Сохраняем в localStorage
        localStorage.setItem('secretary-plus-theme', this.state.currentTheme);
        
        this.showNotification(`Тема изменена на: ${this.state.currentTheme === 'dark' ? 'темную' : 'светлую'}`, 'info');
    }

    /**
     * Загрузка сохраненной темы
     */
    loadSavedTheme() {
        const savedTheme = localStorage.getItem('secretary-plus-theme');
        if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
            this.state.currentTheme = savedTheme;
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    }

    /**
     * Получение информации о приложении
     */
    getAppInfo() {
        return {
            name: 'Секретарь+',
            version: '1.0.0',
            description: 'Интеллектуальный веб-ассистент для управления продуктивностью',
            developer: 'Климов Евгений',
            technologies: ['Vanilla JavaScript', 'Tailwind CSS', 'Google Gemini AI', 'Google APIs'],
            features: [
                'Управление календарями',
                'Анализ почты',
                'Поиск по контактам',
                'Работа с документами',
                'AI-помощник'
            ],
            services: this.state.services
        };
    }

    /**
     * Настройка API ключей
     */
    configureAPIKeys(geminiApiKey = null, googleClientId = null) {
        let updated = false;
        
        if (geminiApiKey) {
            localStorage.setItem('gemini-api-key', geminiApiKey);
            updated = true;
        }
        
        if (googleClientId) {
            localStorage.setItem('google-client-id', googleClientId);
            if (this.authService) {
                this.authService.configureGoogleOAuth(googleClientId);
            }
            updated = true;
        }
        
        if (updated) {
            this.showNotification('API ключи обновлены. Перезагрузите страницу для применения изменений.', 'success');
        }
        
        return updated;
    }

    /**
     * Проверка состояния сервисов
     */
    async checkServicesHealth() {
        const health = {
            gemini: false,
            calendar: false,
            gmail: false,
            auth: false
        };
        
        try {
            if (this.geminiService) {
                health.gemini = this.geminiService.isReady();
            }
            
            if (this.calendarService) {
                health.calendar = this.calendarService.isReady();
            }
            
            if (this.gmailService) {
                health.gmail = this.gmailService.isReady();
            }
            
            if (this.authService) {
                health.auth = this.authService.isReady();
            }
            
        } catch (error) {
            console.error('❌ Ошибка проверки состояния сервисов:', error);
        }
        
        return health;
    }
}

// Глобальный экземпляр приложения
window.SecretaryPlusApp = SecretaryPlusApp;

// Инициализация приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('🌐 Страница загружена, инициализируем приложение...');
        
        // Создаем экземпляр приложения
        const app = new SecretaryPlusApp();
        
        // Загружаем сохраненную тему
        app.loadSavedTheme();
        
        // Инициализируем приложение
        await app.init();
        
        // Делаем приложение доступным глобально
        window.app = app;
        
        console.log('🎉 Приложение Секретарь+ готово к работе!');
        
        // Показываем информацию о приложении в консоли
        console.log('📊 Статистика приложения:', app.getAppStatistics());
        console.log('ℹ️ Информация о приложении:', app.getAppInfo());
        
    } catch (error) {
        console.error('💥 Критическая ошибка при инициализации:', error);
        
        // Показываем критическую ошибку
        document.body.innerHTML = `
            <div class="min-h-screen bg-red-900 flex items-center justify-center p-4">
                <div class="text-center text-white">
                    <h1 class="text-4xl font-bold mb-4">Критическая ошибка</h1>
                    <p class="text-xl mb-6">Не удалось загрузить приложение Секретарь+</p>
                    <p class="text-red-200 mb-8">${error.message}</p>
                    <button onclick="location.reload()" class="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                        Перезагрузить страницу
                    </button>
                </div>
            </div>
        `;
    }
});

// Обработка ошибок на уровне приложения
window.addEventListener('error', (event) => {
    console.error('💥 Необработанная ошибка:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('💥 Необработанное отклонение промиса:', event.reason);
});

// Экспорт для модулей
export { SecretaryPlusApp }; 