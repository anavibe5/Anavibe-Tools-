const CLIENT_IDS_KEY = 'anavibe-tools-client-ids';
const CLIENT_DATA_PREFIX = 'anavibe-tools-client-data-';

const actionStatusOptions = ['À faire', 'En cours', 'Terminé'];

const generalFieldsSchema = {
  key: 'general',
  eyebrow: 'Fiche client',
  title: 'Informations générales',
  fields: [
    { key: 'name', label: 'Nom', type: 'text' },
    { key: 'type', label: 'Type d’établissement', type: 'text' },
    { key: 'city', label: 'Ville', type: 'text' },
    { key: 'offer', label: 'Offre AnaVibe', type: 'text' },
    { key: 'startDate', label: 'Date début collaboration', type: 'date' },
    { key: 'mainGoal', label: 'Objectif principal', type: 'text' },
    {
      key: 'monthStatus',
      label: 'Statut du mois',
      type: 'select',
      options: ['À définir', 'En bonne voie', 'Objectif atteint', 'En retard']
    }
  ]
};

const initialSituationSchema = {
  key: 'initialSituation',
  eyebrow: 'Point de départ',
  title: 'Situation initiale',
  fields: [
    { key: 'googleRating', label: 'Note Google initiale', type: 'number', step: '0.1' },
    { key: 'googleReviews', label: 'Avis Google initiaux', type: 'number' },
    { key: 'googleViews', label: 'Vues Google initiales', type: 'number' },
    { key: 'googleCalls', label: 'Appels Google initiaux', type: 'number' },
    { key: 'googleDirections', label: 'Itinéraires initiaux', type: 'number' },
    { key: 'googleWebsiteClicks', label: 'Clics site initiaux', type: 'number' },
    { key: 'instagramFollowers', label: 'Abonnés Instagram initiaux', type: 'number' },
    { key: 'instagramReach', label: 'Portée Instagram initiale', type: 'number' },
    { key: 'instagramViews', label: 'Vues Instagram initiales', type: 'number' },
    { key: 'instagramInteractions', label: 'Interactions initiales', type: 'number' },
    { key: 'instagramProfileVisits', label: 'Visites profil initiales', type: 'number' },
    { key: 'instagramLinkClicks', label: 'Clics lien initiaux', type: 'number' }
  ]
};

// Maps a situation-initiale field to the monthly KPI it should be compared against.
const baselineFieldMap = {
  googleRating: { section: 'googleBusiness', field: 'rating' },
  googleReviews: { section: 'googleBusiness', field: 'reviewsCount' },
  googleViews: { section: 'googleBusiness', field: 'profileViews' },
  googleCalls: { section: 'googleBusiness', field: 'calls' },
  googleDirections: { section: 'googleBusiness', field: 'directions' },
  googleWebsiteClicks: { section: 'googleBusiness', field: 'websiteClicks' },
  instagramFollowers: { section: 'instagram', field: 'followers' },
  instagramReach: { section: 'instagram', field: 'reach' },
  instagramViews: { section: 'instagram', field: 'views' },
  instagramInteractions: { section: 'instagram', field: 'interactions' },
  instagramProfileVisits: { section: 'instagram', field: 'profileVisits' },
  instagramLinkClicks: { section: 'instagram', field: 'linkClicks' }
};

const monthlySectionSchema = [
  {
    key: 'googleBusiness',
    eyebrow: 'Réseaux & visibilité',
    title: 'Google Business',
    fields: [
      { key: 'rating', label: 'Note Google', type: 'number', step: '0.1' },
      { key: 'reviewsCount', label: 'Nombre d’avis', type: 'number' },
      { key: 'newReviews', label: 'Nouveaux avis', type: 'number' },
      { key: 'reviewsAnswered', label: 'Avis répondus', type: 'number' },
      { key: 'profileViews', label: 'Vues de la fiche', type: 'number' },
      { key: 'calls', label: 'Appels', type: 'number' },
      { key: 'directions', label: 'Itinéraires', type: 'number' },
      { key: 'websiteClicks', label: 'Clics vers le site', type: 'number' },
      { key: 'bookings', label: 'Réservations', type: 'number' },
      { key: 'photosPublished', label: 'Photos publiées', type: 'number' },
      { key: 'googlePosts', label: 'Publications Google', type: 'number' }
    ]
  },
  {
    key: 'instagram',
    eyebrow: 'Réseaux & visibilité',
    title: 'Instagram',
    fields: [
      { key: 'followers', label: 'Abonnés', type: 'number' },
      { key: 'newFollowers', label: 'Nouveaux abonnés', type: 'number' },
      { key: 'reach', label: 'Portée', type: 'number' },
      { key: 'impressions', label: 'Impressions', type: 'number' },
      { key: 'views', label: 'Vues', type: 'number' },
      { key: 'interactions', label: 'Interactions', type: 'number' },
      { key: 'engagementRate', label: 'Taux d’engagement', type: 'number', step: '0.1', unit: '%' },
      { key: 'profileVisits', label: 'Visites du profil', type: 'number' },
      { key: 'linkClicks', label: 'Clics sur le lien', type: 'number' },
      { key: 'posts', label: 'Publications', type: 'number' },
      { key: 'reels', label: 'Reels', type: 'number' },
      { key: 'stories', label: 'Stories', type: 'number' }
    ]
  },
  {
    key: 'facebook',
    eyebrow: 'Réseaux & visibilité',
    title: 'Facebook',
    fields: [
      { key: 'followers', label: 'Abonnés', type: 'number' },
      { key: 'reach', label: 'Portée', type: 'number' },
      { key: 'impressions', label: 'Impressions', type: 'number' },
      { key: 'interactions', label: 'Interactions', type: 'number' },
      { key: 'linkClicks', label: 'Clics lien', type: 'number' },
      { key: 'posts', label: 'Publications', type: 'number' }
    ]
  },
  {
    key: 'beacons',
    eyebrow: 'Réseaux & visibilité',
    title: 'Beacons',
    fields: [
      { key: 'bookingClicks', label: 'Clics réservation', type: 'number' },
      { key: 'phoneClicks', label: 'Clics téléphone', type: 'number' },
      { key: 'directionsClicks', label: 'Clics itinéraire', type: 'number' }
    ]
  },
  {
    key: 'businessResults',
    eyebrow: 'Performance',
    title: 'Résultats business',
    fields: [
      { key: 'bookingsGenerated', label: 'Réservations générées', type: 'number' },
      { key: 'estimatedRevenue', label: 'Chiffre d’affaires estimé', type: 'number', unit: '€' },
      { key: 'roi', label: 'ROI', type: 'number', step: '0.1', unit: 'x' },
      { key: 'goalReached', label: 'Objectif atteint', type: 'select', options: ['Non', 'Partiel', 'Oui'] },
      { key: 'remainingPotential', label: 'Potentiel restant', type: 'number', unit: '€' }
    ]
  }
];

function createEmptyInitialSituation() {
  return {
    googleRating: '',
    googleReviews: '',
    googleViews: '',
    googleCalls: '',
    googleDirections: '',
    googleWebsiteClicks: '',
    instagramFollowers: '',
    instagramReach: '',
    instagramViews: '',
    instagramInteractions: '',
    instagramProfileVisits: '',
    instagramLinkClicks: ''
  };
}

function createEmptyMonthData(label) {
  return {
    label,
    googleBusiness: {
      rating: '',
      reviewsCount: '',
      newReviews: '',
      reviewsAnswered: '',
      profileViews: '',
      calls: '',
      directions: '',
      websiteClicks: '',
      bookings: '',
      photosPublished: '',
      googlePosts: ''
    },
    instagram: {
      followers: '',
      newFollowers: '',
      reach: '',
      impressions: '',
      views: '',
      interactions: '',
      engagementRate: '',
      profileVisits: '',
      linkClicks: '',
      posts: '',
      reels: '',
      stories: ''
    },
    facebook: {
      followers: '',
      reach: '',
      impressions: '',
      interactions: '',
      linkClicks: '',
      posts: ''
    },
    beacons: {
      bookingClicks: '',
      phoneClicks: '',
      directionsClicks: ''
    },
    businessResults: {
      bookingsGenerated: '',
      estimatedRevenue: '',
      roi: '',
      goalReached: 'Non',
      remainingPotential: ''
    },
    monthlyObjectives: [],
    actionPlan: []
  };
}

const clientStrategicProfileFieldsSchema = {
  key: 'strategicProfile',
  eyebrow: 'Source de vérité client',
  title: '🧠 Profil Stratégique Client',
  fields: [
    { key: 'positioning', label: 'Positionnement', type: 'textarea' },
    { key: 'values', label: 'Valeurs', type: 'textarea' },
    { key: 'targetAudience', label: 'Clientèle cible', type: 'textarea' },
    { key: 'permanentGoals', label: 'Objectifs permanents', type: 'textarea' },
    { key: 'monthlyGoals', label: 'Objectifs mensuels', type: 'textarea' },
    { key: 'highlightedOfferings', label: 'Produits à mettre en avant', type: 'textarea' },
    { key: 'avoidedOfferings', label: 'Produits à éviter', type: 'textarea' },
    { key: 'communicationStyle', label: 'Style de communication', type: 'textarea' },
    { key: 'tone', label: 'Ton', type: 'textarea' },
    { key: 'constraints', label: 'Contraintes', type: 'textarea' },
    { key: 'usedNetworks', label: 'Réseaux utilisés', type: 'textarea' },
    { key: 'unusedNetworks', label: 'Réseaux volontairement non utilisés', type: 'textarea' },
    { key: 'keyMoments', label: 'Temps forts de l’année', type: 'textarea' },
    { key: 'events', label: 'Événements', type: 'textarea' },
    { key: 'decisionHistory', label: 'Historique des décisions', type: 'textarea' }
  ]
};

function createEmptyClientStrategicProfile() {
  const profile = {};
  clientStrategicProfileFieldsSchema.fields.forEach((field) => {
    profile[field.key] = '';
  });
  return profile;
}

// One-time migration from the short-lived "ADN du client" tab (merged just before this
// central Profil Stratégique layer): folds fields that no longer have a direct equivalent
// into Contraintes rather than silently discarding anything the consultant already typed.
function migrateClientDnaToStrategicProfile(oldDna) {
  if (!oldDna) {
    return null;
  }
  const legacyNotes = [
    oldDna.differentiation ? `Différenciation (ancien champ) : ${oldDna.differentiation}` : '',
    oldDna.qualityLevel ? `Niveau de gamme (ancien champ) : ${oldDna.qualityLevel}` : '',
    oldDna.graphicStyle ? `Style graphique (ancien champ) : ${oldDna.graphicStyle}` : ''
  ].filter(Boolean).join('\n');

  return {
    positioning: oldDna.positioning || '',
    values: oldDna.values || '',
    targetAudience: oldDna.targetAudience || '',
    permanentGoals: oldDna.commercialGoals || '',
    monthlyGoals: '',
    highlightedOfferings: oldDna.priorityOfferings || '',
    avoidedOfferings: oldDna.avoidedOfferings || '',
    communicationStyle: '',
    tone: oldDna.toneOfVoice || '',
    constraints: [oldDna.constraints, legacyNotes].filter(Boolean).join('\n'),
    usedNetworks: oldDna.usedNetworks || '',
    unusedNetworks: oldDna.unusedNetworks || '',
    keyMoments: oldDna.keyMoments || '',
    events: oldDna.events || '',
    decisionHistory: ''
  };
}

function createEmptyClientData(id, name) {
  return {
    id,
    general: {
      name,
      type: '',
      city: '',
      offer: '',
      startDate: '',
      mainGoal: '',
      monthStatus: 'À définir'
    },
    initialSituation: createEmptyInitialSituation(),
    strategicProfile: createEmptyClientStrategicProfile(),
    months: {},
    monthOrder: [],
    selectedMonth: null,
    internalNotes: '',
    caseStudyTestimonial: ''
  };
}

const clientSeedData = [
  {
    id: 'chez-boris',
    general: {
      name: 'Chez Boris',
      type: 'Restaurant',
      city: 'Lyon',
      offer: 'Pack Visibilité Locale',
      startDate: '2026-01-08',
      mainGoal: 'Booster la visibilité locale et structurer le suivi mensuel.',
      monthStatus: 'En bonne voie'
    },
    initialSituation: createEmptyInitialSituation(),
    strategicProfile: createEmptyClientStrategicProfile(),
    months: {},
    monthOrder: [],
    selectedMonth: null,
    internalNotes: '',
    caseStudyTestimonial: ''
  },
  {
    id: 'toast-tea',
    general: {
      name: 'Toast’Tea',
      type: 'Restauration / Lifestyle',
      city: 'Bordeaux',
      offer: 'Pack Contenu & Notoriété',
      startDate: '2026-02-01',
      mainGoal: 'Améliorer la notoriété et accélérer la production éditoriale.',
      monthStatus: 'Objectif atteint'
    },
    initialSituation: createEmptyInitialSituation(),
    strategicProfile: createEmptyClientStrategicProfile(),
    months: {},
    monthOrder: [],
    selectedMonth: null,
    internalNotes: '',
    caseStudyTestimonial: ''
  }
];

function getCurrentPath() {
  const path = window.location.pathname;
  return path.substring(path.lastIndexOf('/') + 1) || 'index.html';
}

function normalizeId(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function generateId() {
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]
  ));
}

function isLegacyClientData(data) {
  return Boolean(data) && !data.months && Boolean(data.googleBusiness || data.instagram);
}

function migrateLegacyClientData(data) {
  const monthKey = 'historique-initial';
  const emptyMonth = createEmptyMonthData('Historique');

  return {
    id: data.id,
    general: data.general,
    initialSituation: createEmptyInitialSituation(),
    strategicProfile: createEmptyClientStrategicProfile(),
    months: {
      [monthKey]: {
        label: 'Historique',
        googleBusiness: data.googleBusiness || emptyMonth.googleBusiness,
        instagram: data.instagram || emptyMonth.instagram,
        facebook: data.facebook || emptyMonth.facebook,
        beacons: data.beacons || emptyMonth.beacons,
        businessResults: data.businessResults || emptyMonth.businessResults,
        monthlyObjectives: data.monthlyObjectives || [],
        actionPlan: data.actionPlan || []
      }
    },
    monthOrder: [monthKey],
    selectedMonth: monthKey,
    internalNotes: data.internalNotes || ''
  };
}

function getClientIds() {
  const saved = localStorage.getItem(CLIENT_IDS_KEY);

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (error) {
      // fall through to reseed
    }
  }

  const ids = clientSeedData.map((client) => client.id);
  localStorage.setItem(CLIENT_IDS_KEY, JSON.stringify(ids));
  clientSeedData.forEach((client) => {
    localStorage.setItem(CLIENT_DATA_PREFIX + client.id, JSON.stringify(client));
  });
  return ids;
}

function saveClientIds(ids) {
  localStorage.setItem(CLIENT_IDS_KEY, JSON.stringify(ids));
}

const DEMO_DATA_RESET_FLAG_KEY = 'anavibe-tools-demo-reset-v1-done';
const DEMO_CLIENT_IDS = ['chez-boris', 'toast-tea'];

// One-time, unconditional purge of the old demo numbers (situation initiale,
// months, notes, testimonial) for the two pre-loaded clients. Runs once per
// browser regardless of the exact values currently stored, then flags itself
// done so it never runs again and never touches real data entered afterwards.
function resetDemoDataOnce() {
  if (localStorage.getItem(DEMO_DATA_RESET_FLAG_KEY)) {
    return;
  }

  DEMO_CLIENT_IDS.forEach((id) => {
    const saved = localStorage.getItem(CLIENT_DATA_PREFIX + id);
    if (!saved) {
      return;
    }
    try {
      const parsed = JSON.parse(saved);
      const reset = {
        ...parsed,
        initialSituation: createEmptyInitialSituation(),
        months: {},
        monthOrder: [],
        selectedMonth: null,
        internalNotes: '',
        caseStudyTestimonial: ''
      };
      localStorage.setItem(CLIENT_DATA_PREFIX + id, JSON.stringify(reset));
    } catch (error) {
      // malformed data: nothing to reset, leave it for the legacy-migration path
    }
  });

  localStorage.setItem(DEMO_DATA_RESET_FLAG_KEY, '1');
}

function getClientData(id) {
  const saved = localStorage.getItem(CLIENT_DATA_PREFIX + id);

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (isLegacyClientData(parsed)) {
        const migrated = migrateLegacyClientData(parsed);
        saveClientData(id, migrated);
        return migrated;
      }
      if (parsed.caseStudyTestimonial === undefined) {
        parsed.caseStudyTestimonial = '';
      }
      if (!parsed.strategicProfile) {
        parsed.strategicProfile = migrateClientDnaToStrategicProfile(parsed.clientDna) || createEmptyClientStrategicProfile();
        delete parsed.clientDna;
        saveClientData(id, parsed);
      }
      return parsed;
    } catch (error) {
      // fall through to seed/empty
    }
  }

  const seed = clientSeedData.find((client) => client.id === id);
  const data = seed || createEmptyClientData(id, id);
  localStorage.setItem(CLIENT_DATA_PREFIX + id, JSON.stringify(data));
  return data;
}

function saveClientData(id, data) {
  localStorage.setItem(CLIENT_DATA_PREFIX + id, JSON.stringify(data));
}

function setupMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');

  if (!toggle || !sidebar) {
    return;
  }

  const closeMenu = () => {
    sidebar.classList.remove('open');
    if (overlay) {
      overlay.classList.remove('visible');
    }
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const willOpen = !sidebar.classList.contains('open');
    sidebar.classList.toggle('open', willOpen);
    if (overlay) {
      overlay.classList.toggle('visible', willOpen);
    }
    toggle.setAttribute('aria-expanded', String(willOpen));
  });

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  sidebar.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

function highlightCurrentNav() {
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) {
      return;
    }

    const isActive = currentPath.endsWith(href) || currentPath.includes(href.replace('/index.html', ''));
    link.classList.toggle('active', isActive);
  });
}

function createFieldControl(sectionKey, field, monthKey) {
  const wrapper = document.createElement('label');
  wrapper.className = 'field-item';

  const labelSpan = document.createElement('span');
  labelSpan.textContent = field.label;
  wrapper.appendChild(labelSpan);

  let input;
  if (field.type === 'select') {
    input = document.createElement('select');
    input.className = 'field-input field-select';
    field.options.forEach((optionValue) => {
      const option = document.createElement('option');
      option.value = optionValue;
      option.textContent = optionValue;
      input.appendChild(option);
    });
  } else if (field.type === 'textarea') {
    input = document.createElement('textarea');
    input.className = 'field-input notes-textarea';
    input.rows = field.rows || 3;
  } else {
    input = document.createElement('input');
    input.className = 'field-input';
    input.type = field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text';
    if (field.step) {
      input.step = field.step;
    }
  }

  input.dataset.section = sectionKey;
  input.dataset.field = field.key;
  if (monthKey) {
    input.dataset.month = monthKey;
  }
  wrapper.appendChild(input);
  if (field.type === 'textarea') {
    wrapper.classList.add('idea-field-full');
  }
  return wrapper;
}

function renderFieldSection(section, monthKey) {
  const block = document.createElement('div');
  block.className = 'section-block';
  block.innerHTML = `
    <div class="section-heading">
      <div>
        <p class="eyebrow">${escapeHtml(section.eyebrow)}</p>
        <h3>${escapeHtml(section.title)}</h3>
      </div>
    </div>
    <div class="field-grid"></div>
  `;

  const grid = block.querySelector('.field-grid');
  section.fields.forEach((field) => {
    grid.appendChild(createFieldControl(section.key, field, monthKey));
  });

  return block;
}

function fillFieldValues(scopeEl, dataScope) {
  scopeEl.querySelectorAll('.field-input[data-section]').forEach((input) => {
    const { section, field } = input.dataset;
    const value = dataScope[section] ? dataScope[section][field] : undefined;
    input.value = value === undefined || value === null ? '' : value;
  });
}

function formatNumber(value) {
  // Uses a plain space rather than toLocaleString's narrow no-break space (U+202F),
  // which the PDF export's core font cannot render.
  const rounded = Math.round(Number(value) * 100) / 100;
  const [integerPart, decimalPart] = Math.abs(rounded).toString().split('.');
  const groupedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const sign = rounded < 0 ? '-' : '';
  return decimalPart ? `${sign}${groupedInteger},${decimalPart}` : `${sign}${groupedInteger}`;
}

function unitSuffix(unit) {
  if (unit === '€') {
    return ' €';
  }
  if (unit === 'x') {
    return 'x';
  }
  if (unit === '%') {
    return '%';
  }
  return '';
}

function formatValue(value, unit) {
  if (value === '' || value === null || value === undefined || Number.isNaN(Number(value))) {
    return '—';
  }
  return `${formatNumber(value)}${unitSuffix(unit)}`;
}

function computeEvolution(reference, current) {
  const refValid = reference !== '' && reference !== null && reference !== undefined && !Number.isNaN(Number(reference));
  const curValid = current !== '' && current !== null && current !== undefined && !Number.isNaN(Number(current));

  if (!refValid || !curValid) {
    return { diff: null, percent: null };
  }

  const refNum = Number(reference);
  const curNum = Number(current);
  const diff = curNum - refNum;
  const percent = refNum !== 0 ? (diff / Math.abs(refNum)) * 100 : null;
  return { diff, percent };
}

function formatEvolution(evolution, unit) {
  if (evolution.diff === null) {
    return { text: '—', badgeClass: 'neutral' };
  }

  const diffText = `${evolution.diff > 0 ? '+' : ''}${formatNumber(evolution.diff)}${unitSuffix(unit)}`;
  const percentText = evolution.percent === null ? '' : ` (${evolution.percent > 0 ? '+' : ''}${evolution.percent.toFixed(1)}%)`;
  const badgeClass = evolution.diff > 0 ? 'positive' : evolution.diff < 0 ? 'negative' : 'neutral';
  return { text: `${diffText}${percentText}`, badgeClass };
}

function getBaselineValue(initialSituation, sectionKey, fieldKey) {
  const entry = Object.entries(baselineFieldMap).find(
    ([, ref]) => ref.section === sectionKey && ref.field === fieldKey
  );
  return entry ? initialSituation[entry[0]] : '';
}

function createComparisonRow(field, values) {
  const row = document.createElement('tr');

  const vsInitial = computeEvolution(values.initial, values.current);
  const vsPrevious = computeEvolution(values.previous, values.current);
  const initialFmt = formatEvolution(vsInitial, values.unit);
  const previousFmt = formatEvolution(vsPrevious, values.unit);

  row.innerHTML = `
    <td>${escapeHtml(field.label)}</td>
    <td>${formatValue(values.initial, values.unit)}</td>
    <td>${formatValue(values.previous, values.unit)}</td>
    <td class="comparison-current">${formatValue(values.current, values.unit)}</td>
    <td><span class="evolution-badge ${initialFmt.badgeClass}">${initialFmt.text}</span></td>
    <td><span class="evolution-badge ${previousFmt.badgeClass}">${previousFmt.text}</span></td>
  `;
  return row;
}

function renderMonthlyFieldSection(section, monthKey, monthData) {
  const block = renderFieldSection(section, monthKey);
  fillFieldValues(block, monthData);
  return block;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function sumOrNull(values) {
  const provided = values.filter((value) => value !== '' && value !== null && value !== undefined);
  if (!provided.length) {
    return null;
  }
  return values.reduce((total, value) => {
    const numeric = value === '' || value === null || value === undefined || Number.isNaN(Number(value)) ? 0 : Number(value);
    return total + numeric;
  }, 0);
}

function computeIntentionsFromMonth(monthData) {
  if (!monthData) {
    return null;
  }
  return sumOrNull([
    monthData.googleBusiness.calls,
    monthData.googleBusiness.websiteClicks,
    monthData.googleBusiness.directions,
    monthData.beacons.bookingClicks,
    monthData.beacons.phoneClicks,
    monthData.beacons.directionsClicks
  ]);
}

function computeIntentionsFromInitial(initialSituation) {
  return sumOrNull([
    initialSituation.googleCalls,
    initialSituation.googleWebsiteClicks,
    initialSituation.googleDirections
  ]);
}

function computeEngagementRate(monthData) {
  if (!monthData) {
    return null;
  }
  const interactions = monthData.instagram.interactions;
  const reach = monthData.instagram.reach;
  if (interactions === '' || interactions === null || interactions === undefined) {
    return null;
  }
  if (reach === '' || reach === null || reach === undefined || Number(reach) === 0) {
    return null;
  }
  return (Number(interactions) / Number(reach)) * 100;
}

function computeEngagementRateFromInitial(initialSituation) {
  const interactions = initialSituation.instagramInteractions;
  const reach = initialSituation.instagramReach;
  if (interactions === '' || interactions === null || interactions === undefined) {
    return null;
  }
  if (reach === '' || reach === null || reach === undefined || Number(reach) === 0) {
    return null;
  }
  return (Number(interactions) / Number(reach)) * 100;
}

function computeObjectivesRate(monthData) {
  if (!monthData || !monthData.monthlyObjectives.length) {
    return null;
  }
  const done = monthData.monthlyObjectives.filter((objective) => objective.done).length;
  return (done / monthData.monthlyObjectives.length) * 100;
}

function computeActionCompletionRate(monthData) {
  if (!monthData || !monthData.actionPlan.length) {
    return null;
  }
  const done = monthData.actionPlan.filter((action) => action.status === 'Terminé').length;
  return (done / monthData.actionPlan.length) * 100;
}

const googleScoreFields = [
  ['googleBusiness', 'rating'],
  ['googleBusiness', 'reviewsCount'],
  ['googleBusiness', 'profileViews'],
  ['googleBusiness', 'calls'],
  ['googleBusiness', 'directions'],
  ['googleBusiness', 'websiteClicks']
];

const instagramScoreFields = [
  ['instagram', 'followers'],
  ['instagram', 'reach'],
  ['instagram', 'interactions'],
  ['instagram', 'profileVisits'],
  ['instagram', 'linkClicks']
];

const beaconsScoreFields = [
  ['beacons', 'bookingClicks'],
  ['beacons', 'phoneClicks'],
  ['beacons', 'directionsClicks']
];

function averagePercentEvolution(fieldPairs, monthData, previousMonthData) {
  if (!previousMonthData) {
    return null;
  }
  const percents = fieldPairs
    .map(([section, field]) => computeEvolution(previousMonthData[section][field], monthData[section][field]).percent)
    .filter((percent) => percent !== null && !Number.isNaN(percent));

  if (!percents.length) {
    return null;
  }
  return percents.reduce((total, percent) => total + percent, 0) / percents.length;
}

function scoreFromEvolutionPercent(percent) {
  if (percent === null || percent === undefined || Number.isNaN(percent)) {
    return 50;
  }
  return clamp(50 + percent, 0, 100);
}

function computeGlobalScore(monthData, previousMonthData) {
  const googlePercent = averagePercentEvolution(googleScoreFields, monthData, previousMonthData);
  const instagramPercent = averagePercentEvolution(instagramScoreFields, monthData, previousMonthData);

  const intentionsCurrent = computeIntentionsFromMonth(monthData);
  const intentionsPrevious = previousMonthData ? computeIntentionsFromMonth(previousMonthData) : null;
  const intentionsPercent = computeEvolution(intentionsPrevious, intentionsCurrent).percent;

  const objectivesRate = computeObjectivesRate(monthData);
  const actionsRate = computeActionCompletionRate(monthData);

  const components = [
    scoreFromEvolutionPercent(googlePercent),
    scoreFromEvolutionPercent(instagramPercent),
    scoreFromEvolutionPercent(intentionsPercent),
    objectivesRate === null ? 50 : objectivesRate,
    actionsRate === null ? 50 : actionsRate
  ];

  const average = components.reduce((total, value) => total + value, 0) / components.length;
  return Math.round(clamp(average, 0, 100));
}

function getScoreBadge(score) {
  if (score < 50) {
    return { label: 'À surveiller', badgeClass: 'negative' };
  }
  if (score < 70) {
    return { label: 'En progression', badgeClass: 'neutral' };
  }
  if (score < 85) {
    return { label: 'Très bon mois', badgeClass: 'positive' };
  }
  return { label: 'Excellent mois', badgeClass: 'positive' };
}

function createEvolutionSummaryCard(label, percent) {
  const card = document.createElement('div');
  card.className = 'kpi-card card summary-card';
  const hasValue = percent !== null && percent !== undefined && !Number.isNaN(percent);
  const badgeClass = !hasValue ? 'neutral' : percent > 0 ? 'positive' : percent < 0 ? 'negative' : 'neutral';
  const valueText = hasValue ? `${percent > 0 ? '+' : ''}${percent.toFixed(1)}%` : '—';
  card.innerHTML = `
    <span class="kpi-label">${escapeHtml(label)}</span>
    <strong>${valueText}</strong>
    <span class="evolution-badge ${badgeClass}">vs mois précédent</span>
  `;
  return card;
}

function createIntentionsSummaryCard(current, evolution) {
  const card = document.createElement('div');
  card.className = 'kpi-card card summary-card';
  const fmt = formatEvolution(evolution, '');
  card.innerHTML = `
    <span class="kpi-label">Intentions clients générées</span>
    <strong>${current === null ? '—' : formatNumber(current)}</strong>
    <span class="evolution-badge ${fmt.badgeClass}">${fmt.text} vs mois précédent</span>
  `;
  return card;
}

function createObjectivesSummaryCard(done, total, rate) {
  const card = document.createElement('div');
  card.className = 'kpi-card card summary-card';
  const badgeClass = rate === null ? 'neutral' : rate >= 70 ? 'positive' : rate >= 40 ? 'neutral' : 'negative';
  const rateText = rate === null ? 'Aucun objectif' : `${Math.round(rate)}% atteints`;
  card.innerHTML = `
    <span class="kpi-label">Objectifs atteints</span>
    <strong>${total ? `${done}/${total}` : '—'}</strong>
    <span class="evolution-badge ${badgeClass}">${escapeHtml(rateText)}</span>
  `;
  return card;
}

function createScoreSummaryCard(score, badge) {
  const card = document.createElement('div');
  card.className = 'kpi-card card summary-card';
  card.innerHTML = `
    <span class="kpi-label">Score global du mois</span>
    <strong>${score}/100</strong>
    <span class="evolution-badge ${badge.badgeClass}">${escapeHtml(badge.label)}</span>
  `;
  return card;
}

function renderSummaryCards(monthData, previousMonthData, initialSituation) {
  const grid = document.createElement('div');
  grid.className = 'kpi-grid summary-grid';

  const googlePercent = averagePercentEvolution(googleScoreFields, monthData, previousMonthData);
  const instagramPercent = averagePercentEvolution(instagramScoreFields, monthData, previousMonthData);
  const beaconsPercent = averagePercentEvolution(beaconsScoreFields, monthData, previousMonthData);

  const intentionsCurrent = computeIntentionsFromMonth(monthData);
  const intentionsPrevious = previousMonthData ? computeIntentionsFromMonth(previousMonthData) : null;
  const intentionsEvolution = computeEvolution(intentionsPrevious, intentionsCurrent);

  const objectivesDone = monthData.monthlyObjectives.filter((objective) => objective.done).length;
  const objectivesTotal = monthData.monthlyObjectives.length;
  const objectivesRate = computeObjectivesRate(monthData);

  const score = computeGlobalScore(monthData, previousMonthData);
  const scoreBadge = getScoreBadge(score);

  grid.appendChild(createEvolutionSummaryCard('Évolution Google Business', googlePercent));
  grid.appendChild(createEvolutionSummaryCard('Évolution Instagram', instagramPercent));
  grid.appendChild(createEvolutionSummaryCard('Évolution Beacons', beaconsPercent));
  grid.appendChild(createIntentionsSummaryCard(intentionsCurrent, intentionsEvolution));
  grid.appendChild(createObjectivesSummaryCard(objectivesDone, objectivesTotal, objectivesRate));
  grid.appendChild(createScoreSummaryCard(score, scoreBadge));

  return grid;
}

const synthesisRowConfigs = [
  { label: 'Avis Google', section: 'googleBusiness', field: 'reviewsCount' },
  { label: 'Note Google', section: 'googleBusiness', field: 'rating' },
  { label: 'Vues Google', section: 'googleBusiness', field: 'profileViews' },
  { label: 'Appels Google', section: 'googleBusiness', field: 'calls' },
  { label: 'Itinéraires Google', section: 'googleBusiness', field: 'directions' },
  { label: 'Abonnés Instagram', section: 'instagram', field: 'followers' },
  { label: 'Portée Instagram', section: 'instagram', field: 'reach' },
  { label: 'Interactions Instagram', section: 'instagram', field: 'interactions' },
  { label: 'Taux d’engagement', unit: '%', compute: computeEngagementRate, computeInitial: computeEngagementRateFromInitial },
  { label: 'Clics lien', section: 'instagram', field: 'linkClicks' },
  { label: 'Clics réservation Beacons', section: 'beacons', field: 'bookingClicks' },
  { label: 'Intentions clients', compute: computeIntentionsFromMonth, computeInitial: computeIntentionsFromInitial }
];

function getSynthesisRowValues(rowConfig, monthData, previousMonthData, initialSituation) {
  if (rowConfig.compute) {
    return {
      current: rowConfig.compute(monthData),
      previous: previousMonthData ? rowConfig.compute(previousMonthData) : null,
      initial: rowConfig.computeInitial ? rowConfig.computeInitial(initialSituation) : null
    };
  }

  return {
    current: monthData[rowConfig.section][rowConfig.field],
    previous: previousMonthData ? previousMonthData[rowConfig.section][rowConfig.field] : '',
    initial: getBaselineValue(initialSituation, rowConfig.section, rowConfig.field)
  };
}

function renderSynthesisSection(monthData, previousMonthData, initialSituation) {
  const block = document.createElement('div');
  block.className = 'section-block';
  block.innerHTML = `
    <div class="section-heading">
      <div>
        <p class="eyebrow">Vue d’ensemble</p>
        <h3>Tableau de synthèse</h3>
      </div>
    </div>
  `;

  const wrapper = document.createElement('div');
  wrapper.className = 'comparison-scroll';

  const table = document.createElement('table');
  table.className = 'comparison-table';
  table.innerHTML = `
    <thead>
      <tr>
        <th>Indicateur</th>
        <th>Initial</th>
        <th>Mois précédent</th>
        <th>Mois sélectionné</th>
        <th>Évolution vs initial</th>
        <th>Évolution vs mois précédent</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = table.querySelector('tbody');
  synthesisRowConfigs.forEach((rowConfig) => {
    const values = getSynthesisRowValues(rowConfig, monthData, previousMonthData, initialSituation);
    tbody.appendChild(
      createComparisonRow(
        { label: rowConfig.label },
        { initial: values.initial, previous: values.previous, current: values.current, unit: rowConfig.unit }
      )
    );
  });

  wrapper.appendChild(table);
  block.appendChild(wrapper);
  return block;
}

function hasValue(value) {
  return value !== '' && value !== null && value !== undefined && !Number.isNaN(Number(value));
}

function monthHasAnyData(monthData) {
  return ['googleBusiness', 'instagram', 'facebook', 'beacons'].some((section) =>
    Object.values(monthData[section]).some((value) => hasValue(value))
  );
}

function formatSignedPercent(percent) {
  return `${percent > 0 ? '+' : ''}${percent.toFixed(1)}%`;
}

function joinWithAnd(parts) {
  if (parts.length <= 1) {
    return parts.join('');
  }
  return `${parts.slice(0, -1).join(', ')} et ${parts[parts.length - 1]}`;
}

function describeTrend(percent) {
  if (percent === null || percent === undefined || Number.isNaN(percent)) {
    return 'sans comparaison disponible pour ce mois';
  }
  if (percent >= 20) {
    return 'en forte progression';
  }
  if (percent >= 8) {
    return 'en bonne progression';
  }
  if (percent > 0) {
    return 'en légère progression';
  }
  if (percent === 0) {
    return 'en stagnation';
  }
  if (percent > -8) {
    return 'en léger recul';
  }
  return 'en net recul';
}

const facebookFieldsForInsights = [
  ['facebook', 'followers'],
  ['facebook', 'reach'],
  ['facebook', 'impressions'],
  ['facebook', 'interactions'],
  ['facebook', 'linkClicks'],
  ['facebook', 'posts']
];

const allInsightFields = [...googleScoreFields, ...instagramScoreFields, ...facebookFieldsForInsights, ...beaconsScoreFields];

const insightFieldLabels = {
  'googleBusiness.rating': 'La note Google',
  'googleBusiness.reviewsCount': 'Le nombre d’avis Google',
  'googleBusiness.profileViews': 'Les vues de la fiche Google',
  'googleBusiness.calls': 'Les appels Google',
  'googleBusiness.directions': 'Les demandes d’itinéraire Google',
  'googleBusiness.websiteClicks': 'Les clics vers le site',
  'instagram.followers': 'Les abonnés Instagram',
  'instagram.reach': 'La portée Instagram',
  'instagram.interactions': 'Les interactions Instagram',
  'instagram.profileVisits': 'Les visites de profil Instagram',
  'instagram.linkClicks': 'Les clics sur le lien Instagram',
  'facebook.followers': 'Les abonnés Facebook',
  'facebook.reach': 'La portée Facebook',
  'facebook.impressions': 'Les impressions Facebook',
  'facebook.interactions': 'Les interactions Facebook',
  'facebook.linkClicks': 'Les clics lien Facebook',
  'facebook.posts': 'Les publications Facebook',
  'beacons.bookingClicks': 'Les clics réservation Beacons',
  'beacons.phoneClicks': 'Les clics téléphone Beacons',
  'beacons.directionsClicks': 'Les clics itinéraire Beacons'
};

function collectFieldEvolutions(monthData, previousMonthData, fieldPairs) {
  if (!previousMonthData) {
    return [];
  }
  return fieldPairs
    .map(([section, field]) => {
      const evolution = computeEvolution(previousMonthData[section][field], monthData[section][field]);
      return { section, field, label: insightFieldLabels[`${section}.${field}`] || field, ...evolution };
    })
    .filter((item) => item.percent !== null && !Number.isNaN(item.percent));
}

function generateExecutiveSummary(ctx) {
  const name = ctx.generalData?.name || 'Ce client';
  const sentences = [];

  sentences.push(
    `En ${ctx.monthLabel}, ${name} obtient un score global de ${ctx.score}/100, ce qui correspond à un mois « ${ctx.scoreBadge.label.toLowerCase()} ».`
  );

  const { best, worst } = ctx.evolutions;
  if (best) {
    sentences.push(`Le point fort du mois est : ${best.label}, ${describeTrend(best.percent)} (${formatSignedPercent(best.percent)}).`);
  }
  if (worst && worst.percent < 0 && (!best || worst.field !== best.field)) {
    sentences.push(
      `À l’inverse, un point de vigilance : ${worst.label}, ${describeTrend(worst.percent)} (${formatSignedPercent(worst.percent)}), qui mérite une attention particulière.`
    );
  }

  sentences.push(ctx.objectivesSentence);

  return sentences.join(' ');
}

function generateGoogleAnalysis(monthData, previousMonthData) {
  const gb = monthData.googleBusiness;
  const prevGb = previousMonthData ? previousMonthData.googleBusiness : null;
  const sentences = [];

  const ratingEvo = prevGb ? computeEvolution(prevGb.rating, gb.rating) : { percent: null };
  const reviewsEvo = prevGb ? computeEvolution(prevGb.reviewsCount, gb.reviewsCount) : { percent: null };
  const viewsEvo = prevGb ? computeEvolution(prevGb.profileViews, gb.profileViews) : { percent: null };
  const callsEvo = prevGb ? computeEvolution(prevGb.calls, gb.calls) : { percent: null };
  const directionsEvo = prevGb ? computeEvolution(prevGb.directions, gb.directions) : { percent: null };
  const clicksEvo = prevGb ? computeEvolution(prevGb.websiteClicks, gb.websiteClicks) : { percent: null };

  if (hasValue(gb.rating)) {
    sentences.push(
      `La note Google est ${describeTrend(ratingEvo.percent)}${ratingEvo.percent !== null ? ` (${formatSignedPercent(ratingEvo.percent)})` : ''}, actuellement à ${gb.rating}/5.`
    );
  }

  if (hasValue(gb.reviewsCount)) {
    let reviewSentence = `Le volume d’avis est ${describeTrend(reviewsEvo.percent)}${reviewsEvo.percent !== null ? ` (${formatSignedPercent(reviewsEvo.percent)})` : ''}, avec ${gb.reviewsCount} avis au total`;
    if (hasValue(gb.newReviews)) {
      reviewSentence += ` dont ${gb.newReviews} nouveaux ce mois-ci`;
    }
    sentences.push(`${reviewSentence}.`);
  }

  if (hasValue(gb.newReviews) && hasValue(gb.reviewsAnswered) && Number(gb.newReviews) > 0) {
    const responseRate = (Number(gb.reviewsAnswered) / Number(gb.newReviews)) * 100;
    sentences.push(`Le taux de réponse aux nouveaux avis est de ${Math.round(responseRate)}% (${gb.reviewsAnswered}/${gb.newReviews}).`);
  }

  const visibilityParts = [];
  if (viewsEvo.percent !== null) {
    visibilityParts.push(`les vues de la fiche sont ${describeTrend(viewsEvo.percent)} (${formatSignedPercent(viewsEvo.percent)})`);
  }
  if (callsEvo.percent !== null) {
    visibilityParts.push(`les appels sont ${describeTrend(callsEvo.percent)} (${formatSignedPercent(callsEvo.percent)})`);
  }
  if (directionsEvo.percent !== null) {
    visibilityParts.push(`les demandes d’itinéraire sont ${describeTrend(directionsEvo.percent)} (${formatSignedPercent(directionsEvo.percent)})`);
  }
  if (clicksEvo.percent !== null) {
    visibilityParts.push(`les clics vers le site sont ${describeTrend(clicksEvo.percent)} (${formatSignedPercent(clicksEvo.percent)})`);
  }
  if (visibilityParts.length) {
    sentences.push(`Sur le plan de la visibilité, ${joinWithAnd(visibilityParts)}.`);
  }

  if (hasValue(gb.bookings)) {
    const count = Number(gb.bookings);
    sentences.push(`${count} réservation${count > 1 ? 's ont' : ' a'} été enregistrée${count > 1 ? 's' : ''} via Google Business ce mois-ci.`);
  }

  if (!sentences.length) {
    return 'Aucune donnée Google Business n’a encore été saisie pour ce mois.';
  }

  return sentences.join(' ');
}

function generateInstagramAnalysis(monthData, previousMonthData) {
  const ig = monthData.instagram;
  const prevIg = previousMonthData ? previousMonthData.instagram : null;
  const sentences = [];

  const followersEvo = prevIg ? computeEvolution(prevIg.followers, ig.followers) : { percent: null };
  const reachEvo = prevIg ? computeEvolution(prevIg.reach, ig.reach) : { percent: null };
  const linkClicksEvo = prevIg ? computeEvolution(prevIg.linkClicks, ig.linkClicks) : { percent: null };

  if (hasValue(ig.followers)) {
    sentences.push(
      `La communauté Instagram est ${describeTrend(followersEvo.percent)}${followersEvo.percent !== null ? ` (${formatSignedPercent(followersEvo.percent)})` : ''}, avec ${formatNumber(ig.followers)} abonnés${hasValue(ig.newFollowers) ? ` dont ${ig.newFollowers} nouveaux ce mois-ci` : ''}.`
    );
  }

  if (hasValue(ig.reach)) {
    sentences.push(
      `La portée est ${describeTrend(reachEvo.percent)}${reachEvo.percent !== null ? ` (${formatSignedPercent(reachEvo.percent)})` : ''}, pour ${formatNumber(ig.reach)} comptes touchés.`
    );
  }

  const engagementRate = computeEngagementRate(monthData);
  const prevEngagementRate = previousMonthData ? computeEngagementRate(previousMonthData) : null;
  if (engagementRate !== null) {
    const engagementEvo = computeEvolution(prevEngagementRate, engagementRate);
    sentences.push(
      `Le taux d’engagement calculé (interactions / portée) est de ${engagementRate.toFixed(1)}%${engagementEvo.percent !== null ? `, ${describeTrend(engagementEvo.percent)} par rapport au mois précédent (${formatSignedPercent(engagementEvo.percent)})` : ''}.`
    );
  }

  const volumeParts = [];
  if (hasValue(ig.posts)) {
    volumeParts.push(`${ig.posts} publication${Number(ig.posts) > 1 ? 's' : ''}`);
  }
  if (hasValue(ig.reels)) {
    volumeParts.push(`${ig.reels} reel${Number(ig.reels) > 1 ? 's' : ''}`);
  }
  if (hasValue(ig.stories)) {
    volumeParts.push(`${ig.stories} story/stories`);
  }
  if (volumeParts.length) {
    sentences.push(`Le rythme de publication du mois représente ${joinWithAnd(volumeParts)}.`);
  }

  if (hasValue(ig.linkClicks)) {
    sentences.push(
      `Les clics sur le lien de la bio sont ${describeTrend(linkClicksEvo.percent)}${linkClicksEvo.percent !== null ? ` (${formatSignedPercent(linkClicksEvo.percent)})` : ''}, avec ${ig.linkClicks} clics enregistrés.`
    );
  }

  if (!sentences.length) {
    return 'Aucune donnée Instagram n’a encore été saisie pour ce mois.';
  }

  return sentences.join(' ');
}

function generateFacebookAnalysis(monthData, previousMonthData) {
  const fb = monthData.facebook;
  const prevFb = previousMonthData ? previousMonthData.facebook : null;
  const sentences = [];

  const followersEvo = prevFb ? computeEvolution(prevFb.followers, fb.followers) : { percent: null };
  const reachEvo = prevFb ? computeEvolution(prevFb.reach, fb.reach) : { percent: null };
  const interactionsEvo = prevFb ? computeEvolution(prevFb.interactions, fb.interactions) : { percent: null };

  if (hasValue(fb.followers)) {
    sentences.push(
      `La page Facebook compte ${formatNumber(fb.followers)} abonnés, ${describeTrend(followersEvo.percent)}${followersEvo.percent !== null ? ` (${formatSignedPercent(followersEvo.percent)})` : ''}.`
    );
  }
  if (hasValue(fb.reach)) {
    sentences.push(`La portée est ${describeTrend(reachEvo.percent)}${reachEvo.percent !== null ? ` (${formatSignedPercent(reachEvo.percent)})` : ''}.`);
  }
  if (hasValue(fb.interactions)) {
    sentences.push(
      `Les interactions sont ${describeTrend(interactionsEvo.percent)}${interactionsEvo.percent !== null ? ` (${formatSignedPercent(interactionsEvo.percent)})` : ''}, pour ${hasValue(fb.posts) ? fb.posts : 0} publication(s) ce mois-ci.`
    );
  }

  if (!sentences.length) {
    return 'Aucune donnée Facebook n’a encore été saisie pour ce mois.';
  }

  return sentences.join(' ');
}

function generateBeaconsAnalysis(monthData, previousMonthData) {
  const bc = monthData.beacons;
  const prevBc = previousMonthData ? previousMonthData.beacons : null;
  const sentences = [];

  const bookingEvo = prevBc ? computeEvolution(prevBc.bookingClicks, bc.bookingClicks) : { percent: null };
  const phoneEvo = prevBc ? computeEvolution(prevBc.phoneClicks, bc.phoneClicks) : { percent: null };
  const directionsEvo = prevBc ? computeEvolution(prevBc.directionsClicks, bc.directionsClicks) : { percent: null };
  const total = sumOrNull([bc.bookingClicks, bc.phoneClicks, bc.directionsClicks]);

  if (total !== null) {
    sentences.push(`Les Beacons ont généré ${formatNumber(total)} clics d’intention ce mois-ci (réservation, téléphone, itinéraire confondus).`);
  }
  if (hasValue(bc.bookingClicks)) {
    sentences.push(`Les clics de réservation sont ${describeTrend(bookingEvo.percent)}${bookingEvo.percent !== null ? ` (${formatSignedPercent(bookingEvo.percent)})` : ''}.`);
  }
  if (hasValue(bc.phoneClicks)) {
    sentences.push(`Les clics téléphone sont ${describeTrend(phoneEvo.percent)}${phoneEvo.percent !== null ? ` (${formatSignedPercent(phoneEvo.percent)})` : ''}.`);
  }
  if (hasValue(bc.directionsClicks)) {
    sentences.push(`Les clics itinéraire sont ${describeTrend(directionsEvo.percent)}${directionsEvo.percent !== null ? ` (${formatSignedPercent(directionsEvo.percent)})` : ''}.`);
  }

  if (!sentences.length) {
    return 'Aucune donnée Beacons n’a encore été saisie pour ce mois.';
  }

  return sentences.join(' ');
}

function generateObjectivesAnalysis(monthData) {
  const objectives = monthData.monthlyObjectives;
  const actions = monthData.actionPlan;
  const sentences = [];

  if (objectives.length) {
    const done = objectives.filter((objective) => objective.done).length;
    sentences.push(
      `${done} objectif${done > 1 ? 's' : ''} sur ${objectives.length} ${done > 1 ? 'ont été atteints' : 'a été atteint'} ce mois-ci (${Math.round((done / objectives.length) * 100)}%).`
    );
    const remaining = objectives.filter((objective) => !objective.done).map((objective) => objective.label);
    if (remaining.length) {
      sentences.push(`Reste${remaining.length > 1 ? 'nt' : ''} à finaliser : ${remaining.join(', ')}.`);
    }
  } else {
    sentences.push('Aucun objectif n’a encore été défini pour ce mois.');
  }

  if (actions.length) {
    const done = actions.filter((action) => action.status === 'Terminé').length;
    const inProgress = actions.filter((action) => action.status === 'En cours').length;
    sentences.push(
      `Le plan d’action compte ${actions.length} action${actions.length > 1 ? 's' : ''} : ${done} terminée${done > 1 ? 's' : ''}, ${inProgress} en cours.`
    );
  }

  return sentences.join(' ');
}

function generateStrengths(monthData, previousMonthData) {
  const evolutions = collectFieldEvolutions(monthData, previousMonthData, allInsightFields);
  const positives = evolutions
    .filter((item) => item.percent > 5)
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 3);

  if (!positives.length) {
    return ['Pas de progression marquante à isoler ce mois-ci, la situation reste stable.'];
  }

  return positives.map((item) => `${item.label} : ${formatSignedPercent(item.percent)} vs mois précédent.`);
}

function generateWeaknesses(monthData, previousMonthData) {
  const evolutions = collectFieldEvolutions(monthData, previousMonthData, allInsightFields);
  const negatives = evolutions
    .filter((item) => item.percent < -5)
    .sort((a, b) => a.percent - b.percent)
    .slice(0, 3);

  const items = negatives.map((item) => `${item.label} : ${formatSignedPercent(item.percent)} vs mois précédent.`);

  const objectivesRate = computeObjectivesRate(monthData);
  if (objectivesRate !== null && objectivesRate < 50) {
    items.push(`Seulement ${Math.round(objectivesRate)}% des objectifs du mois ont été atteints.`);
  }

  if (!items.length) {
    return ['Aucune faiblesse notable identifiée ce mois-ci.'];
  }

  return items;
}

function generateOpportunities(monthData, previousMonthData) {
  const opportunities = [];
  const ig = monthData.instagram;
  const gb = monthData.googleBusiness;

  if (hasValue(ig.posts) && hasValue(ig.reels) && Number(ig.posts) > 0 && Number(ig.reels) < Number(ig.posts) / 3) {
    opportunities.push('Le format Reels est sous-exploité par rapport au volume de publications : c’est un levier de portée disponible.');
  }
  if (hasValue(gb.newReviews) && hasValue(gb.reviewsAnswered) && Number(gb.newReviews) > Number(gb.reviewsAnswered)) {
    opportunities.push('Des avis Google récents restent sans réponse : une opportunité rapide d’améliorer la relation client.');
  }
  if (hasValue(gb.googlePosts) && Number(gb.googlePosts) < 2) {
    opportunities.push('La fréquence de publication sur Google Business est faible : publier plus régulièrement renforcerait la visibilité locale.');
  }
  const reachEvo = previousMonthData ? computeEvolution(previousMonthData.instagram.reach, ig.reach) : { percent: null };
  if (reachEvo.percent !== null && reachEvo.percent < 0) {
    opportunities.push('La portée Instagram recule : mettre en avant les offres et produits phares dans les prochains contenus peut relancer la dynamique.');
  }

  if (!opportunities.length) {
    opportunities.push('Les fondamentaux sont bien en place ; capitaliser sur les canaux les plus performants pour accélérer encore la croissance.');
  }

  return opportunities;
}

function generateRecommendations(monthData, previousMonthData) {
  const recommendations = [];
  const gb = monthData.googleBusiness;
  const ig = monthData.instagram;
  const fb = monthData.facebook;
  const bc = monthData.beacons;

  if (hasValue(ig.posts) && hasValue(ig.reels) && Number(ig.posts) > 0 && Number(ig.reels) < Number(ig.posts) / 3) {
    recommendations.push('Publier davantage de Reels pour dynamiser la portée Instagram.');
  }
  if (hasValue(gb.newReviews) && hasValue(gb.reviewsAnswered) && Number(gb.newReviews) > Number(gb.reviewsAnswered)) {
    recommendations.push('Améliorer les réponses aux avis Google : des avis récents restent sans réponse.');
  }

  const reviewsEvo = previousMonthData ? computeEvolution(previousMonthData.googleBusiness.reviewsCount, gb.reviewsCount) : { percent: null };
  if (reviewsEvo.percent !== null && reviewsEvo.percent < 8) {
    recommendations.push('Demander plus d’avis Google auprès des clients satisfaits pour accélérer la collecte.');
  }
  if (hasValue(gb.googlePosts) && Number(gb.googlePosts) < 2) {
    recommendations.push('Publier plus de Google Posts pour dynamiser la fiche Google Business.');
  }
  if (hasValue(ig.stories) && hasValue(ig.posts) && Number(ig.stories) < Number(ig.posts)) {
    recommendations.push('Travailler davantage les Stories pour garder un contact régulier avec la communauté.');
  }

  const reachEvo = previousMonthData ? computeEvolution(previousMonthData.instagram.reach, ig.reach) : { percent: null };
  if (reachEvo.percent !== null && reachEvo.percent < 0) {
    recommendations.push('Mettre en avant vos offres phares (plats signature, promotions) dans les prochains contenus pour relancer la portée.');
  }

  const ratingEvo = previousMonthData ? computeEvolution(previousMonthData.googleBusiness.rating, gb.rating) : { percent: null };
  if (ratingEvo.percent !== null && ratingEvo.percent <= 0) {
    recommendations.push('Améliorer la fiche Google Business (photos récentes, informations à jour) pour soutenir la note.');
  }
  if (hasValue(fb.posts) && Number(fb.posts) < 2) {
    recommendations.push('Maintenir une publication régulière sur Facebook pour ne pas perdre le lien avec cette audience.');
  }

  const bookingEvo = previousMonthData ? computeEvolution(previousMonthData.beacons.bookingClicks, bc.bookingClicks) : { percent: null };
  if (bookingEvo.percent !== null && bookingEvo.percent < 0) {
    recommendations.push('Mettre en avant les options de réservation en ligne (Beacons) pour capter davantage d’intentions clients.');
  }

  const objectivesRate = computeObjectivesRate(monthData);
  if (objectivesRate !== null && objectivesRate < 50) {
    recommendations.push('Prioriser les objectifs du mois en retard pour sécuriser les résultats.');
  }

  if (!recommendations.length) {
    recommendations.push('Maintenir le rythme actuel : les indicateurs sont bien orientés ce mois-ci.');
  }

  return recommendations.slice(0, 6);
}

function generateAlerts(monthData, previousMonthData) {
  const alerts = [];
  if (!previousMonthData) {
    return alerts;
  }

  const gb = monthData.googleBusiness;
  const prevGb = previousMonthData.googleBusiness;
  const ig = monthData.instagram;
  const prevIg = previousMonthData.instagram;

  const reviewsEvo = computeEvolution(prevGb.reviewsCount, gb.reviewsCount);
  if (reviewsEvo.percent !== null && reviewsEvo.percent < 0) {
    alerts.push({ severity: 'high', message: `Baisse du nombre d’avis Google (${formatSignedPercent(reviewsEvo.percent)} vs mois précédent).` });
  }

  const ratingEvo = computeEvolution(prevGb.rating, gb.rating);
  if (ratingEvo.diff !== null && ratingEvo.diff < 0) {
    alerts.push({ severity: 'medium', message: `La note Google a reculé de ${Math.abs(ratingEvo.diff).toFixed(1)} point(s) ce mois-ci.` });
  }

  const reachEvo = computeEvolution(prevIg.reach, ig.reach);
  if (reachEvo.percent !== null && reachEvo.percent < 0) {
    alerts.push({ severity: 'high', message: `Baisse de la portée Instagram (${formatSignedPercent(reachEvo.percent)} vs mois précédent).` });
  }

  const callsEvo = computeEvolution(prevGb.calls, gb.calls);
  if (callsEvo.percent !== null && callsEvo.percent < 0) {
    alerts.push({ severity: 'high', message: `Baisse des appels générés par la fiche Google (${formatSignedPercent(callsEvo.percent)} vs mois précédent).` });
  }

  if (monthData.businessResults.goalReached === 'Non' && monthHasAnyData(monthData)) {
    alerts.push({ severity: 'medium', message: 'L’objectif business du mois n’a pas été atteint.' });
  }

  const objectivesRate = computeObjectivesRate(monthData);
  if (objectivesRate !== null && objectivesRate < 50) {
    alerts.push({ severity: 'medium', message: `Moins de la moitié des objectifs du mois ont été atteints (${Math.round(objectivesRate)}%).` });
  }

  const googlePercent = averagePercentEvolution(googleScoreFields, monthData, previousMonthData);
  const instagramPercent = averagePercentEvolution(instagramScoreFields, monthData, previousMonthData);
  const overallPercents = [googlePercent, instagramPercent].filter((percent) => percent !== null);
  if (overallPercents.length) {
    const avgOverall = overallPercents.reduce((total, percent) => total + percent, 0) / overallPercents.length;
    if (Math.abs(avgOverall) < 2) {
      alerts.push({ severity: 'medium', message: 'Stagnation générale des indicateurs ce mois-ci : peu de mouvement sur Google Business et Instagram.' });
    }
  }

  return alerts;
}

const recordCheckFields = [
  { section: 'googleBusiness', field: 'rating', label: 'Note Google' },
  { section: 'googleBusiness', field: 'reviewsCount', label: 'Nombre d’avis Google' },
  { section: 'googleBusiness', field: 'profileViews', label: 'Vues de la fiche Google' },
  { section: 'googleBusiness', field: 'calls', label: 'Appels Google' },
  { section: 'googleBusiness', field: 'bookings', label: 'Réservations Google' },
  { section: 'instagram', field: 'followers', label: 'Abonnés Instagram' },
  { section: 'instagram', field: 'reach', label: 'Portée Instagram' },
  { section: 'instagram', field: 'interactions', label: 'Interactions Instagram' },
  { section: 'facebook', field: 'reach', label: 'Portée Facebook' },
  { section: 'beacons', field: 'bookingClicks', label: 'Clics réservation Beacons' },
  { section: 'businessResults', field: 'bookingsGenerated', label: 'Réservations générées' }
];

function findRecords(clientData, monthKey) {
  const monthOrder = clientData.monthOrder;
  const monthIndex = monthOrder.indexOf(monthKey);
  const priorKeys = monthOrder.slice(0, monthIndex);
  if (!priorKeys.length) {
    return [];
  }

  const currentMonth = clientData.months[monthKey];
  const records = [];

  recordCheckFields.forEach(({ section, field, label }) => {
    const currentValue = currentMonth[section][field];
    if (!hasValue(currentValue)) {
      return;
    }
    const priorValues = priorKeys
      .map((key) => clientData.months[key][section][field])
      .filter((value) => hasValue(value))
      .map(Number);
    if (!priorValues.length) {
      return;
    }
    const maxPrior = Math.max(...priorValues);
    if (Number(currentValue) > maxPrior) {
      records.push(`${label} : nouveau record à ${formatNumber(currentValue)} (précédent record : ${formatNumber(maxPrior)}).`);
    }
  });

  return records;
}

function generateWins(clientData, monthKey, monthData, previousMonthData) {
  const wins = [];

  const evolutions = collectFieldEvolutions(monthData, previousMonthData, allInsightFields);
  if (evolutions.length) {
    const best = evolutions.reduce((max, item) => (item.percent > max.percent ? item : max), evolutions[0]);
    if (best.percent > 0) {
      wins.push(`Meilleure progression du mois : ${best.label} (${formatSignedPercent(best.percent)} vs mois précédent).`);
    }
  }

  wins.push(...findRecords(clientData, monthKey));

  if (monthData.businessResults.goalReached === 'Oui') {
    wins.push('L’objectif business du mois a été atteint.');
  }

  const objectivesRate = computeObjectivesRate(monthData);
  if (objectivesRate === 100) {
    wins.push('Tous les objectifs du mois ont été atteints.');
  }

  const actionsRate = computeActionCompletionRate(monthData);
  if (actionsRate === 100) {
    wins.push('Toutes les actions du plan ont été menées à terme.');
  }

  return wins;
}

function renderAnalysisSection(clientData, monthKey, monthData, previousMonthData, score, scoreBadge) {
  const block = document.createElement('div');
  block.className = 'section-block';
  block.innerHTML = `
    <div class="section-heading">
      <div>
        <p class="eyebrow">Analyse automatique</p>
        <h3>Analyse du mois</h3>
      </div>
    </div>
  `;

  const evolutions = collectFieldEvolutions(monthData, previousMonthData, allInsightFields);
  const best = evolutions.length ? evolutions.reduce((max, item) => (item.percent > max.percent ? item : max), evolutions[0]) : null;
  const worst = evolutions.length ? evolutions.reduce((min, item) => (item.percent < min.percent ? item : min), evolutions[0]) : null;

  const objectivesRate = computeObjectivesRate(monthData);
  const objectivesSentence =
    objectivesRate === null
      ? 'Aucun objectif n’a encore été défini pour ce mois.'
      : `${Math.round(objectivesRate)}% des objectifs du mois ont été atteints.`;

  const executiveSummary = generateExecutiveSummary({
    generalData: clientData.general,
    monthLabel: monthData.label,
    score,
    scoreBadge,
    evolutions: { best, worst },
    objectivesSentence
  });

  const sections = [
    { title: '1. Résumé exécutif', paragraphs: [executiveSummary] },
    { title: '2. Analyse Google Business', paragraphs: [generateGoogleAnalysis(monthData, previousMonthData)] },
    { title: '3. Analyse Instagram', paragraphs: [generateInstagramAnalysis(monthData, previousMonthData)] },
    { title: '4. Analyse Facebook', paragraphs: [generateFacebookAnalysis(monthData, previousMonthData)] },
    { title: '5. Analyse Beacons', paragraphs: [generateBeaconsAnalysis(monthData, previousMonthData)] },
    { title: '6. Analyse des objectifs', paragraphs: [generateObjectivesAnalysis(monthData)] },
    { title: '7. Forces du mois', list: generateStrengths(monthData, previousMonthData) },
    { title: '8. Faiblesses', list: generateWeaknesses(monthData, previousMonthData) },
    { title: '9. Opportunités', list: generateOpportunities(monthData, previousMonthData) },
    { title: '10. Recommandations concrètes pour le mois suivant', list: generateRecommendations(monthData, previousMonthData) }
  ];

  sections.forEach((section) => {
    const subsection = document.createElement('div');
    subsection.className = 'analysis-subsection';

    const heading = document.createElement('h4');
    heading.textContent = section.title;
    subsection.appendChild(heading);

    if (section.list) {
      const list = document.createElement('ul');
      list.className = 'analysis-list';
      section.list.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
      });
      subsection.appendChild(list);
    } else {
      section.paragraphs.forEach((paragraph) => {
        const p = document.createElement('p');
        p.textContent = paragraph;
        subsection.appendChild(p);
      });
    }

    block.appendChild(subsection);
  });

  return block;
}

function renderRecommendationsSection(monthData, previousMonthData) {
  const block = document.createElement('div');
  block.className = 'section-block';
  block.innerHTML = `
    <div class="section-heading">
      <div>
        <p class="eyebrow">Actions suggérées</p>
        <h3>Recommandations</h3>
      </div>
    </div>
  `;

  const list = document.createElement('div');
  list.className = 'insight-list';
  generateRecommendations(monthData, previousMonthData).forEach((text) => {
    const item = document.createElement('div');
    item.className = 'insight-item tone-neutral';
    item.innerHTML = `<span class="insight-icon">💡</span><span class="insight-text">${escapeHtml(text)}</span>`;
    list.appendChild(item);
  });
  block.appendChild(list);

  return block;
}

function renderAlertsSection(monthData, previousMonthData) {
  const block = document.createElement('div');
  block.className = 'section-block';
  block.innerHTML = `
    <div class="section-heading">
      <div>
        <p class="eyebrow">Points de vigilance</p>
        <h3>Alertes</h3>
      </div>
    </div>
  `;

  const alerts = generateAlerts(monthData, previousMonthData);

  if (!alerts.length) {
    const empty = document.createElement('p');
    empty.className = 'insight-empty';
    empty.textContent = previousMonthData
      ? 'Aucune alerte ce mois-ci : les indicateurs sont sous contrôle.'
      : 'Pas encore de mois précédent pour détecter des alertes.';
    block.appendChild(empty);
    return block;
  }

  const list = document.createElement('div');
  list.className = 'insight-list';
  alerts.forEach((alert) => {
    const item = document.createElement('div');
    item.className = `insight-item tone-${alert.severity === 'high' ? 'high' : 'medium'}`;
    item.innerHTML = `<span class="insight-icon">⚠️</span><span class="insight-text">${escapeHtml(alert.message)}</span>`;
    list.appendChild(item);
  });
  block.appendChild(list);

  return block;
}

function renderWinsSection(clientData, monthKey, monthData, previousMonthData) {
  const block = document.createElement('div');
  block.className = 'section-block';
  block.innerHTML = `
    <div class="section-heading">
      <div>
        <p class="eyebrow">Mise en avant</p>
        <h3>Victoires du mois</h3>
      </div>
    </div>
  `;

  const wins = generateWins(clientData, monthKey, monthData, previousMonthData);

  if (!wins.length) {
    const empty = document.createElement('p');
    empty.className = 'insight-empty';
    empty.textContent = previousMonthData
      ? 'Pas de victoire marquante identifiée ce mois-ci : cap sur les prochains résultats.'
      : 'Premier mois enregistré : cette fiche servira de référence pour mesurer les prochaines victoires.';
    block.appendChild(empty);
    return block;
  }

  const list = document.createElement('div');
  list.className = 'insight-list';
  wins.forEach((text) => {
    const item = document.createElement('div');
    item.className = 'insight-item tone-positive';
    item.innerHTML = `<span class="insight-icon">🏆</span><span class="insight-text">${escapeHtml(text)}</span>`;
    list.appendChild(item);
  });
  block.appendChild(list);

  return block;
}

function createNoMonthsState() {
  const el = document.createElement('div');
  el.className = 'no-months-state';
  el.innerHTML = `
    <p class="eyebrow">Aucun mois enregistré</p>
    <p>Ajoutez un premier mois ci-dessus pour commencer le suivi mensuel de ce client.</p>
  `;
  return el;
}

function createObjectiveRow(clientId, monthKey, objective, onRemove) {
  const row = document.createElement('div');
  row.className = `checklist-item${objective.done ? ' done' : ''}`;

  const label = document.createElement('label');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = objective.done;
  const span = document.createElement('span');
  span.textContent = objective.label;
  label.appendChild(checkbox);
  label.appendChild(span);

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'remove-item-btn';
  removeButton.setAttribute('aria-label', 'Supprimer cet objectif');
  removeButton.textContent = '✕';

  checkbox.addEventListener('change', () => {
    const data = getClientData(clientId);
    const month = data.months[monthKey];
    const target = month?.monthlyObjectives.find((item) => item.id === objective.id);
    if (target) {
      target.done = checkbox.checked;
      saveClientData(clientId, data);
    }
    row.classList.toggle('done', checkbox.checked);
  });

  removeButton.addEventListener('click', () => {
    const data = getClientData(clientId);
    const month = data.months[monthKey];
    if (month) {
      month.monthlyObjectives = month.monthlyObjectives.filter((item) => item.id !== objective.id);
      saveClientData(clientId, data);
    }
    onRemove();
  });

  row.appendChild(label);
  row.appendChild(removeButton);
  return row;
}

function renderObjectivesSection(clientId, monthKey) {
  const block = document.createElement('div');
  block.className = 'section-block';
  block.innerHTML = `
    <div class="section-heading">
      <div>
        <p class="eyebrow">Suivi mensuel</p>
        <h3>Objectifs du mois</h3>
      </div>
    </div>
    <div class="checklist" data-role="objectives-list"></div>
    <form class="inline-add-form" data-role="objectives-form">
      <input type="text" placeholder="Nouvel objectif" required />
      <button type="submit" class="client-open-btn">Ajouter</button>
    </form>
  `;

  const list = block.querySelector('[data-role="objectives-list"]');
  const form = block.querySelector('[data-role="objectives-form"]');

  const renderList = () => {
    const data = getClientData(clientId);
    const month = data.months[monthKey];
    if (!month) {
      return;
    }
    list.innerHTML = '';
    month.monthlyObjectives.forEach((objective) => {
      list.appendChild(createObjectiveRow(clientId, monthKey, objective, renderList));
    });
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = form.querySelector('input');
    const label = input.value.trim();
    if (!label) {
      return;
    }
    const data = getClientData(clientId);
    const month = data.months[monthKey];
    if (!month) {
      return;
    }
    month.monthlyObjectives.push({ id: generateId(), label, done: false });
    saveClientData(clientId, data);
    input.value = '';
    renderList();
  });

  renderList();
  return block;
}

function createActionRow(clientId, monthKey, action, onRemove) {
  const row = document.createElement('div');
  row.className = 'action-item';

  const label = document.createElement('span');
  label.className = 'action-label';
  label.textContent = action.label;

  const select = document.createElement('select');
  select.className = 'status-select';
  actionStatusOptions.forEach((status) => {
    const option = document.createElement('option');
    option.value = status;
    option.textContent = status;
    select.appendChild(option);
  });
  select.value = action.status;

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'remove-item-btn';
  removeButton.setAttribute('aria-label', 'Supprimer cette action');
  removeButton.textContent = '✕';

  select.addEventListener('change', () => {
    const data = getClientData(clientId);
    const month = data.months[monthKey];
    const target = month?.actionPlan.find((item) => item.id === action.id);
    if (target) {
      target.status = select.value;
      saveClientData(clientId, data);
    }
  });

  removeButton.addEventListener('click', () => {
    const data = getClientData(clientId);
    const month = data.months[monthKey];
    if (month) {
      month.actionPlan = month.actionPlan.filter((item) => item.id !== action.id);
      saveClientData(clientId, data);
    }
    onRemove();
  });

  row.appendChild(label);
  row.appendChild(select);
  row.appendChild(removeButton);
  return row;
}

function renderActionPlanSection(clientId, monthKey) {
  const block = document.createElement('div');
  block.className = 'section-block';
  block.innerHTML = `
    <div class="section-heading">
      <div>
        <p class="eyebrow">Suivi mensuel</p>
        <h3>Plan d’action</h3>
      </div>
    </div>
    <div class="action-list" data-role="action-list"></div>
    <form class="inline-add-form" data-role="action-form">
      <input type="text" placeholder="Nouvelle action" required />
      <button type="submit" class="client-open-btn">Ajouter</button>
    </form>
  `;

  const list = block.querySelector('[data-role="action-list"]');
  const form = block.querySelector('[data-role="action-form"]');

  const renderList = () => {
    const data = getClientData(clientId);
    const month = data.months[monthKey];
    if (!month) {
      return;
    }
    list.innerHTML = '';
    month.actionPlan.forEach((action) => {
      list.appendChild(createActionRow(clientId, monthKey, action, renderList));
    });
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = form.querySelector('input');
    const label = input.value.trim();
    if (!label) {
      return;
    }
    const data = getClientData(clientId);
    const month = data.months[monthKey];
    if (!month) {
      return;
    }
    month.actionPlan.push({ id: generateId(), label, status: actionStatusOptions[0] });
    saveClientData(clientId, data);
    input.value = '';
    renderList();
  });

  renderList();
  return block;
}

function renderNotesSection(clientId, clientData) {
  const block = document.createElement('div');
  block.className = 'section-block';
  block.innerHTML = `
    <div class="section-heading">
      <div>
        <p class="eyebrow">Suivi interne</p>
        <h3>Notes internes</h3>
      </div>
    </div>
    <textarea class="notes-textarea" placeholder="Notes internes sur ce client..."></textarea>
    <p class="notes-hint">Sauvegarde automatique.</p>
  `;

  const textarea = block.querySelector('textarea');
  textarea.value = clientData.internalNotes || '';
  textarea.addEventListener('input', () => {
    const data = getClientData(clientId);
    data.internalNotes = textarea.value;
    saveClientData(clientId, data);
  });

  return block;
}

function updateSidebarRow(clientId, data) {
  const row = document.querySelector(`.client-item[data-client-id="${clientId}"]`);
  if (!row) {
    return;
  }
  row.querySelector('strong').textContent = data.general.name;
  row.querySelector('p').textContent = data.general.type || 'Client';
}

const caseStudyMetricLabels = {
  googleRating: 'Note Google',
  googleReviews: 'Avis Google',
  googleViews: 'Vues de la fiche Google',
  googleCalls: 'Appels Google',
  googleDirections: 'Itinéraires Google',
  googleWebsiteClicks: 'Clics vers le site (Google)',
  instagramFollowers: 'Abonnés Instagram',
  instagramReach: 'Portée Instagram',
  instagramViews: 'Vues Instagram',
  instagramInteractions: 'Interactions Instagram',
  instagramProfileVisits: 'Visites de profil Instagram',
  instagramLinkClicks: 'Clics sur le lien (Instagram)'
};

const caseStudyActionCategories = [
  { key: 'reviews', title: 'Gestion des avis', keywords: ['avis', 'review'] },
  { key: 'instagram', title: 'Instagram', keywords: ['instagram', 'reel', 'stories', 'story'] },
  { key: 'facebook', title: 'Facebook', keywords: ['facebook'] },
  { key: 'googleBusiness', title: 'Google Business', keywords: ['google', 'gbp', 'fiche'] },
  { key: 'content', title: 'Création de contenu', keywords: ['contenu', 'calendrier', 'édito', 'editorial'] },
  { key: 'optimization', title: 'Optimisations réalisées', keywords: [] }
];

function categorizeCaseStudyAction(label) {
  const normalized = label.toLowerCase();
  const match = caseStudyActionCategories.find(
    (category) => category.keywords.length && category.keywords.some((keyword) => normalized.includes(keyword))
  );
  return match ? match.key : 'optimization';
}

function buildCaseStudyActionsByCategory(clientData) {
  const buckets = {};
  caseStudyActionCategories.forEach((category) => {
    buckets[category.key] = [];
  });

  clientData.monthOrder.forEach((monthKey) => {
    clientData.months[monthKey].actionPlan
      .filter((action) => action.status === 'Terminé')
      .forEach((action) => {
        const categoryKey = categorizeCaseStudyAction(action.label);
        if (!buckets[categoryKey].includes(action.label)) {
          buckets[categoryKey].push(action.label);
        }
      });
  });

  return buckets;
}

function generateCaseStudyProblems(initialSituation) {
  const problems = [];
  if (hasValue(initialSituation.googleReviews) && Number(initialSituation.googleReviews) < 80) {
    problems.push(
      `Un volume d’avis Google encore limité (${formatNumber(initialSituation.googleReviews)} avis), freinant la confiance des nouveaux clients.`
    );
  }
  if (hasValue(initialSituation.googleRating) && Number(initialSituation.googleRating) < 4.5) {
    problems.push(`Une note Google perfectible (${initialSituation.googleRating}/5), à consolider pour renforcer la réputation en ligne.`);
  }
  if (hasValue(initialSituation.instagramFollowers) && Number(initialSituation.instagramFollowers) < 2000) {
    problems.push(
      `Une audience Instagram encore naissante (${formatNumber(initialSituation.instagramFollowers)} abonnés), avec un fort potentiel de développement.`
    );
  }
  if (hasValue(initialSituation.googleViews) && Number(initialSituation.googleViews) < 2000) {
    problems.push(
      `Une visibilité locale limitée sur Google (${formatNumber(initialSituation.googleViews)} vues de fiche), réduisant les opportunités de contact.`
    );
  }
  if (!problems.length) {
    problems.push('Une base déjà correcte, avec un besoin d’accélérer la croissance sur l’ensemble des canaux.');
  }
  return problems;
}

function generateCaseStudyDifficulties(initialSituation) {
  const difficulties = [
    'Absence de suivi mensuel structuré des indicateurs de performance.',
    'Manque de régularité dans la publication de contenu sur les réseaux sociaux.',
    'Pas de stratégie formalisée de sollicitation et de réponse aux avis clients.'
  ];
  if (
    hasValue(initialSituation.instagramInteractions) &&
    hasValue(initialSituation.instagramReach) &&
    Number(initialSituation.instagramReach) > 0
  ) {
    const rate = (Number(initialSituation.instagramInteractions) / Number(initialSituation.instagramReach)) * 100;
    if (rate < 6) {
      difficulties.push(`Un taux d’engagement Instagram initial faible (environ ${rate.toFixed(1)}%).`);
    }
  }
  return difficulties;
}

function buildCaseStudyBeforeAfterRows(initialSituation, latestMonthData) {
  return Object.entries(baselineFieldMap).map(([baselineKey, ref]) => ({
    key: baselineKey,
    label: caseStudyMetricLabels[baselineKey] || baselineKey,
    unit: undefined,
    initial: initialSituation[baselineKey],
    current: latestMonthData[ref.section][ref.field]
  }));
}

function generateCaseStudyConclusion(clientData, beforeAfterRows) {
  const name = clientData.general.name || 'Ce client';
  const improved = beforeAfterRows.filter((row) => {
    const evolution = computeEvolution(row.initial, row.current);
    return evolution.percent !== null && evolution.percent > 0;
  });

  let bestRow = null;
  let bestPercent = -Infinity;
  improved.forEach((row) => {
    const evolution = computeEvolution(row.initial, row.current);
    if (evolution.percent > bestPercent) {
      bestPercent = evolution.percent;
      bestRow = row;
    }
  });

  const highlight = bestRow ? ` À titre d’exemple : ${bestRow.label} a progressé de ${formatSignedPercent(bestPercent)}.` : '';

  return (
    `Depuis le début de sa collaboration avec AnaVibe, ${name} a transformé sa présence digitale : ` +
    `${improved.length || 'plusieurs'} indicateur${improved.length > 1 ? 's ont' : ' a'} progressé sur l’ensemble des canaux suivis ` +
    `(Google Business, Instagram, Facebook, Beacons).${highlight} Cette dynamique illustre la valeur d’un accompagnement mensuel structuré, ` +
    `avec des actions concrètes et mesurables mois après mois. AnaVibe continue d’accompagner ${name} pour transformer chaque mois en nouvelle ` +
    `opportunité de croissance.`
  );
}

function buildCaseStudyPresentationText(clientData) {
  const general = clientData.general;
  const parts = [`${general.name || 'Ce client'} est ${general.type ? `un établissement de type ${general.type}` : 'un établissement partenaire AnaVibe'}`];
  if (general.city) {
    parts.push(`basé à ${general.city}`);
  }
  if (general.startDate) {
    parts.push(`accompagné par AnaVibe depuis ${formatDateFr(new Date(general.startDate))}`);
  }
  const base = `${parts.join(', ')}.`;
  const mainGoal = general.mainGoal ? general.mainGoal.trim().replace(/[.!]+$/, '') : '';
  return mainGoal ? `${base} Objectif principal de la collaboration : ${mainGoal}.` : base;
}

function buildCaseStudyContext(clientId) {
  const data = getClientData(clientId);
  if (!data.monthOrder.length) {
    return null;
  }

  const latestMonthKey = data.monthOrder[data.monthOrder.length - 1];
  const latestMonthData = data.months[latestMonthKey];
  const beforeAfterRows = buildCaseStudyBeforeAfterRows(data.initialSituation, latestMonthData);
  const objectivesDone = latestMonthData.monthlyObjectives.filter((objective) => objective.done).length;
  const objectivesTotal = latestMonthData.monthlyObjectives.length;

  return {
    clientId,
    client: data,
    latestMonthKey,
    latestMonthData,
    latestMonthLabel: latestMonthData.label,
    beforeAfterRows,
    problems: generateCaseStudyProblems(data.initialSituation),
    difficulties: generateCaseStudyDifficulties(data.initialSituation),
    actionsByCategory: buildCaseStudyActionsByCategory(data),
    objectivesSummary: {
      done: objectivesDone,
      total: objectivesTotal,
      rate: objectivesTotal ? (objectivesDone / objectivesTotal) * 100 : null
    },
    conclusion: generateCaseStudyConclusion(data, beforeAfterRows),
    testimonial: data.caseStudyTestimonial || ''
  };
}

function createBeforeAfterCard(row) {
  const evolution = computeEvolution(row.initial, row.current);
  const fmt = formatEvolution(evolution, row.unit);
  const card = document.createElement('div');
  card.className = 'kpi-card card summary-card';
  card.innerHTML = `
    <span class="kpi-label">${escapeHtml(row.label)}</span>
    <strong>${formatValue(row.initial, row.unit)} → ${formatValue(row.current, row.unit)}</strong>
    <span class="evolution-badge ${fmt.badgeClass}">${fmt.text}</span>
  `;
  return card;
}

function renderCaseStudyPreview(context) {
  const wrapper = document.createElement('div');
  wrapper.className = 'case-study-preview';

  const presentationBlock = document.createElement('div');
  presentationBlock.className = 'analysis-subsection';
  presentationBlock.innerHTML = `<h4>1. Présentation du client</h4>`;
  const presentationText = document.createElement('p');
  presentationText.textContent = buildCaseStudyPresentationText(context.client);
  presentationBlock.appendChild(presentationText);
  wrapper.appendChild(presentationBlock);

  const beforeBlock = document.createElement('div');
  beforeBlock.className = 'analysis-subsection';
  beforeBlock.innerHTML = '<h4>2. Situation avant AnaVibe</h4><p><strong>Problématiques</strong></p>';
  const problemsList = document.createElement('ul');
  problemsList.className = 'analysis-list';
  context.problems.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    problemsList.appendChild(li);
  });
  beforeBlock.appendChild(problemsList);
  const difficultiesTitle = document.createElement('p');
  difficultiesTitle.innerHTML = '<strong>Difficultés</strong>';
  beforeBlock.appendChild(difficultiesTitle);
  const difficultiesList = document.createElement('ul');
  difficultiesList.className = 'analysis-list';
  context.difficulties.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    difficultiesList.appendChild(li);
  });
  beforeBlock.appendChild(difficultiesList);
  wrapper.appendChild(beforeBlock);

  const actionsBlock = document.createElement('div');
  actionsBlock.className = 'analysis-subsection';
  actionsBlock.innerHTML = '<h4>3. Actions mises en place</h4>';
  caseStudyActionCategories.forEach((category) => {
    const categoryTitle = document.createElement('p');
    categoryTitle.innerHTML = `<strong>${escapeHtml(category.title)}</strong>`;
    actionsBlock.appendChild(categoryTitle);
    const items = context.actionsByCategory[category.key];
    if (items.length) {
      const ul = document.createElement('ul');
      ul.className = 'analysis-list';
      items.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
      });
      actionsBlock.appendChild(ul);
    } else {
      const p = document.createElement('p');
      p.textContent = 'Optimisations en cours sur ce levier.';
      actionsBlock.appendChild(p);
    }
  });
  wrapper.appendChild(actionsBlock);

  const resultsBlock = document.createElement('div');
  resultsBlock.className = 'analysis-subsection';
  resultsBlock.innerHTML = '<h4>4. Résultats obtenus</h4>';
  const table = document.createElement('table');
  table.className = 'comparison-table';
  table.innerHTML = `
    <thead><tr><th>Indicateur</th><th>Avant AnaVibe</th><th>Aujourd’hui</th><th>Évolution</th></tr></thead>
    <tbody></tbody>
  `;
  const tbody = table.querySelector('tbody');
  context.beforeAfterRows.forEach((row) => {
    const evolution = computeEvolution(row.initial, row.current);
    const fmt = formatEvolution(evolution, row.unit);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(row.label)}</td>
      <td>${formatValue(row.initial, row.unit)}</td>
      <td class="comparison-current">${formatValue(row.current, row.unit)}</td>
      <td><span class="evolution-badge ${fmt.badgeClass}">${fmt.text}</span></td>
    `;
    tbody.appendChild(tr);
  });
  const scrollWrap = document.createElement('div');
  scrollWrap.className = 'comparison-scroll';
  scrollWrap.appendChild(table);
  resultsBlock.appendChild(scrollWrap);
  const objText = document.createElement('p');
  objText.textContent = context.objectivesSummary.total
    ? `Objectifs du mois en cours (${context.latestMonthLabel}) : ${context.objectivesSummary.done}/${context.objectivesSummary.total} atteints (${Math.round(context.objectivesSummary.rate)}%).`
    : `Aucun objectif enregistré pour le mois en cours (${context.latestMonthLabel}).`;
  resultsBlock.appendChild(objText);
  wrapper.appendChild(resultsBlock);

  const kpiBlock = document.createElement('div');
  kpiBlock.className = 'analysis-subsection';
  kpiBlock.innerHTML = '<h4>5. Chiffres clés</h4>';
  const grid = document.createElement('div');
  grid.className = 'kpi-grid summary-grid';
  const topRows = [...context.beforeAfterRows]
    .filter((row) => computeEvolution(row.initial, row.current).percent !== null)
    .sort((a, b) => computeEvolution(b.initial, b.current).percent - computeEvolution(a.initial, a.current).percent)
    .slice(0, 6);
  (topRows.length ? topRows : context.beforeAfterRows.slice(0, 6)).forEach((row) => {
    grid.appendChild(createBeforeAfterCard(row));
  });
  kpiBlock.appendChild(grid);
  wrapper.appendChild(kpiBlock);

  const conclusionBlock = document.createElement('div');
  conclusionBlock.className = 'analysis-subsection';
  conclusionBlock.innerHTML = '<h4>6. Conclusion</h4>';
  const conclusionText = document.createElement('p');
  conclusionText.textContent = context.conclusion;
  conclusionBlock.appendChild(conclusionText);
  wrapper.appendChild(conclusionBlock);

  if (context.testimonial) {
    const testimonialBlock = document.createElement('div');
    testimonialBlock.className = 'analysis-subsection';
    testimonialBlock.innerHTML = `<h4>Témoignage</h4><p>« ${escapeHtml(context.testimonial)} »</p>`;
    wrapper.appendChild(testimonialBlock);
  }

  return wrapper;
}

function renderCaseStudySection(clientId) {
  const block = document.createElement('div');
  block.className = 'section-block';
  block.innerHTML = `
    <div class="section-heading">
      <div>
        <p class="eyebrow">Marketing & preuve sociale</p>
        <h3>Étude de cas client</h3>
      </div>
    </div>
    <p>Générez automatiquement une étude de cas prête à être utilisée sur le site AnaVibe ou lors d’un rendez-vous commercial.</p>
    <label class="field-item" style="margin-top: 12px;">
      <span>Témoignage client (optionnel)</span>
      <textarea class="notes-textarea" data-role="testimonial-input" placeholder="Ex : « Grâce à AnaVibe, notre visibilité a explosé... »"></textarea>
    </label>
    <div class="report-export-block" style="justify-content: flex-start; gap: 12px; flex-wrap: wrap;">
      <button type="button" class="btn btn-primary" data-role="generate-case-study-btn">⭐ Générer une étude de cas</button>
      <button type="button" class="btn btn-secondary" data-role="download-case-study-btn">📄 Télécharger l’étude de cas</button>
    </div>
    <div data-role="case-study-preview"></div>
  `;

  const textarea = block.querySelector('[data-role="testimonial-input"]');
  textarea.value = getClientData(clientId).caseStudyTestimonial || '';
  textarea.addEventListener('input', () => {
    const freshData = getClientData(clientId);
    freshData.caseStudyTestimonial = textarea.value;
    saveClientData(clientId, freshData);
  });

  const previewContainer = block.querySelector('[data-role="case-study-preview"]');
  const generateButton = block.querySelector('[data-role="generate-case-study-btn"]');
  const downloadButton = block.querySelector('[data-role="download-case-study-btn"]');

  generateButton.addEventListener('click', () => {
    const context = buildCaseStudyContext(clientId);
    previewContainer.innerHTML = '';
    if (!context) {
      const empty = document.createElement('p');
      empty.className = 'insight-empty';
      empty.textContent = 'Ajoutez au moins un mois de données pour générer une étude de cas.';
      previewContainer.appendChild(empty);
      return;
    }
    previewContainer.appendChild(renderCaseStudyPreview(context));
  });

  downloadButton.addEventListener('click', () => {
    generateCaseStudyPdf(clientId);
  });

  return block;
}

function createDashboardCard(clientId) {
  const data = getClientData(clientId);
  const article = document.createElement('article');
  article.className = 'client-dashboard-card card';
  article.id = clientId;
  article.dataset.clientId = clientId;

  const backButton = document.createElement('button');
  backButton.type = 'button';
  backButton.className = 'client-open-btn back-to-list-btn';
  backButton.style.marginBottom = '18px';
  backButton.textContent = '← Retour aux clients';
  article.appendChild(backButton);

  const chip = document.createElement('span');
  chip.className = 'client-chip';
  chip.dataset.role = 'type-chip';
  chip.textContent = data.general.type || 'Client';
  article.appendChild(chip);

  const heading = document.createElement('h3');
  heading.dataset.role = 'name-heading';
  heading.textContent = data.general.name;
  article.appendChild(heading);

  const clientTabNav = document.createElement('div');
  clientTabNav.className = 'planner-tab-nav';
  const ficheTabBtn = document.createElement('button');
  ficheTabBtn.type = 'button';
  ficheTabBtn.className = 'planner-tab-btn active';
  ficheTabBtn.textContent = '📋 Fiche client';
  const dnaTabBtn = document.createElement('button');
  dnaTabBtn.type = 'button';
  dnaTabBtn.className = 'planner-tab-btn';
  dnaTabBtn.textContent = '🧠 Profil Stratégique Client';
  clientTabNav.appendChild(ficheTabBtn);
  clientTabNav.appendChild(dnaTabBtn);
  article.appendChild(clientTabNav);

  const fichePanel = document.createElement('div');
  fichePanel.className = 'planner-tab-panel';
  const dnaPanel = document.createElement('div');
  dnaPanel.className = 'planner-tab-panel hidden';
  article.appendChild(fichePanel);
  article.appendChild(dnaPanel);

  ficheTabBtn.addEventListener('click', () => {
    ficheTabBtn.classList.add('active');
    dnaTabBtn.classList.remove('active');
    fichePanel.classList.remove('hidden');
    dnaPanel.classList.add('hidden');
  });
  dnaTabBtn.addEventListener('click', () => {
    dnaTabBtn.classList.add('active');
    ficheTabBtn.classList.remove('active');
    dnaPanel.classList.remove('hidden');
    fichePanel.classList.add('hidden');
  });

  dnaPanel.appendChild(renderFieldSection(clientStrategicProfileFieldsSchema));

  fichePanel.appendChild(renderFieldSection(generalFieldsSchema));
  fichePanel.appendChild(renderFieldSection(initialSituationSchema));
  fillFieldValues(article, data);

  const monthControlBlock = document.createElement('div');
  monthControlBlock.className = 'section-block';
  monthControlBlock.innerHTML = `
    <div class="section-heading">
      <div>
        <p class="eyebrow">Historique mensuel</p>
        <h3>Mois affiché</h3>
      </div>
    </div>
    <div class="month-selector-row">
      <select class="month-select" data-role="month-select"></select>
      <button type="button" class="month-delete-btn" data-role="month-delete-btn">Supprimer ce mois</button>
    </div>
    <form class="inline-add-form" data-role="month-add-form">
      <input type="text" placeholder="Nouveau mois (ex : Août 2026)" required />
      <button type="submit" class="client-open-btn">Ajouter un mois</button>
    </form>
  `;
  fichePanel.appendChild(monthControlBlock);

  const monthContent = document.createElement('div');
  monthContent.dataset.role = 'month-content';
  fichePanel.appendChild(monthContent);

  const monthSelect = monthControlBlock.querySelector('[data-role="month-select"]');
  const monthAddForm = monthControlBlock.querySelector('[data-role="month-add-form"]');
  const monthDeleteBtn = monthControlBlock.querySelector('[data-role="month-delete-btn"]');

  const populateMonthSelect = (freshData) => {
    monthSelect.innerHTML = '';
    freshData.monthOrder.forEach((key) => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = freshData.months[key].label;
      monthSelect.appendChild(option);
    });
  };

  const refreshMonthContent = () => {
    const freshData = getClientData(clientId);
    populateMonthSelect(freshData);
    monthContent.innerHTML = '';

    if (!freshData.monthOrder.length) {
      monthContent.appendChild(createNoMonthsState());
      return;
    }

    let selectedMonth = freshData.selectedMonth;
    if (!selectedMonth || !freshData.monthOrder.includes(selectedMonth)) {
      selectedMonth = freshData.monthOrder[freshData.monthOrder.length - 1];
      freshData.selectedMonth = selectedMonth;
      saveClientData(clientId, freshData);
    }
    monthSelect.value = selectedMonth;

    const monthIndex = freshData.monthOrder.indexOf(selectedMonth);
    const previousMonthKey = monthIndex > 0 ? freshData.monthOrder[monthIndex - 1] : null;
    const monthData = freshData.months[selectedMonth];
    const previousMonthData = previousMonthKey ? freshData.months[previousMonthKey] : null;

    const monthDataIntro = document.createElement('p');
    monthDataIntro.className = 'notes-hint';
    monthDataIntro.textContent = 'Renseignez ci-dessous les chiffres du mois sélectionné : le tableau de synthèse, les alertes, les victoires et l’analyse sont calculés automatiquement à partir de ces données.';
    monthContent.appendChild(monthDataIntro);

    monthlySectionSchema.forEach((section) => {
      monthContent.appendChild(renderMonthlyFieldSection(section, selectedMonth, monthData));
    });

    monthContent.appendChild(renderSummaryCards(monthData, previousMonthData, freshData.initialSituation));
    monthContent.appendChild(renderSynthesisSection(monthData, previousMonthData, freshData.initialSituation));

    const monthlyScore = computeGlobalScore(monthData, previousMonthData);
    const monthlyScoreBadge = getScoreBadge(monthlyScore);
    monthContent.appendChild(renderAlertsSection(monthData, previousMonthData));
    monthContent.appendChild(renderWinsSection(freshData, selectedMonth, monthData, previousMonthData));
    monthContent.appendChild(renderAnalysisSection(freshData, selectedMonth, monthData, previousMonthData, monthlyScore, monthlyScoreBadge));
    monthContent.appendChild(renderRecommendationsSection(monthData, previousMonthData));

    monthContent.appendChild(renderObjectivesSection(clientId, selectedMonth));
    monthContent.appendChild(renderActionPlanSection(clientId, selectedMonth));
  };

  monthSelect.addEventListener('change', () => {
    const freshData = getClientData(clientId);
    freshData.selectedMonth = monthSelect.value;
    saveClientData(clientId, freshData);
    refreshMonthContent();
  });

  monthAddForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = monthAddForm.querySelector('input');
    const label = input.value.trim();
    if (!label) {
      return;
    }

    const freshData = getClientData(clientId);
    const key = normalizeId(label);
    if (!key || freshData.months[key]) {
      window.alert('Ce mois existe déjà.');
      return;
    }

    const newMonth = createEmptyMonthData(label);

    // Carries the previous month's open objectives and action plan (plus the
    // recommendations its own analysis already produced) forward automatically,
    // so closing a month and starting the next never requires retyping anything.
    if (freshData.monthOrder.length) {
      const previousKey = freshData.monthOrder[freshData.monthOrder.length - 1];
      const previousMonth = freshData.months[previousKey];
      const previousIndex = freshData.monthOrder.indexOf(previousKey);
      const beforePreviousKey = previousIndex > 0 ? freshData.monthOrder[previousIndex - 1] : null;
      const beforePreviousMonth = beforePreviousKey ? freshData.months[beforePreviousKey] : null;

      newMonth.monthlyObjectives = (previousMonth.monthlyObjectives || [])
        .filter((objective) => !objective.done)
        .map((objective) => ({ id: generateId(), label: objective.label, done: false }));

      newMonth.actionPlan = buildCarriedOverActionPlanItems(previousMonth, beforePreviousMonth)
        .map((actionLabel) => ({ id: generateId(), label: actionLabel, status: actionStatusOptions[0] }));
    }

    freshData.months[key] = newMonth;
    freshData.monthOrder.push(key);
    freshData.selectedMonth = key;
    saveClientData(clientId, freshData);
    input.value = '';
    refreshMonthContent();
  });

  monthDeleteBtn.addEventListener('click', () => {
    const freshData = getClientData(clientId);
    if (!freshData.monthOrder.length) {
      return;
    }

    const currentMonthKey = monthSelect.value;
    const currentMonth = freshData.months[currentMonthKey];
    const monthLabel = currentMonth ? currentMonth.label : currentMonthKey;
    const confirmed = window.confirm(`Supprimer définitivement le mois « ${monthLabel} » et toutes ses données ? Cette action est irréversible.`);
    if (!confirmed) {
      return;
    }

    delete freshData.months[currentMonthKey];
    freshData.monthOrder = freshData.monthOrder.filter((key) => key !== currentMonthKey);
    freshData.selectedMonth = freshData.monthOrder.length ? freshData.monthOrder[freshData.monthOrder.length - 1] : null;
    saveClientData(clientId, freshData);
    refreshMonthContent();
  });

  refreshMonthContent();

  fichePanel.appendChild(renderNotesSection(clientId, data));
  fichePanel.appendChild(renderCaseStudySection(clientId));

  const reportButton = document.createElement('button');
  reportButton.type = 'button';
  reportButton.className = 'btn btn-primary report-export-btn';
  reportButton.textContent = '📄 Télécharger le rapport mensuel';
  reportButton.addEventListener('click', () => {
    generateClientReportPdf(clientId);
  });

  const reportBlock = document.createElement('div');
  reportBlock.className = 'report-export-block';
  reportBlock.appendChild(reportButton);
  fichePanel.appendChild(reportBlock);

  const handleFieldInput = (event) => {
    const target = event.target;
    if (!target.matches('.field-input')) {
      return;
    }

    const { section, field, month } = target.dataset;
    if (!section || !field) {
      return;
    }

    const freshData = getClientData(clientId);
    const scope = month ? freshData.months[month] : freshData;
    if (!scope || !scope[section]) {
      return;
    }

    const isNumber = target.type === 'number';
    scope[section][field] = isNumber && target.value !== '' ? Number(target.value) : target.value;
    saveClientData(clientId, freshData);

    if (!month && section === 'general' && field === 'name') {
      article.querySelector('[data-role="name-heading"]').textContent = target.value;
      updateSidebarRow(clientId, freshData);
    }

    if (!month && section === 'general' && field === 'type') {
      article.querySelector('[data-role="type-chip"]').textContent = target.value || 'Client';
      updateSidebarRow(clientId, freshData);
    }
  };

  article.addEventListener('input', handleFieldInput);
  article.addEventListener('change', (event) => {
    handleFieldInput(event);
    const target = event.target;
    if (target.matches('.field-input') && target.dataset.month) {
      refreshMonthContent();
    }
  });

  return article;
}

const CONSULTANT_NAME_KEY = 'anavibe-tools-consultant-name';

const PDF_COLORS = {
  primary: [110, 31, 50],
  primaryDark: [81, 21, 36],
  background: [244, 237, 227],
  surface: [255, 253, 249],
  muted: [246, 238, 228],
  text: [22, 22, 22],
  textSoft: [94, 85, 79],
  positive: [46, 125, 50],
  negative: [198, 40, 40],
  white: [255, 255, 255]
};

function formatDateFr(date) {
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function promptConsultantName() {
  const saved = localStorage.getItem(CONSULTANT_NAME_KEY) || '';
  const input = window.prompt('Nom du consultant AnaVibe (affiché sur le rapport) :', saved);
  if (input === null) {
    return saved || 'Équipe AnaVibe';
  }
  const trimmed = input.trim();
  const finalName = trimmed || 'Équipe AnaVibe';
  localStorage.setItem(CONSULTANT_NAME_KEY, finalName);
  return finalName;
}

function createPdfState(doc) {
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

function ensurePdfSpace(state, needed) {
  const maxY = state.pageHeight - state.marginBottom;
  if (state.cursorY + needed > maxY) {
    state.doc.addPage();
    state.cursorY = state.marginTop;
  }
}

function addPdfSectionTitle(state, text) {
  ensurePdfSpace(state, 16);
  state.doc.setFont('helvetica', 'bold');
  state.doc.setFontSize(15);
  state.doc.setTextColor(...PDF_COLORS.primary);
  state.doc.text(text, state.marginLeft, state.cursorY);
  state.cursorY += 3;
  state.doc.setDrawColor(...PDF_COLORS.primary);
  state.doc.setLineWidth(0.6);
  state.doc.line(state.marginLeft, state.cursorY, state.pageWidth - state.marginRight, state.cursorY);
  state.cursorY += 8;
}

function addPdfSubTitle(state, text) {
  ensurePdfSpace(state, 10);
  state.doc.setFont('helvetica', 'bold');
  state.doc.setFontSize(11.5);
  state.doc.setTextColor(...PDF_COLORS.primaryDark);
  state.doc.text(text, state.marginLeft, state.cursorY);
  state.cursorY += 6;
}

function addPdfParagraph(state, text) {
  state.doc.setFont('helvetica', 'normal');
  state.doc.setFontSize(10);
  state.doc.setTextColor(...PDF_COLORS.text);
  const usableWidth = state.pageWidth - state.marginLeft - state.marginRight;
  const lines = state.doc.splitTextToSize(text, usableWidth);
  lines.forEach((line) => {
    ensurePdfSpace(state, 6);
    state.doc.text(line, state.marginLeft, state.cursorY);
    state.cursorY += 5.6;
  });
  state.cursorY += 3;
}

function addPdfBulletList(state, items) {
  state.doc.setFont('helvetica', 'normal');
  state.doc.setFontSize(10);
  const usableWidth = state.pageWidth - state.marginLeft - state.marginRight - 6;
  items.forEach((item) => {
    const lines = state.doc.splitTextToSize(item, usableWidth);
    ensurePdfSpace(state, 5.6 * lines.length);
    state.doc.setTextColor(...PDF_COLORS.primary);
    state.doc.text('•', state.marginLeft, state.cursorY);
    state.doc.setTextColor(...PDF_COLORS.text);
    lines.forEach((line) => {
      state.doc.text(line, state.marginLeft + 5, state.cursorY);
      state.cursorY += 5.6;
    });
  });
  state.cursorY += 3;
}

function addPdfChecklist(state, items) {
  state.doc.setFont('helvetica', 'normal');
  state.doc.setFontSize(10);
  const usableWidth = state.pageWidth - state.marginLeft - state.marginRight - 7;
  items.forEach((item) => {
    const lines = state.doc.splitTextToSize(item.label, usableWidth);
    ensurePdfSpace(state, 5.6 * lines.length);
    const markerY = state.cursorY - 1.3;
    if (item.done) {
      state.doc.setDrawColor(...PDF_COLORS.positive);
      state.doc.setFillColor(...PDF_COLORS.positive);
      state.doc.circle(state.marginLeft + 1.3, markerY, 1.3, 'F');
    } else {
      state.doc.setDrawColor(...PDF_COLORS.textSoft);
      state.doc.setLineWidth(0.3);
      state.doc.circle(state.marginLeft + 1.3, markerY, 1.3, 'S');
    }
    state.doc.setTextColor(...PDF_COLORS.text);
    lines.forEach((line) => {
      state.doc.text(line, state.marginLeft + 7, state.cursorY);
      state.cursorY += 5.6;
    });
  });
  state.cursorY += 3;
}

function addPdfTable(state, columns, rows) {
  const totalWidth = columns.reduce((sum, col) => sum + col.width, 0);
  const rowHeight = 7;
  const headerHeight = 8;

  ensurePdfSpace(state, headerHeight + rowHeight);

  state.doc.setFillColor(...PDF_COLORS.primary);
  state.doc.rect(state.marginLeft, state.cursorY, totalWidth, headerHeight, 'F');
  state.doc.setFont('helvetica', 'bold');
  state.doc.setFontSize(8);
  state.doc.setTextColor(...PDF_COLORS.white);
  let headerX = state.marginLeft;
  columns.forEach((col) => {
    state.doc.text(col.header, headerX + 2, state.cursorY + headerHeight - 2.6);
    headerX += col.width;
  });
  state.cursorY += headerHeight;

  state.doc.setFont('helvetica', 'normal');
  state.doc.setFontSize(9);

  rows.forEach((row, rowIndex) => {
    ensurePdfSpace(state, rowHeight);
    if (rowIndex % 2 === 1) {
      state.doc.setFillColor(...PDF_COLORS.muted);
      state.doc.rect(state.marginLeft, state.cursorY, totalWidth, rowHeight, 'F');
    }
    let cellX = state.marginLeft;
    row.forEach((cell, colIndex) => {
      const col = columns[colIndex];
      const color = cell.color || PDF_COLORS.text;
      state.doc.setTextColor(...color);
      state.doc.text(String(cell.text ?? ''), cellX + 2, state.cursorY + rowHeight - 2.4);
      cellX += col.width;
    });
    state.cursorY += rowHeight;
  });

  state.cursorY += 6;
}

function buildKpiTableRows(section, monthData, previousMonthData) {
  return section.fields.map((field) => {
    const current = monthData[section.key][field.key];
    if (field.type !== 'number') {
      return [{ text: field.label }, { text: current || '—' }, { text: '—' }];
    }
    const evolution = previousMonthData
      ? computeEvolution(previousMonthData[section.key][field.key], current)
      : { diff: null, percent: null };
    const evoFmt = formatEvolution(evolution, field.unit);
    const color =
      evoFmt.badgeClass === 'positive' ? PDF_COLORS.positive : evoFmt.badgeClass === 'negative' ? PDF_COLORS.negative : PDF_COLORS.textSoft;
    return [{ text: field.label }, { text: formatValue(current, field.unit) }, { text: evoFmt.text, color }];
  });
}

function createLineChartImage(title, labels, values) {
  const canvas = document.createElement('canvas');
  const width = 900;
  const height = 380;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#fffdf8';
  ctx.fillRect(0, 0, width, height);

  const paddingLeft = 70;
  const paddingRight = 60;
  const paddingTop = 56;
  const paddingBottom = 50;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  ctx.fillStyle = '#161616';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(title, paddingLeft, 36);

  const numericValues = values.filter((value) => value !== null && value !== undefined && !Number.isNaN(value));
  const maxValue = numericValues.length ? Math.max(...numericValues, 1) : 1;

  ctx.strokeStyle = 'rgba(61, 31, 38, 0.12)';
  ctx.lineWidth = 1;
  ctx.font = '15px Arial';
  ctx.fillStyle = '#5e554f';
  const gridSteps = 4;
  for (let i = 0; i <= gridSteps; i += 1) {
    const y = paddingTop + chartHeight - (chartHeight * i) / gridSteps;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(width - paddingRight, y);
    ctx.stroke();
    const value = (maxValue * i) / gridSteps;
    ctx.fillText(Math.round(value).toLocaleString('fr-FR'), 8, y + 5);
  }

  ctx.strokeStyle = 'rgba(61, 31, 38, 0.3)';
  ctx.beginPath();
  ctx.moveTo(paddingLeft, paddingTop);
  ctx.lineTo(paddingLeft, paddingTop + chartHeight);
  ctx.lineTo(width - paddingRight, paddingTop + chartHeight);
  ctx.stroke();

  const stepX = labels.length > 1 ? chartWidth / (labels.length - 1) : 0;
  const points = values.map((value, index) => {
    const x = paddingLeft + stepX * index;
    const ratio = maxValue > 0 && value !== null ? value / maxValue : 0;
    const y = paddingTop + chartHeight - chartHeight * ratio;
    return { x, y, value };
  });

  ctx.strokeStyle = '#6e1f32';
  ctx.lineWidth = 3;
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.stroke();

  points.forEach((point, index) => {
    ctx.fillStyle = '#6e1f32';
    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
    ctx.fill();

    const edgeAlign = index === 0 ? 'left' : index === points.length - 1 ? 'right' : 'center';

    ctx.fillStyle = '#161616';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = edgeAlign;
    const valueText = point.value === null || point.value === undefined ? '—' : Number(point.value).toLocaleString('fr-FR');
    ctx.fillText(valueText, point.x, point.y - 12);

    ctx.font = '13px Arial';
    ctx.fillStyle = '#5e554f';
    ctx.fillText(labels[index], point.x, height - 22);
  });
  ctx.textAlign = 'left';

  return canvas.toDataURL('image/png');
}

function createCompactLineChartImage(title, labels, values) {
  const canvas = document.createElement('canvas');
  const width = 760;
  const height = 480;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#fffdf8';
  ctx.fillRect(0, 0, width, height);

  const paddingLeft = 60;
  const paddingRight = 46;
  const paddingTop = 46;
  const paddingBottom = 46;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  ctx.fillStyle = '#161616';
  ctx.font = 'bold 20px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(title, paddingLeft, 30);

  const numericValues = values.filter((value) => value !== null && value !== undefined && !Number.isNaN(value));
  const maxValue = numericValues.length ? Math.max(...numericValues, 1) : 1;

  ctx.strokeStyle = 'rgba(61, 31, 38, 0.12)';
  ctx.lineWidth = 1;
  ctx.font = '13px Arial';
  ctx.fillStyle = '#5e554f';
  const gridSteps = 4;
  for (let i = 0; i <= gridSteps; i += 1) {
    const y = paddingTop + chartHeight - (chartHeight * i) / gridSteps;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(width - paddingRight, y);
    ctx.stroke();
    const value = (maxValue * i) / gridSteps;
    ctx.fillText(Math.round(value).toLocaleString('fr-FR'), 6, y + 4);
  }

  ctx.strokeStyle = 'rgba(61, 31, 38, 0.3)';
  ctx.beginPath();
  ctx.moveTo(paddingLeft, paddingTop);
  ctx.lineTo(paddingLeft, paddingTop + chartHeight);
  ctx.lineTo(width - paddingRight, paddingTop + chartHeight);
  ctx.stroke();

  const stepX = labels.length > 1 ? chartWidth / (labels.length - 1) : 0;
  const points = values.map((value, index) => {
    const x = paddingLeft + stepX * index;
    const ratio = maxValue > 0 && value !== null ? value / maxValue : 0;
    const y = paddingTop + chartHeight - chartHeight * ratio;
    return { x, y, value };
  });

  ctx.strokeStyle = '#6e1f32';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.stroke();

  points.forEach((point, index) => {
    ctx.fillStyle = '#6e1f32';
    ctx.beginPath();
    ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
    ctx.fill();

    const edgeAlign = index === 0 ? 'left' : index === points.length - 1 ? 'right' : 'center';

    ctx.fillStyle = '#161616';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = edgeAlign;
    const valueText = point.value === null || point.value === undefined ? '—' : Number(point.value).toLocaleString('fr-FR');
    ctx.fillText(valueText, point.x, point.y - 10);

    ctx.font = '11px Arial';
    ctx.fillStyle = '#5e554f';
    ctx.fillText(labels[index], point.x, height - 18);
  });
  ctx.textAlign = 'left';

  return canvas.toDataURL('image/png');
}

function getMonthlySeries(clientData, section, field) {
  return clientData.monthOrder.map((key) => {
    const value = clientData.months[key][section][field];
    return hasValue(value) ? Number(value) : null;
  });
}

function getMonthlyIntentionsSeries(clientData) {
  return clientData.monthOrder.map((key) => computeIntentionsFromMonth(clientData.months[key]));
}

function drawPdfCoverPage(doc, data, monthData, consultantName) {
  const pageWidth = 210;
  const pageHeight = 297;

  doc.setFillColor(...PDF_COLORS.background);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setFillColor(...PDF_COLORS.primary);
  doc.rect(0, 0, pageWidth, 8, 'F');
  doc.rect(0, pageHeight - 8, pageWidth, 8, 'F');

  doc.setFillColor(...PDF_COLORS.primary);
  doc.circle(38, 46, 12, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...PDF_COLORS.white);
  doc.text('A', 38, 50.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...PDF_COLORS.textSoft);
  doc.text('PLATEFORME PREMIUM', 56, 42);
  doc.setFontSize(19);
  doc.setTextColor(...PDF_COLORS.text);
  doc.text('AnaVibe Tools', 56, 51);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(...PDF_COLORS.primary);
  doc.text('Rapport mensuel', 18, 130);
  doc.setTextColor(...PDF_COLORS.text);
  doc.setFontSize(22);
  doc.text(data.general.name || 'Client', 18, 144);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(...PDF_COLORS.textSoft);
  let infoY = 163;
  const infoLines = [`Période analysée : ${monthData.label}`, `Date de génération : ${formatDateFr(new Date())}`, `Consultant AnaVibe : ${consultantName}`];
  if (data.general.type) {
    infoLines.push(`Type d’établissement : ${data.general.type}`);
  }
  if (data.general.city) {
    infoLines.push(`Ville : ${data.general.city}`);
  }
  infoLines.forEach((line) => {
    doc.text(line, 18, infoY);
    infoY += 9;
  });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(...PDF_COLORS.primary);
  doc.text('Document confidentiel préparé exclusivement pour ce client.', 18, pageHeight - 20);
}

function generateConclusion(clientData, score, scoreBadge) {
  const name = clientData.general.name || 'ce client';
  let tone;
  if (score >= 85) {
    tone = `Ce mois marque une dynamique très positive pour ${name}. La stratégie mise en place porte ses fruits et mérite d’être poursuivie sans changement majeur.`;
  } else if (score >= 70) {
    tone = `${name} affiche un bon mois, avec des indicateurs globalement bien orientés. Quelques ajustements ciblés permettront de passer un cap supplémentaire.`;
  } else if (score >= 50) {
    tone = `${name} progresse ce mois-ci, avec des résultats encourageants sur certains canaux. Un focus sur les recommandations ci-dessus permettra d’accélérer la dynamique le mois prochain.`;
  } else {
    tone = `Ce mois demande une vigilance particulière pour ${name}. Les actions prioritaires identifiées dans ce rapport doivent être mises en œuvre rapidement pour relancer la dynamique.`;
  }
  return `${tone} Score global du mois : ${score}/100 (${scoreBadge.label}). L’équipe AnaVibe reste à disposition pour accompagner la mise en œuvre du plan d’action du mois prochain.`;
}

function buildNextMonthActionPlan(monthData, previousMonthData) {
  const carriedOver = monthData.actionPlan
    .filter((action) => action.status !== 'Terminé')
    .map((action) => `${action.label} (statut actuel : ${action.status})`);

  const recommendations = generateRecommendations(monthData, previousMonthData);

  const seen = new Set();
  return [...carriedOver, ...recommendations].filter((item) => {
    if (seen.has(item)) {
      return false;
    }
    seen.add(item);
    return true;
  });
}

// Seeds a brand-new month's action plan from the previous one, so closing a month and
// opening the next never requires retyping open actions or the recommendations the
// analysis already produced (unlike buildNextMonthActionPlan's narrative version above,
// these are usable as-is as fresh action-plan item labels).
function buildCarriedOverActionPlanItems(monthData, previousMonthData) {
  const carriedLabels = (monthData.actionPlan || [])
    .filter((action) => action.status !== 'Terminé')
    .map((action) => action.label);

  const recommendations = generateRecommendations(monthData, previousMonthData);

  const seen = new Set();
  return [...carriedLabels, ...recommendations].filter((label) => {
    if (seen.has(label)) {
      return false;
    }
    seen.add(label);
    return true;
  });
}

function addPdfFootersAndPageNumbers(doc, clientName, documentLabel = 'Rapport confidentiel') {
  const pageCount = doc.internal.getNumberOfPages();
  for (let pageNumber = 2; pageNumber <= pageCount; pageNumber += 1) {
    doc.setPage(pageNumber);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...PDF_COLORS.textSoft);
    doc.text(`AnaVibe Tools — ${documentLabel} préparé pour ${clientName}`, 18, 291);
    doc.text(`Page ${pageNumber - 1} / ${pageCount - 1}`, 210 - 18, 291, { align: 'right' });
  }
}

function generateClientReportPdf(clientId) {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    window.alert('Le module de génération PDF n’a pas pu se charger. Rechargez la page et réessayez.');
    return;
  }

  const data = getClientData(clientId);
  const monthOrder = data.monthOrder;
  if (!monthOrder.length) {
    window.alert('Ajoutez au moins un mois de données avant de générer un rapport.');
    return;
  }

  const selectedMonth = monthOrder.includes(data.selectedMonth) ? data.selectedMonth : monthOrder[monthOrder.length - 1];
  const monthIndex = monthOrder.indexOf(selectedMonth);
  const previousMonthKey = monthIndex > 0 ? monthOrder[monthIndex - 1] : null;
  const monthData = data.months[selectedMonth];
  const previousMonthData = previousMonthKey ? data.months[previousMonthKey] : null;

  const score = computeGlobalScore(monthData, previousMonthData);
  const scoreBadge = getScoreBadge(score);
  const consultantName = promptConsultantName();

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const state = createPdfState(doc);

  drawPdfCoverPage(doc, data, monthData, consultantName);
  doc.addPage();
  state.cursorY = state.marginTop;

  addPdfSectionTitle(state, '1. Résumé exécutif');
  const evolutionsForSummary = collectFieldEvolutions(monthData, previousMonthData, allInsightFields);
  const bestForSummary = evolutionsForSummary.length
    ? evolutionsForSummary.reduce((max, item) => (item.percent > max.percent ? item : max), evolutionsForSummary[0])
    : null;
  const worstForSummary = evolutionsForSummary.length
    ? evolutionsForSummary.reduce((min, item) => (item.percent < min.percent ? item : min), evolutionsForSummary[0])
    : null;
  const objectivesRateForSummary = computeObjectivesRate(monthData);
  const objectivesSentenceForSummary =
    objectivesRateForSummary === null
      ? 'Aucun objectif n’a encore été défini pour ce mois.'
      : `${Math.round(objectivesRateForSummary)}% des objectifs du mois ont été atteints.`;
  addPdfParagraph(
    state,
    generateExecutiveSummary({
      generalData: data.general,
      monthLabel: monthData.label,
      score,
      scoreBadge,
      evolutions: { best: bestForSummary, worst: worstForSummary },
      objectivesSentence: objectivesSentenceForSummary
    })
  );

  addPdfSectionTitle(state, '2. Tableau des KPI');
  monthlySectionSchema.forEach((section) => {
    addPdfSubTitle(state, section.title);
    addPdfTable(
      state,
      [
        { header: 'Indicateur', width: 76 },
        { header: 'Valeur du mois', width: 34 },
        { header: 'Évolution vs mois précédent', width: 64 }
      ],
      buildKpiTableRows(section, monthData, previousMonthData)
    );
  });

  doc.addPage();
  state.cursorY = state.marginTop;
  addPdfSectionTitle(state, '3. Évolution dans le temps');
  const monthLabels = monthOrder.map((key) => data.months[key].label);
  const chartDefinitions = [
    { title: 'Google Business — Vues de la fiche', getSeries: () => getMonthlySeries(data, 'googleBusiness', 'profileViews') },
    { title: 'Instagram — Portée', getSeries: () => getMonthlySeries(data, 'instagram', 'reach') },
    { title: 'Facebook — Portée', getSeries: () => getMonthlySeries(data, 'facebook', 'reach') },
    { title: 'Intentions clients (Google + Beacons)', getSeries: () => getMonthlyIntentionsSeries(data) }
  ];

  const chartColumnWidth = 84;
  const chartRowHeight = 58;
  const chartGap = 6;

  chartDefinitions.forEach((chartDef, index) => {
    const imageData = createCompactLineChartImage(chartDef.title, monthLabels, chartDef.getSeries());
    const column = index % 2;
    if (column === 0) {
      ensurePdfSpace(state, chartRowHeight + 6);
    }
    const x = state.marginLeft + column * (chartColumnWidth + chartGap);
    doc.addImage(imageData, 'PNG', x, state.cursorY, chartColumnWidth, chartRowHeight);
    if (column === 1 || index === chartDefinitions.length - 1) {
      state.cursorY += chartRowHeight + 6;
    }
  });

  doc.addPage();
  state.cursorY = state.marginTop;
  addPdfSectionTitle(state, '4. Analyse du mois');
  const analysisSections = [
    { title: 'Analyse Google Business', text: generateGoogleAnalysis(monthData, previousMonthData) },
    { title: 'Analyse Instagram', text: generateInstagramAnalysis(monthData, previousMonthData) },
    { title: 'Analyse Facebook', text: generateFacebookAnalysis(monthData, previousMonthData) },
    { title: 'Analyse Beacons', text: generateBeaconsAnalysis(monthData, previousMonthData) },
    { title: 'Analyse des objectifs', text: generateObjectivesAnalysis(monthData) }
  ];
  analysisSections.forEach((section) => {
    addPdfSubTitle(state, section.title);
    addPdfParagraph(state, section.text);
  });

  addPdfSubTitle(state, 'Forces du mois');
  addPdfBulletList(state, generateStrengths(monthData, previousMonthData));
  addPdfSubTitle(state, 'Faiblesses');
  addPdfBulletList(state, generateWeaknesses(monthData, previousMonthData));
  addPdfSubTitle(state, 'Opportunités');
  addPdfBulletList(state, generateOpportunities(monthData, previousMonthData));

  doc.addPage();
  state.cursorY = state.marginTop;
  addPdfSectionTitle(state, '5. Recommandations');
  addPdfBulletList(state, generateRecommendations(monthData, previousMonthData));

  addPdfSectionTitle(state, '6. Objectifs du mois');
  if (monthData.monthlyObjectives.length) {
    addPdfChecklist(state, monthData.monthlyObjectives);
  } else {
    addPdfParagraph(state, 'Aucun objectif n’a été défini pour ce mois.');
  }

  addPdfSectionTitle(state, '7. Plan d’action du mois suivant');
  const nextMonthPlan = buildNextMonthActionPlan(monthData, previousMonthData);
  if (nextMonthPlan.length) {
    addPdfBulletList(state, nextMonthPlan);
  } else {
    addPdfParagraph(state, 'Aucune action prioritaire identifiée : maintenir le cap actuel.');
  }

  addPdfSectionTitle(state, '8. Conclusion');
  addPdfParagraph(state, generateConclusion(data, score, scoreBadge));

  addPdfFootersAndPageNumbers(doc, data.general.name || 'ce client');

  const fileName = `Rapport-AnaVibe-${normalizeId(data.general.name || clientId)}-${selectedMonth}.pdf`;
  doc.save(fileName);
}

function createBeforeAfterBarChartImage(title, beforeValue, afterValue) {
  const canvas = document.createElement('canvas');
  const width = 760;
  const height = 480;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#fffdf8';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#161616';
  ctx.font = 'bold 20px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(title, 30, 34);

  const paddingBottom = 60;
  const chartTop = 60;
  const chartBottom = height - paddingBottom;
  const chartHeight = chartBottom - chartTop;

  const values = [beforeValue, afterValue].map((value) => (hasValue(value) ? Number(value) : 0));
  const maxValue = Math.max(...values, 1);

  const barWidth = 160;
  const gap = 100;
  const totalBarsWidth = barWidth * 2 + gap;
  const startX = (width - totalBarsWidth) / 2;

  const bars = [
    { label: 'Avant', value: values[0], rawValue: beforeValue, color: '#c9b8a8', x: startX },
    { label: 'Aujourd’hui', value: values[1], rawValue: afterValue, color: '#6e1f32', x: startX + barWidth + gap }
  ];

  bars.forEach((bar) => {
    const barHeight = maxValue > 0 ? (bar.value / maxValue) * chartHeight : 0;
    const y = chartBottom - barHeight;
    ctx.fillStyle = bar.color;
    ctx.fillRect(bar.x, y, barWidth, barHeight);

    ctx.fillStyle = '#161616';
    ctx.font = 'bold 22px Arial';
    ctx.textAlign = 'center';
    const valueText = hasValue(bar.rawValue) ? Number(bar.rawValue).toLocaleString('fr-FR') : '—';
    ctx.fillText(valueText, bar.x + barWidth / 2, y - 12);

    ctx.font = '14px Arial';
    ctx.fillStyle = '#5e554f';
    ctx.fillText(bar.label, bar.x + barWidth / 2, chartBottom + 26);
  });

  ctx.strokeStyle = 'rgba(61, 31, 38, 0.3)';
  ctx.beginPath();
  ctx.moveTo(30, chartBottom);
  ctx.lineTo(width - 30, chartBottom);
  ctx.stroke();
  ctx.textAlign = 'left';

  return canvas.toDataURL('image/png');
}

function addPdfKpiCardGrid(state, rows) {
  const cardWidth = 56;
  const cardHeight = 34;
  const gap = 3;
  const columns = 3;

  rows.forEach((row, index) => {
    const column = index % columns;
    if (column === 0) {
      ensurePdfSpace(state, cardHeight + gap);
    }
    const x = state.marginLeft + column * (cardWidth + gap);
    const y = state.cursorY;

    state.doc.setFillColor(...PDF_COLORS.surface);
    state.doc.setDrawColor(...PDF_COLORS.primary);
    state.doc.setLineWidth(0.3);
    state.doc.roundedRect(x, y, cardWidth, cardHeight, 2, 2, 'FD');

    state.doc.setFont('helvetica', 'bold');
    state.doc.setFontSize(7.5);
    state.doc.setTextColor(...PDF_COLORS.primary);
    const labelLines = state.doc.splitTextToSize(row.label, cardWidth - 6);
    state.doc.text(labelLines.slice(0, 2), x + 3, y + 7);

    const evolution = computeEvolution(row.initial, row.current);
    const fmt = formatEvolution(evolution, row.unit);
    const color =
      fmt.badgeClass === 'positive' ? PDF_COLORS.positive : fmt.badgeClass === 'negative' ? PDF_COLORS.negative : PDF_COLORS.textSoft;

    state.doc.setFont('helvetica', 'bold');
    state.doc.setFontSize(10.5);
    state.doc.setTextColor(...PDF_COLORS.text);
    state.doc.text(`${formatValue(row.initial, row.unit)} -> ${formatValue(row.current, row.unit)}`, x + 3, y + 21);

    state.doc.setFont('helvetica', 'bold');
    state.doc.setFontSize(9);
    state.doc.setTextColor(...color);
    state.doc.text(fmt.text, x + 3, y + 29);

    if (column === columns - 1 || index === rows.length - 1) {
      state.cursorY += cardHeight + gap;
    }
  });
  state.cursorY += 4;
}

function addPdfTestimonial(state, testimonial, clientName) {
  const usableWidth = state.pageWidth - state.marginLeft - state.marginRight - 16;
  state.doc.setFont('helvetica', 'italic');
  state.doc.setFontSize(12);
  const lines = state.doc.splitTextToSize(`« ${testimonial} »`, usableWidth);
  const boxHeight = lines.length * 7 + 20;

  ensurePdfSpace(state, boxHeight);
  state.doc.setFillColor(...PDF_COLORS.muted);
  state.doc.setDrawColor(...PDF_COLORS.primary);
  state.doc.setLineWidth(0.4);
  state.doc.roundedRect(state.marginLeft, state.cursorY, state.pageWidth - state.marginLeft - state.marginRight, boxHeight, 3, 3, 'FD');

  state.doc.setTextColor(...PDF_COLORS.primaryDark);
  let textY = state.cursorY + 12;
  lines.forEach((line) => {
    state.doc.text(line, state.marginLeft + 8, textY);
    textY += 7;
  });

  state.doc.setFont('helvetica', 'bold');
  state.doc.setFontSize(10);
  state.doc.setTextColor(...PDF_COLORS.primary);
  state.doc.text(`— ${clientName || 'Client AnaVibe'}`, state.marginLeft + 8, textY + 4);

  state.cursorY += boxHeight + 8;
}

function drawCaseStudyCoverPage(doc, context) {
  const pageWidth = 210;
  const pageHeight = 297;

  doc.setFillColor(...PDF_COLORS.background);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  doc.setFillColor(...PDF_COLORS.primary);
  doc.rect(0, 0, pageWidth, 8, 'F');
  doc.rect(0, pageHeight - 8, pageWidth, 8, 'F');

  doc.setFillColor(...PDF_COLORS.primary);
  doc.circle(38, 46, 12, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...PDF_COLORS.white);
  doc.text('A', 38, 50.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...PDF_COLORS.textSoft);
  doc.text('PLATEFORME PREMIUM', 56, 42);
  doc.setFontSize(19);
  doc.setTextColor(...PDF_COLORS.text);
  doc.text('AnaVibe Tools', 56, 51);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...PDF_COLORS.primary);
  doc.text('ÉTUDE DE CAS', 18, 110);
  doc.setFontSize(26);
  doc.setTextColor(...PDF_COLORS.text);
  doc.text(context.client.general.name || 'Client', 18, 124);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(...PDF_COLORS.primaryDark);
  doc.text('De la situation initiale à aujourd’hui', 18, 136);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(...PDF_COLORS.textSoft);
  let infoY = 155;
  const infoLines = [`Date de génération : ${formatDateFr(new Date())}`];
  if (context.client.general.type) {
    infoLines.push(`Type d’établissement : ${context.client.general.type}`);
  }
  if (context.client.general.city) {
    infoLines.push(`Ville : ${context.client.general.city}`);
  }
  infoLines.push(`Période couverte : situation initiale -> ${context.latestMonthLabel}`);
  infoLines.forEach((line) => {
    doc.text(line, 18, infoY);
    infoY += 9;
  });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(...PDF_COLORS.primary);
  doc.text('Document réalisé par AnaVibe Tools — utilisable comme référence commerciale.', 18, pageHeight - 20);
}

function generateCaseStudyPdf(clientId) {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    window.alert('Le module de génération PDF n’a pas pu se charger. Rechargez la page et réessayez.');
    return;
  }

  const context = buildCaseStudyContext(clientId);
  if (!context) {
    window.alert('Ajoutez au moins un mois de données avant de générer une étude de cas.');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const state = createPdfState(doc);

  drawCaseStudyCoverPage(doc, context);
  doc.addPage();
  state.cursorY = state.marginTop;

  addPdfSectionTitle(state, '1. Présentation du client');
  addPdfParagraph(state, buildCaseStudyPresentationText(context.client));

  addPdfSectionTitle(state, '2. Situation avant AnaVibe');
  addPdfSubTitle(state, 'Problématiques');
  addPdfBulletList(state, context.problems);
  addPdfSubTitle(state, 'Difficultés');
  addPdfBulletList(state, context.difficulties);

  addPdfSectionTitle(state, '3. Actions mises en place');
  caseStudyActionCategories.forEach((category) => {
    addPdfSubTitle(state, category.title);
    const items = context.actionsByCategory[category.key];
    if (items.length) {
      addPdfBulletList(state, items);
    } else {
      addPdfParagraph(state, 'Optimisations en cours sur ce levier.');
    }
  });

  doc.addPage();
  state.cursorY = state.marginTop;
  addPdfSectionTitle(state, '4. Résultats obtenus');
  addPdfTable(
    state,
    [
      { header: 'Indicateur', width: 70 },
      { header: 'Avant AnaVibe', width: 40 },
      { header: 'Aujourd’hui', width: 34 },
      { header: 'Évolution', width: 30 }
    ],
    context.beforeAfterRows.map((row) => {
      const evolution = computeEvolution(row.initial, row.current);
      const fmt = formatEvolution(evolution, row.unit);
      const color =
        fmt.badgeClass === 'positive' ? PDF_COLORS.positive : fmt.badgeClass === 'negative' ? PDF_COLORS.negative : PDF_COLORS.textSoft;
      return [{ text: row.label }, { text: formatValue(row.initial, row.unit) }, { text: formatValue(row.current, row.unit) }, { text: fmt.text, color }];
    })
  );
  const objText = context.objectivesSummary.total
    ? `Objectifs du mois en cours (${context.latestMonthLabel}) : ${context.objectivesSummary.done}/${context.objectivesSummary.total} atteints (${Math.round(context.objectivesSummary.rate)}%).`
    : `Aucun objectif enregistré pour le mois en cours (${context.latestMonthLabel}).`;
  addPdfParagraph(state, objText);

  doc.addPage();
  state.cursorY = state.marginTop;
  addPdfSectionTitle(state, '5. Graphiques — avant / après');
  const chartRows = [...context.beforeAfterRows]
    .filter((row) => computeEvolution(row.initial, row.current).percent !== null)
    .sort((a, b) => computeEvolution(b.initial, b.current).percent - computeEvolution(a.initial, a.current).percent)
    .slice(0, 4);

  const chartColumnWidth = 84;
  const chartRowHeight = 58;
  const chartGap = 6;
  chartRows.forEach((row, index) => {
    const imageData = createBeforeAfterBarChartImage(row.label, row.initial, row.current);
    const column = index % 2;
    if (column === 0) {
      ensurePdfSpace(state, chartRowHeight + 6);
    }
    const x = state.marginLeft + column * (chartColumnWidth + chartGap);
    doc.addImage(imageData, 'PNG', x, state.cursorY, chartColumnWidth, chartRowHeight);
    if (column === 1 || index === chartRows.length - 1) {
      state.cursorY += chartRowHeight + 6;
    }
  });

  addPdfSectionTitle(state, '6. Chiffres clés');
  addPdfKpiCardGrid(state, chartRows.length ? chartRows : context.beforeAfterRows.slice(0, 6));

  doc.addPage();
  state.cursorY = state.marginTop;
  addPdfSectionTitle(state, '7. Témoignage client');
  if (context.testimonial) {
    addPdfTestimonial(state, context.testimonial, context.client.general.name);
  } else {
    addPdfParagraph(state, 'Aucun témoignage n’a encore été renseigné pour ce client.');
  }

  addPdfSectionTitle(state, '8. Conclusion');
  addPdfParagraph(state, context.conclusion);

  addPdfFootersAndPageNumbers(doc, context.client.general.name || 'ce client', 'Étude de cas');

  const fileName = `Etude-de-cas-AnaVibe-${normalizeId(context.client.general.name || clientId)}.pdf`;
  doc.save(fileName);
}

function createNoSelectionCard() {
  const card = document.createElement('div');
  card.className = 'client-dashboard-card card no-selection-card';
  card.innerHTML = `
    <p class="eyebrow">Aucune fiche ouverte</p>
    <h3>Sélectionnez un client</h3>
    <p>Cliquez sur « Ouvrir » dans la liste des clients pour afficher sa fiche dédiée.</p>
  `;
  return card;
}

function renderDashboard() {
  const list = document.getElementById('clientList');
  const container = document.getElementById('clientDashboards');
  const emptyState = document.getElementById('emptyState');
  const addClientButton = document.getElementById('addClientButton');

  if (!list || !container) {
    return;
  }

  resetDemoDataOnce();

  let activeClientId = window.location.hash.replace('#', '') || null;

  const showActiveCard = () => {
    container.querySelectorAll('.client-dashboard-card[data-client-id]').forEach((card) => {
      card.classList.toggle('hidden', card.dataset.clientId !== activeClientId);
    });
    const noSelectionCard = container.querySelector('.no-selection-card');
    if (noSelectionCard) {
      noSelectionCard.classList.toggle('hidden', Boolean(activeClientId));
    }
  };

  const openClient = (id) => {
    activeClientId = id;
    window.location.hash = id;
    showActiveCard();
  };

  const backToList = () => {
    activeClientId = null;
    history.replaceState(null, '', window.location.pathname + window.location.search);
    showActiveCard();
  };

  const mountAll = () => {
    const ids = getClientIds();
    list.innerHTML = '';
    container.innerHTML = '';

    if (!ids.length) {
      emptyState?.classList.remove('hidden');
      return;
    }

    emptyState?.classList.add('hidden');

    if (!activeClientId || !ids.includes(activeClientId)) {
      activeClientId = ids[0] || null;
    }

    ids.forEach((id) => {
      const data = getClientData(id);
      if (!data) {
        return;
      }

      const row = document.createElement('div');
      row.className = 'client-item';
      row.dataset.clientId = id;
      row.innerHTML = `
        <div>
          <strong>${escapeHtml(data.general.name)}</strong>
          <p>${escapeHtml(data.general.type || 'Client')}</p>
        </div>
        <button class="client-open-btn" type="button" data-client-id="${id}">Ouvrir</button>
      `;
      row.querySelector('.client-open-btn').addEventListener('click', () => openClient(id));
      list.appendChild(row);

      const card = createDashboardCard(id);
      card.querySelector('.back-to-list-btn')?.addEventListener('click', backToList);
      container.appendChild(card);
    });

    container.appendChild(createNoSelectionCard());
    showActiveCard();
  };

  addClientButton?.addEventListener('click', () => {
    const name = window.prompt('Nom du nouveau client :');
    if (!name) {
      return;
    }

    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }

    const ids = getClientIds();
    const id = normalizeId(trimmed);
    if (!id || ids.includes(id)) {
      window.alert('Ce client existe deja.');
      return;
    }

    ids.push(id);
    saveClientIds(ids);
    saveClientData(id, createEmptyClientData(id, trimmed));

    activeClientId = id;
    window.location.hash = id;
    mountAll();
  });

  mountAll();
}

document.addEventListener('DOMContentLoaded', () => {
  setupMobileMenu();
  highlightCurrentNav();
  renderDashboard();
});
