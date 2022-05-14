import Pokemon from "../Pokemon.js";
import Rest from "../attacks/Rest.js";
import ThunderBolt from "../attacks/ThunderBolt.js";
import DoubleKick from "../attacks/DoubleKick.js";
import ThunderWave from "../attacks/ThunderWave.js";

export default class Jolteon extends Pokemon {
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
    this.rest = new Rest(attacks[0]);
    this.thunderBolt = new ThunderBolt({ ...attacks[1], isStab: true });
    this.doubleKick = new DoubleKick(attacks[2]);
    this.thunderWave = new ThunderWave(attacks[3]);
  }

  getMovePP(attack) {
    switch (attack.name) {
      case "REST":
        return this.rest.pp;
      case "THUNDERBOLT":
        return this.thunderBolt.pp;
      case "DOUBLE KICK":
        return this.doubleKick.pp;
      case "THUNDERWAVE":
        return this.thunderWave.pp;
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
      case "REST":
        this.didHit = this.rest.useMove(this.health, this.stats[0]);

        if (this.didHit === 1) {
          this.recoverHealth(this.stats[0]);
          this.status = "sleeping";
          this.sleepCounter = 2;

          if (this.isEnemy)
            document.querySelector("#enemyStatus").innerHTML = "SLP";
          else document.querySelector("#playerStatus").innerHTML = "SLP";
        }

        break;
      case "THUNDERBOLT":
        mult = this.getMultiplier(this.stages[3]);
        this.didHit = this.thunderBolt.useMove(
          this.stats[3],
          mult,
          recipient,
          renderedSprites
        );
        break;
      case "DOUBLE KICK":
        mult = this.getMultiplier(this.stages[1]);
        this.didHit = this.doubleKick.useMove(
          this.stats[1],
          mult,
          recipient,
          renderedSprites
        );

        break;
      case "THUNDERWAVE":
        this.didHit = this.thunderWave.useMove(recipient, renderedSprites);
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
}
