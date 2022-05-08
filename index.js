import Charizard from "./classes/pokemon/Charizard.js";
import Snorlax from "./classes/pokemon/Snorlax.js";
import Blastoise from "./classes/pokemon/Blastoise.js";
import Rhydon from "./classes/pokemon/Rhydon.js";
import { attacks } from "./data/attacks.js";
import { pokemon } from "./data/pokemon.js";
import Battle from "./classes/Battle.js";
import { audio } from "./data/audio.js";

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
let currentEnemy = 0;

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
    // blastoise.reDraw(2, 195, 0);
    // charizard.reDraw(2, 15, 92);
    enemyTeam[currentEnemy].reDraw(2, 195, 0);
    playerTeam[currentPlayer].reDraw(2, 15, 92);
  } else {
    canvas.width = 480;
    canvas.height = 432;
    // blastoise.reDraw(3, 300, 0);
    // charizard.reDraw(3, 25, 128);
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
  document.querySelector("#attacksBox").replaceChildren();

  // charizard = new Snorlax(pokemon.Snorlax);
  // blastoise = new Rhydon({ ...pokemon.Rhydon, isEnemy: true });

  playerTeam = [new Snorlax(pokemon.Snorlax), new Charizard(pokemon.Charizard)];
  enemyTeam = [
    new Rhydon({ ...pokemon.Rhydon, isEnemy: true }),
    new Blastoise({ ...pokemon.Blastoise, isEnemy: true }),
  ];

  // display names
  document.querySelector("#playerName").innerHTML =
    playerTeam[currentPlayer].name;
  document.querySelector("#enemyName").innerHTML = enemyTeam[currentEnemy].name;

  queue = [];

  renderedSprites = [playerTeam[currentPlayer], enemyTeam[currentEnemy]];

  // add a button for each of the player's attacks
  playerTeam[currentPlayer].attacks.forEach((attack) => {
    const button = document.createElement("button");
    button.innerHTML = attack.name;
    button.id = attack.id;
    document.querySelector("#attacksBox").append(button);
  });

  // add event listener to all attacks
  document.querySelectorAll("button").forEach((b) => {
    b.addEventListener("click", (e) => {
      let speedWinner;
      const selectedAttack = attacks[e.currentTarget.id];

      // random attack
      //const randomAttack =
      //blastoise.attacks[Math.floor(Math.random() * blastoise.attacks.length)];
      const randomAttack = enemyTeam[currentEnemy].attacks[3];

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

        // check if any pokemon fainted this turn
        queue.push(() => {
          battle.checkFainted(
            playerTeam[currentPlayer],
            enemyTeam[currentEnemy],
            queue,
            battleAnimationId
          );
        });

        // blastoise turn
        queue.push(() => {
          if (enemyTeam[currentEnemy].status !== "fainted") {
            battle.takeTurn(
              enemyTeam[currentEnemy],
              randomAttack,
              playerTeam[currentPlayer],
              renderedSprites,
              queue
            );
          }

          // check if any pokemon fainted this turn
          queue.push(() => {
            battle.checkFainted(
              enemyTeam[currentEnemy],
              playerTeam[currentPlayer],
              queue,
              battleAnimationId
            );
          });
        });

        // apply any end turn damage
        queue.push(() => {
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

        // check if any pokemon fainted this turn
        queue.push(() => {
          battle.checkFainted(
            enemyTeam[currentEnemy],
            playerTeam[currentPlayer],
            queue,
            battleAnimationId
          );
        });

        // charizard turn
        queue.push(() => {
          if (playerTeam[currentPlayer].status !== "fainted") {
            battle.takeTurn(
              playerTeam[currentPlayer],
              selectedAttack,
              enemyTeam[currentEnemy],
              renderedSprites,
              queue
            );
          }

          // check if any pokemon fainted this turn
          queue.push(() => {
            battle.checkFainted(
              playerTeam[currentPlayer],
              enemyTeam[currentEnemy],
              queue,
              battleAnimationId
            );
          });
        });

        // apply any end turn damage
        queue.push(() => {
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
        });
      }

      if (playerTeam[currentPlayer].getMovePP(selectedAttack) <= 0) {
        b.disabled = true;
      }
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
