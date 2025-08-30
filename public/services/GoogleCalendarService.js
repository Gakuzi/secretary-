/**
 * GoogleCalendarService - Сервис для работы с Google Calendar
 */
export class GoogleCalendarService {
    constructor() {
        this.isInitialized = false;
        this.gapi = null;
        this.calendarId = 'primary';
        this.accessToken = null;
        this.scopes = ['https://www.googleapis.com/auth/calendar'];
    }

    /**
     * Инициализация Google API
     */
    async init() {
        try {
            // Загружаем Google API
            await this.loadGoogleAPI();
            
            // Инициализируем клиент
            await this.initializeClient();
            
            this.isInitialized = true;
            console.log('✅ GoogleCalendarService инициализирован');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации GoogleCalendarService:', error);
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
                        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
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
        // TODO: Получить из конфигурации
        return localStorage.getItem('google-api-key') || '';
    }

    /**
     * Получение Client ID из конфигурации
     */
    getClientId() {
        // TODO: Получить из конфигурации
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
            
            console.log('✅ Пользователь авторизован в Google Calendar');
            return user;
            
        } catch (error) {
            console.error('❌ Ошибка авторизации:', error);
            throw error;
        }
    }

    /**
     * Выход из системы
     */
    async signOut() {
        try {
            const authInstance = this.gapi.auth2.getAuthInstance();
            await authInstance.signOut();
            this.accessToken = null;
            
            console.log('✅ Пользователь вышел из Google Calendar');
            
        } catch (error) {
            console.error('❌ Ошибка выхода:', error);
            throw error;
        }
    }

    /**
     * Получение событий календаря
     */
    async getEvents(options = {}) {
        try {
            const {
                timeMin = new Date().toISOString(),
                timeMax = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 дней
                maxResults = 50,
                singleEvents = true,
                orderBy = 'startTime'
            } = options;

            const response = await this.gapi.client.calendar.events.list({
                calendarId: this.calendarId,
                timeMin: timeMin,
                timeMax: timeMax,
                maxResults: maxResults,
                singleEvents: singleEvents,
                orderBy: orderBy
            });

            return response.result.items || [];
            
        } catch (error) {
            console.error('❌ Ошибка получения событий:', error);
            throw error;
        }
    }

    /**
     * Создание нового события
     */
    async createEvent(eventData) {
        try {
            const event = {
                summary: eventData.summary,
                description: eventData.description || '',
                start: {
                    dateTime: eventData.startTime,
                    timeZone: eventData.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                end: {
                    dateTime: eventData.endTime,
                    timeZone: eventData.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                attendees: eventData.attendees || [],
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: 'email', minutes: 24 * 60 },
                        { method: 'popup', minutes: 30 }
                    ]
                }
            };

            const response = await this.gapi.client.calendar.events.insert({
                calendarId: this.calendarId,
                resource: event
            });

            console.log('✅ Событие создано:', response.result.id);
            return response.result;
            
        } catch (error) {
            console.error('❌ Ошибка создания события:', error);
            throw error;
        }
    }

    /**
     * Обновление события
     */
    async updateEvent(eventId, eventData) {
        try {
            const response = await this.gapi.client.calendar.events.update({
                calendarId: this.calendarId,
                eventId: eventId,
                resource: eventData
            });

            console.log('✅ Событие обновлено:', eventId);
            return response.result;
            
        } catch (error) {
            console.error('❌ Ошибка обновления события:', error);
            throw error;
        }
    }

    /**
     * Удаление события
     */
    async deleteEvent(eventId) {
        try {
            await this.gapi.client.calendar.events.delete({
                calendarId: this.calendarId,
                eventId: eventId
            });

            console.log('✅ Событие удалено:', eventId);
            return true;
            
        } catch (error) {
            console.error('❌ Ошибка удаления события:', error);
            throw error;
        }
    }

    /**
     * Получение свободного времени
     */
    async getFreeBusy(timeMin, timeMax, calendarIds = [this.calendarId]) {
        try {
            const response = await this.gapi.client.calendar.freebusy.query({
                timeMin: timeMin,
                timeMax: timeMax,
                items: calendarIds.map(id => ({ id }))
            });

            return response.result;
            
        } catch (error) {
            console.error('❌ Ошибка получения свободного времени:', error);
            throw error;
        }
    }

    /**
     * Поиск событий
     */
    async searchEvents(query, options = {}) {
        try {
            const {
                timeMin = new Date().toISOString(),
                timeMax = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // +1 год
                maxResults = 100
            } = options;

            const response = await this.gapi.client.calendar.events.list({
                calendarId: this.calendarId,
                q: query,
                timeMin: timeMin,
                timeMax: timeMax,
                maxResults: maxResults,
                singleEvents: true,
                orderBy: 'startTime'
            });

            return response.result.items || [];
            
        } catch (error) {
            console.error('❌ Ошибка поиска событий:', error);
            throw error;
        }
    }

    /**
     * Получение календарей пользователя
     */
    async getCalendars() {
        try {
            const response = await this.gapi.client.calendar.calendarList.list();
            return response.result.items || [];
            
        } catch (error) {
            console.error('❌ Ошибка получения календарей:', error);
            throw error;
        }
    }

    /**
     * Создание нового календаря
     */
    async createCalendar(calendarData) {
        try {
            const calendar = {
                summary: calendarData.summary,
                description: calendarData.description || '',
                timeZone: calendarData.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone
            };

            const response = await this.gapi.client.calendar.calendars.insert({
                resource: calendar
            });

            console.log('✅ Календарь создан:', response.result.id);
            return response.result;
            
        } catch (error) {
            console.error('❌ Ошибка создания календаря:', error);
            throw error;
        }
    }

    /**
     * Экспорт событий в iCal формат
     */
    async exportEventsToICal(options = {}) {
        try {
            const events = await this.getEvents(options);
            
            let icalContent = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'PRODID:-//Секретарь+//RU',
                'CALSCALE:GREGORIAN',
                'METHOD:PUBLISH'
            ];

            events.forEach(event => {
                icalContent.push(
                    'BEGIN:VEVENT',
                    `UID:${event.id}`,
                    `DTSTART:${this.formatDateForICal(event.start.dateTime || event.start.date)}`,
                    `DTEND:${this.formatDateForICal(event.end.dateTime || event.end.date)}`,
                    `SUMMARY:${this.escapeICalText(event.summary || '')}`,
                    `DESCRIPTION:${this.escapeICalText(event.description || '')}`,
                    `LOCATION:${this.escapeICalText(event.location || '')}`,
                    'END:VEVENT'
                );
            });

            icalContent.push('END:VCALENDAR');

            const blob = new Blob([icalContent.join('\r\n')], { type: 'text/calendar' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `calendar-export-${new Date().toISOString().split('T')[0]}.ics`;
            a.click();

            URL.revokeObjectURL(url);
            
        } catch (error) {
            console.error('❌ Ошибка экспорта календаря:', error);
            throw error;
        }
    }

    /**
     * Форматирование даты для iCal
     */
    formatDateForICal(dateString) {
        const date = new Date(dateString);
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    }

    /**
     * Экранирование текста для iCal
     */
    escapeICalText(text) {
        return text
            .replace(/\\/g, '\\\\')
            .replace(/;/g, '\\;')
            .replace(/,/g, '\\,')
            .replace(/\n/g, '\\n');
    }

    /**
     * Получение статистики календаря
     */
    async getCalendarStats() {
        try {
            const events = await this.getEvents({ maxResults: 1000 });
            const now = new Date();
            
            const stats = {
                totalEvents: events.length,
                upcomingEvents: events.filter(e => new Date(e.start.dateTime || e.start.date) > now).length,
                pastEvents: events.filter(e => new Date(e.start.dateTime || e.start.date) <= now).length,
                eventsThisWeek: events.filter(e => {
                    const eventDate = new Date(e.start.dateTime || e.start.date);
                    const weekStart = new Date(now);
                    weekStart.setDate(now.getDate() - now.getDay());
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekStart.getDate() + 6);
                    return eventDate >= weekStart && eventDate <= weekEnd;
                }).length
            };

            return stats;
            
        } catch (error) {
            console.error('❌ Ошибка получения статистики:', error);
            return null;
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