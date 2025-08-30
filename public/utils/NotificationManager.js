// Менеджер уведомлений
import { NOTIFICATION_TYPES } from '../constants.js';

/**
 * Класс для управления уведомлениями
 */
export class NotificationManager {
    constructor() {
        this.notifications = [];
        this.container = null;
        this.settings = {
            enabled: true,
            soundEnabled: true,
            desktopEnabled: false,
            duration: 5000,
            maxNotifications: 5
        };
        
        this.init();
    }

    /**
     * Инициализация менеджера уведомлений
     */
    init() {
        this.createContainer();
        this.loadSettings();
        this.requestPermission();
    }

    /**
     * Создание контейнера для уведомлений
     */
    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        this.container.className = 'fixed top-4 right-4 z-50 space-y-2';
        document.body.appendChild(this.container);
    }

    /**
     * Загрузка настроек уведомлений
     */
    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('secretary_plus_notification_settings');
            if (savedSettings) {
                this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
            }
        } catch (error) {
            console.error('Ошибка загрузки настроек уведомлений:', error);
        }
    }

    /**
     * Сохранение настроек уведомлений
     */
    saveSettings() {
        try {
            localStorage.setItem('secretary_plus_notification_settings', JSON.stringify(this.settings));
        } catch (error) {
            console.error('Ошибка сохранения настроек уведомлений:', error);
        }
    }

    /**
     * Запрос разрешения на уведомления
     */
    async requestPermission() {
        if (!('Notification' in window)) {
            console.warn('Уведомления не поддерживаются в этом браузере');
            return;
        }

        if (Notification.permission === 'default') {
            try {
                const permission = await Notification.requestPermission();
                this.settings.desktopEnabled = permission === 'granted';
                this.saveSettings();
            } catch (error) {
                console.error('Ошибка запроса разрешения на уведомления:', error);
            }
        } else {
            this.settings.desktopEnabled = Notification.permission === 'granted';
        }
    }

    /**
     * Показ уведомления
     * @param {Object} options - Опции уведомления
     * @param {string} options.type - Тип уведомления (success, error, warning, info)
     * @param {string} options.title - Заголовок уведомления
     * @param {string} options.message - Сообщение уведомления
     * @param {number} [options.duration] - Длительность показа (в мс)
     * @param {Function} [options.onClick] - Обработчик клика
     * @param {boolean} [options.dismissible] - Можно ли закрыть
     * @param {Object} [options.actions] - Действия уведомления
     */
    show(options) {
        if (!this.settings.enabled) {
            return;
        }

        const notification = this.createNotification(options);
        this.notifications.push(notification);
        this.container.appendChild(notification);

        // Ограничиваем количество уведомлений
        if (this.notifications.length > this.settings.maxNotifications) {
            const oldestNotification = this.notifications.shift();
            if (oldestNotification && oldestNotification.parentNode) {
                oldestNotification.parentNode.removeChild(oldestNotification);
            }
        }

        // Автоматическое скрытие
        const duration = options.duration || this.settings.duration;
        if (duration > 0) {
            setTimeout(() => {
                this.hide(notification);
            }, duration);
        }

        // Воспроизведение звука
        if (this.settings.soundEnabled) {
            this.playSound(options.type);
        }

        // Десктопное уведомление
        if (this.settings.desktopEnabled && options.title) {
            this.showDesktopNotification(options);
        }

        // Анимация появления
        requestAnimationFrame(() => {
            notification.classList.add('animate-slide-up');
        });

        return notification;
    }

    /**
     * Создание элемента уведомления
     * @param {Object} options - Опции уведомления
     * @returns {HTMLElement} Элемент уведомления
     */
    createNotification(options) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${options.type || 'info'} max-w-sm`;
        
        const icon = this.getNotificationIcon(options.type);
        const dismissible = options.dismissible !== false;
        
        notification.innerHTML = `
            <div class="flex items-start gap-3">
                <div class="flex-shrink-0 text-lg">${icon}</div>
                <div class="flex-1 min-w-0">
                    ${options.title ? `<h4 class="font-semibold mb-1">${options.title}</h4>` : ''}
                    <p class="text-sm">${options.message}</p>
                    ${this.createActions(options.actions)}
                </div>
                ${dismissible ? `
                    <button class="notification-close flex-shrink-0 text-lg opacity-70 hover:opacity-100 transition-opacity">
                        ×
                    </button>
                ` : ''}
            </div>
        `;

        // Обработчик закрытия
        if (dismissible) {
            const closeBtn = notification.querySelector('.notification-close');
            closeBtn.addEventListener('click', () => this.hide(notification));
        }

        // Обработчик клика
        if (options.onClick) {
            notification.addEventListener('click', (e) => {
                if (!e.target.classList.contains('notification-close')) {
                    options.onClick(e);
                }
            });
            notification.style.cursor = 'pointer';
        }

        return notification;
    }

    /**
     * Создание действий уведомления
     * @param {Array} actions - Массив действий
     * @returns {string} HTML действий
     */
    createActions(actions) {
        if (!actions || !Array.isArray(actions) || actions.length === 0) {
            return '';
        }

        const actionsHtml = actions.map(action => `
            <button 
                class="notification-action px-2 py-1 text-xs rounded hover:bg-white hover:bg-opacity-20 transition-colors"
                data-action="${action.name}"
            >
                ${action.label}
            </button>
        `).join('');

        return `<div class="notification-actions flex gap-2 mt-2">${actionsHtml}</div>`;
    }

    /**
     * Получение иконки для типа уведомления
     * @param {string} type - Тип уведомления
     * @returns {string} Иконка
     */
    getNotificationIcon(type) {
        const icons = {
            [NOTIFICATION_TYPES.SUCCESS]: '✅',
            [NOTIFICATION_TYPES.ERROR]: '❌',
            [NOTIFICATION_TYPES.WARNING]: '⚠️',
            [NOTIFICATION_TYPES.INFO]: 'ℹ️'
        };
        
        return icons[type] || icons[NOTIFICATION_TYPES.INFO];
    }

    /**
     * Скрытие уведомления
     * @param {HTMLElement} notification - Элемент уведомления
     */
    hide(notification) {
        if (!notification || !notification.parentNode) {
            return;
        }

        notification.classList.add('animate-fade-out');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            
            const index = this.notifications.indexOf(notification);
            if (index > -1) {
                this.notifications.splice(index, 1);
            }
        }, 200);
    }

    /**
     * Скрытие всех уведомлений
     */
    hideAll() {
        this.notifications.forEach(notification => {
            this.hide(notification);
        });
    }

    /**
     * Показ десктопного уведомления
     * @param {Object} options - Опции уведомления
     */
    showDesktopNotification(options) {
        if (!('Notification' in window) || Notification.permission !== 'granted') {
            return;
        }

        try {
            const notification = new Notification(options.title, {
                body: options.message,
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                tag: 'secretary-plus',
                requireInteraction: false,
                silent: !this.settings.soundEnabled
            });

            if (options.onClick) {
                notification.onclick = options.onClick;
            }

            // Автоматическое закрытие
            setTimeout(() => {
                notification.close();
            }, this.settings.duration);
        } catch (error) {
            console.error('Ошибка показа десктопного уведомления:', error);
        }
    }

    /**
     * Воспроизведение звука
     * @param {string} type - Тип уведомления
     */
    playSound(type) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Настройка частоты в зависимости от типа
            const frequencies = {
                [NOTIFICATION_TYPES.SUCCESS]: 800,
                [NOTIFICATION_TYPES.ERROR]: 400,
                [NOTIFICATION_TYPES.WARNING]: 600,
                [NOTIFICATION_TYPES.INFO]: 700
            };

            oscillator.frequency.setValueAtTime(frequencies[type] || 700, audioContext.currentTime);
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.error('Ошибка воспроизведения звука:', error);
        }
    }

    /**
     * Успешное уведомление
     * @param {string} message - Сообщение
     * @param {string} [title] - Заголовок
     */
    success(message, title = 'Успешно') {
        return this.show({
            type: NOTIFICATION_TYPES.SUCCESS,
            title,
            message
        });
    }

    /**
     * Уведомление об ошибке
     * @param {string} message - Сообщение
     * @param {string} [title] - Заголовок
     */
    error(message, title = 'Ошибка') {
        return this.show({
            type: NOTIFICATION_TYPES.ERROR,
            title,
            message
        });
    }

    /**
     * Предупреждение
     * @param {string} message - Сообщение
     * @param {string} [title] - Заголовок
     */
    warning(message, title = 'Предупреждение') {
        return this.show({
            type: NOTIFICATION_TYPES.WARNING,
            title,
            message
        });
    }

    /**
     * Информационное уведомление
     * @param {string} message - Сообщение
     * @param {string} [title] - Заголовок
     */
    info(message, title = 'Информация') {
        return this.show({
            type: NOTIFICATION_TYPES.INFO,
            title,
            message
        });
    }

    /**
     * Обновление настроек
     * @param {Object} newSettings - Новые настройки
     */
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.saveSettings();
    }

    /**
     * Получение настроек
     * @returns {Object} Настройки
     */
    getSettings() {
        return { ...this.settings };
    }

    /**
     * Включение/выключение уведомлений
     * @param {boolean} enabled - Включены ли уведомления
     */
    setEnabled(enabled) {
        this.settings.enabled = enabled;
        this.saveSettings();
    }

    /**
     * Включение/выключение звука
     * @param {boolean} enabled - Включен ли звук
     */
    setSoundEnabled(enabled) {
        this.settings.soundEnabled = enabled;
        this.saveSettings();
    }

    /**
     * Включение/выключение десктопных уведомлений
     * @param {boolean} enabled - Включены ли десктопные уведомления
     */
    setDesktopEnabled(enabled) {
        this.settings.desktopEnabled = enabled;
        if (enabled) {
            this.requestPermission();
        }
        this.saveSettings();
    }

    /**
     * Очистка ресурсов
     */
    destroy() {
        this.hideAll();
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        this.container = null;
        this.notifications = [];
    }
} 