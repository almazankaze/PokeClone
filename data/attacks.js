import { Types } from "../constants/Types.js";

export const attacks = {
  TACKLE: {
    name: "TACKLE",
    power: 10,
    type: Types.NORMAL,
    moveType: 1,
    targetStat: 2,
    pp: 15,
    acc: 65,
  },
  FLAMETHROWER: {
    name: "FLAMETHROWER",
    power: 90,
    type: Types.FIRE,
    moveType: 3,
    tagetStat: 3,
    pp: 15,
    acc: 100,
  },
};
