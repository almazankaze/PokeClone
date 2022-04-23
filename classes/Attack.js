export default class Attack {
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
    this.type = type;
    this.pp = pp;
    this.acc = acc;
    this.power = power;
    this.moveType = moveType;
    this.targetStat = targetStat;
    this, (status = status);
    this.isStab = isStab;
  }

  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // calculates damage of attack
  damageCalc(attackerStat, attackType, recipient) {
    // level of pokemon
    const level = 50;

    // is move same type as pokemon?
    let stab = this.isStab ? 1.5 : 1;

    let effectiveness = recipient.getWeakness(attackType);

    // is move a crtical hit?
    let crit = 1;

    const isCrit = Math.random() < 0.0418;

    if (isCrit && this.type != "NullType") {
      crit = 1.5;
      recipient.gotCrit = true;
    }

    const damage = Math.ceil(
      ((((2 * level) / 5 + 2) *
        (this.power * (attackerStat / recipient.stats[this.moveType]))) /
        50 +
        2) *
        stab *
        effectiveness *
        crit
    );

    return damage;
  }

  // checks if move hit or missed
  hit(acc) {
    if (this.randomIntFromInterval(1, 100) <= acc) {
      return true;
    }
  }

  // animation for when pokemon gets hit
  hitEffect(recipient) {
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
    });
  }

  shakeContainer(element) {
    TweenMax.fromTo(
      element,
      0.15,
      { x: -20 },
      {
        x: 20,
        repeat: 5,
        yoyo: true,
        ease: Sine.easeInOut,
        onComplete: () => {
          TweenMax.to(element, 1.5, {
            x: 0,
            ease: Elastic.easeOut,
          });
        },
      }
    );
  }
}
