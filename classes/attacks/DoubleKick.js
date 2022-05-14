import Sprite from "../Sprite.js";
import Attack from "../Attack.js";

export default class DoubleKick extends Attack {
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

  useMove(attackStat, mult, recipient, renderedSprites) {
    let moveHit = 1;

    // use up pp
    this.pp -= 1;

    if (!this.hit(this.acc)) moveHit = 0;

    // calc damage
    let damage = this.damageCalc(attackStat, mult, this.type, recipient);

    if (damage <= 0) moveHit = 2;

    if (moveHit !== 1) return moveHit;

    // create attack sprite
    const hitImg = new Image();
    hitImg.src = "./img/effects/physicalHit.png";
    const hit = new Sprite({
      position: {
        x: recipient.position.x + 10,
        y: recipient.position.y + 20,
      },
      backSprite: hitImg,
      size: recipient.size,
    });

    const hit2 = new Sprite({
      position: {
        x: recipient.position.x + 70,
        y: recipient.position.y + 90,
      },
      backSprite: hitImg,
      size: recipient.size,
    });

    hit.opacity = 1;
    hit2.opacity = 0;

    renderedSprites.splice(2, 0, hit);
    renderedSprites.splice(2, 0, hit2);

    const t = gsap.timeline({ paused: true });

    t.to(hit, {
      ease: "power3.in",
      opacity: 0,
    }).to(hit2, {
      ease: "power3.out",
      opacity: 1,
    });

    const parent = gsap.timeline();

    parent.to(t, {
      progress: 1,
      repeat: 1,
      onComplete: () => {
        this.hitAndDamage(recipient, damage);
        renderedSprites.splice(2, 1);
        renderedSprites.splice(2, 1);
      },
    });

    return moveHit;
  }
}
