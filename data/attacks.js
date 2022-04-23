import { Types } from "../constants/Types.js";

export const attacks = {
  TACKLE: {
    name: "TACKLE",
    power: 10,
    type: Types.NORMAL,
    moveType: 1,
    targetStat: 2,
    status: { canStatus: false, chance: 0, type: "" },
    pp: 15,
    acc: 65,
  },
  FLAMETHROWER: {
    name: "FLAMETHROWER",
    power: 90,
    type: Types.FIRE,
    moveType: 3,
    tagetStat: 3,
    status: { canStatus: true, chance: 100, type: "burn" },
    pp: 15,
    acc: 100,
  },
};
