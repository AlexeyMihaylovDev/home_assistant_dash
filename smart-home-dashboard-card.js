class SmartHomeDashboardCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
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
    return 6;
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
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .dashboard-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          color: white;
        }

        .dashboard-header {
          margin-bottom: 32px;
          text-align: center;
        }

        .dashboard-title {
          font-size: 36px;
          font-weight: 700;
          margin: 0 0 8px 0;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          background: linear-gradient(90deg, #ffffff, #e0e7ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .dashboard-subtitle {
          font-size: 16px;
          opacity: 0.9;
          font-weight: 300;
        }

        .rooms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .room-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 24px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(255, 255, 255, 0.2);
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
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .room-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
          border-color: rgba(255, 255, 255, 0.4);
        }

        .room-card:hover::before {
          opacity: 1;
        }

        .room-header {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }

        .room-icon {
          font-size: 32px;
          margin-right: 16px;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          backdrop-filter: blur(5px);
        }

        .room-info {
          flex: 1;
        }

        .room-name {
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 4px 0;
        }

        .room-devices-count {
          font-size: 14px;
          opacity: 0.8;
        }

        .room-status {
          display: flex;
          gap: 12px;
          margin-top: 16px;
          flex-wrap: wrap;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.25);
          border-radius: 12px;
          font-size: 13px;
          font-weight: 500;
          backdrop-filter: blur(5px);
        }

        .status-badge.on {
          background: rgba(16, 185, 129, 0.4);
        }

        .status-badge.off {
          background: rgba(107, 114, 128, 0.4);
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 6px;
          animation: pulse 2s infinite;
        }

        .status-indicator.on {
          background: #10b981;
        }

        .status-indicator.off {
          background: #6b7280;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .quick-actions {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 24px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .quick-actions-title {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 16px 0;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 12px;
        }

        .action-button {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 16px;
          padding: 16px;
          color: white;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          backdrop-filter: blur(5px);
        }

        .action-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.05);
        }

        .action-button:active {
          transform: scale(0.95);
        }

        .action-icon {
          font-size: 24px;
        }

        .weather-widget {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 20px;
          margin-bottom: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .weather-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .weather-icon {
          font-size: 48px;
        }

        .weather-temp {
          font-size: 42px;
          font-weight: 700;
        }

        .weather-description {
          font-size: 16px;
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 20px;
          }

          .rooms-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-title {
            font-size: 28px;
          }
        }
      </style>

      <ha-card>
        <div class="dashboard-container">
          <div class="dashboard-header">
            <h1 class="dashboard-title">${title}</h1>
            <p class="dashboard-subtitle">🏠 Управление вашим умным домом</p>
          </div>

          ${this.renderWeatherWidget()}
          
          <div class="rooms-grid">
            ${rooms.map(room => this.renderRoom(room)).join('')}
          </div>

          ${this.renderQuickActions()}
        </div>
      </ha-card>
    `;

    this.attachEventListeners();
  }

  renderWeatherWidget() {
    const weatherEntity = this.config.weather_entity;
    if (!weatherEntity || !this._hass.states[weatherEntity]) {
      return '';
    }

    const weather = this._hass.states[weatherEntity];
    const temp = Math.round(weather.attributes.temperature);
    const description = weather.state;
    
    const weatherIcons = {
      'sunny': '☀️',
      'clear-night': '🌙',
      'cloudy': '☁️',
      'rainy': '🌧️',
      'snowy': '❄️',
      'fog': '🌫️',
    };
    
    const icon = weatherIcons[description] || '🌤️';

    return `
      <div class="weather-widget">
        <div class="weather-info">
          <div class="weather-icon">${icon}</div>
          <div>
            <div class="weather-temp">${temp}°</div>
            <div class="weather-description">${description}</div>
          </div>
        </div>
      </div>
    `;
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
            ${onCount} включено
          </span>
          <span class="status-badge ${onCount === 0 ? 'on' : 'off'}">
            <span class="status-indicator ${onCount === 0 ? 'on' : 'off'}"></span>
            ${entities.length - onCount} выключено
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
    // Room card clicks
    this.shadowRoot.querySelectorAll('.room-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const roomId = e.currentTarget.dataset.roomId;
        const room = this.config.rooms.find(r => r.id === roomId);
        if (room && room.entities && room.entities.length > 0) {
          // Toggle all entities in room
          room.entities.forEach(entityId => {
            const state = this._hass.states[entityId];
            if (state) {
              const domain = entityId.split('.')[0];
              const service = state.state === 'on' ? 'turn_off' : 'turn_on';
              this._hass.callService(domain, service, { entity_id: entityId });
            }
          });
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
  }

  static getStubConfig() {
    return {
      title: 'Умный Дом',
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
  description: 'Современный цветной дашборд для управления умным домом',
  preview: true,
  documentationURL: 'https://github.com/your-repo/smart-home-dashboard-card',
});

