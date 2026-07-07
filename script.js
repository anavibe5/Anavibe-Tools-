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
    facebook: {
      followers: 960,
      reach: 3200,
      impressions: 5100,
      interactions: 210,
      linkClicks: 24,
      posts: 5
    },
    beacons: {
      bookingClicks: 74,
      phoneClicks: 41,
      directionsClicks: 62
    },
    businessResults: {
      bookingsGenerated: 32,
      estimatedRevenue: '4 200 €',
      roi: '3.1x',
      goalReached: 'Partiel',
      remainingPotential: '1 800 €'
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
    ],
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
    facebook: {
      followers: 1240,
      reach: 4100,
      impressions: 6700,
      interactions: 305,
      linkClicks: 38,
      posts: 7
    },
    beacons: {
      bookingClicks: 52,
      phoneClicks: 28,
      directionsClicks: 45
    },
    businessResults: {
      bookingsGenerated: 18,
      estimatedRevenue: '2 950 €',
      roi: '2.4x',
      goalReached: 'Oui',
      remainingPotential: '900 €'
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
    ],
    internalNotes: 'Forte dynamique sur Instagram, continuer la régularité de publication.'
  }
];

const CLIENT_IDS_KEY = 'anavibe-tools-client-ids';
const CLIENT_DATA_PREFIX = 'anavibe-tools-client-data-';

const actionStatusOptions = ['À faire', 'En cours', 'Terminé'];

const clientSectionSchema = [
  {
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
  },
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
      { key: 'engagementRate', label: 'Taux d’engagement (%)', type: 'number', step: '0.1' },
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
      { key: 'estimatedRevenue', label: 'Chiffre d’affaires estimé', type: 'text' },
      { key: 'roi', label: 'ROI', type: 'text' },
      { key: 'goalReached', label: 'Objectif atteint', type: 'select', options: ['Non', 'Partiel', 'Oui'] },
      { key: 'remainingPotential', label: 'Potentiel restant', type: 'text' }
    ]
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
    actionPlan: [],
    internalNotes: ''
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
      return JSON.parse(saved);
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

function createFieldControl(sectionKey, field) {
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
  wrapper.appendChild(input);
  return wrapper;
}

function renderFieldSection(section) {
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
    grid.appendChild(createFieldControl(section.key, field));
  });

  return block;
}

function fillFieldValues(article, clientData) {
  article.querySelectorAll('.field-input[data-section]').forEach((input) => {
    const { section, field } = input.dataset;
    const value = clientData[section] ? clientData[section][field] : undefined;
    input.value = value === undefined || value === null ? '' : value;
  });
}

function createObjectiveRow(clientId, objective, onRemove) {
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
    const target = data.monthlyObjectives.find((item) => item.id === objective.id);
    if (target) {
      target.done = checkbox.checked;
      saveClientData(clientId, data);
    }
    row.classList.toggle('done', checkbox.checked);
  });

  removeButton.addEventListener('click', () => {
    const data = getClientData(clientId);
    data.monthlyObjectives = data.monthlyObjectives.filter((item) => item.id !== objective.id);
    saveClientData(clientId, data);
    onRemove();
  });

  row.appendChild(label);
  row.appendChild(removeButton);
  return row;
}

function renderObjectivesSection(clientId) {
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
    list.innerHTML = '';
    data.monthlyObjectives.forEach((objective) => {
      list.appendChild(createObjectiveRow(clientId, objective, renderList));
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
    data.monthlyObjectives.push({ id: generateId(), label, done: false });
    saveClientData(clientId, data);
    input.value = '';
    renderList();
  });

  renderList();
  return block;
}

function createActionRow(clientId, action, onRemove) {
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
    const target = data.actionPlan.find((item) => item.id === action.id);
    if (target) {
      target.status = select.value;
      saveClientData(clientId, data);
    }
  });

  removeButton.addEventListener('click', () => {
    const data = getClientData(clientId);
    data.actionPlan = data.actionPlan.filter((item) => item.id !== action.id);
    saveClientData(clientId, data);
    onRemove();
  });

  row.appendChild(label);
  row.appendChild(select);
  row.appendChild(removeButton);
  return row;
}

function renderActionPlanSection(clientId) {
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
    list.innerHTML = '';
    data.actionPlan.forEach((action) => {
      list.appendChild(createActionRow(clientId, action, renderList));
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
    data.actionPlan.push({ id: generateId(), label, status: actionStatusOptions[0] });
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

function handleFieldChange(event, clientId, article) {
  const target = event.target;
  if (!target.matches('.field-input')) {
    return;
  }

  const { section, field } = target.dataset;
  if (!section || !field) {
    return;
  }

  const data = getClientData(clientId);
  if (!data[section]) {
    return;
  }

  const isNumber = target.type === 'number';
  data[section][field] = isNumber && target.value !== '' ? Number(target.value) : target.value;
  saveClientData(clientId, data);

  if (section === 'general' && field === 'name') {
    article.querySelector('[data-role="name-heading"]').textContent = target.value;
    updateSidebarRow(clientId, data);
  }

  if (section === 'general' && field === 'type') {
    article.querySelector('[data-role="type-chip"]').textContent = target.value || 'Client';
    updateSidebarRow(clientId, data);
  }
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

  clientSectionSchema.forEach((section) => {
    article.appendChild(renderFieldSection(section));
  });

  article.appendChild(renderObjectivesSection(clientId));
  article.appendChild(renderActionPlanSection(clientId));
  article.appendChild(renderNotesSection(clientId, data));

  fillFieldValues(article, data);

  article.addEventListener('input', (event) => handleFieldChange(event, clientId, article));
  article.addEventListener('change', (event) => handleFieldChange(event, clientId, article));

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
