import Pokemon from "../Pokemon.js";
import ThunderBolt from "../attacks/ThunderBolt.js";
import ThunderWave from "../attacks/ThunderWave.js";
import SeismicToss from "../attacks/SeismicToss.js";
import BodySlam from "../attacks/BodySlam.js";

export default class Electabuzz extends Pokemon {
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
    this.thunderBolt = new ThunderBolt({ ...attacks[0], isStab: true });
    this.thunderWave = new ThunderWave(attacks[1]);
    this.seismicToss = new SeismicToss(attacks[2]);
    this.bodySlam = new BodySlam(attacks[3]);
  }

  getMovePP(attack) {
    switch (attack.name) {
      case "THUNDERBOLT":
        return this.thunderBolt.pp;
      case "THUNDERWAVE":
        return this.thunderWave.pp;
      case "SEISMIC TOSS":
        return this.seismicToss.pp;
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
      case "THUNDERBOLT":
        mult = this.getMultiplier(this.stages[3]);
        this.didHit = this.thunderBolt.useMove(
          this.stats[3],
          mult,
          recipient,
          renderedSprites
        );
        break;
      case "THUNDERWAVE":
        this.didHit = this.thunderWave.useMove(recipient, renderedSprites);
        break;
      case "SEISMIC TOSS":
        this.didHit = this.seismicToss.useMove(recipient, renderedSprites);
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

    if (this.didHit != 1) {
      document.querySelector("#menu").classList.remove("loading");
    }
  }

  getWeakness(attackType) {
    switch (attackType) {
      case "Ground":
        return 2;
      case "Flying":
      case "Electric":
        return 0.5;
      default:
        return 1;
    }
  }

  chooseMove() {
    return Math.floor(Math.random() * 4);
  }
}
