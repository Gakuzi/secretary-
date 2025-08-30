/**
 * GeminiService - Сервис для работы с Google Gemini AI
 */
export class GeminiService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
        this.model = 'gemini-2.5-flash';
        this.isInitialized = false;
        
        if (!this.apiKey) {
            console.warn('⚠️ API ключ Gemini не настроен');
        }
    }

    /**
     * Инициализация сервиса
     */
    async init() {
        try {
            if (!this.apiKey) {
                throw new Error('API ключ Gemini не настроен');
            }

            // Проверяем доступность API
            await this.testConnection();
            
            this.isInitialized = true;
            console.log('✅ GeminiService инициализирован');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации GeminiService:', error);
            throw error;
        }
    }

    /**
     * Тестирование соединения с API
     */
    async testConnection() {
        const response = await this.generateResponse('Привет', { maxTokens: 10 });
        return response;
    }

    /**
     * Генерация ответа от AI
     */
    async generateResponse(prompt, options = {}) {
        if (!this.isInitialized) {
            throw new Error('GeminiService не инициализирован');
        }

        try {
            const requestBody = {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: options.temperature || 0.7,
                    topK: options.topK || 40,
                    topP: options.topP || 0.95,
                    maxOutputTokens: options.maxTokens || 2048,
                    stopSequences: options.stopSequences || []
                },
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            };

            const response = await fetch(`${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Gemini API Error: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error('Неожиданный формат ответа от Gemini API');
            }

        } catch (error) {
            console.error('❌ Ошибка генерации ответа:', error);
            throw error;
        }
    }

    /**
     * Анализ текста (почта, документы)
     */
    async analyzeText(text, analysisType = 'general') {
        const prompts = {
            email: `Проанализируй это email сообщение и предоставь краткое резюме:
                    - Основная тема
                    - Срочность
                    - Требуемые действия
                    - Ключевые детали
                    
                    Email: ${text}`,
            
            document: `Проанализируй этот документ и предоставь структурированное резюме:
                      - Основные разделы
                      - Ключевые выводы
                      - Важные даты/цифры
                      - Рекомендации
                      
                      Документ: ${text}`,
            
            calendar: `Проанализируй это событие календаря и предоставь краткую информацию:
                       - Тип события
                       - Время и продолжительность
                       - Участники
                       - Подготовка (если требуется)
                       
                       Событие: ${text}`,
            
            general: `Проанализируй этот текст и предоставь краткое резюме:
                      - Основная идея
                      - Ключевые моменты
                      - Выводы
                      
                      Текст: ${text}`
        };

        const prompt = prompts[analysisType] || prompts.general;
        return await this.generateResponse(prompt, { maxTokens: 500 });
    }

    /**
     * Генерация ответа на email
     */
    async generateEmailResponse(emailContent, tone = 'professional') {
        const tonePrompts = {
            professional: 'Профессиональный и вежливый',
            friendly: 'Дружелюбный и открытый',
            formal: 'Формальный и официальный',
            casual: 'Неформальный и расслабленный'
        };

        const prompt = `Сгенерируй профессиональный ответ на это email сообщение.
                       Тон: ${tonePrompts[tone]}
                       
                       Оригинальное сообщение:
                       ${emailContent}
                       
                       Требования к ответу:
                       - Краткость и ясность
                       - Соответствие тону
                       - Конкретность
                       - Вежливость
                       
                       Ответ:`;

        return await this.generateResponse(prompt, { maxTokens: 300 });
    }

    /**
     * Планирование задач
     */
    async planTasks(description, deadline = null, priority = 'medium') {
        const deadlineText = deadline ? `Срок: ${deadline}` : 'Срок не указан';
        
        const prompt = `Создай план задач на основе описания:
                       
                       Описание: ${description}
                       ${deadlineText}
                       Приоритет: ${priority}
                       
                       Создай структурированный план с:
                       - Разбивкой на подзадачи
                       - Оценкой времени для каждой задачи
                       - Рекомендациями по приоритизации
                       - Советами по эффективности
                       
                       План:`;

        return await this.generateResponse(prompt, { maxTokens: 600 });
    }

    /**
     * Анализ контактов и поиск
     */
    async analyzeContacts(contactInfo, searchQuery = null) {
        let prompt = `Проанализируй информацию о контакте:
                      
                      Контакт: ${contactInfo}`;

        if (searchQuery) {
            prompt += `\n\nПоисковый запрос: ${searchQuery}
                       Предоставь релевантную информацию по запросу.`;
        } else {
            prompt += `\n\nПредоставь:
                       - Краткую характеристику
                       - Возможные области сотрудничества
                       - Рекомендации по взаимодействию`;
        }

        return await this.generateResponse(prompt, { maxTokens: 400 });
    }

    /**
     * Обработка изображений (если поддерживается)
     */
    async analyzeImage(imageData, prompt = 'Опиши это изображение') {
        try {
            // Конвертируем изображение в base64
            const base64Image = await this.imageToBase64(imageData);
            
            const requestBody = {
                contents: [{
                    parts: [
                        {
                            text: prompt
                        },
                        {
                            inlineData: {
                                mimeType: "image/jpeg",
                                data: base64Image
                            }
                        }
                    ]
                }],
                generationConfig: {
                    temperature: 0.4,
                    topK: 32,
                    topP: 1,
                    maxOutputTokens: 1024,
                }
            };

            const response = await fetch(`${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`Gemini API Error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;

        } catch (error) {
            console.error('❌ Ошибка анализа изображения:', error);
            throw error;
        }
    }

    /**
     * Конвертация изображения в base64
     */
    async imageToBase64(imageData) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                const dataURL = canvas.toDataURL('image/jpeg', 0.8);
                const base64 = dataURL.split(',')[1];
                resolve(base64);
            };
            
            img.onerror = reject;
            img.src = imageData;
        });
    }

    /**
     * Получение статистики использования
     */
    async getUsageStats() {
        try {
            const response = await fetch(`${this.baseUrl}/${this.model}?key=${this.apiKey}`);
            
            if (!response.ok) {
                throw new Error(`Ошибка получения статистики: ${response.statusText}`);
            }

            const data = await response.json();
            return {
                model: data.name,
                description: data.description,
                supportedGenerationMethods: data.supportedGenerationMethods || [],
                supportedInputMethods: data.supportedInputMethods || []
            };

        } catch (error) {
            console.error('❌ Ошибка получения статистики:', error);
            return null;
        }
    }

    /**
     * Проверка готовности сервиса
     */
    isReady() {
        return this.isInitialized && !!this.apiKey;
    }

    /**
     * Обновление API ключа
     */
    updateApiKey(newApiKey) {
        this.apiKey = newApiKey;
        if (newApiKey) {
            this.init(); // Переинициализируем с новым ключом
        }
    }
} 