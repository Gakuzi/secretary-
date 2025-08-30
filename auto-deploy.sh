#!/bin/bash

echo "🤖 Автоматическое развертывание Секретарь+ на Vercel"
echo "=================================================="

# Проверяем статус git
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Обнаружены незакоммиченные изменения..."
    echo "💾 Коммитим изменения..."
    git add .
    git commit -m "🚀 Автоматическое обновление - $(date '+%Y-%m-%d %H:%M:%S')"
    echo "✅ Изменения закоммичены"
else
    echo "✅ Все изменения уже закоммичены"
fi

# Отправляем в GitHub
echo "📤 Отправляем изменения в GitHub..."
git push origin main
echo "✅ Код отправлен в GitHub"

# Проверяем наличие vercel.json
if [ -f "vercel.json" ]; then
    echo "📋 Найдена основная конфигурация vercel.json"
    CONFIG_FILE="vercel.json"
elif [ -f "vercel.simple.json" ]; then
    echo "📋 Найдена упрощенная конфигурация vercel.simple.json"
    echo "🔄 Переименовываем в vercel.json..."
    mv vercel.simple.json vercel.json
    CONFIG_FILE="vercel.json"
else
    echo "❌ Конфигурация Vercel не найдена!"
    echo "🔧 Создаем базовую конфигурацию..."
    cat > vercel.json << 'EOF'
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
EOF
    CONFIG_FILE="vercel.json"
    echo "✅ Создана базовая конфигурация vercel.json"
fi

# Разворачиваем на Vercel
echo "🚀 Разворачиваем на Vercel..."
echo "📁 Используется конфигурация: $CONFIG_FILE"

# Проверяем, есть ли уже проект на Vercel
if vercel ls 2>/dev/null | grep -q "secretary-"; then
    echo "🔄 Обновляем существующий проект..."
    vercel --prod --yes
else
    echo "🆕 Создаем новый проект..."
    vercel --prod --yes
fi

echo ""
echo "🎉 Развертывание завершено!"
echo "🌐 Ваше приложение доступно по адресу выше"
echo ""
echo "💡 Теперь просто говорите мне свои идеи, и я буду:"
echo "   1. Реализовывать их в коде"
echo "   2. Автоматически разворачивать на Vercel"
echo "   3. Обновлять приложение в реальном времени!"
echo ""
echo "🔗 GitHub репозиторий: https://github.com/Gakuzi/secretary-" 