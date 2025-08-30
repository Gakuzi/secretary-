/**
 * Менеджер пользовательского интерфейса
 */
export class UIManager {
    constructor() {
        this.isInitialized = false;
        this.elements = {};
    }

    /**
     * Инициализация UI
     */
    async init() {
        try {
            console.log('🔧 Инициализация UIManager...');
            
            this.initializeElements();
            this.bindEvents();
            
            this.isInitialized = true;
            console.log('✅ UIManager инициализирован');
        } catch (error) {
            console.error('❌ Ошибка инициализации UIManager:', error);
            throw error;
        }
    }

    /**
     * Инициализация DOM элементов
     */
    initializeElements() {
        this.elements = {
            loadingScreen: document.getElementById('loading-screen'),
            authScreen: document.getElementById('auth-screen'),
            app: document.getElementById('app'),
            newChatBtn: document.getElementById('new-chat-btn'),
            cameraBtn: document.getElementById('camera-btn'),
            attachFileBtn: document.getElementById('attach-file-btn'),
            settingsBtn: document.getElementById('settings-btn'),
            logoutBtn: document.getElementById('logout-btn'),
            googleSigninButton: document.getElementById('google-signin-button')
        };

        // Проверяем, что все элементы найдены
        Object.entries(this.elements).forEach(([name, element]) => {
            if (!element) {
                console.warn(`⚠️ Элемент ${name} не найден`);
            }
        });
    }

    /**
     * Привязка событий
     */
    bindEvents() {
        if (this.elements.newChatBtn) {
            this.elements.newChatBtn.addEventListener('click', () => this.handleNewChat());
        }
        
        if (this.elements.logoutBtn) {
            this.elements.logoutBtn.addEventListener('click', () => this.handleLogout());
        }
        
        if (this.elements.settingsBtn) {
            this.elements.settingsBtn.addEventListener('click', () => this.handleSettings());
        }
    }

    /**
     * Показать загрузочный экран
     */
    showLoadingScreen() {
        if (this.elements.loadingScreen) {
            this.elements.loadingScreen.classList.remove('hidden');
        }
    }

    /**
     * Скрыть загрузочный экран
     */
    hideLoadingScreen() {
        if (this.elements.loadingScreen) {
            this.elements.loadingScreen.classList.add('hidden');
        }
    }

    /**
     * Показать экран аутентификации
     */
    showAuthScreen() {
        this.hideLoadingScreen();
        if (this.elements.authScreen) {
            this.elements.authScreen.classList.remove('hidden');
        }
    }

    /**
     * Скрыть экран аутентификации
     */
    hideAuthScreen() {
        if (this.elements.authScreen) {
            this.elements.authScreen.classList.add('hidden');
        }
    }

    /**
     * Показать основное приложение
     */
    showApp() {
        this.hideLoadingScreen();
        this.hideAuthScreen();
        if (this.elements.app) {
            this.elements.app.classList.remove('hidden');
        }
    }

    /**
     * Обработчики событий
     */
    handleNewChat() {
        console.log('🆕 Новый чат');
        // Здесь будет логика создания нового чата
    }

    handleLogout() {
        console.log('🚪 Выход из системы');
        // Здесь будет логика выхода
    }

    handleSettings() {
        console.log('⚙️ Настройки');
        // Здесь будет логика настроек
    }
} 