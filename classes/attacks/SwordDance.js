import Attack from "../Attack.js";

export default class SwordDance extends Attack {
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

  useMove(attackerPos, attackStage) {
    // use up pp
    this.pp -= 1;

    document.querySelector("#dialogueBox").style.display = "block";

    // attack can't go higher
    if (attackStage >= 6) {
      document.querySelector("#dialogueBox").innerHTML =
        "However it's attack can't go higher!";

      document.querySelector("#menu").classList.remove("loading");

      return 6;
    }

    // increase attack
    let newAttackStage = attackStage + 2;
    if (newAttackStage > 6) newAttackStage = 6;

    document.querySelector("#dialogueBox").innerHTML =
      "It's attack went way up!";

    document.querySelector("#menu").classList.remove("loading");

    return newAttackStage;
  }
}
