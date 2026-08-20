import DataClient from "../../utilities/data-client.js";
import { escapeHtml } from "../../utilities/helpers.js";
import Menu from "../../utilities/menu.js";

const skillList = document.querySelector("#skill-list");

const initApp = async () => {
  new Menu();

  try {
    const client = new DataClient("skills");
    const skills = await client.listAll();
    displaySkills(skills);
  } catch (error) {
    skillList.innerHTML = '<p class="error">Kunskaperna kunde inte hämtas.</p>';
  }
};

const displaySkills = (skills) => {
  skillList.innerHTML = skills
    .map(
      (skill) => /*html*/ `
        <article class="card">
          <strong>${escapeHtml(skill.name)}</strong>
          <p class="meta">${escapeHtml(skill.category)}</p>
        </article>`,
    )
    .join("");
};

initApp();
