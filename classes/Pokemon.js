import Sprite from "./Sprite.js";

export default class Pokemon extends Sprite {
  constructor({
    name,
    health,
    types,
    status = "healthy",
    stats,
    didHit = false,
    gotCrit = false,
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

    this.name = name;
    this.health = health;
    this.types = types;
    this.status = status;
    this.stats = stats;
    this.didHit = didHit;
    this.gotCrit = gotCrit;
  }

  reduceHealth(healthAmount) {
    let healthBar = "#playerHealthBar";
    if (this.isEnemy) healthBar = "#enemyHealthBar";

    this.health -= healthAmount;
    let healthBarWidth = Math.floor((this.health / this.stats[0]) * 100);

    gsap.to(healthBar, {
      width: healthBarWidth + "%",
      duration: 2,

      // after health drops
      onComplete: () => {
        document.querySelector("#menu").classList.remove("loading");
      },
    });
  }

  faint() {
    document.querySelector("#dialogueBox").innerHTML = this.name + " fainted!";
    gsap.to(this.position, {
      y: this.position.y + 20,
    });
    gsap.to(this, {
      opacity: 0,
    });
  }
}
