import Pokemon from "../Pokemon.js";
import BodySlam from "../attacks/BodySlam.js";
import Earthquake from "../attacks/Earthquake.js";
import HydroPump from "../attacks/HydroPump.js";

export default class Blastoise extends Pokemon {
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
    this.earthQuake = new Earthquake(attacks[0]);
    this.bodySlam = new BodySlam(attacks[1]);
    this.hydroPump = new HydroPump({ ...attacks[2], isStab: true });
  }

  getMovePP(attack) {
    switch (attack.name) {
      case "EARTHQUAKE":
        return this.earthQuake.pp;
      case "BODY SLAM":
        return this.bodySlam.pp;
      case "Hydro Pump":
        return this.hydroPump.pp;
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
      case "EARTHQUAKE":
        this.didHit = this.earthQuake.useMove(
          this.position,
          this.stats[1],
          recipient
        );
        break;
      case "BODY SLAM":
        this.didHit = this.bodySlam.useMove(
          this.position,
          this.stats[1],
          recipient
        );
        break;
      case "Hydro Pump":
        this.didHit = this.hydroPump.useMove(
          this.stats[3],
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
