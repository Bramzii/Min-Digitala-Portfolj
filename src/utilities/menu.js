const links = [
  ["/", "Start"],
  ["/pages/about/about.html", "Om mig"],
  ["/pages/skills/skills.html", "Kunskaper"],
  ["/pages/projects/projects.html", "Projekt"],
  ["/pages/experience/experience.html", "Erfarenhet"],
  ["/pages/education/education.html", "Utbildning"],
  ["/pages/contact/contact.html", "Kontakt"],
  ["/pages/surprise/surprise.html", "?!"],
];

export default class Menu {
  constructor() {
    this.#renderHeader();
    this.#renderFooter();
    this.#addEventListeners();
  }

  #renderHeader() {
    const currentPath = location.pathname;
    document.querySelector("header").innerHTML = /*html*/ `
      <a class="skip-link" href="#main">Hoppa till innehållet</a>
      <div class="container nav-wrap">
        <a class="brand" href="/">Bedirhan <span>Ramzi</span></a>
        <button class="menu-button" type="button" aria-expanded="false" aria-controls="main-menu">Meny</button>
        <nav class="site-nav" id="main-menu" aria-label="Huvudmeny">
          <ul class="nav-list">
            ${links.map(([href, label]) => `<li><a href="${href}" ${currentPath === href ? 'aria-current="page"' : ""}>${label}</a></li>`).join("")}
          </ul>
        </nav>
      </div>`;
  }

  #renderFooter() {
    document.querySelector("footer").innerHTML = /*html*/ `
      <div class="container footer-wrap">
        <span>© ${new Date().getFullYear()} Bedirhan Ramzi</span>
        <span><a href="https://github.com/Bramzii" target="_blank" rel="noopener noreferrer">GitHub ↗</a> · Systemutveckling · Säkerhet · Ledarskap</span>
      </div>`;
  }

  #addEventListeners() {
    const button = document.querySelector(".menu-button");
    const navigation = document.querySelector(".site-nav");
    button.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("open");
      button.setAttribute("aria-expanded", String(isOpen));
    });
  }
}
