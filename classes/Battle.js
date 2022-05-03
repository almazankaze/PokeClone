import Messages from "./Messages.js";

export default class Battle {
  constructor() {
    this.messages = new Messages();
  }

  // check pre-attack conditions
  breakStatus(attacker, renderedSprites) {
    let canAttack = true;

    switch (attacker.status) {
      case "paralyzed":
        canAttack = attacker.canAttack("paralyzed");

        if (!canAttack) {
          this.messages.paraMess(attacker);
        }

        break;
      case "sleeping":
        canAttack = attacker.canAttack("sleeping");
        this.messages.sleepMess(attacker, canAttack, renderedSprites);

        break;
      case "frozen":
        canAttack = attacker.canAttack("frozen");
        this.messages.frozenMess(attacker, canAttack, renderedSprites);

        break;

      default:
        break;
    }

    return canAttack;
  }

  // pokemon takes their turn
  takeTurn(attacker, move, recipient, renderedSprites, queue) {
    // can pokemon break out of condition
    if (this.breakStatus(attacker, renderedSprites)) {
      attacker.attack({
        attack: move,
        recipient: recipient,
        renderedSprites,
      });

      // check if pokemon missed
      if (attacker.didHit === 0) {
        queue.push(() => {
          this.messages.missedMess(attacker);
        });
      }
      // check if foe was immune
      else if (attacker.didHit === 2) {
        queue.push(() => {
          this.messages.immuneMess(recipient);
        });
      }
      // check if move failed
      else if (attacker.didHit === 3) {
        queue.push(() => {
          this.messages.failMess();
        });
      }
      // if move hit
      else {
        const effectiveness = recipient.getWeakness(move.type);

        // show text describing move effectiveness
        if (effectiveness !== 1) {
          queue.push(() => {
            this.messages.effectivenessMess(effectiveness);
          });
        }

        // show crit message
        if (recipient.gotCrit) {
          recipient.gotCrit = false;
          queue.push(() => {
            this.messages.criticalMess();
          });
        }

        // check if move should inflict status
        if (move.status.canStatus && recipient.status === "healthy") {
          queue.push(() => {
            this.messages.applyStatus(
              move.status.chance,
              move.status.type,
              recipient
            );
            queue.shift();
          });
        }
      }
    }
  }

  applyEndDamage(pokemon, renderedSprites) {
    this.messages.burnEffect(pokemon, renderedSprites);
  }

  checkFainted(attacker, recipient, queue, battleAnimationId) {
    if (recipient.health <= 0) {
      recipient.faint();

      queue.push(() => {
        this.finishBattle(battleAnimationId);
      });
    }

    if (attacker.health <= 0) {
      attacker.faint();

      queue.push(() => {
        this.finishBattle(battleAnimationId);
      });
    }
  }

  // end the battle
  finishBattle(battleAnimationId) {
    gsap.to("#transitionBg", {
      opacity: 1,
      onComplete: () => {
        cancelAnimationFrame(battleAnimationId);
        document.querySelector("#userInterface").style.display = "none";
      },
    });
  }
}
