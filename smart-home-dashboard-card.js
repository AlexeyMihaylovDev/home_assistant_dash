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
        this.currentTime.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
      this.shadowRoot.querySelector('.clock-date').textContent = 
        this.formatDate();
    }
  }

  render() {
    if (!this._hass || !this.config) {
      return;
    }

    const rooms = this.config.rooms || [];
    const title = this.config.title || 'הבית החכם';

    this.shadowRoot.innerHTML = `
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        :host {
          display: block;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          direction: rtl;
        }

        .dashboard-container {
          display: flex;
          min-height: 700px;
          background: linear-gradient(135deg, #8b5cf6 0%, #d946a6 35%, #f97583 65%, #ff8a80 100%);
          border-radius: 0;
          overflow: hidden;
        }

        /* ПРАВАЯ ПАНЕЛЬ (для RTL) */
        .left-panel {
          width: 340px;
          background: linear-gradient(180deg, rgba(139, 92, 246, 0.9) 0%, rgba(124, 58, 237, 0.9) 100%);
          backdrop-filter: blur(20px);
          padding: 40px 28px;
          display: flex;
          flex-direction: column;
          color: white;
          box-shadow: -4px 0 30px rgba(0, 0, 0, 0.1);
        }

        /* Время */
        .time-display {
          margin-bottom: 20px;
        }

        .time-display h1 {
          font-size: 64px;
          font-weight: 300;
          line-height: 1;
          margin-bottom: 8px;
        }

        .date-display {
          font-size: 15px;
          opacity: 0.95;
          font-weight: 400;
        }

        .week-number {
          font-size: 14px;
          opacity: 0.85;
          margin-top: 6px;
        }

        /* Приветствие */
        .greeting-box {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 14px 16px;
          margin-bottom: 24px;
          font-size: 15px;
        }

        /* Погода */
        .weather-widget {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .weather-main-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .weather-icon-large {
          font-size: 52px;
        }

        .weather-temp-display {
          text-align: left;
        }

        .weather-temp-display h2 {
          font-size: 42px;
          font-weight: 300;
        }

        .weather-condition {
          font-size: 13px;
          opacity: 0.9;
          margin-top: 4px;
        }

        .weather-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          font-size: 13px;
          opacity: 0.9;
        }

        .weather-detail-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Системная информация */
        .system-info-section {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }

        .info-card {
          flex: 1;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 16px;
        }

        .info-label {
          font-size: 11px;
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }

        .info-value {
          font-size: 24px;
          font-weight: 600;
        }

        /* Напоминание */
        .reminder-box {
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 14px 16px;
          font-size: 13px;
          margin-top: auto;
        }

        /* ОСНОВНАЯ ОБЛАСТЬ */
        .main-area {
          flex: 1;
          padding: 40px;
          overflow-y: auto;
        }

        /* Заголовок */
        .page-header h2 {
          font-size: 36px;
          font-weight: 700;
          color: white;
          margin-bottom: 32px;
        }

        /* Сетка устройств */
        .devices-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        /* Карточка устройства */
        .device-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          position: relative;
        }

        .device-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.15);
        }

        .device-card.active {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: white;
        }

        .device-card.active .device-name,
        .device-card.active .device-status {
          color: white;
        }

        .device-header {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
        }

        .device-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin-right: 12px;
          background: rgba(139, 92, 246, 0.1);
        }

        .device-card.active .device-icon {
          background: rgba(255, 255, 255, 0.25);
        }

        .device-info {
          flex: 1;
        }

        .device-name {
          font-size: 15px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .device-status {
          font-size: 12px;
          color: #6b7280;
        }

        /* Секция */
        .section-title {
          font-size: 20px;
          font-weight: 600;
          color: white;
          margin-bottom: 16px;
          margin-top: 32px;
        }

        /* МОДАЛЬНОЕ ОКНО ДЛЯ УСТРОЙСТВ */
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
          background: linear-gradient(180deg, rgba(139, 92, 246, 0.9) 0%, rgba(124, 58, 237, 0.9) 100%);
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

        .modal-devices-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 16px;
        }

        .modal-device-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .modal-device-card:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .modal-device-header {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
        }

        .modal-device-icon {
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

        .modal-device-info {
          flex: 1;
        }

        .modal-device-name {
          font-size: 16px;
          font-weight: 600;
          color: white;
          margin: 0;
        }

        .modal-device-type {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 2px;
        }

        .modal-device-status {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 12px;
        }

        .modal-device-state {
          font-size: 14px;
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .modal-device-state.on {
          background: rgba(16, 185, 129, 0.6);
        }

        .modal-device-state.off {
          background: rgba(107, 114, 128, 0.6);
        }

        .modal-device-state.unavailable {
          background: rgba(239, 68, 68, 0.6);
        }

        .modal-device-toggle {
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

        .modal-device-toggle:hover {
          background: rgba(255, 255, 255, 0.4);
        }

        /* Адаптивность */
        @media (max-width: 1024px) {
          .dashboard-container {
            flex-direction: column;
          }

          .left-panel {
            width: 100%;
          }

          .time-display h1 {
            font-size: 48px;
          }

          .modal-content {
            width: 95%;
            padding: 24px;
          }

          .modal-devices-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .main-area {
            padding: 24px;
          }

          .devices-grid {
            grid-template-columns: 1fr;
          }

          .page-header h2 {
            font-size: 28px;
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
        <div class="dashboard-container">
          <!-- ПРАВАЯ ПАНЕЛЬ (для RTL) -->
          <div class="left-panel">
            <!-- Время -->
            <div class="time-display">
              <h1 class="clock-time">${this.currentTime ? this.currentTime.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) : '00:00'}</h1>
              <div class="date-display clock-date">${this.currentTime ? this.formatDate() : ''}</div>
              <div class="week-number">שבוע ${this.getWeekNumber()}</div>
            </div>

            <!-- Приветствие -->
            <div class="greeting-box">
              ${this.getGreeting()} 😊
            </div>

            <!-- Погода -->
            ${this.renderWeather()}

            <!-- Системная информация -->
            <div class="system-info-section">
              <div class="info-card">
                <div class="info-label">פעילים</div>
                <div class="info-value">${this.getActiveDevices()}</div>
              </div>
              <div class="info-card">
                <div class="info-label">חדרים</div>
                <div class="info-value">${rooms.length}</div>
              </div>
            </div>

            <!-- Напоминание -->
            <div class="reminder-box">
              כביסה בעוד 4 ימים ביום חמישי בשעה 17:00
            </div>
          </div>

          <!-- ОСНОВНАЯ ОБЛАСТЬ -->
          <div class="main-area">
            <div class="page-header">
              <h2>${title}</h2>
            </div>

            <!-- Устройства -->
            <div class="devices-grid">
              ${rooms.map(room => this.renderDeviceCard(room)).join('')}
            </div>

            <!-- Секция מדיה -->
            ${this.renderMediaSection()}

            <!-- Секция אחר -->
            ${this.renderOthersSection()}
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
            <div class="modal-devices-grid" id="devicesGrid">
              <!-- Устройства будут добавлены динамически -->
            </div>
          </div>
        </div>
      </ha-card>
    `;

    this.attachEventListeners();
  }

  formatDate() {
    const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 
                    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
    
    const day = days[this.currentTime.getDay()];
    const date = this.currentTime.getDate();
    const month = months[this.currentTime.getMonth()];
    
    return `${day}\n${date} ${month}`;
  }

  getWeekNumber() {
    const date = this.currentTime || new Date();
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  getGreeting() {
    const hour = (this.currentTime || new Date()).getHours();
    if (hour < 6) return 'לילה טוב';
    if (hour < 12) return 'בוקר טוב';
    if (hour < 18) return 'יום טוב';
    return 'ערב טוב';
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

  renderWeather() {
    const weatherEntity = this.config.weather_entity;
    if (!weatherEntity || !this._hass.states[weatherEntity]) {
      return `
        <div class="weather-widget">
          <div class="weather-main-info">
            <div class="weather-icon-large">☁️</div>
            <div class="weather-temp-display">
              <h2>2°C</h2>
              <div class="weather-condition">מעונן</div>
            </div>
          </div>
          <div class="weather-details-grid">
            <div class="weather-detail-item">💧 81%</div>
            <div class="weather-detail-item">🌡️ 1013 hPa</div>
          </div>
        </div>
      `;
    }

    const weather = this._hass.states[weatherEntity];
    const temp = Math.round(weather.attributes.temperature);
    const humidity = weather.attributes.humidity;
    const pressure = weather.attributes.pressure;
    
    const weatherIcons = {
      'sunny': '☀️',
      'clear-night': '🌙',
      'cloudy': '☁️',
      'rainy': '🌧️',
      'snowy': '❄️',
      'fog': '🌫️',
      'partlycloudy': '⛅',
    };
    
    const icon = weatherIcons[weather.state] || '🌤️';

    return `
      <div class="weather-widget">
        <div class="weather-main-info">
          <div class="weather-icon-large">${icon}</div>
          <div class="weather-temp-display">
            <h2>${temp}°C</h2>
            <div class="weather-condition">מעונן</div>
          </div>
        </div>
        <div class="weather-details-grid">
          <div class="weather-detail-item">💧 ${humidity}%</div>
          <div class="weather-detail-item">🌡️ ${pressure} hPa</div>
        </div>
      </div>
    `;
  }

  renderDeviceCard(room) {
    const entities = room.entities || [];
    const isActive = entities.some(e => {
      const state = this._hass.states[e];
      return state && state.state === 'on';
    });

    const roomIcons = {
      'living_room': '💡',
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
    const statusText = isActive ? 'פועל' : 'כבוי';

    return `
      <div class="device-card ${isActive ? 'active' : ''}" data-room-id="${room.id}">
        <div class="device-header">
          <div class="device-icon">${icon}</div>
          <div class="device-info">
            <div class="device-name">${room.name}</div>
            <div class="device-status">${statusText}</div>
          </div>
        </div>
      </div>
    `;
  }

  renderMediaSection() {
    return `
      <div class="section-title">מדיה</div>
      <div class="devices-grid">
        <!-- Media карточки можно добавить здесь -->
      </div>
    `;
  }

  renderOthersSection() {
    return `
      <div class="section-title">אחר</div>
      <div class="devices-grid">
        <!-- Дополнительные карточки можно добавить здесь -->
      </div>
    `;
  }

  attachEventListeners() {
    // Room card clicks - открываем модальное окно
    this.shadowRoot.querySelectorAll('.device-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const roomId = e.currentTarget.dataset.roomId;
        const room = this.config.rooms.find(r => r.id === roomId);
        if (room && room.entities && room.entities.length > 0) {
          this.showDevicesModal(room);
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
    card.className = 'modal-device-card';
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
      <div class="modal-device-header">
        <div class="modal-device-icon">${icon}</div>
        <div class="modal-device-info">
          <h3 class="modal-device-name">${friendlyName}</h3>
          <div class="modal-device-type">${domain}</div>
        </div>
      </div>
      <div class="modal-device-status">
        <span class="modal-device-state ${deviceState}">${this.getStateText(deviceState)}</span>
        <button class="modal-device-toggle" ${isUnavailable ? 'disabled' : ''}>
          ${isOn ? 'כבה' : 'הדלק'}
        </button>
      </div>
    `;

    // Добавляем обработчик клика
    const toggleBtn = card.querySelector('.modal-device-toggle');
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
      'on': 'פועל',
      'off': 'כבוי',
      'unavailable': 'לא זמין',
      'open': 'פתוח',
      'closed': 'סגור',
      'playing': 'מנגן',
      'paused': 'מושהה',
      'idle': 'ממתין',
      'home': 'בבית',
      'not_home': 'לא בבית',
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

        const stateElement = card.querySelector('.modal-device-state');
        const toggleBtn = card.querySelector('.modal-device-toggle');

        stateElement.textContent = this.getStateText(deviceState);
        stateElement.className = `modal-device-state ${deviceState}`;
        
        toggleBtn.textContent = isOn ? 'כבה' : 'הדלק';
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
      title: 'הבית החכם',
      weather_entity: 'weather.forecast_home',
      rooms: [
        {
          id: 'living_room',
          name: 'סלון',
          entities: []
        }
      ]
    };
  }
}

customElements.define('smart-home-dashboard-card', SmartHomeDashboardCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'smart-home-dashboard-card',
  name: 'Smart Home Dashboard',
  description: 'Современный дашборд для умного дома в стиле Home Assistant',
  preview: true,
});