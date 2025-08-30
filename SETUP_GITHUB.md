# 🚀 Создание репозитория на GitHub

## Пошаговая инструкция

### Шаг 1: Создание репозитория на GitHub

1. **Откройте GitHub.com** и войдите в свой аккаунт
2. **Нажмите кнопку "+"** в правом верхнем углу
3. **Выберите "New repository"**
4. **Заполните форму:**
   - **Repository name**: `secretary-plus`
   - **Description**: `Интеллектуальный веб-ассистент для управления цифровой продуктивностью с интеграцией Google сервисов и использованием AI модели Gemini`
   - **Visibility**: Public
   - **НЕ отмечайте** "Add a README file"
   - **НЕ отмечайте** "Add .gitignore"
   - **НЕ отмечайте** "Choose a license"
5. **Нажмите "Create repository"**

### Шаг 2: Подключение локального репозитория

После создания репозитория GitHub покажет инструкции. Выполните следующие команды:

```bash
# Убедитесь, что вы в папке проекта
cd "Ассистент +"

# Добавьте удаленный репозиторий (замените YOUR_USERNAME на ваше имя пользователя)
git remote add origin https://github.com/YOUR_USERNAME/secretary-plus.git

# Отправьте ветку main
git checkout main
git push -u origin main

# Отправьте ветку development
git checkout development
git push -u origin development
```

### Шаг 3: Настройка GitHub Pages

1. **Перейдите в Settings** вашего репозитория
2. **Найдите раздел "Pages"** в левом меню
3. **В разделе "Source" выберите:**
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)
4. **Нажмите "Save"**

### Шаг 4: Настройка защиты веток (рекомендуется)

1. **В Settings → Branches**
2. **Нажмите "Add rule"**
3. **Введите "main" в Branch name pattern**
4. **Отметьте:**
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging
   - ✅ Include administrators
5. **Нажмите "Create"**

### Шаг 5: Проверка

После выполнения всех шагов:

1. **Откройте ваш репозиторий** на GitHub
2. **Убедитесь, что все файлы загружены**
3. **Проверьте, что README.md отображается корректно**
4. **Проверьте, что GitHub Pages работает** (если настроили)

## 🔗 Полезные ссылки

- [Ваш репозиторий](https://github.com/YOUR_USERNAME/secretary-plus)
- [GitHub Pages](https://YOUR_USERNAME.github.io/secretary-plus) (после настройки)
- [Issues](https://github.com/YOUR_USERNAME/secretary-plus/issues)
- [Pull Requests](https://github.com/YOUR_USERNAME/secretary-plus/pulls)

## 📋 Чек-лист

- [ ] Репозиторий создан на GitHub
- [ ] Локальный репозиторий подключен
- [ ] Ветка main отправлена
- [ ] Ветка development отправлена
- [ ] GitHub Pages настроен
- [ ] Защита веток настроена
- [ ] Все файлы загружены корректно

## 🎉 Готово!

Теперь ваш проект размещен на GitHub и готов к разработке! 

**Следующие шаги:**
1. Обновите конфигурацию в `config.js`
2. Настройте Supabase и Google API
3. Начните разработку новых функций

## 📞 Поддержка

Если у вас возникли проблемы:
1. Проверьте консоль браузера на наличие ошибок
2. Убедитесь, что все команды выполнены корректно
3. Проверьте права доступа к репозиторию 