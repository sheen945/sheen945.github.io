(() => {
  const script = document.currentScript;
  const title = script?.dataset.title;
  const icon = script?.dataset.icon;
  if (!title || !icon) return;

  window.__deckBrandingCleanup?.();
  const apply = () => {
    if (document.title !== title) document.title = title;
    let links = [...document.head.querySelectorAll('link[rel~="icon"]')];
    if (!links.length) {
      const link = document.createElement('link');
      link.rel = 'icon';
      document.head.append(link);
      links = [link];
    }
    for (const link of links) {
      if (link.getAttribute('href') !== icon) link.setAttribute('href', icon);
      if (link.type !== 'image/svg+xml') link.type = 'image/svg+xml';
    }
  };
  const observer = new MutationObserver(apply);
  const observe = () => {
    apply();
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['href', 'rel', 'type'],
    });
  };
  const pause = () => observer.disconnect();
  const resume = event => { if (event.persisted) observe(); };
  window.__deckBrandingCleanup = () => {
    pause();
    window.removeEventListener('pagehide', pause);
    window.removeEventListener('pageshow', resume);
  };
  window.addEventListener('pagehide', pause);
  window.addEventListener('pageshow', resume);
  observe();
})();
