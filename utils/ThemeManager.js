// Менеджер тем оформления
import { THEME_MODES, STORAGE_KEYS } from '../constants.js';

/**
 * Класс для управления темами оформления
 */
export class ThemeManager {
    constructor(storageManager) {
        this.storageManager = storageManager;
        this.currentTheme = THEME_MODES.SYSTEM;
        this.mediaQuery = null;
        
        // Привязка методов к контексту
        this.handleSystemThemeChange = this.handleSystemThemeChange.bind(this);
    }

    /**
     * Инициализация менеджера тем
     */
    async init() {
        // Загрузка сохраненной темы
        await this.loadTheme();
        
        // Настройка отслеживания системной темы
        this.setupSystemThemeListener();
        
        // Применение темы
        this.applyTheme();
    }

    /**
     * Загрузка темы из хранилища
     */
    async loadTheme() {
        try {
            const savedTheme = this.storageManager.get(STORAGE_KEYS.THEME, THEME_MODES.SYSTEM);
            this.currentTheme = savedTheme;
        } catch (error) {
            console.error('Ошибка загрузки темы:', error);
            this.currentTheme = THEME_MODES.SYSTEM;
        }
    }

    /**
     * Сохранение темы в хранилище
     */
    async saveTheme() {
        try {
            this.storageManager.set(STORAGE_KEYS.THEME, this.currentTheme);
        } catch (error) {
            console.error('Ошибка сохранения темы:', error);
        }
    }

    /**
     * Настройка отслеживания системной темы
     */
    setupSystemThemeListener() {
        // Удаляем предыдущий слушатель, если есть
        if (this.mediaQuery) {
            this.mediaQuery.removeEventListener('change', this.handleSystemThemeChange);
        }

        // Создаем новый MediaQuery для отслеживания системной темы
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.mediaQuery.addEventListener('change', this.handleSystemThemeChange);
    }

    /**
     * Обработчик изменения системной темы
     */
    handleSystemThemeChange(event) {
        if (this.currentTheme === THEME_MODES.SYSTEM) {
            this.applyTheme();
        }
    }

    /**
     * Установка темы
     * @param {string} theme - Тема (light, dark, system)
     */
    async setTheme(theme) {
        if (!Object.values(THEME_MODES).includes(theme)) {
            throw new Error(`Неизвестная тема: ${theme}`);
        }

        this.currentTheme = theme;
        await this.saveTheme();
        this.applyTheme();

        // Уведомляем о изменении темы
        this.dispatchThemeChangeEvent();
    }

    /**
     * Применение текущей темы
     */
    applyTheme() {
        const effectiveTheme = this.getEffectiveTheme();
        const root = document.documentElement;

        // Удаляем предыдущие классы тем
        root.classList.remove('theme-light', 'theme-dark');
        root.removeAttribute('data-theme');

        // Применяем новую тему
        if (effectiveTheme === THEME_MODES.DARK) {
            root.classList.add('theme-dark');
            root.setAttribute('data-theme', 'dark');
        } else {
            root.classList.add('theme-light');
            root.setAttribute('data-theme', 'light');
        }

        // Обновляем мета-тег для цветовой схемы
        this.updateColorSchemeMeta(effectiveTheme);
    }

    /**
     * Получение эффективной темы (с учетом системной настройки)
     * @returns {string} Эффективная тема
     */
    getEffectiveTheme() {
        if (this.currentTheme === THEME_MODES.SYSTEM) {
            return this.getSystemTheme();
        }
        return this.currentTheme;
    }

    /**
     * Получение системной темы
     * @returns {string} Системная тема
     */
    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches 
            ? THEME_MODES.DARK 
            : THEME_MODES.LIGHT;
    }

    /**
     * Обновление мета-тега color-scheme
     * @param {string} theme - Тема
     */
    updateColorSchemeMeta(theme) {
        let existingMeta = document.querySelector('meta[name="color-scheme"]');
        
        if (!existingMeta) {
            existingMeta = document.createElement('meta');
            existingMeta.name = 'color-scheme';
            document.head.appendChild(existingMeta);
        }

        existingMeta.content = theme === THEME_MODES.DARK ? 'dark' : 'light';
    }

    /**
     * Переключение темы
     */
    async toggleTheme() {
        const themes = Object.values(THEME_MODES);
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        
        await this.setTheme(themes[nextIndex]);
    }

    /**
     * Получение текущей темы
     * @returns {string} Текущая тема
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * Получение эффективной темы
     * @returns {string} Эффективная тема
     */
    getEffectiveTheme() {
        if (this.currentTheme === THEME_MODES.SYSTEM) {
            return this.getSystemTheme();
        }
        return this.currentTheme;
    }

    /**
     * Проверка, является ли текущая тема темной
     * @returns {boolean} Темная ли тема
     */
    isDarkTheme() {
        return this.getEffectiveTheme() === THEME_MODES.DARK;
    }

    /**
     * Проверка, является ли текущая тема светлой
     * @returns {boolean} Светлая ли тема
     */
    isLightTheme() {
        return this.getEffectiveTheme() === THEME_MODES.LIGHT;
    }

    /**
     * Проверка, используется ли системная тема
     * @returns {boolean} Используется ли системная тема
     */
    isSystemTheme() {
        return this.currentTheme === THEME_MODES.SYSTEM;
    }

    /**
     * Уведомление об изменении темы
     */
    dispatchThemeChangeEvent() {
        const event = new CustomEvent('themechange', {
            detail: {
                theme: this.currentTheme,
                effectiveTheme: this.getEffectiveTheme(),
                isDark: this.isDarkTheme()
            }
        });
        
        window.dispatchEvent(event);
    }

    /**
     * Подписка на изменения темы
     * @param {Function} callback - Функция обратного вызова
     */
    onThemeChange(callback) {
        window.addEventListener('themechange', callback);
        
        // Возвращаем функцию для отписки
        return () => {
            window.removeEventListener('themechange', callback);
        };
    }

    /**
     * Получение доступных тем
     * @returns {Array} Массив доступных тем
     */
    getAvailableThemes() {
        return Object.values(THEME_MODES);
    }

    /**
     * Получение названия темы
     * @param {string} theme - Тема
     * @returns {string} Название темы
     */
    getThemeName(theme) {
        const themeNames = {
            [THEME_MODES.LIGHT]: 'Светлая',
            [THEME_MODES.DARK]: 'Темная',
            [THEME_MODES.SYSTEM]: 'Системная'
        };
        
        return themeNames[theme] || theme;
    }

    /**
     * Получение иконки темы
     * @param {string} theme - Тема
     * @returns {string} Иконка темы
     */
    getThemeIcon(theme) {
        const themeIcons = {
            [THEME_MODES.LIGHT]: '☀️',
            [THEME_MODES.DARK]: '🌙',
            [THEME_MODES.SYSTEM]: '⚙️'
        };
        
        return themeIcons[theme] || '🎨';
    }

    /**
     * Получение описания темы
     * @param {string} theme - Тема
     * @returns {string} Описание темы
     */
    getThemeDescription(theme) {
        const themeDescriptions = {
            [THEME_MODES.LIGHT]: 'Светлая тема для дневного времени',
            [THEME_MODES.DARK]: 'Темная тема для ночного времени',
            [THEME_MODES.SYSTEM]: 'Автоматическое переключение по системным настройкам'
        };
        
        return themeDescriptions[theme] || '';
    }

    /**
     * Очистка ресурсов
     */
    destroy() {
        if (this.mediaQuery) {
            this.mediaQuery.removeEventListener('change', this.handleSystemThemeChange);
            this.mediaQuery = null;
        }
    }
} 