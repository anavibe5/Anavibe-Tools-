const AUDIT_CONFIG_KEY = 'anavibe-tools-audit-restaurant-config';
const AUDIT_RATINGS_KEY = 'anavibe-tools-audit-restaurant-ratings';

const activityTypes = [
  { key: 'restaurant', label: 'Restaurant', icon: '🍽' },
  { key: 'commerce', label: 'Commerce', icon: '🛍' },
  { key: 'sante-medical', label: 'Santé / Médical', icon: '🏥' },
  { key: 'sport', label: 'Sport', icon: '🏋' },
  { key: 'services', label: 'Services', icon: '🛠' },
  { key: 'autre', label: 'Autre', icon: '✨' }
];

const platformOptions = [
  { key: 'googleBusiness', label: 'Google Business', icon: '📍' },
  { key: 'website', label: 'Site internet', icon: '🌐' },
  { key: 'instagram', label: 'Instagram', icon: '📸' },
  { key: 'facebook', label: 'Facebook', icon: '📘' },
  { key: 'tiktok', label: 'TikTok', icon: '🎵' },
  { key: 'linkedin', label: 'LinkedIn', icon: '💼' }
];

const ratingLevels = [
  { value: 0, label: 'Absent' },
  { value: 25, label: 'Faible' },
  { value: 50, label: 'Moyen' },
  { value: 75, label: 'Bon' },
  { value: 100, label: 'Excellent' }
];

const platformAuditDefinitions = {
  googleBusiness: {
    title: 'Google Business',
    icon: '📍',
    criteria: [
      { key: 'rating', label: 'Note Google', dimension: 'acquisition', recommendation: 'Travailler l’expérience client pour faire remonter la note Google au-dessus de 4,5/5.' },
      { key: 'reviewsCount', label: 'Nombre d’avis', dimension: 'acquisition', recommendation: 'Mettre en place une stratégie active de collecte d’avis (QR code, relance après visite, etc.).' },
      { key: 'reviewsFrequency', label: 'Fréquence des avis', dimension: 'fidelisation', recommendation: 'Solliciter régulièrement de nouveaux avis pour maintenir un flux constant et rassurer les prospects.' },
      { key: 'reviewsResponse', label: 'Réponses aux avis', dimension: 'fidelisation', recommendation: 'Répondre systématiquement à tous les avis, positifs comme négatifs.' },
      { key: 'reviewsResponseQuality', label: 'Qualité des réponses', dimension: 'fidelisation', recommendation: 'Personnaliser les réponses aux avis plutôt que d’utiliser des réponses génériques.' },
      { key: 'description', label: 'Description', dimension: 'visibilite', recommendation: 'Rédiger une description complète et optimisée mettant en avant l’activité et ses points forts.' },
      { key: 'categories', label: 'Catégories', dimension: 'visibilite', recommendation: 'Ajouter toutes les catégories pertinentes pour améliorer la visibilité sur les recherches associées.' },
      { key: 'services', label: 'Services', dimension: 'acquisition', recommendation: 'Renseigner l’ensemble des services proposés dans la fiche.' },
      { key: 'phone', label: 'Téléphone', dimension: 'acquisition', recommendation: 'Vérifier que le numéro de téléphone est correct, visible et cliquable.' },
      { key: 'hours', label: 'Horaires', dimension: 'acquisition', recommendation: 'Mettre à jour les horaires d’ouverture, y compris les jours fériés et exceptions.' },
      { key: 'website', label: 'Site internet', dimension: 'acquisition', recommendation: 'Ajouter le lien vers le site internet sur la fiche Google Business.' },
      { key: 'menu', label: 'Menu', dimension: 'acquisition', recommendation: 'Ajouter ou mettre à jour le menu directement sur la fiche.' },
      { key: 'booking', label: 'Réservation', dimension: 'acquisition', recommendation: 'Activer un lien de réservation en ligne directement accessible depuis la fiche.' },
      { key: 'posts', label: 'Publications', dimension: 'visibilite', recommendation: 'Publier régulièrement des actualités, offres ou événements via Google Posts.' },
      { key: 'photos', label: 'Photos', dimension: 'visibilite', recommendation: 'Ajouter davantage de photos récentes et de qualité (extérieur, intérieur, produits, équipe).' },
      { key: 'videos', label: 'Vidéos', dimension: 'visibilite', recommendation: 'Ajouter des vidéos courtes pour dynamiser la fiche et renforcer l’engagement.' },
      { key: 'faq', label: 'FAQ', dimension: 'acquisition', recommendation: 'Compléter la section Questions & Réponses avec les questions les plus fréquentes.' },
      { key: 'attributes', label: 'Attributs', dimension: 'visibilite', recommendation: 'Renseigner tous les attributs pertinents (accessibilité, terrasse, options, etc.).' }
    ]
  },
  website: {
    title: 'Site internet',
    icon: '🌐',
    criteria: [
      { key: 'responsive', label: 'Responsive', dimension: 'acquisition', recommendation: 'Adapter le site pour un affichage parfait sur mobile et tablette.' },
      { key: 'speed', label: 'Vitesse', dimension: 'acquisition', recommendation: 'Optimiser la vitesse de chargement (images, hébergement, code).' },
      { key: 'design', label: 'Design', dimension: 'acquisition', recommendation: 'Moderniser le design pour refléter une image premium et professionnelle.' },
      { key: 'booking', label: 'Réservation', dimension: 'acquisition', recommendation: 'Ajouter un système de réservation ou de contact rapide directement sur le site.' },
      { key: 'menu', label: 'Menu', dimension: 'acquisition', recommendation: 'Rendre le menu facilement accessible et à jour.' },
      { key: 'seo', label: 'SEO', dimension: 'visibilite', recommendation: 'Optimiser le référencement naturel (titres, balises, contenu local).' },
      { key: 'contactInfo', label: 'Coordonnées', dimension: 'acquisition', recommendation: 'Afficher clairement adresse, téléphone et horaires sur toutes les pages.' },
      { key: 'cta', label: 'CTA', dimension: 'acquisition', recommendation: 'Ajouter des appels à l’action clairs (réserver, appeler, découvrir).' },
      { key: 'photos', label: 'Photos', dimension: 'visibilite', recommendation: 'Utiliser des photos professionnelles et représentatives de l’activité.' },
      { key: 'consistency', label: 'Cohérence', dimension: 'visibilite', recommendation: 'Harmoniser le site avec l’identité visuelle utilisée sur les réseaux sociaux.' }
    ]
  },
  instagram: {
    title: 'Instagram',
    icon: '📸',
    criteria: [
      { key: 'profilePhoto', label: 'Photo de profil', dimension: 'visibilite', recommendation: 'Utiliser une photo de profil professionnelle et reconnaissable (logo ou photo de l’établissement).' },
      { key: 'bio', label: 'Bio', dimension: 'visibilite', recommendation: 'Rédiger une bio claire présentant l’activité, la localisation et une proposition de valeur.' },
      { key: 'link', label: 'Lien', dimension: 'acquisition', recommendation: 'Ajouter un lien cliquable (site, menu, réservation) dans la bio.' },
      { key: 'visualIdentity', label: 'Identité visuelle', dimension: 'visibilite', recommendation: 'Harmoniser couleurs, filtres et styles visuels pour une identité cohérente.' },
      { key: 'feed', label: 'Feed', dimension: 'visibilite', recommendation: 'Structurer le feed pour qu’il soit esthétique et cohérent dans son ensemble.' },
      { key: 'stories', label: 'Stories', dimension: 'fidelisation', recommendation: 'Publier des stories régulièrement pour maintenir le contact quotidien avec la communauté.' },
      { key: 'storiesHighlights', label: 'Stories à la une', dimension: 'fidelisation', recommendation: 'Organiser des stories à la une thématiques (menu, avis, coulisses, événements).' },
      { key: 'reels', label: 'Reels', dimension: 'visibilite', recommendation: 'Produire des Reels réguliers, format le plus performant pour la portée organique.' },
      { key: 'photoQuality', label: 'Qualité des photos', dimension: 'visibilite', recommendation: 'Améliorer la qualité des photos (lumière, cadrage, mise en scène).' },
      { key: 'videoQuality', label: 'Qualité des vidéos', dimension: 'visibilite', recommendation: 'Soigner la qualité des vidéos (stabilité, montage, son).' },
      { key: 'frequency', label: 'Fréquence', dimension: 'visibilite', recommendation: 'Publier plus régulièrement pour rester visible dans l’algorithme.' },
      { key: 'cta', label: 'CTA', dimension: 'acquisition', recommendation: 'Ajouter des appels à l’action clairs dans les publications (réserver, venir, découvrir).' },
      { key: 'hashtags', label: 'Hashtags', dimension: 'visibilite', recommendation: 'Utiliser des hashtags pertinents et variés pour élargir la portée.' },
      { key: 'geolocation', label: 'Géolocalisation', dimension: 'visibilite', recommendation: 'Géolocaliser systématiquement les publications et stories.' },
      { key: 'engagement', label: 'Engagement', dimension: 'fidelisation', recommendation: 'Interagir davantage avec la communauté (réponses aux commentaires et messages).' }
    ]
  },
  facebook: {
    title: 'Facebook',
    icon: '📘',
    criteria: [
      { key: 'profilePhoto', label: 'Photo de profil', dimension: 'visibilite', recommendation: 'Utiliser une photo de profil professionnelle et reconnaissable.' },
      { key: 'description', label: 'Description', dimension: 'visibilite', recommendation: 'Rédiger une description complète présentant l’activité et ses points forts.' },
      { key: 'link', label: 'Lien', dimension: 'acquisition', recommendation: 'Ajouter un lien vers le site ou la réservation dans les informations de la page.' },
      { key: 'visualIdentity', label: 'Identité visuelle', dimension: 'visibilite', recommendation: 'Harmoniser couleurs et visuels avec les autres canaux de communication.' },
      { key: 'feed', label: 'Fil d’actualité', dimension: 'visibilite', recommendation: 'Structurer les publications pour qu’elles soient cohérentes et attractives.' },
      { key: 'stories', label: 'Stories', dimension: 'fidelisation', recommendation: 'Publier des stories régulièrement pour dynamiser la présence sur la page.' },
      { key: 'videos', label: 'Vidéos', dimension: 'visibilite', recommendation: 'Ajouter davantage de contenus vidéo, très favorisés par l’algorithme.' },
      { key: 'photoQuality', label: 'Qualité des photos', dimension: 'visibilite', recommendation: 'Améliorer la qualité des photos publiées.' },
      { key: 'videoQuality', label: 'Qualité des vidéos', dimension: 'visibilite', recommendation: 'Soigner la qualité des vidéos (stabilité, montage, son).' },
      { key: 'frequency', label: 'Fréquence', dimension: 'visibilite', recommendation: 'Publier plus régulièrement pour maintenir la visibilité de la page.' },
      { key: 'cta', label: 'CTA', dimension: 'acquisition', recommendation: 'Ajouter des appels à l’action clairs dans les publications.' },
      { key: 'reviews', label: 'Avis Facebook', dimension: 'acquisition', recommendation: 'Activer et solliciter les avis/recommandations Facebook.' },
      { key: 'geolocation', label: 'Géolocalisation', dimension: 'visibilite', recommendation: 'Géolocaliser systématiquement les publications.' },
      { key: 'engagement', label: 'Engagement', dimension: 'fidelisation', recommendation: 'Interagir davantage avec la communauté (commentaires, messages).' }
    ]
  },
  tiktok: {
    title: 'TikTok',
    icon: '🎵',
    criteria: [
      { key: 'profilePhoto', label: 'Photo de profil', dimension: 'visibilite', recommendation: 'Utiliser une photo de profil professionnelle et reconnaissable.' },
      { key: 'bio', label: 'Bio', dimension: 'visibilite', recommendation: 'Rédiger une bio claire présentant l’activité et sa localisation.' },
      { key: 'link', label: 'Lien', dimension: 'acquisition', recommendation: 'Ajouter un lien cliquable vers le site ou la réservation.' },
      { key: 'visualIdentity', label: 'Identité visuelle', dimension: 'visibilite', recommendation: 'Harmoniser le style visuel des vidéos avec l’identité de marque.' },
      { key: 'videos', label: 'Vidéos', dimension: 'visibilite', recommendation: 'Publier davantage de contenus vidéo courts et engageants.' },
      { key: 'videoQuality', label: 'Qualité des vidéos', dimension: 'visibilite', recommendation: 'Améliorer la qualité de production (cadrage, lumière, montage, son).' },
      { key: 'frequency', label: 'Fréquence', dimension: 'visibilite', recommendation: 'Publier plus régulièrement pour bénéficier de l’algorithme de découverte.' },
      { key: 'hashtags', label: 'Hashtags', dimension: 'visibilite', recommendation: 'Utiliser des hashtags pertinents et tendance pour élargir la portée.' },
      { key: 'trends', label: 'Tendances', dimension: 'visibilite', recommendation: 'S’appuyer sur les tendances et sons populaires du moment.' },
      { key: 'engagement', label: 'Engagement', dimension: 'fidelisation', recommendation: 'Répondre aux commentaires et interagir avec la communauté.' }
    ]
  },
  linkedin: {
    title: 'LinkedIn',
    icon: '💼',
    criteria: [
      { key: 'logo', label: 'Logo / Photo de profil', dimension: 'visibilite', recommendation: 'Utiliser un logo net et à jour comme photo de profil de la page.' },
      { key: 'banner', label: 'Bannière', dimension: 'visibilite', recommendation: 'Ajouter une bannière professionnelle représentant l’activité.' },
      { key: 'description', label: 'Description de l’entreprise', dimension: 'visibilite', recommendation: 'Rédiger une description claire de l’activité, des valeurs et de l’offre.' },
      { key: 'industry', label: 'Secteur d’activité', dimension: 'visibilite', recommendation: 'Renseigner précisément le secteur d’activité et les informations de l’entreprise.' },
      { key: 'contactInfo', label: 'Coordonnées / site web', dimension: 'acquisition', recommendation: 'Ajouter le site web et les coordonnées de contact sur la page.' },
      { key: 'frequency', label: 'Fréquence de publication', dimension: 'visibilite', recommendation: 'Publier plus régulièrement pour rester visible auprès du réseau professionnel.' },
      { key: 'contentQuality', label: 'Qualité du contenu', dimension: 'visibilite', recommendation: 'Publier des contenus à valeur ajoutée (expertise, coulisses, actualités).' },
      { key: 'team', label: 'Mise en avant de l’équipe', dimension: 'fidelisation', recommendation: 'Mettre en avant l’équipe pour humaniser la marque et renforcer la confiance.' },
      { key: 'cta', label: 'CTA', dimension: 'acquisition', recommendation: 'Ajouter des appels à l’action clairs dans les publications.' },
      { key: 'engagement', label: 'Engagement', dimension: 'fidelisation', recommendation: 'Interagir avec les commentaires et développer le réseau professionnel.' }
    ]
  }
};

function createDefaultAuditConfig() {
  return {
    activityType: 'restaurant',
    platforms: {
      googleBusiness: true,
      website: true,
      instagram: true,
      facebook: true,
      tiktok: false,
      linkedin: false
    },
    dashboardClientId: ''
  };
}

function getAuditConfig() {
  const saved = localStorage.getItem(AUDIT_CONFIG_KEY);

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.activityType && parsed.platforms) {
        return parsed;
      }
    } catch (error) {
      // fall through to default
    }
  }

  const defaultConfig = createDefaultAuditConfig();
  localStorage.setItem(AUDIT_CONFIG_KEY, JSON.stringify(defaultConfig));
  return defaultConfig;
}

function saveAuditConfig(config) {
  localStorage.setItem(AUDIT_CONFIG_KEY, JSON.stringify(config));
}

// --- Connexion au Profil Stratégique Client du Dashboard (script.js, chargé sur cette même
// page) : lecture seule, ne modifie jamais script.js. Audit Pro n'a pas de champ "nom du
// client" persistant (il sert aussi à auditer des prospects hors Dashboard), donc le
// rattachement se fait ici manuellement plutôt que par auto-match sur un nom.
function getAuditDashboardClientOptions() {
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

function renderAuditStrategicProfileList(strategicProfile) {
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
    item.innerHTML = `<span class="insight-icon">🧠</span><span class="insight-text">${escapeAuditText(text)}</span>`;
    list.appendChild(item);
  });
  return list;
}

function renderAuditDashboardSection() {
  const section = document.getElementById('auditDashboardSection');
  if (!section) {
    return;
  }

  const config = getAuditConfig();
  const options = getAuditDashboardClientOptions();

  section.innerHTML = `
    <p class="eyebrow">Connexion Dashboard (optionnel)</p>
    <h3>🧠 Profil Stratégique Client</h3>
    <p>Si cet audit concerne un client déjà présent dans le Dashboard, reliez-le ici pour afficher automatiquement son profil stratégique (positionnement, produits à mettre en avant ou à éviter, contraintes, réseaux...).</p>
  `;

  if (!options.length) {
    section.appendChild(renderAuditStrategicProfileList(null));
    return;
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
  noneOption.textContent = '— Aucun (prospect hors Dashboard) —';
  select.appendChild(noneOption);
  options.forEach((option) => {
    const optionEl = document.createElement('option');
    optionEl.value = option.id;
    optionEl.textContent = option.name;
    select.appendChild(optionEl);
  });
  select.value = config.dashboardClientId || '';
  select.addEventListener('change', () => {
    const freshConfig = getAuditConfig();
    freshConfig.dashboardClientId = select.value;
    saveAuditConfig(freshConfig);
    renderAuditDashboardSection();
  });
  linkRow.appendChild(select);
  section.appendChild(linkRow);

  const clientId = config.dashboardClientId || '';
  if (!clientId) {
    const empty = document.createElement('p');
    empty.className = 'insight-empty';
    empty.textContent = 'Aucun client sélectionné : cet audit est traité comme un prospect indépendant.';
    section.appendChild(empty);
    return;
  }

  const clientData = getClientData(clientId);
  section.appendChild(renderAuditStrategicProfileList(clientData.strategicProfile));
}

function getAuditRatings() {
  const saved = localStorage.getItem(AUDIT_RATINGS_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    } catch (error) {
      // fall through to empty
    }
  }
  return {};
}

function saveAuditRatings(ratings) {
  localStorage.setItem(AUDIT_RATINGS_KEY, JSON.stringify(ratings));
}

function getPlatformRatings(platformKey) {
  const ratings = getAuditRatings();
  const definition = platformAuditDefinitions[platformKey];
  if (!ratings[platformKey]) {
    ratings[platformKey] = {};
  }
  definition.criteria.forEach((criterion) => {
    if (ratings[platformKey][criterion.key] === undefined) {
      ratings[platformKey][criterion.key] = 50;
    }
  });
  saveAuditRatings(ratings);
  return ratings[platformKey];
}

function setCriterionRating(platformKey, criterionKey, value) {
  const ratings = getAuditRatings();
  if (!ratings[platformKey]) {
    ratings[platformKey] = {};
  }
  ratings[platformKey][criterionKey] = value;
  saveAuditRatings(ratings);
}

function computePlatformScore(platformKey) {
  const definition = platformAuditDefinitions[platformKey];
  const ratings = getPlatformRatings(platformKey);
  const values = definition.criteria.map((criterion) => ratings[criterion.key] ?? 50);
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function getPlatformRecommendations(platformKey) {
  const definition = platformAuditDefinitions[platformKey];
  const ratings = getPlatformRatings(platformKey);
  return definition.criteria
    .filter((criterion) => (ratings[criterion.key] ?? 50) < 75)
    .sort((a, b) => (ratings[a.key] ?? 50) - (ratings[b.key] ?? 50))
    .map((criterion) => criterion.recommendation);
}

function escapeAuditText(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]
  ));
}

function getScoreLevel(score) {
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

function computeGlobalScore(platformKeys) {
  if (!platformKeys.length) {
    return null;
  }
  const total = platformKeys.reduce((sum, key) => sum + computePlatformScore(key), 0);
  return total / platformKeys.length;
}

const dimensionLabels = {
  visibilite: 'visibilité',
  acquisition: 'acquisition',
  fidelisation: 'fidélisation'
};

const dimensionLabelsWithArticle = {
  visibilite: 'de visibilité',
  acquisition: 'd’acquisition',
  fidelisation: 'de fidélisation'
};

const activityBasketValues = {
  restaurant: 28,
  commerce: 45,
  'sante-medical': 60,
  sport: 40,
  services: 80,
  autre: 50
};

function getCheckedPlatformKeys(config) {
  return platformOptions.filter((platform) => config.platforms[platform.key]).map((platform) => platform.key);
}

function getDimensionCriteriaRatings(dimension, platformKeys) {
  const items = [];
  platformKeys.forEach((platformKey) => {
    const definition = platformAuditDefinitions[platformKey];
    const ratings = getPlatformRatings(platformKey);
    definition.criteria.forEach((criterion) => {
      if (criterion.dimension === dimension) {
        items.push({
          platformTitle: definition.title,
          criterionLabel: criterion.label,
          value: ratings[criterion.key] ?? 50
        });
      }
    });
  });
  return items;
}

function computeDimensionScore(dimension, platformKeys) {
  const items = getDimensionCriteriaRatings(dimension, platformKeys);
  if (!items.length) {
    return null;
  }
  return items.reduce((sum, item) => sum + item.value, 0) / items.length;
}

function getPotentialLevel(potentialScore) {
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

function buildPotentialComment(dimension, potentialScore, level, platformKeys) {
  const labelWithArticle = dimensionLabelsWithArticle[dimension];
  const items = getDimensionCriteriaRatings(dimension, platformKeys)
    .filter((item) => item.value < 75)
    .sort((a, b) => a.value - b.value)
    .slice(0, 2)
    .map((item) => `${item.criterionLabel} (${item.platformTitle})`);

  if (!items.length) {
    return `Le potentiel ${labelWithArticle} est ${level.label.toLowerCase()} (${Math.round(potentialScore)}/100) : les critères analysés sont déjà bien maîtrisés sur les plateformes sélectionnées, la marge de progression restante est donc limitée.`;
  }

  const listText = items.join(' et ');
  return `Le potentiel ${labelWithArticle} est ${level.label.toLowerCase()} (${Math.round(potentialScore)}/100) : des points comme ${listText} sont encore peu optimisés sur les plateformes sélectionnées, ce qui représente une marge de progression réelle.`;
}

function buildCommercialPotentialComment(potentialScore, level, subPotentials) {
  const best = subPotentials.reduce((max, item) => (item.score > max.score ? item : max), subPotentials[0]);
  return `Le potentiel commercial global est ${level.label.toLowerCase()} (${Math.round(potentialScore)}/100), porté notamment par la marge de progression identifiée en ${dimensionLabels[best.dimension]}. Plus le score actuel des plateformes sélectionnées est faible, plus la marge de progression estimée est importante.`;
}

function computeCommercialEstimates(potentialScore, platformCount, activityType) {
  const factor = Math.max(0, Math.min(100, potentialScore)) / 100;
  const basket = activityBasketValues[activityType] ?? activityBasketValues.autre;

  const newClientsLow = Math.max(1, Math.round(factor * platformCount * 2));
  const newClientsHigh = Math.max(newClientsLow + 1, Math.round(factor * platformCount * 5));

  const visibilityGain = Math.round(factor * 80);

  const revenueLow = newClientsLow * basket;
  const revenueHigh = newClientsHigh * basket;

  return {
    newClientsLow,
    newClientsHigh,
    visibilityGain,
    revenueLow,
    revenueHigh,
    basket
  };
}

function refreshGlobalScoreGauge() {
  const gaugeEl = document.querySelector('[data-role="global-gauge"]');
  if (!gaugeEl) {
    return;
  }

  const config = getAuditConfig();
  const checkedKeys = platformOptions.filter((platform) => config.platforms[platform.key]).map((platform) => platform.key);
  const score = computeGlobalScore(checkedKeys);

  if (score === null) {
    gaugeEl.innerHTML = '<p class="insight-empty">Cochez au moins une plateforme pour calculer le score global.</p>';
    return;
  }

  const level = getScoreLevel(score);
  gaugeEl.innerHTML = `
    ${createGaugeMarkup(score)}
    <span class="gauge-status-badge tone-${level.tone}">${level.label}</span>
  `;
}

function renderGlobalScoreSection(platformKeys) {
  const card = document.createElement('section');
  card.className = 'card audit-platform-card audit-global-score-card';

  const platformNames = platformKeys.map((key) => platformAuditDefinitions[key].title).join(', ');

  card.innerHTML = `
    <div class="audit-platform-header">
      <div>
        <p class="eyebrow">Vue d’ensemble</p>
        <h3>🎯 Score global</h3>
        <p>Calculé uniquement sur les plateformes sélectionnées : ${escapeAuditText(platformNames)}. Les plateformes non cochées n’ont aucun impact sur ce score.</p>
      </div>
      <div class="score-gauge" data-role="global-gauge"></div>
    </div>
  `;

  return card;
}

function createGaugeMarkup(score) {
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

function flashConfigSavedHint() {
  const hint = document.getElementById('configSavedHint');
  if (!hint) {
    return;
  }
  hint.textContent = 'Configuration enregistrée ✓';
  clearTimeout(flashConfigSavedHint.timeoutId);
  flashConfigSavedHint.timeoutId = setTimeout(() => {
    hint.textContent = 'Configuration enregistrée automatiquement.';
  }, 1600);
}

function renderActivityTypeGrid() {
  const grid = document.getElementById('activityTypeGrid');
  if (!grid) {
    return;
  }

  const config = getAuditConfig();
  grid.innerHTML = '';

  activityTypes.forEach((type) => {
    const option = document.createElement('button');
    option.type = 'button';
    option.className = `activity-type-option${config.activityType === type.key ? ' selected' : ''}`;
    option.innerHTML = `
      <span class="activity-icon">${type.icon}</span>
      <span>${type.label}</span>
    `;
    option.addEventListener('click', () => {
      const freshConfig = getAuditConfig();
      if (freshConfig.activityType === type.key) {
        return;
      }
      freshConfig.activityType = type.key;
      saveAuditConfig(freshConfig);
      renderActivityTypeGrid();
      flashConfigSavedHint();
    });
    grid.appendChild(option);
  });
}

function renderPlatformChecklist() {
  const list = document.getElementById('platformChecklist');
  if (!list) {
    return;
  }

  const config = getAuditConfig();
  list.innerHTML = '';

  platformOptions.forEach((platform) => {
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
      const freshConfig = getAuditConfig();
      freshConfig.platforms[platform.key] = checkbox.checked;
      saveAuditConfig(freshConfig);
      label.classList.toggle('checked', checkbox.checked);
      flashConfigSavedHint();
      renderPlatformAudits();
    });

    list.appendChild(label);
  });
}

function refreshPlatformAuditSection(platformKey, section) {
  const definition = platformAuditDefinitions[platformKey];
  const ratings = getPlatformRatings(platformKey);
  const score = computePlatformScore(platformKey);
  const status = getScoreLevel(score);

  section.querySelectorAll('[data-role="criteria-grid"] select').forEach((select, index) => {
    const criterion = definition.criteria[index];
    select.value = String(ratings[criterion.key]);
  });

  const gaugeEl = section.querySelector('[data-role="gauge"]');
  gaugeEl.innerHTML = `
    ${createGaugeMarkup(score)}
    <span class="gauge-status-badge tone-${status.tone}">${status.label}</span>
  `;

  const recoContainer = section.querySelector('[data-role="recommendations"]');
  const recommendations = getPlatformRecommendations(platformKey);
  recoContainer.innerHTML = '';

  if (!recommendations.length) {
    const empty = document.createElement('p');
    empty.className = 'insight-empty';
    empty.textContent = 'Aucune recommandation : tous les critères sont bien maîtrisés.';
    recoContainer.appendChild(empty);
    return;
  }

  recommendations.forEach((text) => {
    const item = document.createElement('div');
    item.className = 'insight-item tone-neutral';
    item.innerHTML = `<span class="insight-icon">💡</span><span class="insight-text">${escapeAuditText(text)}</span>`;
    recoContainer.appendChild(item);
  });
}

function renderPlatformAuditSection(platformKey) {
  const definition = platformAuditDefinitions[platformKey];
  const section = document.createElement('section');
  section.className = 'card audit-platform-card';
  section.dataset.platform = platformKey;

  section.innerHTML = `
    <div class="audit-platform-header">
      <div>
        <p class="eyebrow">Audit plateforme</p>
        <h3>${definition.icon} Audit ${escapeAuditText(definition.title)}</h3>
      </div>
      <div class="score-gauge" data-role="gauge"></div>
    </div>
    <div class="field-grid audit-criteria-grid" data-role="criteria-grid"></div>
    <div class="analysis-subsection">
      <h4>Recommandations</h4>
      <div class="insight-list" data-role="recommendations"></div>
    </div>
  `;

  const criteriaGrid = section.querySelector('[data-role="criteria-grid"]');
  definition.criteria.forEach((criterion) => {
    const wrapper = document.createElement('label');
    wrapper.className = 'field-item';

    const labelSpan = document.createElement('span');
    labelSpan.textContent = criterion.label;
    wrapper.appendChild(labelSpan);

    const select = document.createElement('select');
    select.className = 'field-input';
    ratingLevels.forEach((level) => {
      const option = document.createElement('option');
      option.value = level.value;
      option.textContent = level.label;
      select.appendChild(option);
    });
    select.addEventListener('change', () => {
      setCriterionRating(platformKey, criterion.key, Number(select.value));
      refreshPlatformAuditSection(platformKey, section);
      refreshGlobalScoreGauge();
      refreshCommercialPotentialSection();
      refreshPrioritySection();
      refreshRoadmapSection();
      refreshAuditSummarySection();
    });
    wrapper.appendChild(select);

    criteriaGrid.appendChild(wrapper);
  });

  refreshPlatformAuditSection(platformKey, section);
  return section;
}

function createPotentialCard(dimension, potentialScore, platformKeys) {
  const level = getPotentialLevel(potentialScore);
  const comment = buildPotentialComment(dimension, potentialScore, level, platformKeys);
  const labelWithArticle = dimensionLabelsWithArticle[dimension];

  const card = document.createElement('div');
  card.className = 'card potential-card';
  card.innerHTML = `
    <div class="potential-card-header">
      <p class="eyebrow">Potentiel ${escapeAuditText(labelWithArticle)}</p>
      <span class="gauge-status-badge tone-${level.tone}">${level.label}</span>
    </div>
    <strong>${Math.round(potentialScore)}/100</strong>
    <p>${escapeAuditText(comment)}</p>
  `;
  return card;
}

function createCommercialPotentialCard(potentialScore, subPotentials) {
  const level = getPotentialLevel(potentialScore);
  const comment = buildCommercialPotentialComment(potentialScore, level, subPotentials);

  const card = document.createElement('div');
  card.className = 'card potential-card potential-card-commercial';
  card.innerHTML = `
    <div class="potential-card-header">
      <p class="eyebrow">Potentiel commercial global</p>
      <span class="gauge-status-badge tone-${level.tone}">${level.label}</span>
    </div>
    <strong>${Math.round(potentialScore)}/100</strong>
    <p>${escapeAuditText(comment)}</p>
  `;
  return card;
}

function createGainCard(icon, label, valueText) {
  const card = document.createElement('div');
  card.className = 'card kpi-card summary-card';
  card.innerHTML = `
    <span class="badge">${icon}</span>
    <p>${escapeAuditText(label)}</p>
    <strong>${escapeAuditText(valueText)}</strong>
  `;
  return card;
}

function computeCommercialPotentialData(platformKeys, activityType) {
  const dimensions = ['visibilite', 'acquisition', 'fidelisation'];
  const dimensionScores = dimensions.map((dimension) => {
    const score = computeDimensionScore(dimension, platformKeys);
    return { dimension, score: score === null ? 0 : 100 - score };
  });

  const commercialPotential = dimensionScores.length
    ? dimensionScores.reduce((sum, item) => sum + item.score, 0) / dimensionScores.length
    : 0;

  const estimates = computeCommercialEstimates(commercialPotential, platformKeys.length, activityType);

  return { dimensionScores, commercialPotential, estimates };
}

function populateCommercialPotentialSection(section, platformKeys, activityType) {
  const { dimensionScores, commercialPotential, estimates } = computeCommercialPotentialData(platformKeys, activityType);

  const potentialGrid = section.querySelector('[data-role="potential-grid"]');
  potentialGrid.innerHTML = '';
  dimensionScores.forEach(({ dimension, score }) => {
    potentialGrid.appendChild(createPotentialCard(dimension, score, platformKeys));
  });
  potentialGrid.appendChild(createCommercialPotentialCard(commercialPotential, dimensionScores));

  const gainGrid = section.querySelector('[data-role="gain-grid"]');
  gainGrid.innerHTML = '';
  gainGrid.appendChild(createGainCard('👥', 'Nouveaux clients potentiels / mois', `${estimates.newClientsLow} à ${estimates.newClientsHigh}`));
  gainGrid.appendChild(createGainCard('👁', 'Visibilité supplémentaire estimée', `+${estimates.visibilityGain} %`));
  gainGrid.appendChild(createGainCard('💶', 'Chiffre d’affaires potentiel / mois', `${estimates.revenueLow} € à ${estimates.revenueHigh} €`));
}

function renderCommercialPotentialSection(platformKeys, activityType) {
  const section = document.createElement('section');
  section.className = 'card audit-platform-card audit-potential-section';
  section.dataset.role = 'potential-section';
  section.innerHTML = `
    <p class="eyebrow">Potentiel commercial</p>
    <h3>📈 Potentiel commercial estimé</h3>
    <p>Ces potentiels sont estimés à partir des scores obtenus sur les plateformes sélectionnées : plus le score actuel est faible sur une dimension, plus la marge de progression estimée est importante.</p>
    <div class="potential-grid" data-role="potential-grid"></div>
    <div class="analysis-subsection">
      <h4>Estimation des gains potentiels</h4>
      <p class="notes-hint">Ces chiffres sont des estimations indicatives basées sur le potentiel calculé, elles ne constituent pas une prévision garantie.</p>
      <div class="kpi-grid summary-grid" data-role="gain-grid"></div>
    </div>
  `;

  populateCommercialPotentialSection(section, platformKeys, activityType);
  return section;
}

function refreshCommercialPotentialSection() {
  const section = document.querySelector('[data-role="potential-section"]');
  if (!section) {
    return;
  }
  const config = getAuditConfig();
  const platformKeys = getCheckedPlatformKeys(config);
  if (!platformKeys.length) {
    return;
  }
  populateCommercialPotentialSection(section, platformKeys, config.activityType);
}

function getAllCheckedCriteriaRatings(platformKeys) {
  const items = [];
  platformKeys.forEach((platformKey) => {
    const definition = platformAuditDefinitions[platformKey];
    const ratings = getPlatformRatings(platformKey);
    definition.criteria.forEach((criterion) => {
      items.push({
        platformKey,
        platformTitle: definition.title,
        platformIcon: definition.icon,
        criterionKey: criterion.key,
        criterionLabel: criterion.label,
        dimension: criterion.dimension,
        recommendation: criterion.recommendation,
        rating: ratings[criterion.key] ?? 50
      });
    });
  });
  return items;
}

function getRatingLabel(value) {
  const level = ratingLevels.find((item) => item.value === value);
  return level ? level.label : 'Moyen';
}

function getPriorityActions(platformKeys) {
  return getAllCheckedCriteriaRatings(platformKeys)
    .filter((item) => item.rating < 75)
    .sort((a, b) => a.rating - b.rating)
    .slice(0, 3);
}

function buildPriorityExplanation(rank, item) {
  const dimensionLabelWithArticle = dimensionLabelsWithArticle[item.dimension] || 'de performance globale';
  const rankTexts = {
    1: `Il s’agit du point le plus fragile de tout l’audit (${item.rating}/100 sur ${item.platformTitle}) : agir ici en premier aura l’impact le plus fort sur le potentiel ${dimensionLabelWithArticle}.`,
    2: `Second point le plus fragile identifié (${item.rating}/100 sur ${item.platformTitle}) : à traiter juste après la priorité n°1 pour renforcer le potentiel ${dimensionLabelWithArticle}.`,
    3: `Troisième point le plus fragile identifié (${item.rating}/100 sur ${item.platformTitle}) : une action complémentaire pour continuer à faire progresser le potentiel ${dimensionLabelWithArticle}.`
  };
  return rankTexts[rank] || rankTexts[3];
}

function createPriorityCard(rank, item) {
  const card = document.createElement('div');
  card.className = 'card priority-card';
  const levelLabel = getRatingLabel(item.rating);
  card.innerHTML = `
    <div class="priority-card-header">
      <span class="priority-rank">Priorité ${rank}</span>
      <span class="gauge-status-badge tone-high">${escapeAuditText(levelLabel)} (${item.rating}/100)</span>
    </div>
    <h4>${item.platformIcon} ${escapeAuditText(item.platformTitle)} — ${escapeAuditText(item.criterionLabel)}</h4>
    <p class="priority-action"><strong>Action :</strong> ${escapeAuditText(item.recommendation)}</p>
    <p class="priority-explanation">${escapeAuditText(buildPriorityExplanation(rank, item))}</p>
  `;
  return card;
}

function createPriorityEmptyState() {
  const empty = document.createElement('p');
  empty.className = 'insight-empty';
  empty.textContent = 'Aucune priorité corrective : tous les critères analysés sont déjà bien maîtrisés (Bon ou Excellent).';
  return empty;
}

function populatePrioritySection(section, platformKeys) {
  const grid = section.querySelector('[data-role="priority-grid"]');
  grid.innerHTML = '';
  const priorities = getPriorityActions(platformKeys);

  if (!priorities.length) {
    grid.appendChild(createPriorityEmptyState());
    return;
  }

  priorities.forEach((item, index) => {
    grid.appendChild(createPriorityCard(index + 1, item));
  });
}

function renderPrioritySection(platformKeys) {
  const section = document.createElement('section');
  section.className = 'card audit-platform-card audit-priority-section';
  section.dataset.role = 'priority-section';
  section.innerHTML = `
    <p class="eyebrow">Plan d’action</p>
    <h3>🚀 Priorités</h3>
    <p>Les points les plus fragiles identifiés sur les plateformes sélectionnées, classés par ordre d’impact.</p>
    <div class="priority-grid" data-role="priority-grid"></div>
  `;
  populatePrioritySection(section, platformKeys);
  return section;
}

function refreshPrioritySection() {
  const section = document.querySelector('[data-role="priority-section"]');
  if (!section) {
    return;
  }
  const config = getAuditConfig();
  const platformKeys = getCheckedPlatformKeys(config);
  if (!platformKeys.length) {
    return;
  }
  populatePrioritySection(section, platformKeys);
}

const roadmapPhaseConfig = [
  { days: '30', title: '30 jours', subtitle: 'Actions urgentes' },
  { days: '60', title: '60 jours', subtitle: 'Actions importantes' },
  { days: '90', title: '90 jours', subtitle: 'Optimisations' }
];

function buildRoadmapActionExplanation(item, phase) {
  const dimensionLabelWithArticle = dimensionLabelsWithArticle[item.dimension] || 'de performance globale';
  const levelLabel = getRatingLabel(item.rating);
  return `${item.recommendation} — Ce point est noté « ${levelLabel} » (${item.rating}/100) sur ${item.platformTitle} : il est classé dans les ${phase.days} premiers jours selon son niveau de priorité, pour renforcer le potentiel ${dimensionLabelWithArticle}.`;
}

function createRoadmapItem(item, phase) {
  const el = document.createElement('div');
  el.className = 'insight-item tone-neutral roadmap-item';
  el.innerHTML = `
    <span class="insight-icon">📌</span>
    <span class="insight-text">
      <strong>${item.platformIcon} ${escapeAuditText(item.platformTitle)} — ${escapeAuditText(item.criterionLabel)}</strong><br>
      ${escapeAuditText(buildRoadmapActionExplanation(item, phase))}
    </span>
  `;
  return el;
}

function createRoadmapEmptyState() {
  const empty = document.createElement('p');
  empty.className = 'insight-empty';
  empty.textContent = 'Aucune action nécessaire à cette échéance.';
  return empty;
}

function computeRoadmapBuckets(platformKeys) {
  const allItems = getAllCheckedCriteriaRatings(platformKeys)
    .filter((item) => item.rating < 75)
    .sort((a, b) => a.rating - b.rating);

  const chunkSize = Math.ceil(allItems.length / roadmapPhaseConfig.length);
  return roadmapPhaseConfig.map((phase, index) => ({
    phase,
    items: allItems.slice(index * chunkSize, (index + 1) * chunkSize)
  }));
}

function populateRoadmapSection(section, platformKeys) {
  const buckets = computeRoadmapBuckets(platformKeys);

  buckets.forEach(({ phase, items }) => {
    const columnList = section.querySelector(`[data-role="roadmap-list-${phase.days}"]`);
    columnList.innerHTML = '';

    if (!items.length) {
      columnList.appendChild(createRoadmapEmptyState());
      return;
    }

    items.forEach((item) => {
      columnList.appendChild(createRoadmapItem(item, phase));
    });
  });
}

function renderRoadmapSection(platformKeys) {
  const section = document.createElement('section');
  section.className = 'card audit-platform-card audit-roadmap-section';
  section.dataset.role = 'roadmap-section';
  section.innerHTML = `
    <p class="eyebrow">Plan d’action</p>
    <h3>🗺 Roadmap 30 / 60 / 90 jours</h3>
    <p>Les actions sont réparties automatiquement selon leur degré d’urgence, du plus critique au plus long terme.</p>
    <div class="roadmap-grid">
      ${roadmapPhaseConfig.map((phase) => `
        <div class="roadmap-column">
          <p class="eyebrow">${phase.title}</p>
          <h4>${escapeAuditText(phase.subtitle)}</h4>
          <div class="insight-list" data-role="roadmap-list-${phase.days}"></div>
        </div>
      `).join('')}
    </div>
  `;
  populateRoadmapSection(section, platformKeys);
  return section;
}

function refreshRoadmapSection() {
  const section = document.querySelector('[data-role="roadmap-section"]');
  if (!section) {
    return;
  }
  const config = getAuditConfig();
  const platformKeys = getCheckedPlatformKeys(config);
  if (!platformKeys.length) {
    return;
  }
  populateRoadmapSection(section, platformKeys);
}

function getStrengths(platformKeys, limit) {
  return getAllCheckedCriteriaRatings(platformKeys)
    .filter((item) => item.rating >= 75)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

function getWeaknesses(platformKeys, limit) {
  return getAllCheckedCriteriaRatings(platformKeys)
    .filter((item) => item.rating < 50)
    .sort((a, b) => a.rating - b.rating)
    .slice(0, limit);
}

const scoreLevelFeminine = {
  Excellent: 'excellente',
  Bon: 'bonne',
  Moyen: 'moyenne',
  Faible: 'faible'
};

function buildSummaryIntro(platformKeys) {
  const score = computeGlobalScore(platformKeys);
  if (score === null) {
    return '';
  }
  const level = getScoreLevel(score);
  const levelFeminine = scoreLevelFeminine[level.label] || level.label.toLowerCase();
  const platformNames = platformKeys.map((key) => platformAuditDefinitions[key].title).join(', ');
  return `Sur la base des plateformes analysées (${platformNames}), la performance globale de l’entreprise est jugée ${levelFeminine} (${Math.round(score)}/100).`;
}

function buildStrengthsSummary(platformKeys) {
  const strengths = getStrengths(platformKeys, 4);
  if (!strengths.length) {
    return {
      text: 'Aucun point fort majeur ne se dégage encore : la majorité des critères analysés nécessite des améliorations.',
      items: []
    };
  }
  const text = strengths.length > 1
    ? 'Plusieurs éléments sont déjà bien maîtrisés et constituent une bonne base :'
    : 'Un élément est déjà bien maîtrisé et constitue une bonne base :';
  return {
    text,
    items: strengths.map((item) => `${item.platformTitle} — ${item.criterionLabel} (${item.rating}/100)`)
  };
}

function buildWeaknessesSummary(platformKeys) {
  const weaknesses = getWeaknesses(platformKeys, 4);
  if (!weaknesses.length) {
    return {
      text: 'Aucun point faible majeur n’a été détecté : l’ensemble des critères analysés est au moins correct.',
      items: []
    };
  }
  const text = weaknesses.length > 1
    ? 'Plusieurs éléments freinent actuellement la performance globale :'
    : 'Un élément freine actuellement la performance globale :';
  return {
    text,
    items: weaknesses.map((item) => `${item.platformTitle} — ${item.criterionLabel} (${item.rating}/100)`)
  };
}

function buildOpportunitiesSummary(platformKeys, activityType) {
  const { dimensionScores, estimates } = computeCommercialPotentialData(platformKeys, activityType);
  const validDimensions = dimensionScores.filter((item) => item.score > 0);

  if (!validDimensions.length) {
    return 'Aucune opportunité de croissance majeure n’a été identifiée : les indicateurs analysés sont déjà proches de l’optimum.';
  }

  const top = validDimensions.reduce((max, item) => (item.score > max.score ? item : max), validDimensions[0]);
  const level = getPotentialLevel(top.score);
  const labelWithArticle = dimensionLabelsWithArticle[top.dimension];

  return `Le principal levier de croissance se situe au niveau du potentiel ${labelWithArticle}, actuellement ${level.label.toLowerCase()} (${Math.round(top.score)}/100). En travaillant les points identifiés dans l’audit, l’entreprise peut espérer entre ${estimates.newClientsLow} et ${estimates.newClientsHigh} nouveaux clients potentiels par mois, pour un chiffre d’affaires supplémentaire estimé entre ${estimates.revenueLow} € et ${estimates.revenueHigh} € par mois (estimation indicative).`;
}

function buildRecommendationsSummary(platformKeys) {
  const priorities = getPriorityActions(platformKeys);
  if (!priorities.length) {
    return {
      text: 'Aucune recommandation prioritaire : l’ensemble des critères analysés est déjà bien maîtrisé.',
      items: []
    };
  }
  return {
    text: 'Les actions suivantes sont recommandées en priorité pour améliorer la performance globale :',
    items: priorities.map((item) => `${item.recommendation} (${item.platformTitle})`)
  };
}

function fillSummaryBlock(section, role, summary) {
  const block = section.querySelector(`[data-role="${role}"]`);
  block.querySelector('[data-role="text"]').textContent = summary.text;
  const list = block.querySelector('[data-role="list"]');
  list.innerHTML = '';
  summary.items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    list.appendChild(li);
  });
  list.style.display = summary.items.length ? '' : 'none';
}

function populateAuditSummarySection(section, platformKeys, activityType) {
  section.querySelector('[data-role="summary-intro"]').textContent = buildSummaryIntro(platformKeys);
  fillSummaryBlock(section, 'summary-strengths', buildStrengthsSummary(platformKeys));
  fillSummaryBlock(section, 'summary-weaknesses', buildWeaknessesSummary(platformKeys));
  section.querySelector('[data-role="summary-opportunities"] [data-role="text"]').textContent =
    buildOpportunitiesSummary(platformKeys, activityType);
  fillSummaryBlock(section, 'summary-recommendations', buildRecommendationsSummary(platformKeys));
}

function renderAuditSummarySection(platformKeys, activityType) {
  const section = document.createElement('section');
  section.className = 'card audit-platform-card audit-summary-section';
  section.dataset.role = 'summary-section';
  section.innerHTML = `
    <p class="eyebrow">Synthèse</p>
    <h3>📝 Résumé de l’audit</h3>
    <p data-role="summary-intro"></p>

    <div class="analysis-subsection" data-role="summary-strengths">
      <h4>✅ Points forts</h4>
      <p data-role="text"></p>
      <ul class="analysis-list" data-role="list"></ul>
    </div>

    <div class="analysis-subsection" data-role="summary-weaknesses">
      <h4>⚠️ Points faibles</h4>
      <p data-role="text"></p>
      <ul class="analysis-list" data-role="list"></ul>
    </div>

    <div class="analysis-subsection" data-role="summary-opportunities">
      <h4>📈 Opportunités</h4>
      <p data-role="text"></p>
    </div>

    <div class="analysis-subsection" data-role="summary-recommendations">
      <h4>🎯 Recommandations principales</h4>
      <p data-role="text"></p>
      <ul class="analysis-list" data-role="list"></ul>
    </div>
  `;
  populateAuditSummarySection(section, platformKeys, activityType);
  return section;
}

function refreshAuditSummarySection() {
  const section = document.querySelector('[data-role="summary-section"]');
  if (!section) {
    return;
  }
  const config = getAuditConfig();
  const platformKeys = getCheckedPlatformKeys(config);
  if (!platformKeys.length) {
    return;
  }
  populateAuditSummarySection(section, platformKeys, config.activityType);
}

function createNoPlatformsState() {
  const card = document.createElement('div');
  card.className = 'card audit-config-card';
  card.innerHTML = `
    <p class="eyebrow">Étape 2</p>
    <h3>Audits par plateforme</h3>
    <p>Cochez au moins une plateforme dans la configuration ci-dessus pour générer automatiquement les audits correspondants.</p>
  `;
  return card;
}

function renderPlatformAudits() {
  const container = document.getElementById('platformAuditSections');
  if (!container) {
    return;
  }

  const config = getAuditConfig();
  container.innerHTML = '';

  const checkedPlatforms = platformOptions.filter((platform) => config.platforms[platform.key]);

  if (!checkedPlatforms.length) {
    container.appendChild(createNoPlatformsState());
    return;
  }

  const checkedKeys = checkedPlatforms.map((platform) => platform.key);

  container.appendChild(renderGlobalScoreSection(checkedKeys));
  refreshGlobalScoreGauge();

  container.appendChild(renderCommercialPotentialSection(checkedKeys, config.activityType));
  container.appendChild(renderPrioritySection(checkedKeys));
  container.appendChild(renderRoadmapSection(checkedKeys));
  container.appendChild(renderAuditSummarySection(checkedKeys, config.activityType));

  checkedPlatforms.forEach((platform) => {
    container.appendChild(renderPlatformAuditSection(platform.key));
  });
}

const AUDIT_PDF_COLORS = {
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

const AUDIT_CONSULTANT_NAME_KEY = 'anavibe-tools-consultant-name';

function getAuditScoreColorRgb(score) {
  if (score >= 70) {
    return AUDIT_PDF_COLORS.positive;
  }
  if (score >= 40) {
    return AUDIT_PDF_COLORS.mediumTone;
  }
  return AUDIT_PDF_COLORS.negative;
}

function getAuditPotentialColorRgb(tone) {
  if (tone === 'opportunity') {
    return AUDIT_PDF_COLORS.opportunity;
  }
  if (tone === 'medium') {
    return AUDIT_PDF_COLORS.mediumTone;
  }
  return AUDIT_PDF_COLORS.positive;
}

function formatAuditPdfDate(date) {
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function promptAuditConsultantName() {
  const saved = localStorage.getItem(AUDIT_CONSULTANT_NAME_KEY) || '';
  const input = window.prompt('Nom du consultant AnaVibe (affiché sur le rapport) :', saved);
  if (input === null) {
    return saved || 'Équipe AnaVibe';
  }
  const trimmed = input.trim();
  const finalName = trimmed || 'Équipe AnaVibe';
  localStorage.setItem(AUDIT_CONSULTANT_NAME_KEY, finalName);
  return finalName;
}

function promptAuditProspectName() {
  const input = window.prompt('Nom de l’entreprise ou du prospect audité (affiché sur le rapport) :', '');
  if (input === null) {
    return 'Prospect';
  }
  const trimmed = input.trim();
  return trimmed || 'Prospect';
}

function slugifyAuditFilename(text) {
  const slug = String(text || 'audit')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '');
  return slug || 'audit';
}

function createAuditPdfState(doc) {
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

function ensureAuditPdfSpace(state, needed) {
  const maxY = state.pageHeight - state.marginBottom;
  if (state.cursorY + needed > maxY) {
    state.doc.addPage();
    state.cursorY = state.marginTop;
  }
}

function addAuditPdfSectionTitle(state, text) {
  ensureAuditPdfSpace(state, 16);
  state.doc.setFont('helvetica', 'bold');
  state.doc.setFontSize(15);
  state.doc.setTextColor(...AUDIT_PDF_COLORS.primary);
  state.doc.text(text, state.marginLeft, state.cursorY);
  state.cursorY += 3;
  state.doc.setDrawColor(...AUDIT_PDF_COLORS.primary);
  state.doc.setLineWidth(0.6);
  state.doc.line(state.marginLeft, state.cursorY, state.pageWidth - state.marginRight, state.cursorY);
  state.cursorY += 8;
}

function addAuditPdfSubTitle(state, text) {
  ensureAuditPdfSpace(state, 10);
  state.doc.setFont('helvetica', 'bold');
  state.doc.setFontSize(11.5);
  state.doc.setTextColor(...AUDIT_PDF_COLORS.primaryDark);
  state.doc.text(text, state.marginLeft, state.cursorY);
  state.cursorY += 6;
}

function addAuditPdfParagraph(state, text) {
  state.doc.setFont('helvetica', 'normal');
  state.doc.setFontSize(10);
  state.doc.setTextColor(...AUDIT_PDF_COLORS.text);
  const usableWidth = state.pageWidth - state.marginLeft - state.marginRight;
  const lines = state.doc.splitTextToSize(text, usableWidth);
  lines.forEach((line) => {
    ensureAuditPdfSpace(state, 6);
    state.doc.text(line, state.marginLeft, state.cursorY);
    state.cursorY += 5.6;
  });
  state.cursorY += 3;
}

function addAuditPdfBulletList(state, items) {
  state.doc.setFont('helvetica', 'normal');
  state.doc.setFontSize(10);
  const usableWidth = state.pageWidth - state.marginLeft - state.marginRight - 6;
  items.forEach((item) => {
    const lines = state.doc.splitTextToSize(item, usableWidth);
    ensureAuditPdfSpace(state, 5.6 * lines.length);
    state.doc.setTextColor(...AUDIT_PDF_COLORS.primary);
    state.doc.text('-', state.marginLeft, state.cursorY);
    state.doc.setTextColor(...AUDIT_PDF_COLORS.text);
    lines.forEach((line) => {
      state.doc.text(line, state.marginLeft + 5, state.cursorY);
      state.cursorY += 5.6;
    });
  });
  state.cursorY += 3;
}

function addAuditPdfTable(state, columns, rows) {
  const totalWidth = columns.reduce((sum, col) => sum + col.width, 0);
  const rowHeight = 7;
  const headerHeight = 8;

  ensureAuditPdfSpace(state, headerHeight + rowHeight);

  state.doc.setFillColor(...AUDIT_PDF_COLORS.primary);
  state.doc.rect(state.marginLeft, state.cursorY, totalWidth, headerHeight, 'F');
  state.doc.setFont('helvetica', 'bold');
  state.doc.setFontSize(8);
  state.doc.setTextColor(...AUDIT_PDF_COLORS.white);
  let headerX = state.marginLeft;
  columns.forEach((col) => {
    state.doc.text(col.header, headerX + 2, state.cursorY + headerHeight - 2.6);
    headerX += col.width;
  });
  state.cursorY += headerHeight;

  state.doc.setFont('helvetica', 'normal');
  state.doc.setFontSize(9);

  rows.forEach((row, rowIndex) => {
    ensureAuditPdfSpace(state, rowHeight);
    if (rowIndex % 2 === 1) {
      state.doc.setFillColor(...AUDIT_PDF_COLORS.muted);
      state.doc.rect(state.marginLeft, state.cursorY, totalWidth, rowHeight, 'F');
    }
    let cellX = state.marginLeft;
    row.forEach((cell, colIndex) => {
      const col = columns[colIndex];
      const color = cell.color || AUDIT_PDF_COLORS.text;
      state.doc.setTextColor(...color);
      state.doc.text(String(cell.text ?? ''), cellX + 2, state.cursorY + rowHeight - 2.4);
      cellX += col.width;
    });
    state.cursorY += rowHeight;
  });

  state.cursorY += 6;
}

function addAuditPdfFootersAndPageNumbers(doc, subjectLabel) {
  const pageCount = doc.internal.getNumberOfPages();
  for (let pageNumber = 2; pageNumber <= pageCount; pageNumber += 1) {
    doc.setPage(pageNumber);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...AUDIT_PDF_COLORS.textSoft);
    doc.text(`AnaVibe Tools — Audit Pro préparé pour ${subjectLabel}`, 18, 291);
    doc.text(`Page ${pageNumber - 1} / ${pageCount - 1}`, 210 - 18, 291, { align: 'right' });
  }
}

function createAuditGaugeRingImage(value, colorRgb) {
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

function addAuditPdfGauge(state, x, yTop, diameterMm, value, colorRgb, label) {
  const dataUrl = createAuditGaugeRingImage(value, colorRgb);
  state.doc.addImage(dataUrl, 'PNG', x, yTop, diameterMm, diameterMm);

  const centerX = x + diameterMm / 2;
  const centerY = yTop + diameterMm / 2;

  state.doc.setFont('helvetica', 'bold');
  state.doc.setFontSize(diameterMm * 0.85);
  state.doc.setTextColor(...AUDIT_PDF_COLORS.text);
  state.doc.text(`${Math.round(value)}`, centerX, centerY + diameterMm * 0.06, { align: 'center' });

  state.doc.setFont('helvetica', 'normal');
  state.doc.setFontSize(Math.max(7, diameterMm * 0.2));
  state.doc.setTextColor(...AUDIT_PDF_COLORS.textSoft);
  state.doc.text('/ 100', centerX, centerY + diameterMm * 0.26, { align: 'center' });

  if (label) {
    state.doc.setFont('helvetica', 'bold');
    state.doc.setFontSize(9.5);
    state.doc.setTextColor(...AUDIT_PDF_COLORS.primaryDark);
    state.doc.text(label, centerX, yTop + diameterMm + 7, { align: 'center', maxWidth: diameterMm + 24 });
  }
}

function createAuditPlatformBarChartImage(items) {
  const width = 900;
  const rowHeight = 70;
  const paddingTop = 20;
  const paddingBottom = 20;
  const height = paddingTop + paddingBottom + rowHeight * items.length;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#fffdf8';
  ctx.fillRect(0, 0, width, height);

  const labelWidth = 210;
  const valueWidth = 120;
  const barMaxWidth = width - labelWidth - valueWidth;
  const barHeight = 32;

  items.forEach((item, index) => {
    const y = paddingTop + index * rowHeight + (rowHeight - barHeight) / 2;

    ctx.fillStyle = '#161616';
    ctx.font = 'bold 22px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.label, 0, y + barHeight / 2);

    ctx.fillStyle = 'rgba(61, 31, 38, 0.1)';
    ctx.fillRect(labelWidth, y, barMaxWidth, barHeight);

    const clamped = Math.max(0, Math.min(100, item.score));
    const filledWidth = (clamped / 100) * barMaxWidth;
    const color = getAuditScoreColorRgb(clamped);
    ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    ctx.fillRect(labelWidth, y, filledWidth, barHeight);

    ctx.fillStyle = '#161616';
    ctx.font = 'bold 22px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`${Math.round(item.score)}/100`, labelWidth + barMaxWidth + 14, y + barHeight / 2);
  });
  ctx.textBaseline = 'alphabetic';

  return { dataUrl: canvas.toDataURL('image/png'), width, height };
}

function drawAuditPdfCoverPage(doc, config, platformKeys, prospectName, consultantName) {
  const pageWidth = 210;
  const pageHeight = 297;

  doc.setFillColor(...AUDIT_PDF_COLORS.background);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setFillColor(...AUDIT_PDF_COLORS.primary);
  doc.rect(0, 0, pageWidth, 8, 'F');
  doc.rect(0, pageHeight - 8, pageWidth, 8, 'F');

  doc.setFillColor(...AUDIT_PDF_COLORS.primary);
  doc.circle(38, 46, 12, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...AUDIT_PDF_COLORS.white);
  doc.text('A', 38, 50.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...AUDIT_PDF_COLORS.textSoft);
  doc.text('PLATEFORME PREMIUM', 56, 42);
  doc.setFontSize(19);
  doc.setTextColor(...AUDIT_PDF_COLORS.text);
  doc.text('AnaVibe Tools', 56, 51);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(...AUDIT_PDF_COLORS.primary);
  doc.text('Audit Pro', 18, 130);
  doc.setTextColor(...AUDIT_PDF_COLORS.text);
  doc.setFontSize(22);
  doc.text(prospectName, 18, 144);

  const activityLabel = (activityTypes.find((type) => type.key === config.activityType) || {}).label || config.activityType;
  const platformNames = platformKeys.map((key) => platformAuditDefinitions[key].title).join(', ');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(...AUDIT_PDF_COLORS.textSoft);
  let infoY = 163;
  const infoLines = [
    `Type d’activité : ${activityLabel}`,
    `Plateformes analysées : ${platformNames}`,
    `Date de génération : ${formatAuditPdfDate(new Date())}`,
    `Consultant AnaVibe : ${consultantName}`
  ];
  infoLines.forEach((line) => {
    const wrapped = doc.splitTextToSize(line, pageWidth - 36);
    wrapped.forEach((wrappedLine) => {
      doc.text(wrappedLine, 18, infoY);
      infoY += 9;
    });
  });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(...AUDIT_PDF_COLORS.primary);
  doc.text('Document préparé par AnaVibe en vue d’une présentation commerciale.', 18, pageHeight - 20);
}

function generateAuditPdf() {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    window.alert('Le module de génération PDF n’a pas pu se charger. Rechargez la page et réessayez.');
    return;
  }

  const config = getAuditConfig();
  const platformKeys = getCheckedPlatformKeys(config);

  if (!platformKeys.length) {
    window.alert('Cochez au moins une plateforme avant de générer le rapport PDF.');
    return;
  }

  const prospectName = promptAuditProspectName();
  const consultantName = promptAuditConsultantName();

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  drawAuditPdfCoverPage(doc, config, platformKeys, prospectName, consultantName);

  doc.addPage();
  const state = createAuditPdfState(doc);

  const activityLabel = (activityTypes.find((type) => type.key === config.activityType) || {}).label || config.activityType;
  const platformNames = platformKeys.map((key) => platformAuditDefinitions[key].title).join(', ');
  const globalScore = computeGlobalScore(platformKeys);
  const globalLevel = getScoreLevel(globalScore);

  addAuditPdfSectionTitle(state, 'Informations de l’entreprise');
  addAuditPdfBulletList(state, [
    `Type d’activité : ${activityLabel}`,
    `Plateformes analysées : ${platformNames}`
  ]);

  addAuditPdfSectionTitle(state, 'Score global');
  addAuditPdfParagraph(state, `Calculé uniquement sur les plateformes sélectionnées : ${platformNames}. Les plateformes non cochées n’ont aucun impact sur ce score.`);
  ensureAuditPdfSpace(state, 60);
  addAuditPdfGauge(state, state.marginLeft, state.cursorY, 42, globalScore, getAuditScoreColorRgb(globalScore), globalLevel.label);
  state.cursorY += 58;

  addAuditPdfSectionTitle(state, 'Scores par plateforme');
  const platformScoreItems = platformKeys.map((key) => ({
    label: platformAuditDefinitions[key].title,
    score: computePlatformScore(key)
  }));
  const chart = createAuditPlatformBarChartImage(platformScoreItems);
  const chartWidthMm = state.pageWidth - state.marginLeft - state.marginRight;
  const chartHeightMm = (chart.height / chart.width) * chartWidthMm;
  ensureAuditPdfSpace(state, chartHeightMm + 6);
  state.doc.addImage(chart.dataUrl, 'PNG', state.marginLeft, state.cursorY, chartWidthMm, chartHeightMm);
  state.cursorY += chartHeightMm + 8;

  addAuditPdfTable(
    state,
    [
      { header: 'PLATEFORME', width: 90 },
      { header: 'SCORE', width: 42 },
      { header: 'NIVEAU', width: 42 }
    ],
    platformScoreItems.map((item) => {
      const level = getScoreLevel(item.score);
      return [
        { text: item.label },
        { text: `${Math.round(item.score)}/100` },
        { text: level.label, color: getAuditScoreColorRgb(item.score) }
      ];
    })
  );

  doc.addPage();
  state.cursorY = state.marginTop;
  addAuditPdfSectionTitle(state, 'Recommandations par plateforme');
  platformKeys.forEach((platformKey) => {
    const definition = platformAuditDefinitions[platformKey];
    const recommendations = getPlatformRecommendations(platformKey);
    addAuditPdfSubTitle(state, definition.title);
    if (!recommendations.length) {
      addAuditPdfParagraph(state, 'Aucune recommandation : tous les critères sont bien maîtrisés.');
    } else {
      addAuditPdfBulletList(state, recommendations);
    }
  });

  doc.addPage();
  state.cursorY = state.marginTop;
  addAuditPdfSectionTitle(state, 'Potentiel commercial');
  const { dimensionScores, commercialPotential, estimates } = computeCommercialPotentialData(platformKeys, config.activityType);
  addAuditPdfParagraph(state, 'Ces potentiels sont estimés à partir des scores obtenus sur les plateformes sélectionnées : plus le score actuel est faible sur une dimension, plus la marge de progression estimée est importante.');

  ensureAuditPdfSpace(state, 62);
  const gaugeDiameter = 34;
  const gaugeGap = (state.pageWidth - state.marginLeft - state.marginRight - gaugeDiameter * 4) / 3;
  const potentialLabels = { visibilite: 'Visibilité', acquisition: 'Acquisition', fidelisation: 'Fidélisation' };
  dimensionScores.forEach((item, index) => {
    const x = state.marginLeft + index * (gaugeDiameter + gaugeGap);
    const level = getPotentialLevel(item.score);
    addAuditPdfGauge(state, x, state.cursorY, gaugeDiameter, item.score, getAuditPotentialColorRgb(level.tone), potentialLabels[item.dimension]);
  });
  const commercialLevel = getPotentialLevel(commercialPotential);
  const lastX = state.marginLeft + 3 * (gaugeDiameter + gaugeGap);
  addAuditPdfGauge(state, lastX, state.cursorY, gaugeDiameter, commercialPotential, getAuditPotentialColorRgb(commercialLevel.tone), 'Commercial global');
  state.cursorY += gaugeDiameter + 16;

  addAuditPdfSubTitle(state, 'Estimation des gains potentiels');
  addAuditPdfParagraph(state, 'Ces chiffres sont des estimations indicatives basées sur le potentiel calculé, elles ne constituent pas une prévision garantie.');
  addAuditPdfBulletList(state, [
    `Nouveaux clients potentiels / mois : ${estimates.newClientsLow} à ${estimates.newClientsHigh}`,
    `Visibilité supplémentaire estimée : +${estimates.visibilityGain} %`,
    `Chiffre d’affaires potentiel / mois : ${estimates.revenueLow} € à ${estimates.revenueHigh} €`
  ]);

  doc.addPage();
  state.cursorY = state.marginTop;
  addAuditPdfSectionTitle(state, 'Priorités');
  const priorities = getPriorityActions(platformKeys);
  if (!priorities.length) {
    addAuditPdfParagraph(state, 'Aucune priorité corrective : tous les critères analysés sont déjà bien maîtrisés (Bon ou Excellent).');
  } else {
    priorities.forEach((item, index) => {
      addAuditPdfSubTitle(state, `Priorité ${index + 1} — ${item.platformTitle} : ${item.criterionLabel} (${item.rating}/100)`);
      addAuditPdfParagraph(state, `Action : ${item.recommendation}`);
      addAuditPdfParagraph(state, buildPriorityExplanation(index + 1, item));
    });
  }

  addAuditPdfSectionTitle(state, 'Roadmap 30 / 60 / 90 jours');
  const roadmapBuckets = computeRoadmapBuckets(platformKeys);
  const maxItemsPerPhase = 6;
  roadmapBuckets.forEach(({ phase, items }) => {
    addAuditPdfSubTitle(state, `${phase.title} — ${phase.subtitle}`);
    if (!items.length) {
      addAuditPdfParagraph(state, 'Aucune action nécessaire à cette échéance.');
      return;
    }
    const visibleItems = items.slice(0, maxItemsPerPhase);
    addAuditPdfBulletList(state, visibleItems.map((item) => `${item.platformTitle} — ${item.criterionLabel} : ${item.recommendation}`));
    if (items.length > maxItemsPerPhase) {
      addAuditPdfParagraph(state, `+ ${items.length - maxItemsPerPhase} autre(s) action(s) sur cette échéance.`);
    }
  });

  doc.addPage();
  state.cursorY = state.marginTop;
  addAuditPdfSectionTitle(state, 'Résumé de l’audit');
  addAuditPdfParagraph(state, buildSummaryIntro(platformKeys));

  const strengths = buildStrengthsSummary(platformKeys);
  addAuditPdfSubTitle(state, 'Points forts');
  addAuditPdfParagraph(state, strengths.text);
  if (strengths.items.length) {
    addAuditPdfBulletList(state, strengths.items);
  }

  const weaknesses = buildWeaknessesSummary(platformKeys);
  addAuditPdfSubTitle(state, 'Points faibles');
  addAuditPdfParagraph(state, weaknesses.text);
  if (weaknesses.items.length) {
    addAuditPdfBulletList(state, weaknesses.items);
  }

  addAuditPdfSubTitle(state, 'Opportunités');
  addAuditPdfParagraph(state, buildOpportunitiesSummary(platformKeys, config.activityType));

  const recommendations = buildRecommendationsSummary(platformKeys);
  addAuditPdfSubTitle(state, 'Recommandations principales');
  addAuditPdfParagraph(state, recommendations.text);
  if (recommendations.items.length) {
    addAuditPdfBulletList(state, recommendations.items);
  }

  addAuditPdfFootersAndPageNumbers(doc, prospectName);

  const dateStamp = new Date().toISOString().slice(0, 10);
  doc.save(`audit-pro-${slugifyAuditFilename(prospectName)}-${dateStamp}.pdf`);
}

document.addEventListener('DOMContentLoaded', () => {
  renderActivityTypeGrid();
  renderPlatformChecklist();
  renderAuditDashboardSection();
  renderPlatformAudits();

  const pdfButton = document.getElementById('downloadAuditPdfBtn');
  if (pdfButton) {
    pdfButton.addEventListener('click', generateAuditPdf);
  }
});
