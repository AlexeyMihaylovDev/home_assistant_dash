# 🏠 Smart Home Dashboard Card

Красивый современный дашборд для Home Assistant с боковой панелью, живыми часами и розово-оранжевым градиентом.

[![GitHub Release](https://img.shields.io/github/v/release/YOUR_USERNAME/smart-home-dashboard-card?style=flat-square)](https://github.com/YOUR_USERNAME/smart-home-dashboard-card/releases)
[![GitHub Stars](https://img.shields.io/github/stars/YOUR_USERNAME/smart-home-dashboard-card?style=flat-square)](https://github.com/YOUR_USERNAME/smart-home-dashboard-card/stargazers)
[![License](https://img.shields.io/github/license/YOUR_USERNAME/smart-home-dashboard-card?style=flat-square)](LICENSE)
[![Home Assistant](https://img.shields.io/badge/Home%20Assistant-2021.12%2B-blue?style=flat-square)](https://www.home-assistant.io/)

![Dashboard Preview](https://via.placeholder.com/800x400/ff0844/ffffff?text=Smart+Home+Dashboard)

> **Примечание:** Замените `YOUR_USERNAME` на ваше имя пользователя GitHub во всех файлах!

## ✨ Особенности

- 🎨 **Современный дизайн** - Боковая панель с живыми часами и розово-оранжевый градиент
- ⏰ **Живые часы** - Обновляются каждую секунду автоматически
- 🌤️ **Детальная погода** - Температура, влажность, давление, ветер с иконками
- 📊 **Системная информация** - Количество активных устройств и комнат
- 😊 **Умное приветствие** - Меняется по времени суток
- 🏠 **Управление комнатами** - Организация устройств по комнатам
- ⚡ **Быстрые действия** - Управление всеми устройствами одним кликом
- ✨ **Анимации** - Плавные анимации при взаимодействии
- 📱 **Адаптивный дизайн** - Отлично выглядит на всех устройствах

## 📦 Установка

### Способ 1: Из GitHub (рекомендуется)

**Быстрая установка:**

```powershell
# Скачать файл в /config/www/
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/YOUR_USERNAME/smart-home-dashboard-card/main/smart-home-dashboard-card.js" -OutFile "smart-home-dashboard-card.js"
```

Затем:
1. Добавьте ресурс: `/local/smart-home-dashboard-card.js` (JavaScript Module)
2. Перезагрузите браузер (Ctrl + F5)

### Способ 2: Ручная установка

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

## 🎯 Использование

### Базовая конфигурация

Добавьте карточку на вашу панель управления:

```yaml
type: custom:smart-home-dashboard-card
title: Мой Умный Дом
weather_entity: weather.forecast_home
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

### Полная конфигурация

```yaml
type: custom:smart-home-dashboard-card
title: Умный Дом - Полная Версия

# Интеграция погоды (показывается на боковой панели)
weather_entity: weather.forecast_home

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
      - light.bathroom_mirror
      - switch.bathroom_heater
  
  - id: office
    name: Кабинет
    entities:
      - light.office_desk
      - light.office_main
      - switch.office_pc
  
  - id: hallway
    name: Прихожая
    entities:
      - light.hallway_main
      - light.hallway_entrance
  
  - id: garage
    name: Гараж
    entities:
      - light.garage_main
      - cover.garage_door
  
  - id: garden
    name: Сад
    entities:
      - light.garden_path_lights
      - switch.garden_irrigation

# Быстрые действия
quick_actions:
  - name: Все включить
    icon: 💡
    service: light.turn_on
    entity_id: all
  
  - name: Все выключить
    icon: 🌙
    service: light.turn_off
    entity_id: all
  
  - name: Доброе утро
    icon: 🌅
    service: scene.turn_on
    entity_id: scene.good_morning
  
  - name: Рабочий день
    icon: 💼
    service: scene.turn_on
    entity_id: scene.work_mode
  
  - name: Вечер
    icon: 🌆
    service: scene.turn_on
    entity_id: scene.evening
  
  - name: Спокойной ночи
    icon: 😴
    service: scene.turn_on
    entity_id: scene.good_night
  
  - name: Режим кино
    icon: 🎬
    service: scene.turn_on
    entity_id: scene.movie_mode
  
  - name: Вечеринка
    icon: 🎉
    service: scene.turn_on
    entity_id: scene.party_mode
  
  - name: Романтика
    icon: ❤️
    service: scene.turn_on
    entity_id: scene.romantic_mode
  
  - name: Чтение
    icon: 📚
    service: scene.turn_on
    entity_id: scene.reading_mode
  
  - name: Уборка
    icon: 🧹
    service: vacuum.start
    entity_id: vacuum.roomba
  
  - name: Климат авто
    icon: ❄️
    service: climate.set_preset_mode
    entity_id: climate.all
```

## 🏠 Доступные типы комнат

Дашборд автоматически подбирает иконки для комнат по их ID:

- `living_room` - 🛋️ Гостиная
- `bedroom` - 🛏️ Спальня
- `kitchen` - 🍳 Кухня
- `bathroom` - 🚿 Ванная
- `office` - 💼 Кабинет
- `garage` - 🚗 Гараж
- `garden` - 🌿 Сад
- `hallway` - 🚪 Прихожая
- `kids_room` - 🧸 Детская

Для других комнат используется 🏠

## 📱 Функциональность

### Боковая панель

- **⏰ Живые часы** - Обновляются каждую секунду
- **📅 Дата и время** - День недели, число, месяц, номер недели
- **😊 Умное приветствие** - Меняется по времени суток
- **🌤️ Детальная погода** - Температура, влажность, давление, ветер
- **📊 Системная информация** - Активные устройства, количество комнат

### Управление комнатами

- **Клик по карточке комнаты** - Переключает все устройства в комнате
- **Статус в реальном времени** - Показывает количество включенных и выключенных устройств
- **Анимация при наведении** - Карточка поднимается при наведении курсора

### Быстрые действия

- Настраиваемые кнопки для быстрого выполнения действий
- Можно вызывать любые сервисы Home Assistant
- Поддержка сцен, скриптов, автоматизаций

## 🎨 Кастомизация

### Цветовая схема

Дашборд использует розово-оранжевый градиент по умолчанию. Чтобы изменить цвета, отредактируйте CSS в файле `smart-home-dashboard-card.js`:

**Основная область (розово-оранжевый):**
```css
background: linear-gradient(135deg, #ff0844 0%, #ffb199 50%, #ffd89b 100%);
```

**Боковая панель (фиолетово-синий):**
```css
background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
```

**Популярные альтернативы:**

- **Океан**: `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)`
- **Лес**: `linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)`
- **Закат**: `linear-gradient(135deg, #f093fb 0%, #f5576c 100%)`
- **Ночь**: `linear-gradient(135deg, #2c3e50 0%, #34495e 100%)`

### Дополнительные настройки

- **Прозрачность карточек**: Измените `rgba(255, 255, 255, 0.25)` на желаемое значение
- **Радиус скругления**: Измените `border-radius: 16px` на желаемое значение
- **Размытие**: Измените `backdrop-filter: blur(10px)` на желаемое значение

## 🔧 Требования

- Home Assistant 2021.12.0 или новее
- Lovelace UI
- Браузер с поддержкой ES6+

## 📝 Примечания

- Все entity_id должны быть реальными сущностями в вашем Home Assistant
- Для работы погодного виджета нужна настроенная интеграция погоды
- Карточка автоматически обновляется при изменении состояний устройств
- Часы обновляются автоматически каждую секунду

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

### Часы не обновляются

1. Обновите страницу
2. Проверьте консоль браузера (F12)
3. Убедитесь что JavaScript не заблокирован

### Ошибка "Custom element doesn't exist"

1. Очистите кэш браузера полностью
2. Проверьте URL ресурса: должен быть `/local/smart-home-dashboard-card.js`
3. Убедитесь, что тип ресурса: "JavaScript Module"
4. Перезапустите Home Assistant

## 📚 Примеры сцен и автоматизаций

### Сцены

```yaml
scene:
  - name: Доброе утро
    id: good_morning
    entities:
      light.living_room_main:
        state: on
        brightness: 50
      light.kitchen_main:
        state: on
        brightness: 100
  
  - name: Спокойной ночи
    id: good_night
    entities:
      light.living_room_main:
        state: off
      light.kitchen_main:
        state: off
```

### Автоматизации

```yaml
automation:
  - id: auto_good_morning
    alias: Автоматическое доброе утро
    trigger:
      - platform: time
        at: "07:00:00"
    action:
      - service: scene.turn_on
        target:
          entity_id: scene.good_morning
  
  - id: auto_good_night
    alias: Автоматическая спокойная ночь
    trigger:
      - platform: time
        at: "23:00:00"
    action:
      - service: scene.turn_on
        target:
          entity_id: scene.good_night
```

## 💝 Поддержка

Если вам понравился этот дашборд, поставьте ⭐ на GitHub!

## 🤝 Вклад

Буду рад вашим предложениям и улучшениям! Создавайте Issues и Pull Requests.

## 📄 Лицензия

MIT License - используйте свободно в личных и коммерческих проектах!

---

Сделано с ❤️ для сообщества Home Assistant