# 🔑 Настройка VERCEL_TOKEN для GitHub Actions

## Проблема
GitHub Actions не может развернуть приложение на Vercel из-за неправильного токена.

## Решение

### 1. Получить новый токен Vercel

1. Откройте [Vercel Dashboard](https://vercel.com/account/tokens)
2. Войдите в свой аккаунт
3. Нажмите "Create Token"
4. Введите название: `github-actions-secretary-plus`
5. Выберите срок действия: `No expiration`
6. Скопируйте созданный токен

### 2. Обновить GitHub Secret

```bash
gh secret set VERCEL_TOKEN --body "ВАШ_НОВЫЙ_ТОКЕН"
```

### 3. Проверить все секреты

```bash
gh secret list
```

Должны быть:
- `VERCEL_TOKEN` - новый токен
- `VERCEL_ORG_ID` - `evgenys-projects-4d95ed85`
- `VERCEL_PROJECT_ID` - `prj_eF2MDjaxygtxRylUZMK945moqPKN`

### 4. Тестирование

После обновления токена:
1. Сделайте коммит и пуш
2. GitHub Actions автоматически запустится
3. Проверьте логи на вкладке Actions

## Альтернативное решение

Если токен не работает, можно использовать переменные окружения:

```yaml
env:
  VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Проверка работоспособности

После настройки токена GitHub Actions должен успешно:
1. Клонировать репозиторий
2. Установить зависимости
3. Развернуть приложение на Vercel
4. Показать ссылку на развертывание 