const diceTrow = require("./diceTrow");

const vampireTrow = (comand) => {
  let times;
  let difficulty;
  if (!isNaN(Number(comand)) && Number(comand) > 0) {
    console.log("1st statemnet");
    times = comand;
  } else if (comand.includes("d")) {
    console.log("2n statement");
    [times, difficulty] = comand.split("d");
    if (isNaN(Number(times)) || isNaN(Number(difficulty))) {
      return "👿Invalid number, don't try to break me 👿";
    }
  } else {
    return "comand not available, try again :D";
  }
  if (isNaN(Number(times)) || Number(times) <= 0) {
    return "No puedes tirar menos de 1 dado ¬¬' ";
  } else if (difficulty > 10) {
    return "Tirada imposible! Tas pasao! No puedes sacar mas de 10 en un dado de 10...";
  }
  const result = diceTrow(times, 10);

  let successDice = 0;
  let failDices = 0;
  result.forEach((dice) => {
    if (dice === 1) failDices++;
    if (dice >= (Number(difficulty) || 6)) successDice++;
  });
  const finalResult = successDice - failDices;

  let msg = "";

  if (finalResult <= 0 && successDice >= 0) {
    msg = "😥¡ FALLO !😥";
  } else if (successDice === 0 && failDices > 0) {
    msg = "😱 ¡ PIFIA ! 😱";
  } else {
    msg = `😄 ¡ ${finalResult} éxitos ! 😄`;
  }

  return `
  Resultados de la tirada: ${result.sort(function (a, b) {
    return a - b;
  })} \n ***Tirada normal:***\n  ${msg} \n ***Tirada combate (sin pifias):*** \n  ${successDice} éxitos
`;
};

module.exports = vampireTrow;
