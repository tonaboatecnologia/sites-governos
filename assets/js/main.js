document.addEventListener('DOMContentLoaded', function() {
    // =========== SLIDER BANNER ===========
    const slider = {
      init: function() {
        this.slides = document.querySelectorAll('.slide');
        this.indicators = document.querySelectorAll('.slide-indicator');
        this.prevBtn = document.querySelector('.slide-prev');
        this.nextBtn = document.querySelector('.slide-next');
        this.currentIndex = 0;
        this.interval = null;
        this.duration = 5000; // 5 segundos
        
        this.setupEventListeners();
        this.showSlide(this.currentIndex);
        this.startAutoSlide();
      },
      
      setupEventListeners: function() {
        // Navegação por indicadores
        this.indicators.forEach((indicator, index) => {
          indicator.addEventListener('click', () => {
            this.resetAutoSlide();
            this.showSlide(index);
          });
        });
        
        // Botões de navegação
        if (this.prevBtn && this.nextBtn) {
          this.prevBtn.addEventListener('click', () => {
            this.resetAutoSlide();
            this.prevSlide();
          });
          
          this.nextBtn.addEventListener('click', () => {
            this.resetAutoSlide();
            this.nextSlide();
          });
        }
        
        // Pausar slider quando o mouse estiver sobre ele
        const sliderContainer = document.querySelector('.hero-slider');
        if (sliderContainer) {
          sliderContainer.addEventListener('mouseenter', () => {
            this.pauseAutoSlide();
          });
          
          sliderContainer.addEventListener('mouseleave', () => {
            this.startAutoSlide();
          });
        }
        
        // Pausar slider quando estiver fora da viewport (Intersection Observer)
        if ('IntersectionObserver' in window) {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                this.startAutoSlide();
              } else {
                this.pauseAutoSlide();
              }
            });
          }, { threshold: 0.5 });
          
          if (sliderContainer) {
            observer.observe(sliderContainer);
          }
        }
      },
      
      showSlide: function(index) {
        // Esconder todos os slides
        this.slides.forEach(slide => {
          slide.classList.remove('active');
          slide.style.display = 'none';
        });
        
        // Remover classe active de todos os indicadores
        this.indicators.forEach(indicator => {
          indicator.classList.remove('active');
        });
        
        // Mostrar slide atual
        this.currentIndex = (index + this.slides.length) % this.slides.length;
        const currentSlide = this.slides[this.currentIndex];
        currentSlide.style.display = 'block';
        
        // Forçar reflow para ativar a transição
        void currentSlide.offsetWidth;
        
        currentSlide.classList.add('active');
        this.indicators[this.currentIndex].classList.add('active');
        
        // Adicionar animação de fade-in
        currentSlide.classList.add('fade-in');
        setTimeout(() => {
          currentSlide.classList.remove('fade-in');
        }, 500);
      },
      
      nextSlide: function() {
        this.showSlide(this.currentIndex + 1);
      },
      
      prevSlide: function() {
        this.showSlide(this.currentIndex - 1);
      },
      
      startAutoSlide: function() {
        if (this.interval) {
          clearInterval(this.interval);
        }
        this.interval = setInterval(() => {
          this.nextSlide();
        }, this.duration);
      },
      
      pauseAutoSlide: function() {
        if (this.interval) {
          clearInterval(this.interval);
          this.interval = null;
        }
      },
      
      resetAutoSlide: function() {
        this.pauseAutoSlide();
        this.startAutoSlide();
      }
    };
    
    // =========== DARK MODE ===========
    const darkMode = {
      init: function() {
        this.toggle = document.getElementById('theme-toggle');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.setupEventListeners();
        this.applyTheme();
      },
      
      setupEventListeners: function() {
        if (this.toggle) {
          this.toggle.addEventListener('change', () => {
            this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', this.currentTheme);
            this.applyTheme();
          });
        }
      },
      
      applyTheme: function() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        if (this.toggle) {
          this.toggle.checked = this.currentTheme === 'dark';
        }
        
        // Atualizar meta tag theme-color
        const themeColor = this.currentTheme === 'dark' ? '#121212' : '#ffffff';
        document.querySelector('meta[name="theme-color"]').setAttribute('content', themeColor);
      }
    };
    
    // =========== MODAIS ===========
    const modals = {
      init: function() {
        this.modalTriggers = document.querySelectorAll('[data-modal-target]');
        this.modalCloseButtons = document.querySelectorAll('[data-close-modal]');
        this.modals = document.querySelectorAll('.modal');
        
        this.setupEventListeners();
      },
      
      setupEventListeners: function() {
        // Abrir modal
        this.modalTriggers.forEach(trigger => {
          trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = trigger.getAttribute('data-modal-target');
            this.openModal(modalId);
          });
        });
        
        // Fechar modal
        this.modalCloseButtons.forEach(button => {
          button.addEventListener('click', () => {
            this.closeCurrentModal();
          });
        });
        
        // Fechar ao clicar fora do modal
        this.modals.forEach(modal => {
          modal.addEventListener('click', (e) => {
            if (e.target === modal) {
              this.closeCurrentModal();
            }
          });
        });
        
        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            this.closeCurrentModal();
          }
        });
      },
      
      openModal: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
          document.body.style.overflow = 'hidden';
          modal.classList.add('active');
          modal.setAttribute('aria-hidden', 'false');
          
          // Focar no primeiro elemento interativo
          const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
          if (focusable) {
            focusable.focus();
          }
        }
      },
      
      closeCurrentModal: function() {
        const currentModal = document.querySelector('.modal.active');
        if (currentModal) {
          document.body.style.overflow = 'auto';
          currentModal.classList.remove('active');
          currentModal.setAttribute('aria-hidden', 'true');
        }
      }
    };
    
    // =========== MENU MOBILE ===========
    const mobileMenu = {
      init: function() {
        this.menuButton = document.querySelector('.navbar-toggler');
        this.menu = document.querySelector('.navbar-collapse');
        
        if (this.menuButton && this.menu) {
          this.setupEventListeners();
        }
      },
      
      setupEventListeners: function() {
        this.menuButton.addEventListener('click', () => {
          const isExpanded = this.menuButton.getAttribute('aria-expanded') === 'true';
          this.toggleMenu(!isExpanded);
        });
        
        // Fechar menu ao clicar em um link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
          link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
              this.toggleMenu(false);
            }
          });
        });
      },
      
      toggleMenu: function(show) {
        this.menuButton.setAttribute('aria-expanded', show);
        if (show) {
          this.menu.classList.add('show');
          document.body.style.overflow = 'hidden';
        } else {
          this.menu.classList.remove('show');
          document.body.style.overflow = 'auto';
        }
      }
    };
    
    // =========== SCROLL SUAVE ===========
    const smoothScroll = {
      init: function() {
        this.links = document.querySelectorAll('a[href^="#"]');
        
        this.setupEventListeners();
      },
      
      setupEventListeners: function() {
        this.links.forEach(link => {
          link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId !== '#') {
              e.preventDefault();
              this.scrollToTarget(targetId);
            }
          });
        });
      },
      
      scrollToTarget: function(targetId) {
        const target = document.querySelector(targetId);
        if (target) {
          const headerHeight = document.querySelector('.navbar').offsetHeight;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    };
    
    // =========== BOTÃO VOLTAR AO TOPO ===========
    const backToTop = {
      init: function() {
        this.button = document.querySelector('.back-to-top');
        
        if (this.button) {
          this.setupEventListeners();
          this.checkScrollPosition();
        }
      },
      
      setupEventListeners: function() {
        window.addEventListener('scroll', () => {
          this.checkScrollPosition();
        });
        
        this.button.addEventListener('click', (e) => {
          e.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        });
      },
      
      checkScrollPosition: function() {
        if (window.pageYOffset > 300) {
          this.button.classList.add('show');
        } else {
          this.button.classList.remove('show');
        }
      }
    };
    
    // =========== INICIALIZAR TODOS OS COMPONENTES ===========
    slider.init();
    darkMode.init();
    modals.init();
    mobileMenu.init();
    smoothScroll.init();
    backToTop.init();
    
    // Verificar preferência de sistema para dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      localStorage.setItem('theme', 'dark');
      darkMode.applyTheme();
    }
    
    // Observar mudanças no tema do sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      const newTheme = e.matches ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      darkMode.currentTheme = newTheme;
      darkMode.applyTheme();
    });

    // Menu Mobile Interativo
class MobileMenu {
    constructor() {
      this.menuButton = document.querySelector('.navbar-toggler');
      this.menu = document.querySelector('.navbar-collapse');
      this.menuItems = document.querySelectorAll('.nav-link');
      this.isOpen = false;
      
      this.init();
    }
    
    init() {
      // Verificar se os elementos existem
      if (!this.menuButton || !this.menu) return;
      
      // Adicionar eventos
      this.menuButton.addEventListener('click', () => this.toggleMenu());
      
      // Fechar menu ao clicar nos itens (mobile)
      this.menuItems.forEach(item => {
        item.addEventListener('click', () => {
          if (window.innerWidth < 992) { // Breakpoint do Bootstrap
            this.closeMenu();
          }
        });
      });
      
      // Fechar menu ao redimensionar para desktop
      window.addEventListener('resize', () => {
        if (window.innerWidth >= 992 && this.isOpen) {
          this.closeMenu();
        }
      });
    }
    
    toggleMenu() {
      if (this.isOpen) {
        this.closeMenu();
      } else {
        this.openMenu();
      }
    }
    
    openMenu() {
      this.menuButton.setAttribute('aria-expanded', 'true');
      this.menu.classList.add('show');
      document.body.style.overflow = 'hidden';
      this.isOpen = true;
      
      // Adicionar animação
      this.menu.style.animation = 'slideIn 0.3s ease-out forwards';
    }
    
    closeMenu() {
      this.menuButton.setAttribute('aria-expanded', 'false');
      this.menu.style.animation = 'slideOut 0.3s ease-out forwards';
      
      // Esperar a animação terminar antes de remover a classe
      setTimeout(() => {
        this.menu.classList.remove('show');
        document.body.style.overflow = 'auto';
      }, 300);
      
      this.isOpen = false;
    }
  }
  
  // Inicializar quando o DOM estiver pronto
  document.addEventListener('DOMContentLoaded', () => {
    new MobileMenu();
  });
  document.addEventListener('DOMContentLoaded', function() {
    // Navbar interativa
    const navbar = document.querySelector('.navbar');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const menuOverlay = document.createElement('div');
    menuOverlay.className = 'menu-overlay';
    document.body.appendChild(menuOverlay);

    // Adicionar ícone de fechar dinamicamente
    const closeIcon = document.createElement('i');
    closeIcon.className = 'fas fa-times close-icon d-none';
    navbarToggler.appendChild(closeIcon);

    // Alternar menu mobile
    navbarToggler.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        
        if (isExpanded) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Fechar menu ao clicar no overlay
    menuOverlay.addEventListener('click', closeMobileMenu);

    // Fechar menu ao redimensionar para desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 992) {
            closeMobileMenu();
        }
    });

    // Função para abrir menu mobile
    function openMobileMenu() {
        navbarCollapse.classList.add('show');
        menuOverlay.classList.add('show');
        navbarToggler.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        
        // Mostrar ícone de fechar
        document.querySelector('.navbar-toggler-icon').classList.add('d-none');
        document.querySelector('.close-icon').classList.remove('d-none');
    }

    // Função para fechar menu mobile
    function closeMobileMenu() {
        navbarCollapse.classList.remove('show');
        menuOverlay.classList.remove('show');
        navbarToggler.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = 'auto';
        
        // Mostrar ícone de hamburger
        document.querySelector('.navbar-toggler-icon').classList.remove('d-none');
        document.querySelector('.close-icon').classList.add('d-none');
    }

    // Adicionar classe quando scrollar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });

    // Fechar menu ao clicar em um link (mobile)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 992) {
                closeMobileMenu();
            }
        });
    });
});
  });