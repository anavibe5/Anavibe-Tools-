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
      renderContentPlannerCalendarSection();
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

const CONTENT_PLANNER_CALENDAR_KEY = 'anavibe-tools-content-planner-calendar';

const contentPlannerContentTypes = ['Publication', 'Story', 'Reel', 'Publication Google Business', 'Publication LinkedIn'];
const contentPlannerStatusOptions = ['À faire', 'En cours', 'Terminé'];

const contentPlannerFormatEligiblePlatforms = {
  Publication: ['instagram', 'facebook', 'tiktok'],
  Reel: ['instagram', 'tiktok'],
  Story: ['instagram', 'facebook']
};

function generateContentPlannerId() {
  return `cp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getContentPlannerCalendar() {
  const saved = localStorage.getItem(CONTENT_PLANNER_CALENDAR_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed.items)) {
        return parsed;
      }
    } catch (error) {
      // fall through
    }
  }
  return null;
}

function saveContentPlannerCalendar(calendar) {
  localStorage.setItem(CONTENT_PLANNER_CALENDAR_KEY, JSON.stringify(calendar));
}

function formatContentPlannerDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getContentPlannerMonthInfo(referenceDate) {
  const ref = referenceDate || new Date();
  const year = ref.getFullYear();
  const month = ref.getMonth();
  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
  const monthLabel = ref.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(new Date(year, month, day));
  }
  return { year, month, monthKey, monthLabel, days };
}

function getContentPlannerMondayIndex(date) {
  return (date.getDay() + 6) % 7;
}

function partitionContentPlannerDaysIntoWeeks(days) {
  const weeksMap = new Map();
  days.forEach((date) => {
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - getContentPlannerMondayIndex(date));
    const key = formatContentPlannerDateKey(weekStart);
    if (!weeksMap.has(key)) {
      weeksMap.set(key, { weekStart, days: [] });
    }
    weeksMap.get(key).days.push(date);
  });
  return Array.from(weeksMap.values()).sort((a, b) => a.weekStart - b.weekStart);
}

function formatContentPlannerWeekLabel(weekDays) {
  const first = weekDays[0];
  const last = weekDays[weekDays.length - 1];
  const fmt = (d) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  return `Semaine du ${fmt(first)} au ${fmt(last)}`;
}

function buildContentPlannerGoalPool(config) {
  const pool = [];
  const mainGoal = String(config.client.mainGoal || '').trim();
  if (mainGoal) {
    pool.push(mainGoal, mainGoal);
  }
  const secondaryRaw = String(config.client.secondaryGoals || '').trim();
  if (secondaryRaw) {
    secondaryRaw
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean)
      .forEach((goal) => pool.push(goal));
  }
  return pool;
}

function scheduleContentPlannerItems(items, weekDays, count, platformKeys, type, goalCursorRef, goalPool, fallbackGoal) {
  if (!count || !platformKeys.length || !weekDays.length) {
    return;
  }
  for (let i = 0; i < count; i += 1) {
    const dayIndex = Math.min(weekDays.length - 1, Math.floor((i * weekDays.length) / count));
    const day = weekDays[dayIndex];
    const platformKey = platformKeys[i % platformKeys.length];
    const objective = goalPool.length ? goalPool[goalCursorRef.value % goalPool.length] : fallbackGoal;
    if (goalPool.length) {
      goalCursorRef.value += 1;
    }
    items.push({
      id: generateContentPlannerId(),
      date: formatContentPlannerDateKey(day),
      platformKey,
      type,
      objective,
      status: contentPlannerStatusOptions[0]
    });
  }
}

function generateContentPlannerItems(config, monthInfo) {
  const items = [];
  const checkedPlatformKeys = contentPlannerPlatformOptions.filter((p) => config.platforms[p.key]).map((p) => p.key);

  const postsPerWeek = Number(config.rhythm.postsPerWeek) || 0;
  const reelsPerWeek = Number(config.rhythm.reelsPerWeek) || 0;
  const storiesPerWeek = Number(config.rhythm.storiesPerWeek) || 0;

  const feedPlatforms = contentPlannerFormatEligiblePlatforms.Publication.filter((key) => checkedPlatformKeys.includes(key));
  const reelsPlatforms = contentPlannerFormatEligiblePlatforms.Reel.filter((key) => checkedPlatformKeys.includes(key));
  const storiesPlatforms = contentPlannerFormatEligiblePlatforms.Story.filter((key) => checkedPlatformKeys.includes(key));

  const goalPool = buildContentPlannerGoalPool(config);
  const goalCursorRef = { value: 0 };

  const weeks = partitionContentPlannerDaysIntoWeeks(monthInfo.days);

  weeks.forEach((week) => {
    scheduleContentPlannerItems(items, week.days, postsPerWeek, feedPlatforms, 'Publication', goalCursorRef, goalPool, 'Renforcer la notoriété et la préférence de marque.');
    scheduleContentPlannerItems(items, week.days, reelsPerWeek, reelsPlatforms, 'Reel', goalCursorRef, goalPool, 'Augmenter la portée et l’engagement.');
    scheduleContentPlannerItems(items, week.days, storiesPerWeek, storiesPlatforms, 'Story', goalCursorRef, goalPool, 'Maintenir le contact quotidien avec la communauté.');
    if (config.platforms.googleBusiness) {
      scheduleContentPlannerItems(items, week.days, 1, ['googleBusiness'], 'Publication Google Business', goalCursorRef, goalPool, 'Améliorer la visibilité locale et le référencement.');
    }
    if (config.platforms.linkedin) {
      scheduleContentPlannerItems(items, week.days, 2, ['linkedin'], 'Publication LinkedIn', goalCursorRef, goalPool, 'Renforcer la crédibilité professionnelle et la visibilité B2B.');
    }
  });

  items.sort((a, b) => a.date.localeCompare(b.date));
  return items;
}

function getContentPlannerPlatformInfo(key) {
  return contentPlannerPlatformOptions.find((p) => p.key === key) || { key, label: key, icon: '' };
}

function createContentPlannerItemRow(item, checkedPlatforms) {
  const row = document.createElement('div');
  row.className = 'calendar-item-row';

  const dateInput = document.createElement('input');
  dateInput.type = 'date';
  dateInput.className = 'field-input calendar-item-date';
  dateInput.value = item.date;

  const platformSelect = document.createElement('select');
  platformSelect.className = 'field-input calendar-item-platform';
  const platformOptionsToShow = checkedPlatforms.length ? checkedPlatforms : contentPlannerPlatformOptions;
  platformOptionsToShow.forEach((platform) => {
    const option = document.createElement('option');
    option.value = platform.key;
    option.textContent = `${platform.icon} ${platform.label}`;
    platformSelect.appendChild(option);
  });
  if (!platformOptionsToShow.some((p) => p.key === item.platformKey)) {
    const info = getContentPlannerPlatformInfo(item.platformKey);
    const fallbackOption = document.createElement('option');
    fallbackOption.value = item.platformKey;
    fallbackOption.textContent = `${info.icon} ${info.label}`;
    platformSelect.appendChild(fallbackOption);
  }
  platformSelect.value = item.platformKey;

  const typeSelect = document.createElement('select');
  typeSelect.className = 'field-input calendar-item-type';
  contentPlannerContentTypes.forEach((type) => {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = type;
    typeSelect.appendChild(option);
  });
  typeSelect.value = item.type;

  const objectiveInput = document.createElement('input');
  objectiveInput.type = 'text';
  objectiveInput.className = 'field-input calendar-item-objective';
  objectiveInput.value = item.objective;
  objectiveInput.placeholder = 'Objectif marketing';

  const statusSelect = document.createElement('select');
  statusSelect.className = 'status-select calendar-item-status';
  contentPlannerStatusOptions.forEach((status) => {
    const option = document.createElement('option');
    option.value = status;
    option.textContent = status;
    statusSelect.appendChild(option);
  });
  statusSelect.value = item.status;

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'remove-item-btn';
  removeButton.setAttribute('aria-label', 'Supprimer cette publication');
  removeButton.textContent = '✕';

  const updateField = (field, value) => {
    const calendar = getContentPlannerCalendar();
    if (!calendar) {
      return;
    }
    const target = calendar.items.find((entry) => entry.id === item.id);
    if (target) {
      target[field] = value;
      saveContentPlannerCalendar(calendar);
    }
  };

  dateInput.addEventListener('change', () => {
    updateField('date', dateInput.value);
    renderContentPlannerCalendarSection();
  });
  platformSelect.addEventListener('change', () => updateField('platformKey', platformSelect.value));
  typeSelect.addEventListener('change', () => updateField('type', typeSelect.value));
  objectiveInput.addEventListener('input', () => updateField('objective', objectiveInput.value));
  statusSelect.addEventListener('change', () => updateField('status', statusSelect.value));

  removeButton.addEventListener('click', () => {
    const calendar = getContentPlannerCalendar();
    if (!calendar) {
      return;
    }
    calendar.items = calendar.items.filter((entry) => entry.id !== item.id);
    saveContentPlannerCalendar(calendar);
    renderContentPlannerCalendarSection();
  });

  row.appendChild(dateInput);
  row.appendChild(platformSelect);
  row.appendChild(typeSelect);
  row.appendChild(objectiveInput);
  row.appendChild(statusSelect);
  row.appendChild(removeButton);
  return row;
}

function renderContentPlannerCalendarSection() {
  const section = document.getElementById('contentPlannerCalendarSection');
  if (!section) {
    return;
  }

  const config = getContentPlannerConfig();
  const checkedPlatforms = contentPlannerPlatformOptions.filter((p) => config.platforms[p.key]);
  const monthInfo = getContentPlannerMonthInfo();
  const calendar = getContentPlannerCalendar();

  section.innerHTML = `
    <p class="eyebrow">Planning</p>
    <h3>📅 Calendrier éditorial — ${escapeContentPlannerText(monthInfo.monthLabel)}</h3>
  `;

  if (!checkedPlatforms.length) {
    const empty = document.createElement('p');
    empty.className = 'insight-empty';
    empty.textContent = 'Cochez au moins une plateforme dans la Configuration ci-dessus pour générer le calendrier.';
    section.appendChild(empty);
    return;
  }

  const hasCurrentCalendar = Boolean(calendar) && calendar.monthKey === monthInfo.monthKey;

  const actionsRow = document.createElement('div');
  actionsRow.className = 'header-actions';
  const generateButton = document.createElement('button');
  generateButton.type = 'button';
  generateButton.className = 'btn btn-primary';
  generateButton.textContent = hasCurrentCalendar ? 'Régénérer le calendrier du mois' : 'Générer le calendrier du mois';
  generateButton.addEventListener('click', () => {
    if (hasCurrentCalendar) {
      const confirmed = window.confirm('Régénérer le calendrier remplacera toutes les publications actuelles (y compris vos modifications). Continuer ?');
      if (!confirmed) {
        return;
      }
    }
    const freshConfig = getContentPlannerConfig();
    const freshMonthInfo = getContentPlannerMonthInfo();
    const items = generateContentPlannerItems(freshConfig, freshMonthInfo);
    saveContentPlannerCalendar({ monthKey: freshMonthInfo.monthKey, monthLabel: freshMonthInfo.monthLabel, items });
    renderContentPlannerCalendarSection();
  });
  actionsRow.appendChild(generateButton);
  section.appendChild(actionsRow);

  if (!hasCurrentCalendar) {
    const empty = document.createElement('p');
    empty.className = 'insight-empty';
    empty.style.marginTop = '14px';
    empty.textContent = 'Aucun calendrier généré pour ce mois. Cliquez sur le bouton ci-dessus pour créer automatiquement les publications, Reels, Stories et publications Google Business / LinkedIn selon la configuration.';
    section.appendChild(empty);
    return;
  }

  const weeks = partitionContentPlannerDaysIntoWeeks(monthInfo.days);

  weeks.forEach((week, index) => {
    const weekBlock = document.createElement('div');
    weekBlock.className = 'analysis-subsection calendar-week-block';

    const heading = document.createElement('h4');
    heading.textContent = `Semaine ${index + 1} — ${formatContentPlannerWeekLabel(week.days)}`;
    weekBlock.appendChild(heading);

    const weekDateKeys = week.days.map((date) => formatContentPlannerDateKey(date));
    const weekItems = calendar.items
      .filter((item) => weekDateKeys.includes(item.date))
      .sort((a, b) => a.date.localeCompare(b.date));

    const list = document.createElement('div');
    list.className = 'calendar-item-list';

    if (!weekItems.length) {
      const empty = document.createElement('p');
      empty.className = 'insight-empty';
      empty.textContent = 'Aucune publication cette semaine.';
      list.appendChild(empty);
    } else {
      weekItems.forEach((item) => {
        list.appendChild(createContentPlannerItemRow(item, checkedPlatforms));
      });
    }

    weekBlock.appendChild(list);
    section.appendChild(weekBlock);
  });

  const addForm = document.createElement('form');
  addForm.className = 'inline-add-form';
  addForm.style.marginTop = '18px';
  const firstDateKey = formatContentPlannerDateKey(monthInfo.days[0]);
  const lastDateKey = formatContentPlannerDateKey(monthInfo.days[monthInfo.days.length - 1]);
  addForm.innerHTML = `
    <input type="date" required min="${firstDateKey}" max="${lastDateKey}" value="${firstDateKey}" />
    <button type="submit" class="client-open-btn">Ajouter une publication</button>
  `;
  addForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const dateValue = addForm.querySelector('input').value;
    if (!dateValue) {
      return;
    }
    const freshCalendar = getContentPlannerCalendar();
    if (!freshCalendar) {
      return;
    }
    freshCalendar.items.push({
      id: generateContentPlannerId(),
      date: dateValue,
      platformKey: checkedPlatforms[0].key,
      type: contentPlannerContentTypes[0],
      objective: '',
      status: contentPlannerStatusOptions[0]
    });
    saveContentPlannerCalendar(freshCalendar);
    renderContentPlannerCalendarSection();
  });
  section.appendChild(addForm);
}

document.addEventListener('DOMContentLoaded', () => {
  renderContentPlannerClientFields();
  renderContentPlannerGoalsFields();
  renderContentPlannerPlatformChecklist();
  renderContentPlannerRhythmFields();
  renderContentPlannerCalendarSection();
});
