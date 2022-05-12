import Sprite from "../Sprite.js";
import Attack from "../Attack.js";

export default class SeismicToss extends Attack {
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

    const tossImg = new Image();
    tossImg.src = "./img/attacks/toss.png";
    const toss = new Sprite({
      position: {
        x: recipient.position.x + 30,
        y: recipient.position.y + 60,
      },
      backSprite: tossImg,
      size: recipient.size,
    });

    recipient.opacity = 0;

    renderedSprites.splice(2, 0, toss);

    const t = gsap.timeline({ paused: true });

    t.to(toss.position, {
      y: recipient.position.y - 80,
    }).to(toss.position, {
      y: recipient.position.y + 60,
    });

    const parent = gsap.timeline();

    parent.to(t, {
      progress: 1,
      duration: 2,
      ease: "power3.in",
      onComplete: () => {
        recipient.opacity = 1;
        this.hitAndDamage(recipient, damage);
        renderedSprites.splice(2, 1);
      },
    });

    return moveHit;
  }
}
