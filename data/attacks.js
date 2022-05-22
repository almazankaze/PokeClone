import { Types } from "../constants/Types.js";

export const attacks = {
  BODYSLAM: {
    id: "BODYSLAM",
    name: "BODY SLAM",
    power: 85,
    type: Types.NORMAL,
    moveType: 1,
    targetStat: 2,
    status: { canStatus: true, chance: 30, type: "para" },
    pp: 15,
    acc: 100,
  },
  FLAMETHROWER: {
    id: "FLAMETHROWER",
    name: "FLAMETHROWER",
    power: 90,
    type: Types.FIRE,
    moveType: 3,
    tagetStat: 3,
    status: { canStatus: true, chance: 100, type: "burn" },
    pp: 15,
    acc: 100,
  },

  EARTHQUAKE: {
    id: "EARTHQUAKE",
    name: "EARTHQUAKE",
    power: 100,
    type: Types.GROUND,
    moveType: 1,
    tagetStat: 2,
    status: { canStatus: false, chance: 0, type: "" },
    pp: 10,
    acc: 100,
  },
  SWORDDANCE: {
    id: "SWORDDANCE",
    name: "SWORD DANCE",
    power: 0,
    type: Types.NORMAL,
    moveType: 0,
    tagetStat: 1,
    status: { canStatus: false, chance: 0, type: "" },
    pp: 20,
    acc: 100,
  },
  HYDROPUMP: {
    id: "HYDROPUMP",
    name: "HYDRO PUMP",
    power: 110,
    type: Types.WATER,
    moveType: 3,
    tagetStat: 3,
    status: { canStatus: false, chance: 0, type: "" },
    pp: 5,
    acc: 80,
  },
  ICEBEAM: {
    id: "ICEBEAM",
    name: "ICE BEAM",
    power: 90,
    type: Types.ICE,
    moveType: 3,
    tagetStat: 3,
    status: { canStatus: true, chance: 10, type: "freeze" },
    pp: 10,
    acc: 100,
  },
  REST: {
    id: "REST",
    name: "REST",
    power: 0,
    type: Types.PSYCHIC,
    moveType: 0,
    tagetStat: 0,
    status: { canStatus: false, chance: 0, type: "" },
    pp: 20,
    acc: 100,
  },
  ROCKSLIDE: {
    id: "ROCKSLIDE",
    name: "ROCK SLIDE",
    power: 75,
    type: Types.ROCK,
    moveType: 1,
    tagetStat: 2,
    status: { canStatus: false, chance: 0, type: "" },
    pp: 10,
    acc: 90,
  },
  RECOVER: {
    id: "RECOVER",
    name: "RECOVER",
    power: 0,
    type: Types.PSYCHIC,
    moveType: 0,
    tagetStat: 0,
    status: { canStatus: false, chance: 0, type: "" },
    pp: 10,
    acc: 100,
  },
  SEISMICTOSS: {
    id: "SEISMICTOSS",
    name: "SEISMIC TOSS",
    power: 0,
    type: Types.FIGHTING,
    moveType: 0,
    tagetStat: 2,
    status: { canStatus: false, chance: 0, type: "" },
    pp: 20,
    acc: 100,
  },
  THUNDERBOLT: {
    id: "THUNDERBOLT",
    name: "THUNDERBOLT",
    power: 90,
    type: Types.ELECTRIC,
    moveType: 3,
    tagetStat: 3,
    status: { canStatus: true, chance: 10, type: "para" },
    pp: 15,
    acc: 100,
  },
  PSYCHIC: {
    id: "PSYCHIC",
    name: "PSYCHIC",
    power: 90,
    type: Types.PSYCHIC,
    moveType: 3,
    tagetStat: 3,
    status: { canStatus: false, chance: 10, type: "stat" },
    pp: 10,
    acc: 100,
  },
  DOUBLEKICK: {
    id: "DOUBLEKICK",
    name: "DOUBLE KICK",
    power: 60,
    type: Types.FIGHTING,
    moveType: 1,
    tagetStat: 2,
    status: { canStatus: false, chance: 0, type: "" },
    pp: 30,
    acc: 100,
  },
  THUNDERWAVE: {
    id: "THUNDERWAVE",
    name: "THUNDERWAVE",
    power: 0,
    type: Types.ELECTRIC,
    moveType: 0,
    tagetStat: 0,
    status: { canStatus: true, chance: 100, type: "para" },
    pp: 20,
    acc: 90,
  },
};
