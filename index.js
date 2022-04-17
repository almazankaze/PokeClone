import Pokemon from "./classes/Pokemon.js";
import { attacks } from "./data/attacks.js";
import { pokemon } from "./data/pokemon.js";
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

let charizard;
let blastoise;

document.querySelector("#dialogueBox").addEventListener("click", (e) => {
  if (queue.length > 0) {
    queue[0]();
    queue.shift();
  } else e.currentTarget.style.display = "none";
});

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
    blastoise.reDraw(2, 195, 0);
    charizard.reDraw(2, 15, 92);
  } else {
    canvas.width = 480;
    canvas.height = 432;
    blastoise.reDraw(3, 300, 0);
    charizard.reDraw(3, 25, 128);
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

  charizard = new Pokemon(pokemon.Charizard);
  blastoise = new Pokemon({ ...pokemon.Blastoise, isEnemy: true });

  // display names
  document.querySelector("#playerName").innerHTML = charizard.name;
  document.querySelector("#enemyName").innerHTML = blastoise.name;

  queue = [];

  renderedSprites = [charizard, blastoise];

  // add a button for each of the player's attacks
  charizard.attacks.forEach((attack) => {
    const button = document.createElement("button");
    button.innerHTML = attack.name;
    document.querySelector("#attacksBox").append(button);
  });

  // add event listener to all attacks
  document.querySelectorAll("button").forEach((b) => {
    b.addEventListener("click", (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML];
      charizard.attack({
        attack: selectedAttack,
        recipient: blastoise,
        renderedSprites,
      });

      if (blastoise.health <= 0) {
        queue.push(() => {
          blastoise.faint();
        });

        queue.push(() => {
          // fade back to black
          gsap.to("#transitionBg", {
            opacity: 1,
            onComplete: () => {
              cancelAnimationFrame(battleAnimationId);
              document.querySelector("#userInterface").style.display = "none";
            },
          });
        });

        // return;
      }

      // random attack
      const randomAttack =
        blastoise.attacks[Math.floor(Math.random() * blastoise.attacks.length)];

      queue.push(() => {
        blastoise.attack({
          attack: randomAttack,
          recipient: charizard,
          renderedSprites,
        });

        if (charizard.health <= 0) {
          queue.push(() => {
            charizard.faint();
          });

          queue.push(() => {
            // fade back to black
            gsap.to("#transitionBg", {
              opacity: 1,
              onComplete: () => {
                cancelAnimationFrame(battleAnimationId);
                document.querySelector("#userInterface").style.display = "none";
              },
            });
          });
        }
      });
    });

    b.addEventListener("mouseenter", (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML];
      document.querySelector("#attackType").innerHTML = selectedAttack.type;
      document.querySelector("#attackType").style.color = selectedAttack.color;
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
