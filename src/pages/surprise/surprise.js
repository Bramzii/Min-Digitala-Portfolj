import Menu from "../../utilities/menu.js";

const messages = [
  "För sent – nu är du officiellt nyfiken. Det gillar jag.",
  "Du tryckte igen. Det här börjar likna grundlig testning.",
  "Tre klick? Du hade passat bra som testare.",
  "Nu finns det inga fler hemligheter. Förmodligen.",
];

const initApp = () => {
  new Menu();

  const button = document.querySelector("#surprise-button");
  const message = document.querySelector("#surprise-message");
  let clickCount = 0;

  button.addEventListener("click", () => {
    message.textContent = messages[Math.min(clickCount, messages.length - 1)];
    clickCount += 1;
    button.textContent = clickCount === 1 ? "Okej, en gång till" : "Tryck igen";
  });
};

initApp();
