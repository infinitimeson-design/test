/*
  nav.js
  Persistent top navbar — no hamburger/dropdown. Tabs sit inline; a burgundy
  "blob" + underline pill slide beneath whichever tab is active (idea only
  from a CodePen goo-nav reference, no GSAP, one accent color, plain CSS
  transitions driven by this vanilla JS). Two ways a tab becomes active:
  the user taps it (real anchor scroll to that section), or scroll-spy
  detects which section is currently in view.
*/

export function initNav() {
  const tabsWrap = document.getElementById('navTabs');
  const blob = document.getElementById('navBlob');
  const pill = document.getElementById('navPill');
  if (!tabsWrap || !blob || !pill) return;

  const links = Array.from(tabsWrap.querySelectorAll('a[data-target]'));
  if (links.length === 0) return;

  function moveIndicatorTo(link) {
    const tabsRect = tabsWrap.getBoundingClientRect();
    const r = link.getBoundingClientRect();
    const left = r.left - tabsRect.left;
    pill.style.width = `${r.width * 0.5}px`;
    pill.style.transform = `translateX(${left + r.width * 0.25}px)`;
    blob.style.width = `${r.width}px`;
    blob.style.transform = `translateX(${left}px)`;
  }

  function setActive(targetId) {
    let matched = null;
    links.forEach((a) => {
      const isMatch = a.dataset.target === targetId;
      a.classList.toggle('is-active', isMatch);
      if (isMatch) matched = a;
    });
    if (matched) moveIndicatorTo(matched);
  }

  links.forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(a.dataset.target);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActive(a.dataset.target);
    });
  });

  // scroll-spy: whichever tracked section is most centered in view becomes active
  const spyTargets = links
    .map((a) => document.getElementById(a.dataset.target))
    .filter(Boolean);

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { threshold: 0.5 }
  );
  spyTargets.forEach((el) => spy.observe(el));

  window.addEventListener(
    'resize',
    () => {
      const current = links.find((a) => a.classList.contains('is-active'));
      if (current) moveIndicatorTo(current);
    },
    { passive: true }
  );

  // set initial position once layout has settled
  requestAnimationFrame(() => setActive(links[0].dataset.target));
}
