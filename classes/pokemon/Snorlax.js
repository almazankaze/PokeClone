import Pokemon from "../Pokemon.js";
import Rest from "../attacks/Rest.js";
import BodySlam from "../attacks/BodySlam.js";
import Earthquake from "../attacks/Earthquake.js";
import IceBeam from "../attacks/IceBeam.js";

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
    this.earthQuake = new Earthquake(attacks[0]);
    this.rest = new Rest(attacks[1]);
    this.bodySlam = new BodySlam({ ...attacks[2], isStab: true });
    this.iceBeam = new IceBeam(attacks[3]);
  }

  getMovePP(attack) {
    switch (attack.name) {
      case "EARTHQUAKE":
        return this.earthQuake.pp;
      case "REST":
        return this.rest.pp;
      case "BODY SLAM":
        return this.bodySlam.pp;
      case "ICE BEAM":
        return this.iceBeam.pp;
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
      case "BODY SLAM":
        mult = this.getMultiplier(this.stages[1]);
        this.didHit = this.bodySlam.useMove(
          this.position,
          this.stats[1],
          mult,
          recipient
        );
        break;

      case "ICE BEAM":
        mult = this.getMultiplier(this.stages[3]);
        this.didHit = this.iceBeam.useMove(
          this.position,
          this.stats[3],
          mult,
          recipient,
          renderedSprites
        );
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
