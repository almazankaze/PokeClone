import Sprite from "../Sprite.js";
import Attack from "../Attack.js";

export default class Flamethrower extends Attack {
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
  useMove(attackerPos, attackStat, recipient, renderedSprites) {
    // use up pp
    this.pp -= 1;

    if (!this.hit(this.acc)) return false;

    // calc damage
    let damage = this.damageCalc(attackStat, this.type, recipient);

    // create attack sprite
    const fireballImage = new Image();
    fireballImage.src = "./img/attacks/Fire.png";
    const fireball = new Sprite({
      position: {
        x: attackerPos.x + 40,
        y: attackerPos.y + 100,
      },
      backSprite: fireballImage,
      size: recipient.size,
    });

    const twinFireImage = new Image();
    twinFireImage.src = "./img/attacks/twinFire.png";
    const twinFire = new Sprite({
      position: {
        x: recipient.position.x,
        y: recipient.position.y + 50,
      },
      backSprite: twinFireImage,
      size: recipient.size,
    });

    renderedSprites.splice(2, 0, fireball);

    // animate sprite
    gsap.to(fireball.position, {
      x: recipient.position.x + 60,
      y: recipient.position.y + 20,
      repeat: 2,

      onComplete: () => {
        renderedSprites.splice(2, 1);
        renderedSprites.splice(2, 0, twinFire);
        gsap.to(twinFire.position, {
          x: recipient.position.x + 80,
          repeat: 1,

          onComplete: () => {
            // Enemy actually gets hit
            gsap.to(recipient.position, {
              x: recipient.position.x + 10,
              yoyo: true,
              repeat: 5,
              duration: 0.08,
            });

            gsap.to(recipient, {
              opacity: 0,
              repeat: 5,
              yoyo: true,
              duration: 0.08,
              onComplete: () => {
                recipient.reduceHealth(damage);
              },
            });
            renderedSprites.splice(2, 1);
          },
        });
      },
    });

    return true;
  }
}
