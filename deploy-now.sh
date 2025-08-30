#!/bin/bash

echo "⚡ Мгновенное развертывание на Vercel..."
echo ""

# Автоматически коммитим и отправляем изменения
git add . && git commit -m "🚀 Быстрое обновление $(date '+%H:%M')" && git push origin main

# Разворачиваем на Vercel
echo "🚀 Разворачиваем..."
vercel --prod --yes

echo ""
echo "✅ Готово! Приложение обновлено!" 