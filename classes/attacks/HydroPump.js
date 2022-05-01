import Sprite from "../Sprite.js";
import Attack from "../Attack.js";

export default class HydroPump extends Attack {
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

  // us the move
  useMove(attackStat, recipient, renderedSprites) {
    let moveHit = 1;

    // use up pp
    this.pp -= 1;

    if (!this.hit(this.acc)) moveHit = 0;

    // calc damage
    let damage = this.damageCalc(attackStat, this.type, recipient);

    if (damage <= 0) moveHit = 2;

    if (moveHit !== 1) return moveHit;

    const hydroPumpImage = new Image();
    hydroPumpImage.src = "./img/attacks/hydropumpStart.png";
    const hydroPump = new Sprite({
      position: {
        x: recipient.position.x,
        y: recipient.position.y + 25,
      },
      backSprite: hydroPumpImage,
      size: recipient.size,
      frames: {
        max: 4,
        hold: 10,
      },
      animate: true,
    });

    const hydroPumpEndImage = new Image();
    hydroPumpEndImage.src = "./img/attacks/hydropumpEnd.png";
    const hydroPumpEnd = new Sprite({
      position: {
        x: recipient.position.x,
        y: recipient.position.y + 25,
      },
      backSprite: hydroPumpEndImage,
      size: recipient.size,
      frames: {
        max: 2,
        hold: 10,
      },
      animate: true,
    });
    hydroPumpEnd.opacity = 0;

    const hydroPump2 = new Sprite({
      position: {
        x: recipient.position.x + 100,
        y: recipient.position.y + 25,
      },
      backSprite: hydroPumpImage,
      size: recipient.size,
      frames: {
        max: 4,
        hold: 10,
      },
      animate: true,
    });

    const hydroPumpEnd2 = new Sprite({
      position: {
        x: recipient.position.x + 100,
        y: recipient.position.y + 25,
      },
      backSprite: hydroPumpEndImage,
      size: recipient.size,
      frames: {
        max: 2,
        hold: 10,
      },
      animate: true,
    });
    hydroPumpEnd2.opacity = 0;

    renderedSprites.splice(2, 0, hydroPumpEnd);
    renderedSprites.splice(2, 0, hydroPump);
    renderedSprites.splice(2, 0, hydroPumpEnd2);
    renderedSprites.splice(2, 0, hydroPump2);

    const t = gsap.timeline();
    t.to(hydroPump, {
      duration: 0.2,
      repeat: 1,
      onComplete: () => {
        hydroPump.opacity = 0;
        hydroPumpEnd.opacity = 1;

        gsap.to(hydroPumpEnd, {
          duration: 1,
          repeat: 1,
          onComplete: () => {
            hydroPumpEnd.opacity = 0;
            hydroPump.opacity = 1;
          },
        });
      },
    }).to(
      hydroPump2,
      {
        duration: 0.2,
        repeat: 1,
        onComplete: () => {
          hydroPump2.opacity = 0;
          hydroPumpEnd2.opacity = 1;

          gsap.to(hydroPumpEnd2, {
            duration: 1,
            repeat: 1,
            onComplete: () => {
              hydroPumpEnd2.opacity = 0;
              hydroPump2.opacity = 1;

              this.hitAndDamage(recipient, damage);

              renderedSprites.splice(2, 1);
              renderedSprites.splice(2, 1);
              renderedSprites.splice(2, 1);
              renderedSprites.splice(2, 1);
            },
          });
        },
      },
      "<"
    );

    return moveHit;
  }
}
