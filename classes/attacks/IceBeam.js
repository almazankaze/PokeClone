import Sprite from "../Sprite.js";
import Attack from "../Attack.js";

export default class IceBeam extends Attack {
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
    let moveHit = 1;

    // use up pp
    this.pp -= 1;

    if (!this.hit(this.acc)) moveHit = 0;

    // calc damage
    let damage = this.damageCalc(attackStat, this.type, recipient);

    if (damage <= 0) moveHit = 2;

    if (moveHit !== 1) return moveHit;

    let rotation = -3.15;
    if (recipient.isEnemy) rotation = 1;

    const beamImg = new Image();
    beamImg.src = "./img/attacks/beam.png";
    const beam = new Sprite({
      position: {
        x: attackerPos.x - 20,
        y: attackerPos.y + 170,
      },
      backSprite: beamImg,
      size: recipient.size,
      rotation,
      frames: {
        max: 4,
        hold: 10,
      },
      animate: true,
    });

    const iceImg = new Image();
    iceImg.src = "./img/attacks/ice.png";
    const ice = new Sprite({
      position: {
        x: recipient.position.x,
        y: recipient.position.y + 75,
      },
      backSprite: iceImg,
      size: recipient.size,
      frames: {
        max: 4,
        hold: 10,
      },
      animate: true,
    });

    renderedSprites.splice(2, 0, beam);

    gsap.to(beam, {
      duration: 0.6,
      onComplete: () => {
        renderedSprites.splice(2, 1);
        renderedSprites.splice(2, 0, ice);

        gsap.to(ice, {
          duration: 0.6,
          onComplete: () => {
            this.hitAndDamage(recipient, damage);
            renderedSprites.splice(2, 1);
          },
        });
      },
    });

    return true;
  }
}
