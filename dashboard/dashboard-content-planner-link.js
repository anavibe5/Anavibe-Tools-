// Lecture seule des données du Content Planner (localStorage) pour afficher, dans le
// Dashboard Clients, si la stratégie éditoriale prévue a été réellement exécutée ce
// mois-ci. Ce fichier n'importe ni ne modifie script.js : il observe le DOM que
// renderDashboard() construit et y ajoute un bloc supplémentaire par client, sans
// jamais toucher à la logique existante du Dashboard.
//
// Ces clés/valeurs dupliquent volontairement celles de content-planner.js (modules
// indépendants, chacun avec son propre fichier JS) : elles doivent rester synchronisées
// si le schéma du Content Planner évolue.
const DCPL_CONFIG_KEY = 'anavibe-tools-content-planner-config';
const DCPL_CALENDAR_KEY = 'anavibe-tools-content-planner-calendar';
const DCPL_PRODUCTION_STAGES = ['À tourner', 'Tourné', 'Monté', 'Programmé', 'Publié'];

function dcplGetContentPlannerConfig() {
  try {
    const saved = localStorage.getItem(DCPL_CONFIG_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    return null;
  }
}

function dcplGetContentPlannerCalendar() {
  try {
    const saved = localStorage.getItem(DCPL_CALENDAR_KEY);
    const parsed = saved ? JSON.parse(saved) : null;
    return parsed && Array.isArray(parsed.items) ? parsed : null;
  } catch (error) {
    return null;
  }
}

function dcplComputeProductionStats(calendar) {
  const items = (calendar && calendar.items) || [];
  const total = items.length;
  const stageIndex = (stage) => DCPL_PRODUCTION_STAGES.indexOf(stage);
  const countAtLeast = (stage) => items.filter((item) => stageIndex(item.status) >= stageIndex(stage)).length;
  return {
    total,
    tourne: countAtLeast('Tourné'),
    monte: countAtLeast('Monté'),
    programme: countAtLeast('Programmé'),
    publie: countAtLeast('Publié')
  };
}

function dcplEscapeText(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]
  ));
}

function dcplCreateProgressCard(icon, label, done, total) {
  const card = document.createElement('div');
  card.className = 'progress-card card';
  const percent = total ? Math.round((done / total) * 100) : 0;
  card.innerHTML = `
    <span class="progress-label">${icon} ${dcplEscapeText(label)}</span>
    <strong>${done} / ${total}</strong>
    <div class="progress-track"><span class="progress-fill" style="width: ${percent}%"></span></div>
  `;
  return card;
}

function dcplBuildEmptyBlock(message) {
  const block = document.createElement('div');
  block.className = 'section-block';
  block.dataset.dcplBlock = 'true';
  block.innerHTML = `
    <div class="section-heading">
      <div>
        <p class="eyebrow">Content Planner</p>
        <h3>Suivi de production</h3>
      </div>
    </div>
    <p class="insight-empty">${dcplEscapeText(message)}</p>
  `;
  return block;
}

function dcplBuildSection(clientId) {
  const config = dcplGetContentPlannerConfig();
  const linkedClientId = config && config.dashboardClientId;

  if (!linkedClientId || linkedClientId !== clientId) {
    return dcplBuildEmptyBlock('Aucun plan de contenu actif dans le Content Planner pour ce client actuellement.');
  }

  const calendar = dcplGetContentPlannerCalendar();
  if (!calendar || !calendar.items.length) {
    return dcplBuildEmptyBlock('Aucun calendrier n’a encore été généré dans le Content Planner pour ce client.');
  }

  const stats = dcplComputeProductionStats(calendar);

  const block = document.createElement('div');
  block.className = 'section-block';
  block.dataset.dcplBlock = 'true';
  block.innerHTML = `
    <div class="section-heading">
      <div>
        <p class="eyebrow">Content Planner — ${dcplEscapeText(calendar.monthLabel || '')}</p>
        <h3>Suivi de production</h3>
      </div>
    </div>
    <p class="notes-hint">Vérifie si la stratégie éditoriale prévue par le Content Planner a réellement été exécutée ce mois-ci.</p>
  `;

  const grid = document.createElement('div');
  grid.className = 'progress-grid';
  grid.appendChild(dcplCreateProgressCard('🎥', 'Tournage', stats.tourne, stats.total));
  grid.appendChild(dcplCreateProgressCard('✂️', 'Montage', stats.monte, stats.total));
  grid.appendChild(dcplCreateProgressCard('📅', 'Programmation', stats.programme, stats.total));
  grid.appendChild(dcplCreateProgressCard('✅', 'Publications', stats.publie, stats.total));
  block.appendChild(grid);

  return block;
}

function dcplInjectAll() {
  document.querySelectorAll('.client-dashboard-card[data-client-id]').forEach((card) => {
    const clientId = card.dataset.clientId;
    const monthContent = card.querySelector('[data-role="month-content"]');
    if (!monthContent) {
      return;
    }
    const freshBlock = dcplBuildSection(clientId);
    const existing = card.querySelector('[data-dcpl-block="true"]');
    if (existing) {
      existing.replaceWith(freshBlock);
    } else {
      monthContent.insertAdjacentElement('afterend', freshBlock);
    }
  });
}

function dcplObserveDashboard() {
  const container = document.getElementById('clientDashboards');
  if (!container) {
    return;
  }
  // Only reacts to whole-card rebuilds (childList on the container itself), never to the
  // per-client month-content refreshes nested inside each card, so it never loops back on itself.
  const observer = new MutationObserver(() => {
    dcplInjectAll();
  });
  observer.observe(container, { childList: true, subtree: false });
  dcplInjectAll();
}

window.addEventListener('storage', (event) => {
  if (event.key === DCPL_CONFIG_KEY || event.key === DCPL_CALENDAR_KEY) {
    dcplInjectAll();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  dcplObserveDashboard();
});
