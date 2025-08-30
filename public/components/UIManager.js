/**
 * UIManager - Управление пользовательским интерфейсом
 */
export class UIManager {
    constructor() {
        this.elements = {};
        this.isInitialized = false;
    }

    /**
     * Инициализация UI менеджера
     */
    async init() {
        try {
            this.initializeElements();
            this.bindEvents();
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
        // TODO: Реализовать функционал камеры
        this.showNotification('Функция камеры в разработке', 'info');
    }

    /**
     * Обработчик прикрепления файла
     */
    handleAttachFile() {
        console.log('📎 Прикрепление файла');
        // TODO: Реализовать функционал прикрепления файлов
        this.showNotification('Функция прикрепления файлов в разработке', 'info');
    }

    /**
     * Обработчик настроек
     */
    handleSettings() {
        console.log('⚙️ Настройки');
        // TODO: Реализовать модальное окно настроек
        this.showNotification('Настройки в разработке', 'info');
    }

    /**
     * Обработчик выхода
     */
    handleLogout() {
        console.log('🚪 Выход');
        if (confirm('Вы уверены, что хотите выйти?')) {
            this.logout();
        }
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
    handleSendMessage() {
        const message = this.elements.messageInput.value.trim();
        if (!message) return;

        console.log('📤 Отправка сообщения:', message);
        
        // Добавляем сообщение пользователя
        this.addUserMessage(message);
        
        // Очищаем поле ввода
        this.elements.messageInput.value = '';
        
        // Показываем индикатор загрузки
        this.showTypingIndicator();
        
        // TODO: Отправить сообщение в ChatService
        setTimeout(() => {
            this.hideTypingIndicator();
            this.addAIMessage('Это тестовый ответ AI. Функционал чата находится в разработке.');
        }, 2000);
    }

    /**
     * Обработчик голосового ввода
     */
    handleVoiceInput() {
        console.log('🎤 Голосовой ввод');
        // TODO: Реализовать голосовой ввод
        this.showNotification('Голосовой ввод в разработке', 'info');
    }

    /**
     * Обработчик Google Sign-in
     */
    handleGoogleSignIn() {
        console.log('🔐 Google Sign-in');
        // TODO: Реализовать Google аутентификацию
        this.showNotification('Google аутентификация в разработке', 'info');
        
        // Имитация успешной аутентификации
        setTimeout(() => {
            this.hideAuthScreen();
            this.showApp();
        }, 1000);
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
     * Выход из системы
     */
    logout() {
        // TODO: Реализовать очистку данных аутентификации
        this.hideApp();
        this.showAuthScreen();
        this.clearChatArea();
        this.showNotification('Вы успешно вышли из системы', 'success');
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
} 