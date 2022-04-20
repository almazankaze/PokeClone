export default class Attack {
  constructor({ type, pp, acc, power, moveType, targetStat, isStab = false }) {
    this.type = type;
    this.pp = pp;
    this.acc = acc;
    this.power = power;
    this.moveType = moveType;
    this.targetStat = targetStat;
    this.isStab = isStab;
  }

  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // calculates damage of attack
  damageCalc(attackerStat, recipient) {
    // level of pokemon
    const level = 50;

    // is move same type as pokemon?
    let stab = this.isStab ? 1.5 : 1;

    let supEff = 1;
    let resist = 1;

    // is move a crtical hit?
    let crit = 1;

    const damage = Math.ceil(
      ((((2 * level) / 5 + 2) *
        (this.power * (attackerStat / recipient.stats[this.moveType]))) /
        50 +
        2) *
        stab *
        supEff *
        resist *
        crit
    );

    return damage;
  }

  // checks if move hit or missed
  hit(acc) {
    if (this.randomIntFromInterval(1, 100) <= acc) {
      return true;
    }

    document.querySelector("#dialogueBox").innerHTML += " But it missed!";
    document.querySelector("#menu").classList.remove("loading");
  }

  // checks if move should apply burn status
  applyBurn(effChance, recipient) {
    if (this.randomIntFromInterval(1, 100) <= effChance) {
      this.statusShake(recipient, "burned");
    } else {
      document.querySelector("#menu").classList.remove("loading");
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

  // shake pokemon if affected with status
  statusShake(element, status) {
    // shake pokemon
    TweenMax.fromTo(
      element.position,
      0.15,
      { x: element.position.x - 5 },
      {
        x: element.position.x + 5,
        repeat: 3,
        yoyo: true,
        ease: Sine.easeInOut,

        // after shaking
        onComplete: () => {
          // display status message
          let a = element.isEnemy ? "Enemy" : "";
          document.querySelector("#dialogueBox").style.display = "block";
          document.querySelector("#dialogueBox").innerHTML =
            a + " " + element.name + " got " + status + "!";
          document.querySelector("#menu").classList.remove("loading");

          // return pokemon to old position
          TweenMax.to(element.position, 1.5, {
            x: element.position.x + 5,
            ease: Elastic.easeOut,
          });
        },
      }
    );
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
