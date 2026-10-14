import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let safetyNetInitialized = false;

/**
 * Failsafe central para elementos animados com GSAP / ScrollTrigger.
 * Garante que nenhum elemento com [data-reveal] fique invisível (opacity 0)
 * caso o ScrollTrigger não dispare ou atrase.
 */
export function revealVisibleElements() {
  const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');
  const viewportHeight = window.innerHeight;

  elements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    // Elementos que estão na viewport ou já foram passados (acima da viewport)
    const isInOrAboveViewport = rect.top <= viewportHeight + 50;

    if (isInOrAboveViewport) {
      const cs = window.getComputedStyle(el);
      const isHidden = cs.opacity === '0' || cs.visibility === 'hidden' || el.style.opacity === '0';

      if (isHidden) {
        gsap.set(el, {
          opacity: 1,
          visibility: 'visible',
          clearProps: 'opacity,transform,visibility',
        });

        // Se estiver dentro de um wrapper de máscara (overflow: hidden), libera o overflow
        const parent = el.parentElement;
        if (parent && (parent.classList.contains('line-wrapper') || parent.style.overflow === 'hidden')) {
          parent.style.overflow = 'visible';
        }
      }
    }
  });
}

/**
 * Failsafe completo: força todos os elementos com data-reveal
 * para o estado visível (autoAlpha 1, clearProps).
 */
export function revealAllElements() {
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.set(el, {
      opacity: 1,
      visibility: 'visible',
      clearProps: 'opacity,transform,visibility',
    });
    const parent = el.parentElement;
    if (parent && (parent.classList.contains('line-wrapper') || parent.style.overflow === 'hidden')) {
      parent.style.overflow = 'visible';
    }
  });
}

/**
 * Inicializa a rede de segurança central de revelação e sincronização do ScrollTrigger.
 */
export function initRevealSafetyNet() {
  if (typeof window === 'undefined') return;
  if (safetyNetInitialized) return;
  safetyNetInitialized = true;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // d) Se prefers-reduced-motion estiver ativo, nenhum estado escondido permanece
  if (reducedMotion) {
    const clearAll = () => {
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.set(el, { opacity: 1, visibility: 'visible', clearProps: 'all' });
        if (el.parentElement?.classList.contains('line-wrapper')) {
          el.parentElement.style.overflow = 'visible';
        }
      });
    };
    clearAll();
    window.addEventListener('DOMContentLoaded', clearAll);
    window.addEventListener('load', clearAll);
    return;
  }

  // b) ScrollTrigger.refresh() em window load, document.fonts.ready e ResizeObserver no body
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
    revealVisibleElements();
  });

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
      revealVisibleElements();
    });
  }

  // ResizeObserver com debounce de 150ms na altura do documento (cobre carregamento de imagens lazy)
  let resizeTimer: NodeJS.Timeout | null = null;
  const ro = new ResizeObserver(() => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
      revealVisibleElements();
    }, 150);
  });

  if (document.body) {
    ro.observe(document.body);
  }

  // c) Failsafe: 3.5s após montagem, e de novo ao fim de cada rolagem
  setTimeout(() => {
    revealVisibleElements();
  }, 3500);

  // Ao fim de cada rolagem (scrollend ou debounce de 100ms no scroll)
  let scrollDebounceTimer: NodeJS.Timeout | null = null;
  const handleScrollEnd = () => {
    if (scrollDebounceTimer) clearTimeout(scrollDebounceTimer);
    scrollDebounceTimer = setTimeout(() => {
      revealVisibleElements();
      // Se rolou até o fim da página (ou próximo), garante que nada fique com opacity 0
      const isAtBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 350;
      if (isAtBottom) {
        revealAllElements();
      }
    }, 100);
  };

  window.addEventListener('scroll', handleScrollEnd, { passive: true });
  if ('onscrollend' in window) {
    window.addEventListener('scrollend', () => revealVisibleElements(), { passive: true });
  }

  // Observer automático para marcar novos elementos animados e garantir que nada escape
  const autoMarkObserver = new MutationObserver(() => {
    document.querySelectorAll<HTMLElement>('.line-wrapper > span, .line-wrapper > h2, .line-wrapper > h3').forEach((el) => {
      if (!el.hasAttribute('data-reveal')) {
        el.setAttribute('data-reveal', 'true');
      }
    });
  });

  autoMarkObserver.observe(document.body, { childList: true, subtree: true });
}
