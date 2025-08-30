# 🚀 Настройка репозитория на GitHub

## Шаги для создания репозитория:

### 1. Создание репозитория на GitHub

1. Перейдите на [GitHub.com](https://github.com)
2. Нажмите кнопку "New repository" или "+" в правом верхнем углу
3. Заполните форму:
   - **Repository name**: `secretary-plus`
   - **Description**: `Интеллектуальный веб-ассистент для управления цифровой продуктивностью с интеграцией Google сервисов и использованием AI модели Gemini`
   - **Visibility**: Public
   - **Initialize this repository with**: НЕ отмечайте никаких опций
4. Нажмите "Create repository"

### 2. Подключение локального репозитория к GitHub

После создания репозитория на GitHub, выполните следующие команды:

```bash
# Добавление удаленного репозитория
git remote add origin https://github.com/YOUR_USERNAME/secretary-plus.git

# Отправка ветки main
git checkout main
git push -u origin main

# Отправка ветки development
git checkout development
git push -u origin development
```

### 3. Настройка защиты веток (опционально)

В настройках репозитория на GitHub:
1. Перейдите в Settings → Branches
2. Добавьте правило для ветки `main`:
   - Require pull request reviews before merging
   - Require status checks to pass before merging
   - Include administrators

### 4. Настройка GitHub Pages (для демонстрации)

1. Перейдите в Settings → Pages
2. Source: Deploy from a branch
3. Branch: main
4. Folder: / (root)
5. Нажмите Save

### 5. Настройка Actions (опционально)

Создайте файл `.github/workflows/deploy.yml` для автоматического деплоя:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
```

## 📋 Чек-лист после создания репозитория:

- [ ] Репозиторий создан на GitHub
- [ ] Локальный репозиторий подключен к GitHub
- [ ] Ветка main отправлена
- [ ] Ветка development отправлена
- [ ] README.md отображается корректно
- [ ] .gitignore работает правильно
- [ ] Все файлы загружены

## 🔗 Полезные ссылки:

- [GitHub Pages](https://pages.github.com/)
- [GitHub Actions](https://github.com/features/actions)
- [GitHub CLI](https://cli.github.com/) (для автоматизации)

## 📝 Примечания:

- Убедитесь, что в `config.js` не содержатся реальные API ключи
- Для продакшена используйте переменные окружения
- Регулярно обновляйте зависимости
- Следите за безопасностью зависимостей 