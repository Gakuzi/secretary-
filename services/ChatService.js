/**
 * Сервис для работы с чатом и AI
 */
export class ChatService {
    constructor(config) {
        this.config = config;
        this.isInitialized = false;
        this.conversationHistory = [];
    }

    /**
     * Инициализация сервиса
     */
    async init() {
        try {
            console.log('🔧 Инициализация ChatService...');
            this.isInitialized = true;
            console.log('✅ ChatService инициализирован');
        } catch (error) {
            console.error('❌ Ошибка инициализации ChatService:', error);
            throw error;
        }
    }

    /**
     * Отправка сообщения
     */
    async sendMessage(message, attachments = []) {
        try {
            if (!this.isInitialized) {
                throw new Error('ChatService не инициализирован');
            }

            console.log('📤 Отправка сообщения:', message);
            
            // Здесь будет логика отправки в Gemini AI
            // Пока возвращаем заглушку
            const response = {
                id: Date.now(),
                text: 'Это тестовый ответ от AI. Сервис Gemini будет подключен позже.',
                timestamp: new Date().toISOString(),
                type: 'ai'
            };

            this.conversationHistory.push({
                user: message,
                ai: response
            });

            return response;
        } catch (error) {
            console.error('❌ Ошибка отправки сообщения:', error);
            throw error;
        }
    }

    /**
     * Получение истории чата
     */
    getConversationHistory() {
        return this.conversationHistory;
    }

    /**
     * Очистка истории
     */
    clearHistory() {
        this.conversationHistory = [];
    }
} 