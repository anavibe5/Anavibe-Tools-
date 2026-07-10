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
      refreshGoogleOptimizerWeaknessesSection();
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

function detectGoogleOptimizerWeaknesses(fiche) {
  const weaknesses = [];
  const rating = Number(fiche.rating) || 0;
  const reviewsCount = Number(fiche.reviewsCount) || 0;
  const photosCount = Number(fiche.photosCount) || 0;
  const videosCount = Number(fiche.videosCount) || 0;

  if (rating < 3.0) {
    weaknesses.push({
      key: 'rating',
      label: 'Note Google faible',
      priority: 'urgent',
      explanation: 'Une note en dessous de 3/5 dissuade la majorité des prospects avant même qu’ils ne consultent la fiche.',
      impact: 'Impact fort : la note est l’un des tout premiers critères regardés dans les résultats de recherche locaux.'
    });
  } else if (rating < 4.0) {
    weaknesses.push({
      key: 'rating',
      label: 'Note Google à améliorer',
      priority: 'important',
      explanation: 'Une note entre 3 et 4/5 reste en retrait par rapport aux fiches les mieux positionnées, qui affichent généralement 4,5/5 ou plus.',
      impact: 'Impact modéré à fort sur le taux de clic et la confiance des prospects.'
    });
  } else if (rating < 4.5) {
    weaknesses.push({
      key: 'rating',
      label: 'Note Google perfectible',
      priority: 'optimisation',
      explanation: 'La note est correcte mais reste en dessous des meilleures fiches du secteur, généralement au-delà de 4,5/5.',
      impact: 'Impact modéré : quelques avis positifs supplémentaires permettraient de passer un cap.'
    });
  }

  if (reviewsCount < 5) {
    weaknesses.push({
      key: 'reviewsCount',
      label: 'Très peu d’avis',
      priority: 'urgent',
      explanation: 'Un nombre d’avis très faible réduit fortement la crédibilité de la fiche, Google favorisant les fiches actives et régulièrement commentées dans son classement local.',
      impact: 'Impact fort sur la visibilité et la confiance des prospects.'
    });
  } else if (reviewsCount < 20) {
    weaknesses.push({
      key: 'reviewsCount',
      label: 'Peu d’avis',
      priority: 'important',
      explanation: 'Le volume d’avis reste inférieur à celui des concurrents les mieux positionnés, ce qui peut freiner la conversion.',
      impact: 'Impact modéré à fort sur le classement local et la crédibilité perçue.'
    });
  } else if (reviewsCount < 50) {
    weaknesses.push({
      key: 'reviewsCount',
      label: 'Avis encore limités',
      priority: 'optimisation',
      explanation: 'Le nombre d’avis est correct mais peut encore être renforcé pour consolider la position de la fiche face à la concurrence.',
      impact: 'Impact modéré sur le classement local.'
    });
  }

  if (photosCount < 1) {
    weaknesses.push({
      key: 'photosCount',
      label: 'Aucune photo',
      priority: 'urgent',
      explanation: 'Une fiche sans photo inspire beaucoup moins confiance et attire nettement moins de clics que les fiches illustrées.',
      impact: 'Impact fort sur le taux de clic et l’attractivité de la fiche.'
    });
  } else if (photosCount < 5) {
    weaknesses.push({
      key: 'photosCount',
      label: 'Peu de photos',
      priority: 'important',
      explanation: 'Un nombre de photos limité donne une image incomplète de l’activité et réduit l’engagement des visiteurs.',
      impact: 'Impact modéré à fort sur l’attractivité et la conversion.'
    });
  } else if (photosCount < 10) {
    weaknesses.push({
      key: 'photosCount',
      label: 'Photos à enrichir',
      priority: 'optimisation',
      explanation: 'Le nombre de photos est correct mais pourrait être enrichi pour mieux couvrir l’activité (lieu, produits, équipe).',
      impact: 'Impact modéré sur l’attractivité de la fiche.'
    });
  }

  if (videosCount < 1) {
    weaknesses.push({
      key: 'videosCount',
      label: 'Aucune vidéo',
      priority: 'optimisation',
      explanation: 'Les vidéos renforcent l’engagement et la mise en confiance, mais restent un contenu secondaire par rapport aux photos.',
      impact: 'Impact faible à modéré sur l’engagement.'
    });
  }

  if (fiche.descriptionPresent !== 'Oui') {
    weaknesses.push({
      key: 'descriptionPresent',
      label: 'Description absente',
      priority: 'urgent',
      explanation: 'Sans description, Google et les prospects manquent d’informations clés sur l’activité, ce qui nuit au référencement local et à la clarté de l’offre.',
      impact: 'Impact fort sur le référencement local et la compréhension de l’offre.'
    });
  }

  if (!String(fiche.mainCategory || '').trim()) {
    weaknesses.push({
      key: 'mainCategory',
      label: 'Catégorie principale manquante',
      priority: 'urgent',
      explanation: 'Sans catégorie principale, Google ne peut pas positionner correctement la fiche sur les recherches les plus pertinentes.',
      impact: 'Impact fort sur le classement dans les recherches locales.'
    });
  }

  if (!String(fiche.secondaryCategories || '').trim()) {
    weaknesses.push({
      key: 'secondaryCategories',
      label: 'Catégories secondaires incomplètes',
      priority: 'important',
      explanation: 'Les catégories secondaires élargissent la visibilité sur des recherches complémentaires ; leur absence limite la couverture de recherche.',
      impact: 'Impact modéré sur la visibilité élargie.'
    });
  }

  if (!String(fiche.phone || '').trim()) {
    weaknesses.push({
      key: 'phone',
      label: 'Téléphone absent',
      priority: 'important',
      explanation: 'Sans numéro affiché, les prospects ne peuvent pas appeler directement depuis la fiche, ce qui réduit les conversions.',
      impact: 'Impact modéré à fort sur les conversions directes.'
    });
  }

  if (!String(fiche.website || '').trim()) {
    weaknesses.push({
      key: 'website',
      label: 'Site internet absent',
      priority: 'important',
      explanation: 'Le lien vers le site permet de rediriger le trafic Google vers un canal qui convertit davantage ; son absence limite ce relais.',
      impact: 'Impact modéré sur la conversion et la crédibilité.'
    });
  }

  if (!String(fiche.hours || '').trim()) {
    weaknesses.push({
      key: 'hours',
      label: 'Horaires non renseignés',
      priority: 'urgent',
      explanation: 'Sans horaires visibles, les prospects ne savent pas si l’établissement est ouvert, ce qui génère de la friction et peut faire perdre des clients immédiatement.',
      impact: 'Impact fort sur la conversion et l’expérience utilisateur.'
    });
  }

  if (fiche.bookingAvailable !== 'Oui') {
    weaknesses.push({
      key: 'bookingAvailable',
      label: 'Réservation non disponible',
      priority: 'important',
      explanation: 'Un lien de réservation directe augmente le taux de conversion ; son absence oblige le prospect à sortir de la fiche pour réserver, ce qui fait perdre des opportunités.',
      impact: 'Impact modéré à fort sur la conversion.'
    });
  }

  if (fiche.menuAvailable !== 'Oui') {
    weaknesses.push({
      key: 'menuAvailable',
      label: 'Menu ou prestations non renseignés',
      priority: 'important',
      explanation: 'Sans menu ou liste de prestations visible, le prospect manque d’informations essentielles pour se décider, ce qui augmente le risque d’abandon.',
      impact: 'Impact modéré à fort sur la décision du prospect.'
    });
  }

  if (fiche.postsActive !== 'Oui') {
    weaknesses.push({
      key: 'postsActive',
      label: 'Publications Google absentes',
      priority: 'optimisation',
      explanation: 'Les publications régulières signalent à Google une fiche active et améliorent la fraîcheur perçue, ce qui favorise le classement local.',
      impact: 'Impact modéré sur le classement local.'
    });
  }

  if (fiche.qnaCompleted !== 'Oui') {
    weaknesses.push({
      key: 'qnaCompleted',
      label: 'Questions / réponses non complétées',
      priority: 'optimisation',
      explanation: 'Une section Questions/Réponses vide laisse les prospects sans réponses immédiates à leurs interrogations courantes, ce qui peut les faire hésiter.',
      impact: 'Impact faible à modéré sur la conversion.'
    });
  }

  return weaknesses;
}

const googleOptimizerPriorityConfig = [
  { key: 'urgent', title: 'Urgent', tone: 'high' },
  { key: 'important', title: 'Important', tone: 'medium' },
  { key: 'optimisation', title: 'Optimisation', tone: 'neutral' }
];

function createGoogleOptimizerWeaknessItem(weakness) {
  const item = document.createElement('div');
  item.className = `insight-item tone-${googleOptimizerPriorityConfig.find((p) => p.key === weakness.priority).tone}`;
  item.innerHTML = `
    <span class="insight-icon">⚠️</span>
    <span class="insight-text">
      <strong>${escapeGoogleOptimizerText(weakness.label)}</strong><br>
      ${escapeGoogleOptimizerText(weakness.explanation)}<br>
      <em>${escapeGoogleOptimizerText(weakness.impact)}</em>
    </span>
  `;
  return item;
}

function refreshGoogleOptimizerWeaknessesSection() {
  const section = document.getElementById('googleOptimizerWeaknesses');
  if (!section) {
    return;
  }

  const data = getGoogleOptimizerData();
  const weaknesses = detectGoogleOptimizerWeaknesses(data.fiche);

  section.innerHTML = `
    <p class="eyebrow">Analyse automatique</p>
    <h3>🔍 Points faibles détectés</h3>
    <p>Détectés automatiquement à partir des informations de la fiche, classés par ordre de priorité.</p>
  `;

  googleOptimizerPriorityConfig.forEach((priority) => {
    const subsection = document.createElement('div');
    subsection.className = 'analysis-subsection';

    const heading = document.createElement('h4');
    heading.textContent = priority.title;
    subsection.appendChild(heading);

    const list = document.createElement('div');
    list.className = 'insight-list';

    const items = weaknesses.filter((weakness) => weakness.priority === priority.key);
    if (!items.length) {
      const empty = document.createElement('p');
      empty.className = 'insight-empty';
      empty.textContent = `Aucun point faible « ${priority.title} » détecté.`;
      list.appendChild(empty);
    } else {
      items.forEach((weakness) => {
        list.appendChild(createGoogleOptimizerWeaknessItem(weakness));
      });
    }

    subsection.appendChild(list);
    section.appendChild(subsection);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderGoogleOptimizerCompanyForm();
  renderGoogleOptimizerFicheForm();
  refreshGoogleOptimizerScoreSection();
  refreshGoogleOptimizerWeaknessesSection();
});
