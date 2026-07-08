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
    }
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

function populateCommercialPotentialSection(section, platformKeys, activityType) {
  const dimensions = ['visibilite', 'acquisition', 'fidelisation'];
  const dimensionScores = dimensions.map((dimension) => {
    const score = computeDimensionScore(dimension, platformKeys);
    return { dimension, score: score === null ? 0 : 100 - score };
  });

  const commercialPotential = dimensionScores.length
    ? dimensionScores.reduce((sum, item) => sum + item.score, 0) / dimensionScores.length
    : 0;

  const estimates = computeCommercialEstimates(commercialPotential, platformKeys.length, activityType);

  const potentialGrid = section.querySelector('[data-role="potential-grid"]');
  potentialGrid.innerHTML = '';
  dimensions.forEach((dimension) => {
    const dimensionScore = computeDimensionScore(dimension, platformKeys);
    const potentialScore = dimensionScore === null ? 0 : 100 - dimensionScore;
    potentialGrid.appendChild(createPotentialCard(dimension, potentialScore, platformKeys));
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

  checkedPlatforms.forEach((platform) => {
    container.appendChild(renderPlatformAuditSection(platform.key));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderActivityTypeGrid();
  renderPlatformChecklist();
  renderPlatformAudits();
});
