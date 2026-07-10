const GOOGLE_OPTIMIZER_DATA_KEY = 'anavibe-tools-google-optimizer-data';

const googleOptimizerCompanyFieldsSchema = [
  { key: 'name', label: 'Nom de l’entreprise', type: 'text' },
  { key: 'link', label: 'Lien Google Business', type: 'text' },
  { key: 'sector', label: 'Secteur d’activité', type: 'text' },
  { key: 'city', label: 'Ville', type: 'text' }
];

const googleOptimizerFicheFieldsSchema = [
  { key: 'rating', label: 'Note Google', type: 'number', step: '0.1' },
  { key: 'reviewsCount', label: 'Nombre d’avis', type: 'number' },
  { key: 'photosCount', label: 'Nombre de photos', type: 'number' },
  { key: 'videosCount', label: 'Nombre de vidéos', type: 'number' },
  { key: 'descriptionPresent', label: 'Description présente', type: 'select', options: ['Non', 'Oui'] },
  { key: 'mainCategory', label: 'Catégorie principale', type: 'text' },
  { key: 'secondaryCategories', label: 'Catégories secondaires', type: 'text' },
  { key: 'phone', label: 'Téléphone', type: 'text' },
  { key: 'website', label: 'Site internet', type: 'text' },
  { key: 'hours', label: 'Horaires', type: 'text' },
  { key: 'bookingAvailable', label: 'Réservation disponible', type: 'select', options: ['Non', 'Oui'] },
  { key: 'menuAvailable', label: 'Menu ou prestations disponibles', type: 'select', options: ['Non', 'Oui'] },
  { key: 'postsActive', label: 'Publications Google actives', type: 'select', options: ['Non', 'Oui'] },
  { key: 'qnaCompleted', label: 'Questions / réponses complétées', type: 'select', options: ['Non', 'Oui'] }
];

function createDefaultGoogleOptimizerData() {
  return {
    company: {
      name: '',
      link: '',
      sector: '',
      city: ''
    },
    fiche: {
      rating: '',
      reviewsCount: '',
      photosCount: '',
      videosCount: '',
      descriptionPresent: 'Non',
      mainCategory: '',
      secondaryCategories: '',
      phone: '',
      website: '',
      hours: '',
      bookingAvailable: 'Non',
      menuAvailable: 'Non',
      postsActive: 'Non',
      qnaCompleted: 'Non'
    }
  };
}

function getGoogleOptimizerData() {
  const saved = localStorage.getItem(GOOGLE_OPTIMIZER_DATA_KEY);

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.company && parsed.fiche) {
        return parsed;
      }
    } catch (error) {
      // fall through to default
    }
  }

  const defaultData = createDefaultGoogleOptimizerData();
  localStorage.setItem(GOOGLE_OPTIMIZER_DATA_KEY, JSON.stringify(defaultData));
  return defaultData;
}

function saveGoogleOptimizerData(data) {
  localStorage.setItem(GOOGLE_OPTIMIZER_DATA_KEY, JSON.stringify(data));
}

function escapeGoogleOptimizerText(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]
  ));
}

function getGoogleOptimizerBandedPoints(value, bands) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return 0;
  }
  for (const [threshold, points] of bands) {
    if (numeric >= threshold) {
      return points;
    }
  }
  return 0;
}

function computeGoogleOptimizerScore(fiche) {
  let score = 0;
  score += getGoogleOptimizerBandedPoints(fiche.rating, [[4.5, 15], [4.0, 12], [3.5, 8], [3.0, 4]]);
  score += getGoogleOptimizerBandedPoints(fiche.reviewsCount, [[100, 15], [50, 12], [20, 8], [5, 4]]);
  score += getGoogleOptimizerBandedPoints(fiche.photosCount, [[20, 8], [10, 6], [5, 4], [1, 2]]);
  score += getGoogleOptimizerBandedPoints(fiche.videosCount, [[5, 5], [1, 3]]);
  score += fiche.descriptionPresent === 'Oui' ? 6 : 0;
  score += String(fiche.mainCategory || '').trim() ? 6 : 0;
  score += String(fiche.secondaryCategories || '').trim() ? 5 : 0;
  score += String(fiche.phone || '').trim() ? 6 : 0;
  score += String(fiche.website || '').trim() ? 6 : 0;
  score += String(fiche.hours || '').trim() ? 6 : 0;
  score += fiche.bookingAvailable === 'Oui' ? 6 : 0;
  score += fiche.menuAvailable === 'Oui' ? 6 : 0;
  score += fiche.postsActive === 'Oui' ? 5 : 0;
  score += fiche.qnaCompleted === 'Oui' ? 5 : 0;
  return Math.min(100, score);
}

function getGoogleOptimizerScoreLevel(score) {
  if (score >= 85) {
    return { label: 'Excellent', tone: 'positive' };
  }
  if (score >= 70) {
    return { label: 'Bon', tone: 'positive' };
  }
  if (score >= 40) {
    return { label: 'Moyen', tone: 'medium' };
  }
  return { label: 'Faible', tone: 'high' };
}

function createGoogleOptimizerGaugeMarkup(score) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const dashOffset = circumference * (1 - clamped / 100);
  const color = clamped >= 70 ? '#2e7d32' : clamped >= 40 ? '#e08e2d' : '#c62828';

  return `
    <svg viewBox="0 0 140 140" class="score-gauge-svg">
      <circle cx="70" cy="70" r="${radius}" class="gauge-track"></circle>
      <circle cx="70" cy="70" r="${radius}" class="gauge-progress"
        style="stroke: ${color}; stroke-dasharray: ${circumference}px; stroke-dashoffset: ${dashOffset}px;"></circle>
      <text x="70" y="64" class="gauge-score-value" text-anchor="middle">${Math.round(clamped)}</text>
      <text x="70" y="86" class="gauge-score-suffix" text-anchor="middle">/ 100</text>
    </svg>
  `;
}

function createGoogleOptimizerFieldControl(field, value) {
  const wrapper = document.createElement('label');
  wrapper.className = 'field-item';

  const labelSpan = document.createElement('span');
  labelSpan.textContent = field.label;
  wrapper.appendChild(labelSpan);

  let input;
  if (field.type === 'select') {
    input = document.createElement('select');
    input.className = 'field-input';
    field.options.forEach((optionValue) => {
      const option = document.createElement('option');
      option.value = optionValue;
      option.textContent = optionValue;
      input.appendChild(option);
    });
    input.value = value ?? field.options[0];
  } else {
    input = document.createElement('input');
    input.className = 'field-input';
    input.type = field.type;
    if (field.step) {
      input.step = field.step;
    }
    input.value = value ?? '';
  }

  input.dataset.field = field.key;
  wrapper.appendChild(input);
  return wrapper;
}

function renderGoogleOptimizerCompanyForm() {
  const grid = document.getElementById('companyFieldsGrid');
  if (!grid) {
    return;
  }

  const data = getGoogleOptimizerData();
  grid.innerHTML = '';

  googleOptimizerCompanyFieldsSchema.forEach((field) => {
    const control = createGoogleOptimizerFieldControl(field, data.company[field.key]);
    const input = control.querySelector('.field-input');
    input.addEventListener('input', () => {
      const freshData = getGoogleOptimizerData();
      freshData.company[field.key] = input.value;
      saveGoogleOptimizerData(freshData);
    });
    grid.appendChild(control);
  });
}

function renderGoogleOptimizerFicheForm() {
  const grid = document.getElementById('ficheFieldsGrid');
  if (!grid) {
    return;
  }

  const data = getGoogleOptimizerData();
  grid.innerHTML = '';

  googleOptimizerFicheFieldsSchema.forEach((field) => {
    const control = createGoogleOptimizerFieldControl(field, data.fiche[field.key]);
    const input = control.querySelector('.field-input');
    const eventName = field.type === 'select' ? 'change' : 'input';
    input.addEventListener(eventName, () => {
      const freshData = getGoogleOptimizerData();
      freshData.fiche[field.key] = input.value;
      saveGoogleOptimizerData(freshData);
      refreshGoogleOptimizerScoreSection();
    });
    grid.appendChild(control);
  });
}

function refreshGoogleOptimizerScoreSection() {
  const gaugeEl = document.getElementById('googleOptimizerGauge');
  if (!gaugeEl) {
    return;
  }

  const data = getGoogleOptimizerData();
  const score = computeGoogleOptimizerScore(data.fiche);
  const level = getGoogleOptimizerScoreLevel(score);

  gaugeEl.innerHTML = `
    ${createGoogleOptimizerGaugeMarkup(score)}
    <span class="gauge-status-badge tone-${level.tone}">${escapeGoogleOptimizerText(level.label)}</span>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  renderGoogleOptimizerCompanyForm();
  renderGoogleOptimizerFicheForm();
  refreshGoogleOptimizerScoreSection();
});
