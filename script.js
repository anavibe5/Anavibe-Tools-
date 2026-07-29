const CLIENT_IDS_KEY = 'anavibe-tools-client-ids';
const CLIENT_DATA_PREFIX = 'anavibe-tools-client-data-';

const actionStatusOptions = ['À faire', 'En cours', 'Terminé'];

// KPI qu'un objectif mensuel peut cibler. Un objectif qui associe un de ces KPI + une valeur
// cible est "quantitatif" (mesurable) ; un objectif texte libre sans KPI reste "qualitatif" et
// n'entre jamais dans le calcul du taux d'objectifs atteints (cf. computeObjectivesRate).
const objectiveKpiOptions = [
  { section: 'instagram', field: 'reach', label: 'Portée Instagram' },
  { section: 'instagram', field: 'profileVisits', label: 'Visites de profil Instagram' },
  { section: 'instagram', field: 'linkClicks', label: 'Clics sur le lien Instagram' },
  { section: 'instagram', field: 'followers', label: 'Abonnés Instagram' },
  { section: 'instagram', field: 'interactions', label: 'Interactions Instagram' },
  { section: 'googleBusiness', field: 'calls', label: 'Appels Google' },
  { section: 'googleBusiness', field: 'websiteClicks', label: 'Clics site Google' },
  { section: 'googleBusiness', field: 'bookings', label: 'Réservations Google' },
  { section: 'googleBusiness', field: 'reviewsCount', label: 'Avis Google' },
  { section: 'facebook', field: 'pageVisits', label: 'Visites de la page Facebook' },
  { section: 'tiktok', field: 'views', label: 'Vues TikTok' },
  { section: 'tiktok', field: 'profileVisits', label: 'Visites de profil TikTok' },
  { section: 'tiktok', field: 'linkClicks', label: 'Clics sur le lien TikTok' },
  { section: 'tiktok', field: 'followers', label: 'Abonnés TikTok' },
  { section: 'beacons', field: 'bookingClicks', label: 'Clics réservation Beacons' }
];

function findObjectiveKpiOption(section, field) {
  return objectiveKpiOptions.find((option) => option.section === section && option.field === field) || null;
}

function buildObjectivePdfLabel(objective, monthData) {
  if (!isObjectiveQuantitative(objective)) {
    return `${objective.label} (objectif qualitatif — non mesurable en l’état)`;
  }
  const kpiOption = findObjectiveKpiOption(objective.kpiSection, objective.kpiField);
  const progress = computeObjectiveProgress(objective, monthData);
  const parts = [`${kpiOption ? kpiOption.label : objective.kpiField} → cible ${formatNumber(objective.targetValue)}`];
  if (progress !== null) {
    parts.push(`${Math.round(progress)}% de la cible`);
  }
  if (objective.deadline) {
    parts.push(`échéance ${objective.deadline}`);
  }
  return `${objective.label} (${parts.join(', ')})`;
}

// Un objectif est "quantitatif" seulement s'il possède un KPI associé ET une valeur cible :
// un objectif texte libre (ancien format ou nouveau sans KPI choisi) reste "qualitatif".
function isObjectiveQuantitative(objective) {
  return Boolean(objective && objective.kpiSection && objective.kpiField && hasValue(objective.targetValue));
}

// Progression vers la cible en %, calculée sur (valeur actuelle - référence) / (cible - référence).
// Sans référence exploitable (ou référence = cible), on retombe sur un simple ratio actuel/cible.
function computeObjectiveProgress(objective, monthData) {
  if (!isObjectiveQuantitative(objective) || !monthData) {
    return null;
  }
  const section = monthData[objective.kpiSection];
  if (!section) {
    return null;
  }
  const current = parseMetricValue(section[objective.kpiField]);
  const target = parseMetricValue(objective.targetValue);
  if (current === null || target === null) {
    return null;
  }
  const baseline = parseMetricValue(objective.baselineValue);
  if (baseline === null || baseline === target) {
    return target !== 0 ? clamp((current / target) * 100, 0, 150) : null;
  }
  return clamp(((current - baseline) / (target - baseline)) * 100, 0, 150);
}

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
    },
    { key: 'averageBasket', label: 'Panier moyen (€)', type: 'number' },
    { key: 'monthlyFee', label: 'Prix payé pour la prestation AnaVibe (€/mois)', type: 'number' }
  ]
};

const initialSituationSchema = {
  key: 'initialSituation',
  eyebrow: 'Point de départ',
  title: 'Situation initiale',
  fields: [
    { key: 'googleRating', label: 'Note Google initiale', type: 'metric', step: '0.1', platform: 'googleBusiness' },
    { key: 'googleReviews', label: 'Avis Google initiaux', type: 'metric', platform: 'googleBusiness' },
    { key: 'googleViews', label: 'Vues Google initiales', type: 'metric', platform: 'googleBusiness' },
    { key: 'googleCalls', label: 'Appels Google initiaux', type: 'metric', platform: 'googleBusiness' },
    { key: 'googleDirections', label: 'Itinéraires initiaux', type: 'metric', platform: 'googleBusiness' },
    { key: 'googleWebsiteClicks', label: 'Clics site initiaux', type: 'metric', platform: 'googleBusiness' },
    { key: 'instagramFollowers', label: 'Abonnés Instagram initiaux', type: 'metric', platform: 'instagram' },
    { key: 'instagramReach', label: 'Portée Instagram initiale', type: 'metric', platform: 'instagram' },
    { key: 'instagramViews', label: 'Vues Instagram initiales', type: 'metric', platform: 'instagram' },
    { key: 'instagramInteractions', label: 'Interactions initiales', type: 'metric', platform: 'instagram' },
    { key: 'instagramProfileVisits', label: 'Visites profil initiales', type: 'metric', platform: 'instagram' },
    { key: 'instagramLinkClicks', label: 'Clics lien initiaux', type: 'metric', platform: 'instagram' },
    { key: 'facebookFollowers', label: 'Abonnés Facebook initiaux', type: 'metric', platform: 'facebook' },
    { key: 'facebookPageVisits', label: 'Visites de la page Facebook initiales', type: 'metric', platform: 'facebook' },
    { key: 'facebookViews', label: 'Vues Facebook initiales', type: 'metric', platform: 'facebook' },
    { key: 'facebookInteractions', label: 'Interactions Facebook initiales', type: 'metric', platform: 'facebook' },
    { key: 'tiktokFollowers', label: 'Abonnés TikTok initiaux', type: 'metric', platform: 'tiktok' },
    { key: 'tiktokViews', label: 'Vues TikTok initiales', type: 'metric', platform: 'tiktok' },
    { key: 'tiktokInteractions', label: 'Interactions TikTok initiales', type: 'metric', platform: 'tiktok' },
    { key: 'tiktokProfileVisits', label: 'Visites profil TikTok initiales', type: 'metric', platform: 'tiktok' },
    { key: 'tiktokLinkClicks', label: 'Clics lien TikTok initiaux', type: 'metric', platform: 'tiktok' }
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
  instagramLinkClicks: { section: 'instagram', field: 'linkClicks' },
  facebookFollowers: { section: 'facebook', field: 'followers' },
  facebookPageVisits: { section: 'facebook', field: 'pageVisits' },
  facebookViews: { section: 'facebook', field: 'views' },
  facebookInteractions: { section: 'facebook', field: 'interactions' },
  tiktokFollowers: { section: 'tiktok', field: 'followers' },
  tiktokViews: { section: 'tiktok', field: 'views' },
  tiktokInteractions: { section: 'tiktok', field: 'interactions' },
  tiktokProfileVisits: { section: 'tiktok', field: 'profileVisits' },
  tiktokLinkClicks: { section: 'tiktok', field: 'linkClicks' }
};

// Réseaux que l'app sait suivre ; chaque client choisit lesquels sont réellement dans sa
// prestation (cf. general.trackedPlatforms) pour ne jamais l'obliger à remplir des champs
// pour un réseau qu'il ne suit pas.
const trackablePlatformOptions = [
  { key: 'googleBusiness', label: 'Google Business' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'tiktok', label: 'TikTok' }
];

function createDefaultTrackedPlatforms() {
  return { googleBusiness: true, instagram: true, facebook: true, tiktok: false };
}

// Un réseau non répertorié dans trackedPlatforms (ex: anciennes données, ou "beacons"/
// "businessResults" qui ne sont pas des réseaux) reste visible par défaut.
function isPlatformTracked(trackedPlatforms, platformKey) {
  if (!platformKey || !trackedPlatforms || !(platformKey in trackedPlatforms)) {
    return true;
  }
  return trackedPlatforms[platformKey] !== false;
}

function filterFieldsByTrackedPlatforms(fields, trackedPlatforms) {
  return fields.filter((field) => isPlatformTracked(trackedPlatforms, field.platform));
}

function getVisibleMonthlySections(trackedPlatforms) {
  return monthlySectionSchema.filter((section) => isPlatformTracked(trackedPlatforms, section.key));
}

const monthlySectionSchema = [
  {
    key: 'googleBusiness',
    eyebrow: 'Réseaux & visibilité',
    title: 'Google Business',
    fields: [
      { key: 'rating', label: 'Note Google', type: 'metric', step: '0.1' },
      { key: 'reviewsCount', label: 'Nombre total d’avis', type: 'metric' },
      { key: 'newReviews', label: 'Nouveaux avis reçus (période)', type: 'metric' },
      { key: 'reviewsAnswered', label: 'Nombre total d’avis répondus', type: 'metric' },
      { key: 'newReviewsAnswered', label: 'Nouveaux avis répondus (période)', type: 'metric' },
      { key: 'profileViews', label: 'Vues de la fiche', type: 'metric' },
      { key: 'calls', label: 'Appels', type: 'metric' },
      { key: 'directions', label: 'Itinéraires', type: 'metric' },
      { key: 'websiteClicks', label: 'Clics vers le site', type: 'metric' },
      { key: 'bookings', label: 'Réservations', type: 'metric' },
      { key: 'photosPublished', label: 'Photos publiées', type: 'metric' },
      { key: 'googlePosts', label: 'Publications Google', type: 'metric' }
    ]
  },
  {
    key: 'instagram',
    eyebrow: 'Réseaux & visibilité',
    title: 'Instagram',
    fields: [
      { key: 'followers', label: 'Abonnés', type: 'metric' },
      { key: 'reach', label: 'Portée', type: 'metric' },
      { key: 'views', label: 'Vues', type: 'metric' },
      { key: 'interactions', label: 'Interactions', type: 'metric' },
      { key: 'engagementRate', label: 'Taux d’engagement déclaré (source Instagram, méthode propre à la plateforme)', type: 'metric', unit: '%' },
      { key: 'profileVisits', label: 'Visites du profil', type: 'metric' },
      { key: 'linkClicks', label: 'Clics sur le lien', type: 'metric' },
      { key: 'posts', label: 'Publications', type: 'metric' },
      { key: 'reels', label: 'Reels', type: 'metric' },
      { key: 'stories', label: 'Stories', type: 'metric' }
    ]
  },
  {
    key: 'facebook',
    eyebrow: 'Réseaux & visibilité',
    title: 'Facebook',
    fields: [
      { key: 'followers', label: 'Abonnés', type: 'metric' },
      { key: 'pageVisits', label: 'Visites de la page', type: 'metric' },
      { key: 'views', label: 'Vues', type: 'metric' },
      { key: 'interactions', label: 'Interactions', type: 'metric' },
      { key: 'linkClicks', label: 'Clics lien', type: 'metric' },
      { key: 'posts', label: 'Publications', type: 'metric' }
    ]
  },
  {
    key: 'tiktok',
    eyebrow: 'Réseaux & visibilité',
    title: 'TikTok',
    fields: [
      { key: 'followers', label: 'Abonnés', type: 'metric' },
      { key: 'views', label: 'Vues', type: 'metric' },
      { key: 'interactions', label: 'Interactions (likes, commentaires, partages)', type: 'metric' },
      { key: 'profileVisits', label: 'Visites du profil', type: 'metric' },
      { key: 'linkClicks', label: 'Clics sur le lien', type: 'metric' },
      { key: 'posts', label: 'Publications', type: 'metric' }
    ]
  },
  {
    key: 'beacons',
    eyebrow: 'Réseaux & visibilité',
    title: 'Beacons',
    fields: [
      { key: 'bookingClicks', label: 'Clics réservation', type: 'metric' },
      { key: 'phoneClicks', label: 'Clics téléphone', type: 'metric' },
      { key: 'directionsClicks', label: 'Clics itinéraire', type: 'metric' }
    ]
  },
  {
    key: 'businessResults',
    eyebrow: 'Performance',
    title: 'Résultats business',
    fields: [
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
    instagramLinkClicks: '',
    facebookFollowers: '',
    facebookPageVisits: '',
    facebookViews: '',
    facebookInteractions: '',
    tiktokFollowers: '',
    tiktokViews: '',
    tiktokInteractions: '',
    tiktokProfileVisits: '',
    tiktokLinkClicks: ''
  };
}

function createEmptyMonthData(label) {
  return {
    label,
    createdAt: new Date().toISOString(),
    googleBusiness: {
      rating: '',
      reviewsCount: '',
      newReviews: '',
      reviewsAnswered: '',
      newReviewsAnswered: '',
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
      reach: '',
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
      pageVisits: '',
      views: '',
      interactions: '',
      linkClicks: '',
      posts: ''
    },
    tiktok: {
      followers: '',
      views: '',
      interactions: '',
      profileVisits: '',
      linkClicks: '',
      posts: ''
    },
    beacons: {
      bookingClicks: '',
      phoneClicks: '',
      directionsClicks: ''
    },
    businessResults: {
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
      monthStatus: 'À définir',
      averageBasket: '',
      monthlyFee: '',
      trackedPlatforms: createDefaultTrackedPlatforms()
    },
    initialSituation: createEmptyInitialSituation(),
    strategicProfile: createEmptyClientStrategicProfile(),
    months: {},
    monthOrder: [],
    selectedMonth: null,
    internalNotes: '',
    caseStudyTestimonial: '',
    history: [],
    contentPlannerHistory: []
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
      monthStatus: 'En bonne voie',
      averageBasket: '',
      monthlyFee: '',
      trackedPlatforms: createDefaultTrackedPlatforms()
    },
    initialSituation: createEmptyInitialSituation(),
    strategicProfile: createEmptyClientStrategicProfile(),
    months: {},
    monthOrder: [],
    selectedMonth: null,
    internalNotes: '',
    caseStudyTestimonial: '',
    history: [],
    contentPlannerHistory: []
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
      monthStatus: 'Objectif atteint',
      averageBasket: '',
      monthlyFee: '',
      trackedPlatforms: createDefaultTrackedPlatforms()
    },
    initialSituation: createEmptyInitialSituation(),
    strategicProfile: createEmptyClientStrategicProfile(),
    months: {},
    monthOrder: [],
    selectedMonth: null,
    internalNotes: '',
    caseStudyTestimonial: '',
    history: [],
    contentPlannerHistory: []
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
    internalNotes: data.internalNotes || '',
    caseStudyTestimonial: data.caseStudyTestimonial || '',
    history: data.history || [],
    contentPlannerHistory: data.contentPlannerHistory || []
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
      if (parsed.general && parsed.general.averageBasket === undefined) {
        parsed.general.averageBasket = '';
        parsed.general.monthlyFee = '';
      }
      if (parsed.general && !parsed.general.trackedPlatforms) {
        // Un client existant utilisait déjà Google/Instagram/Facebook sans distinction : on
        // les active tous par défaut pour ne rien changer à ce qu'il voyait déjà. TikTok, lui,
        // est nouveau et reste décoché tant qu'il n'est pas explicitement activé.
        parsed.general.trackedPlatforms = createDefaultTrackedPlatforms();
      }
      if (!parsed.strategicProfile) {
        parsed.strategicProfile = migrateClientDnaToStrategicProfile(parsed.clientDna) || createEmptyClientStrategicProfile();
        delete parsed.clientDna;
        saveClientData(id, parsed);
      }
      if (!Array.isArray(parsed.history)) {
        parsed.history = [];
      }
      if (!Array.isArray(parsed.contentPlannerHistory)) {
        parsed.contentPlannerHistory = [];
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

const CLIENT_HISTORY_EVENT_TYPES = {
  audit: { icon: '🔎', label: 'Audit' },
  roadmap: { icon: '🗺', label: 'Roadmap' },
  'report-pdf': { icon: '📄', label: 'Rapport PDF' },
  'case-study': { icon: '📚', label: 'Étude de cas' },
  planner: { icon: '📅', label: 'Content Planner' },
  export: { icon: '📤', label: 'Export' }
};

const CLIENT_HISTORY_MAX_EVENTS = 200;

// Shared, append-only activity log written by every module that touches a Dashboard
// client (Audit Pro, Google Optimizer, Content Planner, Dashboard itself), read back by
// the client's Historique timeline. Never modifies anything else on the client record.
function appendClientHistoryEvent(clientId, type, label) {
  if (typeof getClientData !== 'function' || typeof saveClientData !== 'function' || !clientId) {
    return;
  }
  const data = getClientData(clientId);
  if (!data) {
    return;
  }
  if (!Array.isArray(data.history)) {
    data.history = [];
  }
  data.history.push({
    id: generateId(),
    type,
    label,
    date: new Date().toISOString()
  });
  if (data.history.length > CLIENT_HISTORY_MAX_EVENTS) {
    data.history = data.history.slice(data.history.length - CLIENT_HISTORY_MAX_EVENTS);
  }
  saveClientData(clientId, data);
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
    if (field.type === 'date') {
      input.type = 'date';
    } else if (field.type === 'number') {
      input.type = 'number';
      if (field.step) {
        input.step = field.step;
      }
    } else if (field.type === 'metric') {
      // Texte plutôt que <input type="number"> : un champ number natif refuse les abréviations
      // comme "4,1k" ou "8.5K", que le consultant doit pouvoir saisir directement. La valeur est
      // ensuite interprétée par parseMetricValue() partout où elle est utilisée (calculs, textes,
      // tableaux) au lieu d'être lue comme le nombre littéral.
      input.type = 'text';
      input.inputMode = 'decimal';
      input.placeholder = 'Ex : 4100 ou 4,1k';
    } else {
      input.type = 'text';
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

// Certains clients n'incluent pas tous les réseaux dans leur prestation (ex : pas de Google
// Business mais du TikTok) : cette section permet de choisir, par client, quels réseaux sont
// réellement suivis. Les autres n'apparaissent plus ni dans la situation initiale, ni dans le
// suivi mensuel, ni dans l'analyse générée — sans jamais obliger à remplir un champ inutile.
function renderTrackedPlatformsSection(clientId, onChange) {
  const block = document.createElement('div');
  block.className = 'section-block';
  block.innerHTML = `
    <div class="section-heading">
      <div>
        <p class="eyebrow">Configuration client</p>
        <h3>Réseaux suivis pour ce client</h3>
      </div>
    </div>
    <p class="notes-hint">Cochez uniquement les réseaux réellement inclus dans la prestation de ce client. Les réseaux décochés disparaissent de la situation initiale, du suivi mensuel et de l’analyse.</p>
    <div class="platform-checklist" data-role="tracked-platforms-checklist"></div>
  `;

  const list = block.querySelector('[data-role="tracked-platforms-checklist"]');
  const data = getClientData(clientId);
  const tracked = data.general.trackedPlatforms || createDefaultTrackedPlatforms();

  trackablePlatformOptions.forEach((platform) => {
    const isChecked = tracked[platform.key] !== false;
    const label = document.createElement('label');
    label.className = `platform-option${isChecked ? ' checked' : ''}`;
    label.innerHTML = `
      <input type="checkbox" ${isChecked ? 'checked' : ''} />
      <span>${escapeHtml(platform.label)}</span>
    `;
    const checkbox = label.querySelector('input');
    checkbox.addEventListener('change', () => {
      const freshData = getClientData(clientId);
      if (!freshData.general.trackedPlatforms) {
        freshData.general.trackedPlatforms = createDefaultTrackedPlatforms();
      }
      freshData.general.trackedPlatforms[platform.key] = checkbox.checked;
      saveClientData(clientId, freshData);
      label.classList.toggle('checked', checkbox.checked);
      if (onChange) {
        onChange();
      }
    });
    list.appendChild(label);
  });

  return block;
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

// Interprète une saisie de KPI en nombre, en tolérant la virgule décimale française et les
// suffixes abrégés « k »/« K » (milliers) et « m »/« M » (millions), pour qu'une saisie comme
// « 4,1k » ou « 8.5K » soit convertie en 4100 / 8500 avant tout calcul ou affichage, plutôt que
// d'être lue comme le nombre littéral 4,1 ou 8,5.
function parseMetricValue(raw) {
  if (raw === '' || raw === null || raw === undefined) {
    return null;
  }
  if (typeof raw === 'number') {
    return Number.isNaN(raw) ? null : raw;
  }
  const str = String(raw).trim();
  if (!str) {
    return null;
  }
  const match = str.match(/^(-?[\d\s.,]+)\s*(k|m)?$/i);
  if (!match) {
    const direct = Number(str.replace(',', '.'));
    return Number.isNaN(direct) ? null : direct;
  }
  let numberPart = match[1].replace(/\s/g, '');
  const suffix = match[2] ? match[2].toLowerCase() : '';
  if (numberPart.includes(',') && !numberPart.includes('.')) {
    numberPart = numberPart.replace(',', '.');
  } else {
    numberPart = numberPart.replace(/,(?=\d{3}(\D|$))/g, '');
  }
  let value = Number(numberPart);
  if (Number.isNaN(value)) {
    return null;
  }
  if (suffix === 'k') {
    value *= 1000;
  } else if (suffix === 'm') {
    value *= 1000000;
  }
  return value;
}

function formatNumber(value) {
  // Uses a plain space rather than toLocaleString's narrow no-break space (U+202F),
  // which the PDF export's core font cannot render.
  const parsed = parseMetricValue(value);
  if (parsed === null) {
    return '—';
  }
  const rounded = Math.round(parsed * 100) / 100;
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
  const parsed = parseMetricValue(value);
  if (parsed === null) {
    return '—';
  }
  return `${formatNumber(parsed)}${unitSuffix(unit)}`;
}

function computeEvolution(reference, current) {
  const refNum = parseMetricValue(reference);
  const curNum = parseMetricValue(current);

  if (refNum === null || curNum === null) {
    return { diff: null, percent: null };
  }

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
  const provided = values.filter((value) => hasValue(value));
  if (!provided.length) {
    return null;
  }
  return values.reduce((total, value) => {
    const numeric = parseMetricValue(value);
    return total + (numeric === null ? 0 : numeric);
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
  const interactions = parseMetricValue(monthData.instagram.interactions);
  const reach = parseMetricValue(monthData.instagram.reach);
  if (interactions === null || reach === null || reach === 0) {
    return null;
  }
  return (interactions / reach) * 100;
}

function computeEngagementRateFromInitial(initialSituation) {
  const interactions = parseMetricValue(initialSituation.instagramInteractions);
  const reach = parseMetricValue(initialSituation.instagramReach);
  if (interactions === null || reach === null || reach === 0) {
    return null;
  }
  return (interactions / reach) * 100;
}

// Portée / abonnés : une communauté importante avec une portée proportionnellement faible
// indique un problème de distribution (algorithme, formats peu partagés) plutôt qu'un problème
// de volume de contenu.
function computeInstagramReachRatio(monthData) {
  if (!monthData) {
    return null;
  }
  const reach = parseMetricValue(monthData.instagram.reach);
  const followers = parseMetricValue(monthData.instagram.followers);
  if (reach === null || followers === null || followers === 0) {
    return null;
  }
  return reach / followers;
}

// Visites de profil / clics lien : beaucoup de visites mais peu de clics indique un problème de
// conversion du profil (bio, lien en avant, CTA) plutôt qu'un manque de trafic.
function computeInstagramProfileConversionRatio(monthData) {
  if (!monthData) {
    return null;
  }
  const profileVisits = parseMetricValue(monthData.instagram.profileVisits);
  const linkClicks = parseMetricValue(monthData.instagram.linkClicks);
  if (profileVisits === null || linkClicks === null || profileVisits === 0) {
    return null;
  }
  return linkClicks / profileVisits;
}

function computeTiktokProfileConversionRatio(monthData) {
  if (!monthData) {
    return null;
  }
  const profileVisits = parseMetricValue(monthData.tiktok.profileVisits);
  const linkClicks = parseMetricValue(monthData.tiktok.linkClicks);
  if (profileVisits === null || linkClicks === null || profileVisits === 0) {
    return null;
  }
  return linkClicks / profileVisits;
}

function computeInstagramContentVolume(monthData) {
  if (!monthData) {
    return null;
  }
  return sumOrNull([monthData.instagram.posts, monthData.instagram.reels, monthData.instagram.stories]);
}

// « Actions à forte intention » Google Business : appels + itinéraires + clics site + réservations.
// Ce sont des actions observées, pas un nombre de clients uniques (un même client peut générer
// plusieurs actions) — ne jamais présenter cette somme comme des « clients générés ». Les 4
// champs sommés sont chacun une métrique Google Business distincte et mutuellement exclusive
// (un appel n'est pas comptabilisé comme un itinéraire, etc.), donc aucun double comptage.
function computeGoogleIntentions(monthData) {
  if (!monthData) {
    return null;
  }
  return sumOrNull([
    monthData.googleBusiness.calls,
    monthData.googleBusiness.directions,
    monthData.googleBusiness.websiteClicks,
    monthData.googleBusiness.bookings
  ]);
}

// Ratios de conversion Google Business : quelle part des vues de la fiche se transforme en
// chaque type d'action. Permet de distinguer visibilité (vues) et conversion (actions).
function computeGoogleConversionRatios(monthData) {
  if (!monthData) {
    return null;
  }
  const views = parseMetricValue(monthData.googleBusiness.profileViews);
  if (views === null || views === 0) {
    return null;
  }
  const ratio = (field) => {
    const value = parseMetricValue(monthData.googleBusiness[field]);
    return value === null ? null : value / views;
  };
  return {
    calls: ratio('calls'),
    directions: ratio('directions'),
    websiteClicks: ratio('websiteClicks'),
    bookings: ratio('bookings')
  };
}

// Ratios de conversion Beacons : quelle part des clics totaux correspond à chaque intention
// (réservation, téléphone, itinéraire).
function computeBeaconsConversionRatios(monthData) {
  if (!monthData) {
    return null;
  }
  const total = sumOrNull([monthData.beacons.bookingClicks, monthData.beacons.phoneClicks, monthData.beacons.directionsClicks]);
  if (total === null || total === 0) {
    return null;
  }
  const ratio = (field) => {
    const value = parseMetricValue(monthData.beacons[field]);
    return value === null ? null : value / total;
  };
  return {
    bookingClicks: ratio('bookingClicks'),
    phoneClicks: ratio('phoneClicks'),
    directionsClicks: ratio('directionsClicks')
  };
}

// Taux de réponse aux NOUVEAUX avis reçus sur LA période (jamais un total cumulé rapporté à un
// chiffre mensuel) : borné à 100%, et null (non applicable) si aucun nouvel avis sur la période.
function computeReviewResponseRate(monthData) {
  if (!monthData) {
    return null;
  }
  const newReviews = parseMetricValue(monthData.googleBusiness.newReviews);
  const newReviewsAnswered = parseMetricValue(monthData.googleBusiness.newReviewsAnswered);
  if (newReviews === null || newReviews === 0 || newReviewsAnswered === null) {
    return null;
  }
  return Math.min(100, Math.max(0, (newReviewsAnswered / newReviews) * 100));
}

// Réservations générées / CA estimé / ROI ne sont plus saisis à la main : le consultant ne
// sait pas toujours les calculer lui-même, donc le Dashboard les déduit des données déjà
// suivies (réservations Google + Beacons, panier moyen et prix de la prestation renseignés
// une fois dans "Informations générales").
function computeBookingsGenerated(monthData) {
  if (!monthData) {
    return null;
  }
  return sumOrNull([monthData.googleBusiness.bookings, monthData.beacons.bookingClicks]);
}

function computeEstimatedRevenue(monthData, generalData) {
  const bookings = computeBookingsGenerated(monthData);
  const averageBasket = generalData ? parseMetricValue(generalData.averageBasket) : null;
  if (bookings === null || averageBasket === null) {
    return null;
  }
  return bookings * averageBasket;
}

function computeRoi(monthData, generalData) {
  const revenue = computeEstimatedRevenue(monthData, generalData);
  const monthlyFee = generalData ? parseMetricValue(generalData.monthlyFee) : null;
  if (revenue === null || monthlyFee === null || monthlyFee === 0) {
    return null;
  }
  return revenue / monthlyFee;
}

// Un objectif qualitatif (texte libre, sans KPI/cible) n'est jamais compté ici : un objectif
// non mesurable ne doit pas pouvoir faire baisser artificiellement un taux d'atteinte.
function computeObjectivesRate(monthData) {
  if (!monthData || !monthData.monthlyObjectives.length) {
    return null;
  }
  const quantitative = monthData.monthlyObjectives.filter(isObjectiveQuantitative);
  if (!quantitative.length) {
    return null;
  }
  const done = quantitative.filter((objective) => objective.done).length;
  return (done / quantitative.length) * 100;
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

// --- Scoring en piliers explicables ------------------------------------------------------
//
// Chaque pilier est noté selon cette cascade, jamais un benchmark universel arbitraire :
//   1. par rapport à un objectif quantifié du client (KPI + cible) qui touche ce pilier ;
//   2. par rapport au mois précédent (évolution) ;
//   3. sinon : "non évalué — manque de recul" (score = null), jamais une note inventée.
// Le pilier Progression est spécifique : il n'a de sens qu'en présence d'un mois précédent, et
// n'est jamais compté comme un "recul" quand il n'y a pas encore d'historique.

const scorePillarDefinitions = [
  { key: 'visibility', label: 'Visibilité' },
  { key: 'engagement', label: 'Engagement' },
  { key: 'conversion', label: 'Conversion' },
  { key: 'intention', label: 'Intention client' },
  { key: 'regularity', label: 'Régularité / exécution' },
  { key: 'progression', label: 'Progression' }
];

const pillarSignalGetters = {
  visibility: [
    (m) => parseMetricValue(m.googleBusiness.profileViews),
    (m) => parseMetricValue(m.instagram.reach),
    (m) => parseMetricValue(m.facebook.pageVisits),
    (m) => parseMetricValue(m.tiktok.views)
  ],
  engagement: [
    (m) => parseMetricValue(m.instagram.interactions),
    (m) => parseMetricValue(m.facebook.interactions),
    (m) => parseMetricValue(m.tiktok.interactions),
    (m) => computeEngagementRate(m)
  ],
  conversion: [
    (m) => computeInstagramProfileConversionRatio(m),
    (m) => parseMetricValue(m.instagram.linkClicks),
    (m) => computeTiktokProfileConversionRatio(m),
    (m) => parseMetricValue(m.tiktok.linkClicks)
  ],
  intention: [(m) => computeGoogleIntentions(m), (m) => sumOrNull([m.beacons.bookingClicks, m.beacons.phoneClicks, m.beacons.directionsClicks])]
};

const pillarKpiFieldKeys = {
  visibility: [
    ['googleBusiness', 'profileViews'],
    ['instagram', 'reach'],
    ['facebook', 'pageVisits'],
    ['tiktok', 'views']
  ],
  engagement: [
    ['instagram', 'interactions'],
    ['facebook', 'interactions'],
    ['tiktok', 'interactions']
  ],
  conversion: [
    ['instagram', 'linkClicks'],
    ['tiktok', 'linkClicks']
  ],
  intention: [
    ['googleBusiness', 'calls'],
    ['googleBusiness', 'directions'],
    ['googleBusiness', 'websiteClicks'],
    ['googleBusiness', 'bookings'],
    ['beacons', 'bookingClicks'],
    ['beacons', 'phoneClicks'],
    ['beacons', 'directionsClicks']
  ]
};

function evolutionPercentFromSignals(signalGetters, monthData, previousMonthData) {
  if (!previousMonthData) {
    return null;
  }
  const percents = signalGetters
    .map((getter) => {
      const current = getter(monthData);
      const previous = getter(previousMonthData);
      if (current === null || previous === null) {
        return null;
      }
      return computeEvolution(previous, current).percent;
    })
    .filter((percent) => percent !== null && !Number.isNaN(percent));
  if (!percents.length) {
    return null;
  }
  return percents.reduce((total, percent) => total + percent, 0) / percents.length;
}

function computePillarScore(pillarKey, monthData, previousMonthData, objectives) {
  const matchingObjective = objectives.find(
    (objective) => isObjectiveQuantitative(objective) && pillarKpiFieldKeys[pillarKey].some(([section, field]) => section === objective.kpiSection && field === objective.kpiField)
  );
  if (matchingObjective) {
    const progress = computeObjectiveProgress(matchingObjective, monthData);
    if (progress !== null) {
      return { score: Math.round(clamp(progress, 0, 100)), reason: `Basé sur la progression vers l’objectif « ${matchingObjective.label} ».` };
    }
  }

  const percent = evolutionPercentFromSignals(pillarSignalGetters[pillarKey], monthData, previousMonthData);
  if (percent !== null) {
    return { score: Math.round(clamp(50 + percent, 0, 100)), reason: `Basé sur l’évolution vs mois précédent (${formatSignedPercent(percent)}).` };
  }

  return { score: null, reason: 'ni objectif chiffré ni mois précédent pour évaluer ce pilier' };
}

// La régularité/exécution est la seule dimension mesurable en valeur absolue dès le premier
// mois : le taux de complétion du plan d'action ne dépend d'aucune comparaison historique.
function computePillarRegularity(monthData) {
  const actionsRate = computeActionCompletionRate(monthData);
  if (actionsRate !== null) {
    return { score: Math.round(actionsRate), reason: `${Math.round(actionsRate)}% des actions du plan d’action ont été menées à terme.` };
  }
  const volume = sumOrNull([
    monthData.instagram.posts,
    monthData.instagram.reels,
    monthData.instagram.stories,
    monthData.googleBusiness.googlePosts,
    monthData.facebook.posts,
    monthData.tiktok.posts
  ]);
  if (volume !== null && volume > 0) {
    return { score: 70, reason: 'Production de contenu active sur la période ; aucun plan d’action structuré à mesurer pour affiner ce score.' };
  }
  return { score: null, reason: 'Pas assez de données de production ou d’exécution pour évaluer la régularité.' };
}

function computePillarProgression(monthData, previousMonthData) {
  if (!previousMonthData) {
    return { score: null, reason: 'Mois de référence : la progression pourra être évaluée à partir du prochain reporting.' };
  }
  const percents = [
    averagePercentEvolution(googleScoreFields, monthData, previousMonthData),
    averagePercentEvolution(instagramScoreFields, monthData, previousMonthData),
    evolutionPercentFromSignals([(m) => computeIntentionsFromMonth(m)], monthData, previousMonthData)
  ].filter((percent) => percent !== null);
  if (!percents.length) {
    return { score: null, reason: 'Pas assez d’indicateurs comparables pour évaluer la progression ce mois-ci.' };
  }
  const average = percents.reduce((total, percent) => total + percent, 0) / percents.length;
  return { score: Math.round(clamp(50 + average, 0, 100)), reason: `Évolution moyenne des indicateurs suivis : ${formatSignedPercent(average)}.` };
}

function computeScorePillars(monthData, previousMonthData) {
  const objectives = monthData.monthlyObjectives || [];
  return {
    visibility: computePillarScore('visibility', monthData, previousMonthData, objectives),
    engagement: computePillarScore('engagement', monthData, previousMonthData, objectives),
    conversion: computePillarScore('conversion', monthData, previousMonthData, objectives),
    intention: computePillarScore('intention', monthData, previousMonthData, objectives),
    regularity: computePillarRegularity(monthData),
    progression: computePillarProgression(monthData, previousMonthData)
  };
}

// Score global = moyenne des piliers disponibles seulement : un pilier "non évalué" (score
// null) est exclu du calcul plutôt que remplacé par une valeur par défaut arbitraire — sa
// pondération est donc redistribuée proportionnellement sur les piliers restants. Si aucun
// pilier n'est évaluable, le score global lui-même est "non disponible" (jamais 0 ni 50 par défaut).
function computeGlobalScoreFromPillars(pillars) {
  const available = scorePillarDefinitions.map((def) => pillars[def.key]).filter((pillar) => pillar.score !== null);
  if (!available.length) {
    return null;
  }
  const sum = available.reduce((total, pillar) => total + pillar.score, 0);
  return Math.round(clamp(sum / available.length, 0, 100));
}

// Une ligne par pilier, avec une explication brève de comment le score a été obtenu (ou
// pourquoi il ne l'a pas été) — jamais un chiffre nu sans justification.
function formatPillarLine(def, pillar) {
  if (pillar.score === null) {
    return def.key === 'progression' ? `${def.label} : non évaluée — mois de référence` : `${def.label} : non évalué — ${pillar.reason}`;
  }
  return `${def.label} : ${pillar.score}/100 — ${pillar.reason}`;
}

function buildScorePillarsLines(pillars) {
  return scorePillarDefinitions.map((def) => formatPillarLine(def, pillars[def.key]));
}

function computeGlobalScore(monthData, previousMonthData) {
  return computeGlobalScoreFromPillars(computeScorePillars(monthData, previousMonthData));
}

function getScoreBadge(score, hasPreviousMonth) {
  if (hasPreviousMonth === false) {
    return { label: 'Mois de référence', badgeClass: 'neutral' };
  }
  if (score === null) {
    return { label: 'Score non disponible', badgeClass: 'neutral' };
  }
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
    <span class="kpi-label">Actions à forte intention (Google + Beacons)</span>
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
    <strong>${score === null ? '—' : `${score}/100`}</strong>
    <span class="evolution-badge ${badge.badgeClass}">${escapeHtml(badge.label)}</span>
  `;
  return card;
}

function createBusinessResultComputedCard(label, value, unit) {
  const card = document.createElement('div');
  card.className = 'kpi-card card summary-card';
  const hasVal = value !== null && value !== undefined && !Number.isNaN(value);
  const valueText = hasVal ? `${formatNumber(value)}${unit ? ` ${unit}` : ''}` : '—';
  card.innerHTML = `
    <span class="kpi-label">${escapeHtml(label)}</span>
    <strong>${valueText}</strong>
    <span class="evolution-badge neutral">Calculé automatiquement</span>
  `;
  return card;
}

function renderBusinessResultsComputedSection(monthData, generalData) {
  const block = document.createElement('div');
  block.className = 'section-block';
  block.innerHTML = `
    <div class="section-heading">
      <div>
        <p class="eyebrow">Performance</p>
        <h3>Résultats business calculés</h3>
      </div>
    </div>
  `;

  const grid = document.createElement('div');
  grid.className = 'kpi-grid summary-grid';
  grid.appendChild(createBusinessResultComputedCard('Réservations générées', computeBookingsGenerated(monthData), ''));
  grid.appendChild(createBusinessResultComputedCard('Chiffre d’affaires estimé', computeEstimatedRevenue(monthData, generalData), '€'));
  grid.appendChild(createBusinessResultComputedCard('ROI', computeRoi(monthData, generalData), 'x'));
  block.appendChild(grid);

  const missingParts = [];
  if (!generalData || !hasValue(generalData.averageBasket)) {
    missingParts.push('le panier moyen');
  }
  if (!generalData || !hasValue(generalData.monthlyFee)) {
    missingParts.push('le prix payé pour la prestation');
  }
  if (missingParts.length) {
    const hint = document.createElement('p');
    hint.className = 'notes-hint';
    hint.textContent = `Renseignez ${joinWithAnd(missingParts)} dans « Informations générales » pour activer ce calcul.`;
    block.appendChild(hint);
  }

  return block;
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

  const quantitativeObjectives = monthData.monthlyObjectives.filter(isObjectiveQuantitative);
  const objectivesDone = quantitativeObjectives.filter((objective) => objective.done).length;
  const objectivesTotal = quantitativeObjectives.length;
  const objectivesRate = computeObjectivesRate(monthData);

  const score = computeGlobalScore(monthData, previousMonthData);
  const scoreBadge = getScoreBadge(score, Boolean(previousMonthData));

  grid.appendChild(createEvolutionSummaryCard('Évolution Google Business', googlePercent));
  grid.appendChild(createEvolutionSummaryCard('Évolution Instagram', instagramPercent));
  grid.appendChild(createEvolutionSummaryCard('Évolution Beacons', beaconsPercent));
  grid.appendChild(createIntentionsSummaryCard(intentionsCurrent, intentionsEvolution));
  grid.appendChild(createObjectivesSummaryCard(objectivesDone, objectivesTotal, objectivesRate));
  grid.appendChild(createScoreSummaryCard(score, scoreBadge));

  return grid;
}

const synthesisRowConfigs = [
  { label: 'Avis Google', section: 'googleBusiness', field: 'reviewsCount', platform: 'googleBusiness' },
  { label: 'Taux de réponse aux nouveaux avis', unit: '%', compute: computeReviewResponseRate, platform: 'googleBusiness' },
  { label: 'Note Google', section: 'googleBusiness', field: 'rating', platform: 'googleBusiness' },
  { label: 'Vues Google', section: 'googleBusiness', field: 'profileViews', platform: 'googleBusiness' },
  { label: 'Appels Google', section: 'googleBusiness', field: 'calls', platform: 'googleBusiness' },
  { label: 'Itinéraires Google', section: 'googleBusiness', field: 'directions', platform: 'googleBusiness' },
  { label: 'Abonnés Instagram', section: 'instagram', field: 'followers', platform: 'instagram' },
  { label: 'Portée Instagram', section: 'instagram', field: 'reach', platform: 'instagram' },
  { label: 'Interactions Instagram', section: 'instagram', field: 'interactions', platform: 'instagram' },
  {
    label: 'Taux d’engagement sur la portée',
    unit: '%',
    compute: computeEngagementRate,
    computeInitial: computeEngagementRateFromInitial,
    platform: 'instagram'
  },
  { label: 'Clics lien Instagram', section: 'instagram', field: 'linkClicks', platform: 'instagram' },
  { label: 'Abonnés Facebook', section: 'facebook', field: 'followers', platform: 'facebook' },
  { label: 'Visites de la page Facebook', section: 'facebook', field: 'pageVisits', platform: 'facebook' },
  { label: 'Abonnés TikTok', section: 'tiktok', field: 'followers', platform: 'tiktok' },
  { label: 'Vues TikTok', section: 'tiktok', field: 'views', platform: 'tiktok' },
  { label: 'Interactions TikTok', section: 'tiktok', field: 'interactions', platform: 'tiktok' },
  { label: 'Clics lien TikTok', section: 'tiktok', field: 'linkClicks', platform: 'tiktok' },
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

function renderSynthesisSection(monthData, previousMonthData, initialSituation, trackedPlatforms) {
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
  synthesisRowConfigs.filter((rowConfig) => isPlatformTracked(trackedPlatforms, rowConfig.platform)).forEach((rowConfig) => {
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
  return parseMetricValue(value) !== null;
}

function monthHasAnyData(monthData) {
  return ['googleBusiness', 'instagram', 'facebook', 'tiktok', 'beacons'].some((section) =>
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
  ['facebook', 'pageVisits'],
  ['facebook', 'views'],
  ['facebook', 'interactions'],
  ['facebook', 'linkClicks'],
  ['facebook', 'posts']
];

const tiktokFieldsForInsights = [
  ['tiktok', 'followers'],
  ['tiktok', 'views'],
  ['tiktok', 'interactions'],
  ['tiktok', 'profileVisits'],
  ['tiktok', 'linkClicks'],
  ['tiktok', 'posts']
];

const allInsightFields = [
  ...googleScoreFields,
  ...instagramScoreFields,
  ...facebookFieldsForInsights,
  ...tiktokFieldsForInsights,
  ...beaconsScoreFields
];

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
  'facebook.pageVisits': 'Les visites de la page Facebook',
  'facebook.views': 'Les vues Facebook',
  'facebook.interactions': 'Les interactions Facebook',
  'facebook.linkClicks': 'Les clics lien Facebook',
  'facebook.posts': 'Les publications Facebook',
  'tiktok.followers': 'Les abonnés TikTok',
  'tiktok.views': 'Les vues TikTok',
  'tiktok.interactions': 'Les interactions TikTok',
  'tiktok.profileVisits': 'Les visites de profil TikTok',
  'tiktok.linkClicks': 'Les clics sur le lien TikTok',
  'tiktok.posts': 'Les publications TikTok',
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

// Formate une clause de tendance ("en forte progression (+12.0%)") pour l'insérer dans une
// phrase, ou une chaîne vide quand il n'y a pas de mois précédent à comparer — plutôt que de
// répéter "sans comparaison disponible pour ce mois" dans chaque phrase du rapport.
function trendClause(percent) {
  if (percent === null || percent === undefined || Number.isNaN(percent)) {
    return '';
  }
  return `${describeTrend(percent)} (${formatSignedPercent(percent)})`;
}

// Distingue toujours performance absolue (le score du mois) et progression (l'évolution vs le
// mois précédent) : au premier mois, aucune progression n'existe, donc on ne l'affiche jamais
// comme "non disponible" ou "stagnation" — c'est simplement hors sujet, pas une donnée manquante.
function generateExecutiveSummary(ctx) {
  const name = ctx.generalData?.name || 'Ce client';
  const sentences = [];

  if (!ctx.hasPreviousMonth) {
    sentences.push(
      `${ctx.monthLabel} constitue le premier mois de référence de l’accompagnement. Les données collectées permettent d’établir une baseline. Les premières évolutions de performance pourront être mesurées à partir du prochain reporting.`
    );
  }

  if (ctx.score !== null) {
    const statusText = ctx.hasPreviousMonth
      ? `ce qui correspond à un mois « ${ctx.scoreBadge.label.toLowerCase()} »`
      : 'dans le cadre du mois de référence de l’accompagnement';
    sentences.push(`En ${ctx.monthLabel}, ${name} obtient un score global de ${ctx.score}/100 (performance absolue du mois), ${statusText}.`);
  } else {
    sentences.push('Score de progression : non disponible — mois de référence.');
  }

  if (ctx.hasPreviousMonth) {
    const { best, worst } = ctx.evolutions;
    if (best) {
      sentences.push(`Le point fort du mois est : ${best.label}, ${trendClause(best.percent)}.`);
    }
    if (worst && worst.percent < 0 && (!best || worst.field !== best.field)) {
      sentences.push(`À l’inverse, un point de vigilance : ${worst.label}, ${trendClause(worst.percent)}, qui mérite une attention particulière.`);
    }
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
    const trend = trendClause(ratingEvo.percent);
    sentences.push(`La note Google est${trend ? ` ${trend},` : ''} actuellement à ${formatNumber(gb.rating)}/5.`);
  }

  if (hasValue(gb.reviewsCount)) {
    const trend = trendClause(reviewsEvo.percent);
    let reviewSentence = trend
      ? `Le volume d’avis est ${trend}, avec ${formatNumber(gb.reviewsCount)} avis au total`
      : `Le volume d’avis s’élève à ${formatNumber(gb.reviewsCount)} avis au total`;
    if (hasValue(gb.newReviews)) {
      reviewSentence += ` dont ${formatNumber(gb.newReviews)} nouveaux ce mois-ci`;
    }
    sentences.push(`${reviewSentence}.`);
  }

  // Taux de réponse : uniquement nouveaux avis répondus / nouveaux avis reçus sur LA MÊME
  // période (jamais un total cumulé rapporté à un chiffre mensuel, ce qui produisait des taux
  // absurdes du type 16175%). Capé à 100%, et pas de "0%" auto quand il n'y a aucun nouvel avis.
  if (hasValue(gb.newReviews)) {
    const newReviewsCount = parseMetricValue(gb.newReviews);
    if (newReviewsCount === 0) {
      sentences.push('Aucun nouvel avis reçu sur la période, le taux de réponse n’est pas applicable.');
    } else if (hasValue(gb.newReviewsAnswered)) {
      const rawRate = (parseMetricValue(gb.newReviewsAnswered) / newReviewsCount) * 100;
      const responseRate = Math.min(100, Math.max(0, rawRate));
      sentences.push(
        `Le taux de réponse aux nouveaux avis est de ${Math.round(responseRate)}% (${formatNumber(gb.newReviewsAnswered)}/${formatNumber(gb.newReviews)}).`
      );
    }
  }

  // Visibilité (vues de la fiche) et actions à forte intention (appels, itinéraires, clics
  // site, réservations) sont deux choses différentes : ne jamais les mélanger dans la même
  // catégorie, l'une mesure l'exposition, l'autre des signaux d'intention client.
  if (hasValue(gb.profileViews)) {
    const trend = trendClause(viewsEvo.percent);
    sentences.push(
      trend ? `Sur le plan de la visibilité, les vues de la fiche sont ${trend}.` : `Sur le plan de la visibilité, la fiche a totalisé ${formatNumber(gb.profileViews)} vues.`
    );
  }

  const intentionParts = [];
  if (hasValue(gb.calls)) {
    const trend = trendClause(callsEvo.percent);
    intentionParts.push(trend ? `les appels sont ${trend}` : `${formatNumber(gb.calls)} appels`);
  }
  if (hasValue(gb.directions)) {
    const trend = trendClause(directionsEvo.percent);
    intentionParts.push(trend ? `les demandes d’itinéraire sont ${trend}` : `${formatNumber(gb.directions)} demandes d’itinéraire`);
  }
  if (hasValue(gb.websiteClicks)) {
    const trend = trendClause(clicksEvo.percent);
    intentionParts.push(trend ? `les clics vers le site sont ${trend}` : `${formatNumber(gb.websiteClicks)} clics vers le site`);
  }
  if (hasValue(gb.bookings)) {
    const count = parseMetricValue(gb.bookings);
    intentionParts.push(`${formatNumber(count)} réservation${count > 1 ? 's' : ''}`);
  }
  if (intentionParts.length) {
    const googleIntentions = computeGoogleIntentions(monthData);
    sentences.push(
      `Sur le plan des actions à forte intention (des signaux observés, pas un nombre de clients uniques) : ${joinWithAnd(intentionParts)}${
        googleIntentions !== null ? `, soit ${formatNumber(googleIntentions)} actions à forte intention cumulées ce mois-ci` : ''
      }.`
    );
  }

  const conversionRatios = computeGoogleConversionRatios(monthData);
  if (conversionRatios) {
    const conversionParts = [];
    if (conversionRatios.calls !== null) {
      conversionParts.push(`${(conversionRatios.calls * 100).toFixed(1)}% en appels`);
    }
    if (conversionRatios.directions !== null) {
      conversionParts.push(`${(conversionRatios.directions * 100).toFixed(1)}% en demandes d’itinéraire`);
    }
    if (conversionRatios.websiteClicks !== null) {
      conversionParts.push(`${(conversionRatios.websiteClicks * 100).toFixed(1)}% en clics vers le site`);
    }
    if (conversionRatios.bookings !== null) {
      conversionParts.push(`${(conversionRatios.bookings * 100).toFixed(1)}% en réservations`);
    }
    if (conversionParts.length) {
      sentences.push(`Les vues de la fiche se convertissent à hauteur de ${joinWithAnd(conversionParts)}.`);
    }
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
    const trend = trendClause(followersEvo.percent);
    sentences.push(`La communauté Instagram${trend ? ` est ${trend}, avec` : ' compte'} ${formatNumber(ig.followers)} abonnés.`);
  }

  const reachTrend = hasValue(ig.reach) ? trendClause(reachEvo.percent) : '';
  const contentParts = [];
  if (hasValue(ig.views)) {
    contentParts.push(`généré ${formatNumber(ig.views)} vues`);
  }
  if (hasValue(ig.interactions)) {
    contentParts.push(`${contentParts.length ? '' : 'généré '}${formatNumber(ig.interactions)} interactions`);
  }

  if (hasValue(ig.reach) && reachTrend) {
    sentences.push(`La portée est ${reachTrend}, pour ${formatNumber(ig.reach)} comptes touchés.`);
    if (contentParts.length) {
      sentences.push(`Les contenus ont ${joinWithAnd(contentParts)}.`);
    }
  } else {
    const touchedParts = [];
    if (hasValue(ig.reach)) {
      touchedParts.push(`touché ${formatNumber(ig.reach)} comptes`);
    }
    touchedParts.push(...contentParts);
    if (touchedParts.length) {
      sentences.push(`Les contenus ont ${joinWithAnd(touchedParts)}.`);
    }
  }

  const engagementRate = computeEngagementRate(monthData);
  const prevEngagementRate = previousMonthData ? computeEngagementRate(previousMonthData) : null;
  if (engagementRate !== null) {
    const engagementEvo = computeEvolution(prevEngagementRate, engagementRate);
    const trend = trendClause(engagementEvo.percent);
    // Le libellé précise toujours la méthode de calcul (interactions / portée) : ne jamais
    // comparer ce taux à un taux calculé autrement (ex. interactions / abonnés).
    sentences.push(`Taux d’engagement sur la portée : ${engagementRate.toFixed(1)}%${trend ? `, ${trend} par rapport au mois précédent` : ''}.`);
  }

  const volumeParts = [];
  if (hasValue(ig.posts)) {
    volumeParts.push(`${formatNumber(ig.posts)} publication${parseMetricValue(ig.posts) > 1 ? 's' : ''}`);
  }
  if (hasValue(ig.reels)) {
    volumeParts.push(`${formatNumber(ig.reels)} reel${parseMetricValue(ig.reels) > 1 ? 's' : ''}`);
  }
  if (hasValue(ig.stories)) {
    volumeParts.push(`${formatNumber(ig.stories)} story/stories`);
  }
  if (volumeParts.length) {
    sentences.push(`Le rythme de publication du mois représente ${joinWithAnd(volumeParts)}.`);
  }

  if (hasValue(ig.profileVisits)) {
    sentences.push(`Le profil a enregistré ${formatNumber(ig.profileVisits)} visites sur la période.`);
  }

  if (hasValue(ig.linkClicks)) {
    const trend = trendClause(linkClicksEvo.percent);
    sentences.push(
      trend
        ? `Les clics sur le lien de la bio sont ${trend}, avec ${formatNumber(ig.linkClicks)} clics enregistrés.`
        : `${formatNumber(ig.linkClicks)} clics ont été enregistrés sur le lien de la bio.`
    );
  }

  // Distingue explicitement l'intérêt (visite de profil) de la conversion mesurable (clic sur
  // le lien) : une vue, un like ou une visite de profil n'est jamais un résultat business.
  const profileConversionRatio = computeInstagramProfileConversionRatio(monthData);
  if (profileConversionRatio !== null) {
    sentences.push(
      `${(profileConversionRatio * 100).toFixed(1)}% des visites de profil ont généré un clic sur le lien : la conversion du profil vers une action externe est un axe à suivre.`
    );
  }

  if (!sentences.length) {
    return 'Aucune donnée Instagram n’a encore été saisie pour ce mois.';
  }

  return sentences.join(' ');
}

// Chaque indicateur Facebook (abonnés, vues, interactions, publications, visites de page) utilise
// exclusivement sa propre variable : ne jamais réutiliser "publications" pour décrire les
// interactions ni l'inverse, quelle que soit la phrase générée.
function generateFacebookAnalysis(monthData, previousMonthData) {
  const fb = monthData.facebook;
  const prevFb = previousMonthData ? previousMonthData.facebook : null;
  const sentences = [];

  const followersEvo = prevFb ? computeEvolution(prevFb.followers, fb.followers) : { percent: null };
  const pageVisitsEvo = prevFb ? computeEvolution(prevFb.pageVisits, fb.pageVisits) : { percent: null };

  if (hasValue(fb.followers)) {
    const trend = trendClause(followersEvo.percent);
    sentences.push(`La page Facebook compte ${formatNumber(fb.followers)} abonnés${trend ? `, ${trend}` : ''}.`);
  }

  const contentParts = [];
  if (hasValue(fb.views)) {
    contentParts.push(`${formatNumber(fb.views)} vues`);
  }
  if (hasValue(fb.interactions)) {
    contentParts.push(`${formatNumber(fb.interactions)} interactions`);
  }
  if (contentParts.length) {
    sentences.push(`Les contenus ont généré ${joinWithAnd(contentParts)} sur la période.`);
  }

  if (hasValue(fb.posts)) {
    const count = parseMetricValue(fb.posts);
    sentences.push(`${formatNumber(count)} publication${count > 1 ? 's ont' : ' a'} été diffusée${count > 1 ? 's' : ''} ce mois-ci.`);
  }

  if (hasValue(fb.pageVisits)) {
    const trend = trendClause(pageVisitsEvo.percent);
    sentences.push(
      trend
        ? `La page a enregistré ${formatNumber(fb.pageVisits)} visites, ${trend}.`
        : `La page a enregistré ${formatNumber(fb.pageVisits)} visites.`
    );
  }

  if (!sentences.length) {
    return 'Aucune donnée Facebook n’a encore été saisie pour ce mois.';
  }

  return sentences.join(' ');
}

// Même logique que Facebook/Instagram : chaque indicateur TikTok utilise exclusivement sa
// propre variable, et le ratio visites de profil → clic lien est explicité comme pour Instagram.
function generateTiktokAnalysis(monthData, previousMonthData) {
  const tt = monthData.tiktok;
  const prevTt = previousMonthData ? previousMonthData.tiktok : null;
  const sentences = [];

  const followersEvo = prevTt ? computeEvolution(prevTt.followers, tt.followers) : { percent: null };
  const profileVisitsEvo = prevTt ? computeEvolution(prevTt.profileVisits, tt.profileVisits) : { percent: null };

  if (hasValue(tt.followers)) {
    const trend = trendClause(followersEvo.percent);
    sentences.push(`Le compte TikTok compte ${formatNumber(tt.followers)} abonnés${trend ? `, ${trend}` : ''}.`);
  }

  const contentParts = [];
  if (hasValue(tt.views)) {
    contentParts.push(`${formatNumber(tt.views)} vues`);
  }
  if (hasValue(tt.interactions)) {
    contentParts.push(`${formatNumber(tt.interactions)} interactions (likes, commentaires, partages)`);
  }
  if (contentParts.length) {
    sentences.push(`Les contenus ont généré ${joinWithAnd(contentParts)} sur la période.`);
  }

  if (hasValue(tt.posts)) {
    const count = parseMetricValue(tt.posts);
    sentences.push(`${formatNumber(count)} publication${count > 1 ? 's ont' : ' a'} été diffusée${count > 1 ? 's' : ''} ce mois-ci.`);
  }

  if (hasValue(tt.profileVisits)) {
    const trend = trendClause(profileVisitsEvo.percent);
    sentences.push(
      trend ? `Le profil a enregistré ${formatNumber(tt.profileVisits)} visites, ${trend}.` : `Le profil a enregistré ${formatNumber(tt.profileVisits)} visites sur la période.`
    );
  }

  if (hasValue(tt.linkClicks)) {
    sentences.push(`${formatNumber(tt.linkClicks)} clics ont été enregistrés sur le lien du profil.`);
  }

  const conversionRatio = computeTiktokProfileConversionRatio(monthData);
  if (conversionRatio !== null) {
    sentences.push(
      `${(conversionRatio * 100).toFixed(1)}% des visites de profil ont généré un clic sur le lien : la conversion du profil vers une action externe est un axe à suivre.`
    );
  }

  if (!sentences.length) {
    return 'Aucune donnée TikTok n’a encore été saisie pour ce mois.';
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
    const trend = trendClause(bookingEvo.percent);
    sentences.push(trend ? `Les clics de réservation sont ${trend}.` : `${formatNumber(bc.bookingClicks)} clics de réservation ont été enregistrés.`);
  }
  if (hasValue(bc.phoneClicks)) {
    const trend = trendClause(phoneEvo.percent);
    sentences.push(trend ? `Les clics téléphone sont ${trend}.` : `${formatNumber(bc.phoneClicks)} clics téléphone ont été enregistrés.`);
  }
  if (hasValue(bc.directionsClicks)) {
    const trend = trendClause(directionsEvo.percent);
    sentences.push(trend ? `Les clics itinéraire sont ${trend}.` : `${formatNumber(bc.directionsClicks)} clics itinéraire ont été enregistrés.`);
  }

  const beaconsRatios = computeBeaconsConversionRatios(monthData);
  if (beaconsRatios) {
    const parts = [];
    if (beaconsRatios.bookingClicks !== null) {
      parts.push(`${(beaconsRatios.bookingClicks * 100).toFixed(1)}% réservation`);
    }
    if (beaconsRatios.phoneClicks !== null) {
      parts.push(`${(beaconsRatios.phoneClicks * 100).toFixed(1)}% téléphone`);
    }
    if (beaconsRatios.directionsClicks !== null) {
      parts.push(`${(beaconsRatios.directionsClicks * 100).toFixed(1)}% itinéraire`);
    }
    if (parts.length) {
      sentences.push(`Répartition des clics Beacons : ${joinWithAnd(parts)}.`);
    }
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
    const quantitative = objectives.filter(isObjectiveQuantitative);
    const qualitative = objectives.filter((objective) => !isObjectiveQuantitative(objective));

    if (quantitative.length) {
      const done = quantitative.filter((objective) => objective.done).length;
      sentences.push(
        `${done} objectif${done > 1 ? 's' : ''} mesurable${done > 1 ? 's' : ''} sur ${quantitative.length} ${done > 1 ? 'ont été atteints' : 'a été atteint'} ce mois-ci (${Math.round((done / quantitative.length) * 100)}%).`
      );
      const remaining = quantitative.filter((objective) => !objective.done).map((objective) => objective.label);
      if (remaining.length) {
        sentences.push(`Reste${remaining.length > 1 ? 'nt' : ''} à finaliser : ${remaining.join(', ')}.`);
      }
    } else {
      sentences.push('Aucun objectif mesurable (KPI + cible) n’a encore été défini pour ce mois.');
    }

    if (qualitative.length) {
      sentences.push(
        `${qualitative.length} objectif${qualitative.length > 1 ? 's' : ''} qualitatif${qualitative.length > 1 ? 's' : ''} (non mesurable${qualitative.length > 1 ? 's' : ''} en l’état) ${qualitative.length > 1 ? 'sont suivis' : 'est suivi'} sans entrer dans le taux d’atteinte : ${qualitative.map((o) => o.label).join(', ')}.`
      );
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

// Une force n'est pas obligatoirement une progression : sans mois précédent, on cherche des
// signaux positifs objectivement présents dans les données absolues du mois plutôt que de se
// rabattre sur "pas de progression marquante" (qui n'a pas de sens sans historique).
function buildAbsoluteStrengthSignals(monthData) {
  const gb = monthData.googleBusiness;
  const ig = monthData.instagram;
  const signals = [];

  const googleIntentions = computeGoogleIntentions(monthData);
  if (googleIntentions !== null && googleIntentions >= GOOGLE_STRONG_INTENTIONS_THRESHOLD) {
    signals.push(
      `Un volume élevé d’actions à forte intention sur Google Business (${formatNumber(googleIntentions)} appels, itinéraires, clics site et réservations cumulés).`
    );
  }
  if (hasValue(gb.directions) && parseMetricValue(gb.directions) >= 50) {
    signals.push(`Un volume notable de demandes d’itinéraire (${formatNumber(gb.directions)}), signe d’un intérêt local concret.`);
  }
  const actionsRate = computeActionCompletionRate(monthData);
  if (actionsRate !== null && actionsRate >= 70) {
    signals.push(`Une bonne régularité d’exécution : ${Math.round(actionsRate)}% des actions du plan d’action ont été menées à terme.`);
  }
  const engagementRate = computeEngagementRate(monthData);
  if (engagementRate !== null && engagementRate >= 5) {
    signals.push(`Un bon taux d’engagement sur la portée (${engagementRate.toFixed(1)}%).`);
  }
  if (hasValue(ig.profileVisits) && parseMetricValue(ig.profileVisits) >= 100) {
    signals.push(`Une bonne capacité à générer des visites de profil Instagram (${formatNumber(ig.profileVisits)} sur la période).`);
  }
  const contentVolume = computeInstagramContentVolume(monthData);
  if (contentVolume !== null && contentVolume >= INSTAGRAM_HIGH_CONTENT_VOLUME) {
    signals.push(`Un volume de contenu déjà conséquent (${formatNumber(contentVolume)} publications/Reels/Stories sur le mois).`);
  }

  if (!signals.length) {
    return ['Les données de ce premier mois établissent la baseline ; les points d’appui se préciseront avec le recul du prochain reporting.'];
  }
  return signals.slice(0, 4);
}

function generateStrengths(monthData, previousMonthData) {
  const evolutions = collectFieldEvolutions(monthData, previousMonthData, allInsightFields);
  const positives = evolutions
    .filter((item) => item.percent > 5)
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 3);

  if (positives.length) {
    return positives.map((item) => `${item.label} : ${formatSignedPercent(item.percent)} vs mois précédent.`);
  }

  if (previousMonthData) {
    return ['Pas de progression marquante à isoler ce mois-ci, la situation reste stable.'];
  }

  return buildAbsoluteStrengthSignals(monthData);
}

// Seuils utilisés pour transformer des relations entre KPI en constats mesurables (portée
// faible pour la taille de la communauté, conversion profil → clic faible, volume de contenu
// déjà élevé) plutôt que des formulations génériques déconnectées des données réelles.
const INSTAGRAM_MEANINGFUL_COMMUNITY = 500;
const INSTAGRAM_LOW_REACH_RATIO = 0.3;
const INSTAGRAM_MEANINGFUL_PROFILE_VISITS = 50;
const INSTAGRAM_LOW_CONVERSION_RATIO = 0.1;
const INSTAGRAM_HIGH_CONTENT_VOLUME = 15;
const GOOGLE_STRONG_INTENTIONS_THRESHOLD = 200;

function isInstagramHighVolumeLowReach(monthData) {
  const ig = monthData.instagram;
  const contentVolume = computeInstagramContentVolume(monthData);
  const reachRatio = computeInstagramReachRatio(monthData);
  const followers = parseMetricValue(ig.followers);
  return (
    contentVolume !== null &&
    contentVolume >= INSTAGRAM_HIGH_CONTENT_VOLUME &&
    reachRatio !== null &&
    followers !== null &&
    followers >= INSTAGRAM_MEANINGFUL_COMMUNITY &&
    reachRatio < INSTAGRAM_LOW_REACH_RATIO
  );
}

function isInstagramLowProfileConversion(monthData) {
  const ig = monthData.instagram;
  const conversionRatio = computeInstagramProfileConversionRatio(monthData);
  const profileVisits = parseMetricValue(ig.profileVisits);
  return (
    conversionRatio !== null &&
    profileVisits !== null &&
    profileVisits >= INSTAGRAM_MEANINGFUL_PROFILE_VISITS &&
    conversionRatio < INSTAGRAM_LOW_CONVERSION_RATIO
  );
}

// Le nombre d'abonnés reste un indicateur de contexte, jamais la base principale du diagnostic :
// on croise plusieurs signaux (portée, évolution, vues, interactions, visites de profil) et on
// formule une observation prudente plutôt qu'une conclusion automatique de "problème de
// distribution" — et on ne mentionne jamais d'hypothèse d'abonnés achetés.
function buildInstagramReachCautionMessage(monthData, previousMonthData) {
  const ig = monthData.instagram;
  const reachRatio = computeInstagramReachRatio(monthData);
  const followers = parseMetricValue(ig.followers);
  if (reachRatio === null || followers === null || followers < INSTAGRAM_MEANINGFUL_COMMUNITY || reachRatio >= INSTAGRAM_LOW_REACH_RATIO) {
    return [];
  }

  const supportingSignals = [];
  if (hasValue(ig.views)) {
    supportingSignals.push(`${formatNumber(ig.views)} vues`);
  }
  if (hasValue(ig.interactions)) {
    supportingSignals.push(`${formatNumber(ig.interactions)} interactions`);
  }
  if (hasValue(ig.profileVisits)) {
    supportingSignals.push(`${formatNumber(ig.profileVisits)} visites de profil`);
  }
  const reachEvo = previousMonthData ? computeEvolution(previousMonthData.instagram.reach, ig.reach) : { percent: null };
  const trend = trendClause(reachEvo.percent);
  if (trend) {
    supportingSignals.push(`une portée ${trend}`);
  }
  const contextText = supportingSignals.length ? ` À mettre en regard de ${joinWithAnd(supportingSignals)} sur la période.` : '';

  return [
    `La portée observée (${formatNumber(ig.reach)} comptes touchés) reste limitée au regard de la taille affichée de la communauté (${formatNumber(ig.followers)} abonnés, soit ${Math.round(reachRatio * 100)}%).${contextText} Ce ratio doit toutefois être interprété avec prudence et suivi dans le temps afin d’évaluer la qualité et l’activité réelle de l’audience.`
  ];
}

function generateWeaknesses(monthData, previousMonthData) {
  const evolutions = collectFieldEvolutions(monthData, previousMonthData, allInsightFields);
  const negatives = evolutions
    .filter((item) => item.percent < -5)
    .sort((a, b) => a.percent - b.percent)
    .slice(0, 3);

  const items = negatives.map((item) => `${item.label} : ${formatSignedPercent(item.percent)} vs mois précédent.`);

  const ig = monthData.instagram;
  items.push(...buildInstagramReachCautionMessage(monthData, previousMonthData));

  const conversionRatio = computeInstagramProfileConversionRatio(monthData);
  const profileVisits = parseMetricValue(ig.profileVisits);
  if (conversionRatio !== null && profileVisits !== null && profileVisits >= INSTAGRAM_MEANINGFUL_PROFILE_VISITS && conversionRatio < INSTAGRAM_LOW_CONVERSION_RATIO) {
    items.push(
      `Les visites de profil Instagram (${formatNumber(ig.profileVisits)}) se convertissent peu en clics sur le lien (${formatNumber(ig.linkClicks)}, soit ${Math.round(conversionRatio * 100)}%) : un problème de conversion du profil vers l’action.`
    );
  }

  // Un objectif fixé ce mois-ci n'est pas encore "en échec" faute de recul : ce constat n'a de
  // sens qu'à partir du moment où il y a eu au moins un mois pour progresser vers la cible.
  const objectivesRate = computeObjectivesRate(monthData);
  if (previousMonthData && objectivesRate !== null && objectivesRate < 50) {
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

  const highVolumeLowReach = isInstagramHighVolumeLowReach(monthData);
  if (
    !highVolumeLowReach &&
    hasValue(ig.posts) &&
    hasValue(ig.reels) &&
    parseMetricValue(ig.posts) > 0 &&
    parseMetricValue(ig.reels) < parseMetricValue(ig.posts) / 3
  ) {
    opportunities.push('Le format Reels est sous-exploité par rapport au volume de publications : c’est un levier de portée disponible.');
  }
  if (hasValue(gb.newReviews) && hasValue(gb.newReviewsAnswered) && parseMetricValue(gb.newReviews) > parseMetricValue(gb.newReviewsAnswered)) {
    opportunities.push('Des avis Google récents restent sans réponse : une opportunité rapide d’améliorer la relation client.');
  }
  if (hasValue(gb.googlePosts) && parseMetricValue(gb.googlePosts) < 2) {
    opportunities.push('La fréquence de publication sur Google Business est faible : publier plus régulièrement renforcerait la visibilité locale.');
  }

  const googleIntentions = computeGoogleIntentions(monthData);
  if (googleIntentions !== null && googleIntentions >= GOOGLE_STRONG_INTENTIONS_THRESHOLD) {
    opportunities.push(
      `Google Business génère un fort volume d’actions à forte intention (${formatNumber(googleIntentions)} appels, itinéraires, clics site et réservations cumulés ce mois-ci — des actions observées, pas un nombre de clients uniques) : un levier d’intention à exploiter davantage (avis, offres, publications régulières).`
    );
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

  const highVolumeLowReach = isInstagramHighVolumeLowReach(monthData);
  if (highVolumeLowReach) {
    // Le volume est déjà conséquent : ne jamais recommander d'en publier davantage. Le vrai
    // levier est la qualité de découverte (hooks, formats, partage), pas le volume.
    const reachRatio = computeInstagramReachRatio(monthData);
    const contentVolume = computeInstagramContentVolume(monthData);
    recommendations.push(
      `Le volume de contenu est déjà conséquent (${formatNumber(contentVolume)} publications/Reels/Stories ce mois-ci) mais la portée reste faible par rapport à la communauté (${Math.round(reachRatio * 100)}%) : prioriser l’amélioration des hooks, des formats partageables et des contenus de découverte plutôt que d’augmenter encore le volume.`
    );
  } else if (hasValue(ig.posts) && hasValue(ig.reels) && parseMetricValue(ig.posts) > 0 && parseMetricValue(ig.reels) < parseMetricValue(ig.posts) / 3) {
    recommendations.push('Publier davantage de Reels pour dynamiser la portée Instagram.');
  }

  const lowProfileConversion = isInstagramLowProfileConversion(monthData);
  if (lowProfileConversion) {
    recommendations.push('Travailler la conversion du profil Instagram vers le site (bio, lien mis en avant, appel à l’action dans les contenus) : les visites de profil se transforment trop peu en clics.');
  }

  if (hasValue(gb.newReviews) && hasValue(gb.newReviewsAnswered) && parseMetricValue(gb.newReviews) > parseMetricValue(gb.newReviewsAnswered)) {
    recommendations.push('Améliorer les réponses aux avis Google : des avis récents restent sans réponse.');
  }

  const reviewsEvo = previousMonthData ? computeEvolution(previousMonthData.googleBusiness.reviewsCount, gb.reviewsCount) : { percent: null };
  if (reviewsEvo.percent !== null && reviewsEvo.percent < 8) {
    recommendations.push('Demander plus d’avis Google auprès des clients satisfaits pour accélérer la collecte.');
  }
  if (hasValue(gb.googlePosts) && parseMetricValue(gb.googlePosts) < 2) {
    recommendations.push('Publier plus de Google Posts pour dynamiser la fiche Google Business.');
  }
  if (hasValue(ig.stories) && hasValue(ig.posts) && parseMetricValue(ig.stories) < parseMetricValue(ig.posts)) {
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
  if (hasValue(fb.posts) && parseMetricValue(fb.posts) < 2) {
    recommendations.push('Maintenir une publication régulière sur Facebook pour ne pas perdre le lien avec cette audience.');
  }

  const bookingEvo = previousMonthData ? computeEvolution(previousMonthData.beacons.bookingClicks, bc.bookingClicks) : { percent: null };
  if (bookingEvo.percent !== null && bookingEvo.percent < 0) {
    recommendations.push('Mettre en avant les options de réservation en ligne (Beacons) pour capter davantage d’intentions clients.');
  }

  const objectivesRate = computeObjectivesRate(monthData);
  if (previousMonthData && objectivesRate !== null && objectivesRate < 50) {
    recommendations.push(
      highVolumeLowReach || lowProfileConversion
        ? 'Prioriser les objectifs du mois en retard, en particulier ceux liés à la portée et à la conversion Instagram identifiées ci-dessus.'
        : 'Prioriser les objectifs du mois en retard pour sécuriser les résultats.'
    );
  }

  if (!recommendations.length) {
    recommendations.push('Maintenir le rythme actuel : les indicateurs sont bien orientés ce mois-ci.');
  }

  return recommendations.slice(0, 6);
}

// Le plan d'action répond à "qu'allons-nous concrètement faire le mois prochain ?" — des
// tâches précises et opérationnelles, jamais une reformulation des constats de la section
// Recommandations (qui répond elle à "qu'est-ce que l'analyse montre qu'il faut améliorer ?").
function generateActionPlanItems(monthData, previousMonthData) {
  const actions = [];
  const gb = monthData.googleBusiness;
  const ig = monthData.instagram;
  const fb = monthData.facebook;
  const bc = monthData.beacons;

  const highVolumeLowReach = isInstagramHighVolumeLowReach(monthData);
  if (highVolumeLowReach) {
    actions.push('Tester 3 formats de Reels orientés découverte (hook dès la première seconde, sujet grand public) plutôt que d’augmenter le volume.');
    actions.push('Analyser les 3 meilleurs et les 3 moins bons contenus du mois pour identifier ce qui fait réellement la portée.');
  } else if (hasValue(ig.posts) && hasValue(ig.reels) && parseMetricValue(ig.posts) > 0 && parseMetricValue(ig.reels) < parseMetricValue(ig.posts) / 3) {
    actions.push('Publier au moins 2 Reels supplémentaires ce mois-ci pour dynamiser la portée Instagram.');
  }

  if (isInstagramLowProfileConversion(monthData)) {
    actions.push('Retravailler la bio Instagram et la mise en avant du lien (réservation/menu) pour faciliter le passage à l’action.');
    actions.push('Intégrer un CTA de visite ou de réservation dans les contenus à forte intention (Reels, Stories).');
  }

  if (hasValue(gb.newReviews) && hasValue(gb.newReviewsAnswered) && parseMetricValue(gb.newReviews) > parseMetricValue(gb.newReviewsAnswered)) {
    const unanswered = parseMetricValue(gb.newReviews) - parseMetricValue(gb.newReviewsAnswered);
    actions.push(`Répondre aux ${formatNumber(unanswered)} avis Google récents encore sans réponse.`);
  }

  const reviewsEvo = previousMonthData ? computeEvolution(previousMonthData.googleBusiness.reviewsCount, gb.reviewsCount) : { percent: null };
  if (reviewsEvo.percent !== null && reviewsEvo.percent < 8) {
    actions.push('Solliciter activement 5 avis Google auprès des derniers clients satisfaits.');
  }

  if (hasValue(gb.googlePosts) && parseMetricValue(gb.googlePosts) < 2) {
    actions.push('Publier au moins 2 publications Google Business ce mois-ci (offre, actualité, coulisses).');
  }

  if (hasValue(ig.stories) && hasValue(ig.posts) && parseMetricValue(ig.stories) < parseMetricValue(ig.posts)) {
    actions.push('Programmer une Story quasi quotidienne (coulisses, plat du jour, équipe) pour garder le contact avec la communauté.');
  }

  const ratingEvo = previousMonthData ? computeEvolution(previousMonthData.googleBusiness.rating, gb.rating) : { percent: null };
  if (ratingEvo.percent !== null && ratingEvo.percent <= 0) {
    actions.push('Mettre à jour les photos et informations de la fiche Google Business (menu, horaires, ambiance).');
  }

  if (hasValue(fb.posts) && parseMetricValue(fb.posts) < 2) {
    actions.push('Programmer au moins 2 publications Facebook ce mois-ci pour ne pas perdre le lien avec cette audience.');
  }

  const bookingEvo = previousMonthData ? computeEvolution(previousMonthData.beacons.bookingClicks, bc.bookingClicks) : { percent: null };
  if (bookingEvo.percent !== null && bookingEvo.percent < 0) {
    actions.push('Mettre en avant le bouton de réservation en ligne (Beacons) dans les contenus et la bio.');
  }

  const googleIntentions = computeGoogleIntentions(monthData);
  if (googleIntentions !== null && googleIntentions >= GOOGLE_STRONG_INTENTIONS_THRESHOLD) {
    actions.push('Développer 2 contenus autour d’un produit, d’une expérience ou d’une raison concrète de venir, pour capitaliser sur l’intérêt local déjà fort.');
  }

  const quantitativeObjectives = (monthData.monthlyObjectives || []).filter(isObjectiveQuantitative);
  quantitativeObjectives
    .filter((objective) => !objective.done)
    .slice(0, 2)
    .forEach((objective) => {
      actions.push(`Avancer concrètement sur l’objectif « ${objective.label} » : définir avec le consultant les 2 actions prioritaires pour rattraper l’écart à la cible.`);
    });

  if (!actions.length) {
    actions.push('Maintenir le rythme actuel et documenter les formats qui fonctionnent le mieux ce mois-ci.');
  }

  return actions.slice(0, 8);
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
  { section: 'facebook', field: 'pageVisits', label: 'Visites de la page Facebook' },
  { section: 'tiktok', field: 'views', label: 'Vues TikTok' },
  { section: 'beacons', field: 'bookingClicks', label: 'Clics réservation Beacons' }
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
      .map(parseMetricValue);
    if (!priorValues.length) {
      return;
    }
    const maxPrior = Math.max(...priorValues);
    if (parseMetricValue(currentValue) > maxPrior) {
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
    objectivesSentence,
    hasPreviousMonth: Boolean(previousMonthData)
  });

  const pillars = computeScorePillars(monthData, previousMonthData);
  const strengthsTitle = previousMonthData ? 'Forces du mois' : 'Points d’appui identifiés';
  const tracked = clientData.general.trackedPlatforms;

  // Seuls les réseaux réellement suivis pour ce client ont leur propre sous-section d'analyse ;
  // les numéros de section sont recalculés en fonction de ce qui est effectivement affiché.
  const platformAnalysisSections = [
    { key: 'googleBusiness', title: 'Analyse Google Business', paragraphs: [generateGoogleAnalysis(monthData, previousMonthData)] },
    { key: 'instagram', title: 'Analyse Instagram', paragraphs: [generateInstagramAnalysis(monthData, previousMonthData)] },
    { key: 'facebook', title: 'Analyse Facebook', paragraphs: [generateFacebookAnalysis(monthData, previousMonthData)] },
    { key: 'tiktok', title: 'Analyse TikTok', paragraphs: [generateTiktokAnalysis(monthData, previousMonthData)] }
  ].filter((section) => isPlatformTracked(tracked, section.key));

  const unnumberedSections = [
    { title: 'Résumé exécutif', paragraphs: [executiveSummary] },
    { title: 'Score détaillé par pilier', list: buildScorePillarsLines(pillars) },
    ...platformAnalysisSections,
    { title: 'Analyse Beacons', paragraphs: [generateBeaconsAnalysis(monthData, previousMonthData)] },
    { title: 'Analyse des objectifs', paragraphs: [generateObjectivesAnalysis(monthData)] },
    { title: strengthsTitle, list: generateStrengths(monthData, previousMonthData) },
    { title: 'Faiblesses', list: generateWeaknesses(monthData, previousMonthData) },
    { title: 'Opportunités', list: generateOpportunities(monthData, previousMonthData) },
    { title: 'Recommandations', list: generateRecommendations(monthData, previousMonthData) }
  ];

  const sections = unnumberedSections.map((section, index) => ({ ...section, title: `${index + 1}. ${section.title}` }));

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

function createObjectiveRow(clientId, monthKey, objective, monthData, onRemove) {
  const row = document.createElement('div');
  row.className = `checklist-item objective-item${objective.done ? ' done' : ''}`;

  const label = document.createElement('label');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = objective.done;
  const span = document.createElement('span');
  span.textContent = objective.label;
  label.appendChild(checkbox);
  label.appendChild(span);

  const quantitative = isObjectiveQuantitative(objective);
  const meta = document.createElement('div');
  meta.className = 'objective-meta';
  if (quantitative) {
    const kpiOption = findObjectiveKpiOption(objective.kpiSection, objective.kpiField);
    const progress = computeObjectiveProgress(objective, monthData);
    const currentValue = monthData ? monthData[objective.kpiSection]?.[objective.kpiField] : null;
    const parts = [`🎯 ${kpiOption ? kpiOption.label : objective.kpiField}`];
    if (hasValue(objective.baselineValue)) {
      parts.push(`départ ${formatNumber(objective.baselineValue)}`);
    }
    parts.push(`cible ${formatNumber(objective.targetValue)}`);
    if (hasValue(currentValue)) {
      parts.push(`actuel ${formatNumber(currentValue)}`);
    }
    if (progress !== null) {
      parts.push(`${Math.round(progress)}% de la cible`);
    }
    if (objective.deadline) {
      parts.push(`échéance ${objective.deadline}`);
    }
    meta.textContent = parts.join(' · ');
  } else {
    meta.textContent = 'Objectif qualitatif (non mesurable en l’état) — n’entre pas dans le taux d’atteinte.';
  }

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

  const rowHeader = document.createElement('div');
  rowHeader.className = 'objective-row-header';
  rowHeader.appendChild(label);
  rowHeader.appendChild(removeButton);

  row.appendChild(rowHeader);
  row.appendChild(meta);
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
    <form class="inline-add-form objective-add-form" data-role="objectives-form">
      <input type="text" name="label" placeholder="Nom de l’objectif" required />
      <select name="kpi">
        <option value="">Objectif qualitatif (texte libre, non mesurable)</option>
        ${objectiveKpiOptions.map((option) => `<option value="${option.section}.${option.field}">${escapeHtml(option.label)}</option>`).join('')}
      </select>
      <input type="text" name="baseline" placeholder="Valeur de référence" inputmode="decimal" />
      <input type="text" name="target" placeholder="Valeur cible" inputmode="decimal" />
      <input type="month" name="deadline" />
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
      list.appendChild(createObjectiveRow(clientId, monthKey, objective, month, renderList));
    });
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const labelInput = form.elements.label;
    const label = labelInput.value.trim();
    if (!label) {
      return;
    }
    const data = getClientData(clientId);
    const month = data.months[monthKey];
    if (!month) {
      return;
    }

    const kpiValue = form.elements.kpi.value;
    const [kpiSection, kpiField] = kpiValue ? kpiValue.split('.') : [null, null];

    month.monthlyObjectives.push({
      id: generateId(),
      label,
      done: false,
      kpiSection: kpiSection || null,
      kpiField: kpiField || null,
      baselineValue: form.elements.baseline.value.trim(),
      targetValue: form.elements.target.value.trim(),
      deadline: form.elements.deadline.value || null
    });
    saveClientData(clientId, data);
    form.reset();
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
  { key: 'tiktok', title: 'TikTok', keywords: ['tiktok'] },
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

// Merges every recorded milestone for this client - collaboration start, each Dashboard
// month created, and every history event logged by any module (audits, roadmaps sent,
// PDF reports, case studies, Content Planner generations/exports) - into one chronological
// timeline. Months created before this feature existed have no createdAt timestamp: they
// are placed in monthOrder sequence, before any dated event, as the best available guess.
function renderClientHistoryTimeline(panel, clientId) {
  const data = getClientData(clientId);

  panel.innerHTML = `
    <p class="eyebrow">Historique</p>
    <h3>🕒 Timeline complète</h3>
    <p>Tous les événements marquants de la collaboration avec ce client, dans l’ordre chronologique : audits, roadmaps, dashboards mensuels, rapports PDF, études de cas, Content Planner et exports.</p>
  `;

  const events = [];

  if (data.general.startDate) {
    events.push({
      date: data.general.startDate,
      icon: '🚀',
      label: `Début de collaboration${data.general.offer ? ` — ${data.general.offer}` : ''}`
    });
  }

  data.monthOrder.forEach((key, index) => {
    const month = data.months[key];
    if (!month) {
      return;
    }
    events.push({
      date: month.createdAt || null,
      fallbackOrder: index,
      icon: '📊',
      label: `Dashboard mensuel créé : ${month.label}`
    });
  });

  (data.history || []).forEach((entry) => {
    const meta = CLIENT_HISTORY_EVENT_TYPES[entry.type] || { icon: '•' };
    events.push({ date: entry.date, icon: meta.icon, label: entry.label });
  });

  events.sort((a, b) => {
    const aTime = a.date ? new Date(a.date).getTime() : (a.fallbackOrder || 0) - 1000000;
    const bTime = b.date ? new Date(b.date).getTime() : (b.fallbackOrder || 0) - 1000000;
    return aTime - bTime;
  });

  if (!events.length) {
    const empty = document.createElement('p');
    empty.className = 'insight-empty';
    empty.textContent = 'Aucun événement enregistré pour ce client pour le moment.';
    panel.appendChild(empty);
    return;
  }

  const list = document.createElement('div');
  list.className = 'insight-list';
  events.forEach((event) => {
    const item = document.createElement('div');
    item.className = 'insight-item tone-neutral';
    const dateLabel = event.date ? new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Date non renseignée';
    item.innerHTML = `<span class="insight-icon">${event.icon}</span><span class="insight-text"><strong>${escapeHtml(dateLabel)}</strong> — ${escapeHtml(event.label)}</span>`;
    list.appendChild(item);
  });
  panel.appendChild(list);
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

  const openInPlannerLink = document.createElement('a');
  openInPlannerLink.className = 'btn btn-secondary';
  openInPlannerLink.style.margin = '10px 0 18px';
  openInPlannerLink.style.display = 'inline-block';
  openInPlannerLink.href = `../content-planner/index.html?client=${encodeURIComponent(clientId)}`;
  openInPlannerLink.textContent = '📅 Ouvrir dans le Content Planner';
  article.appendChild(openInPlannerLink);

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
  const historyTabBtn = document.createElement('button');
  historyTabBtn.type = 'button';
  historyTabBtn.className = 'planner-tab-btn';
  historyTabBtn.textContent = '🕒 Historique';
  clientTabNav.appendChild(ficheTabBtn);
  clientTabNav.appendChild(dnaTabBtn);
  clientTabNav.appendChild(historyTabBtn);
  article.appendChild(clientTabNav);

  const fichePanel = document.createElement('div');
  fichePanel.className = 'planner-tab-panel';
  const dnaPanel = document.createElement('div');
  dnaPanel.className = 'planner-tab-panel hidden';
  const historyPanel = document.createElement('div');
  historyPanel.className = 'planner-tab-panel hidden';
  article.appendChild(fichePanel);
  article.appendChild(dnaPanel);
  article.appendChild(historyPanel);

  const clientTabs = [
    { button: ficheTabBtn, panel: fichePanel },
    { button: dnaTabBtn, panel: dnaPanel },
    { button: historyTabBtn, panel: historyPanel }
  ];
  const activateClientTab = (activeEntry) => {
    clientTabs.forEach((entry) => {
      const isActive = entry === activeEntry;
      entry.button.classList.toggle('active', isActive);
      entry.panel.classList.toggle('hidden', !isActive);
    });
  };
  ficheTabBtn.addEventListener('click', () => activateClientTab(clientTabs[0]));
  dnaTabBtn.addEventListener('click', () => activateClientTab(clientTabs[1]));
  historyTabBtn.addEventListener('click', () => {
    activateClientTab(clientTabs[2]);
    renderClientHistoryTimeline(historyPanel, clientId);
  });

  dnaPanel.appendChild(renderFieldSection(clientStrategicProfileFieldsSchema));

  fichePanel.appendChild(renderFieldSection(generalFieldsSchema));

  let initialSituationBlock = renderFieldSection({
    ...initialSituationSchema,
    fields: filterFieldsByTrackedPlatforms(initialSituationSchema.fields, data.general.trackedPlatforms)
  });
  const refreshInitialSituationBlock = () => {
    const freshData = getClientData(clientId);
    const nextBlock = renderFieldSection({
      ...initialSituationSchema,
      fields: filterFieldsByTrackedPlatforms(initialSituationSchema.fields, freshData.general.trackedPlatforms)
    });
    initialSituationBlock.replaceWith(nextBlock);
    initialSituationBlock = nextBlock;
    fillFieldValues(article, freshData);
  };

  fichePanel.appendChild(renderTrackedPlatformsSection(clientId, () => {
    refreshInitialSituationBlock();
    refreshMonthContent();
  }));
  fichePanel.appendChild(initialSituationBlock);
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

    getVisibleMonthlySections(freshData.general.trackedPlatforms).forEach((section) => {
      monthContent.appendChild(renderMonthlyFieldSection(section, selectedMonth, monthData));
    });
    monthContent.appendChild(renderBusinessResultsComputedSection(monthData, freshData.general));

    monthContent.appendChild(renderSummaryCards(monthData, previousMonthData, freshData.initialSituation));
    monthContent.appendChild(renderSynthesisSection(monthData, previousMonthData, freshData.initialSituation, freshData.general.trackedPlatforms));

    const monthlyScore = computeGlobalScore(monthData, previousMonthData);
    const monthlyScoreBadge = getScoreBadge(monthlyScore, Boolean(previousMonthData));
    monthContent.appendChild(renderAlertsSection(monthData, previousMonthData));
    monthContent.appendChild(renderWinsSection(freshData, selectedMonth, monthData, previousMonthData));
    monthContent.appendChild(renderAnalysisSection(freshData, selectedMonth, monthData, previousMonthData, monthlyScore, monthlyScoreBadge));

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
        .map((objective) => ({
          id: generateId(),
          label: objective.label,
          done: false,
          kpiSection: objective.kpiSection || null,
          kpiField: objective.kpiField || null,
          baselineValue: objective.baselineValue || '',
          targetValue: objective.targetValue || '',
          deadline: objective.deadline || null
        }));

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
    if (field.type !== 'number' && field.type !== 'metric') {
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

function buildComputedBusinessResultsPdfRows(monthData, previousMonthData, generalData) {
  const rows = [
    {
      label: 'Réservations générées',
      unit: '',
      current: computeBookingsGenerated(monthData),
      previous: previousMonthData ? computeBookingsGenerated(previousMonthData) : null
    },
    {
      label: 'Chiffre d’affaires estimé',
      unit: '€',
      current: computeEstimatedRevenue(monthData, generalData),
      previous: previousMonthData ? computeEstimatedRevenue(previousMonthData, generalData) : null
    },
    {
      label: 'ROI',
      unit: 'x',
      current: computeRoi(monthData, generalData),
      previous: previousMonthData ? computeRoi(previousMonthData, generalData) : null
    }
  ];

  return rows.map((row) => {
    if (row.current === null) {
      return [{ text: row.label }, { text: '—' }, { text: '—' }];
    }
    const evolution = row.previous !== null ? computeEvolution(row.previous, row.current) : { diff: null, percent: null };
    const evoFmt = formatEvolution(evolution, row.unit);
    const color =
      evoFmt.badgeClass === 'positive' ? PDF_COLORS.positive : evoFmt.badgeClass === 'negative' ? PDF_COLORS.negative : PDF_COLORS.textSoft;
    return [{ text: row.label }, { text: formatValue(row.current, row.unit) }, { text: evoFmt.text, color }];
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
    return hasValue(value) ? parseMetricValue(value) : null;
  });
}

function getMonthlyIntentionsSeries(clientData) {
  return clientData.monthOrder.map((key) => computeIntentionsFromMonth(clientData.months[key]));
}

// Cartes KPI de référence pour le premier mois (baseline), affichées à la place de graphiques
// à un seul point qui n'apporteraient aucune valeur analytique.
function buildBaselineKpiRows(monthData, trackedPlatforms) {
  const rows = [];
  if (isPlatformTracked(trackedPlatforms, 'googleBusiness') && hasValue(monthData.googleBusiness.profileViews)) {
    rows.push(['Google Business', 'Vues de la fiche', formatNumber(monthData.googleBusiness.profileViews)]);
  }
  if (isPlatformTracked(trackedPlatforms, 'instagram') && hasValue(monthData.instagram.reach)) {
    rows.push(['Instagram', 'Comptes touchés', formatNumber(monthData.instagram.reach)]);
  }
  if (isPlatformTracked(trackedPlatforms, 'facebook') && hasValue(monthData.facebook.pageVisits)) {
    rows.push(['Facebook', 'Visites de la page', formatNumber(monthData.facebook.pageVisits)]);
  }
  if (isPlatformTracked(trackedPlatforms, 'tiktok') && hasValue(monthData.tiktok.views)) {
    rows.push(['TikTok', 'Vues', formatNumber(monthData.tiktok.views)]);
  }
  const intentions = computeIntentionsFromMonth(monthData);
  if (intentions !== null) {
    rows.push(['Intention client', 'Actions à forte intention (Google + Beacons)', formatNumber(intentions)]);
  }
  if (isPlatformTracked(trackedPlatforms, 'instagram')) {
    const conversionRatio = computeInstagramProfileConversionRatio(monthData);
    if (conversionRatio !== null) {
      rows.push(['Conversion Instagram', 'Profil → lien', `${(conversionRatio * 100).toFixed(1)}%`]);
    }
  }
  if (isPlatformTracked(trackedPlatforms, 'tiktok')) {
    const tiktokConversionRatio = computeTiktokProfileConversionRatio(monthData);
    if (tiktokConversionRatio !== null) {
      rows.push(['Conversion TikTok', 'Profil → lien', `${(tiktokConversionRatio * 100).toFixed(1)}%`]);
    }
  }
  if (!rows.length) {
    rows.push(['—', 'Aucune donnée saisie pour ce mois', '—']);
  }
  return rows;
}

// Tendance simple (hausse/baisse/stabilité) calculée sur les 3 derniers points valides d'une
// série, affichée uniquement à partir de 3 mois de données.
function computeSeriesTrendLabel(series) {
  const valid = series.filter((value) => value !== null && value !== undefined && !Number.isNaN(value));
  if (valid.length < 3) {
    return null;
  }
  const lastThree = valid.slice(-3);
  const first = lastThree[0];
  const last = lastThree[lastThree.length - 1];
  if (first === 0) {
    return null;
  }
  const change = ((last - first) / Math.abs(first)) * 100;
  if (change > 5) {
    return 'Tendance : hausse';
  }
  if (change < -5) {
    return 'Tendance : baisse';
  }
  return 'Tendance : stabilité';
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

// La conclusion synthétise (1) le niveau de recul disponible, (2) le principal constat, (3) le
// principal point de friction, (4) la priorité du mois suivant — jamais uniquement le score, et
// jamais de formulation anxiogène ("vigilance particulière", "relancer la dynamique") quand il
// n'existe encore aucune comparaison historique.
function generateConclusion(clientData, monthData, previousMonthData, score, scoreBadge) {
  const name = clientData.general.name || 'ce client';
  const monthLabel = monthData.label;
  const sentences = [];

  if (!previousMonthData) {
    sentences.push(`${monthLabel} constitue le premier mois de référence de l’accompagnement pour ${name}.`);
  } else {
    sentences.push(`${monthLabel} s’inscrit dans la continuité de l’accompagnement de ${name}, avec plusieurs mois de recul désormais disponibles.`);
  }

  const strengths = generateStrengths(monthData, previousMonthData);
  const genericStrengthPrefixes = ['Pas de progression', 'Les données de ce premier mois'];
  const mainStrength = strengths.find((item) => !genericStrengthPrefixes.some((prefix) => item.startsWith(prefix)));
  if (mainStrength) {
    sentences.push(`Les données mettent en évidence : ${mainStrength}`);
  }

  const weaknesses = generateWeaknesses(monthData, previousMonthData);
  const mainWeakness = weaknesses.find((item) => !item.startsWith('Aucune faiblesse'));
  if (mainWeakness) {
    sentences.push(`Le principal point de friction identifié : ${mainWeakness}`);
  }

  const actionItems = generateActionPlanItems(monthData, previousMonthData);
  const mainAction = actionItems.find((item) => !item.startsWith('Maintenir le rythme'));
  if (mainAction) {
    sentences.push(`Priorité du mois suivant : ${mainAction}`);
  }

  if (score !== null) {
    sentences.push(`Score global du mois : ${score}/100 (${scoreBadge.label}).`);
  }

  sentences.push('L’équipe AnaVibe reste à disposition pour accompagner la mise en œuvre du plan d’action du mois prochain.');

  return sentences.join(' ');
}

function buildNextMonthActionPlan(monthData, previousMonthData) {
  const carriedOver = monthData.actionPlan
    .filter((action) => action.status !== 'Terminé')
    .map((action) => `${action.label} (statut actuel : ${action.status})`);

  const actionItems = generateActionPlanItems(monthData, previousMonthData);

  const seen = new Set();
  return [...carriedOver, ...actionItems].filter((item) => {
    if (seen.has(item)) {
      return false;
    }
    seen.add(item);
    return true;
  });
}

// Seeds a brand-new month's action plan from the previous one, so closing a month and
// opening the next never requires retyping open actions or the operational tasks the
// analysis already produced (generateActionPlanItems — never the diagnostic recommendations,
// which answer a different question: "what should improve" vs "what will we do").
function buildCarriedOverActionPlanItems(monthData, previousMonthData) {
  const carriedLabels = (monthData.actionPlan || [])
    .filter((action) => action.status !== 'Terminé')
    .map((action) => action.label);

  const actionItems = generateActionPlanItems(monthData, previousMonthData);

  const seen = new Set();
  return [...carriedLabels, ...actionItems].filter((label) => {
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
  const scoreBadge = getScoreBadge(score, Boolean(previousMonthData));
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
      objectivesSentence: objectivesSentenceForSummary,
      hasPreviousMonth: Boolean(previousMonthData)
    })
  );

  addPdfSubTitle(state, 'Score détaillé par pilier');
  addPdfBulletList(state, buildScorePillarsLines(computeScorePillars(monthData, previousMonthData)));

  addPdfSectionTitle(state, '2. Tableau des KPI');
  getVisibleMonthlySections(data.general.trackedPlatforms).forEach((section) => {
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
  addPdfSubTitle(state, 'Résultats business calculés');
  addPdfTable(
    state,
    [
      { header: 'Indicateur', width: 76 },
      { header: 'Valeur du mois', width: 34 },
      { header: 'Évolution vs mois précédent', width: 64 }
    ],
    buildComputedBusinessResultsPdfRows(monthData, previousMonthData, data.general)
  );

  doc.addPage();
  state.cursorY = state.marginTop;

  if (monthOrder.length < 2) {
    // Un seul mois de données : 4 graphiques à un point n'apportent aucune valeur analytique.
    // On affiche à la place une "Baseline du mois" sous forme de cartes KPI de référence.
    addPdfSectionTitle(state, '3. Baseline du mois');
    addPdfParagraph(
      state,
      'Premier mois de données : les graphiques d’évolution apparaîtront à partir du deuxième mois de reporting. Voici les indicateurs de référence (baseline) sur lesquels les prochaines évolutions seront mesurées.'
    );
    addPdfTable(
      state,
      [
        { header: 'Canal', width: 50 },
        { header: 'Indicateur', width: 84 },
        { header: 'Valeur de référence', width: 40 }
      ],
      buildBaselineKpiRows(monthData, data.general.trackedPlatforms).map((row) => row.map((text) => ({ text })))
    );
  } else {
    addPdfSectionTitle(state, '3. Évolution dans le temps');
    const monthLabels = monthOrder.map((key) => data.months[key].label);
    const chartDefinitions = [
      { platform: 'googleBusiness', title: 'Google Business — Vues de la fiche', getSeries: () => getMonthlySeries(data, 'googleBusiness', 'profileViews') },
      { platform: 'instagram', title: 'Instagram — Portée', getSeries: () => getMonthlySeries(data, 'instagram', 'reach') },
      { platform: 'facebook', title: 'Facebook — Visites de la page', getSeries: () => getMonthlySeries(data, 'facebook', 'pageVisits') },
      { platform: 'tiktok', title: 'TikTok — Vues', getSeries: () => getMonthlySeries(data, 'tiktok', 'views') },
      { title: 'Intentions clients (Google + Beacons)', getSeries: () => getMonthlyIntentionsSeries(data) }
    ].filter((chartDef) => isPlatformTracked(data.general.trackedPlatforms, chartDef.platform));

    const chartColumnWidth = 84;
    const chartImageHeight = 58;
    // À partir de 3 mois, une ligne de tendance (hausse/baisse/stabilité) est ajoutée sous
    // chaque graphique : la ligne supplémentaire a besoin d'un peu plus de hauteur de rangée.
    const showTrend = monthOrder.length >= 3;
    const chartRowHeight = showTrend ? chartImageHeight + 5 : chartImageHeight;
    const chartGap = 6;

    chartDefinitions.forEach((chartDef, index) => {
      const series = chartDef.getSeries();
      const imageData = createCompactLineChartImage(chartDef.title, monthLabels, series);
      const column = index % 2;
      if (column === 0) {
        ensurePdfSpace(state, chartRowHeight + 6);
      }
      const x = state.marginLeft + column * (chartColumnWidth + chartGap);
      doc.addImage(imageData, 'PNG', x, state.cursorY, chartColumnWidth, chartImageHeight);
      if (showTrend) {
        const trendLabel = computeSeriesTrendLabel(series);
        if (trendLabel) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(...PDF_COLORS.textSoft);
          doc.text(trendLabel, x, state.cursorY + chartImageHeight + 4);
        }
      }
      if (column === 1 || index === chartDefinitions.length - 1) {
        state.cursorY += chartRowHeight + 6;
      }
    });
  }

  doc.addPage();
  state.cursorY = state.marginTop;
  addPdfSectionTitle(state, '4. Analyse du mois');
  const analysisSections = [
    { platform: 'googleBusiness', title: 'Analyse Google Business', text: generateGoogleAnalysis(monthData, previousMonthData) },
    { platform: 'instagram', title: 'Analyse Instagram', text: generateInstagramAnalysis(monthData, previousMonthData) },
    { platform: 'facebook', title: 'Analyse Facebook', text: generateFacebookAnalysis(monthData, previousMonthData) },
    { platform: 'tiktok', title: 'Analyse TikTok', text: generateTiktokAnalysis(monthData, previousMonthData) },
    { title: 'Analyse Beacons', text: generateBeaconsAnalysis(monthData, previousMonthData) },
    { title: 'Analyse des objectifs', text: generateObjectivesAnalysis(monthData) }
  ].filter((section) => isPlatformTracked(data.general.trackedPlatforms, section.platform));
  analysisSections.forEach((section) => {
    addPdfSubTitle(state, section.title);
    addPdfParagraph(state, section.text);
  });

  addPdfSubTitle(state, previousMonthData ? 'Forces du mois' : 'Points d’appui identifiés');
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
    addPdfChecklist(
      state,
      monthData.monthlyObjectives.map((objective) => ({ ...objective, label: buildObjectivePdfLabel(objective, monthData) }))
    );
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
  addPdfParagraph(state, generateConclusion(data, monthData, previousMonthData, score, scoreBadge));

  addPdfFootersAndPageNumbers(doc, data.general.name || 'ce client');

  const fileName = `Rapport-AnaVibe-${normalizeId(data.general.name || clientId)}-${selectedMonth}.pdf`;
  doc.save(fileName);
  appendClientHistoryEvent(clientId, 'report-pdf', `Rapport PDF mensuel téléchargé (${monthData.label})`);
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

  const values = [beforeValue, afterValue].map((value) => (hasValue(value) ? parseMetricValue(value) : 0));
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
    const valueText = hasValue(bar.rawValue) ? formatNumber(bar.rawValue) : '—';
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
  appendClientHistoryEvent(clientId, 'case-study', 'Étude de cas PDF téléchargée');
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
