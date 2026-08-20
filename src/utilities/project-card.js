import { escapeHtml } from "./helpers.js";

export const createProjectCard = (project) => /*html*/ `
  <article class="card">
    <p class="meta">${escapeHtml(project.category)} · ${escapeHtml(project.year)}</p>
    <h3>${escapeHtml(project.title)}</h3>
    <p>${escapeHtml(project.description)}</p>
    <ul class="tags">${project.technologies.map((technology) => `<li class="tag">${escapeHtml(technology)}</li>`).join("")}</ul>
    <div class="actions">
      <a class="text-link" href="/pages/projects/project-details.html?id=${project.id}">Läs mer →</a>
      <a class="text-link" href="${escapeHtml(project.link)}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
    </div>
  </article>`;
