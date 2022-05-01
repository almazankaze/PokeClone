import Attack from "../Attack.js";

export default class BodySlam extends Attack {
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
    let moveHit = 1;

    // use up pp
    this.pp -= 1;

    if (!this.hit(this.acc)) moveHit = 0;

    // calc damage
    let damage = this.damageCalc(attackStat, this.type, recipient);

    if (damage <= 0) moveHit = 2;

    if (moveHit !== 1) return moveHit;

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

    return moveHit;
  }
}
