import DataClient from "../../utilities/data-client.js";
import { escapeHtml } from "../../utilities/helpers.js";
import Menu from "../../utilities/menu.js";
import { createProjectCard } from "../../utilities/project-card.js";

const projectList = document.querySelector("#project-list");
const searchField = document.querySelector("#search");
const categoryField = document.querySelector("#category");
let projects = [];

const initApp = async () => {
  new Menu();

  try {
    const client = new DataClient("projects");
    projects = (await client.listAll()).sort(
      (first, second) =>
        Number(first.displayOrder) - Number(second.displayOrder),
    );
    displayCategories(projects);
    displayProjects(projects);
  } catch (error) {
    projectList.innerHTML =
      '<p class="error">Starta databasen med npm run api.</p>';
  }
};

const displayCategories = (items) => {
  const categories = [...new Set(items.map((project) => project.category))];
  categoryField.innerHTML += categories
    .map(
      (category) =>
        `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`,
    )
    .join("");
};

const filterProjects = () => {
  const query = searchField.value.toLowerCase().trim();
  const category = categoryField.value;
  const filtered = projects.filter(
    (project) =>
      (!query ||
        `${project.title} ${project.description} ${project.technologies.join(" ")}`
          .toLowerCase()
          .includes(query)) &&
      (!category || project.category === category),
  );
  displayProjects(filtered);
};

const displayProjects = (items) => {
  projectList.innerHTML =
    items.map((project) => createProjectCard(project)).join("") ||
    "<p>Inga projekt matchar filtreringen.</p>";
};

searchField.addEventListener("input", filterProjects);
categoryField.addEventListener("change", filterProjects);
initApp();
