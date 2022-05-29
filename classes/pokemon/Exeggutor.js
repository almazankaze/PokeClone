import Pokemon from "../Pokemon.js";
import Psychic from "../attacks/Psychic.js";
import Stomp from "../attacks/Stomp.js";
import SleepPowder from "../attacks/SleepPowder.js";
import MegaDrain from "../attacks/MegaDrain.js";

export default class Exeggutor extends Pokemon {
  constructor({
    name,
    health,
    attacks,
    types,
    status = "healthy",
    stats,
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
    this.psychic = new Psychic({ ...attacks[0], isStab: true });
    this.stomp = new Stomp(attacks[1]);
    this.sleepPowder = new SleepPowder(attacks[2]);
    this.megaDrain = new MegaDrain({ ...attacks[3], isStab: true });
  }

  getMovePP(attack) {
    switch (attack.name) {
      case "PSYCHIC":
        return this.psychic.pp;
      case "STOMP":
        return this.stomp.pp;
      case "SLEEP POWDER":
        return this.sleepPowder.pp;
      case "MEGA DRAIN":
        return this.megaDrain.pp;
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

    let mult;

    switch (attack.name) {
      case "PSYCHIC":
        mult = this.getMultiplier(this.stages[3]);
        this.didHit = this.psychic.useMove(this.stats[3], mult, recipient);
        break;
      case "STOMP":
        mult = this.getMultiplier(this.stages[1]);
        this.didHit = this.stomp.useMove(
          this.stats[1],
          mult,
          recipient,
          renderedSprites
        );
        break;
      case "SLEEP POWDER":
        this.didHit = this.sleepPowder.useMove(recipient, renderedSprites);
        break;
      case "MEGA DRAIN":
        mult = this.getMultiplier(this.stages[3]);
        this.didHit = this.megaDrain.useMove(
          this.position,
          this.stats[3],
          mult,
          recipient,
          renderedSprites
        );
        break;
    }

    if (this.didHit != 1) {
      document.querySelector("#menu").classList.remove("loading");
    }
  }

  getWeakness(attackType) {
    switch (attackType) {
      case "Bug":
        return 4;
      case "Fire":
      case "Ice":
      case "Poison":
      case "Flying":
      case "Ghost":
        return 2;
      case "Water":
      case "Electric":
      case "Grass":
      case "Fighting":
      case "Ground":
      case "Psychic":
        return 0.5;
      default:
        return 1;
    }
  }

  chooseMove() {
    return Math.floor(Math.random() * 4);
  }

  getHpToAbsorb() {
    return this.megaDrain.healthToAbsorb;
  }
}
