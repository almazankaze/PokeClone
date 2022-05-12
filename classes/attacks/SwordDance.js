import Sprite from "../Sprite.js";
import Attack from "../Attack.js";

export default class SwordDance extends Attack {
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

  useMove(attackerPos, size, attackStage, renderedSprites) {
    // use up pp
    this.pp -= 1;

    document.querySelector("#dialogueBox").style.display = "block";

    // attack can't go higher
    if (attackStage >= 6) {
      document.querySelector("#dialogueBox").innerHTML =
        "it's attack can't go higher!";

      document.querySelector("#menu").classList.remove("loading");

      return 6;
    }

    // increase attack
    let newAttackStage = attackStage + 2;
    if (newAttackStage > 6) newAttackStage = 6;

    const swordImage1 = new Image();
    swordImage1.src = "./img/attacks/sword1.png";

    const swordImage2 = new Image();
    swordImage2.src = "./img/attacks/sword2.png";

    const sword1 = new Sprite({
      position: {
        x: attackerPos.x + 20,
        y: attackerPos.y + 50,
      },
      backSprite: swordImage1,
      size,
    });

    const sword2 = new Sprite({
      position: {
        x: attackerPos.x + 120,
        y: attackerPos.y + 50,
      },
      backSprite: swordImage2,
      size,
    });

    renderedSprites.splice(2, 0, sword1);
    renderedSprites.splice(0, 0, sword2);

    // play sword dance animation
    const t = gsap.timeline();
    t.to(sword1.position, {
      x: sword1.position.x + 90,
      repeat: 2,
      onComplete: () => {
        renderedSprites.splice(0, 1);
        renderedSprites.splice(2, 1);

        document.querySelector("#dialogueBox").innerHTML =
          "It's attack went way up!";

        document.querySelector("#menu").classList.remove("loading");
      },
    }).to(
      sword2.position,
      {
        x: sword2.position.x - 110,
        repeat: 2,
      },
      "<"
    );

    return newAttackStage;
  }
}
