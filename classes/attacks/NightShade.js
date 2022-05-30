import Attack from "../Attack.js";
import { audio } from "../../data/audio.js";

export default class NightShade extends Attack {
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
  useMove(recipient) {
    let moveHit = 1;

    // use up pp
    this.pp -= 1;

    if (!this.hit(this.acc)) moveHit = 0;

    // calc damage
    let damage = this.damageCalc(0, 0, this.type, recipient);

    if (damage <= 0) moveHit = 2;

    if (moveHit !== 1) return moveHit;

    audio.nightShade.play();

    gsap.to("#transitionBg", {
      opacity: 1,
      repeat: 1,
      yoyo: true,
      duration: 0.4,
      onComplete: () => {
        gsap.to("#transitionBg", {
          opacity: 1,
          duration: 0.4,
          onComplete: () => {
            this.hitAndDamage(recipient, damage);
            gsap.to("#transitionBg", {
              opacity: 0,
              duration: 0.4,
            });
          },
        });
      },
    });

    return moveHit;
  }
}
