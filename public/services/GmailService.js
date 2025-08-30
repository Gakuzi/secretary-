/**
 * GmailService - Сервис для работы с Gmail
 */
export class GmailService {
    constructor() {
        this.isInitialized = false;
        this.gapi = null;
        this.accessToken = null;
        this.scopes = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send'];
    }

    /**
     * Инициализация Gmail API
     */
    async init() {
        try {
            // Загружаем Google API
            await this.loadGoogleAPI();
            
            // Инициализируем клиент
            await this.initializeClient();
            
            this.isInitialized = true;
            console.log('✅ GmailService инициализирован');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации GmailService:', error);
            throw error;
        }
    }

    /**
     * Загрузка Google API
     */
    loadGoogleAPI() {
        return new Promise((resolve, reject) => {
            if (window.gapi) {
                this.gapi = window.gapi;
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = () => {
                this.gapi = window.gapi;
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Инициализация клиента
     */
    async initializeClient() {
        return new Promise((resolve, reject) => {
            this.gapi.load('client:auth2', async () => {
                try {
                    await this.gapi.client.init({
                        apiKey: this.getApiKey(),
                        clientId: this.getClientId(),
                        scope: this.scopes.join(' '),
                        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest']
                    });

                    // Проверяем статус авторизации
                    const authInstance = this.gapi.auth2.getAuthInstance();
                    if (authInstance.isSignedIn.get()) {
                        this.accessToken = authInstance.currentUser.get().getAuthResponse().access_token;
                    }

                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    /**
     * Получение API ключа из конфигурации
     */
    getApiKey() {
        return localStorage.getItem('google-api-key') || '';
    }

    /**
     * Получение Client ID из конфигурации
     */
    getClientId() {
        return localStorage.getItem('google-client-id') || '';
    }

    /**
     * Авторизация пользователя
     */
    async authenticate() {
        try {
            const authInstance = this.gapi.auth2.getAuthInstance();
            const user = await authInstance.signIn();
            this.accessToken = user.getAuthResponse().access_token;
            
            console.log('✅ Пользователь авторизован в Gmail');
            return user;
            
        } catch (error) {
            console.error('❌ Ошибка авторизации:', error);
            throw error;
        }
    }

    /**
     * Получение списка писем
     */
    async getMessages(options = {}) {
        try {
            const {
                maxResults = 20,
                q = '',
                labelIds = ['INBOX'],
                includeSpamTrash = false
            } = options;

            const response = await this.gapi.client.gmail.users.messages.list({
                userId: 'me',
                maxResults: maxResults,
                q: q,
                labelIds: labelIds,
                includeSpamTrash: includeSpamTrash
            });

            const messages = response.result.messages || [];
            
            // Получаем детали для каждого письма
            const detailedMessages = await Promise.all(
                messages.map(msg => this.getMessageDetails(msg.id))
            );

            return detailedMessages.filter(msg => msg !== null);
            
        } catch (error) {
            console.error('❌ Ошибка получения писем:', error);
            throw error;
        }
    }

    /**
     * Получение деталей письма
     */
    async getMessageDetails(messageId) {
        try {
            const response = await this.gapi.client.gmail.users.messages.get({
                userId: 'me',
                id: messageId,
                format: 'full'
            });

            const message = response.result;
            return this.parseGmailMessage(message);
            
        } catch (error) {
            console.error('❌ Ошибка получения деталей письма:', error);
            return null;
        }
    }

    /**
     * Парсинг Gmail сообщения
     */
    parseGmailMessage(message) {
        try {
            const headers = message.payload.headers;
            const subject = headers.find(h => h.name === 'Subject')?.value || 'Без темы';
            const from = headers.find(h => h.name === 'From')?.value || 'Неизвестно';
            const to = headers.find(h => h.name === 'To')?.value || '';
            const date = headers.find(h => h.name === 'Date')?.value || '';
            const messageId = headers.find(h => h.name === 'Message-ID')?.value || '';

            // Получаем тело письма
            const body = this.extractMessageBody(message.payload);

            return {
                id: message.id,
                threadId: message.threadId,
                subject: subject,
                from: from,
                to: to,
                date: date,
                messageId: messageId,
                body: body,
                snippet: message.snippet,
                labelIds: message.labelIds || [],
                sizeEstimate: message.sizeEstimate
            };
            
        } catch (error) {
            console.error('❌ Ошибка парсинга письма:', error);
            return null;
        }
    }

    /**
     * Извлечение тела письма
     */
    extractMessageBody(payload) {
        if (payload.body && payload.body.data) {
            return this.decodeBase64(payload.body.data);
        }

        if (payload.parts) {
            for (const part of payload.parts) {
                if (part.mimeType === 'text/plain' && part.body && part.body.data) {
                    return this.decodeBase64(part.body.data);
                }
                if (part.mimeType === 'text/html' && part.body && part.body.data) {
                    return this.decodeBase64(part.body.data);
                }
            }
        }

        return '';
    }

    /**
     * Декодирование base64
     */
    decodeBase64(str) {
        try {
            return decodeURIComponent(escape(atob(str)));
        } catch (error) {
            try {
                return atob(str);
            } catch (e) {
                return str;
            }
        }
    }

    /**
     * Отправка письма
     */
    async sendEmail(emailData) {
        try {
            const email = this.createEmailMessage(emailData);
            const encodedEmail = btoa(email).replace(/\+/g, '-').replace(/\//g, '_');

            const response = await this.gapi.client.gmail.users.messages.send({
                userId: 'me',
                resource: {
                    raw: encodedEmail
                }
            });

            console.log('✅ Письмо отправлено:', response.result.id);
            return response.result;
            
        } catch (error) {
            console.error('❌ Ошибка отправки письма:', error);
            throw error;
        }
    }

    /**
     * Создание email сообщения
     */
    createEmailMessage(emailData) {
        const boundary = 'boundary_' + Math.random().toString(36).substr(2, 9);
        const date = new Date().toUTCString();
        
        let email = [
            `From: ${emailData.from}`,
            `To: ${emailData.to}`,
            `Subject: ${emailData.subject}`,
            `Date: ${date}`,
            `MIME-Version: 1.0`,
            `Content-Type: multipart/alternative; boundary="${boundary}"`,
            '',
            `--${boundary}`,
            `Content-Type: text/plain; charset=UTF-8`,
            `Content-Transfer-Encoding: 7bit`,
            '',
            emailData.body,
            '',
            `--${boundary}`,
            `Content-Type: text/html; charset=UTF-8`,
            `Content-Transfer-Encoding: 7bit`,
            '',
            emailData.htmlBody || emailData.body.replace(/\n/g, '<br>'),
            '',
            `--${boundary}--`
        ].join('\r\n');

        return email;
    }

    /**
     * Поиск писем
     */
    async searchEmails(query, options = {}) {
        try {
            const searchQuery = this.buildSearchQuery(query);
            return await this.getMessages({ ...options, q: searchQuery });
            
        } catch (error) {
            console.error('❌ Ошибка поиска писем:', error);
            throw error;
        }
    }

    /**
     * Построение поискового запроса
     */
    buildSearchQuery(query) {
        const searchTerms = [];
        
        if (query.subject) {
            searchTerms.push(`subject:${query.subject}`);
        }
        
        if (query.from) {
            searchTerms.push(`from:${query.from}`);
        }
        
        if (query.to) {
            searchTerms.push(`to:${query.to}`);
        }
        
        if (query.hasAttachment) {
            searchTerms.push('has:attachment');
        }
        
        if (query.isUnread) {
            searchTerms.push('is:unread');
        }
        
        if (query.isRead) {
            searchTerms.push('is:read');
        }
        
        if (query.after) {
            searchTerms.push(`after:${query.after}`);
        }
        
        if (query.before) {
            searchTerms.push(`before:${query.before}`);
        }
        
        if (query.label) {
            searchTerms.push(`label:${query.label}`);
        }
        
        return searchTerms.join(' ');
    }

    /**
     * Получение меток (labels)
     */
    async getLabels() {
        try {
            const response = await this.gapi.client.gmail.users.labels.list({
                userId: 'me'
            });

            return response.result.labels || [];
            
        } catch (error) {
            console.error('❌ Ошибка получения меток:', error);
            throw error;
        }
    }

    /**
     * Создание метки
     */
    async createLabel(labelData) {
        try {
            const response = await this.gapi.client.gmail.users.labels.create({
                userId: 'me',
                resource: {
                    name: labelData.name,
                    messageListVisibility: labelData.messageListVisibility || 'show',
                    labelListVisibility: labelData.labelListVisibility || 'labelShow'
                }
            });

            console.log('✅ Метка создана:', response.result.id);
            return response.result;
            
        } catch (error) {
            console.error('❌ Ошибка создания метки:', error);
            throw error;
        }
    }

    /**
     * Удаление метки
     */
    async deleteLabel(labelId) {
        try {
            await this.gapi.client.gmail.users.labels.delete({
                userId: 'me',
                id: labelId
            });

            console.log('✅ Метка удалена:', labelId);
            return true;
            
        } catch (error) {
            console.error('❌ Ошибка удаления метки:', error);
            throw error;
        }
    }

    /**
     * Получение профиля пользователя
     */
    async getUserProfile() {
        try {
            const response = await this.gapi.client.gmail.users.getProfile({
                userId: 'me'
            });

            return response.result;
            
        } catch (error) {
            console.error('❌ Ошибка получения профиля:', error);
            throw error;
        }
    }

    /**
     * Получение статистики почты
     */
    async getMailStats() {
        try {
            const response = await this.gapi.client.gmail.users.getProfile({
                userId: 'me'
            });

            const profile = response.result;
            
            // Получаем количество писем в разных папках
            const inboxResponse = await this.gapi.client.gmail.users.messages.list({
                userId: 'me',
                labelIds: ['INBOX'],
                maxResults: 1
            });

            const sentResponse = await this.gapi.client.gmail.users.messages.list({
                userId: 'me',
                labelIds: ['SENT'],
                maxResults: 1
            });

            const draftResponse = await this.gapi.client.gmail.users.messages.list({
                userId: 'me',
                labelIds: ['DRAFT'],
                maxResults: 1
            });

            return {
                emailAddress: profile.emailAddress,
                messagesTotal: profile.messagesTotal,
                threadsTotal: profile.threadsTotal,
                historyId: profile.historyId,
                inboxCount: inboxResponse.result.resultSizeEstimate || 0,
                sentCount: sentResponse.result.resultSizeEstimate || 0,
                draftCount: draftResponse.result.resultSizeEstimate || 0
            };
            
        } catch (error) {
            console.error('❌ Ошибка получения статистики:', error);
            return null;
        }
    }

    /**
     * Экспорт писем
     */
    async exportEmails(options = {}) {
        try {
            const messages = await this.getMessages(options);
            
            const exportData = {
                exportDate: new Date().toISOString(),
                messageCount: messages.length,
                messages: messages.map(msg => ({
                    id: msg.id,
                    subject: msg.subject,
                    from: msg.from,
                    to: msg.to,
                    date: msg.date,
                    body: msg.body,
                    snippet: msg.snippet
                }))
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `gmail-export-${new Date().toISOString().split('T')[0]}.json`;
            a.click();

            URL.revokeObjectURL(url);
            
        } catch (error) {
            console.error('❌ Ошибка экспорта писем:', error);
            throw error;
        }
    }

    /**
     * Проверка готовности сервиса
     */
    isReady() {
        return this.isInitialized && !!this.gapi;
    }

    /**
     * Проверка авторизации
     */
    isAuthenticated() {
        return !!this.accessToken;
    }
} 