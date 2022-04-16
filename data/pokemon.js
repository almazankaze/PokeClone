import { Types } from "../constants/Types.js";
import { attacks } from "./attacks.js";

export const pokemon = {
  Charizard: {
    name: "Charizard",
    backSprite: {
      src: "./img/pokemon/pokemon/charizardBack.png",
    },
    frontSprite: {
      src: "./img/charizardFront.png",
    },
    types: [Types.FIRE, Types.FLYING],
    attacks: [attacks.Tackle],
  },
  Blastoise: {
    name: "Blastoise",
    backSprite: {
      src: "./img/pokemon/blastoiseBack.png",
    },
    frontSprite: {
      src: "./img/pokemon/blastoiseFront.png",
    },
    types: [Types.WATER],
    attacks: [attacks.Tackle],
  },
};
