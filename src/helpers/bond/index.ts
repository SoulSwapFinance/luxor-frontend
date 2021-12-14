import { Networks } from "../../constants/blockchain";
import { CustomLPBond, LPBond } from "./lp-bond";
import { CustomBond, StableBond } from "./stable-bond";

import DaiIcon from "../../assets/tokens/DAI.svg";
// import SoulIcon from "../../assets/tokens/SOUL.png";
import FtmIcon from "../../assets/tokens/FTM.svg";
import DaiLuxorIcon from "../../assets/tokens/LUX-DAI.svg";
import FtmLuxorIcon from "../../assets/tokens/LUX-FTM.svg";

import { StableBondContract, DaiLpBondContract, FtmLpBondContract, WftmBondContract, StableReserveContract, SoulLpBondContract, LpReserveContract } from "../../abi";

export const dai = new StableBond({
    name: "dai",
    displayName: "DAI",
    bondToken: "DAI",
    rewardToken: "LUX",
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

export const dai2 = new StableBond({
    name: "dai2",
    displayName: "DAI",
    bondToken: "DAI",
    rewardToken: "LUX",
    bondIconSvg: DaiIcon,
    bondContractABI: StableBondContract,
    reserveContractAbi: StableReserveContract,
    networkAddrs: {
        [Networks.FTM]: {
            bondAddress: "0x80C61168e1F02e1835b541e9Ca6Bb3416a36Af6F",
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
    rewardToken: "LUX",
    bondIconSvg: FtmIcon,
    bondContractABI: WftmBondContract,
    reserveContractAbi: StableReserveContract,
    networkAddrs: {
        [Networks.FTM]: {
            bondAddress: "0x13729e99A7b77469f7FD204495a7b49e25e8444a",
            reserveAddress: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
        },
        [Networks.BSC]: {
            bondAddress: "",
            reserveAddress: "",
        },
    },
    tokensInStrategy: "00000000000000000000000",
});

export const wftm2 = new CustomBond({
    name: "wftm2",
    displayName: "WFTM",
    bondToken: "FTM",
    rewardToken: "LUX",
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

export const wftm3 = new CustomBond({
    name: "wftm3",
    displayName: "WFTM",
    bondToken: "FTM",
    rewardToken: "LUX",
    bondIconSvg: FtmIcon,
    bondContractABI: WftmBondContract,
    reserveContractAbi: StableReserveContract,
    networkAddrs: {
        [Networks.FTM]: {
            bondAddress: "0xc421072646C51FF8983714F28e4253ad8B44bb1E",
            reserveAddress: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
        },
        [Networks.BSC]: {
            bondAddress: "",
            reserveAddress: "",
        },
    },
    tokensInStrategy: "00000000000000000000000",
});

// export const ftmSoul = new CustomLPBond({
//     name: "soul_ftm_lp",
//     displayName: "SOUL-FTM",
//     bondToken: "SOUL",
//     rewardToken: "SOUL",
//     bondIconSvg: SoulIcon,
//     bondContractABI: SoulLpBondContract,
//     reserveContractAbi: LpReserveContract,
//     networkAddrs: {
//         [Networks.FTM]: {
//             bondAddress: "0x742429687DD80ccc02Ff61109f2293b7a08Aa245",
//             reserveAddress: "0xa2527Af9DABf3E3B4979d7E0493b5e2C6e63dC57",
//         },
//         [Networks.BSC]: {
//             bondAddress: "",
//             reserveAddress: "",
//         },
//     },
//     lpUrl: "https://app.soulswap.finance/exchange/add/ETH/0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07",
// });

export const daiLuxor = new LPBond({
    name: "dai_lux_lp",
    displayName: "LUX-DAI",
    bondToken: "DAI",
    rewardToken: "LUX",
    bondIconSvg: DaiLuxorIcon,
    bondContractABI: DaiLpBondContract,
    reserveContractAbi: LpReserveContract,
    networkAddrs: {
        [Networks.FTM]: {
            // token0: DAI
            bondAddress: "0x5612d83dfED9B387c925Ac4D19ED3aeDd71004A8",
            reserveAddress: "0x46729c2AeeabE7774a0E710867df80a6E19Ef851",
        },
        [Networks.BSC]: {
            bondAddress: "",
            reserveAddress: "",
        },
    },
    lpUrl: "https://app.soulswap.finance/exchange/add/0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E/0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b",
});

export const daiLuxor2 = new LPBond({
    name: "dai_lux_lp2",
    displayName: "LUX-DAI",
    bondToken: "DAI",
    rewardToken: "LUX",
    bondIconSvg: DaiLuxorIcon,
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

export const ftmLuxor = new CustomLPBond({
    name: "ftm_lux_lp",
    displayName: "LUX-FTM",
    bondToken: "FTM",
    rewardToken: "LUX",
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

export const ftmLuxor2 = new CustomLPBond({
    name: "ftm_lux_lp2",
    displayName: "LUX-FTM",
    bondToken: "FTM",
    rewardToken: "LUX",
    bondIconSvg: FtmLuxorIcon,
    bondContractABI: FtmLpBondContract,
    reserveContractAbi: LpReserveContract,
    networkAddrs: {
        [Networks.FTM]: {
            // token0: WFTM
            bondAddress: "0x8dF4f6e20C64DA8DAFC8c43E434f2cFda9C3FCAE",
            reserveAddress: "0x951BBB838e49F7081072895947735b0892cCcbCD",
        },
        [Networks.BSC]: {
            bondAddress: "",
            reserveAddress: "",
        },
    },
    lpUrl: "https://app.soulswap.finance/exchange/add/ETH/0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b",
});

export default [dai, dai2, daiLuxor, daiLuxor2, ftmLuxor, ftmLuxor2, wftm, wftm2, wftm3];
