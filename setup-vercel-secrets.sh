#!/bin/bash

# 🚀 Скрипт настройки Vercel секретов для GitHub Actions
# Автоматически получает и настраивает все необходимые секреты

echo "🔧 Настройка Vercel секретов для GitHub Actions..."
echo ""

# Проверяем наличие Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI не установлен. Установите его: npm i -g vercel"
    exit 1
fi

# Проверяем аутентификацию в Vercel
echo "🔐 Проверка аутентификации в Vercel..."
if ! vercel whoami &> /dev/null; then
    echo "❌ Не авторизованы в Vercel. Выполните: vercel login"
    exit 1
fi

echo "✅ Авторизованы в Vercel как: $(vercel whoami)"
echo ""

# Получаем Organization ID (используем известное значение)
echo "🏢 Получение Organization ID..."
ORG_ID="evgenys-projects-4d95ed85"

if [ -z "$ORG_ID" ]; then
    echo "❌ Не удалось получить Organization ID"
    exit 1
fi

echo "✅ Organization ID: $ORG_ID"
echo ""

# Получаем Project ID для secretary--bb (используем известное значение)
echo "📁 Получение Project ID для secretary--bb..."
PROJECT_ID="prj_eF2MDjaxygtxRylUZMK945moqPKN"

if [ -z "$PROJECT_ID" ]; then
    echo "❌ Не удалось получить Project ID для secretary--bb"
    exit 1
fi

echo "✅ Project ID: $PROJECT_ID"
echo ""

# Проверяем наличие GitHub CLI
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI не установлен. Установите его: brew install gh"
    exit 1
fi

# Проверяем аутентификацию в GitHub
echo "🔐 Проверка аутентификации в GitHub..."
if ! gh auth status &> /dev/null; then
    echo "❌ Не авторизованы в GitHub. Выполните: gh auth login"
    exit 1
fi

echo "✅ Авторизованы в GitHub"
echo ""

# Обновляем секреты
echo "🔑 Обновление GitHub Secrets..."

echo "Обновление VERCEL_ORG_ID..."
gh secret set VERCEL_ORG_ID --body "$ORG_ID"

echo "Обновление VERCEL_PROJECT_ID..."
gh secret set VERCEL_PROJECT_ID --body "$PROJECT_ID"

echo ""
echo "⚠️  ВАЖНО: VERCEL_TOKEN нужно настроить вручную!"
echo ""
echo "📋 Инструкция по получению VERCEL_TOKEN:"
echo "1. Откройте: https://vercel.com/account/tokens"
echo "2. Нажмите 'Create Token'"
echo "3. Название: github-actions-secretary-plus"
echo "4. Срок: No expiration"
echo "5. Скопируйте токен"
echo ""
echo "6. Выполните команду:"
echo "   gh secret set VERCEL_TOKEN --body 'ВАШ_ТОКЕН'"
echo ""

# Проверяем текущие секреты
echo "📋 Текущие GitHub Secrets:"
gh secret list

echo ""
echo "✅ Настройка завершена!"
echo ""
echo "🔍 Для проверки:"
echo "1. Сделайте коммит и пуш"
echo "2. Проверьте GitHub Actions"
echo "3. Убедитесь, что развертывание прошло успешно" 