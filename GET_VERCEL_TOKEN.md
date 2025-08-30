# 🔑 Получение VERCEL_TOKEN для исправления ошибки

## ❌ Проблема
GitHub Actions выдает ошибку:
```
Error! Project not found ({"VERCEL_PROJECT_ID":"***","VERCEL_ORG_ID":"***"})
```

## ✅ Решение

### Шаг 1: Получить новый токен Vercel

1. **Откройте Vercel Dashboard**: https://vercel.com/account/tokens
2. **Войдите в аккаунт** (если не вошли)
3. **Нажмите "Create Token"**
4. **Заполните форму**:
   - **Name**: `github-actions-secretary-plus`
   - **Expiration**: `No expiration`
   - **Description**: `Token for GitHub Actions deployment`
5. **Нажмите "Create"**
6. **Скопируйте токен** (он показывается только один раз!)

### Шаг 2: Обновить GitHub Secret

```bash
gh secret set VERCEL_TOKEN --body "ВАШ_НОВЫЙ_ТОКЕН"
```

**Пример:**
```bash
gh secret set VERCEL_TOKEN --body "v2_1234567890abcdef..."
```

### Шаг 3: Проверить настройку

```bash
gh secret list
```

Должны быть:
- ✅ `VERCEL_TOKEN` - новый токен
- ✅ `VERCEL_ORG_ID` - `evgenys-projects-4d95ed85`
- ✅ `VERCEL_PROJECT_ID` - `prj_eF2MDjaxygtxRylUZMK945moqPKN`

### Шаг 4: Тестирование

1. **Сделайте коммит и пуш:**
   ```bash
   git add .
   git commit -m "🔧 Исправление Vercel токена"
   git push origin main
   ```

2. **Проверьте GitHub Actions:**
   - Перейдите на вкладку Actions в репозитории
   - Дождитесь завершения workflow
   - Убедитесь, что нет ошибок

## 🔍 Проверка работоспособности

После настройки токена GitHub Actions должен успешно:

1. ✅ Клонировать репозиторий
2. ✅ Установить зависимости
3. ✅ Запустить тесты
4. ✅ Развернуть на Vercel
5. ✅ Показать ссылку на развертывание

## 🚨 Если ошибка повторяется

1. **Проверьте токен**: https://vercel.com/account/tokens
2. **Убедитесь, что токен не истек**
3. **Проверьте права доступа** к проекту
4. **Пересоздайте токен** при необходимости

## 📞 Поддержка

Если проблема не решается:
- Vercel Support: https://vercel.com/support
- GitHub Actions: https://github.com/actions/runner/issues 