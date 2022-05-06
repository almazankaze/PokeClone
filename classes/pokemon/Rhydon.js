import Pokemon from "../Pokemon.js";
import BodySlam from "../attacks/BodySlam.js";
import Earthquake from "../attacks/Earthquake.js";

export default class Rhydon extends Pokemon {
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
    this.earthQuake = new Earthquake({ ...attacks[0], isStab: true });
    this.bodySlam = new BodySlam(attacks[1]);
  }

  getMovePP(attack) {
    switch (attack.name) {
      case "EARTHQUAKE":
        return this.earthQuake.pp;
      case "BODY SLAM":
        return this.bodySlam.pp;
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
      case "EARTHQUAKE":
        mult = this.getMultiplier(this.stages[1]);
        this.didHit = this.earthQuake.useMove(
          this.position,
          this.stats[1],
          mult,
          recipient
        );
        break;

      case "BODY SLAM":
        mult = this.getMultiplier(this.stages[1]);
        this.didHit = this.bodySlam.useMove(
          this.position,
          this.stats[1],
          mult,
          recipient
        );
        break;
    }

    if (this.didHit !== 1) {
      document.querySelector("#menu").classList.remove("loading");
    }
  }

  getWeakness(attackType) {
    switch (attackType) {
      case "Grass":
      case "Water":
        return 4;
      case "Fighting":
      case "Ground":
      case "Ice":
        return 2;
      case "Electric":
        return 0;
      case "Normal":
      case "Flying":
      case "Fire":
      case "Rock":
        return 0.5;
      case "Poison":
        return 0.25;
      default:
        return 1;
    }
  }
}
