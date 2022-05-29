import { Types } from "../constants/Types.js";
import { attacks } from "./attacks.js";

export const pokemon = {
  Charizard: {
    position: {
      x: 25,
      y: 128,
    },
    name: "CHARIZARD",
    health: 152,
    stats: [152, 104, 98, 105, 120],
    backSprite: {
      src: "./img/pokemon/charizardBack.png",
    },
    frontSprite: {
      src: "./img/pokemon/charizardFront.png",
    },
    types: [Types.FIRE, Types.FLYING],
    attacks: [
      attacks.BODYSLAM,
      attacks.FLAMETHROWER,
      attacks.EARTHQUAKE,
      attacks.SWORDDANCE,
    ],
    size: 3,
  },
  Blastoise: {
    position: {
      x: 300,
      y: 0,
    },
    name: "BLASTOISE",
    health: 154,
    stats: [154, 103, 120, 105, 98],
    backSprite: {
      src: "./img/pokemon/blastoiseBack.png",
    },
    frontSprite: {
      src: "./img/pokemon/blastoiseFront.png",
    },
    types: [Types.WATER],
    attacks: [
      attacks.EARTHQUAKE,
      attacks.HYDROPUMP,
      attacks.ICEBEAM,
      attacks.REST,
    ],
    size: 3,
  },
  Snorlax: {
    position: {
      x: 25,
      y: 128,
    },
    name: "SNORLAX",
    health: 245,
    stats: [245, 130, 85, 85, 50],
    backSprite: {
      src: "./img/pokemon/snorlaxBack.png",
    },
    frontSprite: {
      src: "./img/pokemon/snorlaxFront.png",
    },
    types: [Types.NORMAL],
    attacks: [
      attacks.EARTHQUAKE,
      attacks.REST,
      attacks.BODYSLAM,
      attacks.ICEBEAM,
    ],
    size: 3,
  },
  Rhydon: {
    position: {
      x: 300,
      y: 0,
    },
    name: "RHYDON",
    health: 180,
    stats: [180, 150, 140, 65, 60],
    backSprite: {
      src: "./img/pokemon/rhydonBack.png",
    },
    frontSprite: {
      src: "./img/pokemon/rhydonFront.png",
    },
    types: [Types.ROCK],
    attacks: [
      attacks.EARTHQUAKE,
      attacks.BODYSLAM,
      attacks.ROCKSLIDE,
      attacks.REST,
    ],
    size: 3,
  },
  Alakazam: {
    position: {
      x: 300,
      y: 0,
    },
    name: "ALAKAZAM",
    health: 130,
    stats: [130, 70, 65, 155, 140],
    backSprite: {
      src: "./img/pokemon/alakazamBack.png",
    },
    frontSprite: {
      src: "./img/pokemon/alakazamFront.png",
    },
    types: [Types.PSYCHIC],
    attacks: [
      attacks.THUNDERBOLT,
      attacks.SEISMICTOSS,
      attacks.PSYCHIC,
      attacks.RECOVER,
    ],
    size: 3,
  },
  Jolteon: {
    position: {
      x: 25,
      y: 128,
    },
    name: "JOLTEON",
    health: 140,
    stats: [140, 85, 80, 130, 150],
    backSprite: {
      src: "./img/pokemon/jolteonBack.png",
    },
    frontSprite: {
      src: "./img/pokemon/jolteonFront.png",
    },
    types: [Types.ELECTRIC],
    attacks: [
      attacks.REST,
      attacks.THUNDERBOLT,
      attacks.DOUBLEKICK,
      attacks.THUNDERWAVE,
    ],
    size: 3,
  },
  Gyarados: {
    position: {
      x: 25,
      y: 128,
    },
    name: "GYARADOS",
    health: 170,
    stats: [170, 145, 99, 120, 101],
    backSprite: {
      src: "./img/pokemon/gyaradosBack.png",
    },
    frontSprite: {
      src: "./img/pokemon/gyaradosFront.png",
    },
    types: [Types.WATER, Types.FLYING],
    attacks: [
      attacks.THUNDERBOLT,
      attacks.HYDROPUMP,
      attacks.ICEBEAM,
      attacks.DRAGONRAGE,
    ],
    size: 3,
  },
  Exeggutor: {
    position: {
      x: 300,
      y: 0,
    },
    name: "EXEGGUTOR",
    health: 170,
    stats: [170, 115, 105, 145, 75],
    backSprite: {
      src: "./img/pokemon/exeggutorBack.png",
    },
    frontSprite: {
      src: "./img/pokemon/exeggutorFront.png",
    },
    types: [Types.GRASS, Types.PSYCHIC],
    attacks: [
      attacks.PSYCHIC,
      attacks.STOMP,
      attacks.SLEEPPOWDER,
      attacks.MEGADRAIN,
    ],
    size: 3,
  },
  Gengar: {
    position: {
      x: 25,
      y: 128,
    },
    name: "GENGAR",
    health: 135,
    stats: [135, 85, 80, 150, 130],
    backSprite: {
      src: "./img/pokemon/gengarBack.png",
    },
    frontSprite: {
      src: "./img/pokemon/gengarFront.png",
    },
    types: [Types.POISON, Types.GHOST],
    attacks: [
      attacks.PSYCHIC,
      attacks.MEGADRAIN,
      attacks.HYPNOSIS,
      attacks.NIGHTSHADE,
    ],
    size: 3,
  },
  Electabuzz: {
    position: {
      x: 300,
      y: 0,
    },
    name: "ELECTABUZZ",
    health: 140,
    stats: [140, 103, 77, 105, 125],
    backSprite: {
      src: "./img/pokemon/exeggutorBack.png",
    },
    frontSprite: {
      src: "./img/pokemon/exeggutorFront.png",
    },
    types: [Types.ELECTRIC],
    attacks: [
      attacks.THUNDERBOLT,
      attacks.THUNDERWAVE,
      attacks.SEISMICTOSS,
      attacks.BODYSLAM,
    ],
    size: 3,
  },
};
