import Sprite from "./Sprite.js";

export default class Pokemon extends Sprite {
  constructor({
    name,
    health,
    types,
    status = "healthy",
    stats,
    isEnemy = false,
    position,
    frontSprite,
    backSprite,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    rotation = 0,
    size,
  }) {
    super({
      isEnemy,
      position,
      frontSprite,
      backSprite,
      frames,
      sprites,
      animate,
      rotation,
      size,
    });

    this.name = name;
    this.health = health;
    this.types = types;
    this.status = status;
    this.stats = stats;
    this.didHit = false;
    this.gotCrit = false;
    this.stages = [0, 0, 0, 0, 0];
    this.sleepCounter = 0;
  }

  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  recoverHealth(healthAmount) {
    let healthBar = "#playerHealthBar";
    if (this.isEnemy) healthBar = "#enemyHealthBar";

    let newHealth = this.health + healthAmount;

    if (newHealth >= this.stats[0]) newHealth = this.stats[0];

    let Cont = { val: this.health },
      newVal = newHealth;

    this.health += healthAmount;

    if (this.health >= this.stats[0]) this.health = this.stats[0];

    let healthBarWidth = Math.floor((this.health / this.stats[0]) * 100);

    if (!this.isEnemy) {
      TweenLite.to(Cont, 3, {
        val: newVal,
        roundProps: "val",
        onUpdate: () => {
          document.getElementById("playerHpNumber").innerHTML =
            Cont.val + " / " + this.stats[0];
        },
        onComplete: () => {
          document.querySelector("#menu").classList.remove("loading");
        },
      });
    }

    gsap.to(healthBar, {
      width: healthBarWidth + "%",
      duration: 2,

      // after health recovers
      onComplete: () => {
        if (this.isEnemy)
          document.querySelector("#menu").classList.remove("loading");
      },
    });
  }

  reduceHealth(healthAmount) {
    let healthBar = "#playerHealthBar";
    if (this.isEnemy) healthBar = "#enemyHealthBar";

    let newHealth = this.health - healthAmount;

    if (newHealth <= 0) newHealth = 0;

    let Cont = { val: this.health },
      newVal = newHealth;

    this.health -= healthAmount;

    if (this.health <= 0) {
      this.health = 0;
      this.status = "fainted";
    }
    let healthBarWidth = Math.floor((this.health / this.stats[0]) * 100);

    if (!this.isEnemy) {
      TweenLite.to(Cont, 3, {
        val: newVal,
        roundProps: "val",
        onUpdate: () => {
          document.getElementById("playerHpNumber").innerHTML =
            Cont.val + " / " + this.stats[0];
        },
        onComplete: () => {
          document.querySelector("#menu").classList.remove("loading");
        },
      });
    }

    gsap.to(healthBar, {
      width: healthBarWidth + "%",
      duration: 2,

      // after health drops
      onComplete: () => {
        if (this.isEnemy)
          document.querySelector("#menu").classList.remove("loading");
      },
    });
  }

  // can pokemon attack
  canAttack(status) {
    const c = this.randomIntFromInterval(1, 100);

    switch (status) {
      case "paralyzed":
        return c <= 25 ? true : false;
      case "sleeping":
        if (this.sleepCounter >= 1) {
          this.sleepCounter -= 1;
          return false;
        } else {
          this.status = "healthy";
          return true;
        }
      case "frozen":
        if (c <= 20) {
          this.status = "healthy";
          return true;
        } else return false;
      default:
        return true;
    }
  }

  getMultiplier(stage) {
    switch (stage) {
      case 0:
        return 1;
      case 1:
        return 1.5;
      case 2:
        return 2;
      case 3:
        return 2.5;
      case 4:
        return 3;
      case 5:
        return 3.5;
      case 6:
        return 4;
      case -1:
        return 0.66;
      case -2:
        return 0.5;
      case -3:
        return 0.4;
      case -4:
        return 0.33;
      case -5:
        return 0.29;
      case -6:
        return 0.25;
    }
  }

  getSpeed() {
    let speed = this.stats[4];

    if (this.status === "paralyzed") speed = Math.ceil(speed / 2);

    speed = Math.ceil(speed * this.getMultiplier(this.stages[4]));

    return speed;
  }

  faint() {
    document.querySelector("#dialogueBox").innerHTML = this.name + " fainted!";
    gsap.to(this.position, {
      y: this.position.y + 20,
    });
    gsap.to(this, {
      opacity: 0,
    });
  }
}
