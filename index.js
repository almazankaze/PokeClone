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

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 480;
canvas.height = 432;

c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);

// variables
let clicked = false;
let renderedSprites;
let queue;
let battleAnimationId;

let playerTeam;
let currentPlayer = 1;
let enemyTeam;
let currentEnemy = 2;

let blankContainer;
let choiceContainer;
let attacksContainer;
let typesContainer;

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
    enemyTeam[currentEnemy].reDraw(2, 195, 0);
    playerTeam[currentPlayer].reDraw(2, 15, 92);
  } else {
    canvas.width = 480;
    canvas.height = 432;
    enemyTeam[currentEnemy].reDraw(3, 300, 0);
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

  attacksContainer.replaceChildren();

  blankContainer = document.querySelector("#blankBox");
  choiceContainer = document.querySelector("#choiceBox");

  playerTeam = [
    new Snorlax(pokemon.Snorlax),
    new Charizard(pokemon.Charizard),
    new Jolteon(pokemon.Jolteon),
  ];
  enemyTeam = [
    new Rhydon({ ...pokemon.Rhydon, isEnemy: true }),
    new Blastoise({ ...pokemon.Blastoise, isEnemy: true }),
    new Alakazam({ ...pokemon.Alakazam, isEnemy: true }),
  ];

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

  // add a button for each of the player's attacks
  playerTeam[currentPlayer].attacks.forEach((attack) => {
    const button = document.createElement("button");
    button.innerHTML = attack.name;
    button.classList.add("attack");
    button.id = attack.id;
    document.querySelector("#attacksBox").append(button);
  });

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
              } else {
                queue.shift();
                document.querySelector("#dialogueBox").style.display = "none";
              }
            });
          } else {
            battle.faintPokemon(
              enemyTeam[currentEnemy],
              queue,
              battleAnimationId
            );
          }
        });

        // apply any end turn damage
        /* queue.push(() => {
          if (playerTeam[currentPlayer].status === "burned") {
            queue.push(() => {
              battle.applyEndDamage(playerTeam[currentPlayer], renderedSprites);
            });
          }

          if (enemyTeam[currentEnemy].status === "burned") {
            queue.push(() => {
              battle.applyEndDamage(enemyTeam[currentEnemy], renderedSprites);
            });
          }
        }); */
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
              } else {
                queue.shift();
                document.querySelector("#dialogueBox").style.display = "none";
              }
            });
          } else {
            battle.faintPokemon(
              playerTeam[currentPlayer],
              queue,
              battleAnimationId
            );
          }
        });

        // apply any end turn damage
        /* queue.push(() => {
          if (enemyTeam[currentEnemy].status === "burned") {
            queue.push(() => {
              battle.applyEndDamage(enemyTeam[currentEnemy], renderedSprites);
            });
          }

          if (playerTeam[currentPlayer].status === "burned") {
            queue.push(() => {
              battle.applyEndDamage(playerTeam[currentPlayer], renderedSprites);
            });
          }
        }); */
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

function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle);

  reDraw();
  renderedSprites.forEach((sprite) => {
    sprite.draw(c);
  });
}

// starts game when user clicks screen
addEventListener("click", () => {
  if (!clicked) {
    audio.battle.play();
    clicked = true;
    startGame();
  }
});
