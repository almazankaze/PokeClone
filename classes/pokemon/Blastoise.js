import Pokemon from "../Pokemon.js";
import Tackle from "../attacks/Tackle.js";
import Flamethrower from "../attacks/Flamethrower.js";

export default class Blastoise extends Pokemon {
  constructor({
    name,
    health,
    attacks,
    types,
    status = "healthy",
    stats,
    didHit = false,
    isEnemy = false,
    position,
    frontSprite,
    backSprite,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    rotation = 0,
    size,
  }) {
    super({
      name,
      health,
      types,
      status,
      stats,
      didHit,
      isEnemy,
      position,
      frontSprite,
      backSprite,
      frames,
      sprites,
      animate,
      rotation,
      size,
    });

    this.attacks = attacks;
    this.tackle = new Tackle(attacks[0]);
    this.flamethrower = new Flamethrower(attacks[1]);
  }

  getMovePP(attack) {
    switch (attack.name) {
      case "TACKLE":
        return this.tackle.pp;
      case "FLAMETHROWER":
        return this.flamethrower.pp;
    }
  }

  attack({ attack, recipient, renderedSprites }) {
    // display dialogueBox
    let a = recipient.isEnemy ? "" : "Enemy";
    document.querySelector("#dialogueBox").style.display = "block";
    document.querySelector("#dialogueBox").innerHTML =
      a + " " + this.name + " used " + attack.name + "!";

    document.querySelector("#menu").classList.add("loading");

    let rotation = 1;
    if (this.isEnemy) rotation = -2.2;

    switch (attack.name) {
      case "FLAMETHROWER":
        this.didHit = this.flamethrower.useMove(
          this.position,
          this.stats[3],
          recipient,
          renderedSprites
        );
        break;
      case "TACKLE":
        this.didHit = this.tackle.useMove(
          this.position,
          this.stats[1],
          recipient
        );
        break;
    }

    if (!this.didHit) {
      document.querySelector("#menu").classList.remove("loading");
    }
  }

  getWeakness(attackType) {
    switch (attackType) {
      case "Grass":
      case "Electric":
        return 2;
      case "Water":
      case "Steel":
      case "Fire":
      case "Ice":
        return 0.5;
      default:
        return 1;
    }
  }
}
