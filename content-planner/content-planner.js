const CONTENT_PLANNER_CONFIG_KEY = 'anavibe-tools-content-planner-config';

const contentPlannerClientFieldsSchema = [
  { key: 'name', label: 'Nom du client', type: 'text' },
  { key: 'sector', label: 'Secteur d’activité', type: 'text' },
  { key: 'city', label: 'Ville', type: 'text' }
];

const contentPlannerRhythmFieldsSchema = [
  { key: 'postsPerWeek', label: 'Publications par semaine', type: 'number' },
  { key: 'reelsPerWeek', label: 'Reels par semaine', type: 'number' },
  { key: 'storiesPerWeek', label: 'Stories par semaine', type: 'number' }
];

const contentPlannerPlatformOptions = [
  { key: 'instagram', label: 'Instagram', icon: '📸' },
  { key: 'facebook', label: 'Facebook', icon: '📘' },
  { key: 'tiktok', label: 'TikTok', icon: '🎵' },
  { key: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { key: 'googleBusiness', label: 'Google Business', icon: '📍' }
];

function createDefaultContentPlannerConfig() {
  return {
    client: {
      name: '',
      sector: '',
      city: '',
      mainGoal: '',
      secondaryGoals: ''
    },
    platforms: {
      instagram: false,
      facebook: false,
      tiktok: false,
      linkedin: false,
      googleBusiness: false
    },
    rhythm: {
      postsPerWeek: '',
      reelsPerWeek: '',
      storiesPerWeek: ''
    }
  };
}

function getContentPlannerConfig() {
  const saved = localStorage.getItem(CONTENT_PLANNER_CONFIG_KEY);

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.client && parsed.platforms && parsed.rhythm) {
        return parsed;
      }
    } catch (error) {
      // fall through to default
    }
  }

  const defaultConfig = createDefaultContentPlannerConfig();
  localStorage.setItem(CONTENT_PLANNER_CONFIG_KEY, JSON.stringify(defaultConfig));
  return defaultConfig;
}

function saveContentPlannerConfig(config) {
  localStorage.setItem(CONTENT_PLANNER_CONFIG_KEY, JSON.stringify(config));
}

function escapeContentPlannerText(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]
  ));
}

function flashContentPlannerSavedHint() {
  const hint = document.getElementById('contentPlannerSavedHint');
  if (!hint) {
    return;
  }
  hint.textContent = 'Configuration enregistrée ✓';
  clearTimeout(flashContentPlannerSavedHint.timeoutId);
  flashContentPlannerSavedHint.timeoutId = setTimeout(() => {
    hint.textContent = 'Configuration enregistrée automatiquement.';
  }, 1600);
}

function createContentPlannerFieldControl(field, value) {
  const wrapper = document.createElement('label');
  wrapper.className = 'field-item';

  const labelSpan = document.createElement('span');
  labelSpan.textContent = field.label;
  wrapper.appendChild(labelSpan);

  const input = document.createElement('input');
  input.className = 'field-input';
  input.type = field.type;
  input.value = value ?? '';
  input.dataset.field = field.key;
  wrapper.appendChild(input);

  return wrapper;
}

function renderContentPlannerClientFields() {
  const grid = document.getElementById('contentPlannerClientFieldsGrid');
  if (!grid) {
    return;
  }

  const config = getContentPlannerConfig();
  grid.innerHTML = '';

  contentPlannerClientFieldsSchema.forEach((field) => {
    const control = createContentPlannerFieldControl(field, config.client[field.key]);
    const input = control.querySelector('.field-input');
    input.addEventListener('input', () => {
      const freshConfig = getContentPlannerConfig();
      freshConfig.client[field.key] = input.value;
      saveContentPlannerConfig(freshConfig);
      flashContentPlannerSavedHint();
    });
    grid.appendChild(control);
  });
}

function renderContentPlannerGoalsFields() {
  const config = getContentPlannerConfig();

  const mainGoalInput = document.getElementById('contentPlannerMainGoal');
  const secondaryGoalsInput = document.getElementById('contentPlannerSecondaryGoals');

  if (mainGoalInput) {
    mainGoalInput.value = config.client.mainGoal ?? '';
    mainGoalInput.addEventListener('input', () => {
      const freshConfig = getContentPlannerConfig();
      freshConfig.client.mainGoal = mainGoalInput.value;
      saveContentPlannerConfig(freshConfig);
      flashContentPlannerSavedHint();
    });
  }

  if (secondaryGoalsInput) {
    secondaryGoalsInput.value = config.client.secondaryGoals ?? '';
    secondaryGoalsInput.addEventListener('input', () => {
      const freshConfig = getContentPlannerConfig();
      freshConfig.client.secondaryGoals = secondaryGoalsInput.value;
      saveContentPlannerConfig(freshConfig);
      flashContentPlannerSavedHint();
    });
  }
}

function renderContentPlannerPlatformChecklist() {
  const list = document.getElementById('contentPlannerPlatformChecklist');
  if (!list) {
    return;
  }

  const config = getContentPlannerConfig();
  list.innerHTML = '';

  contentPlannerPlatformOptions.forEach((platform) => {
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
      const freshConfig = getContentPlannerConfig();
      freshConfig.platforms[platform.key] = checkbox.checked;
      saveContentPlannerConfig(freshConfig);
      label.classList.toggle('checked', checkbox.checked);
      flashContentPlannerSavedHint();
      renderContentPlannerCalendarSection();
    });

    list.appendChild(label);
  });
}

function renderContentPlannerRhythmFields() {
  const grid = document.getElementById('contentPlannerRhythmFieldsGrid');
  if (!grid) {
    return;
  }

  const config = getContentPlannerConfig();
  grid.innerHTML = '';

  contentPlannerRhythmFieldsSchema.forEach((field) => {
    const control = createContentPlannerFieldControl(field, config.rhythm[field.key]);
    const input = control.querySelector('.field-input');
    input.addEventListener('input', () => {
      const freshConfig = getContentPlannerConfig();
      freshConfig.rhythm[field.key] = input.value;
      saveContentPlannerConfig(freshConfig);
      flashContentPlannerSavedHint();
    });
    grid.appendChild(control);
  });
}

const CONTENT_PLANNER_CALENDAR_KEY = 'anavibe-tools-content-planner-calendar';

const contentPlannerContentTypes = ['Publication', 'Story', 'Reel', 'Publication Google Business', 'Publication LinkedIn'];
const contentPlannerStatusOptions = ['À faire', 'En cours', 'Terminé'];

const contentPlannerFormatEligiblePlatforms = {
  Publication: ['instagram', 'facebook', 'tiktok'],
  Reel: ['instagram', 'tiktok'],
  Story: ['instagram', 'facebook']
};

function generateContentPlannerId() {
  return `cp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getContentPlannerCalendar() {
  const saved = localStorage.getItem(CONTENT_PLANNER_CALENDAR_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed.items)) {
        return parsed;
      }
    } catch (error) {
      // fall through
    }
  }
  return null;
}

function saveContentPlannerCalendar(calendar) {
  localStorage.setItem(CONTENT_PLANNER_CALENDAR_KEY, JSON.stringify(calendar));
}

function formatContentPlannerDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getContentPlannerMonthInfo(referenceDate) {
  const ref = referenceDate || new Date();
  const year = ref.getFullYear();
  const month = ref.getMonth();
  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
  const monthLabel = ref.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(new Date(year, month, day));
  }
  return { year, month, monthKey, monthLabel, days };
}

function getContentPlannerMondayIndex(date) {
  return (date.getDay() + 6) % 7;
}

function partitionContentPlannerDaysIntoWeeks(days) {
  const weeksMap = new Map();
  days.forEach((date) => {
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - getContentPlannerMondayIndex(date));
    const key = formatContentPlannerDateKey(weekStart);
    if (!weeksMap.has(key)) {
      weeksMap.set(key, { weekStart, days: [] });
    }
    weeksMap.get(key).days.push(date);
  });
  return Array.from(weeksMap.values()).sort((a, b) => a.weekStart - b.weekStart);
}

function formatContentPlannerWeekLabel(weekDays) {
  const first = weekDays[0];
  const last = weekDays[weekDays.length - 1];
  const fmt = (d) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  return `Semaine du ${fmt(first)} au ${fmt(last)}`;
}

function buildContentPlannerGoalPool(config) {
  const pool = [];
  const mainGoal = String(config.client.mainGoal || '').trim();
  if (mainGoal) {
    pool.push(mainGoal, mainGoal);
  }
  const secondaryRaw = String(config.client.secondaryGoals || '').trim();
  if (secondaryRaw) {
    secondaryRaw
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean)
      .forEach((goal) => pool.push(goal));
  }
  return pool;
}

function getContentPlannerSeason(date) {
  const month = date.getMonth();
  if (month === 11 || month === 0 || month === 1) {
    return 'hiver';
  }
  if (month >= 2 && month <= 4) {
    return 'printemps';
  }
  if (month >= 5 && month <= 7) {
    return 'été';
  }
  return 'automne';
}

function getContentPlannerMonthMoment(date) {
  const moments = {
    0: 'les soldes d’hiver',
    1: 'la Saint-Valentin',
    5: 'le début de l’été',
    6: 'les soldes d’été',
    8: 'la rentrée',
    11: 'les fêtes de fin d’année'
  };
  return moments[date.getMonth()] || null;
}

function buildContentPlannerIdeaContext(config, date) {
  return {
    sector: String(config.client.sector || '').trim() || 'votre activité',
    companyLabel: String(config.client.name || '').trim() || 'l’entreprise',
    city: String(config.client.city || '').trim(),
    season: getContentPlannerSeason(date),
    moment: getContentPlannerMonthMoment(date)
  };
}

const contentPlannerIdeaPools = {
  Publication: [
    (ctx) => ({ title: `Dans les coulisses de ${ctx.sector}`, hook: 'Vous ne verrez jamais ça sur la vitrine !', concept: `Montrez une étape de préparation ou de travail en interne pour humaniser ${ctx.companyLabel} et créer de la proximité avec votre audience.`, mediaType: 'Photo', cta: 'Commentez avec un emoji si vous aimez découvrir les coulisses !' }),
    (ctx) => ({ title: `3 astuces pour bien choisir ${ctx.sector}`, hook: 'Le conseil n°2 change tout.', concept: 'Partagez 3 conseils pratiques liés à votre expertise pour démontrer votre savoir-faire et apporter de la valeur immédiate.', mediaType: 'Carrousel', cta: 'Enregistrez ce post pour le retrouver facilement.' }),
    (ctx) => ({ title: 'Zoom sur notre offre phare', hook: 'Voici ce que nos clients préfèrent.', concept: 'Présentez en détail un produit ou service clé, ses bénéfices concrets et pourquoi il se distingue.', mediaType: 'Photo', cta: 'Écrivez-nous en message privé pour en savoir plus.' }),
    (ctx) => ({ title: 'Ils nous ont fait confiance', hook: 'Rien ne vaut l’avis d’un client satisfait.', concept: 'Partagez un avis ou témoignage client authentique (avec accord) pour renforcer la crédibilité et rassurer les prospects.', mediaType: 'Photo', cta: 'Laissez votre propre avis en commentaire !' }),
    (ctx) => ({ title: 'Et vous, plutôt ceci ou cela ?', hook: 'On a besoin de votre avis !', concept: `Posez une question simple et engageante liée à ${ctx.sector} pour stimuler les commentaires et l’algorithme.`, mediaType: 'Texte + visuel', cta: 'Répondez en commentaire, on a hâte de vous lire !' }),
    (ctx) => ({ title: 'Une offre à ne pas manquer', hook: 'Disponible pour une durée limitée.', concept: 'Mettez en avant une offre, une promotion ou un avantage exclusif pour inciter au passage à l’action.', mediaType: 'Photo', cta: 'Contactez-nous vite pour en profiter.' }),
    (ctx) => ({ title: ctx.moment ? `Préparez ${ctx.moment} avec ${ctx.companyLabel}` : `Une publication aux couleurs de l’${ctx.season}`, hook: 'La saison parfaite pour en profiter.', concept: 'Adaptez votre contenu à l’actualité saisonnière pour rester pertinent et captiver une audience sensible au bon moment.', mediaType: 'Photo', cta: 'Venez en profiter dès maintenant.' }),
    (ctx) => ({ title: 'Rencontrez l’équipe', hook: `Derrière ${ctx.companyLabel}, il y a une équipe passionnée.`, concept: 'Présentez un membre de l’équipe, son rôle et sa personnalité pour humaniser la marque et créer du lien.', mediaType: 'Photo', cta: 'Dites bonjour à toute l’équipe en commentaire !' }),
    (ctx) => ({ title: `L’histoire derrière ${ctx.companyLabel}`, hook: 'Tout a commencé par une idée simple.', concept: 'Racontez une partie de votre histoire de marque, votre mission ou ce qui vous distingue pour créer une connexion émotionnelle.', mediaType: 'Carrousel', cta: 'Partagez ce post si notre histoire vous inspire.' }),
    (ctx) => ({ title: 'Le résultat parle de lui-même', hook: 'Voici ce qu’on peut accomplir ensemble.', concept: 'Montrez un avant/après ou un résultat concret pour illustrer la valeur de votre travail.', mediaType: 'Photo', cta: 'Contactez-nous pour un résultat similaire.' }),
    (ctx) => ({ title: ctx.city ? `${ctx.companyLabel}, fier acteur de ${ctx.city}` : 'Ancrés dans notre communauté', hook: 'Votre quartier, notre priorité.', concept: 'Mettez en avant votre ancrage local, un partenariat ou un événement de quartier pour renforcer la proximité.', mediaType: 'Photo', cta: 'Taguez un proche de la région !' }),
    (ctx) => ({ title: 'Une nouveauté arrive bientôt', hook: 'Restez à l’affût.', concept: 'Teasez une nouveauté, un lancement ou un événement à venir pour créer de l’attente et de la curiosité.', mediaType: 'Vidéo courte', cta: 'Activez les notifications pour ne rien manquer.' }),
    (ctx) => ({ title: 'Les coulisses de notre savoir-faire', hook: 'La qualité, ça se voit dans le détail.', concept: `Détaillez un aspect technique ou un savoir-faire précis de ${ctx.sector} qui justifie la confiance de vos clients.`, mediaType: 'Carrousel', cta: 'Posez vos questions techniques en commentaire.' }),
    (ctx) => ({ title: 'Ce qu’on nous demande le plus souvent', hook: 'La réponse à la question n°1.', concept: 'Répondez à la question la plus fréquemment posée par vos clients pour lever un frein commun à la décision.', mediaType: 'Texte + visuel', cta: 'D’autres questions ? Écrivez-les en commentaire.' }),
    (ctx) => ({ title: 'Un mois, un engagement', hook: 'On s’engage pour vous.', concept: `Présentez un engagement qualité ou une valeur forte de ${ctx.companyLabel} pour rassurer et différencier votre offre.`, mediaType: 'Photo', cta: 'Partagez si cet engagement compte pour vous aussi.' })
  ],
  Reel: [
    (ctx) => ({ title: '3 secondes pour tout comprendre', hook: 'Le conseil que personne ne vous donne.', concept: `Un format ultra rapide et rythmé qui délivre une astuce concrète et actionnable liée à ${ctx.sector}.`, mediaType: 'Vidéo verticale', cta: 'Suivez-nous pour plus d’astuces comme celle-ci.' }),
    (ctx) => ({ title: 'Une journée dans les coulisses', hook: 'Ce que vous ne voyez jamais.', concept: `Un montage dynamique montrant les coulisses de ${ctx.companyLabel} en accéléré ou en time-lapse.`, mediaType: 'Vidéo verticale', cta: 'Dites-nous en commentaire ce que vous voulez voir ensuite.' }),
    (ctx) => ({ title: 'La transformation en quelques secondes', hook: 'Vous n’allez pas croire la différence.', concept: 'Un avant/après visuel percutant qui démontre l’impact concret de votre offre.', mediaType: 'Vidéo verticale', cta: 'Envoyez ce Reel à quelqu’un qui en a besoin.' }),
    (ctx) => ({ title: 'On a testé la tendance du moment', hook: 'Ça devait arriver.', concept: 'Reprenez un format ou un son tendance pour l’adapter à votre univers et gagner en visibilité.', mediaType: 'Vidéo verticale', cta: 'Likez si vous voulez qu’on recommence !' }),
    (ctx) => ({ title: 'La question qu’on nous pose tout le temps', hook: 'On y répond enfin.', concept: 'Répondez en vidéo courte à une question fréquente de vos clients pour informer tout en engageant.', mediaType: 'Vidéo verticale', cta: 'Posez votre question en commentaire, on y répondra.' }),
    (ctx) => ({ title: 'Comment bien profiter de nos services', hook: 'Suivez le guide en 15 secondes.', concept: 'Un mini-tutoriel visuel rapide qui montre comment utiliser ou profiter au mieux de votre offre.', mediaType: 'Vidéo verticale', cta: 'Enregistrez ce Reel pour le revoir plus tard.' }),
    (ctx) => ({ title: ctx.moment ? `${ctx.moment}, version Reel` : `L’ambiance ${ctx.season} en vidéo`, hook: 'L’ambiance du moment, capturée en quelques secondes.', concept: 'Un Reel rythmé qui capture l’énergie de la saison ou d’un moment commercial fort.', mediaType: 'Vidéo verticale', cta: 'Venez vivre ça avec nous !' }),
    (ctx) => ({ title: `3 secondes avec ${ctx.companyLabel}`, hook: 'On vous présente la team.', concept: 'Un format rapide et dynamique présentant un membre de l’équipe avec une touche d’humour ou de personnalité.', mediaType: 'Vidéo verticale', cta: 'Suivez-nous pour découvrir toute l’équipe.' }),
    (ctx) => ({ title: 'Un chiffre qui en dit long', hook: 'Vous n’allez pas croire ce chiffre.', concept: 'Mettez en scène une statistique ou un résultat marquant lié à votre activité de façon visuelle et percutante.', mediaType: 'Vidéo verticale', cta: 'Partagez si ce chiffre vous a surpris.' }),
    (ctx) => ({ title: 'La vraie réaction de nos clients', hook: 'Regardez leurs visages.', concept: 'Filmez une réaction authentique et spontanée de clients pour renforcer la preuve sociale de façon vivante.', mediaType: 'Vidéo verticale', cta: 'Venez vivre la même expérience.' })
  ],
  Story: [
    (ctx) => ({ title: 'Sondage du jour', hook: 'Votre avis compte !', concept: `Utilisez le sticker sondage pour poser une question rapide liée à ${ctx.sector} et stimuler l’interaction immédiate.`, mediaType: 'Story interactive', cta: 'Votez en story, résultats à suivre !' }),
    (ctx) => ({ title: `En ce moment chez ${ctx.companyLabel}`, hook: 'Un aperçu en direct.', concept: 'Partagez un moment spontané de la journée pour créer de la proximité en temps réel.', mediaType: 'Story photo', cta: 'Répondez-nous en story pour discuter !' }),
    (ctx) => ({ title: 'Plus que quelques jours', hook: 'Le compte à rebours est lancé.', concept: 'Utilisez le sticker compte à rebours pour annoncer un événement, une offre ou un lancement à venir.', mediaType: 'Story interactive', cta: 'Activez le rappel pour ne pas manquer le lancement.' }),
    (ctx) => ({ title: 'Une question pour vous', hook: 'On veut vraiment savoir.', concept: 'Utilisez le sticker question pour recueillir les avis, envies ou besoins de votre communauté.', mediaType: 'Story interactive', cta: 'Répondez, on partagera les meilleures réponses !' }),
    (ctx) => ({ title: 'Un avis qui nous touche', hook: 'Merci pour ce retour !', concept: 'Repartagez en story un avis, un tag ou un message client positif pour renforcer la confiance.', mediaType: 'Story photo', cta: 'Taguez-nous dans vos propres retours !' }),
    (ctx) => ({ title: 'Offre valable aujourd’hui uniquement', hook: 'Ça se passe maintenant.', concept: 'Annoncez une offre limitée dans le temps pour créer un sentiment d’urgence propre au format éphémère des stories.', mediaType: 'Story interactive', cta: 'Swipez pour en profiter avant minuit !' }),
    (ctx) => ({ title: 'Testez vos connaissances', hook: 'Sauriez-vous répondre ?', concept: `Utilisez le sticker quiz pour tester la connaissance de votre audience sur ${ctx.sector} de façon ludique.`, mediaType: 'Story interactive', cta: 'Répondez au quiz et découvrez le résultat !' }),
    (ctx) => ({ title: ctx.moment ? `${ctx.moment} commence !` : `L’ambiance ${ctx.season} du jour`, hook: 'L’occasion parfaite.', concept: 'Partagez un contenu léger et immédiat en lien avec l’actualité saisonnière.', mediaType: 'Story photo', cta: 'Venez découvrir ça aujourd’hui !' }),
    (ctx) => ({ title: 'On prépare quelque chose', hook: 'Patience...', concept: 'Teasez la préparation d’un contenu, d’un produit ou d’un événement à venir de façon informelle.', mediaType: 'Story vidéo', cta: 'Restez connectés pour la suite !' }),
    (ctx) => ({ title: 'Vos questions, nos réponses', hook: 'On répond à tout !', concept: 'Invitez votre audience à poser des questions via le sticker question, puis répondez dans une story suivante.', mediaType: 'Story interactive', cta: 'Posez votre question maintenant !' }),
    (ctx) => ({ title: 'Un chiffre à retenir', hook: 'Regardez bien ce chiffre.', concept: 'Partagez une statistique simple et marquante liée à votre activité, mise en scène de façon lisible en story.', mediaType: 'Story photo', cta: 'Swipez pour en savoir plus !' }),
    (ctx) => ({ title: 'Curseur : votre humeur du jour', hook: 'Un clic suffit.', concept: 'Utilisez le sticker curseur pour une interaction légère et amusante avec votre communauté.', mediaType: 'Story interactive', cta: 'Placez le curseur et dites-nous tout !' }),
    (ctx) => ({ title: 'Repartage d’un post', hook: 'Vous l’avez peut-être manqué.', concept: 'Repartagez en story votre dernière publication marquante pour lui donner une seconde exposition.', mediaType: 'Story photo', cta: 'Allez voir le post complet en story !' })
  ],
  'Publication Google Business': [
    (ctx) => ({ title: 'Nos informations à jour', hook: 'Toujours disponibles pour vous.', concept: 'Publiez une mise à jour claire sur vos horaires, services ou actualités pour rassurer les prospects qui consultent votre fiche.', mediaType: 'Photo + texte', cta: 'Appelez-nous ou visitez notre fiche pour plus d’infos.' }),
    (ctx) => ({ title: 'Découvrez notre offre', hook: 'Ce que nous faisons de mieux.', concept: 'Présentez un service ou produit clé directement sur votre fiche Google pour capter l’intention de recherche locale.', mediaType: 'Photo + texte', cta: 'Cliquez sur « En savoir plus » pour découvrir l’offre.' }),
    (ctx) => ({ title: 'Une offre spéciale pour nos visiteurs locaux', hook: 'Réservée à notre communauté.', concept: 'Publiez une offre ou promotion visible directement dans les résultats de recherche Google pour convertir les recherches locales.', mediaType: 'Photo + texte', cta: 'Réservez dès maintenant via la fiche.' }),
    (ctx) => ({ title: 'Merci pour votre confiance', hook: 'Vos avis nous portent.', concept: 'Mettez en avant un avis client récent pour renforcer la crédibilité de la fiche auprès des nouveaux visiteurs.', mediaType: 'Texte', cta: 'Laissez à votre tour votre avis sur notre fiche.' }),
    (ctx) => ({ title: 'Ça se passe bientôt', hook: 'Ne manquez pas ça.', concept: 'Annoncez un événement ou une actualité locale pour dynamiser la fiche et améliorer le référencement local.', mediaType: 'Photo + texte', cta: 'Consultez la fiche pour tous les détails.' }),
    (ctx) => ({ title: ctx.moment ? `${ctx.moment} chez ${ctx.companyLabel}` : `Actualité de l’${ctx.season}`, hook: 'La bonne période pour nous rendre visite.', concept: 'Adaptez votre publication Google à l’actualité saisonnière pour rester pertinent dans les recherches locales.', mediaType: 'Photo + texte', cta: 'Venez nous rencontrer dès maintenant.' }),
    (ctx) => ({ title: 'Question fréquente : la réponse ici', hook: 'Vous vous posez la question ?', concept: 'Répondez à une question fréquente de vos clients directement dans une publication pour lever les freins.', mediaType: 'Texte', cta: 'Contactez-nous pour toute autre question.' }),
    (ctx) => ({ title: ctx.city ? `Fiers de servir ${ctx.city}` : 'Ancrés dans notre communauté locale', hook: 'Votre partenaire de proximité.', concept: 'Renforcez votre ancrage local pour améliorer votre pertinence sur les recherches géolocalisées.', mediaType: 'Photo + texte', cta: 'Passez nous voir, on vous attend.' })
  ],
  'Publication LinkedIn': [
    (ctx) => ({ title: 'Ce que nous avons appris cette année', hook: 'Un enseignement qui a tout changé.', concept: 'Partagez un retour d’expérience professionnel ou une leçon apprise pour asseoir votre expertise auprès d’un réseau professionnel.', mediaType: 'Texte + visuel', cta: 'Partagez votre propre expérience en commentaire.' }),
    (ctx) => ({ title: `Ce qui évolue dans ${ctx.sector}`, hook: 'Une tendance à surveiller de près.', concept: 'Commentez une actualité ou tendance de votre secteur pour démontrer votre veille et votre expertise.', mediaType: 'Texte', cta: 'Quel est votre avis sur cette évolution ?' }),
    (ctx) => ({ title: 'Comment nous avons aidé un client', hook: 'Les résultats parlent d’eux-mêmes.', concept: 'Présentez une étude de cas ou un succès client (anonymisé si besoin) pour illustrer votre valeur ajoutée de façon professionnelle.', mediaType: 'Texte + visuel', cta: 'Contactez-nous pour discuter de votre projet.' }),
    (ctx) => ({ title: `Derrière ${ctx.companyLabel}`, hook: 'Notre approche, expliquée simplement.', concept: 'Expliquez votre méthode de travail ou vos valeurs d’entreprise pour renforcer votre crédibilité professionnelle.', mediaType: 'Texte + visuel', cta: 'Échangeons sur votre projet en message privé.' }),
    (ctx) => ({ title: 'Notre équipe s’agrandit', hook: 'Les talents qui font la différence.', concept: 'Mettez en avant un membre de l’équipe ou une opportunité pour humaniser votre marque employeur.', mediaType: 'Photo', cta: 'Contactez-nous pour en savoir plus sur nos équipes.' }),
    (ctx) => ({ title: 'Un conseil pour les décideurs', hook: 'Un point souvent négligé.', concept: 'Partagez un conseil pratique et actionnable destiné à un public professionnel dans votre domaine d’expertise.', mediaType: 'Texte', cta: 'Enregistrez ce post pour le retrouver facilement.' }),
    (ctx) => ({ title: 'Un chiffre qui interpelle', hook: 'Une donnée à connaître absolument.', concept: 'Partagez une statistique pertinente de votre secteur accompagnée de votre analyse pour engager la conversation.', mediaType: 'Texte + visuel', cta: 'Qu’en pensez-vous ? Réagissez en commentaire.' }),
    (ctx) => ({ title: 'Une collaboration dont nous sommes fiers', hook: 'Ensemble, on va plus loin.', concept: 'Mettez en avant un partenariat stratégique ou une collaboration pour élargir votre réseau et votre crédibilité.', mediaType: 'Photo', cta: 'Découvrez cette collaboration en message privé.' }),
    (ctx) => ({ title: 'Pourquoi nous faisons ce métier', hook: 'Notre mission, en une phrase.', concept: 'Exposez votre vision d’entreprise ou votre mission pour inspirer votre réseau professionnel et attirer les bons partenaires.', mediaType: 'Texte', cta: 'Partagez ce post si notre vision résonne avec la vôtre.' }),
    (ctx) => ({ title: 'Un bilan de notre activité', hook: 'Voici où nous en sommes.', concept: 'Partagez une actualité, un jalon ou un bilan de l’entreprise pour tenir votre réseau informé et engagé.', mediaType: 'Texte + visuel', cta: 'Merci de nous suivre dans cette aventure.' })
  ]
};

function pickContentPlannerIdea(type, ctx, cursorRef, usedSignatures, day) {
  const pool = contentPlannerIdeaPools[type];
  if (!pool || !pool.length) {
    return { title: '', hook: '', concept: '', mediaType: '', cta: '' };
  }

  const signatures = usedSignatures || new Set();
  const callSequence = cursorRef.value;
  let idea;
  let signature;
  let attempts = 0;

  do {
    const index = cursorRef.value % pool.length;
    cursorRef.value += 1;
    idea = pool[index](ctx);
    signature = `${idea.title}|${idea.hook}|${idea.concept}`;
    attempts += 1;
  } while (signatures.has(signature) && attempts < pool.length);

  if (signatures.has(signature)) {
    // Pool exhausted (more items than unique templates): callSequence is strictly
    // increasing per call, so it guarantees a unique signature even when several
    // items share the same calendar day.
    const dateLabel = day ? day.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) : '';
    const variantLabel = dateLabel ? `édition du ${dateLabel} n°${callSequence + 1}` : `déclinaison n°${callSequence + 1}`;
    idea = {
      ...idea,
      title: `${idea.title} — ${variantLabel}`,
      concept: `${idea.concept} Variante n°${callSequence + 1} pour ne jamais répéter à l’identique une idée déjà proposée.`
    };
    signature = `${idea.title}|${idea.hook}|${idea.concept}`;
  }

  signatures.add(signature);
  return idea;
}

function scheduleContentPlannerItems(items, weekDays, count, platformKeys, type, goalCursorRef, goalPool, fallbackGoal, config, ideaCursorRef, usedSignatures) {
  if (!count || !platformKeys.length || !weekDays.length) {
    return;
  }
  for (let i = 0; i < count; i += 1) {
    const dayIndex = Math.min(weekDays.length - 1, Math.floor((i * weekDays.length) / count));
    const day = weekDays[dayIndex];
    const platformKey = platformKeys[i % platformKeys.length];
    const objective = goalPool.length ? goalPool[goalCursorRef.value % goalPool.length] : fallbackGoal;
    if (goalPool.length) {
      goalCursorRef.value += 1;
    }
    const ideaContext = buildContentPlannerIdeaContext(config, day);
    const idea = pickContentPlannerIdea(type, ideaContext, ideaCursorRef, usedSignatures, day);
    items.push({
      id: generateContentPlannerId(),
      date: formatContentPlannerDateKey(day),
      platformKey,
      type,
      objective,
      status: contentPlannerStatusOptions[0],
      title: idea.title,
      hook: idea.hook,
      concept: idea.concept,
      mediaType: idea.mediaType,
      cta: idea.cta
    });
  }
}

function generateContentPlannerItems(config, monthInfo) {
  const items = [];
  const checkedPlatformKeys = contentPlannerPlatformOptions.filter((p) => config.platforms[p.key]).map((p) => p.key);

  const postsPerWeek = Number(config.rhythm.postsPerWeek) || 0;
  const reelsPerWeek = Number(config.rhythm.reelsPerWeek) || 0;
  const storiesPerWeek = Number(config.rhythm.storiesPerWeek) || 0;

  const feedPlatforms = contentPlannerFormatEligiblePlatforms.Publication.filter((key) => checkedPlatformKeys.includes(key));
  const reelsPlatforms = contentPlannerFormatEligiblePlatforms.Reel.filter((key) => checkedPlatformKeys.includes(key));
  const storiesPlatforms = contentPlannerFormatEligiblePlatforms.Story.filter((key) => checkedPlatformKeys.includes(key));

  const goalPool = buildContentPlannerGoalPool(config);
  const goalCursorRef = { value: 0 };
  const ideaCursors = {
    Publication: { value: 0 },
    Reel: { value: 0 },
    Story: { value: 0 },
    'Publication Google Business': { value: 0 },
    'Publication LinkedIn': { value: 0 }
  };
  const usedSignatures = {
    Publication: new Set(),
    Reel: new Set(),
    Story: new Set(),
    'Publication Google Business': new Set(),
    'Publication LinkedIn': new Set()
  };

  const weeks = partitionContentPlannerDaysIntoWeeks(monthInfo.days);

  weeks.forEach((week) => {
    scheduleContentPlannerItems(items, week.days, postsPerWeek, feedPlatforms, 'Publication', goalCursorRef, goalPool, 'Renforcer la notoriété et la préférence de marque.', config, ideaCursors.Publication, usedSignatures.Publication);
    scheduleContentPlannerItems(items, week.days, reelsPerWeek, reelsPlatforms, 'Reel', goalCursorRef, goalPool, 'Augmenter la portée et l’engagement.', config, ideaCursors.Reel, usedSignatures.Reel);
    scheduleContentPlannerItems(items, week.days, storiesPerWeek, storiesPlatforms, 'Story', goalCursorRef, goalPool, 'Maintenir le contact quotidien avec la communauté.', config, ideaCursors.Story, usedSignatures.Story);
    if (config.platforms.googleBusiness) {
      scheduleContentPlannerItems(items, week.days, 1, ['googleBusiness'], 'Publication Google Business', goalCursorRef, goalPool, 'Améliorer la visibilité locale et le référencement.', config, ideaCursors['Publication Google Business'], usedSignatures['Publication Google Business']);
    }
    if (config.platforms.linkedin) {
      scheduleContentPlannerItems(items, week.days, 2, ['linkedin'], 'Publication LinkedIn', goalCursorRef, goalPool, 'Renforcer la crédibilité professionnelle et la visibilité B2B.', config, ideaCursors['Publication LinkedIn'], usedSignatures['Publication LinkedIn']);
    }
  });

  items.sort((a, b) => a.date.localeCompare(b.date));
  return items;
}

function getContentPlannerPlatformInfo(key) {
  return contentPlannerPlatformOptions.find((p) => p.key === key) || { key, label: key, icon: '' };
}

function updateContentPlannerItemField(itemId, field, value) {
  const calendar = getContentPlannerCalendar();
  if (!calendar) {
    return;
  }
  const target = calendar.items.find((entry) => entry.id === itemId);
  if (target) {
    target[field] = value;
    saveContentPlannerCalendar(calendar);
  }
}

function createContentPlannerIdeaField(label, value, itemId, field, multiline) {
  const wrapper = document.createElement('label');
  wrapper.className = 'field-item';

  const labelSpan = document.createElement('span');
  labelSpan.textContent = label;
  wrapper.appendChild(labelSpan);

  const input = document.createElement(multiline ? 'textarea' : 'input');
  input.className = multiline ? 'notes-textarea' : 'field-input';
  if (multiline) {
    input.rows = 2;
  } else {
    input.type = 'text';
  }
  input.value = value ?? '';

  input.addEventListener('input', () => updateContentPlannerItemField(itemId, field, input.value));

  wrapper.appendChild(input);
  return wrapper;
}

function createContentPlannerItemCard(item, checkedPlatforms) {
  const card = document.createElement('div');
  card.className = 'calendar-item-card';

  const headerRow = document.createElement('div');
  headerRow.className = 'calendar-item-row';

  const dateInput = document.createElement('input');
  dateInput.type = 'date';
  dateInput.className = 'field-input calendar-item-date';
  dateInput.value = item.date;

  const platformSelect = document.createElement('select');
  platformSelect.className = 'field-input calendar-item-platform';
  const platformOptionsToShow = checkedPlatforms.length ? checkedPlatforms : contentPlannerPlatformOptions;
  platformOptionsToShow.forEach((platform) => {
    const option = document.createElement('option');
    option.value = platform.key;
    option.textContent = `${platform.icon} ${platform.label}`;
    platformSelect.appendChild(option);
  });
  if (!platformOptionsToShow.some((p) => p.key === item.platformKey)) {
    const info = getContentPlannerPlatformInfo(item.platformKey);
    const fallbackOption = document.createElement('option');
    fallbackOption.value = item.platformKey;
    fallbackOption.textContent = `${info.icon} ${info.label}`;
    platformSelect.appendChild(fallbackOption);
  }
  platformSelect.value = item.platformKey;

  const typeSelect = document.createElement('select');
  typeSelect.className = 'field-input calendar-item-type';
  contentPlannerContentTypes.forEach((type) => {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = type;
    typeSelect.appendChild(option);
  });
  typeSelect.value = item.type;

  const statusSelect = document.createElement('select');
  statusSelect.className = 'status-select calendar-item-status';
  contentPlannerStatusOptions.forEach((status) => {
    const option = document.createElement('option');
    option.value = status;
    option.textContent = status;
    statusSelect.appendChild(option);
  });
  statusSelect.value = item.status;

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'remove-item-btn';
  removeButton.setAttribute('aria-label', 'Supprimer cette publication');
  removeButton.textContent = '✕';

  dateInput.addEventListener('change', () => {
    updateContentPlannerItemField(item.id, 'date', dateInput.value);
    renderContentPlannerCalendarSection();
  });
  platformSelect.addEventListener('change', () => updateContentPlannerItemField(item.id, 'platformKey', platformSelect.value));
  typeSelect.addEventListener('change', () => updateContentPlannerItemField(item.id, 'type', typeSelect.value));
  statusSelect.addEventListener('change', () => updateContentPlannerItemField(item.id, 'status', statusSelect.value));

  removeButton.addEventListener('click', () => {
    const calendar = getContentPlannerCalendar();
    if (!calendar) {
      return;
    }
    calendar.items = calendar.items.filter((entry) => entry.id !== item.id);
    saveContentPlannerCalendar(calendar);
    renderContentPlannerCalendarSection();
  });

  headerRow.appendChild(dateInput);
  headerRow.appendChild(platformSelect);
  headerRow.appendChild(typeSelect);
  headerRow.appendChild(statusSelect);
  headerRow.appendChild(removeButton);
  card.appendChild(headerRow);

  const ideaGrid = document.createElement('div');
  ideaGrid.className = 'calendar-item-idea-grid';
  ideaGrid.appendChild(createContentPlannerIdeaField('Titre', item.title, item.id, 'title', false));
  ideaGrid.appendChild(createContentPlannerIdeaField('Type de média', item.mediaType, item.id, 'mediaType', false));
  const hookField = createContentPlannerIdeaField('Hook', item.hook, item.id, 'hook', false);
  hookField.classList.add('idea-field-full');
  ideaGrid.appendChild(hookField);
  const conceptField = createContentPlannerIdeaField('Concept', item.concept, item.id, 'concept', true);
  conceptField.classList.add('idea-field-full');
  ideaGrid.appendChild(conceptField);
  ideaGrid.appendChild(createContentPlannerIdeaField('Objectif marketing', item.objective, item.id, 'objective', false));
  ideaGrid.appendChild(createContentPlannerIdeaField('CTA recommandé', item.cta, item.id, 'cta', false));
  card.appendChild(ideaGrid);

  return card;
}

function renderContentPlannerCalendarSection() {
  const section = document.getElementById('contentPlannerCalendarSection');
  if (!section) {
    return;
  }

  const config = getContentPlannerConfig();
  const checkedPlatforms = contentPlannerPlatformOptions.filter((p) => config.platforms[p.key]);
  const monthInfo = getContentPlannerMonthInfo();
  const calendar = getContentPlannerCalendar();

  section.innerHTML = `
    <p class="eyebrow">Planning</p>
    <h3>📅 Calendrier éditorial — ${escapeContentPlannerText(monthInfo.monthLabel)}</h3>
  `;

  if (!checkedPlatforms.length) {
    const empty = document.createElement('p');
    empty.className = 'insight-empty';
    empty.textContent = 'Cochez au moins une plateforme dans la Configuration ci-dessus pour générer le calendrier.';
    section.appendChild(empty);
    return;
  }

  const hasCurrentCalendar = Boolean(calendar) && calendar.monthKey === monthInfo.monthKey;

  const actionsRow = document.createElement('div');
  actionsRow.className = 'header-actions';
  const generateButton = document.createElement('button');
  generateButton.type = 'button';
  generateButton.className = 'btn btn-primary';
  generateButton.textContent = hasCurrentCalendar ? 'Régénérer le calendrier du mois' : 'Générer le calendrier du mois';
  generateButton.addEventListener('click', () => {
    if (hasCurrentCalendar) {
      const confirmed = window.confirm('Régénérer le calendrier remplacera toutes les publications actuelles (y compris vos modifications). Continuer ?');
      if (!confirmed) {
        return;
      }
    }
    const freshConfig = getContentPlannerConfig();
    const freshMonthInfo = getContentPlannerMonthInfo();
    const items = generateContentPlannerItems(freshConfig, freshMonthInfo);
    saveContentPlannerCalendar({ monthKey: freshMonthInfo.monthKey, monthLabel: freshMonthInfo.monthLabel, items });
    renderContentPlannerCalendarSection();
  });
  actionsRow.appendChild(generateButton);
  section.appendChild(actionsRow);

  if (!hasCurrentCalendar) {
    const empty = document.createElement('p');
    empty.className = 'insight-empty';
    empty.style.marginTop = '14px';
    empty.textContent = 'Aucun calendrier généré pour ce mois. Cliquez sur le bouton ci-dessus pour créer automatiquement les publications, Reels, Stories et publications Google Business / LinkedIn selon la configuration.';
    section.appendChild(empty);
    return;
  }

  const weeks = partitionContentPlannerDaysIntoWeeks(monthInfo.days);

  weeks.forEach((week, index) => {
    const weekBlock = document.createElement('div');
    weekBlock.className = 'analysis-subsection calendar-week-block';

    const heading = document.createElement('h4');
    heading.textContent = `Semaine ${index + 1} — ${formatContentPlannerWeekLabel(week.days)}`;
    weekBlock.appendChild(heading);

    const weekDateKeys = week.days.map((date) => formatContentPlannerDateKey(date));
    const weekItems = calendar.items
      .filter((item) => weekDateKeys.includes(item.date))
      .sort((a, b) => a.date.localeCompare(b.date));

    const list = document.createElement('div');
    list.className = 'calendar-item-list';

    if (!weekItems.length) {
      const empty = document.createElement('p');
      empty.className = 'insight-empty';
      empty.textContent = 'Aucune publication cette semaine.';
      list.appendChild(empty);
    } else {
      weekItems.forEach((item) => {
        list.appendChild(createContentPlannerItemCard(item, checkedPlatforms));
      });
    }

    weekBlock.appendChild(list);
    section.appendChild(weekBlock);
  });

  const addForm = document.createElement('form');
  addForm.className = 'inline-add-form';
  addForm.style.marginTop = '18px';
  const firstDateKey = formatContentPlannerDateKey(monthInfo.days[0]);
  const lastDateKey = formatContentPlannerDateKey(monthInfo.days[monthInfo.days.length - 1]);
  addForm.innerHTML = `
    <input type="date" required min="${firstDateKey}" max="${lastDateKey}" value="${firstDateKey}" />
    <button type="submit" class="client-open-btn">Ajouter une publication</button>
  `;
  addForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const dateValue = addForm.querySelector('input').value;
    if (!dateValue) {
      return;
    }
    const freshCalendar = getContentPlannerCalendar();
    if (!freshCalendar) {
      return;
    }
    const freshConfig = getContentPlannerConfig();
    const newItemType = contentPlannerContentTypes[0];
    const ideaContext = buildContentPlannerIdeaContext(freshConfig, new Date(`${dateValue}T00:00:00`));
    const idea = pickContentPlannerIdea(newItemType, ideaContext, { value: freshCalendar.items.length + Date.now() });
    freshCalendar.items.push({
      id: generateContentPlannerId(),
      date: dateValue,
      platformKey: checkedPlatforms[0].key,
      type: newItemType,
      objective: buildContentPlannerGoalPool(freshConfig)[0] || '',
      status: contentPlannerStatusOptions[0],
      title: idea.title,
      hook: idea.hook,
      concept: idea.concept,
      mediaType: idea.mediaType,
      cta: idea.cta
    });
    saveContentPlannerCalendar(freshCalendar);
    renderContentPlannerCalendarSection();
  });
  section.appendChild(addForm);
}

document.addEventListener('DOMContentLoaded', () => {
  renderContentPlannerClientFields();
  renderContentPlannerGoalsFields();
  renderContentPlannerPlatformChecklist();
  renderContentPlannerRhythmFields();
  renderContentPlannerCalendarSection();
});
