// src/scripts/scroll-reveal.js
// Fallback para navegadores sin animation-timeline: view()
document.addEventListener('DOMContentLoaded', () => {
  const supportsScrollTimeline = CSS.supports('animation-timeline', 'view()');

  if (supportsScrollTimeline) {
    document.querySelectorAll('.scroll-reveal').forEach(el => {
      el.classList.add('scroll-reveal-native');
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el);
  });
});
