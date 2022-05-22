import Sprite from "./Sprite.js";
import { audio } from "../data/audio.js";

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

  failMess() {
    document.querySelector("#dialogueBox").style.display = "block";
    document.querySelector("#dialogueBox").innerHTML = "The move failed!";
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
    if (recipient.health <= 0) return false;

    switch (status) {
      case "burn":
        this.applyBurn(effChance, recipient);
        break;
      case "para":
        return this.applyPara(effChance, recipient);
      case "freeze":
        this.applyFreeze(effChance, recipient);
        break;
    }
  }

  // check if move should apply paralysis
  applyPara(effChance, recipient) {
    if (recipient.types[0] === "Electric") {
      document.querySelector("#menu").classList.remove("loading");
      return false;
    }

    let c = this.randomIntFromInterval(1, 100);

    if (c <= effChance) {
      document.querySelector("#menu").classList.add("loading");
      recipient.status = "paralyzed";
      this.statusShake(recipient, "paralyzed", "PAR");
      return true;
    } else {
      document.querySelector("#menu").classList.remove("loading");
    }

    return false;
  }

  // checks if move should apply burn status
  applyBurn(effChance, recipient) {
    if (recipient.types[0] === "Fire") {
      document.querySelector("#menu").classList.remove("loading");
      return false;
    }

    let c = this.randomIntFromInterval(1, 100);

    if (c <= effChance) {
      document.querySelector("#menu").classList.add("loading");
      recipient.status = "burned";
      this.statusShake(recipient, "burned", "BRN");
      return true;
    } else {
      document.querySelector("#menu").classList.remove("loading");
    }

    return false;
  }

  // check if pokemon should be frozen
  applyFreeze(effChance, recipient) {
    if (recipient.types[0] === "Ice") {
      document.querySelector("#menu").classList.remove("loading");
      return false;
    }

    let c = this.randomIntFromInterval(1, 100);

    if (c <= effChance) {
      document.querySelector("#menu").classList.add("loading");
      recipient.status = "frozen";
      this.statusShake(recipient, "frozen", "FRZ");
      return true;
    } else {
      document.querySelector("#menu").classList.remove("loading");
    }

    return false;
  }

  sleepMess(pokemon, wokeUp, renderedSprites) {
    // display status message
    let enemy = pokemon.isEnemy ? "Enemy " : "";
    document.querySelector("#dialogueBox").style.display = "block";

    if (wokeUp) {
      document.querySelector("#dialogueBox").innerHTML =
        enemy + pokemon.name + " woke up!";

      document.querySelector("#menu").classList.remove("loading");

      if (pokemon.isEnemy)
        document.querySelector("#enemyStatus").innerHTML = ":L50";
      else document.querySelector("#playerStatus").innerHTML = ":L50";
    } else {
      document.querySelector("#menu").classList.add("loading");
      document.querySelector("#dialogueBox").innerHTML =
        enemy + pokemon.name + " is fast asleep!";

      this.sleepEffect(pokemon, renderedSprites);
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

  frozenMess(pokemon, defrost, renderedSprites) {
    // display status message
    let enemy = pokemon.isEnemy ? "Enemy " : "";
    document.querySelector("#dialogueBox").style.display = "block";

    if (defrost) {
      document.querySelector("#dialogueBox").innerHTML =
        enemy + pokemon.name + " defrosted!";

      document.querySelector("#menu").classList.remove("loading");

      if (pokemon.isEnemy)
        document.querySelector("#enemyStatus").innerHTML = ":L50";
      else document.querySelector("#playerStatus").innerHTML = ":L50";
    } else {
      document.querySelector("#menu").classList.add("loading");
      document.querySelector("#dialogueBox").innerHTML =
        enemy + pokemon.name + " is frozen solid!";

      this.freezeEffect(pokemon, renderedSprites);
    }
  }

  sleepEffect(pokemon, renderedSprites) {
    let pos = 180;
    if (pokemon.isEnemy) pos = -60;

    const sleepImg = new Image();
    sleepImg.src = "./img/effects/sleepIcon.png";
    const sleep = new Sprite({
      position: {
        x: pokemon.position.x + pos,
        y: pokemon.position.y,
      },
      backSprite: sleepImg,
      size: pokemon.size,
    });

    renderedSprites.splice(2, 0, sleep);

    gsap.to(sleep.position, {
      x: sleep.position.x,
      y: sleep.position.y + 40,
      repeat: 1,
      onComplete: () => {
        renderedSprites.splice(2, 1);
        document.querySelector("#menu").classList.remove("loading");
      },
    });
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

    audio.burnEffect.play();

    gsap.to(burn.position, {
      x: burn.position.x,
      y: burn.position.y + 40,

      onComplete: () => {
        renderedSprites.splice(2, 1);
        pokemon.reduceHealth(burnDamage);
      },
    });
  }

  freezeEffect(pokemon, renderedSprites) {
    const iceImg = new Image();
    iceImg.src = "./img/effects/frozen.png";
    const ice = new Sprite({
      position: {
        x: pokemon.position.x,
        y: pokemon.position.y + 75,
      },
      backSprite: iceImg,
      size: pokemon.size,
    });

    renderedSprites.splice(2, 0, ice);

    const t = gsap.timeline({
      onComplete: () => {
        renderedSprites.splice(2, 1);
        document.querySelector("#menu").classList.remove("loading");
      },
    });

    t.to(ice, 0.5, { opacity: 0 }).to(ice, 0.5, { opacity: 1 });
    return;
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
