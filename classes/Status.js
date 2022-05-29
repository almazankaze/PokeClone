export default class Status {
  constructor() {}

  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  shouldStatus(effChance, type, status) {
    if (type === "Fire" && status === "burn") return false;

    if (type === "Electric" && status === "para") return false;

    if (type === "Ice" && status === "freeze") return false;

    return this.randomIntFromInterval(1, 100) <= effChance;
  }

  applyStatus(recipient, status) {
    if (recipient.health === 0) return;

    switch (status) {
      case "para":
        this.applyPara(recipient);
        break;
      case "burn":
        this.applyBurn(recipient);
        break;
      case "freeze":
        this.applyFreeze(recipient);
        break;
      case "sleep":
        this.applySleep(recipient);
        break;
    }
  }

  applyPara(recipient) {
    document.querySelector("#menu").classList.add("loading");
    recipient.status = "paralyzed";
    this.statusShake(recipient, "paralyzed", "PAR");
  }

  applyBurn(recipient) {
    document.querySelector("#menu").classList.add("loading");
    recipient.status = "burned";
    this.statusShake(recipient, "burned", "BRN");
  }

  applyFreeze(recipient) {
    document.querySelector("#menu").classList.add("loading");
    recipient.status = "frozen";
    this.statusShake(recipient, "frozen", "FRZ");
  }

  applySleep(recipient) {
    document.querySelector("#menu").classList.add("loading");
    recipient.status = "sleeping";

    let count = this.randomIntFromInterval(1, 3);
    recipient.sleepCounter = count;
    this.statusShake(recipient, "sleep", "SLP");
  }

  // shake pokemon if affected with status
  statusShake(pokemon, status, statusText) {
    // shake pokemon
    TweenMax.fromTo(
      pokemon.position,
      0.15,
      { x: pokemon.position.x - 5 },
      {
        x: pokemon.position.x + 5,
        repeat: 3,
        yoyo: true,
        ease: Sine.easeInOut,

        // after shaking
        onComplete: () => {
          // display status message
          let enemy = pokemon.isEnemy ? "Enemy " : "";
          let midMess = " got ";
          if (status === "sleep") midMess = " went to ";
          document.querySelector("#dialogueBox").style.display = "block";
          document.querySelector("#dialogueBox").innerHTML =
            enemy + pokemon.name + midMess + status + "!";
          document.querySelector("#menu").classList.remove("loading");

          if (pokemon.isEnemy)
            document.querySelector("#enemyStatus").innerHTML = statusText;
          else document.querySelector("#playerStatus").innerHTML = statusText;
          // return pokemon to old position
          TweenMax.to(pokemon.position, 1.5, {
            x: pokemon.position.x + 5,
            ease: Elastic.easeOut,
          });
        },
      }
    );
  }
}
