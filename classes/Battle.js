import Messages from "./Messages.js";
import Status from "./Status.js";

export default class Battle {
  constructor() {
    this.messages = new Messages();
    this.status = new Status();
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
        let effectiveness = 1;
        if (move.moveType === 0) effectiveness = 1;
        else effectiveness = recipient.getWeakness(move.type);

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
          if (
            this.status.shouldStatus(
              move.status.chance,
              recipient.types[0],
              move.status.type
            )
          ) {
            queue.push(() => {
              this.status.applyStatus(recipient, move.status.type);
            });
          }
        }
      }
    }
  }

  applyEndDamage(pokemon, renderedSprites) {
    this.messages.burnEffect(pokemon, renderedSprites);
  }

  faintPokemon(pokemon, queue, battleAnimationId) {
    pokemon.faint();
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
