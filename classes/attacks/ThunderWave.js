import Sprite from "../Sprite.js";
import Attack from "../Attack.js";
import { audio } from "../../data/audio.js";

export default class ThunderWave extends Attack {
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

    if (recipient.getWeakness("Electric") === 0) moveHit = 2;

    if (recipient.status === "paralyzed") moveHit = 3;

    if (moveHit !== 1) return moveHit;

    const ThunderBoltImg = new Image();
    ThunderBoltImg.src = "./img/attacks/thunderbolt.png";
    const thunderBolt = new Sprite({
      position: {
        x: recipient.position.x + 10,
        y: recipient.position.y + 20,
      },
      backSprite: ThunderBoltImg,
      size: recipient.size,
    });

    renderedSprites.splice(2, 0, thunderBolt);

    audio.thunderWave.play();

    gsap.to(thunderBolt, {
      opacity: 0,
      repeat: 18,
      yoyo: true,
      duration: 0.1,
      onComplete: () => {
        renderedSprites.splice(2, 1);
        document.querySelector("#menu").classList.remove("loading");
      },
    });

    return moveHit;
  }
}
