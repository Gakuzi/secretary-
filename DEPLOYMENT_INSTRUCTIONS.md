# 🚀 Инструкции по развертыванию проекта "Секретарь+"

## 📋 Что уже готово

✅ **Создана полная структура проекта:**
- Основные файлы приложения (HTML, CSS, JS)
- Сервисы для работы с Supabase и Google API
- Утилиты для управления хранилищем, темами и уведомлениями
- Схема базы данных с миграциями
- Документация и конфигурация

✅ **Настроен Git репозиторий:**
- Ветка `main` с базовой версией
- Ветка `development` с дополнительной документацией
- GitHub Actions для автоматического деплоя
- Шаблоны для Issues и Pull Requests

## 🎯 Следующие шаги

### 1. Создание репозитория на GitHub

Следуйте инструкциям в файле `SETUP_GITHUB.md`:

```bash
# 1. Создайте репозиторий на GitHub.com
# 2. Подключите локальный репозиторий:
git remote add origin https://github.com/YOUR_USERNAME/secretary-plus.git

# 3. Отправьте ветки:
git checkout main
git push -u origin main

git checkout development
git push -u origin development
```

### 2. Настройка Supabase

1. **Создайте проект** на [supabase.com](https://supabase.com)
2. **Выполните миграции** из файла `services/supabase/migrations.sql`
3. **Получите ключи** из настроек проекта
4. **Обновите конфигурацию** в `config.js`

### 3. Настройка Google API

1. **Создайте проект** в [Google Cloud Console](https://console.cloud.google.com)
2. **Включите API:**
   - Google Calendar API
   - Google Tasks API
   - Gmail API
   - Google Drive API
   - Google People API
   - Google Docs API
   - Google Sheets API
3. **Создайте OAuth 2.0 Client ID**
4. **Получите API ключ Gemini** на [Google AI Studio](https://makersuite.google.com/app/apikey)

### 4. Обновление конфигурации

Отредактируйте файл `config.js`:

```javascript
SUPABASE: {
    URL: 'https://your-project.supabase.co',
    ANON_KEY: 'your-anon-key',
},
GOOGLE: {
    CLIENT_ID: 'your-google-client-id.apps.googleusercontent.com',
},
```

### 5. Запуск приложения

```bash
# Установка зависимостей
npm install

# Запуск локального сервера
npm run dev
```

## 🌐 Развертывание

### GitHub Pages (автоматически)

После настройки GitHub Actions приложение будет автоматически деплоиться при пуше в ветку `main`.

### Другие платформы

- **Vercel**: Подключите репозиторий GitHub
- **Netlify**: Загрузите файлы или подключите GitHub
- **Firebase Hosting**: Используйте Firebase CLI

## 🔧 Разработка

### Рабочий процесс

1. **Создайте ветку** для новой функции:
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Разрабатывайте** в этой ветке

3. **Создайте Pull Request** в ветку `development`

4. **После тестирования** мержите в `main`

### Структура для новых компонентов

```
components/
├── UIManager.js          # Главный менеджер UI
├── Chat.js               # Компонент чата
├── Message.js            # Компонент сообщения
├── ResultCard.js         # Карточки результатов
├── SettingsModal.js      # Модальное окно настроек
└── AdminPanel.js         # Панель администрирования
```

## 📊 Мониторинг

### GitHub Insights

- **Traffic**: Просмотр активности
- **Contributors**: Участники проекта
- **Commits**: История изменений

### Supabase Dashboard

- **Database**: Мониторинг запросов
- **Auth**: Статистика аутентификации
- **Storage**: Использование хранилища

## 🛡️ Безопасность

### Рекомендации

1. **Не коммитьте** реальные API ключи
2. **Используйте переменные окружения** для продакшена
3. **Регулярно обновляйте** зависимости
4. **Проверяйте** безопасность зависимостей

### Переменные окружения

Создайте файл `.env` (не коммитьте в Git):

```env
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
GOOGLE_CLIENT_ID=your-google-client-id
GEMINI_API_KEY=your-gemini-api-key
```

## 📞 Поддержка

### Полезные ссылки

- [Документация Supabase](https://supabase.com/docs)
- [Google API Documentation](https://developers.google.com/)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [GitHub Pages](https://pages.github.com/)

### Сообщения об ошибках

1. **Проверьте консоль браузера**
2. **Убедитесь в правильности конфигурации**
3. **Создайте Issue** в GitHub репозитории

## 🎉 Готово!

После выполнения всех шагов у вас будет:

✅ **Полнофункциональное веб-приложение**
✅ **Автоматический деплой** на GitHub Pages
✅ **База данных** с полной схемой
✅ **Интеграция** с Google сервисами
✅ **AI ассистент** на базе Gemini
✅ **Современный UI** с адаптивным дизайном

**Удачи в разработке! 🚀** 