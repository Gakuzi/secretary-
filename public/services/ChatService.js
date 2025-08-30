/**
 * ChatService - Сервис для управления чатом и AI-взаимодействием
 */
export class ChatService {
    constructor() {
        this.conversationHistory = [];
        this.isInitialized = false;
        this.currentConversationId = null;
    }

    /**
     * Инициализация сервиса чата
     */
    async init() {
        try {
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

            // Показываем индикатор загрузки
            this.showTypingIndicator();

            // Имитируем задержку AI-ответа
            const aiResponse = await this.generateAIResponse(message, options);

            // Скрываем индикатор загрузки
            this.hideTypingIndicator();

            // Создаем объект сообщения AI
            const aiMessage = {
                id: this.generateMessageId(),
                type: 'assistant',
                content: aiResponse,
                timestamp: new Date().toISOString(),
                conversationId: this.currentConversationId
            };

            // Добавляем в историю
            this.addMessageToHistory(aiMessage);

            // Сохраняем в localStorage
            this.saveConversationHistory();

            return aiMessage;

        } catch (error) {
            console.error('❌ Ошибка отправки сообщения:', error);
            this.hideTypingIndicator();
            throw error;
        }
    }

    /**
     * Генерация AI-ответа
     */
    async generateAIResponse(message, options = {}) {
        // TODO: Интеграция с Google Gemini API
        // Пока возвращаем тестовые ответы
        
        const responses = [
            'Спасибо за ваше сообщение! Я - ваш AI-помощник Секретарь+. Как я могу вам помочь сегодня?',
            'Интересный вопрос! Давайте разберем его подробнее. Что именно вас интересует?',
            'Я понимаю ваш запрос. Позвольте мне помочь вам с этим вопросом.',
            'Отличная идея! Я готов помочь вам реализовать задуманное.',
            'Спасибо за обращение! Я работаю над улучшением своих возможностей.'
        ];

        // Имитируем задержку обработки
        await this.delay(1000 + Math.random() * 2000);

        // Возвращаем случайный ответ
        return responses[Math.floor(Math.random() * responses.length)];
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
                this.conversationHistory[this.conversationHistory.length - 1].timestamp : null
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
     * Задержка (для имитации)
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Показать индикатор печати
     */
    showTypingIndicator() {
        // Этот метод будет вызываться из UIManager
        // Здесь можно добавить логику для управления состоянием
    }

    /**
     * Скрыть индикатор печати
     */
    hideTypingIndicator() {
        // Этот метод будет вызываться из UIManager
        // Здесь можно добавить логику для управления состоянием
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
} 