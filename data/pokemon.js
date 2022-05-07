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
      attacks.REST,
      attacks.HYDROPUMP,
      attacks.ICEBEAM,
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
    attacks: [],
    size: 3,
  },
  Gengar: {
    position: {
      x: 25,
      y: 128,
    },
    name: "Gengar",
    health: 135,
    stats: [135, 85, 80, 150, 130],
    backSprite: {
      src: "./img/pokemon/gengarBack.png",
    },
    frontSprite: {
      src: "./img/pokemon/gengarFront.png",
    },
    types: [Types.GHOST],
    attacks: [],
    size: 3,
  },
};
