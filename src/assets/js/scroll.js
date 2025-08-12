const inner = document.getElementById('tv-timeline-content');

inner.addEventListener('wheel', (e) => {
  // Ajusta esta posición según cuándo quieres permitir scroll interno
  const limit = 500;

  if (window.scrollY < limit) {
    // Bloquea el scroll interno
    e.preventDefault();
    // Opcional: hacer que el body se siga desplazando en vez
    window.scrollBy({
      top: e.deltaY,
      behavior: 'auto'
    });
  }
}, { passive: false });
