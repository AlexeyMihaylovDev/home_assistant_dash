# 🏠 Smart Home Dashboard Card

Красивый, современный и цветной дашборд для Home Assistant с градиентным дизайном и анимациями.

![Dashboard Preview](https://via.placeholder.com/800x400/667eea/ffffff?text=Smart+Home+Dashboard)

## ✨ Особенности

- 🎨 **Современный дизайн** - Градиентный фон, прозрачные карточки с эффектом размытия (glass morphism)
- 🌈 **Цветной интерфейс** - Яркие цвета и плавные переходы
- 📱 **Адаптивный дизайн** - Отлично выглядит на всех устройствах
- ⚡ **Быстрые действия** - Управление всеми устройствами одним кликом
- 🏠 **Управление комнатами** - Организация устройств по комнатам
- 🌤️ **Виджет погоды** - Отображение текущей погоды
- ✨ **Анимации** - Плавные анимации при наведении и взаимодействии
- 🎯 **Интуитивный интерфейс** - Легко понять и использовать

## 📦 Установка

### Способ 1: Ручная установка

1. **Скопируйте файл карточки**
   - Скопируйте файл `smart-home-dashboard-card.js` в папку `/config/www/` вашего Home Assistant
   - Если папки `www` нет, создайте её

2. **Добавьте ресурс в Lovelace**
   - Перейдите в **Настройки** → **Панели управления**
   - Нажмите на три точки в правом верхнем углу
   - Выберите **Ресурсы**
   - Нажмите **+ Добавить ресурс**
   - Введите URL: `/local/smart-home-dashboard-card.js`
   - Выберите тип: **JavaScript Module**
   - Нажмите **Создать**

3. **Перезагрузите браузер** (Ctrl + F5)

### Способ 2: Через HACS (Home Assistant Community Store)

*Скоро будет доступно*

## 🎯 Использование

### Базовая конфигурация

Добавьте карточку на вашу панель управления:

```yaml
type: custom:smart-home-dashboard-card
title: Мой Умный Дом
rooms:
  - id: living_room
    name: Гостиная
    entities:
      - light.living_room_main
      - switch.tv
  - id: bedroom
    name: Спальня
    entities:
      - light.bedroom_main
```

### Полная конфигурация

```yaml
type: custom:smart-home-dashboard-card
title: Мой Умный Дом

# Сущность погоды (опционально)
weather_entity: weather.home

# Комнаты
rooms:
  - id: living_room
    name: Гостиная
    entities:
      - light.living_room_main
      - light.living_room_lamp
      - switch.tv
      - media_player.living_room
  
  - id: bedroom
    name: Спальня
    entities:
      - light.bedroom_main
      - light.bedroom_night
      - switch.bedroom_fan
  
  - id: kitchen
    name: Кухня
    entities:
      - light.kitchen_main
      - light.kitchen_counter
      - switch.coffee_maker
  
  - id: bathroom
    name: Ванная
    entities:
      - light.bathroom_main
      - switch.bathroom_heater
  
  - id: office
    name: Кабинет
    entities:
      - light.office_desk
      - switch.office_pc
  
  - id: garage
    name: Гараж
    entities:
      - light.garage_main
      - switch.garage_door
  
  - id: garden
    name: Сад
    entities:
      - light.garden_lights
      - switch.irrigation

# Быстрые действия (опционально)
quick_actions:
  - name: Все включить
    icon: 💡
    service: light.turn_on
    entity_id: all
  
  - name: Все выключить
    icon: 🌙
    service: light.turn_off
    entity_id: all
  
  - name: Режим кино
    icon: 🎬
    service: scene.turn_on
    entity_id: scene.movie_mode
  
  - name: Доброе утро
    icon: 🌅
    service: scene.turn_on
    entity_id: scene.good_morning
  
  - name: Спокойной ночи
    icon: 😴
    service: scene.turn_on
    entity_id: scene.good_night
  
  - name: Уборка
    icon: 🧹
    service: vacuum.start
    entity_id: vacuum.roomba
```

## 🎨 Доступные иконки комнат

Дашборд автоматически подбирает иконки для комнат по их ID:

- `living_room` - 🛋️ Гостиная
- `bedroom` - 🛏️ Спальня
- `kitchen` - 🍳 Кухня
- `bathroom` - 🚿 Ванная
- `office` - 💼 Кабинет
- `garage` - 🚗 Гараж
- `garden` - 🌿 Сад

Для других комнат используется 🏠

## 📱 Функциональность

### Управление комнатами

- **Клик по карточке комнаты** - Переключает все устройства в комнате (включает выключенные, выключает включенные)
- **Статус в реальном времени** - Показывает количество включенных и выключенных устройств
- **Анимация при наведении** - Карточка поднимается при наведении курсора

### Быстрые действия

- Настраиваемые кнопки для быстрого выполнения действий
- Можно вызывать любые сервисы Home Assistant
- Поддержка сцен, скриптов, автоматизаций

### Виджет погоды

- Отображает текущую температуру и состояние погоды
- Автоматически подбирает иконки для разных погодных условий
- Интегрируется с любой сущностью погоды в Home Assistant

## 🎨 Кастомизация

### Цветовая схема

Дашборд использует градиент фиолетово-синих тонов по умолчанию. Чтобы изменить цвета, отредактируйте CSS в файле `smart-home-dashboard-card.js`:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

Популярные альтернативы:

- **Закат**: `linear-gradient(135deg, #f093fb 0%, #f5576c 100%)`
- **Океан**: `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)`
- **Лес**: `linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)`
- **Огонь**: `linear-gradient(135deg, #fa709a 0%, #fee140 100%)`
- **Ночь**: `linear-gradient(135deg, #2c3e50 0%, #34495e 100%)`

## 🔧 Требования

- Home Assistant 2021.12.0 или новее
- Lovelace UI

## 📝 Примечания

- Все entity_id должны быть реальными сущностями в вашем Home Assistant
- Для работы погодного виджета нужна настроенная интеграция погоды
- Карточка автоматически обновляется при изменении состояний устройств

## 🐛 Устранение неполадок

### Карточка не отображается

1. Убедитесь, что файл скопирован в `/config/www/`
2. Проверьте, что ресурс добавлен в Lovelace
3. Перезагрузите браузер (Ctrl + F5)
4. Проверьте консоль браузера на наличие ошибок (F12)

### Устройства не переключаются

1. Убедитесь, что entity_id правильно указаны
2. Проверьте права доступа пользователя
3. Убедитесь, что устройства отвечают в Home Assistant

### Погода не отображается

1. Убедитесь, что у вас настроена интеграция погоды
2. Проверьте правильность entity_id погоды
3. Если не нужна погода, просто не указывайте `weather_entity`

## 📄 Лицензия

MIT License - используйте свободно в личных и коммерческих проектах!

## 💝 Поддержка

Если вам понравился этот дашборд, поставьте ⭐ на GitHub!

## 🤝 Вклад

Буду рад вашим предложениям и улучшениям! Создавайте Issues и Pull Requests.

---

Сделано с ❤️ для сообщества Home Assistant

