import Attack from "../Attack.js";

export default class Tackle extends Attack {
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

  useMove(attackerPos, attackStat, recipient) {
    this.pp -= 1;

    // did move miss?
    if (!this.hit(this.acc)) return false;

    let damage = this.damageCalc(attackStat, this.type, recipient);

    const tl = gsap.timeline();
    let movementDistance = -20;
    if (recipient.isEnemy) movementDistance = 20;

    tl.to(attackerPos, {
      x: attackerPos.x - movementDistance,
    })
      .to(attackerPos, {
        x: attackerPos.x + movementDistance * 2,
        duration: 0.1,
        onComplete: () => {
          this.hitEffect(recipient);
        },
      })
      .to(attackerPos, {
        x: attackerPos.x,
        onComplete: () => {
          recipient.reduceHealth(damage);
        },
      });

    return true;
  }
}
