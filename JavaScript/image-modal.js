document.addEventListener('DOMContentLoaded', () => {
  // ========================
  // Ampliar imagens ao clicar/tocar (insights e serviços)
  // ========================
  const selector = '.insight-carousel-item img, .service-card-image img';
  const images = Array.from(document.querySelectorAll(selector));
  if (images.length === 0) return;

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.hidden = true;
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Imagem ampliada');
  lightbox.innerHTML = `
    <button type="button" class="lightbox-btn lightbox-close" aria-label="Fechar"><span class="material-icons">close</span></button>
    <button type="button" class="lightbox-btn lightbox-prev" aria-label="Imagem anterior"><span class="material-icons">chevron_left</span></button>
    <button type="button" class="lightbox-btn lightbox-next" aria-label="Próxima imagem"><span class="material-icons">chevron_right</span></button>
    <div class="lightbox-stage"><img class="lightbox-img" alt=""></div>
    <p class="lightbox-hint"></p>`;
  document.body.appendChild(lightbox);

  const stage = lightbox.querySelector('.lightbox-stage');
  const bigImg = lightbox.querySelector('.lightbox-img');
  const hint = lightbox.querySelector('.lightbox-hint');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let group = [];
  let index = 0;
  let opener = null;

  // Imagens do mesmo carrossel/grade navegam entre si
  const groupKey = (img) => img.closest('[data-carousel]') || img.closest('.services-grid') || img;

  function setZoom(zoomed) {
    stage.classList.toggle('zoomed', zoomed);
    hint.textContent = zoomed
      ? 'Arraste para ver · toque para reduzir'
      : 'Toque na imagem para ampliar';
    if (zoomed) {
      stage.scrollLeft = (stage.scrollWidth - stage.clientWidth) / 2;
    } else {
      stage.scrollLeft = 0;
      stage.scrollTop = 0;
    }
  }

  function show() {
    const img = group[index];
    bigImg.src = img.currentSrc || img.src;
    bigImg.alt = img.alt || '';
    const many = group.length > 1;
    prevBtn.hidden = !many;
    nextBtn.hidden = !many;
    setZoom(false);
  }

  function open(img) {
    opener = img;
    group = images.filter((i) => groupKey(i) === groupKey(img));
    index = group.indexOf(img);
    show();
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    if (opener) opener.focus({ preventScroll: true });
  }

  function step(delta) {
    if (group.length < 2) return;
    index = (index + delta + group.length) % group.length;
    show();
  }

  images.forEach((img) => {
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', 'Ampliar imagem: ' + (img.alt || ''));
    img.addEventListener('click', () => open(img));
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(img);
      }
    });
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => step(-1));
  nextBtn.addEventListener('click', () => step(1));
  bigImg.addEventListener('click', () => setZoom(!stage.classList.contains('zoomed')));

  // Clicar no fundo escuro fecha
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === stage) close();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
  });

  // Deslizar para o lado troca de imagem (quando não está ampliada)
  let touchX = 0;
  stage.addEventListener('touchstart', (e) => {
    touchX = e.changedTouches[0].screenX;
  }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    if (stage.classList.contains('zoomed')) return;
    const diff = touchX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 60) step(diff > 0 ? 1 : -1);
  }, { passive: true });
});
