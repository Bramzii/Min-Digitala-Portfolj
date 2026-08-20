import DataClient from "./utilities/data-client.js";
import Menu from "./utilities/menu.js";
import { createProjectCard } from "./utilities/project-card.js";

const projectList = document.querySelector("#featured-projects");

const initApp = async () => {
  new Menu();

  try {
    const client = new DataClient("projects");
    const projects = await client.listAll();
    const featuredProjects = projects
      .filter((project) => project.featured)
      .sort(
        (first, second) =>
          Number(first.displayOrder) - Number(second.displayOrder),
      );
    displayProjects(featuredProjects);
  } catch (error) {
    projectList.innerHTML =
      '<p class="error">Starta json-server för att visa projekten.</p>';
  }
};

const displayProjects = (projects) => {
  projectList.innerHTML =
    projects.map((project) => createProjectCard(project)).join("") ||
    "<p>Inga utvalda projekt ännu.</p>";
};

initApp();
