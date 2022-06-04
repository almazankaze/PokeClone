import Sprite from "../Sprite.js";
import Attack from "../Attack.js";
import { audio } from "../../data/audio.js";

export default class SleepPowder extends Attack {
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

  // us the move
  useMove(recipient, renderedSprites) {
    let moveHit = 1;

    // use up pp
    this.pp -= 1;

    if (!this.hit(this.acc)) moveHit = 0;

    if (recipient.getWeakness("Grass") === 0) moveHit = 2;

    if (recipient.status != "healthy") moveHit = 3;

    if (moveHit !== 1) return moveHit;

    let y = 0;

    if (recipient.size === 2) y = 20;

    const powderImg = new Image();
    powderImg.src = "./img/attacks/sleepPowder.png";
    const powder = new Sprite({
      position: {
        x: recipient.position.x,
        y: recipient.position.y + y,
      },
      backSprite: powderImg,
      size: recipient.size,
      frames: {
        max: 4,
        hold: 10,
      },
      animate: true,
    });

    renderedSprites.splice(2, 0, powder);

    audio.sleepPowder.play();

    gsap.to(powder, {
      duration: 0.6,
      onComplete: () => {
        renderedSprites.splice(2, 1);
        document.querySelector("#menu").classList.remove("loading");
      },
    });

    return moveHit;
  }
}
