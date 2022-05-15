import Sprite from "../Sprite.js";
import Attack from "../Attack.js";
import { audio } from "../../data/audio.js";

export default class ThunderBolt extends Attack {
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
  useMove(attackStat, mult, recipient, renderedSprites) {
    let moveHit = 1;

    // use up pp
    this.pp -= 1;

    if (!this.hit(this.acc)) moveHit = 0;

    // calc damage
    let damage = this.damageCalc(attackStat, mult, this.type, recipient);

    if (damage <= 0) moveHit = 2;

    if (moveHit !== 1) return moveHit;

    const ThunderBoltImg = new Image();
    ThunderBoltImg.src = "./img/attacks/thunderbolt.png";
    const thunderBolt = new Sprite({
      position: {
        x: recipient.position.x + 10,
        y: recipient.position.y + 20,
      },
      backSprite: ThunderBoltImg,
      size: recipient.size,
    });

    renderedSprites.splice(2, 0, thunderBolt);

    audio.thunderBolt.play();

    gsap.to(thunderBolt, {
      opacity: 0,
      repeat: 20,
      yoyo: true,
      duration: 0.12,
      onComplete: () => {
        this.hitAndDamage(recipient, damage);
        renderedSprites.splice(2, 1);
      },
    });

    return moveHit;
  }
}
