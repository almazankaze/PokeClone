export default class Messages {
  constructor() {}

  effectivenessMess(effectiveness) {
    document.querySelector("#dialogueBox").style.display = "block";

    if (effectiveness > 1)
      document.querySelector("#dialogueBox").innerHTML =
        "It's super effective!";
    else if (effectiveness === 0)
      document.querySelector("#dialogueBox").innerHTML = "It had no effect!";
    else if (effectiveness > 0 && effectiveness < 1)
      document.querySelector("#dialogueBox").innerHTML =
        "It's not very effective!";
  }

  missedMess(pokemon) {
    let enemy = pokemon.isEnemy ? "Enemy" : "";
    document.querySelector("#dialogueBox").style.display = "block";
    document.querySelector("#dialogueBox").innerHTML =
      enemy + " " + pokemon.name + " Missed!";
  }

  criticalMess() {
    document.querySelector("#dialogueBox").style.display = "block";
    document.querySelector("#dialogueBox").innerHTML = "It's a critical hit!";
  }

  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // checks if move should apply burn status
  applyBurn(effChance, recipient) {
    if (
      this.randomIntFromInterval(1, 100) <= effChance &&
      recipient.status === "healthy"
    ) {
      document.querySelector("#menu").classList.add("loading");
      recipient.status = "burned";
      recipient.stats[1] = recipient.stats[1] / 2;
      this.statusShake(recipient, "burned");
    } else {
      document.querySelector("#menu").classList.remove("loading");
    }
  }

  burnEffect(pokemon) {
    document.querySelector("#dialogueBox").style.display = "block";
    document.querySelector("#menu").classList.add("loading");

    document.querySelector("#dialogueBox").innerHTML =
      pokemon.name + " was hurt by burn!";

    let burnDamage = Math.floor(pokemon.stats[0] / 16);

    pokemon.reduceHealth(burnDamage);
  }

  // shake pokemon if affected with status
  statusShake(element, status) {
    // shake pokemon
    TweenMax.fromTo(
      element.position,
      0.15,
      { x: element.position.x - 5 },
      {
        x: element.position.x + 5,
        repeat: 3,
        yoyo: true,
        ease: Sine.easeInOut,

        // after shaking
        onComplete: () => {
          // display status message
          let a = element.isEnemy ? "Enemy" : "";
          document.querySelector("#dialogueBox").style.display = "block";
          document.querySelector("#dialogueBox").innerHTML =
            a + " " + element.name + " got " + status + "!";
          document.querySelector("#menu").classList.remove("loading");

          if (element.isEnemy)
            document.querySelector("#enemyStatus").innerHTML = status;
          else document.querySelector("#playerStatus").innerHTML = status;
          // return pokemon to old position
          TweenMax.to(element.position, 1.5, {
            x: element.position.x + 5,
            ease: Elastic.easeOut,
          });
        },
      }
    );
  }
}
