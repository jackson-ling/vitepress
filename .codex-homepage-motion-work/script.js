(() => {
  const body = document.body;
  const stage = document.querySelector('.motion-stage');
  const stageGrid = document.querySelector('.stage-grid');
  const progressBar = document.querySelector('.progress-rail span');
  const knowledgeCore = document.querySelector('.knowledge-core');
  const coreShell = document.querySelector('.core-shell');
  const coreSlices = [...document.querySelectorAll('.core-slice')];
  const coreNodes = [...document.querySelectorAll('.core-node')];
  const coreLinks = [...document.querySelectorAll('.core-link')];
  const hero = document.querySelector('.hero-cluster');
  const tips = [...document.querySelectorAll('.tip-card')];
  const techTitle = document.querySelector('.tech-scene .scene-title');
  const techCards = [...document.querySelectorAll('.tech-card')];
  const techSequence = document.querySelector('.tech-sequence');
  const techCounter = document.querySelector('#techCounter');
  const techName = document.querySelector('#techName');
  const friendTitle = document.querySelector('.friends-scene .scene-title');
  const friends = [...document.querySelectorAll('.friend-card')];
  const footer = document.querySelector('.footer-scene');
  const chapterButtons = [...document.querySelectorAll('.chapter-rail button')];
  const themeToggle = document.querySelector('.theme-toggle');
  const loader = document.querySelector('.site-loader');
  const loaderCount = document.querySelector('.loader-count');
  const motionItems = [...document.querySelectorAll('.motion-item')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const entranceKey = 'homepage-motion-intro-played-v3';
  let shouldPlayEntrance = true;

  try {
    shouldPlayEntrance = sessionStorage.getItem(entranceKey) !== '1';
    if (shouldPlayEntrance) sessionStorage.setItem(entranceKey, '1');
  } catch {}

  let targetProgress = 0;
  let currentProgress = 0;
  let previousProgress = 0;
  let scrollVelocity = 0;
  let pointerX = 0;
  let pointerY = 0;
  let activeTechIndex = -1;
  function prepareEntrance() {
    if (!loader || reduced || !shouldPlayEntrance) {
      body.classList.remove('loader-active');
      body.classList.replace('intro-pending', 'intro-ready');
      loader?.remove();
      return;
    }

    const duration = 2600;
    const gatherDuration = 1150;
    const focusPause = 150;
    const frameDuration = 280;
    let startedAt = 0;
    loader.classList.add('is-seeding');

    function updateLoader(now) {
      const elapsed = now - startedAt;
      const linear = clamp(elapsed / duration);
      const displayed = Math.min(100, Math.floor(100 * (1 - Math.pow(1 - linear, 2.2))));
      loaderCount.value = String(displayed).padStart(3, '0');
      loader.style.setProperty('--load-progress', displayed / 100);

      if (linear < 1) {
        requestAnimationFrame(updateLoader);
        return;
      }

      window.setTimeout(() => {
        loader.classList.add('is-exiting');
        window.setTimeout(() => {
          body.classList.replace('intro-pending', 'intro-ready');
          body.classList.remove('loader-active');
          loader.remove();
        }, 1160);
      }, 220);
    }

    window.setTimeout(() => {
      loader.classList.add('is-framing');
      window.setTimeout(() => {
        loader.classList.add('is-building');
        startedAt = performance.now();
        requestAnimationFrame(updateLoader);
      }, frameDuration);
    }, gatherDuration + focusPause);
  }

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const ease = value => value * value * (3 - 2 * value);
  const range = (value, start, end) => clamp((value - start) / (end - start));
  const mix = (start, end, amount) => start + (end - start) * amount;
  const setVars = (element, values) => {
    Object.entries(values).forEach(([name, value]) => element.style.setProperty(`--${name}`, value));
  };

  function getFriendAnchors() {
    const mobile = innerWidth <= 700;
    const stageOriginY = innerHeight / 2 + 32;
    const sidePadding = Math.max(24, innerWidth * 0.06);
    const sceneWidth = Math.min(1080, innerWidth);
    const contentWidth = Math.max(240, sceneWidth - sidePadding * 2);

    if (mobile) {
      const gap = 10;
      const cardWidth = (contentWidth - gap) / 2;
      const firstCenterY = 64 + 106 + 100 - stageOriginY;
      return friends.map((card, index) => ({
        x: (index % 2 - 0.5) * (cardWidth + gap),
        y: firstCenterY + Math.floor(index / 2) * 210
      }));
    }

    const gap = 17;
    const cardWidth = (contentWidth - gap * 3) / 4;
    const centerY = 64 + clamp(innerHeight * 0.22, 150, 195) + 121 - stageOriginY;
    return friends.map((card, index) => ({
      x: (index - 1.5) * (cardWidth + gap),
      y: centerY
    }));
  }

  function animateKnowledgeCore(progress) {
    const mobile = innerWidth <= 700;
    const disassemble = ease(range(progress, 0.075, 0.2));
    const techBuild = ease(range(progress, 0.29, 0.42));
    const networkBuild = ease(range(progress, 0.78, 0.91));
    const settle = ease(range(progress, 0, 0.045));
    const tipsSpacing = mobile ? 118 : Math.min(330, innerWidth * 0.3);
    const scanSpacing = mobile ? 50 : 72;
    const anchors = getFriendAnchors();

    setVars(knowledgeCore, {
      'core-alpha': mix(0.3, 1, settle),
      'core-x': `${pointerX * 0.05 * (1 - networkBuild)}px`,
      'core-y': `${pointerY * 0.04 * (1 - networkBuild)}px`,
      'core-scale': mix(mix(0.78, 1, settle), mobile ? 1.22 : 1.62, techBuild) * mix(1, 0.34, networkBuild),
      'core-rotate': `${mix(-10, 24, progress) + scrollVelocity * 420}deg`
    });
    setVars(coreShell, {
      'shell-alpha': 1 - networkBuild
    });
    setVars(stageGrid, {
      'grid-x': `${mix(0, -22, progress)}px`,
      'grid-y': `${mix(0, 14, progress)}px`,
      'grid-scale': mix(1, 1.045, progress)
    });

    coreSlices.forEach((slice, index) => {
      const offset = index - 1;
      const tipX = mobile ? 0 : offset * tipsSpacing;
      const tipY = mobile ? offset * tipsSpacing : 0;
      const spreadX = mix(0, tipX, disassemble);
      const spreadY = mix(offset * 18, tipY, disassemble);
      const scanX = mix(spreadX, 0, techBuild);
      const scanY = mix(spreadY, offset * scanSpacing, techBuild);
      const sliceAlpha = mix(mix(0.34, 0.82, disassemble), 0.38, techBuild) * (1 - networkBuild);

      setVars(slice, {
        'slice-alpha': sliceAlpha,
        'slice-x': `${scanX}px`,
        'slice-y': `${scanY}px`,
        'slice-z': `${mix(offset * 10, 0, techBuild)}px`,
        'slice-rotate': `${mix(offset * 4, 0, techBuild)}deg`,
        'slice-scale-x': mix(0.7, mobile ? 1.9 : 3.8, techBuild)
      });
    });

    coreNodes.forEach((node, index) => {
      const anchor = anchors[index] || { x: 0, y: 0 };
      const x = anchor.x * networkBuild;
      const y = anchor.y * networkBuild;
      const distance = Math.hypot(anchor.x, anchor.y);
      const angle = Math.atan2(anchor.y, anchor.x) * 180 / Math.PI;

      setVars(node, {
        'node-alpha': networkBuild,
        'node-x': `${x}px`,
        'node-y': `${y}px`,
        'node-scale': mix(0.35, 1, networkBuild)
      });
      setVars(coreLinks[index], {
        'link-alpha': networkBuild * 0.72,
        'link-width': `${distance * networkBuild}px`,
        'link-angle': `${angle}deg`
      });
    });
  }

  function updateTargetProgress() {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    targetProgress = clamp(scrollY / maxScroll);
  }

  function scrollToProgress(progress) {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    scrollTo({ top: maxScroll * clamp(progress), behavior: reduced ? 'auto' : 'smooth' });
  }

  function animateHero(progress, entrance) {
    const exit = ease(range(progress, 0.085, 0.18));
    const visible = entrance * (1 - exit);

    setVars(hero, {
      tx: `${pointerX * 0.055 - exit * 34}px`,
      ty: `${mix(20, 0, entrance) - exit * 26 + pointerY * 0.025}px`,
      tz: `${mix(-80, 0, entrance) - exit * 80}px`,
      rx: `${mix(3, 0, entrance)}deg`,
      ry: `${pointerX * 0.006}deg`,
      rz: '0deg',
      scale: mix(0.96, 1, entrance) - exit * 0.035,
      alpha: visible,
      blur: `${(1 - entrance) * 3 + exit * 2}px`,
      'clip-right': `${exit * 18}%`
    });
    hero.style.pointerEvents = visible > 0.78 ? 'auto' : 'none';
  }

  function animateTips(progress) {
    const enter = ease(range(progress, 0.12, 0.21));
    const exit = ease(range(progress, 0.29, 0.365));
    const mobile = innerWidth <= 700;
    const sceneAlpha = enter * (1 - exit);
    const cardSpacing = mobile ? 126 : Math.min(350, innerWidth * 0.31);

    tips.forEach((card, index) => {
      const offset = index - 1;
      const delayed = ease(range(progress, 0.125 + index * 0.018, 0.195 + index * 0.018));
      const originX = mobile ? 0 : -offset * cardSpacing;
      const originY = mobile ? -offset * cardSpacing : 0;
      const exitX = mobile ? 0 : -offset * 46;
      const exitY = mobile ? -offset * 32 : 18;

      setVars(card, {
        tx: `${mix(originX, 0, delayed) + exit * exitX + pointerX * 0.012}px`,
        ty: `${mix(originY, 0, delayed) + exit * exitY + pointerY * 0.01}px`,
        tz: `${mix(-60, 12 - Math.abs(offset) * 4, delayed) - exit * 60}px`,
        rx: '0deg',
        ry: `${mix(offset * 2.5, 0, delayed)}deg`,
        rz: '0deg',
        scale: mix(0.9, 1, delayed) - exit * 0.035,
        alpha: sceneAlpha * delayed,
        blur: `${(1 - delayed) * 2 + exit * 1.5}px`,
        'clip-right': `${mix(58, 0, delayed) + exit * 32}%`
      });
      card.style.pointerEvents = sceneAlpha > 0.82 ? 'auto' : 'none';
      card.style.zIndex = String(10 - Math.abs(offset));
    });
  }

  function updateTechStatus(index, focus) {
    if (index !== activeTechIndex) {
      activeTechIndex = index;
      const name = techCards[index]?.querySelector('h3')?.childNodes[1]?.textContent.trim() || '';
      techCounter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(techCards.length).padStart(2, '0')}`;
      techName.textContent = name;
    }
    const progress = ((focus + 1) / techCards.length) * 100;
    techSequence.style.setProperty('--tech-progress', `${progress}%`);
  }

  function animateTech(progress) {
    const enter = ease(range(progress, 0.315, 0.39));
    const exit = ease(range(progress, 0.78, 0.865));
    const gallery = ease(range(progress, 0.39, 0.455));
    const sceneAlpha = enter * (1 - exit);
    const mobile = innerWidth <= 700;
    const cardWidth = mobile ? innerWidth * 0.8 : Math.min(innerWidth * 0.56, 720);
    const cardGap = mobile ? innerWidth * 0.08 : Math.max(32, innerWidth * 0.055);
    const leftX = (innerWidth - cardWidth) / 2;
    const maxFocus = Math.max(0, techCards.length - 1);
    const focus = ease(range(progress, 0.445, 0.78)) * maxFocus;
    const nearest = gallery < 0.5 ? 0 : clamp(Math.round(focus), 0, techCards.length - 1);
    const cardStep = cardWidth + cardGap;
    const speedTilt = clamp(scrollVelocity * 900, -2.5, 2.5);

    setVars(techTitle, {
      tx: `${mix(0, -92, gallery)}px`,
      ty: `${mix(22, 0, enter) - exit * 26}px`,
      tz: `${mix(-80, 0, enter) - exit * 80}px`,
      rx: '0deg',
      ry: '0deg',
      scale: mix(0.96, 1, enter) - exit * 0.035,
      alpha: sceneAlpha * (1 - gallery),
      blur: `${(1 - enter) * 2 + exit}px`,
      'clip-right': `${mix(42, 0, enter) + gallery * 18}%`
    });

    techCards.forEach((card, index) => {
      const delta = index - focus;
      const distance = Math.abs(delta);
      const cardAlpha = clamp(1 - distance * 0.58);
      const cardScale = 1 - Math.min(distance, 1.4) * 0.09;
      const cardDepth = -Math.min(distance, 1.4) * 110;
      const cardRotateY = clamp(delta * -2.8 + speedTilt * 0.25, -4, 4);
      const active = distance < 0.72 && gallery > 0.72 && exit < 0.7;

      setVars(card, {
        tx: `${leftX + delta * cardStep}px`,
        ty: `${mix(42, 0, gallery) - exit * 24}px`,
        tz: `${cardDepth - exit * 90}px`,
        rx: '0deg',
        ry: `${cardRotateY}deg`,
        rz: '0deg',
        scale: cardScale - exit * 0.035,
        alpha: sceneAlpha * gallery * cardAlpha,
        blur: `${Math.min(distance, 1) * 1.2 + exit}px`,
        'clip-right': `${mix(34, 0, gallery) + exit * 24}%`
      });
      card.dataset.active = String(active);
      card.style.zIndex = String(30 - Math.round(distance * 3));
      card.style.pointerEvents = active ? 'auto' : 'none';
    });

    setVars(techSequence, {
      tx: `${leftX}px`,
      ty: `${mix(14, 0, gallery) + exit * 16}px`,
      tz: '0px',
      alpha: sceneAlpha * gallery,
      'clip-right': '0%'
    });
    updateTechStatus(nearest, Math.min(focus + 1, techCards.length - 1));
  }

  function animateFriends(progress) {
    const enter = ease(range(progress, 0.8, 0.9));
    const footerIn = ease(range(progress, 0.935, 1));

    setVars(friendTitle, {
      tx: '-50%',
      ty: `${mix(20, 0, enter)}px`,
      tz: '0px',
      rx: '0deg',
      ry: '0deg',
      rz: '0deg',
      scale: mix(0.96, 1, enter),
      alpha: enter,
      blur: `${(1 - enter) * 1.5}px`,
      'clip-right': `${mix(42, 0, enter)}%`
    });

    friends.forEach((card, index) => {
      const delayed = ease(range(progress, 0.815 + index * 0.014, 0.875 + index * 0.014));

      setVars(card, {
        tx: `${pointerX * 0.008}px`,
        ty: `${mix(22, 0, delayed) + pointerY * 0.006}px`,
        tz: `${mix(-36, 8, delayed)}px`,
        rx: '0deg',
        ry: '0deg',
        rz: '0deg',
        scale: mix(0.91, 1, delayed),
        alpha: delayed,
        blur: `${(1 - delayed) * 1.8}px`,
        'clip-right': `${mix(54, 0, delayed)}%`
      });
      card.style.pointerEvents = delayed > 0.9 ? 'auto' : 'none';
      card.style.zIndex = String(10 + index);
    });

    setVars(footer, {
      ty: `${mix(18, 0, footerIn)}px`,
      alpha: footerIn,
      'clip-right': '0%'
    });
  }

  function updateChapter(progress) {
    const chapter = progress < 0.15 ? 0 : progress < 0.32 ? 1 : progress < 0.8 ? 2 : 3;
    chapterButtons.forEach((button, index) => button.classList.toggle('is-active', index === chapter));
  }

  function render(timestamp) {
    const damping = reduced ? 1 : 0.072;
    currentProgress += (targetProgress - currentProgress) * damping;
    if (Math.abs(targetProgress - currentProgress) < 0.00008) currentProgress = targetProgress;
    scrollVelocity += ((currentProgress - previousProgress) - scrollVelocity) * 0.2;
    scrollVelocity *= 0.94;
    previousProgress = currentProgress;

    if (!reduced) {
      animateKnowledgeCore(currentProgress);
      animateHero(currentProgress, 1);
      animateTips(currentProgress);
      animateTech(currentProgress);
      animateFriends(currentProgress);
      updateChapter(currentProgress);
      progressBar.style.transform = `scaleY(${Math.max(0.02, currentProgress)})`;
    }
    requestAnimationFrame(render);
  }

  function installImageFallback(image) {
    const replace = () => {
      if (!image.isConnected) return;
      const fallback = document.createElement('b');
      fallback.textContent = image.closest('a')?.textContent.trim().charAt(0) || '?';
      image.replaceWith(fallback);
    };
    image.addEventListener('error', replace, { once: true });
    if (image.complete && image.naturalWidth === 0) replace();
  }

  window.addEventListener('scroll', updateTargetProgress, { passive: true });
  window.addEventListener('resize', updateTargetProgress, { passive: true });
  stage.addEventListener('pointermove', event => {
    pointerX = (event.clientX / innerWidth - 0.5) * 24;
    pointerY = (event.clientY / innerHeight - 0.5) * 16;
  });
  stage.addEventListener('pointerleave', () => {
    pointerX = 0;
    pointerY = 0;
  });
  motionItems.forEach(item => {
    item.addEventListener('pointermove', event => {
      const rect = item.getBoundingClientRect();
      item.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
      item.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`);
    });
  });
  techCards.forEach((card, index) => {
    const accent = card.querySelector('h3 i')?.style.getPropertyValue('--accent');
    if (accent) card.style.setProperty('--accent', accent);
    card.addEventListener('click', event => {
      if (event.target.closest('a')) return;
      scrollToProgress(0.445 + (index / Math.max(1, techCards.length - 1)) * 0.335);
    });
  });
  friends.forEach(card => {
    const accent = card.querySelector('i')?.style.getPropertyValue('--friend');
    if (accent) card.style.setProperty('--friend', accent);
  });
  chapterButtons.forEach(button => {
    button.addEventListener('click', () => scrollToProgress(Number(button.dataset.progress)));
  });
  themeToggle.addEventListener('click', () => {
    const dark = body.classList.toggle('dark-mode');
    themeToggle.textContent = dark ? '☾' : '☼';
  });
  document.querySelectorAll('.tech-grid img').forEach(installImageFallback);

  updateTargetProgress();
  updateChapter(0);
  prepareEntrance();
  requestAnimationFrame(render);
})();
