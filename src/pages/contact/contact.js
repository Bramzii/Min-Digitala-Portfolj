import DataClient from "../../utilities/data-client.js";
import Menu from "../../utilities/menu.js";

const form = document.querySelector("#contact-form");
const editButton = document.querySelector("#edit-message");
const submitButton = document.querySelector("#submit-message");
const status = document.querySelector("#form-status");
const client = new DataClient("messages");
let messageId = localStorage.getItem("portfolioMessageId");

const initApp = () => {
  new Menu();
  editButton.hidden = !messageId;
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
  const data = Object.fromEntries(new FormData(form));
  status.textContent = "Skickar …";

  try {
    if (form.dataset.editing === "true" && messageId) {
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
    status.textContent =
      "Meddelandet kunde inte sparas. Kontrollera att databasen är startad.";
    status.classList.add("error");
  }
};

editButton.addEventListener("click", loadMessage);
form.addEventListener("submit", handleSubmit);
initApp();
