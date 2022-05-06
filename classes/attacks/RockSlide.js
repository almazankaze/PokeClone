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

  useMove(attackerPos, attackStat, mult, recipient) {
    let moveHit = 1;

    // use up pp
    this.pp -= 1;

    if (!this.hit(this.acc)) moveHit = 0;

    // calc damage
    let damage = this.damageCalc(attackStat, mult, this.type, recipient);

    if (damage <= 0) moveHit = 2;

    if (moveHit !== 1) return moveHit;

    return moveHit;
  }
}
