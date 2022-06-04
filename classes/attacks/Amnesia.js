import Sprite from "../Sprite.js";
import Attack from "../Attack.js";
import { audio } from "../../data/audio.js";

export default class Amnesia extends Attack {
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

  useMove(attackerPos, size, specialStage, renderedSprites) {
    // use up pp
    this.pp -= 1;

    document.querySelector("#dialogueBox").style.display = "block";

    // attack can't go higher
    if (specialStage >= 6) {
      document.querySelector("#dialogueBox").innerHTML =
        "it's special can't go higher!";

      document.querySelector("#menu").classList.remove("loading");

      return 6;
    }

    // increase attack
    let newSpecialStage = specialStage + 2;
    if (newSpecialStage > 6) newSpecialStage = 6;

    let x = 60;

    if (size === 2) x = 45;

    const questionImage = new Image();
    questionImage.src = "./img/effects/question.png";

    const question = new Sprite({
      position: {
        x: attackerPos.x - x,
        y: attackerPos.y,
      },
      backSprite: questionImage,
      size,
    });

    renderedSprites.splice(2, 0, question);

    audio.amnesia.play();

    gsap.to(question.position, {
      x: question.position.x,
      y: question.position.y + 40,
      duration: 0.5,
      repeat: 1,
      onComplete: () => {
        renderedSprites.splice(2, 1);

        document.querySelector("#dialogueBox").innerHTML =
          "It's special went way up!";

        document.querySelector("#menu").classList.remove("loading");
      },
    });

    return newSpecialStage;
  }
}
