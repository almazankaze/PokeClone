import Pokemon from "../Pokemon.js";
import Flamethrower from "../attacks/Flamethrower.js";
import BodySlam from "../attacks/BodySlam.js";
import Earthquake from "../attacks/Earthquake.js";
import SwordDance from "../attacks/SwordDance.js";

export default class Charizard extends Pokemon {
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
    this.bodySlam = new BodySlam(attacks[0]);
    this.flamethrower = new Flamethrower({ ...attacks[1], isStab: true });
    this.earthQuake = new Earthquake(attacks[2]);
    this.swordDance = new SwordDance(attacks[3]);
  }

  getMovePP(attack) {
    switch (attack.name) {
      case "FLAMETHROWER":
        return this.flamethrower.pp;
      case "BODY SLAM":
        return this.bodySlam.pp;
      case "EARTHQUAKE":
        return this.earthQuake.pp;
      case "SWORD DANCE":
        return this.swordDance.pp;
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
      case "BODY SLAM":
        this.didHit = this.bodySlam.useMove(
          this.position,
          this.stats[1],
          recipient
        );
        break;
      case "EARTHQUAKE":
        this.didHit = this.earthQuake.useMove(
          this.position,
          this.stats[1],
          recipient
        );
        break;
      case "SWORD DANCE":
        this.stages[1] = this.swordDance.useMove(
          this.position,
          this.size,
          this.stages[1],
          renderedSprites
        );
        this.didHit = true;
        break;
    }

    if (!this.didHit) {
      document.querySelector("#menu").classList.remove("loading");
    }
  }

  getWeakness(attackType) {
    switch (attackType) {
      case "Rock":
        return 4;
      case "Water":
      case "Electric":
        return 2;
      case "Ground":
        return 0;
      case "Bug":
      case "Grass":
        return 0.25;
      case "Fighting":
      case "Steel":
      case "Fire":
      case "Fairy":
        return 0.5;
      default:
        return 1;
    }
  }
}
