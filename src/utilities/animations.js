const selectors = [
  ".hero-grid > div:first-child > .eyebrow",
  ".hero-grid > div:first-child > h1",
  ".hero-grid > div:first-child > .lead",
  ".hero-grid > div:first-child > .actions",
  ".hero-grid > .portrait",
  ".page-hero .eyebrow",
  ".page-hero h1",
  ".page-hero .lead",
  ".section-heading",
  ".filter-bar",
  ".card",
  ".stat",
  ".timeline-item",
].join(",");

export default class Animations {
  #animatedElements = new WeakSet();
  #delayIndex = 0;
  #intersectionObserver;
  #mutationObserver;

  constructor() {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      return;
    }

    this.#intersectionObserver = new IntersectionObserver(
      (entries) => this.#revealVisibleElements(entries),
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    this.#registerElements(document);
    this.#observeNewElements();

    window.addEventListener("pagehide", () => this.#disconnect(), {
      once: true,
    });
  }

  #registerElements(root) {
    const elements = [];

    if (root instanceof Element && root.matches(selectors)) {
      elements.push(root);
    }

    if (root.querySelectorAll) {
      elements.push(...root.querySelectorAll(selectors));
    }

    elements.forEach((element) => {
      if (this.#animatedElements.has(element)) {
        return;
      }

      this.#animatedElements.add(element);
      element.classList.add("reveal-item");
      element.style.setProperty(
        "--reveal-delay",
        `${(this.#delayIndex % 4) * 70}ms`,
      );
      this.#delayIndex += 1;
      this.#intersectionObserver.observe(element);
    });
  }

  #revealVisibleElements(entries) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      this.#intersectionObserver.unobserve(entry.target);
    });
  }

  #observeNewElements() {
    const main = document.querySelector("main");

    if (!main) {
      return;
    }

    this.#mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) {
            this.#registerElements(node);
          }
        });
      });
    });

    this.#mutationObserver.observe(main, {
      childList: true,
      subtree: true,
    });
  }

  #disconnect() {
    this.#intersectionObserver?.disconnect();
    this.#mutationObserver?.disconnect();
  }
}
