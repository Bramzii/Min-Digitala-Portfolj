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
  #intersectionObserver;
  #mutationObserver;
  #progressBar;
  #depthElements = [];
  #frameRequested = false;

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
        threshold: 0.08,
        rootMargin: "0px 0px -7% 0px",
      },
    );

    this.#createProgressBar();
    this.#registerElements(document);
    this.#registerDepthElements();
    this.#observeNewElements();
    this.#updateScrollEffects();

    window.addEventListener("scroll", this.#queueScrollUpdate, {
      passive: true,
    });
    window.addEventListener("resize", this.#queueScrollUpdate, {
      passive: true,
    });
    window.addEventListener("pagehide", () => this.#disconnect(), {
      once: true,
    });
  }

  #createProgressBar() {
    this.#progressBar = document.createElement("div");
    this.#progressBar.className = "scroll-progress";
    this.#progressBar.setAttribute("aria-hidden", "true");
    document.body.append(this.#progressBar);
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

      if (this.#isInitiallyVisibleHeroElement(element)) {
        return;
      }

      element.classList.add("reveal-item");
      element.dataset.reveal = this.#getRevealStyle(element);
      element.style.setProperty(
        "--reveal-delay",
        `${this.#getRevealDelay(element)}ms`,
      );
      this.#intersectionObserver.observe(element);
    });
  }

  #isInitiallyVisibleHeroElement(element) {
    const isHeroElement = element.closest(".hero, .page-hero");
    const rect = element.getBoundingClientRect();
    return Boolean(isHeroElement && rect.top < innerHeight && rect.bottom > 0);
  }

  #getRevealStyle(element) {
    if (element.matches(".hero-grid > .portrait")) {
      return "portrait";
    }

    if (element.matches(".eyebrow")) {
      return "kicker";
    }

    if (element.matches("h1, .section-heading")) {
      return "heading";
    }

    if (element.matches(".hero-grid .lead, .page-hero .lead")) {
      return "copy";
    }

    if (element.matches(".hero-grid .actions")) {
      return "actions";
    }

    if (element.matches(".card")) {
      const index = this.#getSiblingIndex(element);
      return index % 2 === 0 ? "card-left" : "card-right";
    }

    if (element.matches(".stat")) {
      return "pop";
    }

    if (element.matches(".timeline-item")) {
      return "timeline";
    }

    if (element.matches(".filter-bar")) {
      return "filter";
    }

    return "copy";
  }

  #getRevealDelay(element) {
    const heroOrder = [".eyebrow", "h1", ".lead", ".actions"];
    const heroCopy = element.closest(".hero-grid > div:first-child");

    if (heroCopy) {
      const index = heroOrder.findIndex((selector) => element.matches(selector));
      return Math.max(index, 0) * 95;
    }

    if (element.matches(".hero-grid > .portrait")) {
      return 170;
    }

    const pageHero = element.closest(".page-hero");
    if (pageHero) {
      const index = [".eyebrow", "h1", ".lead"].findIndex((selector) =>
        element.matches(selector),
      );
      return Math.max(index, 0) * 90;
    }

    if (element.matches(".card, .stat, .timeline-item")) {
      return Math.min(this.#getSiblingIndex(element), 3) * 90;
    }

    return 0;
  }

  #getSiblingIndex(element) {
    return Array.from(element.parentElement?.children || []).indexOf(element);
  }

  #registerDepthElements() {
    this.#depthElements = Array.from(document.querySelectorAll(".portrait"));
    this.#depthElements.forEach((element) => element.classList.add("scroll-depth"));
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

  #queueScrollUpdate = () => {
    if (this.#frameRequested) {
      return;
    }

    this.#frameRequested = true;
    requestAnimationFrame(() => {
      this.#updateScrollEffects();
      this.#frameRequested = false;
    });
  };

  #updateScrollEffects() {
    const scrollableHeight = document.documentElement.scrollHeight - innerHeight;
    const progress = scrollableHeight > 0 ? scrollY / scrollableHeight : 0;
    this.#progressBar?.style.setProperty(
      "--scroll-progress",
      String(Math.min(Math.max(progress, 0), 1)),
    );

    this.#depthElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const distanceFromCenter =
        (rect.top + rect.height / 2 - innerHeight / 2) / innerHeight;
      const shift = Math.min(Math.max(distanceFromCenter * -28, -18), 18);
      element.style.setProperty("--scroll-depth", `${shift.toFixed(2)}px`);
    });
  }

  #disconnect() {
    this.#intersectionObserver?.disconnect();
    this.#mutationObserver?.disconnect();
    window.removeEventListener("scroll", this.#queueScrollUpdate);
    window.removeEventListener("resize", this.#queueScrollUpdate);
  }
}
