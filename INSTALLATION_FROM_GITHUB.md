# 📦 Установка из GitHub

Установите Smart Home Dashboard Card прямо из GitHub репозитория!

---

## 🚀 Способ 1: Быстрая установка (рекомендуется)

### Шаг 1: Скачать файл

**Вариант A: Через браузер**

1. Перейдите на GitHub: `https://github.com/YOUR_USERNAME/smart-home-dashboard-card`
2. Нажмите на файл `smart-home-dashboard-card.js`
3. Нажмите кнопку "Raw" (справа сверху)
4. Нажмите Ctrl+S (Сохранить страницу)
5. Сохраните как `smart-home-dashboard-card.js`

**Вариант B: Прямая ссылка**

Скопируйте эту команду в PowerShell (в папке `/config/www/` вашего Home Assistant):

```powershell
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/YOUR_USERNAME/smart-home-dashboard-card/main/smart-home-dashboard-card.js" -OutFile "smart-home-dashboard-card.js"
```

**Вариант C: С помощью wget (если установлен)**

```bash
cd /config/www/
wget https://raw.githubusercontent.com/YOUR_USERNAME/smart-home-dashboard-card/main/smart-home-dashboard-card.js
```

### Шаг 2: Поместить в Home Assistant

1. Скопируйте файл в `/config/www/` вашего Home Assistant
2. Если папки `www` нет - создайте её

### Шаг 3: Добавить ресурс

1. Настройки → Панели управления → Ресурсы (три точки)
2. + ДОБАВИТЬ РЕСУРС
3. URL: `/local/smart-home-dashboard-card.js`
4. Тип: JavaScript Module
5. Сохранить

### Шаг 4: Использовать

Готово! Теперь добавьте карточку на панель (см. `QUICKSTART.md`)

---

## 🔧 Способ 2: Установка через Git (для продвинутых)

### Если у вас есть SSH доступ к Home Assistant:

```bash
# Подключитесь по SSH
ssh root@homeassistant.local

# Перейдите в папку www
cd /config/www/

# Клонируйте репозиторий
git clone https://github.com/YOUR_USERNAME/smart-home-dashboard-card.git temp

# Скопируйте файл
cp temp/smart-home-dashboard-card.js .

# Удалите временную папку
rm -rf temp
```

### Или клонируйте весь репозиторий:

```bash
cd /config/
git clone https://github.com/YOUR_USERNAME/smart-home-dashboard-card.git
```

Затем используйте URL: `/local/smart-home-dashboard-card/smart-home-dashboard-card.js`

---

## 📥 Способ 3: Через File Editor

Если у вас установлен File Editor:

1. Откройте File Editor в Home Assistant
2. Создайте файл `/config/www/smart-home-dashboard-card.js`
3. Откройте GitHub репозиторий в браузере
4. Откройте файл `smart-home-dashboard-card.js`
5. Нажмите "Raw"
6. Скопируйте весь код (Ctrl+A, Ctrl+C)
7. Вставьте в File Editor (Ctrl+V)
8. Сохраните (Ctrl+S)

---

## 🔄 Обновление до новой версии

### Способ 1: Вручную

1. Перейдите на GitHub
2. Проверьте наличие обновлений
3. Скачайте новый файл
4. Замените старый файл в `/config/www/`
5. Очистите кэш браузера (Ctrl+F5)

### Способ 2: Через PowerShell/wget

```powershell
# В папке /config/www/
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/YOUR_USERNAME/smart-home-dashboard-card/main/smart-home-dashboard-card.js" -OutFile "smart-home-dashboard-card.js"
```

### Способ 3: Через Git (если клонировали репозиторий)

```bash
cd /config/smart-home-dashboard-card/
git pull
```

Затем очистите кэш: Ctrl+F5

---

## 📦 Установка примеров конфигураций

### Скачать примеры:

```powershell
# Minimal config
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/YOUR_USERNAME/smart-home-dashboard-card/main/examples/minimal-config.yaml" -OutFile "minimal-config.yaml"

# Advanced config
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/YOUR_USERNAME/smart-home-dashboard-card/main/examples/advanced-config.yaml" -OutFile "advanced-config.yaml"

# Scenes
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/YOUR_USERNAME/smart-home-dashboard-card/main/examples/scenes-automation.yaml" -OutFile "scenes-automation.yaml"
```

---

## 🎨 Скачать цветовые схемы

```powershell
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/YOUR_USERNAME/smart-home-dashboard-card/main/examples/color-schemes.css" -OutFile "color-schemes.css"
```

Откройте файл и выберите понравившийся градиент!

---

## 📱 Способ 4: Через Samba/Network Share

Если у вас настроен Samba:

1. Подключитесь к сетевой папке: `\\homeassistant.local\config`
2. Откройте папку `www`
3. Перетащите файл `smart-home-dashboard-card.js` из загрузок

---

## ✅ Проверка установки

После установки:

1. Очистите кэш браузера: **Ctrl + F5**
2. Откройте DevTools: **F12**
3. Перейдите в Console
4. Не должно быть ошибок связанных с `smart-home-dashboard-card`
5. Попробуйте добавить карточку на панель

Если видите карточку в списке кастомных - всё работает! ✅

---

## 🐛 Решение проблем

### Файл не скачивается

**Проблема:** Ошибка при скачивании через PowerShell

**Решение:**
1. Скачайте вручную через браузер
2. Проверьте интернет-соединение
3. Убедитесь что URL правильный

### Карточка не появляется

**Проблема:** После установки карточка не видна

**Решения:**
1. Очистите кэш: Ctrl + F5
2. Проверьте что файл лежит в `/config/www/`
3. Проверьте что ресурс добавлен правильно
4. Посмотрите консоль браузера (F12) на ошибки

### Ошибка "404 Not Found"

**Проблема:** Home Assistant не находит файл

**Решения:**
1. Проверьте путь к файлу
2. URL должен быть `/local/smart-home-dashboard-card.js`
3. Файл должен лежать в `/config/www/`
4. Перезапустите Home Assistant

### Ошибка в консоли

**Проблема:** JavaScript ошибки в консоли

**Решения:**
1. Убедитесь что скачали полный файл (не HTML страницу)
2. Проверьте что файл не повреждён
3. Скачайте заново с GitHub
4. Используйте кнопку "Raw" на GitHub

---

## 📚 Дополнительная документация

После установки изучите:

- `README.md` - Полное описание
- `QUICKSTART.md` - Быстрый старт
- `INSTALLATION.md` - Подробная инструкция
- `examples/` - Примеры конфигураций

Все файлы доступны в репозитории!

---

## 💡 Совет

**Следите за обновлениями!**

1. На GitHub нажмите **"Watch"** → **"Releases only"**
2. Вы получите уведомление о новых версиях
3. Или периодически проверяйте раздел **"Releases"**

---

## 🌟 Поддержите проект

Если вам понравилось:
- ⭐ Поставьте звезду на GitHub
- 🐛 Сообщайте о багах в Issues
- 💡 Предлагайте идеи в Discussions
- 🔧 Делайте Pull Requests с улучшениями

---

**Готово!** Наслаждайтесь вашим новым дашбордом! 🏠✨

**Не забудьте заменить `YOUR_USERNAME` на реальное имя пользователя GitHub!**

