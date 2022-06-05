import Charizard from "./classes/pokemon/Charizard.js";
import Snorlax from "./classes/pokemon/Snorlax.js";
import Blastoise from "./classes/pokemon/Blastoise.js";
import Rhydon from "./classes/pokemon/Rhydon.js";
import { attacks } from "./data/attacks.js";
import { pokemon } from "./data/pokemon.js";
import Battle from "./classes/Battle.js";
import { audio } from "./data/audio.js";
import Alakazam from "./classes/pokemon/Alakazam.js";
import Jolteon from "./classes/pokemon/Jolteon.js";
import Sprite from "./classes/Sprite.js";
import Gyarados from "./classes/pokemon/Gyarados.js";
import Exeggutor from "./classes/pokemon/Exeggutor.js";
import Gengar from "./classes/pokemon/Gengar.js";
import Electabuzz from "./classes/pokemon/Electabuzz.js";
import MewTwo from "./classes/pokemon/MewTwo.js";
import Mew from "./classes/pokemon/Mew.js";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

if (window.innerWidth < 500) {
  canvas.width = 320;
  canvas.height = 288;
} else {
  canvas.width = 480;
  canvas.height = 432;
}

c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);

// variables
let clicked = false;
let renderedSprites;
let queue;
let battleAnimationId;

let playerTeam;
let currentPlayer = 0;
let numPlayerLeft = 6;
let enemyTeam;
let currentEnemy = 0;
let numEnemyLeft = 6;

let blankContainer;
let choiceContainer;
let attacksContainer;
let typesContainer;

let selectScreen;
let pokeContainer;

playerTeam = [
  new Gyarados(pokemon.Gyarados),
  new Snorlax(pokemon.Snorlax),
  new Gengar(pokemon.Gengar),
  new Charizard(pokemon.Charizard),
  new Jolteon(pokemon.Jolteon),
  new Mew(pokemon.Mew),
];
enemyTeam = [
  new Rhydon({ ...pokemon.Rhydon, isEnemy: true }),
  new Exeggutor({ ...pokemon.Exeggutor, isEnemy: true }),
  new Alakazam({ ...pokemon.Alakazam, isEnemy: true }),
  new Electabuzz({ ...pokemon.Electabuzz, isEnemy: true }),
  new Blastoise({ ...pokemon.Blastoise, isEnemy: true }),
  new MewTwo({ ...pokemon.Mewtwo, isEnemy: true }),
];

const battle = new Battle();

document.querySelector("#dialogueBox").addEventListener("click", (e) => {
  if (queue.length > 0) {
    queue[0]();
    queue.shift();
  } else e.currentTarget.style.display = "none";
});

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// redraws the canvas
function reDraw() {
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);
}

// resizes the canvas and pokemon
function reSizeCanvas() {
  if (window.innerWidth < 500) {
    canvas.width = 320;
    canvas.height = 288;
    enemyTeam[currentEnemy].reDraw(2, 195, 10);
    playerTeam[currentPlayer].reDraw(2, 15, 92);
  } else {
    canvas.width = 480;
    canvas.height = 432;
    enemyTeam[currentEnemy].reDraw(3, 290, 10);
    playerTeam[currentPlayer].reDraw(3, 25, 128);
  }

  reDraw();
}

// listens for change of window size
window.addEventListener("resize", reSizeCanvas, false);

// starts everything
function startGame() {
  gsap.to("#transitionBg", {
    opacity: 1,
    repeat: 3,
    yoyo: true,
    duration: 0.4,
    onComplete() {
      gsap.to("#transitionBg", {
        opacity: 1,
        duration: 0.4,
        onComplete() {
          // activate a new animation loop
          initBattle();
          animateBattle();
          gsap.to("#transitionBg", {
            opacity: 0,
            duration: 0.4,
          });
        },
      });
    },
  });
}

function initBattle() {
  document.querySelector("#userInterface").style.display = "block";
  document.querySelector("#dialogueBox").style.display = "none";
  document.querySelector("#enemyHealthBar").style.width = "100%";
  document.querySelector("#playerHealthBar").style.width = "100%";

  attacksContainer = document.querySelector("#attacksBox");
  typesContainer = document.querySelector("#attackType");

  blankContainer = document.querySelector("#blankBox");
  choiceContainer = document.querySelector("#choiceBox");

  selectScreen = document.querySelector("#pokeSelect");
  pokeContainer = document.querySelector("#pokeContainer");

  if (window.innerWidth < 500) {
    enemyTeam[currentEnemy].reDraw(2, 195, 10);
    playerTeam[currentPlayer].reDraw(2, 15, 92);
  } else {
    enemyTeam[currentEnemy].reDraw(3, 290, 10);
    playerTeam[currentPlayer].reDraw(3, 25, 128);
  }

  // display names
  document.querySelector("#playerName").innerHTML =
    playerTeam[currentPlayer].name;
  document.querySelector("#enemyName").innerHTML = enemyTeam[currentEnemy].name;

  // display hp
  document.querySelector("#playerHpNumber").innerHTML =
    playerTeam[currentPlayer].health +
    " / " +
    playerTeam[currentPlayer].stats[0];
  queue = [];

  renderedSprites = [playerTeam[currentPlayer], enemyTeam[currentEnemy]];

  prepAttacks();

  // add event listeners
  document.querySelector("#fightBtn").addEventListener("click", (e) => {
    blankContainer.style.display = "none";
    choiceContainer.style.display = "none";
    typesContainer.style.display = "block";
    attacksContainer.style.display = "grid";
  });

  typesContainer.addEventListener("click", (e) => {
    blankContainer.style.display = "block";
    choiceContainer.style.display = "grid";
    typesContainer.style.display = "none";
    attacksContainer.style.display = "none";
  });

  document.querySelector("#backBtn").addEventListener("click", (e) => {
    document.querySelector("#userInterface").style.display = "block";
    selectScreen.style.display = "none";
  });

  // add event listener to pokemon button
  document.querySelector("#pokeBtn").addEventListener("click", (e) => {
    document.querySelector("#backBtn").disabled = false;

    goToSelectScreen(false);

    // add event listener to selecting pokemon
    document.querySelectorAll(".selectContainer").forEach((p, key) => {
      if (currentPlayer != key && playerTeam[key].status != "fainted")
        p.addEventListener("click", (e) => {
          document.querySelector("#userInterface").style.display = "block";

          selectScreen.style.display = "none";

          // send out next pokemon
          sendOutPlayerPoke(p.id);

          // random attack
          let enemyAttack = enemyTeam[currentEnemy].chooseMove();
          const randomAttack = enemyTeam[currentEnemy].attacks[enemyAttack];

          queue.push(() => {
            battle.takeTurn(
              enemyTeam[currentEnemy],
              randomAttack,
              playerTeam[currentPlayer],
              renderedSprites,
              queue
            );

            queue.push(() => {
              if (playerTeam[currentPlayer].health <= 0) {
                battle.faintPokemon(
                  playerTeam[currentPlayer],
                  queue,
                  battleAnimationId
                );

                numPlayerLeft -= 1;

                queue.push(() => {
                  if (numPlayerLeft <= 0)
                    battle.finishBattle(battleAnimationId);
                  else goToSelectScreen(true);
                });
              } else {
                if (enemyTeam[currentEnemy].status === "burned") {
                  battle.applyEndDamage(
                    enemyTeam[currentEnemy],
                    renderedSprites
                  );

                  queue.push(() => {
                    if (enemyTeam[currentEnemy].health === 0) {
                      battle.faintPokemon(
                        enemyTeam[currentEnemy],
                        queue,
                        battleAnimationId
                      );
                      numEnemyLeft -= 1;

                      queue.push(() => {
                        // enemy sends out next pokemon if they can

                        if (numEnemyLeft <= 0) {
                          battle.finishBattle(battleAnimationId);
                        } else sendOutNext();
                      });
                    } else {
                      queue.shift();
                      document.querySelector("#dialogueBox").style.display =
                        "none";
                    }
                  });
                } else {
                  queue.shift();
                  document.querySelector("#dialogueBox").style.display = "none";
                }
              }
            });
          });
        });
    });
  });
}

// add attacks and its event listeners
function prepAttacks() {
  attacksContainer.replaceChildren();

  // add a button for each of the player's attacks
  playerTeam[currentPlayer].attacks.forEach((attack) => {
    const button = document.createElement("button");
    button.innerHTML = attack.name;
    button.classList.add("attack");
    button.id = attack.id;
    document.querySelector("#attacksBox").append(button);
  });

  // add event listener to all attacks
  document.querySelectorAll(".attack").forEach((b) => {
    b.addEventListener("click", (e) => {
      let speedWinner;
      const selectedAttack = attacks[e.currentTarget.id];

      // random attack
      let enemyAttack = enemyTeam[currentEnemy].chooseMove();
      const randomAttack = enemyTeam[currentEnemy].attacks[enemyAttack];

      if (
        playerTeam[currentPlayer].getSpeed() >
        enemyTeam[currentEnemy].getSpeed()
      )
        speedWinner = 1;
      else if (
        enemyTeam[currentEnemy].getSpeed() >
        playerTeam[currentPlayer].getSpeed()
      )
        speedWinner = 2;
      else speedWinner = randomIntFromInterval(1, 2);

      if (speedWinner === 1) {
        battle.takeTurn(
          playerTeam[currentPlayer],
          selectedAttack,
          enemyTeam[currentEnemy],
          renderedSprites,
          queue,
          battleAnimationId
        );

        // blastoise turn
        queue.push(() => {
          if (enemyTeam[currentEnemy].health >= 1) {
            battle.takeTurn(
              enemyTeam[currentEnemy],
              randomAttack,
              playerTeam[currentPlayer],
              renderedSprites,
              queue
            );

            queue.push(() => {
              if (playerTeam[currentPlayer].health <= 0) {
                battle.faintPokemon(
                  playerTeam[currentPlayer],
                  queue,
                  battleAnimationId
                );

                numPlayerLeft -= 1;

                queue.push(() => {
                  if (numPlayerLeft <= 0)
                    battle.finishBattle(battleAnimationId);
                  else goToSelectScreen(true);
                });
              } else {
                if (enemyTeam[currentEnemy].status === "burned") {
                  battle.applyEndDamage(
                    enemyTeam[currentEnemy],
                    renderedSprites
                  );

                  queue.push(() => {
                    if (enemyTeam[currentEnemy].health === 0) {
                      battle.faintPokemon(
                        enemyTeam[currentEnemy],
                        queue,
                        battleAnimationId
                      );

                      numEnemyLeft -= 1;

                      queue.push(() => {
                        // enemy sends out next pokemon if they can
                        if (numEnemyLeft <= 0) {
                          battle.finishBattle(battleAnimationId);
                        } else sendOutNext();
                      });
                    } else {
                      queue.shift();
                      document.querySelector("#dialogueBox").style.display =
                        "none";
                    }
                  });
                } else {
                  queue.shift();
                  document.querySelector("#dialogueBox").style.display = "none";
                }
              }
            });
          } else {
            battle.faintPokemon(
              enemyTeam[currentEnemy],
              queue,
              battleAnimationId
            );

            numEnemyLeft -= 1;

            queue.push(() => {
              // enemy sends out next pokemon if they can
              if (numEnemyLeft <= 0) {
                battle.finishBattle(battleAnimationId);
              } else sendOutNext();
            });
          }
        });
      } else {
        battle.takeTurn(
          enemyTeam[currentEnemy],
          randomAttack,
          playerTeam[currentPlayer],
          renderedSprites,
          queue,
          battleAnimationId
        );

        // charizard turn
        queue.push(() => {
          if (playerTeam[currentPlayer].health >= 1) {
            battle.takeTurn(
              playerTeam[currentPlayer],
              selectedAttack,
              enemyTeam[currentEnemy],
              renderedSprites,
              queue
            );

            queue.push(() => {
              if (enemyTeam[currentEnemy].health <= 0) {
                battle.faintPokemon(
                  enemyTeam[currentEnemy],
                  queue,
                  battleAnimationId
                );

                numEnemyLeft -= 1;

                queue.push(() => {
                  // enemy sends out next pokemon if they can
                  if (numEnemyLeft <= 0) {
                    battle.finishBattle(battleAnimationId);
                  } else sendOutNext();
                });
              } else {
                if (enemyTeam[currentEnemy].status === "burned") {
                  battle.applyEndDamage(
                    enemyTeam[currentEnemy],
                    renderedSprites
                  );

                  queue.push(() => {
                    if (enemyTeam[currentEnemy].health === 0) {
                      battle.faintPokemon(
                        enemyTeam[currentEnemy],
                        queue,
                        battleAnimationId
                      );

                      numEnemyLeft -= 1;

                      queue.push(() => {
                        // enemy sends out next pokemon if they can
                        if (numEnemyLeft <= 0) {
                          battle.finishBattle(battleAnimationId);
                        } else sendOutNext();
                      });
                    } else {
                      queue.shift();
                      document.querySelector("#dialogueBox").style.display =
                        "none";
                    }
                  });
                } else {
                  queue.shift();
                  document.querySelector("#dialogueBox").style.display = "none";
                }
              }
            });
          } else {
            battle.faintPokemon(
              playerTeam[currentPlayer],
              queue,
              battleAnimationId
            );

            numPlayerLeft -= 1;

            queue.push(() => {
              if (numPlayerLeft <= 0) battle.finishBattle(battleAnimationId);
              else goToSelectScreen(true);
            });
          }
        });
      }

      if (playerTeam[currentPlayer].getMovePP(selectedAttack) <= 0) {
        b.disabled = true;
      }

      blankContainer.style.display = "block";
      choiceContainer.style.display = "grid";
      typesContainer.style.display = "none";
      attacksContainer.style.display = "none";
    });

    b.addEventListener("mouseenter", (e) => {
      const selectedAttack = attacks[e.currentTarget.id];
      document.querySelector("#attackType").innerHTML =
        "Type/" +
        selectedAttack.type +
        " " +
        playerTeam[currentPlayer].getMovePP(selectedAttack) +
        "/" +
        selectedAttack.pp;
    });
  });
}

// send out next pokemon
function sendOutNext() {
  let s = enemyTeam[currentEnemy].size;
  let x = enemyTeam[currentEnemy].position.x;
  let y = enemyTeam[currentEnemy].position.y - 20;

  currentEnemy = currentEnemy + 1;

  enemyTeam[currentEnemy].reDraw(s, x, y);

  document.querySelector("#dialogueBox").style.display = "block";
  document.querySelector("#dialogueBox").innerHTML =
    "Enemy trainer sent out " + enemyTeam[currentEnemy].name + "!";

  document.querySelector("#enemyName").innerHTML = enemyTeam[currentEnemy].name;
  document.querySelector("#enemyHealthBar").style.width = "100%";

  document.querySelector("#enemyStatus").innerHTML = ":L50";

  const pokeballImg = new Image();
  pokeballImg.src = "./img/pokeballEnter.png";

  const pokeball = new Sprite({
    position: {
      x: x - 10,
      y: y - 40,
    },
    backSprite: pokeballImg,
    size: enemyTeam[currentEnemy].size,
    frames: {
      max: 6,
      hold: 10,
    },
    animate: true,
  });

  renderedSprites.splice(1, 1);
  renderedSprites.splice(1, 1, pokeball);

  audio.ballPoof.play();

  gsap.to(pokeball, {
    duration: 0.6,
    onComplete: () => {
      if (currentEnemy === 1) audio.Exeggutor.play();
      else if (currentEnemy === 2) audio.Alakazam.play();
      else if (currentEnemy === 3) audio.Electabuzz.play();
      else if (currentEnemy === 4) audio.Blastoise.play();
      else if (currentEnemy === 5) audio.Mewtwo.play();

      renderedSprites.splice(1, 1);
      renderedSprites.splice(1, 1, enemyTeam[currentEnemy]);
    },
  });
}

function sendOutPlayerPoke(newPoke) {
  document.querySelector("#dialogueBox").style.display = "block";
  document.querySelector("#dialogueBox").innerHTML =
    playerTeam[currentPlayer].name + " return!";

  playerTeam[currentPlayer].stages = [0, 0, 0, 0, 0];

  let s = playerTeam[currentPlayer].size;
  let x = playerTeam[currentPlayer].position.x;
  let y = playerTeam[currentPlayer].position.y;

  if (playerTeam[currentPlayer].status === "fainted") y -= 20;

  const pokeballImg = new Image();
  pokeballImg.src = "./img/pokeballEnter.png";

  const pokeball = new Sprite({
    position: {
      x: x,
      y: y - 20,
    },
    backSprite: pokeballImg,
    size: playerTeam[currentPlayer].size,
    frames: {
      max: 6,
      hold: 10,
    },
    animate: true,
  });

  queue.push(() => {
    document.querySelector("#menu").classList.add("loading");

    gsap.to(playerTeam[currentPlayer], {
      opacity: 0,
      onComplete: () => {
        currentPlayer = newPoke;

        document.querySelector("#dialogueBox").innerHTML =
          "Go " + playerTeam[currentPlayer].name + "!";

        document.querySelector("#playerName").innerHTML =
          playerTeam[currentPlayer].name;

        let currWidth = Math.floor(
          (playerTeam[currentPlayer].health /
            playerTeam[currentPlayer].stats[0]) *
            100
        );
        document.querySelector("#playerHealthBar").style.width =
          currWidth + "%";

        document.querySelector("#playerHpNumber").innerHTML =
          playerTeam[currentPlayer].health +
          " / " +
          playerTeam[currentPlayer].stats[0];

        let currStatus = ":L50";

        if (playerTeam[currentPlayer].status === "paralyzed")
          currStatus = "PAR";
        else if (playerTeam[currentPlayer].status === "frozen")
          currStatus = "FRZ";
        else if (playerTeam[currentPlayer].status === "burned")
          currStatus = "BRN";
        else if (playerTeam[currentPlayer].status === "sleeping")
          currStatus = "SLP";

        document.querySelector("#playerStatus").innerHTML = currStatus;

        prepAttacks();

        renderedSprites.splice(0, 1);
        renderedSprites.unshift(pokeball);

        audio.ballPoof.play();

        gsap.to(pokeball, {
          duration: 0.6,
          onComplete: () => {
            if (playerTeam[currentPlayer].name === "JOLTEON")
              audio.Jolteon.play();
            else if (playerTeam[currentPlayer].name === "SNORLAX")
              audio.Snorlax.play();
            else if (playerTeam[currentPlayer].name === "CHARIZARD")
              audio.Charizard.play();
            else if (playerTeam[currentPlayer].name === "GYARADOS")
              audio.Gyarados.play();
            else if (playerTeam[currentPlayer].name === "GENGAR")
              audio.Gengar.play();
            else if (playerTeam[currentPlayer].name === "MEW") audio.Mew.play();

            playerTeam[currentPlayer].reDraw(s, x, y);

            renderedSprites.splice(0, 1);
            renderedSprites.unshift(playerTeam[currentPlayer]);

            playerTeam[currentPlayer].opacity = 1;

            document.querySelector("#menu").classList.remove("loading");
          },
        });
      },
    });
  });
}

function goToSelectScreen(justFainted) {
  document.querySelector("#userInterface").style.display = "none";
  selectScreen.style.display = "block";

  pokeContainer.replaceChildren();

  playerTeam.forEach((p, key) => {
    let newDiv = document.createElement("div");
    newDiv.classList.add("selectContainer");
    newDiv.setAttribute("id", key);

    let newP = document.createElement("p");
    newP.innerHTML = p.name;

    let healthH2 = document.createElement("h2");
    healthH2.innerHTML = p.health + "/" + p.stats[0];

    let statusH2 = document.createElement("h2");
    statusH2.innerHTML = p.status;

    newDiv.appendChild(newP);
    newDiv.appendChild(healthH2);
    newDiv.appendChild(statusH2);

    pokeContainer.appendChild(newDiv);
  });

  if (justFainted) {
    document.querySelector("#backBtn").disabled = true;

    // add event listener to selecting pokemon
    document.querySelectorAll(".selectContainer").forEach((p, key) => {
      if (currentPlayer != key && playerTeam[key].status != "fainted")
        p.addEventListener("click", (e) => {
          document.querySelector("#userInterface").style.display = "block";

          selectScreen.style.display = "none";

          // send out next pokemon
          sendOutPlayerPoke(p.id);
        });
    });
  }
}

function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle);

  reDraw();
  renderedSprites.forEach((sprite) => {
    sprite.draw(c);
  });
}

// starts game when user clicks screen
addEventListener("pointerdown", () => {
  if (!clicked) {
    audio.battle.play();
    clicked = true;
    startGame();
  }
});
