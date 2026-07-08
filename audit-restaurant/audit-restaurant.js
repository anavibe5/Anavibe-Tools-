const AUDIT_CONFIG_KEY = 'anavibe-tools-audit-restaurant-config';

const activityTypes = [
  { key: 'restaurant', label: 'Restaurant', icon: '🍽' },
  { key: 'commerce', label: 'Commerce', icon: '🛍' },
  { key: 'sante-medical', label: 'Santé / Médical', icon: '🏥' },
  { key: 'sport', label: 'Sport', icon: '🏋' },
  { key: 'services', label: 'Services', icon: '🛠' },
  { key: 'autre', label: 'Autre', icon: '✨' }
];

const platformOptions = [
  { key: 'googleBusiness', label: 'Google Business', icon: '📍' },
  { key: 'website', label: 'Site internet', icon: '🌐' },
  { key: 'instagram', label: 'Instagram', icon: '📸' },
  { key: 'facebook', label: 'Facebook', icon: '📘' },
  { key: 'tiktok', label: 'TikTok', icon: '🎵' },
  { key: 'linkedin', label: 'LinkedIn', icon: '💼' }
];

function createDefaultAuditConfig() {
  return {
    activityType: 'restaurant',
    platforms: {
      googleBusiness: true,
      website: true,
      instagram: true,
      facebook: true,
      tiktok: false,
      linkedin: false
    }
  };
}

function getAuditConfig() {
  const saved = localStorage.getItem(AUDIT_CONFIG_KEY);

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.activityType && parsed.platforms) {
        return parsed;
      }
    } catch (error) {
      // fall through to default
    }
  }

  const defaultConfig = createDefaultAuditConfig();
  localStorage.setItem(AUDIT_CONFIG_KEY, JSON.stringify(defaultConfig));
  return defaultConfig;
}

function saveAuditConfig(config) {
  localStorage.setItem(AUDIT_CONFIG_KEY, JSON.stringify(config));
}

function flashConfigSavedHint() {
  const hint = document.getElementById('configSavedHint');
  if (!hint) {
    return;
  }
  hint.textContent = 'Configuration enregistrée ✓';
  clearTimeout(flashConfigSavedHint.timeoutId);
  flashConfigSavedHint.timeoutId = setTimeout(() => {
    hint.textContent = 'Configuration enregistrée automatiquement.';
  }, 1600);
}

function renderActivityTypeGrid() {
  const grid = document.getElementById('activityTypeGrid');
  if (!grid) {
    return;
  }

  const config = getAuditConfig();
  grid.innerHTML = '';

  activityTypes.forEach((type) => {
    const option = document.createElement('button');
    option.type = 'button';
    option.className = `activity-type-option${config.activityType === type.key ? ' selected' : ''}`;
    option.innerHTML = `
      <span class="activity-icon">${type.icon}</span>
      <span>${type.label}</span>
    `;
    option.addEventListener('click', () => {
      const freshConfig = getAuditConfig();
      if (freshConfig.activityType === type.key) {
        return;
      }
      freshConfig.activityType = type.key;
      saveAuditConfig(freshConfig);
      renderActivityTypeGrid();
      flashConfigSavedHint();
    });
    grid.appendChild(option);
  });
}

function renderPlatformChecklist() {
  const list = document.getElementById('platformChecklist');
  if (!list) {
    return;
  }

  const config = getAuditConfig();
  list.innerHTML = '';

  platformOptions.forEach((platform) => {
    const isChecked = Boolean(config.platforms[platform.key]);
    const label = document.createElement('label');
    label.className = `platform-option${isChecked ? ' checked' : ''}`;
    label.innerHTML = `
      <input type="checkbox" ${isChecked ? 'checked' : ''} />
      <span class="platform-icon">${platform.icon}</span>
      <span>${platform.label}</span>
    `;

    const checkbox = label.querySelector('input');
    checkbox.addEventListener('change', () => {
      const freshConfig = getAuditConfig();
      freshConfig.platforms[platform.key] = checkbox.checked;
      saveAuditConfig(freshConfig);
      label.classList.toggle('checked', checkbox.checked);
      flashConfigSavedHint();
    });

    list.appendChild(label);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderActivityTypeGrid();
  renderPlatformChecklist();
});
