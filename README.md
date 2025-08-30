# Секретарь+ 🤖

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/yourusername/secretary-plus/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/yourusername/secretary-plus.svg)](https://github.com/yourusername/secretary-plus/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/secretary-plus.svg)](https://github.com/yourusername/secretary-plus/network)
[![GitHub issues](https://img.shields.io/github/issues/yourusername/secretary-plus.svg)](https://github.com/yourusername/secretary-plus/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/secretary-plus.svg)](https://github.com/yourusername/secretary-plus/pulls)

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
git clone https://github.com/yourusername/secretary-plus.git
cd secretary-plus
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
│   ├── UIManager.js
│   ├── Chat.js
│   ├── Message.js
│   └── ...
├── services/               # Сервисы
│   ├── supabase/           # Supabase сервисы
│   │   ├── AuthService.js
│   │   ├── schema.js
│   │   └── migrations.sql
│   ├── google/             # Google сервисы
│   │   └── GoogleServiceProvider.js
│   └── ChatService.js      # Сервис чата
└── utils/                  # Утилиты
    ├── StorageManager.js
    ├── ThemeManager.js
    ├── NotificationManager.js
    └── ...
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

Подробные инструкции см. в [GITHUB_SETUP.md](GITHUB_SETUP.md)

## 🚀 Развертывание

### GitHub Pages

Репозиторий настроен для автоматического деплоя на GitHub Pages при пуше в ветку `main`.

### Другие платформы

Приложение работает на любом статическом хостинге:
- Vercel
- Netlify
- Firebase Hosting
- и др.

## 🤝 Вклад в проект

Мы приветствуем вклад в развитие проекта! Пожалуйста, ознакомьтесь с нашими [правилами контрибьюции](CONTRIBUTING.md).

### Как внести вклад:

1. Форкните репозиторий
2. Создайте ветку для новой функции (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add some amazing feature'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для подробностей.

## 🐛 Сообщения об ошибках

Если вы нашли ошибку, пожалуйста, создайте issue с подробным описанием проблемы.

## 💡 Предложения

У вас есть идея для улучшения проекта? Создайте issue с тегом `enhancement`.

## 📞 Поддержка

- 📧 Email: your-email@example.com
- 💬 Discord: [Присоединяйтесь к нашему серверу](https://discord.gg/your-server)
- 📖 Документация: [Wiki](https://github.com/yourusername/secretary-plus/wiki)

## 🙏 Благодарности

- [Google Gemini](https://ai.google.dev/) за предоставление AI модели
- [Supabase](https://supabase.com/) за отличную платформу для бэкенда
- [Tailwind CSS](https://tailwindcss.com/) за стили
- Всем контрибьюторам проекта

## 📈 Статистика

![GitHub stats](https://github-readme-stats.vercel.app/api?username=yourusername&show_icons=true&theme=radical)

---

**Секретарь+** - ваш интеллектуальный помощник для продуктивности! 🚀

⭐ Если проект вам понравился, поставьте звездочку! 