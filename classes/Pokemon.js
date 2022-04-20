import Sprite from "./Sprite.js";

export default class Pokemon extends Sprite {
  constructor({
    name,
    health,
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
