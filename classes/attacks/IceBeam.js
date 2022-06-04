import Sprite from "../Sprite.js";
import Attack from "../Attack.js";
import { audio } from "../../data/audio.js";

export default class IceBeam extends Attack {
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
  useMove(attackerPos, attackStat, mult, recipient, renderedSprites) {
    let moveHit = 1;

    // use up pp
    this.pp -= 1;

    if (!this.hit(this.acc)) moveHit = 0;

    // calc damage
    let damage = this.damageCalc(attackStat, mult, this.type, recipient);

    if (damage <= 0) moveHit = 2;

    if (moveHit !== 1) return moveHit;

    let y = 75;

    if (recipient.size === 2) y = 45;

    let rotation = 0;
    let pX = 100;
    let pY = -40;
    if (!recipient.isEnemy) {
      rotation = -3.15;
      pX = -20;
      pY = 170;
    }

    const beamImg = new Image();
    beamImg.src = "./img/attacks/beam.png";
    const beam = new Sprite({
      position: {
        x: attackerPos.x + pX,
        y: attackerPos.y + pY,
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
        y: recipient.position.y + y,
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

    audio.iceBeam.play();

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

    return moveHit;
  }
}
