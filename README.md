# Секретарь+ 🤖

Интеллектуальный веб-ассистент для управления цифровой продуктивностью с интеграцией Google сервисов и использованием AI модели Gemini.

## 🚀 Возможности

- **Интеллектуальный чат** с использованием Google Gemini AI
- **Интеграция с Google сервисами**: Календарь, Задачи, Gmail, Drive, Контакты
- **Голосовой ввод** с поддержкой русского языка
- **Мультимодальный ввод**: текст, изображения, PDF файлы
- **Аутентификация через Google OAuth**
- **Адаптивный дизайн** с поддержкой темной/светлой темы
- **Панель администрирования** для управления пользователями и настройками
- **Отказоустойчивость** с пулом API ключей и прокси-серверов

## 🛠 Технологии

- **Фронтенд**: Vanilla JavaScript (ES Modules), HTML5, CSS3
- **Стилизация**: Tailwind CSS
- **AI**: Google Gemini (gemini-2.0-flash-exp)
- **Бэкенд**: Supabase (Authentication, PostgreSQL, Storage)
- **Интеграции**: Google Identity Services, Google API Client Library

## 📋 Требования

- Современный браузер с поддержкой ES Modules
- Node.js 16+ (для разработки)
- Аккаунт Google с включенными API
- Проект Supabase

## 🔧 Быстрый старт

### 1. Клонирование репозитория

```bash
git clone https://github.com/Gakuzi/secretary-.git
cd secretary-
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка конфигурации

Скопируйте `config.js` и обновите настройки:

```bash
cp config.js config.local.js
# Отредактируйте config.local.js с вашими ключами
```

### 4. Запуск приложения

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## 📁 Структура проекта

```
/
├── index.html              # Главный HTML файл
├── index.js                # Основная точка входа
├── config.js               # Конфигурация приложения
├── constants.js            # Глобальные константы
├── types.js                # Определения типов
├── style.css               # Пользовательские стили
├── components/             # UI компоненты
├── services/               # Сервисы
│   ├── supabase/           # Supabase сервисы
│   └── google/             # Google сервисы
└── utils/                  # Утилиты
```

## 🔐 Настройка

### Supabase

1. Создайте проект на [supabase.com](https://supabase.com)
2. Выполните SQL скрипты из `services/supabase/migrations.sql`
3. Обновите конфигурацию в `config.js`

### Google API

1. Создайте проект в [Google Cloud Console](https://console.cloud.google.com)
2. Включите необходимые API
3. Создайте OAuth 2.0 Client ID
4. Получите API ключ Gemini

## 🚀 Развертывание

Приложение работает на любом статическом хостинге:
- GitHub Pages
- Vercel
- Netlify
- Firebase Hosting

## 🤝 Вклад в проект

Мы приветствуем вклад в развитие проекта!

### Как внести вклад:

1. Форкните репозиторий
2. Создайте ветку для новой функции (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add some amazing feature'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT License.

## 🐛 Сообщения об ошибках

Если вы нашли ошибку, пожалуйста, создайте issue с подробным описанием проблемы.

## 💡 Предложения

У вас есть идея для улучшения проекта? Создайте issue с тегом `enhancement`.

## 🙏 Благодарности

- [Google Gemini](https://ai.google.dev/) за предоставление AI модели
- [Supabase](https://supabase.com/) за отличную платформу для бэкенда
- [Tailwind CSS](https://tailwindcss.com/) за стили

---

**Секретарь+** - ваш интеллектуальный помощник для продуктивности! 🚀

⭐ Если проект вам понравился, поставьте звездочку! 