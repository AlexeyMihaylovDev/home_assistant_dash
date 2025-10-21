# 🚀 Быстрый старт

Начните использовать Smart Home Dashboard Card за 5 минут!

## Шаг 1: Скопируйте файл (1 минута)

1. Скачайте файл `smart-home-dashboard-card.js`
2. Поместите его в папку `/config/www/` вашего Home Assistant
3. Если папки `www` нет - создайте её

## Шаг 2: Добавьте ресурс (2 минуты)

1. В Home Assistant перейдите на главную страницу
2. Нажмите три точки (⋮) → **"Настроить интерфейс"**
3. Снова три точки (⋮) → **"Ресурсы"**
4. Нажмите **"+ ДОБАВИТЬ РЕСУРС"**
5. Введите:
   - URL: `/local/smart-home-dashboard-card.js`
   - Тип: **JavaScript Module**
6. Нажмите **"Создать"**

## Шаг 3: Перезагрузите страницу (10 секунд)

Нажмите **Ctrl + F5** (или **Cmd + Shift + R** на Mac)

## Шаг 4: Добавьте карточку (2 минуты)

1. Перейдите на панель управления
2. Три точки (⋮) → **"Редактировать панель"**
3. **"+ ДОБАВИТЬ КАРТОЧКУ"**
4. Выберите **"Вручную"** внизу списка
5. Вставьте этот код:

```yaml
type: custom:smart-home-dashboard-card
title: Мой Умный Дом
rooms:
  - id: living_room
    name: Гостиная
    entities:
      - light.living_room
  - id: bedroom
    name: Спальня
    entities:
      - light.bedroom
```

6. **Замените** `light.living_room` и `light.bedroom` на ваши реальные entity_id
7. Нажмите **"Сохранить"** → **"Готово"**

## ✅ Готово!

Вы должны увидеть красивый дашборд с градиентным фоном! 🎉

## 🎯 Следующие шаги

### Добавьте больше комнат

```yaml
rooms:
  - id: living_room
    name: Гостиная
    entities:
      - light.living_room_main
      - switch.tv
  
  - id: kitchen
    name: Кухня
    entities:
      - light.kitchen_main
  
  - id: bedroom
    name: Спальня
    entities:
      - light.bedroom_main
```

### Добавьте погоду

```yaml
weather_entity: weather.home
```

### Добавьте быстрые действия

```yaml
quick_actions:
  - name: Все включить
    icon: 💡
    service: light.turn_on
    entity_id: all
  
  - name: Все выключить
    icon: 🌙
    service: light.turn_off
    entity_id: all
```

## 📚 Узнайте больше

- **[README.md](README.md)** - Полное описание возможностей
- **[INSTALLATION.md](INSTALLATION.md)** - Подробная инструкция
- **[examples/](examples/)** - Примеры конфигураций
  - `minimal-config.yaml` - Минимальная настройка
  - `advanced-config.yaml` - Все возможности
  - `color-schemes.css` - 40+ цветовых схем
  - `scenes-automation.yaml` - Готовые сцены

## ❓ Нужна помощь?

### Карточка не появилась?
1. Очистите кэш: Ctrl + F5
2. Проверьте консоль браузера: F12
3. Убедитесь, что файл в `/config/www/`

### Устройства не отображаются?
1. Проверьте entity_id в разделе **Разработчик → Состояния**
2. Убедитесь, что устройства работают в Home Assistant

### Хотите изменить цвета?
Откройте `examples/color-schemes.css` - там 40+ готовых вариантов!

---

**Наслаждайтесь вашим новым дашбордом!** 🏠✨

