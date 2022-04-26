import { Types } from "../constants/Types.js";

export const attacks = {
  BODYSLAM: {
    name: "BODYSLAM",
    power: 85,
    type: Types.NORMAL,
    moveType: 1,
    targetStat: 2,
    status: { canStatus: true, chance: 100, type: "para" },
    pp: 15,
    acc: 100,
  },
  FLAMETHROWER: {
    name: "FLAMETHROWER",
    power: 90,
    type: Types.FIRE,
    moveType: 3,
    tagetStat: 3,
    status: { canStatus: true, chance: 10, type: "burn" },
    pp: 15,
    acc: 100,
  },

  EARTHQUAKE: {
    name: "EARTHQUAKE",
    power: 100,
    type: Types.GROUND,
    moveType: 1,
    tagetStat: 2,
    status: { canStatus: false, chance: 0, type: "" },
    pp: 10,
    acc: 100,
  },
};
