/**
 * FirebaseSetupWizard - Мастер настройки Firebase
 */
export class FirebaseSetupWizard {
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
                title: 'Настройка Firebase 🔥',
                description: 'Давайте настроим Firebase для хранения данных и аутентификации',
                content: this.getWelcomeContent()
            },
            {
                id: 'project-setup',
                title: 'Создание проекта Firebase',
                description: 'Создадим новый проект в Firebase Console',
                content: this.getProjectSetupContent()
            },
            {
                id: 'app-config',
                title: 'Конфигурация приложения',
                description: 'Получим конфигурационные данные для приложения',
                content: this.getAppConfigContent()
            },
            {
                id: 'authentication',
                title: 'Настройка аутентификации',
                description: 'Включим Google аутентификацию',
                content: this.getAuthenticationContent()
            },
            {
                id: 'firestore',
                title: 'Настройка базы данных',
                description: 'Создадим Firestore базу данных',
                content: this.getFirestoreContent()
            },
            {
                id: 'storage',
                title: 'Настройка хранилища',
                description: 'Настроим Firebase Storage для файлов',
                content: this.getStorageContent()
            },
            {
                id: 'completion',
                title: 'Настройка завершена! 🎉',
                description: 'Firebase готов к работе',
                content: this.getCompletionContent()
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
            <div class="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
                <!-- Заголовок -->
                <div class="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                            </div>
                            <div>
                                <h2 class="text-2xl font-bold" id="wizard-title">Мастер настройки Firebase</h2>
                                <p class="text-orange-100 mt-1" id="wizard-description">Пошаговая настройка Firebase</p>
                            </div>
                        </div>
                        <button id="wizard-close" class="text-white hover:text-orange-200 transition-colors">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    
                    <!-- Прогресс-бар -->
                    <div class="mt-6">
                        <div class="flex justify-between text-sm text-orange-100 mb-2">
                            <span>Шаг ${this.currentStep + 1} из ${this.steps.length}</span>
                            <span>${Math.round(((this.currentStep + 1) / this.steps.length) * 100)}%</span>
                        </div>
                        <div class="w-full bg-orange-200 rounded-full h-2">
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
                    </div>
                    
                    <div class="flex space-x-3">
                        <button id="wizard-help" class="px-4 py-2 text-orange-600 hover:text-orange-800 transition-colors">
                            <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Помощь
                        </button>
                        <button id="wizard-next" class="px-8 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
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
     * Обновление прогресс-бара
     */
    updateProgress() {
        const progress = ((this.currentStep + 1) / this.steps.length) * 100;
        const progressBar = this.modal.querySelector('.bg-white');
        const stepText = this.modal.querySelector('.text-orange-100');
        const percentText = this.modal.querySelector('.text-orange-100:last-child');
        
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
        
        // Кнопка назад
        prevBtn.disabled = this.currentStep === 0;
        
        // Кнопка далее
        if (this.currentStep === this.steps.length - 1) {
            nextBtn.textContent = 'Завершить';
            nextBtn.className = 'px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors';
        } else {
            nextBtn.textContent = 'Далее →';
            nextBtn.className = 'px-8 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors';
        }
    }

    /**
     * Инициализация событий для конкретного шага
     */
    initStepEvents(step) {
        switch (step.id) {
            case 'app-config':
                this.initAppConfigEvents();
                break;
            case 'completion':
                this.initCompletionEvents();
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
            if (confirm('Firebase настроен! Перезагрузить страницу для применения изменений?')) {
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
        
        console.log('✅ Все настройки Firebase сохранены:', this.settings);
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
                <h3 class="text-2xl font-bold text-green-600 mb-4">Firebase настроен!</h3>
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
        
        if (this.settings['firebase-api-key']) {
            summary.push('<li>✅ API Key настроен</li>');
        }
        
        if (this.settings['firebase-auth-domain']) {
            summary.push('<li>✅ Auth Domain настроен</li>');
        }
        
        if (this.settings['firebase-project-id']) {
            summary.push('<li>✅ Project ID настроен</li>');
        }
        
        if (this.settings['firebase-storage-bucket']) {
            summary.push('<li>✅ Storage Bucket настроен</li>');
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
            case 'project-setup':
                helpContent = this.getProjectSetupHelp();
                break;
            case 'app-config':
                helpContent = this.getAppConfigHelp();
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
                <div class="bg-orange-600 text-white p-4">
                    <h3 class="text-lg font-semibold">Справка</h3>
                </div>
                <div class="p-6 overflow-y-auto max-h-[60vh]">
                    ${content}
                </div>
                <div class="bg-gray-50 px-6 py-4 text-right">
                    <button class="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors">
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

    // Содержимое шагов
    getWelcomeContent() {
        return `
            <div class="text-center py-8">
                <div class="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg class="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                </div>
                <h3 class="text-2xl font-bold text-gray-800 mb-4">Добро пожаловать в мастер настройки Firebase!</h3>
                <p class="text-gray-600 mb-6">Firebase - это платформа от Google для разработки мобильных и веб-приложений.</p>
                
                <div class="bg-orange-50 border border-orange-200 rounded-lg p-6 text-left max-w-2xl mx-auto">
                    <h4 class="font-semibold text-orange-800 mb-3">Что мы настроим:</h4>
                    <div class="grid grid-cols-2 gap-4 text-sm text-orange-700">
                        <div class="flex items-center space-x-2">
                            <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <span>Аутентификация через Google</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <span>База данных Firestore</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <span>Хранилище файлов</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <span>Безопасность данных</span>
                        </div>
                    </div>
                </div>
                
                <p class="text-gray-500 text-sm mt-6">Нажмите "Далее" чтобы начать настройку</p>
            </div>
        `;
    }

    getProjectSetupContent() {
        return `
            <div class="space-y-6">
                <div class="text-center">
                    <h4 class="text-xl font-semibold text-gray-800 mb-4">Шаг 1: Создание проекта Firebase</h4>
                    <p class="text-gray-600">Сначала нужно создать проект в Firebase Console</p>
                </div>
                
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h5 class="font-semibold text-blue-800 mb-3">📋 Пошаговая инструкция:</h5>
                    <ol class="list-decimal list-inside space-y-2 text-sm text-blue-700">
                        <li>Откройте <a href="https://console.firebase.google.com" target="_blank" class="text-blue-600 underline hover:text-blue-800">Firebase Console</a></li>
                        <li>Нажмите "Создать проект" или "Add project"</li>
                        <li>Введите название проекта (например: "secretary-plus")</li>
                        <li>Отключите Google Analytics (не обязательно)</li>
                        <li>Нажмите "Создать проект"</li>
                        <li>Дождитесь создания проекта</li>
                    </ol>
                </div>
                
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h5 class="font-semibold text-yellow-800 mb-2">⚠️ Важно:</h5>
                    <ul class="text-sm text-yellow-700 space-y-1">
                        <li>• Запомните название проекта</li>
                        <li>• Не закрывайте Firebase Console</li>
                        <li>• В следующем шаге мы добавим веб-приложение</li>
                    </ul>
                </div>
                
                <div class="text-center">
                    <button id="check-project-created" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Проект создан, продолжаем →
                    </button>
                </div>
            </div>
        `;
    }

    getAppConfigContent() {
        return `
            <div class="space-y-6">
                <div class="text-center">
                    <h4 class="text-xl font-semibold text-gray-800 mb-4">Шаг 2: Конфигурация веб-приложения</h4>
                    <p class="text-gray-600">Теперь добавим веб-приложение в проект Firebase</p>
                </div>
                
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h5 class="font-semibold text-blue-800 mb-3">📋 Пошаговая инструкция:</h5>
                    <ol class="list-decimal list-inside space-y-2 text-sm text-blue-700">
                        <li>В Firebase Console нажмите на иконку веб-приложения (</>)</li>
                        <li>Введите название приложения (например: "Секретарь+")</li>
                        <li>Отметьте "Also set up Firebase Hosting"</li>
                        <li>Нажмите "Register app"</li>
                        <li>Скопируйте конфигурацию (она понадобится ниже)</li>
                    </ol>
                </div>
                
                <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h5 class="font-semibold text-gray-800 mb-3">🔑 Конфигурация Firebase:</h5>
                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                            <input type="text" id="firebase-api-key" placeholder="AIzaSy..." 
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Auth Domain</label>
                            <input type="text" id="firebase-auth-domain" placeholder="project.firebaseapp.com" 
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Project ID</label>
                            <input type="text" id="firebase-project-id" placeholder="project-id" 
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Storage Bucket</label>
                            <input type="text" id="firebase-storage-bucket" placeholder="project-id.appspot.com" 
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Messaging Sender ID</label>
                            <input type="text" id="firebase-messaging-sender-id" placeholder="123456789" 
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">App ID</label>
                            <input type="text" id="firebase-app-id" placeholder="1:123456789:web:abc123" 
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                        </div>
                    </div>
                </div>
                
                <div class="text-center">
                    <button id="save-firebase-config" class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Сохранить конфигурацию
                    </button>
                </div>
            </div>
        `;
    }

    getAuthenticationContent() {
        return `
            <div class="space-y-6">
                <div class="text-center">
                    <h4 class="text-xl font-semibold text-gray-800 mb-4">Шаг 3: Настройка аутентификации</h4>
                    <p class="text-gray-600">Включим Google аутентификацию в Firebase</p>
                </div>
                
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h5 class="font-semibold text-blue-800 mb-3">📋 Пошаговая инструкция:</h5>
                    <ol class="list-decimal list-inside space-y-2 text-sm text-blue-700">
                        <li>В Firebase Console перейдите в "Authentication"</li>
                        <li>Нажмите "Get started"</li>
                        <li>Перейдите на вкладку "Sign-in method"</li>
                        <li>Нажмите на "Google" в списке провайдеров</li>
                        <li>Включите Google аутентификацию</li>
                        <li>Добавьте email для поддержки</li>
                        <li>Нажмите "Save"</li>
                    </ol>
                </div>
                
                <div class="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h5 class="font-semibold text-green-800 mb-2">✅ Что это дает:</h5>
                    <ul class="text-sm text-green-700 space-y-1">
                        <li>• Вход через Google аккаунт</li>
                        <li>• Автоматическое создание пользователей</li>
                        <li>• Безопасная аутентификация</li>
                        <li>• Интеграция с Google сервисами</li>
                    </ul>
                </div>
                
                <div class="text-center">
                    <button id="auth-configured" class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Аутентификация настроена
                    </button>
                </div>
            </div>
        `;
    }

    getFirestoreContent() {
        return `
            <div class="space-y-6">
                <div class="text-center">
                    <h4 class="text-xl font-semibold text-gray-800 mb-4">Шаг 4: Настройка базы данных</h4>
                    <p class="text-gray-600">Создадим Firestore базу данных для хранения данных</p>
                </div>
                
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h5 class="font-semibold text-blue-800 mb-3">📋 Пошаговая инструкция:</h5>
                    <ol class="list-decimal list-inside space-y-2 text-sm text-blue-700">
                        <li>В Firebase Console перейдите в "Firestore Database"</li>
                        <li>Нажмите "Create database"</li>
                        <li>Выберите "Start in test mode" (для разработки)</li>
                        <li>Выберите ближайший регион (например: europe-west3)</li>
                        <li>Нажмите "Done"</li>
                        <li>Дождитесь создания базы данных</li>
                    </ol>
                </div>
                
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h5 class="font-semibold text-yellow-800 mb-2">⚠️ Важно:</h5>
                    <ul class="text-sm text-yellow-700 space-y-1">
                        <li>• В тестовом режиме база данных открыта для всех</li>
                        <li>• Для продакшена нужно настроить правила безопасности</li>
                        <li>• Регион влияет на скорость доступа</li>
                    </ul>
                </div>
                
                <div class="text-center">
                    <button id="firestore-configured" class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        База данных создана
                    </button>
                </div>
            </div>
        `;
    }

    getStorageContent() {
        return `
            <div class="space-y-6">
                <div class="text-center">
                    <h4 class="text-xl font-semibold text-gray-800 mb-4">Шаг 5: Настройка хранилища</h4>
                    <p class="text-gray-600">Настроим Firebase Storage для хранения файлов</p>
                </div>
                
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h5 class="font-semibold text-blue-800 mb-3">📋 Пошаговая инструкция:</h5>
                    <ol class="list-decimal list-inside space-y-2 text-sm text-blue-700">
                        <li>В Firebase Console перейдите в "Storage"</li>
                        <li>Нажмите "Get started"</li>
                        <li>Выберите "Start in test mode" (для разработки)</li>
                        <li>Выберите тот же регион, что и для Firestore</li>
                        <li>Нажмите "Done"</li>
                        <li>Дождитесь создания хранилища</li>
                    </ol>
                </div>
                
                <div class="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h5 class="font-semibold text-green-800 mb-2">✅ Что это дает:</h5>
                    <ul class="text-sm text-green-700 space-y-1">
                        <li>• Загрузка и хранение файлов</li>
                        <li>• Автоматическое резервное копирование</li>
                        <li>• CDN для быстрой доставки</li>
                        <li>• Безопасность на уровне файлов</li>
                    </ul>
                </div>
                
                <div class="text-center">
                    <button id="storage-configured" class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Хранилище настроено
                    </button>
                </div>
            </div>
        `;
    }

    getCompletionContent() {
        return `
            <div class="text-center py-8">
                <div class="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h3 class="text-2xl font-bold text-green-600 mb-4">Отлично! Firebase настроен!</h3>
                <p class="text-gray-600 mb-6">Теперь ваше приложение может использовать все возможности Firebase.</p>
                
                <div class="bg-green-50 border border-green-200 rounded-lg p-6 text-left max-w-2xl mx-auto">
                    <h4 class="font-semibold text-green-800 mb-3">🎯 Что вы получили:</h4>
                    <div class="grid grid-cols-2 gap-4 text-sm text-green-700">
                        <div class="flex items-center space-x-2">
                            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span>Полноценная аутентификация</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span>База данных в облаке</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span>Хранилище файлов</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span>Автоматическое масштабирование</span>
                        </div>
                    </div>
                </div>
                
                <p class="text-gray-500 text-sm mt-6">Нажмите "Завершить" чтобы применить настройки</p>
            </div>
        `;
    }

    // Инициализация событий для шагов
    initAppConfigEvents() {
        const saveButton = this.modal.querySelector('#save-firebase-config');
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                this.saveFirebaseConfig();
            });
        }
    }

    initCompletionEvents() {
        // Можно добавить дополнительные события для завершения
    }

    // Сохранение конфигурации Firebase
    saveFirebaseConfig() {
        const config = {
            'firebase-api-key': this.modal.querySelector('#firebase-api-key').value,
            'firebase-auth-domain': this.modal.querySelector('#firebase-auth-domain').value,
            'firebase-project-id': this.modal.querySelector('#firebase-project-id').value,
            'firebase-storage-bucket': this.modal.querySelector('#firebase-storage-bucket').value,
            'firebase-messaging-sender-id': this.modal.querySelector('#firebase-messaging-sender-id').value,
            'firebase-app-id': this.modal.querySelector('#firebase-app-id').value
        };

        // Проверяем заполненность
        const emptyFields = Object.keys(config).filter(key => !config[key]);
        if (emptyFields.length > 0) {
            alert('Пожалуйста, заполните все поля конфигурации');
            return;
        }

        // Сохраняем настройки
        Object.keys(config).forEach(key => {
            this.settings[key] = config[key];
        });

        // Показываем уведомление
        this.showNotification('Конфигурация Firebase сохранена!', 'success');
        
        // Переходим к следующему шагу
        this.nextStep();
    }

    // Показать уведомление
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-[70] ${
            type === 'success' ? 'bg-green-500 text-white' : 
            type === 'error' ? 'bg-red-500 text-white' : 
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Справка для разных шагов
    getProjectSetupHelp() {
        return `
            <h4 class="font-semibold text-gray-800 mb-3">Справка по созданию проекта Firebase</h4>
            <div class="space-y-3 text-sm text-gray-600">
                <p><strong>Что такое Firebase?</strong></p>
                <p>Firebase - это платформа от Google для разработки мобильных и веб-приложений. Она предоставляет готовые сервисы для аутентификации, базы данных, хранения файлов и многого другого.</p>
                
                <p><strong>Зачем нужен проект?</strong></p>
                <p>Проект Firebase - это контейнер для всех сервисов вашего приложения. В нем хранятся настройки, данные пользователей, файлы и правила безопасности.</p>
                
                <p><strong>Как выбрать название?</strong></p>
                <p>Название проекта должно быть уникальным в рамках Firebase. Рекомендуется использовать название вашего приложения с дефисами вместо пробелов.</p>
            </div>
        `;
    }

    getAppConfigHelp() {
        return `
            <h4 class="font-semibold text-gray-800 mb-3">Справка по конфигурации приложения</h4>
            <div class="space-y-3 text-sm text-gray-600">
                <p><strong>API Key</strong> - уникальный ключ для доступа к Firebase API</p>
                <p><strong>Auth Domain</strong> - домен для аутентификации пользователей</p>
                <p><strong>Project ID</strong> - уникальный идентификатор проекта</p>
                <p><strong>Storage Bucket</strong> - хранилище для файлов</p>
                <p><strong>Messaging Sender ID</strong> - ID для push-уведомлений</p>
                <p><strong>App ID</strong> - уникальный идентификатор приложения</p>
                
                <p class="mt-3"><strong>Важно:</strong> Никогда не публикуйте эти данные в открытом доступе. Они безопасны для использования в клиентском коде, но должны быть защищены правилами безопасности Firebase.</p>
            </div>
        `;
    }

    getGeneralHelp() {
        return `
            <h4 class="font-semibold text-gray-800 mb-3">Общая справка</h4>
            <div class="space-y-3 text-sm text-gray-600">
                <p>Этот мастер поможет вам настроить Firebase для вашего приложения Секретарь+.</p>
                <p>Следуйте инструкциям пошагово. Если у вас возникнут вопросы, нажмите кнопку "Помощь" на любом шаге.</p>
                <p>После завершения настройки все параметры будут автоматически сохранены и применены.</p>
            </div>
        `;
    }
}

// Экспорт класса
export default FirebaseSetupWizard; 