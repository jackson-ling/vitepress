(() => {
  const body = document.body;
  const stage = document.querySelector('.motion-stage');
  const progressBar = document.querySelector('.progress-rail span');
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
      loaderCount.value = String(displayed);
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

  function updateTargetProgress() {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    targetProgress = clamp(scrollY / maxScroll);
  }

  function scrollToProgress(progress) {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    scrollTo({ top: maxScroll * clamp(progress), behavior: reduced ? 'auto' : 'smooth' });
  }

  function animateHero(progress, entrance) {
    const exit = ease(range(progress, 0.09, 0.2));
    const visible = entrance * (1 - exit);

    setVars(hero, {
      tx: `${pointerX * 0.09 - exit * innerWidth * 0.2}px`,
      ty: `${mix(28, 0, entrance) - exit * 46 + pointerY * 0.04}px`,
      tz: `${mix(-170, 0, entrance) - exit * 620}px`,
      rx: `${mix(7, 0, entrance) - exit * 9 + pointerY * -0.014}deg`,
      ry: `${mix(-8, 0, entrance) - exit * 18 + pointerX * 0.014}deg`,
      rz: `${exit * -2.5}deg`,
      scale: mix(0.88, 1, entrance) - exit * 0.16,
      alpha: visible,
      blur: `${(1 - entrance) * 8 + exit * 7}px`
    });
    hero.style.pointerEvents = visible > 0.78 ? 'auto' : 'none';
  }

  function animateTips(progress) {
    const enter = ease(range(progress, 0.12, 0.23));
    const exit = ease(range(progress, 0.27, 0.37));
    const mobile = innerWidth <= 700;
    const sceneAlpha = enter * (1 - exit);
    const speedTilt = clamp(scrollVelocity * 1500, -7, 7);

    tips.forEach((card, index) => {
      const offset = index - 1;
      const delayed = ease(range(enter, index * 0.08, 0.76 + index * 0.08));
      const stackX = mobile ? offset * -24 : offset * -330;
      const stackY = mobile ? offset * -145 : offset * 20;
      const exitX = mobile ? offset * 40 : (index - 1) * 210;

      setVars(card, {
        tx: `${mix(stackX, 0, delayed) + exit * exitX + pointerX * 0.035}px`,
        ty: `${mix(stackY, 0, delayed) - exit * (70 + Math.abs(offset) * 24) + pointerY * 0.02}px`,
        tz: `${mix(-720 - Math.abs(offset) * 90, 34 - Math.abs(offset) * 18, delayed) - exit * 560}px`,
        rx: `${mix(offset * -10, pointerY * -0.015, delayed) - exit * 12 + speedTilt * 0.25}deg`,
        ry: `${mix(offset * 24, pointerX * 0.015, delayed) + exit * offset * 22 + speedTilt * 0.5}deg`,
        rz: `${exit * offset * 3}deg`,
        scale: mix(0.68, 1, delayed) - exit * 0.12,
        alpha: sceneAlpha * delayed,
        blur: `${(1 - delayed) * 13 + exit * 6}px`
      });
      card.style.pointerEvents = sceneAlpha > 0.8 ? 'auto' : 'none';
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
    const enter = ease(range(progress, 0.31, 0.38));
    const exit = ease(range(progress, 0.79, 0.88));
    const sceneAlpha = enter * (1 - exit);
    const mobile = innerWidth <= 700;
    const gallery = ease(range(progress, 0.395, 0.45));
    const visibleCount = Math.min(mobile ? 1 : 2, techCards.length);
    const cardWidth = innerWidth * (mobile ? 0.8 : 0.4);
    const cardGap = innerWidth * (mobile ? 0.04 : 0.08);
    const deckWidth = cardWidth * visibleCount + cardGap * Math.max(0, visibleCount - 1);
    const centeredLeft = (innerWidth - deckWidth) / 2;
    const leftX = centeredLeft;
    const rightX = centeredLeft + cardWidth + cardGap;
    const maxFocus = Math.max(0, techCards.length - visibleCount);
    const focus = ease(range(progress, 0.45, 0.79)) * maxFocus;
    const nearest = gallery < 0.5 ? 0 : clamp(Math.round(focus), 0, techCards.length - 1);
    const cardStep = cardWidth + cardGap;
    const speedTilt = clamp(scrollVelocity * 1500, -5, 5);
    let carouselAlignmentX = 0;

    if (!mobile && gallery >= 0.999 && techCards.length > 1) {
      let visibleWeight = 0;
      let weightedCenter = 0;

      techCards.forEach((card, index) => {
        const delta = index - focus;
        const arrival = ease(clamp(2 - delta));
        const departure = ease(clamp(1 + delta));
        const weight = Math.min(arrival, departure);
        const centeredWeight = Math.pow(weight, 4);
        const center = leftX + delta * cardStep + cardWidth / 2;
        visibleWeight += centeredWeight;
        weightedCenter += center * centeredWeight;
      });
      carouselAlignmentX = visibleWeight > 0 ? innerWidth / 2 - weightedCenter / visibleWeight : 0;
    }

    setVars(techTitle, {
      tx: `${gallery * -cardStep}px`,
      ty: `${mix(20, 0, enter) - exit * 64}px`,
      tz: `${mix(-180, 0, enter) - exit * 580}px`,
      rx: `${mix(8, 0, enter) - exit * 10}deg`,
      ry: `${exit * -13}deg`,
      scale: mix(0.92, 1, enter) - exit * 0.12,
      alpha: sceneAlpha * (1 - gallery),
      blur: `${(1 - enter) * 7 + exit * 6}px`
    });

    techCards.forEach((card, index) => {
      let cardX;
      let cardY;
      let cardAlpha;
      let cardScale;
      let cardDepth = 0;
      let cardRotateY = 0;
      let cardLayer = 20;

      if (mobile) {
        const mobileFocus = ease(range(progress, 0.4, 0.79)) * maxFocus;
        const delta = index - mobileFocus;
        const arrival = ease(clamp(1 - Math.max(0, delta)));
        cardX = leftX + delta * cardStep + carouselAlignmentX;
        cardY = (1 - arrival) * 180;
        cardAlpha = delta < 0 ? clamp(1 + delta) : 1;
        cardScale = mix(0.92, 1, arrival);
      } else if (gallery < 0.999) {
        if (index === 0) {
          cardX = mix(rightX, leftX, gallery);
          cardY = 0;
          cardAlpha = 1;
          cardScale = 1;
        } else if (index === 1) {
          cardX = mix(rightX + cardStep * 0.42, rightX, gallery);
          cardY = mix(190, 0, gallery);
          cardAlpha = gallery;
          cardScale = mix(0.94, 1, gallery);
        } else {
          cardX = rightX;
          cardY = 190;
          cardAlpha = 0;
          cardScale = 0.94;
        }
      } else {
        const delta = index - focus;
        const arrival = ease(clamp(2 - delta));
        const departure = ease(clamp(1 + delta));
        cardX = leftX + delta * cardStep + carouselAlignmentX;
        cardY = delta > 1 ? mix(180, 0, arrival) : 0;
        cardAlpha = Math.min(arrival, departure);
        cardScale = delta > 1 ? mix(0.94, 1, arrival) : mix(0.965, 1, departure);
        cardDepth = -Math.max(0, Math.abs(delta - 0.5) - 0.5) * 70;
        cardRotateY = clamp((delta - 0.5) * -2.4 + speedTilt * 0.32, -5, 5);
        cardLayer = 30 - Math.round(Math.abs(delta - 0.5) * 2);
      }

      const active = cardAlpha > 0.05 && exit < 0.7;

      setVars(card, {
        tx: `${cardX}px`,
        ty: `${cardY + (1 - enter) * 110 - exit * 40}px`,
        tz: `${cardDepth + exit * -420}px`,
        rx: `${exit * -7}deg`,
        ry: `${cardRotateY - exit * 5}deg`,
        rz: '0deg',
        scale: cardScale,
        alpha: sceneAlpha * cardAlpha,
        blur: `${exit * 4}px`
      });
      card.dataset.active = String(active);
      card.style.zIndex = String(cardLayer);
      card.style.pointerEvents = sceneAlpha > 0.72 && cardAlpha > 0.7 ? 'auto' : 'none';
    });

    setVars(techSequence, {
      tx: `${leftX}px`,
      ty: `${mix(16, 0, enter) + exit * 24}px`,
      tz: `${mix(-80, 0, enter) - exit * 300}px`,
      alpha: sceneAlpha
    });
    updateTechStatus(nearest, Math.min(focus + 1, techCards.length - 1));
  }

  function animateFriends(progress) {
    const enter = ease(range(progress, 0.8, 0.91));
    const footerIn = ease(range(progress, 0.94, 1));
    const mobile = innerWidth <= 700;
    const speedTilt = clamp(scrollVelocity * 1400, -7, 7);

    setVars(friendTitle, {
      tx: '-50%',
      ty: `${mix(26, 0, enter)}px`,
      tz: `${mix(-200, 0, enter)}px`,
      rx: `${mix(9, 0, enter)}deg`,
      scale: mix(0.9, 1, enter),
      alpha: enter,
      blur: `${(1 - enter) * 8}px`
    });

    friends.forEach((card, index) => {
      const column = mobile ? index % 2 : index;
      const row = mobile ? Math.floor(index / 2) : 0;
      const center = mobile ? 0.5 : 1.5;
      const stackX = (center - column) * (mobile ? 170 : 280);
      const stackY = mobile ? (0.5 - row) * 198 : (index - 1.5) * 34;
      const delayed = ease(range(enter, index * 0.055, 0.72 + index * 0.055));

      setVars(card, {
        tx: `${mix(stackX, 0, delayed) + pointerX * 0.022}px`,
        ty: `${mix(stackY, 0, delayed) + pointerY * 0.016}px`,
        tz: `${mix(-760 - index * 40, 24, delayed)}px`,
        rx: `${mix((index - 1.5) * -12, pointerY * -0.014, delayed) + speedTilt * 0.22}deg`,
        ry: `${mix((index - 1.5) * 19, pointerX * 0.014, delayed) + speedTilt * 0.42}deg`,
        rz: `${mix((index - 1.5) * -2, 0, delayed)}deg`,
        scale: mix(0.68, 1, delayed),
        alpha: delayed,
        blur: `${(1 - delayed) * 13}px`
      });
      card.style.pointerEvents = delayed > 0.82 ? 'auto' : 'none';
      card.style.zIndex = String(10 + index);
    });

    setVars(footer, {
      ty: `${mix(18, 0, footerIn)}px`,
      alpha: footerIn
    });
  }

  function updateChapter(progress) {
    const chapter = progress < 0.16 ? 0 : progress < 0.34 ? 1 : progress < 0.84 ? 2 : 3;
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
      scrollToProgress(0.39 + (index / Math.max(1, techCards.length - 1)) * 0.4);
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
