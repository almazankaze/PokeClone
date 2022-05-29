import Sprite from "../Sprite.js";
import Attack from "../Attack.js";
import { audio } from "../../data/audio.js";

export default class DragonRage extends Attack {
  constructor({
    name,
    type,
    pp,
    acc,
    power,
    moveType,
    targetStat,
    status,
    isStab = false,
  }) {
    super({
      name,
      type,
      pp,
      acc,
      power,
      moveType,
      targetStat,
      status,
      isStab,
    });
  }

  // us the move
  useMove(recipient, renderedSprites) {
    let moveHit = 1;

    // use up pp
    this.pp -= 1;

    if (!this.hit(this.acc)) moveHit = 0;

    // calc damage
    let damage = this.damageCalc(0, 0, this.type, recipient);

    if (damage <= 0) moveHit = 2;

    if (moveHit !== 1) return moveHit;

    const fireImg = new Image();
    fireImg.src = "./img/attacks/dragonRage.png";
    const fire = new Sprite({
      position: {
        x: recipient.position.x + 5,
        y: recipient.position.y + 35,
      },
      backSprite: fireImg,
      size: recipient.size,
      frames: {
        max: 3,
        hold: 10,
      },
      animate: true,
    });

    renderedSprites.splice(2, 0, fire);

    audio.dragonRage.play();

    gsap.to(fire, {
      duration: 0.5,
      repeat: 2,
      onComplete: () => {
        renderedSprites.splice(2, 1);
        audio.dragonRage.stop();
        this.hitAndDamage(recipient, damage);
      },
    });

    return moveHit;
  }
}
