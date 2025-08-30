#!/bin/bash

echo "🚀 Развертывание проекта Секретарь+"

# Проверяем статус git
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Есть незакоммиченные изменения. Коммитим..."
    git add .
    git commit -m "🚀 Автоматическое обновление для развертывания"
fi

# Отправляем изменения в GitHub
echo "📤 Отправляем изменения в GitHub..."
git push origin main

echo "✅ Изменения отправлены в GitHub!"
echo ""
echo "🌐 Теперь разверните на одной из платформ:"
echo "   1. Vercel: https://vercel.com (рекомендуется)"
echo "   2. Netlify: https://netlify.com"
echo ""
echo "📋 Инструкции по развертыванию см. в DEPLOYMENT.md"
echo ""
echo "🔗 Ваш репозиторий: https://github.com/Gakuzi/secretary-" 