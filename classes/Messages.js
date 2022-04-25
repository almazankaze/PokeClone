import Sprite from "./Sprite.js";

export default class Messages {
  constructor() {}

  effectivenessMess(effectiveness) {
    document.querySelector("#dialogueBox").style.display = "block";

    if (effectiveness > 1)
      document.querySelector("#dialogueBox").innerHTML =
        "It's super effective!";
    else if (effectiveness === 0)
      document.querySelector("#dialogueBox").innerHTML = "It had no effect!";
    else if (effectiveness > 0 && effectiveness < 1)
      document.querySelector("#dialogueBox").innerHTML =
        "It's not very effective!";
  }

  missedMess(pokemon) {
    let enemy = pokemon.isEnemy ? "Enemy" : "";
    document.querySelector("#dialogueBox").style.display = "block";
    document.querySelector("#dialogueBox").innerHTML =
      enemy + " " + pokemon.name + " Missed!";
  }

  immuneMess(pokemon) {
    let enemy = pokemon.isEnemy ? "Enemy" : "";
    document.querySelector("#dialogueBox").style.display = "block";
    document.querySelector("#dialogueBox").innerHTML =
      " It doesn't affect " + enemy + " " + pokemon.name;
    document.querySelector("#menu").classList.remove("loading");
  }

  criticalMess() {
    document.querySelector("#dialogueBox").style.display = "block";
    document.querySelector("#dialogueBox").innerHTML = "It's a critical hit!";
  }

  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  applyStatus(effChance, status, recipient) {
    switch (status) {
      case "burn":
        this.applyBurn(effChance, recipient);
        break;
      case "para":
        this.applyPara(effChance, recipient);
        break;
    }
  }

  // check if move should apply paralysis
  applyPara(effChance, recipient) {
    if (
      this.randomIntFromInterval(1, 100) <= effChance &&
      recipient.status === "healthy"
    ) {
      document.querySelector("#menu").classList.add("loading");
      recipient.status = "paralyzed";
      recipient.stats[4] = recipient.stats[4] / 2;
      this.statusShake(recipient, "paralyzed", "PAR");
    } else {
      document.querySelector("#menu").classList.remove("loading");
    }
  }

  paraMess(pokemon) {
    // display status message
    let enemy = pokemon.isEnemy ? "Enemy " : "";
    document.querySelector("#dialogueBox").style.display = "block";
    document.querySelector("#dialogueBox").innerHTML =
      enemy + pokemon.name + " is fully Paralyzed!";
    document.querySelector("#menu").classList.remove("loading");
  }

  // checks if move should apply burn status
  applyBurn(effChance, recipient) {
    if (
      this.randomIntFromInterval(1, 100) <= effChance &&
      recipient.status === "healthy"
    ) {
      document.querySelector("#menu").classList.add("loading");
      recipient.status = "burned";
      recipient.stats[1] = recipient.stats[1] / 2;
      this.statusShake(recipient, "burned", "BRN");
    } else {
      document.querySelector("#menu").classList.remove("loading");
    }
  }

  burnEffect(pokemon, renderedSprites) {
    document.querySelector("#dialogueBox").style.display = "block";
    document.querySelector("#menu").classList.add("loading");

    document.querySelector("#dialogueBox").innerHTML =
      pokemon.name + " was hurt by burn!";

    let burnDamage = Math.floor(pokemon.stats[0] / 16);

    let pos = 180;
    if (pokemon.isEnemy) pos = -60;

    // create burn sprite
    const burnImage = new Image();
    burnImage.src = "./img/effects/poison.png";
    const burn = new Sprite({
      position: {
        x: pokemon.position.x + pos,
        y: pokemon.position.y,
      },
      backSprite: burnImage,
      size: pokemon.size,
    });

    renderedSprites.splice(2, 0, burn);

    gsap.to(burn.position, {
      x: burn.position.x,
      y: burn.position.y + 40,
      repeat: 1,
      onComplete: () => {
        renderedSprites.splice(2, 1);
        pokemon.reduceHealth(burnDamage);
      },
    });
  }

  // shake pokemon if affected with status
  statusShake(element, status, text) {
    // shake pokemon
    TweenMax.fromTo(
      element.position,
      0.15,
      { x: element.position.x - 5 },
      {
        x: element.position.x + 5,
        repeat: 3,
        yoyo: true,
        ease: Sine.easeInOut,

        // after shaking
        onComplete: () => {
          // display status message
          let a = element.isEnemy ? "Enemy " : "";
          document.querySelector("#dialogueBox").style.display = "block";
          document.querySelector("#dialogueBox").innerHTML =
            a + element.name + " got " + status + "!";
          document.querySelector("#menu").classList.remove("loading");

          if (element.isEnemy)
            document.querySelector("#enemyStatus").innerHTML = text;
          else document.querySelector("#playerStatus").innerHTML = text;
          // return pokemon to old position
          TweenMax.to(element.position, 1.5, {
            x: element.position.x + 5,
            ease: Elastic.easeOut,
          });
        },
      }
    );
  }
}
