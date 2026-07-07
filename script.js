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
    months: {},
    monthOrder: [],
    selectedMonth: null,
    internalNotes: ''
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
    initialSituation: {
      googleRating: 4.3,
      googleReviews: 96,
      googleViews: 1800,
      googleCalls: 55,
      googleDirections: 102,
      googleWebsiteClicks: 30,
      instagramFollowers: 1500,
      instagramReach: 6000,
      instagramViews: 2000,
      instagramInteractions: 400,
      instagramProfileVisits: 200,
      instagramLinkClicks: 30
    },
    months: {
      'juin-2026': {
        label: 'Juin 2026',
        googleBusiness: {
          rating: 4.5,
          reviewsCount: 110,
          newReviews: 5,
          reviewsAnswered: 4,
          profileViews: 2100,
          calls: 70,
          directions: 130,
          websiteClicks: 48,
          bookings: 24,
          photosPublished: 4,
          googlePosts: 3
        },
        instagram: {
          followers: 1700,
          newFollowers: 30,
          reach: 7800,
          impressions: 12800,
          views: 2600,
          interactions: 520,
          engagementRate: 3.8,
          profileVisits: 260,
          linkClicks: 45,
          posts: 6,
          reels: 2,
          stories: 10
        },
        facebook: { followers: 900, reach: 2800, impressions: 4400, interactions: 180, linkClicks: 18, posts: 4 },
        beacons: { bookingClicks: 60, phoneClicks: 33, directionsClicks: 50 },
        businessResults: {
          bookingsGenerated: 24,
          estimatedRevenue: 3600,
          roi: 2.6,
          goalReached: 'Partiel',
          remainingPotential: 2200
        },
        monthlyObjectives: [
          { id: 'obj-boris-j1', label: 'Optimiser la fiche Google Business', done: true },
          { id: 'obj-boris-j2', label: 'Lancer le premier mois de contenu Instagram', done: true }
        ],
        actionPlan: [
          { id: 'act-boris-j1', label: 'Audit initial', status: 'Terminé' },
          { id: 'act-boris-j2', label: 'Configuration Google Business', status: 'Terminé' }
        ]
      },
      'juillet-2026': {
        label: 'Juillet 2026',
        googleBusiness: {
          rating: 4.7,
          reviewsCount: 128,
          newReviews: 9,
          reviewsAnswered: 7,
          profileViews: 2450,
          calls: 86,
          directions: 154,
          websiteClicks: 61,
          bookings: 32,
          photosPublished: 6,
          googlePosts: 4
        },
        instagram: {
          followers: 1840,
          newFollowers: 45,
          reach: 9200,
          impressions: 15400,
          views: 3100,
          interactions: 620,
          engagementRate: 4.2,
          profileVisits: 310,
          linkClicks: 58,
          posts: 8,
          reels: 3,
          stories: 14
        },
        facebook: { followers: 960, reach: 3200, impressions: 5100, interactions: 210, linkClicks: 24, posts: 5 },
        beacons: { bookingClicks: 74, phoneClicks: 41, directionsClicks: 62 },
        businessResults: {
          bookingsGenerated: 32,
          estimatedRevenue: 4200,
          roi: 3.1,
          goalReached: 'Partiel',
          remainingPotential: 1800
        },
        monthlyObjectives: [
          { id: 'obj-boris-1', label: 'Répondre à tous les avis Google', done: true },
          { id: 'obj-boris-2', label: 'Publier 8 posts Instagram', done: false },
          { id: 'obj-boris-3', label: 'Lancer une offre via les Beacons réservation', done: false }
        ],
        actionPlan: [
          { id: 'act-boris-1', label: 'Optimiser la fiche Google Business', status: 'Terminé' },
          { id: 'act-boris-2', label: 'Créer un calendrier de contenu Instagram', status: 'En cours' },
          { id: 'act-boris-3', label: 'Mettre en place les Beacons', status: 'À faire' }
        ]
      }
    },
    monthOrder: ['juin-2026', 'juillet-2026'],
    selectedMonth: 'juillet-2026',
    internalNotes: 'Client réactif, bon potentiel de croissance sur la visibilité locale.'
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
    initialSituation: {
      googleRating: 4.1,
      googleReviews: 52,
      googleViews: 1200,
      googleCalls: 25,
      googleDirections: 60,
      googleWebsiteClicks: 22,
      instagramFollowers: 2400,
      instagramReach: 11000,
      instagramViews: 4000,
      instagramInteractions: 700,
      instagramProfileVisits: 380,
      instagramLinkClicks: 60
    },
    months: {
      'juin-2026': {
        label: 'Juin 2026',
        googleBusiness: {
          rating: 4.3,
          reviewsCount: 64,
          newReviews: 4,
          reviewsAnswered: 4,
          profileViews: 1450,
          calls: 33,
          directions: 74,
          websiteClicks: 36,
          bookings: 14,
          photosPublished: 6,
          googlePosts: 5
        },
        instagram: {
          followers: 2800,
          newFollowers: 70,
          reach: 13200,
          impressions: 21000,
          views: 4700,
          interactions: 850,
          engagementRate: 4.7,
          profileVisits: 470,
          linkClicks: 82,
          posts: 10,
          reels: 4,
          stories: 17
        },
        facebook: { followers: 1150, reach: 3700, impressions: 6000, interactions: 270, linkClicks: 32, posts: 6 },
        beacons: { bookingClicks: 44, phoneClicks: 22, directionsClicks: 38 },
        businessResults: {
          bookingsGenerated: 14,
          estimatedRevenue: 2300,
          roi: 2.0,
          goalReached: 'Partiel',
          remainingPotential: 1200
        },
        monthlyObjectives: [
          { id: 'obj-toast-j1', label: 'Diagnostic de marque', done: true },
          { id: 'obj-toast-j2', label: 'Lancer le calendrier éditorial', done: true }
        ],
        actionPlan: [
          { id: 'act-toast-j1', label: 'Diagnostic de marque', status: 'Terminé' },
          { id: 'act-toast-j2', label: 'Premier calendrier éditorial', status: 'Terminé' }
        ]
      },
      'juillet-2026': {
        label: 'Juillet 2026',
        googleBusiness: {
          rating: 4.5,
          reviewsCount: 76,
          newReviews: 6,
          reviewsAnswered: 6,
          profileViews: 1680,
          calls: 40,
          directions: 88,
          websiteClicks: 45,
          bookings: 18,
          photosPublished: 9,
          googlePosts: 6
        },
        instagram: {
          followers: 3120,
          newFollowers: 96,
          reach: 15200,
          impressions: 24800,
          views: 5400,
          interactions: 980,
          engagementRate: 5.1,
          profileVisits: 540,
          linkClicks: 97,
          posts: 12,
          reels: 5,
          stories: 20
        },
        facebook: { followers: 1240, reach: 4100, impressions: 6700, interactions: 305, linkClicks: 38, posts: 7 },
        beacons: { bookingClicks: 52, phoneClicks: 28, directionsClicks: 45 },
        businessResults: {
          bookingsGenerated: 18,
          estimatedRevenue: 2950,
          roi: 2.4,
          goalReached: 'Oui',
          remainingPotential: 900
        },
        monthlyObjectives: [
          { id: 'obj-toast-1', label: 'Publier le calendrier éditorial du mois', done: true },
          { id: 'obj-toast-2', label: 'Améliorer le taux d’engagement Instagram', done: true },
          { id: 'obj-toast-3', label: 'Répondre aux nouveaux avis Google', done: false }
        ],
        actionPlan: [
          { id: 'act-toast-1', label: 'Diagnostic de marque', status: 'Terminé' },
          { id: 'act-toast-2', label: 'Calendrier éditorial', status: 'En cours' },
          { id: 'act-toast-3', label: 'Optimisation de la présence locale', status: 'En cours' }
        ]
      }
    },
    monthOrder: ['juin-2026', 'juillet-2026'],
    selectedMonth: 'juillet-2026',
    internalNotes: 'Forte dynamique sur Instagram, continuer la régularité de publication.'
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
  return Number(value).toLocaleString('fr-FR', { maximumFractionDigits: 2 });
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

function renderComparisonTable(section, fields, monthData, previousMonthData, initialSituation) {
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
  fields.forEach((field) => {
    const current = monthData[section.key][field.key];
    const previous = previousMonthData ? previousMonthData[section.key][field.key] : '';
    const initial = getBaselineValue(initialSituation, section.key, field.key);

    tbody.appendChild(createComparisonRow(field, { initial, previous, current, unit: field.unit }));
  });

  wrapper.appendChild(table);
  return wrapper;
}

function renderMonthlySectionWithComparison(section, monthKey, monthData, previousMonthData, initialSituation) {
  const block = renderFieldSection(section, monthKey);
  fillFieldValues(block, monthData);

  const numericFields = section.fields.filter((field) => field.type === 'number');
  if (numericFields.length) {
    block.appendChild(renderComparisonTable(section, numericFields, monthData, previousMonthData, initialSituation));
  }

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

  article.appendChild(renderFieldSection(generalFieldsSchema));
  article.appendChild(renderFieldSection(initialSituationSchema));
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
    </div>
    <form class="inline-add-form" data-role="month-add-form">
      <input type="text" placeholder="Nouveau mois (ex : Août 2026)" required />
      <button type="submit" class="client-open-btn">Ajouter un mois</button>
    </form>
  `;
  article.appendChild(monthControlBlock);

  const monthContent = document.createElement('div');
  monthContent.dataset.role = 'month-content';
  article.appendChild(monthContent);

  const monthSelect = monthControlBlock.querySelector('[data-role="month-select"]');
  const monthAddForm = monthControlBlock.querySelector('[data-role="month-add-form"]');

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

    monthContent.appendChild(renderSummaryCards(monthData, previousMonthData, freshData.initialSituation));
    monthContent.appendChild(renderSynthesisSection(monthData, previousMonthData, freshData.initialSituation));

    monthlySectionSchema.forEach((section) => {
      monthContent.appendChild(
        renderMonthlySectionWithComparison(section, selectedMonth, monthData, previousMonthData, freshData.initialSituation)
      );
    });

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

    freshData.months[key] = createEmptyMonthData(label);
    freshData.monthOrder.push(key);
    freshData.selectedMonth = key;
    saveClientData(clientId, freshData);
    input.value = '';
    refreshMonthContent();
  });

  refreshMonthContent();

  article.appendChild(renderNotesSection(clientId, data));

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
