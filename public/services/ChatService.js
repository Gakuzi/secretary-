/**
 * ChatService - Сервис для управления чатом и AI-взаимодействием
 */
import { GeminiService } from './GeminiService.js';
import { GoogleCalendarService } from './GoogleCalendarService.js';
import { GmailService } from './GmailService.js';

export class ChatService {
    constructor() {
        this.conversationHistory = [];
        this.isInitialized = false;
        this.currentConversationId = null;
        
        // Сервисы
        this.geminiService = null;
        this.calendarService = null;
        this.gmailService = null;
        
        // Контекст разговора
        this.context = {
            lastEmail: null,
            lastCalendarEvent: null,
            userPreferences: {},
            currentTask: null
        };
    }

    /**
     * Инициализация сервиса чата
     */
    async init() {
        try {
            // Инициализируем Gemini AI
            const apiKey = localStorage.getItem('gemini-api-key');
            if (apiKey) {
                this.geminiService = new GeminiService(apiKey);
                await this.geminiService.init();
            }

            // Инициализируем Google сервисы
            this.calendarService = new GoogleCalendarService();
            this.gmailService = new GmailService();
            
            // Загружаем историю из localStorage
            this.loadConversationHistory();
            
            // Создаем новый ID для текущей сессии
            this.currentConversationId = this.generateConversationId();
            
            this.isInitialized = true;
            console.log('✅ ChatService инициализирован');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации ChatService:', error);
        }
    }

    /**
     * Отправка сообщения
     */
    async sendMessage(message, options = {}) {
        if (!this.isInitialized) {
            throw new Error('ChatService не инициализирован');
        }

        try {
            // Создаем объект сообщения пользователя
            const userMessage = {
                id: this.generateMessageId(),
                type: 'user',
                content: message,
                timestamp: new Date().toISOString(),
                conversationId: this.currentConversationId
            };

            // Добавляем в историю
            this.addMessageToHistory(userMessage);

            // Анализируем сообщение и определяем тип запроса
            const messageType = this.analyzeMessageType(message);
            
            // Обрабатываем сообщение в зависимости от типа
            let aiResponse;
            switch (messageType) {
                case 'calendar':
                    aiResponse = await this.handleCalendarRequest(message);
                    break;
                case 'email':
                    aiResponse = await this.handleEmailRequest(message);
                    break;
                case 'task':
                    aiResponse = await this.handleTaskRequest(message);
                    break;
                case 'contact':
                    aiResponse = await this.handleContactRequest(message);
                    break;
                case 'document':
                    aiResponse = await this.handleDocumentRequest(message);
                    break;
                default:
                    aiResponse = await this.generateGeneralResponse(message);
            }

            // Создаем объект сообщения AI
            const aiMessage = {
                id: this.generateMessageId(),
                type: 'assistant',
                content: aiResponse,
                timestamp: new Date().toISOString(),
                conversationId: this.currentConversationId,
                messageType: messageType
            };

            // Добавляем в историю
            this.addMessageToHistory(aiMessage);

            // Сохраняем в localStorage
            this.saveConversationHistory();

            return aiMessage;

        } catch (error) {
            console.error('❌ Ошибка отправки сообщения:', error);
            throw error;
        }
    }

    /**
     * Анализ типа сообщения
     */
    analyzeMessageType(message) {
        const lowerMessage = message.toLowerCase();
        
        // Календарь
        if (lowerMessage.includes('календар') || lowerMessage.includes('встреч') || 
            lowerMessage.includes('событие') || lowerMessage.includes('планир') ||
            lowerMessage.includes('расписание') || lowerMessage.includes('время')) {
            return 'calendar';
        }
        
        // Email
        if (lowerMessage.includes('почт') || lowerMessage.includes('email') || 
            lowerMessage.includes('письм') || lowerMessage.includes('сообщени')) {
            return 'email';
        }
        
        // Задачи
        if (lowerMessage.includes('задач') || lowerMessage.includes('дел') || 
            lowerMessage.includes('планир') || lowerMessage.includes('проект')) {
            return 'task';
        }
        
        // Контакты
        if (lowerMessage.includes('контакт') || lowerMessage.includes('человек') || 
            lowerMessage.includes('коллег') || lowerMessage.includes('друг')) {
            return 'contact';
        }
        
        // Документы
        if (lowerMessage.includes('документ') || lowerMessage.includes('файл') || 
            lowerMessage.includes('анализ') || lowerMessage.includes('текст')) {
            return 'document';
        }
        
        return 'general';
    }

    /**
     * Обработка запроса календаря
     */
    async handleCalendarRequest(message) {
        try {
            if (!this.geminiService || !this.geminiService.isReady()) {
                return 'Для работы с календарем необходимо настроить Gemini AI. Пожалуйста, добавьте API ключ в настройках.';
            }

            // Анализируем запрос через Gemini
            const prompt = `Пользователь просит о календаре: "${message}". 
                           Предоставь полезную информацию и рекомендации по управлению календарем.
                           Если это запрос на создание события, предложи структуру события.`;

            const response = await this.geminiService.generateResponse(prompt, { maxTokens: 400 });
            
            // Если это запрос на создание события, предлагаем форму
            if (message.toLowerCase().includes('созда') || message.toLowerCase().includes('добав')) {
                return response + '\n\nДля создания события используйте кнопку "Новое событие" в верхней панели.';
            }

            return response;

        } catch (error) {
            console.error('❌ Ошибка обработки запроса календаря:', error);
            return 'Извините, произошла ошибка при обработке запроса календаря. Попробуйте позже.';
        }
    }

    /**
     * Обработка запроса email
     */
    async handleEmailRequest(message) {
        try {
            if (!this.geminiService || !this.geminiService.isReady()) {
                return 'Для работы с почтой необходимо настроить Gemini AI. Пожалуйста, добавьте API ключ в настройках.';
            }

            const prompt = `Пользователь просит о почте: "${message}". 
                           Предоставь полезную информацию и рекомендации по управлению почтой.
                           Если это запрос на анализ письма, объясни как это сделать.`;

            const response = await this.geminiService.generateResponse(prompt, { maxTokens: 400 });
            
            // Если это запрос на отправку письма, предлагаем форму
            if (message.toLowerCase().includes('отправ') || message.toLowerCase().includes('написа')) {
                return response + '\n\nДля отправки письма используйте кнопку "Новое письмо" в верхней панели.';
            }

            return response;

        } catch (error) {
            console.error('❌ Ошибка обработки запроса email:', error);
            return 'Извините, произошла ошибка при обработке запроса почты. Попробуйте позже.';
        }
    }

    /**
     * Обработка запроса задач
     */
    async handleTaskRequest(message) {
        try {
            if (!this.geminiService || !this.geminiService.isReady()) {
                return 'Для планирования задач необходимо настроить Gemini AI. Пожалуйста, добавьте API ключ в настройках.';
            }

            const prompt = `Пользователь просит о планировании задач: "${message}". 
                           Предоставь структурированный план с разбивкой на подзадачи,
                           оценкой времени и рекомендациями по приоритизации.`;

            return await this.geminiService.generateResponse(prompt, { maxTokens: 600 });

        } catch (error) {
            console.error('❌ Ошибка обработки запроса задач:', error);
            return 'Извините, произошла ошибка при планировании задач. Попробуйте позже.';
        }
    }

    /**
     * Обработка запроса контактов
     */
    async handleContactRequest(message) {
        try {
            if (!this.geminiService || !this.geminiService.isReady()) {
                return 'Для работы с контактами необходимо настроить Gemini AI. Пожалуйста, добавьте API ключ в настройках.';
            }

            const prompt = `Пользователь просит о контактах: "${message}". 
                           Предоставь рекомендации по управлению контактами,
                           поиску и организации информации о людях.`;

            return await this.geminiService.generateResponse(prompt, { maxTokens: 400 });

        } catch (error) {
            console.error('❌ Ошибка обработки запроса контактов:', error);
            return 'Извините, произошла ошибка при работе с контактами. Попробуйте позже.';
        }
    }

    /**
     * Обработка запроса документов
     */
    async handleDocumentRequest(message) {
        try {
            if (!this.geminiService || !this.geminiService.isReady()) {
                return 'Для анализа документов необходимо настроить Gemini AI. Пожалуйста, добавьте API ключ в настройках.';
            }

            const prompt = `Пользователь просит о документах: "${message}". 
                           Предоставь рекомендации по анализу документов,
                           извлечению ключевой информации и организации файлов.`;

            return await this.geminiService.generateResponse(prompt, { maxTokens: 400 });

        } catch (error) {
            console.error('❌ Ошибка обработки запроса документов:', error);
            return 'Извините, произошла ошибка при работе с документами. Попробуйте позже.';
        }
    }

    /**
     * Генерация общего ответа
     */
    async generateGeneralResponse(message) {
        try {
            if (!this.geminiService || !this.geminiService.isReady()) {
                return 'Привет! Я ваш AI-помощник Секретарь+. Для полноценной работы необходимо настроить Gemini AI в настройках. Чем могу помочь?';
            }

            const prompt = `Ты - Секретарь+, интеллектуальный помощник для управления продуктивностью.
                           Пользователь написал: "${message}"
                           
                           Ответь полезно и по делу, предложи конкретные действия если это уместно.
                           Фокус на продуктивности, организации и эффективности.`;

            return await this.geminiService.generateResponse(prompt, { maxTokens: 500 });

        } catch (error) {
            console.error('❌ Ошибка генерации ответа:', error);
            return 'Извините, произошла ошибка при генерации ответа. Попробуйте позже.';
        }
    }

    /**
     * Анализ текста через Gemini
     */
    async analyzeText(text, analysisType = 'general') {
        try {
            if (!this.geminiService || !this.geminiService.isReady()) {
                throw new Error('Gemini AI не настроен');
            }

            return await this.geminiService.analyzeText(text, analysisType);

        } catch (error) {
            console.error('❌ Ошибка анализа текста:', error);
            throw error;
        }
    }

    /**
     * Генерация ответа на email
     */
    async generateEmailResponse(emailContent, tone = 'professional') {
        try {
            if (!this.geminiService || !this.geminiService.isReady()) {
                throw new Error('Gemini AI не настроен');
            }

            return await this.geminiService.generateEmailResponse(emailContent, tone);

        } catch (error) {
            console.error('❌ Ошибка генерации ответа на email:', error);
            throw error;
        }
    }

    /**
     * Планирование задач
     */
    async planTasks(description, deadline = null, priority = 'medium') {
        try {
            if (!this.geminiService || !this.geminiService.isReady()) {
                throw new Error('Gemini AI не настроен');
            }

            return await this.geminiService.planTasks(description, deadline, priority);

        } catch (error) {
            console.error('❌ Ошибка планирования задач:', error);
            throw error;
        }
    }

    /**
     * Анализ контактов
     */
    async analyzeContacts(contactInfo, searchQuery = null) {
        try {
            if (!this.geminiService || !this.geminiService.isReady()) {
                throw new Error('Gemini AI не настроен');
            }

            return await this.geminiService.analyzeContacts(contactInfo, searchQuery);

        } catch (error) {
            console.error('❌ Ошибка анализа контактов:', error);
            throw error;
        }
    }

    /**
     * Анализ изображения
     */
    async analyzeImage(imageData, prompt = 'Опиши это изображение') {
        try {
            if (!this.geminiService || !this.geminiService.isReady()) {
                throw new Error('Gemini AI не настроен');
            }

            return await this.geminiService.analyzeImage(imageData, prompt);

        } catch (error) {
            console.error('❌ Ошибка анализа изображения:', error);
            throw error;
        }
    }

    /**
     * Получение истории разговора
     */
    getConversationHistory(conversationId = null) {
        const targetId = conversationId || this.currentConversationId;
        return this.conversationHistory.filter(msg => msg.conversationId === targetId);
    }

    /**
     * Получение всех разговоров
     */
    getAllConversations() {
        const conversations = {};
        
        this.conversationHistory.forEach(message => {
            if (!conversations[message.conversationId]) {
                conversations[message.conversationId] = {
                    id: message.conversationId,
                    messages: [],
                    lastMessage: message.timestamp,
                    messageCount: 0
                };
            }
            conversations[message.conversationId].messages.push(message);
            conversations[message.conversationId].messageCount++;
        });

        // Сортируем по времени последнего сообщения
        return Object.values(conversations).sort((a, b) => 
            new Date(b.lastMessage) - new Date(a.lastMessage)
        );
    }

    /**
     * Очистка истории
     */
    clearHistory(conversationId = null) {
        if (conversationId) {
            this.conversationHistory = this.conversationHistory.filter(
                msg => msg.conversationId !== conversationId
            );
        } else {
            this.conversationHistory = [];
        }
        
        this.saveConversationHistory();
    }

    /**
     * Создание нового разговора
     */
    createNewConversation() {
        this.currentConversationId = this.generateConversationId();
        console.log('🆕 Создан новый разговор:', this.currentConversationId);
        return this.currentConversationId;
    }

    /**
     * Переключение на существующий разговор
     */
    switchConversation(conversationId) {
        if (this.conversationHistory.some(msg => msg.conversationId === conversationId)) {
            this.currentConversationId = conversationId;
            console.log('🔄 Переключен на разговор:', conversationId);
            return true;
        }
        return false;
    }

    /**
     * Экспорт истории разговора
     */
    exportConversation(conversationId = null) {
        const targetId = conversationId || this.currentConversationId;
        const messages = this.getConversationHistory(targetId);
        
        const exportData = {
            conversationId: targetId,
            exportDate: new Date().toISOString(),
            messageCount: messages.length,
            messages: messages
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `conversation-${targetId}-${new Date().toISOString().split('T')[0]}.json`;
        a.click();

        URL.revokeObjectURL(url);
    }

    /**
     * Поиск по истории
     */
    searchInHistory(query, conversationId = null) {
        const targetId = conversationId || this.currentConversationId;
        const messages = this.getConversationHistory(targetId);
        
        if (!query || query.trim().length < 2) {
            return [];
        }

        const searchTerm = query.toLowerCase();
        
        return messages.filter(message => 
            message.content.toLowerCase().includes(searchTerm)
        );
    }

    /**
     * Анализ настроения разговора
     */
    analyzeConversationSentiment(conversationId = null) {
        const targetId = conversationId || this.currentConversationId;
        const messages = this.getConversationHistory(targetId);
        
        if (messages.length === 0) {
            return { sentiment: 'neutral', confidence: 0 };
        }

        // Простой анализ на основе ключевых слов
        const positiveWords = ['спасибо', 'отлично', 'хорошо', 'нравится', 'люблю', 'рад'];
        const negativeWords = ['плохо', 'ужасно', 'ненавижу', 'злой', 'грустно', 'разочарован'];
        
        let positiveCount = 0;
        let negativeCount = 0;
        
        messages.forEach(message => {
            const content = message.content.toLowerCase();
            
            positiveWords.forEach(word => {
                if (content.includes(word)) positiveCount++;
            });
            
            negativeWords.forEach(word => {
                if (content.includes(word)) negativeCount++;
            });
        });

        if (positiveCount > negativeCount) {
            return { sentiment: 'positive', confidence: Math.min(positiveCount / messages.length, 1) };
        } else if (negativeCount > positiveCount) {
            return { sentiment: 'negative', confidence: Math.min(negativeCount / messages.length, 1) };
        } else {
            return { sentiment: 'neutral', confidence: 0.5 };
        }
    }

    /**
     * Получение статистики
     */
    getStatistics() {
        const conversations = this.getAllConversations();
        const totalMessages = this.conversationHistory.length;
        const totalConversations = conversations.length;
        
        let totalUserMessages = 0;
        let totalAIMessages = 0;
        
        this.conversationHistory.forEach(message => {
            if (message.type === 'user') {
                totalUserMessages++;
            } else if (message.type === 'assistant') {
                totalAIMessages++;
            }
        });

        return {
            totalMessages,
            totalConversations,
            totalUserMessages,
            totalAIMessages,
            averageMessagesPerConversation: totalConversations > 0 ? totalMessages / totalConversations : 0,
            lastActivity: this.conversationHistory.length > 0 ? 
                this.conversationHistory[this.conversationHistory.length - 1].timestamp : null,
            geminiService: this.geminiService ? this.geminiService.isReady() : false,
            calendarService: this.calendarService ? this.calendarService.isReady() : false,
            gmailService: this.gmailService ? this.gmailService.isReady() : false
        };
    }

    /**
     * Добавление сообщения в историю
     */
    addMessageToHistory(message) {
        this.conversationHistory.push(message);
        
        // Ограничиваем размер истории (максимум 1000 сообщений)
        if (this.conversationHistory.length > 1000) {
            this.conversationHistory = this.conversationHistory.slice(-1000);
        }
    }

    /**
     * Сохранение истории в localStorage
     */
    saveConversationHistory() {
        try {
            localStorage.setItem('secretary-plus-chat-history', JSON.stringify(this.conversationHistory));
        } catch (error) {
            console.warn('⚠️ Не удалось сохранить историю чата:', error);
        }
    }

    /**
     * Загрузка истории из localStorage
     */
    loadConversationHistory() {
        try {
            const saved = localStorage.getItem('secretary-plus-chat-history');
            if (saved) {
                this.conversationHistory = JSON.parse(saved);
                console.log('📚 Загружена история чата:', this.conversationHistory.length, 'сообщений');
            }
        } catch (error) {
            console.warn('⚠️ Не удалось загрузить историю чата:', error);
            this.conversationHistory = [];
        }
    }

    /**
     * Генерация ID разговора
     */
    generateConversationId() {
        return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Генерация ID сообщения
     */
    generateMessageId() {
        return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Проверка готовности сервиса
     */
    isReady() {
        return this.isInitialized;
    }

    /**
     * Получение текущего ID разговора
     */
    getCurrentConversationId() {
        return this.currentConversationId;
    }

    /**
     * Получение Gemini сервиса
     */
    getGeminiService() {
        return this.geminiService;
    }

    /**
     * Получение Calendar сервиса
     */
    getCalendarService() {
        return this.calendarService;
    }

    /**
     * Получение Gmail сервиса
     */
    getGmailService() {
        return this.gmailService;
    }
} 