import Attack from "../Attack.js";
import { audio } from "../../data/audio.js";

export default class Earthquake extends Attack {
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
  useMove(attackerPos, attackStat, mult, recipient) {
    let moveHit = 1;

    // use up pp
    this.pp -= 1;

    if (!this.hit(this.acc)) moveHit = 0;

    // calc damage
    let damage = this.damageCalc(attackStat, mult, this.type, recipient);

    if (damage <= 0) moveHit = 2;

    if (moveHit !== 1) return moveHit;

    audio.earthQuake.play();

    // shake recipient
    TweenMax.fromTo(
      recipient.position,
      0.15,
      { x: recipient.position.x - 20 },
      {
        x: recipient.position.x + 20,
        repeat: 5,
        yoyo: true,
        ease: Sine.easeInOut,
        onComplete: () => {
          TweenMax.to(recipient.position, 1.5, {
            x: recipient.position.x + 20,
            ease: Elastic.easeOut,
            onComplete: () => {
              audio.earthQuake.stop();
              this.hitAndDamage(recipient, damage);
            },
          });
        },
      }
    );

    // shake attacker
    TweenMax.fromTo(
      attackerPos,
      0.15,
      { x: attackerPos.x - 20 },
      {
        x: attackerPos.x + 20,
        repeat: 5,
        yoyo: true,
        ease: Sine.easeInOut,
        onComplete: () => {
          TweenMax.to(attackerPos, 1.5, {
            x: attackerPos.x + 20,
            ease: Elastic.easeOut,
          });
        },
      }
    );

    return moveHit;
  }
}
