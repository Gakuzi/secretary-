/**
 * UIManager - Управление пользовательским интерфейсом
 */
import { AuthService } from '../services/AuthService.js';

export class UIManager {
    constructor() {
        this.elements = {};
        this.isInitialized = false;
        this.authService = null;
        this.chatService = null;
        
        // Состояние UI
        this.state = {
            isAuthenticated: false,
            currentView: 'auth', // auth, app, settings
            isLoading: false
        };
    }

    /**
     * Инициализация UI менеджера
     */
    async init() {
        try {
            this.initializeElements();
            this.bindEvents();
            
            // Инициализируем AuthService
            this.authService = new AuthService();
            await this.authService.init();
            
            // Проверяем аутентификацию
            await this.checkAuthenticationState();
            
            this.isInitialized = true;
            console.log('✅ UIManager инициализирован');
        } catch (error) {
            console.error('❌ Ошибка инициализации UIManager:', error);
        }
    }

    /**
     * Инициализация DOM элементов
     */
    initializeElements() {
        // Основные экраны
        this.elements.loadingScreen = document.getElementById('loading-screen');
        this.elements.authScreen = document.getElementById('auth-screen');
        this.elements.app = document.getElementById('app');
        
        // Элементы аутентификации
        this.elements.googleSigninButton = document.getElementById('google-signin-button');
        
        // Элементы основного приложения
        this.elements.newChatBtn = document.getElementById('new-chat-btn');
        this.elements.cameraBtn = document.getElementById('camera-btn');
        this.elements.attachFileBtn = document.getElementById('attach-file-btn');
        this.elements.settingsBtn = document.getElementById('settings-btn');
        this.elements.logoutBtn = document.getElementById('logout-btn');
        
        // Элементы чата
        this.elements.chatArea = document.getElementById('chat-area');
        this.elements.messageInput = document.getElementById('message-input');
        this.elements.sendBtn = document.getElementById('send-btn');
        this.elements.voiceBtn = document.getElementById('voice-btn');
        
        // Проверяем наличие всех элементов
        this.validateElements();
    }

    /**
     * Валидация DOM элементов
     */
    validateElements() {
        const requiredElements = [
            'loadingScreen', 'authScreen', 'app', 'googleSigninButton',
            'newChatBtn', 'cameraBtn', 'attachFileBtn', 'settingsBtn', 'logoutBtn',
            'chatArea', 'messageInput', 'sendBtn', 'voiceBtn'
        ];

        const missingElements = requiredElements.filter(elementName => !this.elements[elementName]);
        
        if (missingElements.length > 0) {
            console.warn('⚠️ Отсутствуют элементы:', missingElements);
        }
    }

    /**
     * Привязка событий к элементам
     */
    bindEvents() {
        // Кнопка нового чата
        if (this.elements.newChatBtn) {
            this.elements.newChatBtn.addEventListener('click', () => this.handleNewChat());
        }
        
        // Кнопка камеры
        if (this.elements.cameraBtn) {
            this.elements.cameraBtn.addEventListener('click', () => this.handleCamera());
        }

        // Кнопка прикрепления файла
        if (this.elements.attachFileBtn) {
            this.elements.attachFileBtn.addEventListener('click', () => this.handleAttachFile());
        }

        // Кнопка настроек
        if (this.elements.settingsBtn) {
            this.elements.settingsBtn.addEventListener('click', () => this.handleSettings());
        }

        // Кнопка выхода
        if (this.elements.logoutBtn) {
            this.elements.logoutBtn.addEventListener('click', () => this.handleLogout());
        }
        
        // Поле ввода сообщения
        if (this.elements.messageInput) {
            this.elements.messageInput.addEventListener('input', (e) => this.handleMessageInput(e));
            this.elements.messageInput.addEventListener('keypress', (e) => this.handleMessageKeypress(e));
        }

        // Кнопка отправки
        if (this.elements.sendBtn) {
            this.elements.sendBtn.addEventListener('click', () => this.handleSendMessage());
        }

        // Кнопка голосового ввода
        if (this.elements.voiceBtn) {
            this.elements.voiceBtn.addEventListener('click', () => this.handleVoiceInput());
        }

        // Google Sign-in кнопка
        if (this.elements.googleSigninButton) {
            this.elements.googleSigninButton.addEventListener('click', () => this.handleGoogleSignIn());
        }
    }

    /**
     * Проверка состояния аутентификации
     */
    async checkAuthenticationState() {
        try {
            if (this.authService && this.authService.isAuthenticated()) {
                this.state.isAuthenticated = true;
                this.showApp();
                this.updateUserInterface();
            } else {
                this.state.isAuthenticated = false;
                this.showAuthScreen();
            }
        } catch (error) {
            console.error('❌ Ошибка проверки аутентификации:', error);
            this.showAuthScreen();
        }
    }

    /**
     * Обновление пользовательского интерфейса
     */
    updateUserInterface() {
        if (this.state.isAuthenticated && this.authService) {
            const user = this.authService.getCurrentUser();
            if (user) {
                // Обновляем информацию о пользователе
                this.updateUserInfo(user);
                
                // Обновляем разрешения
                this.updatePermissions();
            }
        }
    }

    /**
     * Обновление информации о пользователе
     */
    updateUserInfo(user) {
        // Обновляем заголовок приложения
        const appTitle = document.querySelector('#app h1');
        if (appTitle) {
            appTitle.textContent = `Секретарь+ - ${user.name}`;
        }
    }

    /**
     * Обновление разрешений
     */
    updatePermissions() {
        if (!this.authService) return;

        const permissions = this.authService.getUserPermissions();
        
        // Включаем/выключаем функции в зависимости от разрешений
        if (this.elements.cameraBtn) {
            this.elements.cameraBtn.disabled = !permissions.includes('camera');
        }
        
        if (this.elements.attachFileBtn) {
            this.elements.attachFileBtn.disabled = !permissions.includes('files');
        }
    }

    /**
     * Показать экран загрузки
     */
    showLoadingScreen() {
        if (this.elements.loadingScreen) {
            this.elements.loadingScreen.classList.remove('hidden');
        }
    }

    /**
     * Скрыть экран загрузки
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
        if (this.elements.authScreen) {
            this.elements.authScreen.classList.remove('hidden');
            this.elements.authScreen.classList.add('animate-fade-in');
        }
        if (this.elements.app) {
            this.elements.app.classList.add('hidden');
        }
        this.state.currentView = 'auth';
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
        if (this.elements.app) {
            this.elements.app.classList.remove('hidden');
            this.elements.app.classList.add('animate-fade-in');
        }
        if (this.elements.authScreen) {
            this.elements.authScreen.classList.add('hidden');
        }
        this.state.currentView = 'app';
    }

    /**
     * Скрыть основное приложение
     */
    hideApp() {
        if (this.elements.app) {
            this.elements.app.classList.add('hidden');
        }
    }

    /**
     * Обработчик Google Sign-in
     */
    async handleGoogleSignIn() {
        try {
            this.setLoadingState(true);
            
            if (!this.authService) {
                throw new Error('AuthService не инициализирован');
            }

            // Выполняем аутентификацию
            const user = await this.authService.authenticateWithGoogle();
            
            if (user) {
                this.state.isAuthenticated = true;
                this.hideAuthScreen();
                this.showApp();
                this.updateUserInterface();
                
                // Показываем приветственное сообщение
                this.showWelcomeMessage(user);
                
                this.showNotification(`Добро пожаловать, ${user.name}!`, 'success');
            }
            
        } catch (error) {
            console.error('❌ Ошибка Google аутентификации:', error);
            this.showNotification('Ошибка аутентификации: ' + error.message, 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    /**
     * Установка состояния загрузки
     */
    setLoadingState(isLoading) {
        this.state.isLoading = isLoading;
        
        if (this.elements.googleSigninButton) {
            const button = this.elements.googleSigninButton.querySelector('button');
            if (button) {
                button.disabled = isLoading;
                if (isLoading) {
                    button.innerHTML = `
                        <div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Вход...</span>
                    `;
                } else {
                    button.innerHTML = `
                        <svg class="w-6 h-6" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span class="text-lg">Войти через Google</span>
                    `;
                }
            }
        }
    }

    /**
     * Показать приветственное сообщение
     */
    showWelcomeMessage(user) {
        if (this.elements.chatArea) {
            const welcomeMessage = `
                <div class="text-center text-blue-300 animate-fade-in">
                    <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <img src="${user.picture || ''}" alt="${user.name}" class="w-16 h-16 rounded-full" onerror="this.style.display='none'">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="${user.picture ? 'display: none' : ''}">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h3 class="text-2xl font-semibold mb-2">Добро пожаловать, ${user.name}!</h3>
                    <p class="text-blue-200 mb-4">Я - ваш AI-помощник Секретарь+</p>
                    <p class="text-blue-300 text-sm">Теперь у вас есть доступ ко всем функциям:</p>
                    <div class="grid grid-cols-2 gap-4 mt-4 text-left max-w-md mx-auto">
                        <div class="flex items-center space-x-2">
                            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span class="text-sm">Google Calendar</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span class="text-sm">Gmail</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span class="text-sm">AI-помощник</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span class="text-sm">Контакты</span>
                        </div>
                    </div>
                </div>
            `;
            
            this.elements.chatArea.innerHTML = welcomeMessage;
        }
    }

    /**
     * Обработчик выхода
     */
    async handleLogout() {
        try {
            if (confirm('Вы уверены, что хотите выйти?')) {
                this.setLoadingState(true);
                
                if (this.authService) {
                    await this.authService.signOut();
                }
                
                this.state.isAuthenticated = false;
                this.hideApp();
                this.showAuthScreen();
                this.clearChatArea();
                
                this.showNotification('Вы успешно вышли из системы', 'success');
            }
        } catch (error) {
            console.error('❌ Ошибка выхода:', error);
            this.showNotification('Ошибка при выходе из системы', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    /**
     * Обработчик нового чата
     */
    handleNewChat() {
        console.log('🆕 Новый чат');
        this.clearChatArea();
        this.addWelcomeMessage();
    }

    /**
     * Обработчик камеры
     */
    handleCamera() {
        console.log('📷 Камера');
        if (this.state.isAuthenticated) {
            this.showNotification('Функция камеры в разработке', 'info');
        } else {
            this.showNotification('Необходима аутентификация', 'warning');
        }
    }

    /**
     * Обработчик прикрепления файла
     */
    handleAttachFile() {
        console.log('📎 Прикрепление файла');
        if (this.state.isAuthenticated) {
            this.showNotification('Функция прикрепления файлов в разработке', 'info');
        } else {
            this.showNotification('Необходима аутентификация', 'warning');
        }
    }

    /**
     * Обработчик настроек
     */
    handleSettings() {
        console.log('⚙️ Настройки');
        this.showSettingsModal();
    }

    /**
     * Показать модальное окно настроек
     */
    showSettingsModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 class="text-lg font-semibold mb-4">Настройки</h3>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Google Client ID</label>
                        <input type="text" id="google-client-id" placeholder="Введите Client ID" 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Gemini API Key</label>
                        <input type="password" id="gemini-api-key" placeholder="Введите API ключ" 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md">
                    </div>
                </div>
                
                <div class="flex space-x-3 mt-6">
                    <button id="save-settings" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                        Сохранить
                    </button>
                    <button id="close-settings" class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400">
                        Закрыть
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Загружаем текущие настройки
        const clientIdInput = modal.querySelector('#google-client-id');
        const apiKeyInput = modal.querySelector('#gemini-api-key');
        
        clientIdInput.value = localStorage.getItem('google-client-id') || '';
        apiKeyInput.value = localStorage.getItem('gemini-api-key') || '';
        
        // Обработчики событий
        modal.querySelector('#save-settings').addEventListener('click', () => {
            const clientId = clientIdInput.value.trim();
            const apiKey = apiKeyInput.value.trim();
            
            if (clientId) {
                localStorage.setItem('google-client-id', clientId);
                if (this.authService) {
                    this.authService.configureGoogleOAuth(clientId);
                }
            }
            
            if (apiKey) {
                localStorage.setItem('gemini-api-key', apiKey);
            }
            
            this.showNotification('Настройки сохранены', 'success');
            modal.remove();
        });
        
        modal.querySelector('#close-settings').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    /**
     * Обработчик ввода сообщения
     */
    handleMessageInput(event) {
        const message = event.target.value.trim();
        if (message) {
            this.elements.sendBtn.classList.remove('opacity-50');
            this.elements.sendBtn.classList.add('opacity-100');
        } else {
            this.elements.sendBtn.classList.add('opacity-50');
            this.elements.sendBtn.classList.remove('opacity-100');
        }
    }

    /**
     * Обработчик нажатия Enter в поле сообщения
     */
    handleMessageKeypress(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.handleSendMessage();
        }
    }

    /**
     * Обработчик отправки сообщения
     */
    async handleSendMessage() {
        const message = this.elements.messageInput.value.trim();
        if (!message) return;

        if (!this.state.isAuthenticated) {
            this.showNotification('Необходима аутентификация для отправки сообщений', 'warning');
            return;
        }

        console.log('📤 Отправка сообщения:', message);
        
        // Добавляем сообщение пользователя
        this.addUserMessage(message);
        
        // Очищаем поле ввода
        this.elements.messageInput.value = '';
        
        // Показываем индикатор загрузки
        this.showTypingIndicator();
        
        try {
            // Отправляем сообщение через ChatService
            if (this.chatService) {
                const response = await this.chatService.sendMessage(message);
                this.hideTypingIndicator();
                this.addAIMessage(response.content);
            } else {
                this.hideTypingIndicator();
                this.addAIMessage('ChatService не доступен. Попробуйте позже.');
            }
        } catch (error) {
            console.error('❌ Ошибка отправки сообщения:', error);
            this.hideTypingIndicator();
            this.addAIMessage('Произошла ошибка при обработке сообщения. Попробуйте позже.');
        }
    }

    /**
     * Обработчик голосового ввода
     */
    handleVoiceInput() {
        console.log('🎤 Голосовой ввод');
        if (this.state.isAuthenticated) {
            this.showNotification('Голосовой ввод в разработке', 'info');
        } else {
            this.showNotification('Необходима аутентификация', 'warning');
        }
    }

    /**
     * Добавить сообщение пользователя
     */
    addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message message-user animate-slide-up';
        messageElement.innerHTML = `
            <div class="message-content">
                ${this.escapeHtml(message)}
            </div>
        `;
        
        this.elements.chatArea.appendChild(messageElement);
        this.scrollToBottom();
    }

    /**
     * Добавить сообщение AI
     */
    addAIMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message message-ai animate-slide-up';
        messageElement.innerHTML = `
            <div class="message-content">
                ${this.escapeHtml(message)}
            </div>
        `;
        
        this.elements.chatArea.appendChild(messageElement);
        this.scrollToBottom();
    }

    /**
     * Показать индикатор печати
     */
    showTypingIndicator() {
        const typingElement = document.createElement('div');
        typingElement.className = 'message message-ai animate-slide-up';
        typingElement.id = 'typing-indicator';
        typingElement.innerHTML = `
            <div class="message-content">
                <div class="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        this.elements.chatArea.appendChild(typingElement);
        this.scrollToBottom();
    }

    /**
     * Скрыть индикатор печати
     */
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    /**
     * Очистить область чата
     */
    clearChatArea() {
        if (this.elements.chatArea) {
            this.elements.chatArea.innerHTML = '';
        }
    }

    /**
     * Добавить приветственное сообщение
     */
    addWelcomeMessage() {
        if (this.elements.chatArea) {
            const welcomeElement = document.createElement('div');
            welcomeElement.className = 'text-center text-blue-300 animate-fade-in';
            welcomeElement.innerHTML = `
                <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                </div>
                <h3 class="text-xl font-semibold mb-2">Добро пожаловать в Секретарь+!</h3>
                <p class="text-blue-200">Начните разговор с вашим AI-помощником</p>
            `;
            
            this.elements.chatArea.appendChild(welcomeElement);
        }
    }

    /**
     * Прокрутка к низу чата
     */
    scrollToBottom() {
        if (this.elements.chatArea) {
            this.elements.chatArea.scrollTop = this.elements.chatArea.scrollHeight;
        }
    }

    /**
     * Показать уведомление
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Автоматически скрыть через 3 секунды
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    /**
     * Экранирование HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Установка ChatService
     */
    setChatService(chatService) {
        this.chatService = chatService;
    }

    /**
     * Получить элемент по имени
     */
    getElement(name) {
        return this.elements[name];
    }

    /**
     * Проверить инициализацию
     */
    isReady() {
        return this.isInitialized;
    }

    /**
     * Получить состояние аутентификации
     */
    isAuthenticated() {
        return this.state.isAuthenticated;
    }
} 