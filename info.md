# Smart Home Dashboard Card

Красивый, современный и цветной дашборд для Home Assistant с градиентным дизайном и анимациями.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Home Assistant](https://img.shields.io/badge/Home%20Assistant-2021.12%2B-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Основные возможности

- 🎨 **Современный дизайн** - Градиентный фон, прозрачные карточки с glass morphism эффектом
- 🌈 **Цветной интерфейс** - Яркие цвета и плавные переходы
- 📱 **Адаптивный** - Отлично выглядит на всех устройствах
- ⚡ **Быстрые действия** - Управление всеми устройствами одним кликом
- 🏠 **Управление комнатами** - Организация устройств по комнатам
- 🌤️ **Виджет погоды** - Отображение текущей погоды
- ✨ **Анимации** - Плавные анимации при взаимодействии

## 📦 Установка

### Через HACS (рекомендуется)

1. Откройте HACS
2. Перейдите в "Frontend"
3. Нажмите "+" и найдите "Smart Home Dashboard Card"
4. Установите
5. Перезагрузите Home Assistant

### Вручную

1. Скачайте `smart-home-dashboard-card.js`
2. Поместите в `/config/www/`
3. Добавьте ресурс в Lovelace:
   - URL: `/local/smart-home-dashboard-card.js`
   - Тип: JavaScript Module

## 🎯 Быстрый старт

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

## 🌤️ С погодой

```yaml
type: custom:smart-home-dashboard-card
title: Мой Умный Дом
weather_entity: weather.home
rooms:
  - id: living_room
    name: Гостиная
    entities:
      - light.living_room
```

## ⚡ С быстрыми действиями

```yaml
type: custom:smart-home-dashboard-card
title: Мой Умный Дом
rooms:
  - id: living_room
    name: Гостиная
    entities:
      - light.living_room
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

## 🏠 Доступные типы комнат

- `living_room` - 🛋️ Гостиная
- `bedroom` - 🛏️ Спальня
- `kitchen` - 🍳 Кухня
- `bathroom` - 🚿 Ванная
- `office` - 💼 Кабинет
- `garage` - 🚗 Гараж
- `garden` - 🌿 Сад

## 🎨 Кастомизация

Измените цветовую схему в файле `.js`:

```css
/* По умолчанию - фиолетово-синий */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Океан */
background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);

/* Закат */
background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);

/* Лес */
background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
```

Более 40 готовых цветовых схем доступны в документации!

## 📚 Документация

- [README](https://github.com/YOUR_USERNAME/smart-home-dashboard-card/blob/main/README.md)
- [Быстрый старт](https://github.com/YOUR_USERNAME/smart-home-dashboard-card/blob/main/QUICKSTART.md)
- [Примеры](https://github.com/YOUR_USERNAME/smart-home-dashboard-card/tree/main/examples)
- [Цветовые схемы](https://github.com/YOUR_USERNAME/smart-home-dashboard-card/blob/main/examples/color-schemes.css)

## 💝 Поддержка

- 🐛 [Сообщить о баге](https://github.com/YOUR_USERNAME/smart-home-dashboard-card/issues)
- 💡 [Предложить идею](https://github.com/YOUR_USERNAME/smart-home-dashboard-card/discussions)
- ⭐ [Поставить звезду](https://github.com/YOUR_USERNAME/smart-home-dashboard-card)

---

**Не забудьте заменить `YOUR_USERNAME` на ваше имя пользователя GitHub!**

