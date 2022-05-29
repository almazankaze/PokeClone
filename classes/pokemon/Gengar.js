import Pokemon from "../Pokemon.js";
import Psychic from "../attacks/Psychic.js";
import NightShade from "../attacks/NightShade.js";
import Hypnosis from "../attacks/Hypnosis.js";
import MegaDrain from "../attacks/MegaDrain.js";

export default class Gengar extends Pokemon {
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
    this.psychic = new Psychic(attacks[0]);
    this.megaDrain = new MegaDrain(attacks[1]);
    this.hypnosis = new Hypnosis(attacks[2]);
    this.nightShade = new NightShade(attacks[3]);
  }

  getMovePP(attack) {
    switch (attack.name) {
      case "PSYCHIC":
        return this.psychic.pp;
      case "MEGA DRAIN":
        return this.megaDrain.pp;
      case "HYPNOSIS":
        return this.hypnosis.pp;
      case "NIGHT SHADE":
        return this.nightShade.pp;
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
      case "HYPNOSIS":
        this.didHit = this.hypnosis.useMove(recipient, renderedSprites);
        break;
      case "NIGHT SHADE":
        this.didHit = this.nightShade.useMove(recipient);
        break;
    }

    if (this.didHit != 1) {
      document.querySelector("#menu").classList.remove("loading");
    }
  }

  getWeakness(attackType) {
    switch (attackType) {
      case "Ground":
      case "Psychic":
      case "Ghost":
        return 2;
      case "Bug":
      case "Grass":
        return 0.5;
      case "Poison":
        return 0.25;
      case "Normal":
      case "Fighting":
        return 0;
      default:
        return 1;
    }
  }

  getHpToAbsorb() {
    return this.megaDrain.healthToAbsorb;
  }
}
