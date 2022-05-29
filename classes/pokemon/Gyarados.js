import Pokemon from "../Pokemon.js";
import HydroPump from "../attacks/HydroPump.js";
import ThunderBolt from "../attacks/ThunderBolt.js";

export default class Gyarados extends Pokemon {
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
    this.thunderBolt = new ThunderBolt(attacks[0]);
    this.hydroPump = new HydroPump({ ...attacks[1], isStab: true });
  }

  getMovePP(attack) {
    switch (attack.name) {
      case "THUNDERBOLT":
        return this.thunderBolt.pp;
      case "HYDRO PUMP":
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

    let mult;

    switch (attack.name) {
      case "THUNDERBOLT":
        mult = this.getMultiplier(this.stages[3]);
        this.didHit = this.thunderBolt.useMove(
          this.stats[3],
          mult,
          recipient,
          renderedSprites
        );
        break;
      case "HYDRO PUMP":
        mult = this.getMultiplier(this.stages[3]);
        this.didHit = this.hydroPump.useMove(
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
      case "Electric":
        return 4;
      case "Rock":
        return 2;
      case "Water":
      case "Bug":
      case "Fire":
      case "Fighting":
        return 0.5;
      case "Ground":
        return 0;
      default:
        return 1;
    }
  }
}
