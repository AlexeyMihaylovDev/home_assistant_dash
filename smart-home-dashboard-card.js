class SmartHomeDashboardCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  setConfig(config) {
    if (!config) {
      throw new Error('Необходима конфигурация');
    }
    this.config = config;
  }

  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  getCardSize() {
    return 8;
  }

  updateTime() {
    this.currentTime = new Date();
    if (this.shadowRoot && this.shadowRoot.querySelector('.clock-time')) {
      this.shadowRoot.querySelector('.clock-time').textContent = 
        this.currentTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
      this.shadowRoot.querySelector('.clock-date').textContent = 
        this.currentTime.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });
    }
  }

  render() {
    if (!this._hass || !this.config) {
      return;
    }

    const rooms = this.config.rooms || [];
    const title = this.config.title || 'Умный Дом';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .dashboard-wrapper {
          display: flex;
          min-height: 600px;
          background: linear-gradient(135deg, #ff0844 0%, #ffb199 50%, #ffd89b 100%);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        /* ═══════════════════════════════════════
           ЛЕВАЯ БОКОВАЯ ПАНЕЛЬ
           ═══════════════════════════════════════ */
        .sidebar {
          width: 280px;
          background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          color: white;
          box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
        }

        /* Часы */
        .clock {
          margin-bottom: 32px;
        }

        .clock-time {
          font-size: 48px;
          font-weight: 700;
          margin: 0;
          line-height: 1;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .clock-date {
          font-size: 14px;
          opacity: 0.9;
          margin-top: 8px;
        }

        .week-info {
          font-size: 13px;
          opacity: 0.8;
          margin-top: 4px;
        }

        /* Приветствие */
        .greeting {
          font-size: 16px;
          margin: 16px 0;
          padding: 12px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        /* Погода на боковой панели */
        .sidebar-weather {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 24px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .weather-main {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .weather-icon-big {
          font-size: 48px;
        }

        .weather-temp-big {
          font-size: 36px;
          font-weight: 700;
        }

        .weather-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 12px;
          font-size: 12px;
          opacity: 0.9;
        }

        .weather-detail {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* Системная информация */
        .system-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 24px;
        }

        .system-stat {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 12px;
          backdrop-filter: blur(10px);
        }

        .system-stat-label {
          font-size: 11px;
          opacity: 0.8;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .system-stat-value {
          font-size: 18px;
          font-weight: 600;
        }

        /* Иконка внизу */
        .sidebar-footer {
          margin-top: auto;
          padding-top: 24px;
          text-align: center;
          opacity: 0.6;
        }

        .sidebar-footer svg {
          width: 32px;
          height: 32px;
        }

        /* ═══════════════════════════════════════
           ОСНОВНАЯ ОБЛАСТЬ
           ═══════════════════════════════════════ */
        .main-content {
          flex: 1;
          padding: 32px;
          overflow-y: auto;
          max-height: 800px;
          background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
        }

        .content-header {
          margin-bottom: 32px;
        }

        .content-title {
          font-size: 32px;
          font-weight: 700;
          margin: 0;
          color: white;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .content-subtitle {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.9);
          margin-top: 8px;
        }

        /* Сетка комнат */
        .rooms-section {
          margin-bottom: 32px;
        }

        .section-title {
          font-size: 20px;
          font-weight: 600;
          color: white;
          margin-bottom: 16px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .rooms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .room-card {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 20px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .room-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .room-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .room-card:hover::before {
          opacity: 1;
        }

        .room-header {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
        }

        .room-icon {
          font-size: 28px;
          margin-right: 12px;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          backdrop-filter: blur(5px);
        }

        .room-info {
          flex: 1;
        }

        .room-name {
          font-size: 16px;
          font-weight: 600;
          margin: 0;
          color: white;
        }

        .room-devices-count {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
          margin-top: 2px;
        }

        .room-status {
          display: flex;
          gap: 8px;
          margin-top: 12px;
          flex-wrap: wrap;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          font-size: 11px;
          font-weight: 500;
          color: white;
          backdrop-filter: blur(5px);
        }

        .status-badge.on {
          background: rgba(16, 185, 129, 0.5);
        }

        .status-badge.off {
          background: rgba(107, 114, 128, 0.4);
        }

        .status-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          margin-right: 4px;
          animation: pulse 2s infinite;
        }

        .status-indicator.on {
          background: #10b981;
        }

        .status-indicator.off {
          background: #9ca3af;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        /* Быстрые действия */
        .quick-actions {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 24px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          margin-top: 24px;
        }

        .quick-actions-title {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 16px 0;
          color: white;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 12px;
        }

        .action-button {
          background: rgba(255, 255, 255, 0.25);
          border: none;
          border-radius: 12px;
          padding: 16px 12px;
          color: white;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 500;
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .action-button:hover {
          background: rgba(255, 255, 255, 0.35);
          transform: scale(1.05);
          border-color: rgba(255, 255, 255, 0.4);
        }

        .action-button:active {
          transform: scale(0.95);
        }

        .action-icon {
          font-size: 24px;
        }

        /* ═══════════════════════════════════════
           МОДАЛЬНОЕ ОКНО ДЛЯ УСТРОЙСТВ
           ═══════════════════════════════════════ */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(5px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .modal-overlay.show {
          opacity: 1;
          visibility: visible;
        }

        .modal-content {
          background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
          border-radius: 24px;
          padding: 32px;
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          transform: scale(0.8);
          transition: transform 0.3s ease;
        }

        .modal-overlay.show .modal-content {
          transform: scale(1);
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .modal-title {
          font-size: 24px;
          font-weight: 700;
          color: white;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .modal-close {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          transition: all 0.3s;
        }

        .modal-close:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        .devices-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 16px;
        }

        .device-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .device-card:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .device-header {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
        }

        .device-icon {
          font-size: 24px;
          margin-right: 12px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }

        .device-info {
          flex: 1;
        }

        .device-name {
          font-size: 16px;
          font-weight: 600;
          color: white;
          margin: 0;
        }

        .device-type {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 2px;
        }

        .device-status {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 12px;
        }

        .device-state {
          font-size: 14px;
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .device-state.on {
          background: rgba(16, 185, 129, 0.6);
        }

        .device-state.off {
          background: rgba(107, 114, 128, 0.6);
        }

        .device-state.unavailable {
          background: rgba(239, 68, 68, 0.6);
        }

        .device-toggle {
          background: rgba(255, 255, 255, 0.3);
          border: none;
          border-radius: 8px;
          padding: 8px 16px;
          color: white;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          transition: all 0.3s;
        }

        .device-toggle:hover {
          background: rgba(255, 255, 255, 0.4);
        }

        /* Адаптивность */
        @media (max-width: 1024px) {
          .dashboard-wrapper {
            flex-direction: column;
          }

          .sidebar {
            width: 100%;
            padding: 24px;
          }

          .clock-time {
            font-size: 36px;
          }

          .sidebar-weather {
            margin-bottom: 16px;
          }

          .system-info {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
          }

          .modal-content {
            width: 95%;
            padding: 24px;
          }

          .devices-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .main-content {
            padding: 20px;
          }

          .rooms-grid {
            grid-template-columns: 1fr;
          }

          .content-title {
            font-size: 24px;
          }

          .modal-content {
            padding: 20px;
          }

          .modal-title {
            font-size: 20px;
          }
        }
      </style>

      <ha-card>
        <div class="dashboard-wrapper">
          <!-- ЛЕВАЯ БОКОВАЯ ПАНЕЛЬ -->
          <div class="sidebar">
            <!-- Часы -->
            <div class="clock">
              <div class="clock-time">${this.currentTime ? this.currentTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : '00:00'}</div>
              <div class="clock-date">${this.currentTime ? this.currentTime.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' }) : ''}</div>
              <div class="week-info">Неделя ${this.getWeekNumber()}</div>
            </div>

            <!-- Приветствие -->
            <div class="greeting">
              ${this.getGreeting()} 😊
            </div>

            <!-- Погода -->
            ${this.renderSidebarWeather()}

            <!-- Системная информация -->
            <div class="system-info">
              <div class="system-stat">
                <div class="system-stat-label">Активные</div>
                <div class="system-stat-value">${this.getActiveDevices()} шт</div>
              </div>
              <div class="system-stat">
                <div class="system-stat-label">Комнаты</div>
                <div class="system-stat-value">${rooms.length}</div>
              </div>
            </div>

            <!-- Иконка Home Assistant -->
            <div class="sidebar-footer">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.8 13h-2.8c0 0-0.2-0.9-0.5-1.4-0.3-0.5-0.7-1-1.2-1.4-0.5-0.4-1.1-0.7-1.8-0.9-0.7-0.2-1.4-0.3-2.1-0.3s-1.5 0.1-2.2 0.3c-0.7 0.2-1.3 0.5-1.8 0.9-0.5 0.4-0.9 0.9-1.2 1.4-0.3 0.5-0.5 1.1-0.6 1.8h-2.8l-0.8 1.5 2.8 0c0.1 0.7 0.3 1.3 0.6 1.8 0.3 0.5 0.7 1 1.2 1.4 0.5 0.4 1.1 0.7 1.8 0.9 0.7 0.2 1.4 0.3 2.2 0.3s1.5-0.1 2.1-0.3c0.7-0.2 1.3-0.5 1.8-0.9 0.5-0.4 0.9-0.9 1.2-1.4 0.3-0.5 0.5-1.1 0.5-1.8h2.8l0.8-1.5z"/>
              </svg>
            </div>
          </div>

          <!-- ОСНОВНАЯ ОБЛАСТЬ -->
          <div class="main-content">
            <!-- Заголовок -->
            <div class="content-header">
              <h1 class="content-title">${title}</h1>
              <div class="content-subtitle">🏠 Управление вашим умным домом</div>
            </div>

            <!-- Комнаты -->
            <div class="rooms-section">
              <h2 class="section-title">Комнаты</h2>
              <div class="rooms-grid">
                ${rooms.map(room => this.renderRoom(room)).join('')}
              </div>
            </div>

            <!-- Быстрые действия -->
            ${this.renderQuickActions()}
          </div>
        </div>

        <!-- МОДАЛЬНОЕ ОКНО ДЛЯ УСТРОЙСТВ -->
        <div class="modal-overlay" id="devicesModal">
          <div class="modal-content">
            <div class="modal-header">
              <h2 class="modal-title" id="modalTitle">
                <span id="modalIcon">🏠</span>
                <span id="modalRoomName">Комната</span>
              </h2>
              <button class="modal-close" id="modalClose">×</button>
            </div>
            <div class="devices-grid" id="devicesGrid">
              <!-- Устройства будут добавлены динамически -->
            </div>
          </div>
        </div>
      </ha-card>
    `;

    this.attachEventListeners();
  }

  getWeekNumber() {
    const date = this.currentTime || new Date();
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  getGreeting() {
    const hour = (this.currentTime || new Date()).getHours();
    if (hour < 6) return 'Доброй ночи';
    if (hour < 12) return 'Доброе утро';
    if (hour < 18) return 'Добрый день';
    return 'Добрый вечер';
  }

  getActiveDevices() {
    const rooms = this.config.rooms || [];
    let count = 0;
    rooms.forEach(room => {
      const entities = room.entities || [];
      entities.forEach(entityId => {
        const state = this._hass.states[entityId];
        if (state && state.state === 'on') {
          count++;
        }
      });
    });
    return count;
  }

  renderSidebarWeather() {
    const weatherEntity = this.config.weather_entity;
    if (!weatherEntity || !this._hass.states[weatherEntity]) {
      return '';
    }

    const weather = this._hass.states[weatherEntity];
    const temp = Math.round(weather.attributes.temperature);
    const description = weather.state;
    const humidity = weather.attributes.humidity;
    const pressure = weather.attributes.pressure;
    const windSpeed = Math.round(weather.attributes.wind_speed);
    
    const weatherIcons = {
      'sunny': '☀️',
      'clear-night': '🌙',
      'cloudy': '☁️',
      'rainy': '🌧️',
      'snowy': '❄️',
      'fog': '🌫️',
      'partlycloudy': '⛅',
    };
    
    const icon = weatherIcons[description] || '🌤️';
    const descriptionRu = {
      'sunny': 'Солнечно',
      'clear-night': 'Ясная ночь',
      'cloudy': 'Облачно',
      'rainy': 'Дождь',
      'snowy': 'Снег',
      'fog': 'Туман',
      'partlycloudy': 'Переменная облачность',
    }[description] || description;

    return `
      <div class="sidebar-weather">
        <div class="weather-main">
          <div class="weather-icon-big">${icon}</div>
          <div>
            <div class="weather-temp-big">${temp}°</div>
            <div style="font-size: 13px; opacity: 0.9;">${descriptionRu}</div>
          </div>
        </div>
        <div class="weather-details">
          <div class="weather-detail">💧 ${humidity}%</div>
          <div class="weather-detail">🌡️ ${pressure} hPa</div>
          <div class="weather-detail">💨 ${windSpeed} км/ч</div>
          <div class="weather-detail">🧭 ${this.getWindDirection(weather.attributes.wind_bearing)}</div>
        </div>
      </div>
    `;
  }

  getWindDirection(bearing) {
    if (!bearing) return '—';
    const directions = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'];
    const index = Math.round(bearing / 45) % 8;
    return directions[index];
  }

  renderRoom(room) {
    const entities = room.entities || [];
    const onCount = entities.filter(e => {
      const state = this._hass.states[e];
      return state && state.state === 'on';
    }).length;

    const roomIcons = {
      'living_room': '🛋️',
      'bedroom': '🛏️',
      'kitchen': '🍳',
      'bathroom': '🚿',
      'office': '💼',
      'garage': '🚗',
      'garden': '🌿',
      'hallway': '🚪',
      'kids_room': '🧸',
    };

    const icon = roomIcons[room.id] || '🏠';

    return `
      <div class="room-card" data-room-id="${room.id}">
        <div class="room-header">
          <div class="room-icon">${icon}</div>
          <div class="room-info">
            <h3 class="room-name">${room.name}</h3>
            <div class="room-devices-count">${entities.length} устройств</div>
          </div>
        </div>
        <div class="room-status">
          <span class="status-badge ${onCount > 0 ? 'on' : 'off'}">
            <span class="status-indicator ${onCount > 0 ? 'on' : 'off'}"></span>
            ${onCount} вкл
          </span>
          <span class="status-badge ${onCount === 0 ? 'on' : 'off'}">
            <span class="status-indicator ${onCount === 0 ? 'on' : 'off'}"></span>
            ${entities.length - onCount} выкл
          </span>
        </div>
      </div>
    `;
  }

  renderQuickActions() {
    const actions = this.config.quick_actions || [];
    
    if (actions.length === 0) {
      return '';
    }

    return `
      <div class="quick-actions">
        <h3 class="quick-actions-title">⚡ Быстрые действия</h3>
        <div class="actions-grid">
          ${actions.map(action => `
            <button class="action-button" data-action="${action.service}" data-entity="${action.entity_id}">
              <span class="action-icon">${action.icon || '💡'}</span>
              <span>${action.name}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    // Room card clicks - открываем модальное окно
    this.shadowRoot.querySelectorAll('.room-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const roomId = e.currentTarget.dataset.roomId;
        const room = this.config.rooms.find(r => r.id === roomId);
        if (room && room.entities && room.entities.length > 0) {
          this.showDevicesModal(room);
        }
      });
    });

    // Quick action buttons
    this.shadowRoot.querySelectorAll('.action-button').forEach(button => {
      button.addEventListener('click', (e) => {
        const service = e.currentTarget.dataset.action;
        const entityId = e.currentTarget.dataset.entity;
        if (service && entityId) {
          const [domain, serviceAction] = service.split('.');
          this._hass.callService(domain, serviceAction, { entity_id: entityId });
        }
      });
    });

    // Модальное окно
    const modal = this.shadowRoot.getElementById('devicesModal');
    const closeBtn = this.shadowRoot.getElementById('modalClose');
    
    // Закрытие по кнопке
    closeBtn.addEventListener('click', () => {
      this.closeDevicesModal();
    });

    // Закрытие по клику на фон
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeDevicesModal();
      }
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('show')) {
        this.closeDevicesModal();
      }
    });
  }

  showDevicesModal(room) {
    const modal = this.shadowRoot.getElementById('devicesModal');
    const modalIcon = this.shadowRoot.getElementById('modalIcon');
    const modalRoomName = this.shadowRoot.getElementById('modalRoomName');
    const devicesGrid = this.shadowRoot.getElementById('devicesGrid');

    // Устанавливаем заголовок
    const roomIcons = {
      'living_room': '🛋️',
      'bedroom': '🛏️',
      'kitchen': '🍳',
      'bathroom': '🚿',
      'office': '💼',
      'garage': '🚗',
      'garden': '🌿',
      'hallway': '🚪',
      'kids_room': '🧸',
    };

    modalIcon.textContent = roomIcons[room.id] || '🏠';
    modalRoomName.textContent = room.name;

    // Очищаем и заполняем устройства
    devicesGrid.innerHTML = '';
    
    room.entities.forEach(entityId => {
      const state = this._hass.states[entityId];
      if (state) {
        const deviceCard = this.createDeviceCard(entityId, state);
        devicesGrid.appendChild(deviceCard);
      }
    });

    // Показываем модальное окно
    modal.classList.add('show');
  }

  createDeviceCard(entityId, state) {
    const card = document.createElement('div');
    card.className = 'device-card';
    card.dataset.entityId = entityId;

    const domain = entityId.split('.')[0];
    const deviceIcons = {
      'light': '💡',
      'switch': '🔌',
      'cover': '🪟',
      'climate': '🌡️',
      'media_player': '📺',
      'fan': '🌀',
      'lock': '🔒',
      'camera': '📷',
      'sensor': '📊',
      'binary_sensor': '📡',
      'vacuum': '🤖',
      'scene': '🎬',
      'script': '📜',
      'automation': '⚙️',
    };

    const icon = deviceIcons[domain] || '🔧';
    const friendlyName = state.attributes.friendly_name || entityId;
    const deviceState = state.state;
    const isOn = deviceState === 'on';
    const isUnavailable = deviceState === 'unavailable';

    card.innerHTML = `
      <div class="device-header">
        <div class="device-icon">${icon}</div>
        <div class="device-info">
          <h3 class="device-name">${friendlyName}</h3>
          <div class="device-type">${domain}</div>
        </div>
      </div>
      <div class="device-status">
        <span class="device-state ${deviceState}">${this.getStateText(deviceState)}</span>
        <button class="device-toggle" ${isUnavailable ? 'disabled' : ''}>
          ${isOn ? 'Выключить' : 'Включить'}
        </button>
      </div>
    `;

    // Добавляем обработчик клика
    const toggleBtn = card.querySelector('.device-toggle');
    if (!isUnavailable) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleDevice(entityId, state);
      });
    }

    return card;
  }

  getStateText(state) {
    const stateTexts = {
      'on': 'Включено',
      'off': 'Выключено',
      'unavailable': 'Недоступно',
      'open': 'Открыто',
      'closed': 'Закрыто',
      'playing': 'Воспроизводится',
      'paused': 'Приостановлено',
      'idle': 'Ожидание',
      'home': 'Дома',
      'not_home': 'Не дома',
    };
    return stateTexts[state] || state;
  }

  toggleDevice(entityId, state) {
    const domain = entityId.split('.')[0];
    const service = state.state === 'on' ? 'turn_off' : 'turn_on';
    
    this._hass.callService(domain, service, { entity_id: entityId });
    
    // Обновляем состояние в модальном окне
    setTimeout(() => {
      this.updateDeviceCard(entityId);
    }, 500);
  }

  updateDeviceCard(entityId) {
    const card = this.shadowRoot.querySelector(`[data-entity-id="${entityId}"]`);
    if (card) {
      const state = this._hass.states[entityId];
      if (state) {
        const deviceState = state.state;
        const isOn = deviceState === 'on';
        const isUnavailable = deviceState === 'unavailable';

        const stateElement = card.querySelector('.device-state');
        const toggleBtn = card.querySelector('.device-toggle');

        stateElement.textContent = this.getStateText(deviceState);
        stateElement.className = `device-state ${deviceState}`;
        
        toggleBtn.textContent = isOn ? 'Выключить' : 'Включить';
        toggleBtn.disabled = isUnavailable;
      }
    }
  }

  closeDevicesModal() {
    const modal = this.shadowRoot.getElementById('devicesModal');
    modal.classList.remove('show');
  }

  static getStubConfig() {
    return {
      title: 'Умный Дом',
      weather_entity: 'weather.forecast_home',
      rooms: [
        {
          id: 'living_room',
          name: 'Гостиная',
          entities: []
        }
      ],
      quick_actions: []
    };
  }
}

customElements.define('smart-home-dashboard-card', SmartHomeDashboardCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'smart-home-dashboard-card',
  name: 'Smart Home Dashboard',
  description: 'Современный цветной дашборд для управления умным домом с боковой панелью',
  preview: true,
  documentationURL: 'https://github.com/your-repo/smart-home-dashboard-card',
});
