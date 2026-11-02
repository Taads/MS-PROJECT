document.addEventListener('DOMContentLoaded', () => {
  // ========================
  // Intersection Observer (scroll animations)
  // ========================

  // Marca elementos automaticamente com efeitos de entrada e aplica "stagger"
  const tagAnimationTargets = () => {
    // Títulos de seção
    document.querySelectorAll('.section .section-title').forEach((el) => {
      el.setAttribute('data-animate', 'down');
    });

    // Grid "Quem Somos!"
    const about = document.querySelector('.about-grid');
    if (about) {
      const parts = about.querySelectorAll('.about-text, .about-image');
      parts.forEach((el, idx) => {
        el.setAttribute('data-animate', idx === 0 ? 'right' : 'left');
        el.style.setProperty('--stagger', `${0.08 * (idx + 1)}s`);
      });
    }

    // Cards de serviços
    document.querySelectorAll('#servicos .service-card').forEach((el, idx) => {
      el.setAttribute('data-animate', 'up');
      el.style.setProperty('--stagger', `${0.06 * (idx + 1)}s`);
    });

    // Cards e carrossel de insights
    document.querySelectorAll('#insights .insight-card').forEach((el, idx) => {
      el.setAttribute('data-animate', 'up');
      el.style.setProperty('--stagger', `${0.06 * (idx + 1)}s`);
    });

    // Logos de clientes
    document.querySelectorAll('.cliente-logo').forEach((el, idx) => {
      el.setAttribute('data-animate', 'zoom');
      el.style.setProperty('--stagger', `${0.035 * (idx + 1)}s`);
    });

    // Blocos do contato
    document.querySelectorAll('#contato .contact-info-card, #contato .contact-form').forEach((el, idx) => {
      el.setAttribute('data-animate', idx === 0 ? 'right' : 'left');
      el.style.setProperty('--stagger', `${0.08 * (idx + 1)}s`);
    });

    // Rodapé (colunas)
    document.querySelectorAll('.footer-brand-section, .footer-nav-section, .footer-contact-section, .footer-legal-section')
      .forEach((el, idx) => {
        el.setAttribute('data-animate', 'up');
        el.style.setProperty('--stagger', `${0.06 * (idx + 1)}s`);
      });
  };

  tagAnimationTargets();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    // 5%: seções muito altas (página do curso no celular) nunca chegam a 20% visível
    { threshold: 0.05, rootMargin: '0px 0px -50px 0px' }
  );

  document
    .querySelectorAll('.section, .service-card, .testimonial, .insight-card, .logo-card, .cliente-logo')
    .forEach((element) => observer.observe(element));

  // Novo observer para [data-animate]
  const animateObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          animateObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -10%' }
  );

  document.querySelectorAll('[data-animate]').forEach((el) => animateObserver.observe(el));
});
