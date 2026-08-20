import DataClient from "../../utilities/data-client.js";
import { escapeHtml } from "../../utilities/helpers.js";
import Menu from "../../utilities/menu.js";

const projectDetails = document.querySelector("#project-details");

const initApp = async () => {
  new Menu();
  const id = new URLSearchParams(location.search).get("id");

  if (!id) {
    projectDetails.innerHTML = "<p>Inget projekt valdes.</p>";
    return;
  }

  try {
    const client = new DataClient("projects");
    const project = await client.findById(id);
    displayProject(project);
  } catch (error) {
    projectDetails.innerHTML =
      '<p class="error">Projektet kunde inte hittas.</p>';
  }
};

const displayProject = (project) => {
  projectDetails.innerHTML = /*html*/ `
    <p class="eyebrow">${escapeHtml(project.category)} · ${escapeHtml(project.year)}</p>
    <h1>${escapeHtml(project.title)}</h1>
    <p class="lead">${escapeHtml(project.description)}</p>
    <ul class="tags">${project.technologies.map((technology) => `<li class="tag">${escapeHtml(technology)}</li>`).join("")}</ul>
    <div class="actions">
      <a class="button" href="${escapeHtml(project.link)}" target="_blank" rel="noopener noreferrer">Visa på GitHub ↗</a>
      <a class="button secondary" href="projects.html">← Alla projekt</a>
    </div>`;
};

initApp();
