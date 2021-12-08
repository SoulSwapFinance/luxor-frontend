import { Networks } from "../../constants/blockchain";
import { CustomLPBond, LPBond } from "./lp-bond";
import { CustomBond, StableBond } from "./stable-bond";

import DaiIcon from "../../assets/tokens/DAI.svg";
import LuxIcon from "../../assets/tokens/LUXOR.svg";
import FtmIcon from "../../assets/tokens/FTM.svg";
// import SoulIcon from "../../assets/tokens/SOUL.png";
import DaiLuxorIcon from "../../assets/tokens/DAI.svg";
import FtmLuxorIcon from "../../assets/tokens/FTM.svg";

import { StableBondContract, DaiLpBondContract, FtmLpBondContract, WftmBondContract, StableReserveContract, LpReserveContract } from "../../abi";

export const dai = new StableBond({
    name: "dai",
    displayName: "DAI",
    bondToken: "DAI",
    bondIconSvg: DaiIcon,
    bondContractABI: StableBondContract,
    reserveContractAbi: StableReserveContract,
    networkAddrs: {
        [Networks.FTM]: {
            bondAddress: "0xCf994423b39A6991e82443a8011Bf6749e19434b",
            reserveAddress: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
        },
        [Networks.BSC]: {
            bondAddress: "",
            reserveAddress: "",
        },
    },
    tokensInStrategy: "00000000000000000000000",
});

export const wftm = new CustomBond({
    name: "wftm",
    displayName: "WFTM",
    bondToken: "FTM",
    bondIconSvg: FtmIcon,
    bondContractABI: WftmBondContract,
    reserveContractAbi: StableReserveContract,
    networkAddrs: {
        [Networks.FTM]: {
            bondAddress: "0x376969e00621Ebf685fC3D1F216C00d19B162923",
            reserveAddress: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
        },
        [Networks.BSC]: {
            bondAddress: "",
            reserveAddress: "",
        },
    },
    tokensInStrategy: "00000000000000000000000",
});

export const daiLuxor = new LPBond({
    name: "dai_lux_lp",
    displayName: "LUX-DAI LP",
    bondToken: "DAI",
    bondIconSvg: LuxIcon,
    bondContractABI: DaiLpBondContract,
    reserveContractAbi: LpReserveContract,
    networkAddrs: {
        [Networks.FTM]: {
            // token0: DAI
            bondAddress: "0xaC64DC47A1fe52458D3418AC7C568Edc3306130a",
            reserveAddress: "0x46729c2AeeabE7774a0E710867df80a6E19Ef851",
        },
        [Networks.BSC]: {
            bondAddress: "",
            reserveAddress: "",
        },
    },
    lpUrl: "https://app.soulswap.finance/exchange/add/0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E/0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b",
});

// export const soulLuxor = new CustomLPBond({
//     name: "soul_lux_lp",
//     displayName: "LUX-SOUL LP",
//     bondToken: "SOUL",
//     bondIconSvg: LuxIcon,
//     bondContractABI: LpBondContract,
//     reserveContractAbi: LpReserveContract,
//     networkAddrs: {
//         [Networks.FTM]: {
//             bondAddress: "0xfd4714Cf2CBB82F6013F44bB9218588a67716cd2",
//             reserveAddress: "0x475a63154C3e85ac0F2CB453f0b5c63e4370333c",
//         },
//         [Networks.BSC]: {
//             bondAddress: "",
//             reserveAddress: "",
//         },
//     },
//     lpUrl: "https://app.soulswap.finance/add/0x6671e20b83ba463f270c8c75dae57e3cc246cb2b/0xe2fb177009ff39f52c0134e8007fa0e4baacbd07",
// });

export const ftmLuxor = new CustomLPBond({
    name: "ftm_lux_lp",
    displayName: "LUX-FTM LP",
    bondToken: "FTM",
    bondIconSvg: FtmLuxorIcon,
    bondContractABI: FtmLpBondContract,
    reserveContractAbi: LpReserveContract,
    networkAddrs: {
        [Networks.FTM]: {
            // token0: WFTM
            bondAddress: "0xaBAD60240f1a39fce0d828eecf54d790FFF92cec",
            reserveAddress: "0x951BBB838e49F7081072895947735b0892cCcbCD",
        },
        [Networks.BSC]: {
            bondAddress: "",
            reserveAddress: "",
        },
    },
    lpUrl: "https://app.soulswap.finance/exchange/add/ETH/0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b",
});

export default [dai, daiLuxor, wftm]; // ftmLuxor];
