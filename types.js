// Определения типов для приложения "Секретарь+"

/**
 * @typedef {Object} Message
 * @property {string} id - Уникальный идентификатор сообщения
 * @property {string} type - Тип сообщения (user, assistant, system, error, warning, info)
 * @property {string} sender - Отправитель сообщения (user, assistant, system)
 * @property {string} content - Содержимое сообщения
 * @property {string} timestamp - Временная метка создания сообщения
 * @property {Array<Attachment>} [attachments] - Вложения к сообщению
 * @property {Object} [metadata] - Дополнительные метаданные
 * @property {boolean} [isTyping] - Флаг печатания
 * @property {Array<ToolCall>} [toolCalls] - Вызовы инструментов
 * @property {Array<ToolResult>} [toolResults] - Результаты инструментов
 */

/**
 * @typedef {Object} Attachment
 * @property {string} id - Уникальный идентификатор вложения
 * @property {string} type - Тип вложения (image, pdf, document, etc.)
 * @property {string} name - Имя файла
 * @property {string} url - URL файла
 * @property {string} [base64] - Base64 содержимое файла
 * @property {number} size - Размер файла в байтах
 * @property {string} mimeType - MIME-тип файла
 * @property {Object} [metadata] - Дополнительные метаданные
 */

/**
 * @typedef {Object} ToolCall
 * @property {string} id - Уникальный идентификатор вызова
 * @property {string} name - Название инструмента
 * @property {Object} arguments - Аргументы инструмента
 * @property {string} status - Статус выполнения (pending, running, completed, failed)
 * @property {Object} [result] - Результат выполнения
 * @property {string} [error] - Сообщение об ошибке
 */

/**
 * @typedef {Object} ToolResult
 * @property {string} id - Уникальный идентификатор результата
 * @property {string} toolCallId - ID вызова инструмента
 * @property {Object} data - Данные результата
 * @property {string} [error] - Сообщение об ошибке
 */

/**
 * @typedef {Object} User
 * @property {string} id - Уникальный идентификатор пользователя
 * @property {string} email - Email пользователя
 * @property {string} name - Имя пользователя
 * @property {string} [avatar] - URL аватара
 * @property {string} role - Роль пользователя (owner, admin, user)
 * @property {string} createdAt - Дата создания аккаунта
 * @property {string} [lastLogin] - Дата последнего входа
 * @property {Object} settings - Настройки пользователя
 */

/**
 * @typedef {Object} UserSettings
 * @property {string} theme - Тема оформления (light, dark, system)
 * @property {string} language - Язык интерфейса (ru, en)
 * @property {boolean} notifications - Включены ли уведомления
 * @property {boolean} soundEnabled - Включен ли звук
 * @property {boolean} desktopNotifications - Включены ли десктопные уведомления
 * @property {Object} voice - Настройки голосового ввода
 * @property {Object} camera - Настройки камеры
 * @property {Object} sync - Настройки синхронизации
 */

/**
 * @typedef {Object} ChatSession
 * @property {string} id - Уникальный идентификатор сессии
 * @property {string} userId - ID пользователя
 * @property {string} title - Заголовок чата
 * @property {Array<Message>} messages - Сообщения в чате
 * @property {string} createdAt - Дата создания сессии
 * @property {string} [updatedAt] - Дата последнего обновления
 * @property {Object} [metadata] - Дополнительные метаданные
 */

/**
 * @typedef {Object} CalendarEvent
 * @property {string} id - Уникальный идентификатор события
 * @property {string} title - Заголовок события
 * @property {string} [description] - Описание события
 * @property {string} startTime - Время начала
 * @property {string} endTime - Время окончания
 * @property {string} [location] - Место проведения
 * @property {Array<string>} [attendees] - Участники
 * @property {string} [meetLink] - Ссылка на Google Meet
 * @property {string} type - Тип события (meeting, task, reminder, etc.)
 * @property {boolean} allDay - Весь день
 * @property {string} [color] - Цвет события
 * @property {Object} [reminders] - Напоминания
 */

/**
 * @typedef {Object} Task
 * @property {string} id - Уникальный идентификатор задачи
 * @property {string} title - Заголовок задачи
 * @property {string} [description] - Описание задачи
 * @property {string} status - Статус задачи (pending, in_progress, completed, cancelled)
 * @property {string} priority - Приоритет задачи (low, medium, high, urgent)
 * @property {string} [dueDate] - Дата выполнения
 * @property {string} [completedAt] - Дата завершения
 * @property {Array<string>} [tags] - Теги
 * @property {string} [parentTaskId] - ID родительской задачи
 * @property {Array<string>} [subtaskIds] - ID подзадач
 * @property {Object} [metadata] - Дополнительные метаданные
 */

/**
 * @typedef {Object} Email
 * @property {string} id - Уникальный идентификатор письма
 * @property {string} subject - Тема письма
 * @property {string} from - От кого
 * @property {Array<string>} to - Кому
 * @property {Array<string>} [cc] - Копия
 * @property {Array<string>} [bcc] - Скрытая копия
 * @property {string} body - Тело письма
 * @property {Array<Attachment>} [attachments] - Вложения
 * @property {string} date - Дата отправки
 * @property {boolean} isRead - Прочитано ли
 * @property {Array<string>} [labels] - Метки
 * @property {string} [threadId] - ID цепочки писем
 */

/**
 * @typedef {Object} Contact
 * @property {string} id - Уникальный идентификатор контакта
 * @property {string} name - Имя контакта
 * @property {Array<string>} [emails] - Email адреса
 * @property {Array<string>} [phones] - Номера телефонов
 * @property {string} [company] - Компания
 * @property {string} [jobTitle] - Должность
 * @property {string} [avatar] - URL аватара
 * @property {string} type - Тип контакта (personal, work, family, other)
 * @property {Array<string>} [groups] - Группы
 * @property {Object} [address] - Адрес
 * @property {string} [notes] - Заметки
 * @property {Object} [metadata] - Дополнительные метаданные
 */

/**
 * @typedef {Object} File
 * @property {string} id - Уникальный идентификатор файла
 * @property {string} name - Имя файла
 * @property {string} type - Тип файла (image, pdf, document, etc.)
 * @property {string} mimeType - MIME-тип файла
 * @property {number} size - Размер файла в байтах
 * @property {string} url - URL файла
 * @property {string} [thumbnail] - URL превью
 * @property {string} [parentFolderId] - ID родительской папки
 * @property {string} createdAt - Дата создания
 * @property {string} [modifiedAt] - Дата изменения
 * @property {Array<string>} [tags] - Теги
 * @property {Object} [metadata] - Дополнительные метаданные
 */

/**
 * @typedef {Object} Note
 * @property {string} id - Уникальный идентификатор заметки
 * @property {string} title - Заголовок заметки
 * @property {string} content - Содержимое заметки
 * @property {string} type - Тип заметки (text, list, drawing, voice)
 * @property {Array<string>} [tags] - Теги
 * @property {string} createdAt - Дата создания
 * @property {string} [updatedAt] - Дата изменения
 * @property {boolean} isPinned - Закреплена ли заметка
 * @property {string} [color] - Цвет заметки
 * @property {Object} [metadata] - Дополнительные метаданные
 */

/**
 * @typedef {Object} GeminiKey
 * @property {string} id - Уникальный идентификатор ключа
 * @property {string} key - API ключ
 * @property {string} name - Название ключа
 * @property {boolean} isActive - Активен ли ключ
 * @property {number} [quota] - Квота запросов
 * @property {number} [usedQuota] - Использованная квота
 * @property {string} [lastUsed] - Дата последнего использования
 * @property {string} createdAt - Дата создания
 * @property {string} [createdBy] - Кем создан
 */

/**
 * @typedef {Object} Proxy
 * @property {string} id - Уникальный идентификатор прокси
 * @property {string} url - URL прокси-сервера
 * @property {string} [username] - Имя пользователя
 * @property {string} [password] - Пароль
 * @property {boolean} isActive - Активен ли прокси
 * @property {number} priority - Приоритет (1-10)
 * @property {string} [lastTested] - Дата последнего тестирования
 * @property {boolean} [isWorking] - Работает ли прокси
 * @property {string} createdAt - Дата создания
 * @property {string} [createdBy] - Кем создан
 */

/**
 * @typedef {Object} ActionStats
 * @property {string} id - Уникальный идентификатор записи
 * @property {string} userId - ID пользователя
 * @property {string} action - Название действия
 * @property {string} service - Сервис (calendar, tasks, email, etc.)
 * @property {string} timestamp - Временная метка
 * @property {Object} [metadata] - Дополнительные метаданные
 */

/**
 * @typedef {Object} SyncStatus
 * @property {string} service - Название сервиса
 * @property {string} status - Статус синхронизации (idle, syncing, success, error, paused)
 * @property {string} [lastSync] - Дата последней синхронизации
 * @property {string} [nextSync] - Дата следующей синхронизации
 * @property {number} [itemsSynced] - Количество синхронизированных элементов
 * @property {string} [error] - Сообщение об ошибке
 * @property {Object} [metadata] - Дополнительные метаданные
 */

/**
 * @typedef {Object} Notification
 * @property {string} id - Уникальный идентификатор уведомления
 * @property {string} type - Тип уведомления (success, error, warning, info)
 * @property {string} title - Заголовок уведомления
 * @property {string} message - Сообщение уведомления
 * @property {string} timestamp - Временная метка
 * @property {boolean} isRead - Прочитано ли
 * @property {Object} [action] - Действие при клике
 * @property {Object} [metadata] - Дополнительные метаданные
 */

/**
 * @typedef {Object} VoiceSettings
 * @property {string} language - Язык распознавания (ru-RU, en-US, etc.)
 * @property {boolean} continuous - Непрерывное распознавание
 * @property {boolean} interimResults - Промежуточные результаты
 * @property {number} maxAlternatives - Максимальное количество альтернатив
 * @property {string} mode - Режим ввода (tap_to_talk, hold_to_talk, continuous)
 */

/**
 * @typedef {Object} CameraSettings
 * @property {number} quality - Качество изображения (0.1-1.0)
 * @property {number} maxWidth - Максимальная ширина
 * @property {number} maxHeight - Максимальная высота
 * @property {string} format - Формат изображения (image/jpeg, image/png)
 * @property {boolean} flash - Вспышка
 * @property {string} facingMode - Режим камеры (user, environment)
 */

/**
 * @typedef {Object} SyncSettings
 * @property {boolean} enabled - Включена ли синхронизация
 * @property {number} interval - Интервал синхронизации в миллисекундах
 * @property {number} batchSize - Размер пакета
 * @property {number} maxRetries - Максимальное количество попыток
 * @property {Object} services - Настройки сервисов
 */

/**
 * @typedef {Object} ContextAction
 * @property {string} id - Уникальный идентификатор действия
 * @property {string} label - Название действия
 * @property {string} icon - Иконка действия
 * @property {Function} handler - Обработчик действия
 * @property {Object} [metadata] - Дополнительные метаданные
 */

/**
 * @typedef {Object} ResultCard
 * @property {string} id - Уникальный идентификатор карточки
 * @property {string} type - Тип карточки (event, task, contact, file, etc.)
 * @property {string} title - Заголовок карточки
 * @property {string} [subtitle] - Подзаголовок
 * @property {string} [description] - Описание
 * @property {string} [image] - URL изображения
 * @property {Array<ContextAction>} [actions] - Доступные действия
 * @property {Object} data - Данные карточки
 * @property {Object} [metadata] - Дополнительные метаданные
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Успешность запроса
 * @property {Object} [data] - Данные ответа
 * @property {string} [error] - Сообщение об ошибке
 * @property {number} [statusCode] - HTTP статус код
 * @property {Object} [metadata] - Дополнительные метаданные
 */

/**
 * @typedef {Object} ApiError
 * @property {string} type - Тип ошибки
 * @property {string} message - Сообщение об ошибке
 * @property {number} [statusCode] - HTTP статус код
 * @property {Object} [details] - Детали ошибки
 * @property {string} [timestamp] - Временная метка
 */

/**
 * @typedef {Object} PaginationParams
 * @property {number} page - Номер страницы
 * @property {number} limit - Количество элементов на странице
 * @property {string} [sortBy] - Поле для сортировки
 * @property {string} [sortOrder] - Порядок сортировки (asc, desc)
 * @property {Object} [filters] - Фильтры
 */

/**
 * @typedef {Object} PaginatedResponse
 * @property {Array<Object>} data - Данные
 * @property {number} total - Общее количество элементов
 * @property {number} page - Текущая страница
 * @property {number} limit - Количество элементов на странице
 * @property {number} totalPages - Общее количество страниц
 * @property {boolean} hasNext - Есть ли следующая страница
 * @property {boolean} hasPrev - Есть ли предыдущая страница
 */

// Экспорт типов для использования в JSDoc
export {
    // Основные типы
    Message,
    Attachment,
    ToolCall,
    ToolResult,
    User,
    UserSettings,
    ChatSession,
    
    // Данные сервисов
    CalendarEvent,
    Task,
    Email,
    Contact,
    File,
    Note,
    
    // Системные типы
    GeminiKey,
    Proxy,
    ActionStats,
    SyncStatus,
    Notification,
    
    // Настройки
    VoiceSettings,
    CameraSettings,
    SyncSettings,
    
    // UI типы
    ContextAction,
    ResultCard,
    
    // API типы
    ApiResponse,
    ApiError,
    PaginationParams,
    PaginatedResponse,
}; 