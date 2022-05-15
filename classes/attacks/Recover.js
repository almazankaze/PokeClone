import Attack from "../Attack.js";
import { audio } from "../../data/audio.js";

export default class Recover extends Attack {
  constructor({
    name,
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
      name,
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

    audio.recover.play();

    return moveHit;
  }
}
