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
    dashboardClientId: '',
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
      refreshGoogleOptimizerWeaknessesSection();
      refreshGoogleOptimizerPlanSection();
      refreshGoogleOptimizerRoadmapSection();
      if (field.key === 'name') {
        renderGboDashboardSection();
      }
    });
    grid.appendChild(control);
  });
}

// --- Connexion au Profil Stratégique Client du Dashboard (script.js, chargé sur cette même
// page) : lecture seule, ne modifie jamais script.js. Même schéma de rattachement que le
// Content Planner (auto-match par nom + sélection manuelle) pour une source de vérité unique.
function getGboDashboardClientOptions() {
  if (typeof getClientIds !== 'function' || typeof getClientData !== 'function') {
    return [];
  }
  try {
    return getClientIds().map((id) => {
      const clientData = getClientData(id);
      return { id, name: (clientData && clientData.general && clientData.general.name) || id };
    });
  } catch (error) {
    return [];
  }
}

function resolveGboDashboardClientId(data, options) {
  const list = options || getGboDashboardClientOptions();
  const stored = data.dashboardClientId || '';
  if (stored && list.some((client) => client.id === stored)) {
    return stored;
  }
  const name = String((data.company && data.company.name) || '').trim();
  if (!name || typeof normalizeId !== 'function') {
    return '';
  }
  const target = normalizeId(name);
  const match = list.find((client) => normalizeId(client.name) === target);
  return match ? match.id : '';
}

function renderGboStrategicProfileList(strategicProfile) {
  const schemaFields = (typeof clientStrategicProfileFieldsSchema !== 'undefined') ? clientStrategicProfileFieldsSchema.fields : [];
  const texts = schemaFields
    .map((field) => ({ label: field.label, value: String((strategicProfile && strategicProfile[field.key]) || '').trim() }))
    .filter((entry) => entry.value)
    .map((entry) => `${entry.label} : ${entry.value}`);

  const list = document.createElement('div');
  list.className = 'insight-list';
  if (!texts.length) {
    const empty = document.createElement('p');
    empty.className = 'insight-empty';
    empty.textContent = 'Aucune information renseignée dans le profil stratégique du client (onglet dédié dans sa fiche Dashboard).';
    list.appendChild(empty);
    return list;
  }
  texts.forEach((text) => {
    const item = document.createElement('div');
    item.className = 'insight-item tone-neutral';
    item.innerHTML = `<span class="insight-icon">🧠</span><span class="insight-text">${escapeGoogleOptimizerText(text)}</span>`;
    list.appendChild(item);
  });
  return list;
}

function renderGboDashboardSection() {
  const section = document.getElementById('googleOptimizerDashboardSection');
  if (!section) {
    return;
  }

  const data = getGoogleOptimizerData();
  const options = getGboDashboardClientOptions();

  section.innerHTML = `
    <p class="eyebrow">Connexion Dashboard</p>
    <h3>🧠 Profil Stratégique Client</h3>
    <p>Source de vérité unique pour ce client, saisie une fois dans le Dashboard et automatiquement accessible ici pour affiner l’audit.</p>
  `;

  if (!options.length) {
    section.appendChild(renderGboStrategicProfileList(null));
    return;
  }

  const clientId = resolveGboDashboardClientId(data, options);
  if (clientId && data.dashboardClientId !== clientId) {
    data.dashboardClientId = clientId;
    saveGoogleOptimizerData(data);
  }

  const linkRow = document.createElement('label');
  linkRow.className = 'field-item';
  const linkLabel = document.createElement('span');
  linkLabel.textContent = 'Client Dashboard lié';
  linkRow.appendChild(linkLabel);
  const select = document.createElement('select');
  select.className = 'field-input';
  const noneOption = document.createElement('option');
  noneOption.value = '';
  noneOption.textContent = '— Aucun —';
  select.appendChild(noneOption);
  options.forEach((option) => {
    const optionEl = document.createElement('option');
    optionEl.value = option.id;
    optionEl.textContent = option.name;
    select.appendChild(optionEl);
  });
  select.value = clientId;
  select.addEventListener('change', () => {
    const freshData = getGoogleOptimizerData();
    freshData.dashboardClientId = select.value;
    saveGoogleOptimizerData(freshData);
    renderGboDashboardSection();
  });
  linkRow.appendChild(select);
  section.appendChild(linkRow);

  if (!clientId) {
    const empty = document.createElement('p');
    empty.className = 'insight-empty';
    empty.textContent = 'Sélectionnez le client Dashboard correspondant pour afficher automatiquement son profil stratégique.';
    section.appendChild(empty);
    return;
  }

  const clientData = getClientData(clientId);
  section.appendChild(renderGboStrategicProfileList(clientData.strategicProfile));
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
      refreshGoogleOptimizerPlanSection();
      refreshGoogleOptimizerRoadmapSection();
      refreshGoogleOptimizerPotentialSection();
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

function getGoogleOptimizerActivityLabel(company) {
  const sector = String((company && company.sector) || '').trim();
  return sector || 'votre activité';
}

function getGoogleOptimizerCompanyLabel(company) {
  const name = String((company && company.name) || '').trim();
  return name || 'l’entreprise';
}

function getGoogleOptimizerCityLabel(company) {
  const city = String((company && company.city) || '').trim();
  return city;
}

function detectGoogleOptimizerWeaknesses(fiche, company) {
  const context = company || {};
  const activityLabel = getGoogleOptimizerActivityLabel(context);
  const companyLabel = getGoogleOptimizerCompanyLabel(context);
  const cityLabel = getGoogleOptimizerCityLabel(context);
  const localSuffix = cityLabel ? ` sur ${cityLabel}` : '';

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
      impact: 'Impact fort : la note est l’un des tout premiers critères regardés dans les résultats de recherche locaux.',
      action: `Mettez en place un plan de gestion de la réputation en urgence pour ${companyLabel} : identifiez les causes récurrentes d’insatisfaction dans les avis, corrigez-les en interne, puis répondez publiquement et professionnellement à chaque avis négatif pour montrer votre réactivité.`,
      expectedImpact: 'Une remontée progressive de la note renforce la confiance et le taux de clic dès les premières semaines de réponse active aux avis.'
    });
  } else if (rating < 4.0) {
    weaknesses.push({
      key: 'rating',
      label: 'Note Google à améliorer',
      priority: 'important',
      explanation: 'Une note entre 3 et 4/5 reste en retrait par rapport aux fiches les mieux positionnées, qui affichent généralement 4,5/5 ou plus.',
      impact: 'Impact modéré à fort sur le taux de clic et la confiance des prospects.',
      action: 'Sollicitez activement les clients satisfaits pour laisser un avis (SMS, QR code en caisse, e-mail après visite) afin de faire remonter la moyenne, et répondez à tous les avis existants pour montrer votre engagement.',
      expectedImpact: 'Une note qui franchit la barre des 4/5 améliore nettement la position de la fiche et la confiance perçue.'
    });
  } else if (rating < 4.5) {
    weaknesses.push({
      key: 'rating',
      label: 'Note Google perfectible',
      priority: 'optimisation',
      explanation: 'La note est correcte mais reste en dessous des meilleures fiches du secteur, généralement au-delà de 4,5/5.',
      impact: 'Impact modéré : quelques avis positifs supplémentaires permettraient de passer un cap.',
      action: 'Poursuivez la collecte régulière d’avis positifs et personnalisez vos réponses pour consolider la confiance et viser les 4,5/5.',
      expectedImpact: 'Franchir 4,5/5 place la fiche parmi les mieux notées de sa catégorie et améliore le classement local.'
    });
  }

  if (reviewsCount < 5) {
    weaknesses.push({
      key: 'reviewsCount',
      label: 'Très peu d’avis',
      priority: 'urgent',
      explanation: 'Un nombre d’avis très faible réduit fortement la crédibilité de la fiche, Google favorisant les fiches actives et régulièrement commentées dans son classement local.',
      impact: 'Impact fort sur la visibilité et la confiance des prospects.',
      action: `Lancez immédiatement une campagne de collecte d’avis pour ${companyLabel} : demandez systématiquement à chaque client satisfait de laisser un avis via un lien direct ou un QR code affiché sur place.`,
      expectedImpact: 'Un volume d’avis multiplié rapidement améliore fortement la crédibilité et le classement local de la fiche.'
    });
  } else if (reviewsCount < 20) {
    weaknesses.push({
      key: 'reviewsCount',
      label: 'Peu d’avis',
      priority: 'important',
      explanation: 'Le volume d’avis reste inférieur à celui des concurrents les mieux positionnés, ce qui peut freiner la conversion.',
      impact: 'Impact modéré à fort sur le classement local et la crédibilité perçue.',
      action: 'Intégrez la demande d’avis dans le parcours client habituel (après achat, en fin de prestation) pour augmenter régulièrement le volume d’avis.',
      expectedImpact: 'Un flux régulier de nouveaux avis renforce progressivement le positionnement face à la concurrence locale.'
    });
  } else if (reviewsCount < 50) {
    weaknesses.push({
      key: 'reviewsCount',
      label: 'Avis encore limités',
      priority: 'optimisation',
      explanation: 'Le nombre d’avis est correct mais peut encore être renforcé pour consolider la position de la fiche face à la concurrence.',
      impact: 'Impact modéré sur le classement local.',
      action: `Continuez à solliciter des avis de façon régulière pour dépasser les concurrents directs de ${activityLabel}${localSuffix} sur ce critère.`,
      expectedImpact: 'Dépasser les 50 avis consolide durablement la position de la fiche dans les recherches locales.'
    });
  }

  if (photosCount < 1) {
    weaknesses.push({
      key: 'photosCount',
      label: 'Aucune photo',
      priority: 'urgent',
      explanation: 'Une fiche sans photo inspire beaucoup moins confiance et attire nettement moins de clics que les fiches illustrées.',
      impact: 'Impact fort sur le taux de clic et l’attractivité de la fiche.',
      action: `Ajoutez sans délai une première série de photos de qualité représentatives de ${activityLabel} (façade, intérieur, équipe, produits ou réalisations) pour rendre la fiche crédible et attractive.`,
      expectedImpact: 'Une fiche illustrée génère nettement plus de clics et de demandes de contact dès sa mise en ligne.'
    });
  } else if (photosCount < 5) {
    weaknesses.push({
      key: 'photosCount',
      label: 'Peu de photos',
      priority: 'important',
      explanation: 'Un nombre de photos limité donne une image incomplète de l’activité et réduit l’engagement des visiteurs.',
      impact: 'Impact modéré à fort sur l’attractivité et la conversion.',
      action: `Complétez la galerie avec des photos supplémentaires représentatives de ${activityLabel} : ambiance, produits, équipe, avant/après si pertinent.`,
      expectedImpact: 'Une galerie plus complète augmente le temps passé sur la fiche et la probabilité de contact.'
    });
  } else if (photosCount < 10) {
    weaknesses.push({
      key: 'photosCount',
      label: 'Photos à enrichir',
      priority: 'optimisation',
      explanation: 'Le nombre de photos est correct mais pourrait être enrichi pour mieux couvrir l’activité (lieu, produits, équipe).',
      impact: 'Impact modéré sur l’attractivité de la fiche.',
      action: 'Enrichissez régulièrement la galerie avec de nouvelles photos pour montrer une activité vivante et actualisée.',
      expectedImpact: 'Des photos régulièrement renouvelées maintiennent une image dynamique et actuelle de la fiche.'
    });
  }

  if (videosCount < 1) {
    weaknesses.push({
      key: 'videosCount',
      label: 'Aucune vidéo',
      priority: 'optimisation',
      explanation: 'Les vidéos renforcent l’engagement et la mise en confiance, mais restent un contenu secondaire par rapport aux photos.',
      impact: 'Impact faible à modéré sur l’engagement.',
      action: 'Ajoutez une ou plusieurs courtes vidéos (présentation, coulisses, avis clients) pour renforcer l’engagement et la confiance.',
      expectedImpact: 'Une vidéo de présentation augmente le temps passé sur la fiche et la mémorisation de la marque.'
    });
  }

  if (fiche.descriptionPresent !== 'Oui') {
    weaknesses.push({
      key: 'descriptionPresent',
      label: 'Description absente',
      priority: 'urgent',
      explanation: 'Sans description, Google et les prospects manquent d’informations clés sur l’activité, ce qui nuit au référencement local et à la clarté de l’offre.',
      impact: 'Impact fort sur le référencement local et la compréhension de l’offre.',
      action: `Rédigez une description complète et optimisée présentant ${companyLabel}, son activité et ses points forts${localSuffix}, en intégrant naturellement les mots-clés recherchés par vos clients.`,
      expectedImpact: 'Une description optimisée améliore le référencement local et clarifie immédiatement l’offre pour le prospect.'
    });
  }

  if (!String(fiche.mainCategory || '').trim()) {
    weaknesses.push({
      key: 'mainCategory',
      label: 'Catégorie principale manquante',
      priority: 'urgent',
      explanation: 'Sans catégorie principale, Google ne peut pas positionner correctement la fiche sur les recherches les plus pertinentes.',
      impact: 'Impact fort sur le classement dans les recherches locales.',
      action: `Renseignez immédiatement la catégorie principale la plus précise possible pour ${activityLabel} : c’est l’un des critères les plus déterminants pour apparaître dans les bonnes recherches Google.`,
      expectedImpact: 'Une catégorie principale précise améliore rapidement le classement sur les recherches réellement pertinentes.'
    });
  }

  if (!String(fiche.secondaryCategories || '').trim()) {
    weaknesses.push({
      key: 'secondaryCategories',
      label: 'Catégories secondaires incomplètes',
      priority: 'important',
      explanation: 'Les catégories secondaires élargissent la visibilité sur des recherches complémentaires ; leur absence limite la couverture de recherche.',
      impact: 'Impact modéré sur la visibilité élargie.',
      action: 'Ajoutez toutes les catégories secondaires pertinentes pour couvrir l’ensemble des recherches associées à votre activité.',
      expectedImpact: 'Des catégories secondaires complètes élargissent la fiche à de nouvelles recherches et donc de nouveaux prospects.'
    });
  }

  if (!String(fiche.phone || '').trim()) {
    weaknesses.push({
      key: 'phone',
      label: 'Téléphone absent',
      priority: 'important',
      explanation: 'Sans numéro affiché, les prospects ne peuvent pas appeler directement depuis la fiche, ce qui réduit les conversions.',
      impact: 'Impact modéré à fort sur les conversions directes.',
      action: `Ajoutez un numéro de téléphone visible et à jour pour permettre aux prospects de contacter directement ${companyLabel} depuis la fiche.`,
      expectedImpact: 'Un numéro visible génère des appels directs supplémentaires dès sa mise en ligne.'
    });
  }

  if (!String(fiche.website || '').trim()) {
    weaknesses.push({
      key: 'website',
      label: 'Site internet absent',
      priority: 'important',
      explanation: 'Le lien vers le site permet de rediriger le trafic Google vers un canal qui convertit davantage ; son absence limite ce relais.',
      impact: 'Impact modéré sur la conversion et la crédibilité.',
      action: 'Ajoutez le lien vers votre site internet (ou à défaut une page de contact ou de réservation) pour rediriger le trafic Google vers un canal qui convertit davantage.',
      expectedImpact: 'Le trafic redirigé vers le site ou une page de contact augmente les opportunités de conversion.'
    });
  }

  if (!String(fiche.hours || '').trim()) {
    weaknesses.push({
      key: 'hours',
      label: 'Horaires non renseignés',
      priority: 'urgent',
      explanation: 'Sans horaires visibles, les prospects ne savent pas si l’établissement est ouvert, ce qui génère de la friction et peut faire perdre des clients immédiatement.',
      impact: 'Impact fort sur la conversion et l’expérience utilisateur.',
      action: 'Renseignez des horaires précis et à jour, y compris les exceptions (jours fériés, fermetures ponctuelles), pour éviter toute friction ou déplacement inutile des clients.',
      expectedImpact: 'Des horaires clairs réduisent immédiatement les appels inutiles et les déplacements pour rien.'
    });
  }

  if (fiche.bookingAvailable !== 'Oui') {
    weaknesses.push({
      key: 'bookingAvailable',
      label: 'Réservation non disponible',
      priority: 'important',
      explanation: 'Un lien de réservation directe augmente le taux de conversion ; son absence oblige le prospect à sortir de la fiche pour réserver, ce qui fait perdre des opportunités.',
      impact: 'Impact modéré à fort sur la conversion.',
      action: 'Activez un lien de réservation directe sur la fiche pour permettre aux prospects de réserver en un clic, sans quitter la page.',
      expectedImpact: 'Un lien de réservation direct réduit les frictions et augmente le taux de conversion depuis la fiche.'
    });
  }

  if (fiche.menuAvailable !== 'Oui') {
    weaknesses.push({
      key: 'menuAvailable',
      label: 'Menu ou prestations non renseignés',
      priority: 'important',
      explanation: 'Sans menu ou liste de prestations visible, le prospect manque d’informations essentielles pour se décider, ce qui augmente le risque d’abandon.',
      impact: 'Impact modéré à fort sur la décision du prospect.',
      action: `Ajoutez le menu ou la liste des prestations de ${companyLabel} directement sur la fiche pour donner aux prospects toutes les informations nécessaires à leur décision.`,
      expectedImpact: 'Une offre visible directement sur la fiche accélère la décision et réduit l’abandon avant contact.'
    });
  }

  if (fiche.postsActive !== 'Oui') {
    weaknesses.push({
      key: 'postsActive',
      label: 'Publications Google absentes',
      priority: 'optimisation',
      explanation: 'Les publications régulières signalent à Google une fiche active et améliorent la fraîcheur perçue, ce qui favorise le classement local.',
      impact: 'Impact modéré sur le classement local.',
      action: 'Publiez régulièrement des actualités, offres ou événements via Google Posts pour signaler une fiche active et améliorer votre visibilité.',
      expectedImpact: 'Une activité de publication régulière améliore la fraîcheur perçue de la fiche et son classement local.'
    });
  }

  if (fiche.qnaCompleted !== 'Oui') {
    weaknesses.push({
      key: 'qnaCompleted',
      label: 'Questions / réponses non complétées',
      priority: 'optimisation',
      explanation: 'Une section Questions/Réponses vide laisse les prospects sans réponses immédiates à leurs interrogations courantes, ce qui peut les faire hésiter.',
      impact: 'Impact faible à modéré sur la conversion.',
      action: 'Complétez la section Questions/Réponses avec les questions les plus fréquentes de vos clients pour lever les freins à la décision.',
      expectedImpact: 'Des réponses immédiates aux questions courantes lèvent des freins et facilitent la prise de contact.'
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
  const weaknesses = detectGoogleOptimizerWeaknesses(data.fiche, data.company);

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

function createGoogleOptimizerPlanCard(weakness) {
  const tone = googleOptimizerPriorityConfig.find((p) => p.key === weakness.priority).tone;
  const card = document.createElement('div');
  card.className = `card optimization-plan-card tone-${tone}`;
  card.innerHTML = `
    <div class="optimization-plan-flow">
      <div class="optimization-plan-step">
        <span class="step-label">Problème</span>
        <span class="step-text">${escapeGoogleOptimizerText(weakness.label)}</span>
      </div>
      <div class="optimization-plan-arrow">↓</div>
      <div class="optimization-plan-step">
        <span class="step-label">Pourquoi c’est important</span>
        <span class="step-text">${escapeGoogleOptimizerText(weakness.explanation)}</span>
      </div>
      <div class="optimization-plan-arrow">↓</div>
      <div class="optimization-plan-step">
        <span class="step-label">Comment le corriger</span>
        <span class="step-text">${escapeGoogleOptimizerText(weakness.action)}</span>
      </div>
      <div class="optimization-plan-arrow">↓</div>
      <div class="optimization-plan-step">
        <span class="step-label">Impact attendu</span>
        <span class="step-text">${escapeGoogleOptimizerText(weakness.expectedImpact)}</span>
      </div>
    </div>
  `;
  return card;
}

function refreshGoogleOptimizerPlanSection() {
  const section = document.getElementById('googleOptimizerPlan');
  if (!section) {
    return;
  }

  const data = getGoogleOptimizerData();
  const weaknesses = detectGoogleOptimizerWeaknesses(data.fiche, data.company);

  section.innerHTML = `
    <p class="eyebrow">Plan d’action</p>
    <h3>🛠 Plan d’optimisation</h3>
    <p>Une recommandation concrète pour chaque point faible détecté, adaptée au contexte de l’entreprise.</p>
  `;

  googleOptimizerPriorityConfig.forEach((priority) => {
    const subsection = document.createElement('div');
    subsection.className = 'analysis-subsection';

    const heading = document.createElement('h4');
    heading.textContent = priority.title;
    subsection.appendChild(heading);

    const items = weaknesses.filter((weakness) => weakness.priority === priority.key);
    if (!items.length) {
      const empty = document.createElement('p');
      empty.className = 'insight-empty';
      empty.textContent = `Aucune recommandation « ${priority.title} » nécessaire.`;
      subsection.appendChild(empty);
    } else {
      items.forEach((weakness) => {
        subsection.appendChild(createGoogleOptimizerPlanCard(weakness));
      });
    }

    section.appendChild(subsection);
  });
}

const googleOptimizerRoadmapPhaseConfig = [
  { priorityKey: 'urgent', days: '30', title: '30 jours', subtitle: 'Actions urgentes' },
  { priorityKey: 'important', days: '60', title: '60 jours', subtitle: 'Actions importantes' },
  { priorityKey: 'optimisation', days: '90', title: '90 jours', subtitle: 'Optimisations' }
];

function createGoogleOptimizerRoadmapItem(weakness) {
  const priorityInfo = googleOptimizerPriorityConfig.find((p) => p.key === weakness.priority);
  const el = document.createElement('div');
  el.className = `insight-item tone-${priorityInfo.tone}`;
  el.innerHTML = `
    <span class="insight-icon">📌</span>
    <span class="insight-text">
      <span class="roadmap-item-header">
        <strong>${escapeGoogleOptimizerText(weakness.label)}</strong>
        <span class="gauge-status-badge tone-${priorityInfo.tone}">${escapeGoogleOptimizerText(priorityInfo.title)}</span>
      </span><br>
      ${escapeGoogleOptimizerText(weakness.action)}<br>
      <em>Impact attendu : ${escapeGoogleOptimizerText(weakness.expectedImpact)}</em>
    </span>
  `;
  return el;
}

function createGoogleOptimizerRoadmapEmptyState() {
  const empty = document.createElement('p');
  empty.className = 'insight-empty';
  empty.textContent = 'Aucune action nécessaire à cette échéance.';
  return empty;
}

function refreshGoogleOptimizerRoadmapSection() {
  const section = document.getElementById('googleOptimizerRoadmap');
  if (!section) {
    return;
  }

  const data = getGoogleOptimizerData();
  const weaknesses = detectGoogleOptimizerWeaknesses(data.fiche, data.company);

  section.innerHTML = `
    <p class="eyebrow">Plan d’action</p>
    <h3>🗺 Roadmap Google Business 30 / 60 / 90 jours</h3>
    <p>Les actions sont réparties automatiquement selon leur degré d’urgence, du plus critique au plus long terme.</p>
    <div class="roadmap-grid">
      ${googleOptimizerRoadmapPhaseConfig.map((phase) => `
        <div class="roadmap-column">
          <p class="eyebrow">${phase.title}</p>
          <h4>${escapeGoogleOptimizerText(phase.subtitle)}</h4>
          <div class="insight-list" data-role="roadmap-list-${phase.days}"></div>
        </div>
      `).join('')}
    </div>
  `;

  googleOptimizerRoadmapPhaseConfig.forEach((phase) => {
    const list = section.querySelector(`[data-role="roadmap-list-${phase.days}"]`);
    const items = weaknesses.filter((weakness) => weakness.priority === phase.priorityKey);

    if (!items.length) {
      list.appendChild(createGoogleOptimizerRoadmapEmptyState());
      return;
    }

    items.forEach((weakness) => {
      list.appendChild(createGoogleOptimizerRoadmapItem(weakness));
    });
  });
}

const googleOptimizerFieldLabels = googleOptimizerFicheFieldsSchema.reduce((map, field) => {
  map[field.key] = field.label;
  return map;
}, {});

const googleOptimizerPotentialDimensions = [
  { key: 'visibilite', label: 'Visibilité', criteria: ['descriptionPresent', 'mainCategory', 'secondaryCategories', 'photosCount', 'videosCount', 'postsActive', 'qnaCompleted'] },
  { key: 'appels', label: 'Appels', criteria: ['phone', 'rating', 'reviewsCount'] },
  { key: 'clics', label: 'Clics vers le site', criteria: ['website', 'descriptionPresent', 'photosCount'] },
  { key: 'itineraires', label: 'Itinéraires', criteria: ['hours', 'mainCategory', 'rating', 'reviewsCount'] },
  { key: 'reservations', label: 'Réservations', criteria: ['bookingAvailable', 'menuAvailable', 'rating', 'reviewsCount'] }
];

const googleOptimizerPotentialLabelsWithArticle = {
  visibilite: 'de visibilité',
  appels: 'd’appels',
  clics: 'de clics vers le site',
  itineraires: 'd’itinéraires',
  reservations: 'de réservations'
};

function getGoogleOptimizerCriterionScore(fiche, key) {
  switch (key) {
    case 'rating':
      return Math.max(0, Math.min(100, (Number(fiche.rating) || 0) / 5 * 100));
    case 'reviewsCount':
      return getGoogleOptimizerBandedPoints(fiche.reviewsCount, [[100, 100], [50, 80], [20, 55], [5, 30]]);
    case 'photosCount':
      return getGoogleOptimizerBandedPoints(fiche.photosCount, [[20, 100], [10, 75], [5, 50], [1, 25]]);
    case 'videosCount':
      return getGoogleOptimizerBandedPoints(fiche.videosCount, [[5, 100], [1, 60]]);
    case 'descriptionPresent':
      return fiche.descriptionPresent === 'Oui' ? 100 : 0;
    case 'mainCategory':
      return String(fiche.mainCategory || '').trim() ? 100 : 0;
    case 'secondaryCategories':
      return String(fiche.secondaryCategories || '').trim() ? 100 : 0;
    case 'phone':
      return String(fiche.phone || '').trim() ? 100 : 0;
    case 'website':
      return String(fiche.website || '').trim() ? 100 : 0;
    case 'hours':
      return String(fiche.hours || '').trim() ? 100 : 0;
    case 'bookingAvailable':
      return fiche.bookingAvailable === 'Oui' ? 100 : 0;
    case 'menuAvailable':
      return fiche.menuAvailable === 'Oui' ? 100 : 0;
    case 'postsActive':
      return fiche.postsActive === 'Oui' ? 100 : 0;
    case 'qnaCompleted':
      return fiche.qnaCompleted === 'Oui' ? 100 : 0;
    default:
      return 0;
  }
}

function computeGoogleOptimizerDimensionPotential(fiche, criteriaKeys) {
  const scores = criteriaKeys.map((key) => getGoogleOptimizerCriterionScore(fiche, key));
  const average = scores.reduce((sum, value) => sum + value, 0) / scores.length;
  return Math.max(0, Math.min(100, 100 - average));
}

function getGoogleOptimizerPotentialLevel(potentialScore) {
  if (potentialScore >= 75) {
    return { label: 'Très élevé', tone: 'opportunity' };
  }
  if (potentialScore >= 50) {
    return { label: 'Élevé', tone: 'opportunity' };
  }
  if (potentialScore >= 25) {
    return { label: 'Moyen', tone: 'medium' };
  }
  return { label: 'Faible', tone: 'positive' };
}

function buildGoogleOptimizerPotentialComment(dimension, potentialScore, level, fiche) {
  const labelWithArticle = googleOptimizerPotentialLabelsWithArticle[dimension.key];
  const weakest = dimension.criteria
    .map((key) => ({ key, score: getGoogleOptimizerCriterionScore(fiche, key) }))
    .filter((item) => item.score < 75)
    .sort((a, b) => a.score - b.score)
    .slice(0, 2)
    .map((item) => googleOptimizerFieldLabels[item.key]);

  if (!weakest.length) {
    return `Le potentiel ${labelWithArticle} est ${level.label.toLowerCase()} (${Math.round(potentialScore)}/100) : les éléments qui l’influencent sont déjà bien renseignés, la marge de progression restante est limitée.`;
  }

  return `Le potentiel ${labelWithArticle} est ${level.label.toLowerCase()} (${Math.round(potentialScore)}/100) : des éléments comme ${weakest.join(' et ')} sont encore à travailler, ce qui représente une marge de progression réelle.`;
}

function computeGoogleOptimizerEstimates(potentials) {
  const visibilityPotential = potentials.find((p) => p.key === 'visibilite').score;
  const conversionKeys = ['appels', 'clics', 'itineraires', 'reservations'];
  const conversionScores = potentials.filter((p) => conversionKeys.includes(p.key)).map((p) => p.score);
  const conversionPotential = conversionScores.reduce((sum, value) => sum + value, 0) / conversionScores.length;

  const basket = 30;
  const visibilityGainPercent = Math.round((visibilityPotential / 100) * 80);
  const factor = conversionPotential / 100;
  const newClientsLow = factor > 0 ? Math.max(1, Math.round(factor * 10)) : 0;
  const newClientsHigh = factor > 0 ? Math.max(newClientsLow + 1, Math.round(factor * 30)) : 0;
  const revenueLow = newClientsLow * basket;
  const revenueHigh = newClientsHigh * basket;

  return { visibilityGainPercent, newClientsLow, newClientsHigh, revenueLow, revenueHigh, basket };
}

function createGoogleOptimizerPotentialCard(dimension, potentialScore, fiche) {
  const level = getGoogleOptimizerPotentialLevel(potentialScore);
  const labelWithArticle = googleOptimizerPotentialLabelsWithArticle[dimension.key];
  const comment = buildGoogleOptimizerPotentialComment(dimension, potentialScore, level, fiche);

  const card = document.createElement('div');
  card.className = 'card potential-card';
  card.innerHTML = `
    <div class="potential-card-header">
      <p class="eyebrow">Potentiel ${escapeGoogleOptimizerText(labelWithArticle)}</p>
      <span class="gauge-status-badge tone-${level.tone}">${level.label}</span>
    </div>
    <strong>${Math.round(potentialScore)}/100</strong>
    <p>${escapeGoogleOptimizerText(comment)}</p>
  `;
  return card;
}

function createGoogleOptimizerGlobalPotentialCard(globalPotential, potentials) {
  const level = getGoogleOptimizerPotentialLevel(globalPotential);
  const best = potentials.reduce((max, item) => (item.score > max.score ? item : max), potentials[0]);
  const bestLabelWithArticle = googleOptimizerPotentialLabelsWithArticle[best.key];
  const comment = `Le potentiel global de la fiche est ${level.label.toLowerCase()} (${Math.round(globalPotential)}/100), porté notamment par la marge de progression identifiée ${bestLabelWithArticle}. Plus la fiche actuelle est incomplète, plus la marge de progression estimée est importante.`;

  const card = document.createElement('div');
  card.className = 'card potential-card potential-card-commercial';
  card.innerHTML = `
    <div class="potential-card-header">
      <p class="eyebrow">Potentiel Google Business global</p>
      <span class="gauge-status-badge tone-${level.tone}">${level.label}</span>
    </div>
    <strong>${Math.round(globalPotential)}/100</strong>
    <p>${escapeGoogleOptimizerText(comment)}</p>
  `;
  return card;
}

function createGoogleOptimizerGainCard(icon, label, valueText) {
  const card = document.createElement('div');
  card.className = 'card kpi-card summary-card';
  card.innerHTML = `
    <span class="badge">${icon}</span>
    <p>${escapeGoogleOptimizerText(label)}</p>
    <strong>${escapeGoogleOptimizerText(valueText)}</strong>
  `;
  return card;
}

function refreshGoogleOptimizerPotentialSection() {
  const section = document.getElementById('googleOptimizerPotential');
  if (!section) {
    return;
  }

  const data = getGoogleOptimizerData();
  const potentials = googleOptimizerPotentialDimensions.map((dimension) => ({
    key: dimension.key,
    label: dimension.label,
    score: computeGoogleOptimizerDimensionPotential(data.fiche, dimension.criteria)
  }));
  const globalPotential = potentials.reduce((sum, p) => sum + p.score, 0) / potentials.length;
  const estimates = computeGoogleOptimizerEstimates(potentials);

  section.innerHTML = `
    <p class="eyebrow">Potentiel</p>
    <h3>📈 Potentiel Google Business</h3>
    <p>Cette section propose des estimations indicatives du potentiel de la fiche, calculées à partir des informations renseignées ci-dessus. Il ne s’agit pas de données Google réelles mais d’une projection destinée à orienter les priorités d’action.</p>
    <div class="potential-grid" data-role="potential-grid"></div>
    <div class="analysis-subsection">
      <h4>Estimation des gains potentiels</h4>
      <p class="notes-hint">Ces chiffres sont des estimations indicatives (panier moyen supposé de ${estimates.basket} €), elles ne constituent pas une prévision garantie.</p>
      <div class="kpi-grid summary-grid" data-role="gain-grid"></div>
    </div>
  `;

  const grid = section.querySelector('[data-role="potential-grid"]');
  googleOptimizerPotentialDimensions.forEach((dimension) => {
    const potential = potentials.find((p) => p.key === dimension.key);
    grid.appendChild(createGoogleOptimizerPotentialCard(dimension, potential.score, data.fiche));
  });
  grid.appendChild(createGoogleOptimizerGlobalPotentialCard(globalPotential, potentials));

  const gainGrid = section.querySelector('[data-role="gain-grid"]');
  gainGrid.appendChild(createGoogleOptimizerGainCard('👁', 'Visibilité supplémentaire estimée', `+${estimates.visibilityGainPercent} %`));
  gainGrid.appendChild(createGoogleOptimizerGainCard('👥', 'Nouveaux clients potentiels', `${estimates.newClientsLow} à ${estimates.newClientsHigh}`));
  gainGrid.appendChild(createGoogleOptimizerGainCard('💶', 'Chiffre d’affaires potentiel', `${estimates.revenueLow} € à ${estimates.revenueHigh} €`));
}

const GBO_PDF_COLORS = {
  primary: [110, 31, 50],
  primaryDark: [81, 21, 36],
  background: [244, 237, 227],
  muted: [246, 238, 228],
  text: [22, 22, 22],
  textSoft: [94, 85, 79],
  positive: [46, 125, 50],
  mediumTone: [224, 142, 45],
  negative: [198, 40, 40],
  opportunity: [124, 58, 237],
  white: [255, 255, 255]
};

const GBO_CONSULTANT_NAME_KEY = 'anavibe-tools-consultant-name';

const googleOptimizerStrengthNotes = {
  rating: 'Une bonne note Google renforce la confiance et le taux de clic depuis les résultats de recherche.',
  reviewsCount: 'Un volume d’avis suffisant renforce la crédibilité de la fiche et favorise son classement local.',
  photosCount: 'Une galerie de photos fournie rend la fiche attractive et inspire confiance.',
  videosCount: 'La présence de vidéos renforce l’engagement des visiteurs de la fiche.',
  descriptionPresent: 'La description est renseignée, ce qui clarifie l’offre pour les prospects et améliore le référencement local.',
  mainCategory: 'La catégorie principale est renseignée, ce qui permet à Google de positionner correctement la fiche.',
  secondaryCategories: 'Les catégories secondaires sont renseignées, ce qui élargit la visibilité sur des recherches complémentaires.',
  phone: 'Le numéro de téléphone est visible, ce qui facilite le contact direct depuis la fiche.',
  website: 'Le site internet est renseigné, ce qui permet de rediriger le trafic vers un canal de conversion.',
  hours: 'Les horaires sont renseignés, ce qui évite toute friction pour les prospects.',
  bookingAvailable: 'La réservation est disponible directement depuis la fiche, ce qui facilite la conversion.',
  menuAvailable: 'Le menu ou les prestations sont renseignés, ce qui aide le prospect à se décider rapidement.',
  postsActive: 'Les publications Google sont actives, ce qui signale une fiche vivante et à jour.',
  qnaCompleted: 'La section Questions/Réponses est complétée, ce qui lève les freins courants à la décision.'
};

function getGoogleOptimizerStrengths(fiche) {
  return googleOptimizerFicheFieldsSchema
    .map((field) => ({ key: field.key, label: field.label, score: getGoogleOptimizerCriterionScore(fiche, field.key) }))
    .filter((item) => item.score >= 75)
    .sort((a, b) => b.score - a.score);
}

function formatGboPdfDate(date) {
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function promptGboConsultantName() {
  const saved = localStorage.getItem(GBO_CONSULTANT_NAME_KEY) || '';
  const input = window.prompt('Nom du consultant AnaVibe (affiché sur le rapport) :', saved);
  if (input === null) {
    return saved || 'Équipe AnaVibe';
  }
  const trimmed = input.trim();
  const finalName = trimmed || 'Équipe AnaVibe';
  localStorage.setItem(GBO_CONSULTANT_NAME_KEY, finalName);
  return finalName;
}

function slugifyGboFilename(text) {
  const slug = String(text || 'google-business')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '');
  return slug || 'google-business';
}

function createGboPdfState(doc) {
  return {
    doc,
    marginLeft: 18,
    marginRight: 18,
    marginTop: 18,
    marginBottom: 20,
    pageWidth: 210,
    pageHeight: 297,
    cursorY: 18
  };
}

function ensureGboPdfSpace(state, needed) {
  const maxY = state.pageHeight - state.marginBottom;
  if (state.cursorY + needed > maxY) {
    state.doc.addPage();
    state.cursorY = state.marginTop;
  }
}

function addGboPdfSectionTitle(state, text) {
  ensureGboPdfSpace(state, 16);
  state.doc.setFont('helvetica', 'bold');
  state.doc.setFontSize(15);
  state.doc.setTextColor(...GBO_PDF_COLORS.primary);
  state.doc.text(text, state.marginLeft, state.cursorY);
  state.cursorY += 3;
  state.doc.setDrawColor(...GBO_PDF_COLORS.primary);
  state.doc.setLineWidth(0.6);
  state.doc.line(state.marginLeft, state.cursorY, state.pageWidth - state.marginRight, state.cursorY);
  state.cursorY += 8;
}

function addGboPdfSubTitle(state, text) {
  ensureGboPdfSpace(state, 10);
  state.doc.setFont('helvetica', 'bold');
  state.doc.setFontSize(11.5);
  state.doc.setTextColor(...GBO_PDF_COLORS.primaryDark);
  state.doc.text(text, state.marginLeft, state.cursorY);
  state.cursorY += 6;
}

function addGboPdfParagraph(state, text) {
  state.doc.setFont('helvetica', 'normal');
  state.doc.setFontSize(10);
  state.doc.setTextColor(...GBO_PDF_COLORS.text);
  const usableWidth = state.pageWidth - state.marginLeft - state.marginRight;
  const lines = state.doc.splitTextToSize(text, usableWidth);
  lines.forEach((line) => {
    ensureGboPdfSpace(state, 6);
    state.doc.text(line, state.marginLeft, state.cursorY);
    state.cursorY += 5.6;
  });
  state.cursorY += 3;
}

function addGboPdfBulletList(state, items) {
  state.doc.setFont('helvetica', 'normal');
  state.doc.setFontSize(10);
  const usableWidth = state.pageWidth - state.marginLeft - state.marginRight - 6;
  items.forEach((item) => {
    const lines = state.doc.splitTextToSize(item, usableWidth);
    ensureGboPdfSpace(state, 5.6 * lines.length);
    state.doc.setTextColor(...GBO_PDF_COLORS.primary);
    state.doc.text('-', state.marginLeft, state.cursorY);
    state.doc.setTextColor(...GBO_PDF_COLORS.text);
    lines.forEach((line) => {
      state.doc.text(line, state.marginLeft + 5, state.cursorY);
      state.cursorY += 5.6;
    });
  });
  state.cursorY += 3;
}

function addGboPdfFootersAndPageNumbers(doc, subjectLabel) {
  const pageCount = doc.internal.getNumberOfPages();
  for (let pageNumber = 2; pageNumber <= pageCount; pageNumber += 1) {
    doc.setPage(pageNumber);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...GBO_PDF_COLORS.textSoft);
    doc.text(`AnaVibe Tools — Google Business Optimizer PRO préparé pour ${subjectLabel}`, 18, 291);
    doc.text(`Page ${pageNumber - 1} / ${pageCount - 1}`, 210 - 18, 291, { align: 'right' });
  }
}

function createGboGaugeRingImage(value, colorRgb) {
  const size = 440;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 32;
  const lineWidth = 32;

  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(61, 31, 38, 0.12)';
  ctx.lineWidth = lineWidth;
  ctx.stroke();

  const clamped = Math.max(0, Math.min(100, value));
  if (clamped > 0) {
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (clamped / 100) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, endAngle, false);
    ctx.strokeStyle = `rgb(${colorRgb[0]}, ${colorRgb[1]}, ${colorRgb[2]})`;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }

  return canvas.toDataURL('image/png');
}

function addGboPdfGauge(state, x, yTop, diameterMm, value, colorRgb, label) {
  const dataUrl = createGboGaugeRingImage(value, colorRgb);
  state.doc.addImage(dataUrl, 'PNG', x, yTop, diameterMm, diameterMm);

  const centerX = x + diameterMm / 2;
  const centerY = yTop + diameterMm / 2;

  state.doc.setFont('helvetica', 'bold');
  state.doc.setFontSize(diameterMm * 0.85);
  state.doc.setTextColor(...GBO_PDF_COLORS.text);
  state.doc.text(`${Math.round(value)}`, centerX, centerY + diameterMm * 0.06, { align: 'center' });

  state.doc.setFont('helvetica', 'normal');
  state.doc.setFontSize(Math.max(7, diameterMm * 0.2));
  state.doc.setTextColor(...GBO_PDF_COLORS.textSoft);
  state.doc.text('/ 100', centerX, centerY + diameterMm * 0.26, { align: 'center' });

  if (label) {
    state.doc.setFont('helvetica', 'bold');
    state.doc.setFontSize(9.5);
    state.doc.setTextColor(...GBO_PDF_COLORS.primaryDark);
    state.doc.text(label, centerX, yTop + diameterMm + 7, { align: 'center', maxWidth: diameterMm + 24 });
  }
}

function createGboCriteriaBarChartImage(fiche) {
  const items = googleOptimizerFicheFieldsSchema.map((field) => ({
    label: field.label,
    score: getGoogleOptimizerCriterionScore(fiche, field.key)
  }));

  const width = 900;
  const rowHeight = 46;
  const paddingTop = 16;
  const paddingBottom = 16;
  const height = paddingTop + paddingBottom + rowHeight * items.length;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#fffdf8';
  ctx.fillRect(0, 0, width, height);

  const labelWidth = 240;
  const valueWidth = 90;
  const barMaxWidth = width - labelWidth - valueWidth;
  const barHeight = 20;

  items.forEach((item, index) => {
    const y = paddingTop + index * rowHeight + (rowHeight - barHeight) / 2;

    ctx.fillStyle = '#161616';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.label, 0, y + barHeight / 2);

    ctx.fillStyle = 'rgba(61, 31, 38, 0.1)';
    ctx.fillRect(labelWidth, y, barMaxWidth, barHeight);

    const clamped = Math.max(0, Math.min(100, item.score));
    const filledWidth = (clamped / 100) * barMaxWidth;
    const color = clamped >= 70 ? GBO_PDF_COLORS.positive : clamped >= 40 ? GBO_PDF_COLORS.mediumTone : GBO_PDF_COLORS.negative;
    ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    ctx.fillRect(labelWidth, y, filledWidth, barHeight);

    ctx.fillStyle = '#161616';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(`${Math.round(item.score)}/100`, labelWidth + barMaxWidth + 12, y + barHeight / 2);
  });
  ctx.textBaseline = 'alphabetic';

  return { dataUrl: canvas.toDataURL('image/png'), width, height };
}

function drawGboPdfCoverPage(doc, company, fiche, score, level, consultantName) {
  const pageWidth = 210;
  const pageHeight = 297;

  doc.setFillColor(...GBO_PDF_COLORS.background);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setFillColor(...GBO_PDF_COLORS.primary);
  doc.rect(0, 0, pageWidth, 8, 'F');
  doc.rect(0, pageHeight - 8, pageWidth, 8, 'F');

  doc.setFillColor(...GBO_PDF_COLORS.primary);
  doc.circle(38, 46, 12, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...GBO_PDF_COLORS.white);
  doc.text('A', 38, 50.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...GBO_PDF_COLORS.textSoft);
  doc.text('PLATEFORME PREMIUM', 56, 42);
  doc.setFontSize(19);
  doc.setTextColor(...GBO_PDF_COLORS.text);
  doc.text('AnaVibe Tools', 56, 51);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(...GBO_PDF_COLORS.primary);
  doc.text('Rapport Google Business', 18, 130);
  doc.setTextColor(...GBO_PDF_COLORS.text);
  doc.setFontSize(22);
  doc.text(getGoogleOptimizerCompanyLabel(company), 18, 144);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(...GBO_PDF_COLORS.textSoft);
  let infoY = 163;
  const infoLines = [`Score Google Business : ${Math.round(score)}/100 (${level.label})`, `Date de génération : ${formatGboPdfDate(new Date())}`, `Consultant AnaVibe : ${consultantName}`];
  if (company.sector) {
    infoLines.push(`Secteur d’activité : ${company.sector}`);
  }
  if (company.city) {
    infoLines.push(`Ville : ${company.city}`);
  }
  infoLines.forEach((line) => {
    const wrapped = doc.splitTextToSize(line, pageWidth - 36);
    wrapped.forEach((wrappedLine) => {
      doc.text(wrappedLine, 18, infoY);
      infoY += 9;
    });
  });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(...GBO_PDF_COLORS.primary);
  doc.text('Document préparé par AnaVibe, directement présentable au client.', 18, pageHeight - 20);
}

function buildGboPdfConclusion(company, score, level, globalPotential) {
  const companyLabel = getGoogleOptimizerCompanyLabel(company);
  const potentialLevel = getGoogleOptimizerPotentialLevel(globalPotential);

  let opening;
  if (score >= 85) {
    opening = `La fiche Google Business de ${companyLabel} est excellemment optimisée.`;
  } else if (score >= 70) {
    opening = `La fiche Google Business de ${companyLabel} est globalement bien optimisée.`;
  } else if (score >= 40) {
    opening = `La fiche Google Business de ${companyLabel} présente une optimisation moyenne, avec une marge de progression identifiable.`;
  } else {
    opening = `La fiche Google Business de ${companyLabel} nécessite une optimisation prioritaire.`;
  }

  return `${opening} Le score actuel est de ${Math.round(score)}/100 (${level.label}), pour un potentiel de progression global ${potentialLevel.label.toLowerCase()} (${Math.round(globalPotential)}/100). La mise en œuvre des actions prioritaires identifiées dans ce rapport, en particulier celles classées en urgence, permettra d’améliorer rapidement la visibilité et la performance commerciale de la fiche. L’équipe AnaVibe reste à disposition pour accompagner la mise en œuvre de ce plan d’action.`;
}

function generateGoogleOptimizerPdf() {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    window.alert('Le module de génération PDF n’a pas pu se charger. Rechargez la page et réessayez.');
    return;
  }

  const data = getGoogleOptimizerData();
  const consultantName = promptGboConsultantName();

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const score = computeGoogleOptimizerScore(data.fiche);
  const level = getGoogleOptimizerScoreLevel(score);

  drawGboPdfCoverPage(doc, data.company, data.fiche, score, level, consultantName);

  doc.addPage();
  const state = createGboPdfState(doc);

  addGboPdfSectionTitle(state, 'Score Google Business');
  addGboPdfParagraph(state, `Score calculé automatiquement à partir des informations renseignées sur la fiche de ${getGoogleOptimizerCompanyLabel(data.company)}.`);
  ensureGboPdfSpace(state, 60);
  addGboPdfGauge(state, state.marginLeft, state.cursorY, 42, score, GBO_PDF_COLORS[score >= 70 ? 'positive' : score >= 40 ? 'mediumTone' : 'negative'], level.label);
  state.cursorY += 58;

  addGboPdfSectionTitle(state, 'Graphique : détail par critère');
  const chart = createGboCriteriaBarChartImage(data.fiche);
  const chartWidthMm = state.pageWidth - state.marginLeft - state.marginRight;
  const chartHeightMm = (chart.height / chart.width) * chartWidthMm;
  ensureGboPdfSpace(state, chartHeightMm + 6);
  state.doc.addImage(chart.dataUrl, 'PNG', state.marginLeft, state.cursorY, chartWidthMm, chartHeightMm);
  state.cursorY += chartHeightMm + 8;

  doc.addPage();
  state.cursorY = state.marginTop;
  addGboPdfSectionTitle(state, 'Points forts');
  const strengths = getGoogleOptimizerStrengths(data.fiche);
  if (!strengths.length) {
    addGboPdfParagraph(state, 'Aucun point fort majeur ne se dégage encore : la majorité des critères analysés nécessite des améliorations.');
  } else {
    addGboPdfBulletList(state, strengths.map((item) => `${item.label} : ${googleOptimizerStrengthNotes[item.key]}`));
  }

  const weaknesses = detectGoogleOptimizerWeaknesses(data.fiche, data.company);

  addGboPdfSectionTitle(state, 'Points faibles');
  if (!weaknesses.length) {
    addGboPdfParagraph(state, 'Aucun point faible détecté : la fiche est déjà bien optimisée.');
  } else {
    googleOptimizerPriorityConfig.forEach((priority) => {
      const items = weaknesses.filter((weakness) => weakness.priority === priority.key);
      if (!items.length) {
        return;
      }
      addGboPdfSubTitle(state, priority.title);
      addGboPdfBulletList(state, items.map((item) => `${item.label} — ${item.explanation}`));
    });
  }

  doc.addPage();
  state.cursorY = state.marginTop;
  addGboPdfSectionTitle(state, 'Recommandations');
  if (!weaknesses.length) {
    addGboPdfParagraph(state, 'Aucune recommandation nécessaire : tous les critères analysés sont déjà bien maîtrisés.');
  } else {
    googleOptimizerPriorityConfig.forEach((priority) => {
      const items = weaknesses.filter((weakness) => weakness.priority === priority.key);
      if (!items.length) {
        return;
      }
      addGboPdfSubTitle(state, priority.title);
      addGboPdfBulletList(state, items.map((item) => item.action));
    });
  }

  addGboPdfSectionTitle(state, 'Roadmap 30 / 60 / 90 jours');
  const maxItemsPerPhase = 6;
  googleOptimizerRoadmapPhaseConfig.forEach((phase) => {
    const items = weaknesses.filter((weakness) => weakness.priority === phase.priorityKey);
    addGboPdfSubTitle(state, `${phase.title} — ${phase.subtitle}`);
    if (!items.length) {
      addGboPdfParagraph(state, 'Aucune action nécessaire à cette échéance.');
      return;
    }
    const visibleItems = items.slice(0, maxItemsPerPhase);
    addGboPdfBulletList(state, visibleItems.map((item) => `${item.label} : ${item.action}`));
    if (items.length > maxItemsPerPhase) {
      addGboPdfParagraph(state, `+ ${items.length - maxItemsPerPhase} autre(s) action(s) sur cette échéance.`);
    }
  });

  doc.addPage();
  state.cursorY = state.marginTop;
  addGboPdfSectionTitle(state, 'Potentiel commercial');
  const potentials = googleOptimizerPotentialDimensions.map((dimension) => ({
    key: dimension.key,
    label: dimension.label,
    score: computeGoogleOptimizerDimensionPotential(data.fiche, dimension.criteria)
  }));
  const globalPotential = potentials.reduce((sum, p) => sum + p.score, 0) / potentials.length;
  const estimates = computeGoogleOptimizerEstimates(potentials);

  addGboPdfParagraph(state, 'Ces potentiels sont des estimations indicatives calculées à partir des informations de la fiche : plus un élément est incomplet ou faible, plus la marge de progression estimée est importante.');

  ensureGboPdfSpace(state, 62);
  const gaugeDiameter = 30;
  const gaugeGap = (state.pageWidth - state.marginLeft - state.marginRight - gaugeDiameter * 5) / 4;
  potentials.forEach((potential, index) => {
    const x = state.marginLeft + index * (gaugeDiameter + gaugeGap);
    const potentialLevel = getGoogleOptimizerPotentialLevel(potential.score);
    const color = potentialLevel.tone === 'opportunity' ? GBO_PDF_COLORS.opportunity : potentialLevel.tone === 'medium' ? GBO_PDF_COLORS.mediumTone : GBO_PDF_COLORS.positive;
    addGboPdfGauge(state, x, state.cursorY, gaugeDiameter, potential.score, color, potential.label);
  });
  state.cursorY += gaugeDiameter + 16;

  addGboPdfSubTitle(state, 'Estimation des gains potentiels');
  addGboPdfParagraph(state, `Ces chiffres sont des estimations indicatives (panier moyen supposé de ${estimates.basket} €), elles ne constituent pas une prévision garantie.`);
  addGboPdfBulletList(state, [
    `Visibilité supplémentaire estimée : +${estimates.visibilityGainPercent} %`,
    `Nouveaux clients potentiels : ${estimates.newClientsLow} à ${estimates.newClientsHigh}`,
    `Chiffre d’affaires potentiel : ${estimates.revenueLow} € à ${estimates.revenueHigh} €`
  ]);

  addGboPdfSectionTitle(state, 'Conclusion');
  addGboPdfParagraph(state, buildGboPdfConclusion(data.company, score, level, globalPotential));

  addGboPdfFootersAndPageNumbers(doc, getGoogleOptimizerCompanyLabel(data.company));

  const dateStamp = new Date().toISOString().slice(0, 10);
  doc.save(`google-business-${slugifyGboFilename(data.company.name)}-${dateStamp}.pdf`);
}

document.addEventListener('DOMContentLoaded', () => {
  renderGoogleOptimizerCompanyForm();
  renderGboDashboardSection();
  renderGoogleOptimizerFicheForm();
  refreshGoogleOptimizerScoreSection();
  refreshGoogleOptimizerWeaknessesSection();
  refreshGoogleOptimizerPlanSection();
  refreshGoogleOptimizerRoadmapSection();
  refreshGoogleOptimizerPotentialSection();

  const pdfButton = document.getElementById('downloadGoogleOptimizerPdfBtn');
  if (pdfButton) {
    pdfButton.addEventListener('click', generateGoogleOptimizerPdf);
  }
});
