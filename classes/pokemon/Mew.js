import Pokemon from "../Pokemon.js";
import BodySlam from "../attacks/BodySlam.js";
import Earthquake from "../attacks/Earthquake.js";
import SwordDance from "../attacks/SwordDance.js";
import Recover from "../attacks/Recover.js";

export default class Mew extends Pokemon {
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
    this.swordDance = new SwordDance(attacks[0]);
    this.earthQuake = new Earthquake(attacks[1]);
    this.bodySlam = new BodySlam(attacks[2]);
    this.recover = new Recover(attacks[3]);
  }

  getMovePP(attack) {
    switch (attack.name) {
      case "BODY SLAM":
        return this.bodySlam.pp;
      case "EARTHQUAKE":
        return this.earthQuake.pp;
      case "SWORD DANCE":
        return this.swordDance.pp;
      case "RECOVER":
        return this.recover.pp;
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
      case "BODY SLAM":
        mult = this.getMultiplier(this.stages[1]);
        this.didHit = this.bodySlam.useMove(
          this.position,
          this.stats[1],
          mult,
          recipient
        );
        break;
      case "EARTHQUAKE":
        mult = this.getMultiplier(this.stages[1]);
        this.didHit = this.earthQuake.useMove(
          this.position,
          this.stats[1],
          mult,
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
        this.didHit = 1;
        break;
      case "RECOVER":
        this.didHit = this.recover.useMove(this.health, this.stats[0]);

        if (this.didHit === 1) {
          gsap.to(this, {
            opacity: 0,
            repeat: 10,
            yoyo: true,
            duration: 0.1,
            onComplete: () => {
              this.opacity = 1;
              this.recoverHealth(Math.floor(this.stats[0] / 2));
            },
          });
        }
        break;
    }

    if (this.didHit !== 1) {
      document.querySelector("#menu").classList.remove("loading");
    }
  }

  getWeakness(attackType) {
    switch (attackType) {
      case "Bug":
      case "Ghost":
        return 2;
      case "Fighting":
      case "Psychic":
        return 0.5;
      default:
        return 1;
    }
  }
}
