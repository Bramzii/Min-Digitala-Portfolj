import DataClient from "../../utilities/data-client.js";
import Menu from "../../utilities/menu.js";
import { settings } from "../../config/settings.js";

const form = document.querySelector("#contact-form");
const editButton = document.querySelector("#edit-message");
const submitButton = document.querySelector("#submit-message");
const status = document.querySelector("#form-status");
const formExplanation = document.querySelector("#form-explanation");
const client = new DataClient("messages");
let messageId = settings.IS_LOCAL
  ? localStorage.getItem("portfolioMessageId")
  : null;

const initApp = () => {
  new Menu();
  editButton.hidden = !settings.IS_LOCAL || !messageId;

  if (!settings.IS_LOCAL) {
    formExplanation.textContent =
      "Meddelandet skickas via webbplatsens säkra formulärtjänst. Du kan också kontakta mig direkt via e-post eller LinkedIn.";
  }
};

const loadMessage = async () => {
  try {
    const message = await client.findById(messageId);
    ["name", "email", "subject", "message"].forEach((field) => {
      form.elements[field].value = message[field] || "";
    });
    form.dataset.editing = "true";
    submitButton.textContent = "Uppdatera meddelande";
    status.textContent =
      "Meddelandet är hämtat. Ändra det och tryck på Uppdatera.";
  } catch (error) {
    localStorage.removeItem("portfolioMessageId");
    messageId = null;
    editButton.hidden = true;
    status.textContent = "Det tidigare meddelandet kunde inte hittas.";
  }
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  delete data["form-name"];
  delete data["bot-field"];

  status.classList.remove("error");
  status.textContent = "Skickar …";

  try {
    if (!settings.IS_LOCAL) {
      const response = await fetch("/", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      });

      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      status.textContent = "Tack! Ditt meddelande har skickats.";
    } else if (form.dataset.editing === "true" && messageId) {
      await client.update(messageId, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      status.textContent = "Ditt meddelande har uppdaterats.";
    } else {
      const savedMessage = await client.add({
        ...data,
        sentAt: new Date().toISOString(),
      });
      messageId = savedMessage.id;
      localStorage.setItem("portfolioMessageId", String(messageId));
      editButton.hidden = false;
      status.textContent = "Tack! Ditt meddelande har sparats.";
    }

    form.reset();
    delete form.dataset.editing;
    submitButton.textContent = "Skicka meddelande";
  } catch (error) {
    status.textContent = settings.IS_LOCAL
      ? "Meddelandet kunde inte sparas. Kontrollera att databasen är startad."
      : "Meddelandet kunde inte skickas. Mejla mig gärna direkt i stället.";
    status.classList.add("error");
  }
};

editButton.addEventListener("click", loadMessage);
form.addEventListener("submit", handleSubmit);
initApp();
