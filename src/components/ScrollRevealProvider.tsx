'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollRevealProvider() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Apple-style Pre-Trigger Scroll Reveal (400px lookahead for zero stutter)
    const observerCallback: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight + 300) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    };

    const revealObserver = new IntersectionObserver(observerCallback, {
      threshold: 0,
      rootMargin: '0px 0px 400px 0px',
    });

    const observeElements = () => {
      // If on mobile screen, instantly reveal everything for 100% crisp visibility with zero lag
      if (typeof window !== 'undefined' && window.innerWidth <= 768) {
        document.querySelectorAll('.reveal, .reveal-l, .reveal-r, .reveal-s').forEach((el) => {
          el.classList.add('in');
        });
        return;
      }

      const elements = document.querySelectorAll(
        '.reveal:not(.in), .reveal-l:not(.in), .reveal-r:not(.in), .reveal-s:not(.in)'
      );
      elements.forEach((el) => revealObserver.observe(el));
    };

    // Initial observation
    observeElements();

    // 2. Debounced MutationObserver for dynamic category & block changes
    let debounceTimer: NodeJS.Timeout | null = null;
    const mutationObserver = new MutationObserver(() => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        observeElements();
      }, 50);
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // 3. Apple-style Rotating Words Animation (Smooth 2.8s cadence)
    let rotInterval: NodeJS.Timeout | null = null;
    const rotContainer = document.getElementById('rot-container');
    if (rotContainer) {
      const words = rotContainer.querySelectorAll<HTMLElement>('.rot-word');
      if (words.length > 1) {
        let currentIndex = 0;
        rotInterval = setInterval(() => {
          words[currentIndex].classList.remove('on');
          words[currentIndex].classList.add('out');

          currentIndex = (currentIndex + 1) % words.length;

          words[currentIndex].classList.remove('out');
          words[currentIndex].classList.add('on');

          setTimeout(() => {
            const outWords = rotContainer.querySelectorAll('.rot-word.out');
            outWords.forEach((w) => w.classList.remove('out'));
          }, 650);
        }, 2800);
      }
    }

    // 4. Numbers Counter Animation on Scroll (Smooth easing)
    const numObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const target = Number(el.dataset.target || 0);
          const prefix = el.dataset.prefix || '';
          const suffix = el.dataset.suffix || '';
          const duration = 1600;
          const start = performance.now();

          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            // Apple fluid cubic deceleration: 1 - Math.pow(1 - progress, 3)
            const eased = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(target * eased);

            let display: string;
            if (currentVal >= 1000000) {
              display = (currentVal / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
            } else if (currentVal >= 1000) {
              display = (currentVal / 1000).toFixed(currentVal % 1000 === 0 ? 0 : 1) + 'K';
            } else {
              display = currentVal.toLocaleString();
            }

            el.textContent = `${prefix}${display}${suffix}`;
            if (progress < 1) {
              requestAnimationFrame(tick);
            }
          };

          requestAnimationFrame(tick);
          obs.unobserve(el);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px 50px 0px' }
    );

    document.querySelectorAll<HTMLElement>('[data-target]').forEach((el) => numObserver.observe(el));

    // Cleanup
    return () => {
      revealObserver.disconnect();
      mutationObserver.disconnect();
      numObserver.disconnect();
      if (rotInterval) clearInterval(rotInterval);
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [pathname]);

  return null;
}
