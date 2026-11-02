document.addEventListener('DOMContentLoaded', () => {
  // ========================
  // Clients carousel (NOSSOS CLIENTES)
  // ========================
  const clientesCarousel = document.querySelector('.clientes-carousel');
  const clientesTrack = document.querySelector('.clientes-track');
  const clientesLogos = document.querySelectorAll('.cliente-logo');

  if (clientesCarousel && clientesTrack && clientesLogos.length > 0) {
    let isPaused = false;
    let animationId;
    let currentPosition = 0;
    // largura do logo + gap, medida na tela (muda entre desktop e celular)
    const getLogoWidth = () => clientesLogos.length > 1
      ? clientesLogos[1].offsetLeft - clientesLogos[0].offsetLeft
      : 180 + 30;
    const speed = 0.8; // pixels por frame
    const totalLogos = clientesLogos.length;

    // Duplica os logos para criar efeito infinito
    function duplicateLogos() {
      const fragment = document.createDocumentFragment();
      clientesLogos.forEach(logo => {
        const clone = logo.cloneNode(true);
        fragment.appendChild(clone);
      });
      clientesTrack.appendChild(fragment);
    }

    function animate() {
      if (!isPaused) {
        currentPosition -= speed;

        // Quando completar o scroll de todos os logos originais
        const resetPoint = -(getLogoWidth() * totalLogos);
        
        if (currentPosition <= resetPoint) {
          // Reseta a posição para 0 (volta ao início sem salto visível)
          currentPosition = 0;
        }

        clientesTrack.style.transform = `translateX(${currentPosition}px)`;
      }
      animationId = requestAnimationFrame(animate);
    }

    // Pausa ao passar o mouse
    clientesCarousel.addEventListener('mouseenter', () => {
      isPaused = true;
    });
    
    clientesCarousel.addEventListener('mouseleave', () => {
      isPaused = false;
    });

    // Inicializa
    duplicateLogos();
    animate();

    // Esconde os botões de navegação (se existirem)
    const clientesPrev = document.querySelector('.clientes-btn.prev');
    const clientesNext = document.querySelector('.clientes-btn.next');
    if (clientesPrev) clientesPrev.style.display = 'none';
    if (clientesNext) clientesNext.style.display = 'none';
  }
});