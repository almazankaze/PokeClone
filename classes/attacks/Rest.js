import Sprite from "../Sprite.js";
import Attack from "../Attack.js";

export default class Rest extends Attack {
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

  useMove(currHealth, maxHealth) {
    let moveHit = 1;

    // use up pp
    this.pp -= 1;

    if (currHealth >= maxHealth) {
      moveHit = 3;
      return moveHit;
    }

    document.querySelector("#dialogueBox").innerHTML += " Then went to sleep!";

    return moveHit;
  }
}
