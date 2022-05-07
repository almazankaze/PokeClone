import Sprite from "../Sprite.js";
import Attack from "../Attack.js";

export default class RockSlide extends Attack {
  constructor({
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

  useMove(attackerPos, attackStat, mult, recipient, renderedSprites) {
    let moveHit = 1;

    // use up pp
    this.pp -= 1;

    if (!this.hit(this.acc)) moveHit = 0;

    // calc damage
    let damage = this.damageCalc(attackStat, mult, this.type, recipient);

    if (damage <= 0) moveHit = 2;

    if (moveHit !== 1) return moveHit;

    // create attack sprite
    const rockSlideImage = new Image();
    rockSlideImage.src = "./img/attacks/rockSlide.png";
    const rockSlide = new Sprite({
      position: {
        x: attackerPos.x,
        y: attackerPos.y + 80,
      },
      backSprite: rockSlideImage,
      size: recipient.size,
    });

    renderedSprites.splice(2, 0, rockSlide);

    const t = gsap.timeline({ paused: true });

    t.to(rockSlide.position, {
      y: attackerPos.y,
    }).to(rockSlide.position, {
      x: recipient.position.x,
      y: recipient.position.y + 80,
    });

    const parent = gsap.timeline();

    parent.to(t, {
      progress: 1,
      duration: 2.5,
      ease: "power3.in",
      onComplete: () => {
        this.hitAndDamage(recipient, damage);
        renderedSprites.splice(2, 1);
      },
    });

    return moveHit;
  }
}
