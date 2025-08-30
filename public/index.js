/**
 * Секретарь+ - Главное приложение
 * Интеллектуальный веб-ассистент для управления продуктивностью
 */

import { UIManager } from './components/UIManager.js';
import { ChatService } from './services/ChatService.js';

/**
 * Главный класс приложения
 */
class SecretaryPlusApp {
    constructor() {
        this.uiManager = null;
        this.chatService = null;
        this.isInitialized = false;
        
        // Состояние приложения
        this.state = {
            isAuthenticated: false,
            currentUser: null,
            currentTheme: 'dark'
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
        
        console.log('✅ UI инициализирован');
    }

    /**
     * Проверка аутентификации
     */
    async checkAuthentication() {
        console.log('🔐 Проверка аутентификации...');
        
        // TODO: Реализовать проверку Google аутентификации
        // Пока показываем экран аутентификации
        
        if (this.uiManager) {
            this.uiManager.showAuthScreen();
        }
        
        console.log('✅ Проверка аутентификации завершена');
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
            
            // Скрываем экран аутентификации
            if (this.uiManager) {
                this.uiManager.hideAuthScreen();
                this.uiManager.showApp();
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
                    <p class="text-blue-300 text-sm">Начните разговор или используйте кнопки выше для различных функций</p>
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
            chatService: this.chatService ? this.chatService.getStatistics() : null,
            uiManager: this.uiManager ? this.uiManager.isReady() : false
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
            technologies: ['Vanilla JavaScript', 'Tailwind CSS', 'Google Gemini AI', 'Supabase'],
            features: [
                'Управление календарями',
                'Анализ почты',
                'Поиск по контактам',
                'Работа с документами',
                'AI-помощник'
            ]
        };
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