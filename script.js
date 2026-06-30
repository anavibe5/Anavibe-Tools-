const clientSeedData = [
  {
    id: 'chez-boris',
    name: 'Chez Boris',
    industry: 'Restaurant',
    description: 'Client restaurant avec un pilotage local, e-reputation et developpement de visibilite.',
    monthlyGoal: 'Booster la visibilite locale et structurer le suivi mensuel.',
    kpis: [
      { label: 'Visibilite locale', value: '+18%' },
      { label: 'Avis clients', value: '4.7/5' },
      { label: 'Priorite du mois', value: 'Google Business' }
    ],
    progress: [
      { label: 'Audit initial', value: 100 },
      { label: 'Optimisation GBP', value: 72 },
      { label: 'Strategie de contenu', value: 54 }
    ]
  },
  {
    id: 'toast-tea',
    name: 'Toast’Tea',
    industry: 'Restauration / Lifestyle',
    description: 'Client lifestyle avec besoin de coherence de marque, contenu et reputation digitale.',
    monthlyGoal: 'Ameliorer la notoriete et accelerer la production editoriale.',
    kpis: [
      { label: 'Portee digitale', value: '+22%' },
      { label: 'Engagement contenu', value: '+31%' },
      { label: 'Priorite du mois', value: 'Content Planner' }
    ],
    progress: [
      { label: 'Diagnostic marque', value: 100 },
      { label: 'Calendrier editorial', value: 80 },
      { label: 'Optimisation presence locale', value: 61 }
    ]
  }
];

const storageKey = 'anavibe-tools-clients';

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

function getClients() {
  const saved = localStorage.getItem(storageKey);

  if (!saved) {
    localStorage.setItem(storageKey, JSON.stringify(clientSeedData));
    return clientSeedData;
  }

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length ? parsed : clientSeedData;
  } catch (error) {
    localStorage.setItem(storageKey, JSON.stringify(clientSeedData));
    return clientSeedData;
  }
}

function saveClients(clients) {
  localStorage.setItem(storageKey, JSON.stringify(clients));
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

function renderDashboard() {
  const list = document.getElementById('clientList');
  const container = document.getElementById('clientDashboards');
  const emptyState = document.getElementById('emptyState');
  const addClientButton = document.getElementById('addClientButton');

  if (!list || !container) {
    return;
  }

  const clients = getClients();
  const hash = window.location.hash.replace('#', '');
  let activeClientId = hash || clients[0]?.id;

  const createDashboardCard = (client) => {
    const article = document.createElement('article');
    article.className = 'client-dashboard-card card';
    article.id = client.id;
    article.dataset.clientId = client.id;

    article.innerHTML = `
      <span class="client-chip">${client.industry}</span>
      <h3>${client.name}</h3>
      <p>${client.description}</p>
      <div class="kpi-grid">
        ${client.kpis
          .map(
            (kpi) => `
              <div class="kpi-card card">
                <span class="kpi-label">${kpi.label}</span>
                <strong>${kpi.value}</strong>
              </div>
            `
          )
          .join('')}
      </div>
      <div class="section-block">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Objectif mensuel</p>
            <h3>${client.monthlyGoal}</h3>
          </div>
        </div>
        <div class="progress-grid">
          ${client.progress
            .map(
              (step) => `
                <div class="progress-card card">
                  <span class="progress-label">${step.label}</span>
                  <strong>${step.value}%</strong>
                  <div class="progress-track">
                    <span class="progress-fill" style="width: ${step.value}%"></span>
                  </div>
                </div>
              `
            )
            .join('')}
        </div>
      </div>
    `;

    return article;
  };

  const render = () => {
    const updatedClients = getClients();
    list.innerHTML = '';
    container.innerHTML = '';

    if (!updatedClients.length) {
      emptyState?.classList.remove('hidden');
      return;
    }

    emptyState?.classList.add('hidden');

    updatedClients.forEach((client) => {
      const row = document.createElement('div');
      row.className = 'client-item';
      row.innerHTML = `
        <div>
          <strong>${client.name}</strong>
          <p>${client.industry}</p>
        </div>
        <button class="client-open-btn" data-client-id="${client.id}">Ouvrir</button>
      `;
      list.appendChild(row);

      const dashboardCard = createDashboardCard(client);
      if (client.id !== activeClientId) {
        dashboardCard.classList.add('hidden');
      }
      container.appendChild(dashboardCard);
    });

    list.querySelectorAll('.client-open-btn').forEach((button) => {
      button.addEventListener('click', () => {
        activeClientId = button.dataset.clientId;
        window.location.hash = activeClientId;
        render();
      });
    });
  };

  addClientButton?.addEventListener('click', () => {
    const name = window.prompt('Nom du nouveau client :');
    if (!name) {
      return;
    }

    const clientsList = getClients();
    const id = normalizeId(name);
    const exists = clientsList.some((client) => client.id === id);
    if (exists) {
      window.alert('Ce client existe deja.');
      return;
    }

    const newClient = {
      id,
      name,
      industry: 'Nouveau client',
      description: 'Dashboard pret a etre personnalise avec les objectifs, les KPIs et le plan d’action AnaVibe.',
      monthlyGoal: 'Definir le plan de croissance prioritaire du mois.',
      kpis: [
        { label: 'Visibilite', value: 'A definir' },
        { label: 'Reputation', value: 'A definir' },
        { label: 'Priorite', value: 'A definir' }
      ],
      progress: [
        { label: 'Audit initial', value: 0 },
        { label: 'Plan d’action', value: 0 },
        { label: 'Suivi mensuel', value: 0 }
      ]
    };

    clientsList.push(newClient);
    saveClients(clientsList);
    activeClientId = newClient.id;
    window.location.hash = activeClientId;
    render();
  });

  render();
}

document.addEventListener('DOMContentLoaded', () => {
  setupMobileMenu();
  highlightCurrentNav();
  renderDashboard();
});
