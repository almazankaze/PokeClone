import Pokemon from "../Pokemon.js";
import ThunderBolt from "../attacks/ThunderBolt.js";
import Recover from "../attacks/Recover.js";
import SeismicToss from "../attacks/SeismicToss.js";
import Psychic from "../attacks/Psychic.js";

export default class Alakazam extends Pokemon {
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
    this.recover = new Recover(attacks[1]);
    this.seismicToss = new SeismicToss(attacks[2]);
    this.psychic = new Psychic({ ...attacks[3], isStab: true });
  }

  getMovePP(attack) {
    switch (attack.name) {
      case "PSYCHIC":
        return this.psychic.pp;
      case "THUNDERBOLT":
        return this.thunderBolt.pp;
      case "RECOVER":
        return this.recover.pp;
      case "SEISMIC TOSS":
        return this.seismicToss.pp;
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
      case "THUNDERBOLT":
        mult = this.getMultiplier(this.stages[3]);
        this.didHit = this.thunderBolt.useMove(
          this.stats[3],
          mult,
          recipient,
          renderedSprites
        );
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
      case "SEISMIC TOSS":
        this.didHit = this.seismicToss.useMove(recipient, renderedSprites);
        break;
    }

    if (this.didHit != 1) {
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
