const CONTENT_PLANNER_CONFIG_KEY = 'anavibe-tools-content-planner-config';

const contentPlannerClientFieldsSchema = [
  { key: 'name', label: 'Nom du client', type: 'text' },
  { key: 'sector', label: 'Secteur d’activité', type: 'text' },
  { key: 'city', label: 'Ville', type: 'text' }
];

const contentPlannerRhythmFieldsSchema = [
  { key: 'postsPerWeek', label: 'Publications par semaine', type: 'number' },
  { key: 'reelsPerWeek', label: 'Reels par semaine', type: 'number' },
  { key: 'storiesPerWeek', label: 'Stories par semaine', type: 'number' }
];

const contentPlannerPlatformOptions = [
  { key: 'instagram', label: 'Instagram', icon: '📸' },
  { key: 'facebook', label: 'Facebook', icon: '📘' },
  { key: 'tiktok', label: 'TikTok', icon: '🎵' },
  { key: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { key: 'googleBusiness', label: 'Google Business', icon: '📍' }
];

function createDefaultContentPlannerConfig() {
  return {
    client: {
      name: '',
      sector: '',
      city: '',
      mainGoal: '',
      secondaryGoals: ''
    },
    platforms: {
      instagram: false,
      facebook: false,
      tiktok: false,
      linkedin: false,
      googleBusiness: false
    },
    rhythm: {
      postsPerWeek: '',
      reelsPerWeek: '',
      storiesPerWeek: ''
    }
  };
}

function getContentPlannerConfig() {
  const saved = localStorage.getItem(CONTENT_PLANNER_CONFIG_KEY);

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.client && parsed.platforms && parsed.rhythm) {
        return parsed;
      }
    } catch (error) {
      // fall through to default
    }
  }

  const defaultConfig = createDefaultContentPlannerConfig();
  localStorage.setItem(CONTENT_PLANNER_CONFIG_KEY, JSON.stringify(defaultConfig));
  return defaultConfig;
}

function saveContentPlannerConfig(config) {
  localStorage.setItem(CONTENT_PLANNER_CONFIG_KEY, JSON.stringify(config));
}

function escapeContentPlannerText(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]
  ));
}

function flashContentPlannerSavedHint() {
  const hint = document.getElementById('contentPlannerSavedHint');
  if (!hint) {
    return;
  }
  hint.textContent = 'Configuration enregistrée ✓';
  clearTimeout(flashContentPlannerSavedHint.timeoutId);
  flashContentPlannerSavedHint.timeoutId = setTimeout(() => {
    hint.textContent = 'Configuration enregistrée automatiquement.';
  }, 1600);
}

function createContentPlannerFieldControl(field, value) {
  const wrapper = document.createElement('label');
  wrapper.className = 'field-item';

  const labelSpan = document.createElement('span');
  labelSpan.textContent = field.label;
  wrapper.appendChild(labelSpan);

  const input = document.createElement('input');
  input.className = 'field-input';
  input.type = field.type;
  input.value = value ?? '';
  input.dataset.field = field.key;
  wrapper.appendChild(input);

  return wrapper;
}

function renderContentPlannerClientFields() {
  const grid = document.getElementById('contentPlannerClientFieldsGrid');
  if (!grid) {
    return;
  }

  const config = getContentPlannerConfig();
  grid.innerHTML = '';

  contentPlannerClientFieldsSchema.forEach((field) => {
    const control = createContentPlannerFieldControl(field, config.client[field.key]);
    const input = control.querySelector('.field-input');
    input.addEventListener('input', () => {
      const freshConfig = getContentPlannerConfig();
      freshConfig.client[field.key] = input.value;
      saveContentPlannerConfig(freshConfig);
      flashContentPlannerSavedHint();
    });
    grid.appendChild(control);
  });
}

function renderContentPlannerGoalsFields() {
  const config = getContentPlannerConfig();

  const mainGoalInput = document.getElementById('contentPlannerMainGoal');
  const secondaryGoalsInput = document.getElementById('contentPlannerSecondaryGoals');

  if (mainGoalInput) {
    mainGoalInput.value = config.client.mainGoal ?? '';
    mainGoalInput.addEventListener('input', () => {
      const freshConfig = getContentPlannerConfig();
      freshConfig.client.mainGoal = mainGoalInput.value;
      saveContentPlannerConfig(freshConfig);
      flashContentPlannerSavedHint();
    });
  }

  if (secondaryGoalsInput) {
    secondaryGoalsInput.value = config.client.secondaryGoals ?? '';
    secondaryGoalsInput.addEventListener('input', () => {
      const freshConfig = getContentPlannerConfig();
      freshConfig.client.secondaryGoals = secondaryGoalsInput.value;
      saveContentPlannerConfig(freshConfig);
      flashContentPlannerSavedHint();
    });
  }
}

function renderContentPlannerPlatformChecklist() {
  const list = document.getElementById('contentPlannerPlatformChecklist');
  if (!list) {
    return;
  }

  const config = getContentPlannerConfig();
  list.innerHTML = '';

  contentPlannerPlatformOptions.forEach((platform) => {
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
      const freshConfig = getContentPlannerConfig();
      freshConfig.platforms[platform.key] = checkbox.checked;
      saveContentPlannerConfig(freshConfig);
      label.classList.toggle('checked', checkbox.checked);
      flashContentPlannerSavedHint();
    });

    list.appendChild(label);
  });
}

function renderContentPlannerRhythmFields() {
  const grid = document.getElementById('contentPlannerRhythmFieldsGrid');
  if (!grid) {
    return;
  }

  const config = getContentPlannerConfig();
  grid.innerHTML = '';

  contentPlannerRhythmFieldsSchema.forEach((field) => {
    const control = createContentPlannerFieldControl(field, config.rhythm[field.key]);
    const input = control.querySelector('.field-input');
    input.addEventListener('input', () => {
      const freshConfig = getContentPlannerConfig();
      freshConfig.rhythm[field.key] = input.value;
      saveContentPlannerConfig(freshConfig);
      flashContentPlannerSavedHint();
    });
    grid.appendChild(control);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderContentPlannerClientFields();
  renderContentPlannerGoalsFields();
  renderContentPlannerPlatformChecklist();
  renderContentPlannerRhythmFields();
});
