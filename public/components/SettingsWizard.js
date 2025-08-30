/**
 * SettingsWizard - Интерактивный мастер настроек
 */
export class SettingsWizard {
    constructor() {
        this.currentStep = 0;
        this.steps = [];
        this.settings = {};
        this.modal = null;
        this.isActive = false;
    }

    /**
     * Инициализация мастера
     */
    init() {
        this.setupSteps();
        this.createModal();
    }

    /**
     * Настройка шагов мастера
     */
    setupSteps() {
        this.steps = [
            {
                id: 'welcome',
                title: 'Добро пожаловать в мастер настроек! 🎉',
                description: 'Давайте настроим ваше приложение Секретарь+ пошагово. Это займет всего несколько минут.',
                content: this.getWelcomeContent(),
                canSkip: false
            },
            {
                id: 'gemini-setup',
                title: 'Настройка AI-помощника 🤖',
                description: 'Подключим Google Gemini AI для умных ответов и анализа',
                content: this.getGeminiSetupContent(),
                canSkip: true
            },
            {
                id: 'google-oauth',
                title: 'Настройка Google аккаунта 🔐',
                description: 'Подключим ваш Google аккаунт для работы с календарем и почтой',
                content: this.getGoogleOAuthContent(),
                canSkip: true
            },
            {
                id: 'calendar-sync',
                title: 'Синхронизация календаря 📅',
                description: 'Настроим работу с Google Calendar',
                content: this.getCalendarSyncContent(),
                canSkip: true
            },
            {
                id: 'gmail-setup',
                title: 'Настройка Gmail 📧',
                description: 'Подключим вашу почту для анализа и ответов',
                content: this.getGmailSetupContent(),
                canSkip: true
            },
            {
                id: 'preferences',
                title: 'Персональные настройки ⚙️',
                description: 'Настроим интерфейс и поведение приложения',
                content: this.getPreferencesContent(),
                canSkip: true
            },
            {
                id: 'completion',
                title: 'Настройка завершена! 🎯',
                description: 'Все готово к работе. Проверим настройки и запустим приложение.',
                content: this.getCompletionContent(),
                canSkip: false
            }
        ];
    }

    /**
     * Создание модального окна
     */
    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4';
        this.modal.innerHTML = this.getModalHTML();
        
        document.body.appendChild(this.modal);
        this.bindEvents();
    }

    /**
     * HTML модального окна
     */
    getModalHTML() {
        return `
            <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <!-- Заголовок -->
                <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <h2 class="text-2xl font-bold" id="wizard-title">Мастер настроек</h2>
                            <p class="text-blue-100 mt-2" id="wizard-description">Пошаговая настройка приложения</p>
                        </div>
                        <button id="wizard-close" class="text-white hover:text-blue-200 transition-colors">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    
                    <!-- Прогресс-бар -->
                    <div class="mt-6">
                        <div class="flex justify-between text-sm text-blue-100 mb-2">
                            <span>Шаг ${this.currentStep + 1} из ${this.steps.length}</span>
                            <span>${Math.round(((this.currentStep + 1) / this.steps.length) * 100)}%</span>
                        </div>
                        <div class="w-full bg-blue-200 rounded-full h-2">
                            <div class="bg-white transition-all duration-300 ease-out h-2 rounded-full" 
                                 style="width: ${((this.currentStep + 1) / this.steps.length) * 100}%"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Содержимое -->
                <div class="p-6 overflow-y-auto max-h-[60vh]" id="wizard-content">
                    <!-- Контент будет загружен динамически -->
                </div>
                
                <!-- Кнопки навигации -->
                <div class="bg-gray-50 px-6 py-4 flex justify-between items-center">
                    <div class="flex space-x-3">
                        <button id="wizard-prev" class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            ← Назад
                        </button>
                        <button id="wizard-skip" class="px-6 py-2 text-gray-500 hover:text-gray-700 transition-colors hidden">
                            Пропустить
                        </button>
                    </div>
                    
                    <div class="flex space-x-3">
                        <button id="wizard-help" class="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors">
                            <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Помощь
                        </button>
                        <button id="wizard-next" class="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Далее →
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Привязка событий
     */
    bindEvents() {
        // Кнопка закрытия
        this.modal.querySelector('#wizard-close').addEventListener('click', () => {
            this.close();
        });

        // Кнопка назад
        this.modal.querySelector('#wizard-prev').addEventListener('click', () => {
            this.previousStep();
        });

        // Кнопка далее
        this.modal.querySelector('#wizard-next').addEventListener('click', () => {
            this.nextStep();
        });

        // Кнопка пропустить
        this.modal.querySelector('#wizard-skip').addEventListener('click', () => {
            this.skipStep();
        });

        // Кнопка помощи
        this.modal.querySelector('#wizard-help').addEventListener('click', () => {
            this.showHelp();
        });

        // Закрытие по клику вне модального окна
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
    }

    /**
     * Открытие мастера
     */
    open() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.currentStep = 0;
        this.modal.style.display = 'flex';
        this.showStep(0);
        
        // Анимация появления
        this.modal.classList.add('animate-fade-in');
    }

    /**
     * Закрытие мастера
     */
    close() {
        if (!this.isActive) return;
        
        this.isActive = false;
        this.modal.style.display = 'none';
        this.modal.classList.remove('animate-fade-in');
    }

    /**
     * Показать шаг
     */
    showStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= this.steps.length) return;
        
        this.currentStep = stepIndex;
        const step = this.steps[stepIndex];
        
        // Обновляем заголовок и описание
        this.modal.querySelector('#wizard-title').textContent = step.title;
        this.modal.querySelector('#wizard-description').textContent = step.description;
        
        // Обновляем содержимое
        this.modal.querySelector('#wizard-content').innerHTML = step.content;
        
        // Обновляем прогресс-бар
        this.updateProgress();
        
        // Обновляем кнопки
        this.updateNavigationButtons();
        
        // Инициализируем специфичные для шага события
        this.initStepEvents(step);
    }

    /**
     * Следующий шаг
     */
    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.showStep(this.currentStep + 1);
        } else {
            this.complete();
        }
    }

    /**
     * Предыдущий шаг
     */
    previousStep() {
        if (this.currentStep > 0) {
            this.showStep(this.currentStep - 1);
        }
    }

    /**
     * Пропустить шаг
     */
    skipStep() {
        if (this.steps[this.currentStep].canSkip) {
            this.nextStep();
        }
    }

    /**
     * Обновление прогресс-бара
     */
    updateProgress() {
        const progress = ((this.currentStep + 1) / this.steps.length) * 100;
        const progressBar = this.modal.querySelector('.bg-white');
        const stepText = this.modal.querySelector('.text-blue-100');
        const percentText = this.modal.querySelector('.text-blue-100:last-child');
        
        progressBar.style.width = `${progress}%`;
        stepText.textContent = `Шаг ${this.currentStep + 1} из ${this.steps.length}`;
        percentText.textContent = `${Math.round(progress)}%`;
    }

    /**
     * Обновление кнопок навигации
     */
    updateNavigationButtons() {
        const prevBtn = this.modal.querySelector('#wizard-prev');
        const nextBtn = this.modal.querySelector('#wizard-next');
        const skipBtn = this.modal.querySelector('#wizard-skip');
        const step = this.steps[this.currentStep];
        
        // Кнопка назад
        prevBtn.disabled = this.currentStep === 0;
        
        // Кнопка далее
        if (this.currentStep === this.steps.length - 1) {
            nextBtn.textContent = 'Завершить';
            nextBtn.className = 'px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors';
        } else {
            nextBtn.textContent = 'Далее →';
            nextBtn.className = 'px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors';
        }
        
        // Кнопка пропустить
        if (step.canSkip) {
            skipBtn.classList.remove('hidden');
        } else {
            skipBtn.classList.add('hidden');
        }
    }

    /**
     * Инициализация событий для конкретного шага
     */
    initStepEvents(step) {
        switch (step.id) {
            case 'gemini-setup':
                this.initGeminiEvents();
                break;
            case 'google-oauth':
                this.initGoogleOAuthEvents();
                break;
            case 'preferences':
                this.initPreferencesEvents();
                break;
        }
    }

    /**
     * Завершение мастера
     */
    complete() {
        // Сохраняем все настройки
        this.saveAllSettings();
        
        // Показываем сообщение об успехе
        this.showCompletionMessage();
        
        // Закрываем мастер через 3 секунды
        setTimeout(() => {
            this.close();
            // Перезагружаем страницу для применения настроек
            if (confirm('Настройки сохранены! Перезагрузить страницу для применения изменений?')) {
                location.reload();
            }
        }, 3000);
    }

    /**
     * Сохранение всех настроек
     */
    saveAllSettings() {
        Object.keys(this.settings).forEach(key => {
            if (this.settings[key] !== undefined && this.settings[key] !== '') {
                localStorage.setItem(key, this.settings[key]);
            }
        });
        
        console.log('✅ Все настройки сохранены:', this.settings);
    }

    /**
     * Показать сообщение о завершении
     */
    showCompletionMessage() {
        const content = this.modal.querySelector('#wizard-content');
        content.innerHTML = `
            <div class="text-center py-8">
                <div class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h3 class="text-2xl font-bold text-green-600 mb-4">Настройка завершена!</h3>
                <p class="text-gray-600 mb-6">Все параметры успешно настроены и сохранены.</p>
                <div class="bg-green-50 border border-green-200 rounded-lg p-4 text-left max-w-md mx-auto">
                    <h4 class="font-semibold text-green-800 mb-2">Что настроено:</h4>
                    <ul class="text-sm text-green-700 space-y-1">
                        ${this.getSettingsSummary()}
                    </ul>
                </div>
            </div>
        `;
    }

    /**
     * Получить сводку настроек
     */
    getSettingsSummary() {
        const summary = [];
        
        if (this.settings['gemini-api-key']) {
            summary.push('<li>✅ Gemini AI подключен</li>');
        }
        
        if (this.settings['google-client-id']) {
            summary.push('<li>✅ Google OAuth настроен</li>');
        }
        
        if (this.settings['theme']) {
            summary.push(`<li>✅ Тема: ${this.settings['theme']}</li>`);
        }
        
        if (this.settings['language']) {
            summary.push(`<li>✅ Язык: ${this.settings['language']}</li>`);
        }
        
        return summary.join('') || '<li>✅ Базовые настройки применены</li>';
    }

    /**
     * Показать помощь
     */
    showHelp() {
        const step = this.steps[this.currentStep];
        let helpContent = '';
        
        switch (step.id) {
            case 'gemini-setup':
                helpContent = this.getGeminiHelp();
                break;
            case 'google-oauth':
                helpContent = this.getGoogleOAuthHelp();
                break;
            default:
                helpContent = this.getGeneralHelp();
        }
        
        // Показываем модальное окно помощи
        this.showHelpModal(helpContent);
    }

    /**
     * Показать модальное окно помощи
     */
    showHelpModal(content) {
        const helpModal = document.createElement('div');
        helpModal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4';
        helpModal.innerHTML = `
            <div class="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
                <div class="bg-blue-600 text-white p-4">
                    <h3 class="text-lg font-semibold">Справка</h3>
                </div>
                <div class="p-6 overflow-y-auto max-h-[60vh]">
                    ${content}
                </div>
                <div class="bg-gray-50 px-6 py-4 text-right">
                    <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                        Понятно
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(helpModal);
        
        // Обработчик закрытия
        helpModal.querySelector('button').addEventListener('click', () => {
            helpModal.remove();
        });
        
        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) {
                helpModal.remove();
            }
        });
    }
}

// Экспорт класса
export default SettingsWizard; 