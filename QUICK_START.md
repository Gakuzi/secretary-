# ⚡ Быстрый старт - Секретарь+

## 🎯 Что нужно сделать прямо сейчас

### 1. Создайте репозиторий на GitHub

1. Перейдите на [GitHub.com](https://github.com)
2. Нажмите "+" → "New repository"
3. Название: `secretary-plus`
4. Описание: `Интеллектуальный веб-ассистент для управления цифровой продуктивностью`
5. Public
6. НЕ отмечайте "Add a README file"
7. Нажмите "Create repository"

### 2. Подключите локальный репозиторий

```bash
# Добавьте удаленный репозиторий (замените YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/secretary-plus.git

# Отправьте ветки
git checkout main
git push -u origin main

git checkout development
git push -u origin development
```

### 3. Настройте Supabase

1. Создайте проект на [supabase.com](https://supabase.com)
2. Выполните SQL из `services/supabase/migrations.sql`
3. Скопируйте URL и ANON_KEY

### 4. Настройте Google API

1. Создайте проект в [Google Cloud Console](https://console.cloud.google.com)
2. Включите нужные API (Calendar, Tasks, Gmail, Drive, etc.)
3. Создайте OAuth 2.0 Client ID
4. Получите API ключ Gemini на [Google AI Studio](https://makersuite.google.com/app/apikey)

### 5. Обновите конфигурацию

Отредактируйте `config.js`:

```javascript
SUPABASE: {
    URL: 'https://your-project.supabase.co',
    ANON_KEY: 'your-anon-key',
},
GOOGLE: {
    CLIENT_ID: 'your-google-client-id.apps.googleusercontent.com',
},
```

### 6. Запустите приложение

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

## 🎉 Готово!

Теперь у вас есть:
- ✅ Репозиторий на GitHub
- ✅ База данных Supabase
- ✅ Интеграция с Google API
- ✅ Работающее приложение

## 📚 Подробные инструкции

- `SETUP_GITHUB.md` - Пошаговая настройка GitHub
- `DEPLOYMENT_INSTRUCTIONS.md` - Полные инструкции по развертыванию
- `README.md` - Документация проекта

## 🚀 Следующие шаги

1. Реализуйте недостающие компоненты (ChatService, UIManager, etc.)
2. Добавьте новые функции
3. Протестируйте интеграции
4. Деплойте на продакшен

**Удачи! 🎯** 