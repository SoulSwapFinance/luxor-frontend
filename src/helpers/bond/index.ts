import { Networks } from "../../constants/blockchain";
import { CustomLPBond, LPBond } from "./lp-bond";
import { CustomBond, StableBond } from "./stable-bond";

import DaiIcon from "../../assets/tokens/DAI.svg";
// import SoulIcon from "../../assets/tokens/SOUL.png";
import FtmIcon from "../../assets/tokens/FTM.svg";
import DaiLuxorIcon from "../../assets/tokens/LUX-DAI.svg";
import FtmLuxorIcon from "../../assets/tokens/LUX-FTM.svg";

import { BondHelperContract, StableBondContract, DaiLpBondContract, FtmLpBondContract, WftmBondContract, StableReserveContract, LpReserveContract } from "../../abi";

export const dai = new StableBond({
    name: "dai",
    displayName: "DAI",
    bondToken: "DAI",
    rewardToken: "LUX",
    bondIconSvg: DaiIcon,
    bondContractABI: StableBondContract,
    reserveContractAbi: StableReserveContract,
    bondContractHelperABI: BondHelperContract,
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

export const dai7 = new StableBond({
    name: "dai7",
    displayName: "DAI",
    bondToken: "DAI",
    rewardToken: "LUX",
    bondIconSvg: DaiIcon,
    bondContractABI: StableBondContract,
    reserveContractAbi: StableReserveContract,
    bondContractHelperABI: BondHelperContract,
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

export const dai14 = new StableBond({
    name: "dai14",
    displayName: "DAI",
    bondToken: "DAI",
    rewardToken: "LUX",
    bondIconSvg: DaiIcon,
    bondContractABI: StableBondContract,
    reserveContractAbi: StableReserveContract,
    bondContractHelperABI: BondHelperContract,
    networkAddrs: {
        [Networks.FTM]: {
            bondAddress: "0x73eE5Fcd1336246C74f6448B1d528aeacF5404f2",
            reserveAddress: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
        },
        [Networks.BSC]: {
            bondAddress: "",
            reserveAddress: "",
        },
    },
    tokensInStrategy: "00000000000000000000000",
});

export const dai28 = new StableBond({
    name: "dai28",
    displayName: "DAI",
    bondToken: "DAI",
    rewardToken: "LUX",
    bondIconSvg: DaiIcon,
    bondContractABI: StableBondContract,
    reserveContractAbi: StableReserveContract,
    bondContractHelperABI: BondHelperContract,
    networkAddrs: {
        [Networks.FTM]: {
            bondAddress: "0x1a7bA76b2A421E0E730809C40bE4a685dE29307c",
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
    bondContractHelperABI: BondHelperContract,
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

export const wftm7 = new CustomBond({
    name: "wftm7",
    displayName: "WFTM",
    bondToken: "FTM",
    rewardToken: "LUX",
    bondIconSvg: FtmIcon,
    bondContractABI: WftmBondContract,
    reserveContractAbi: StableReserveContract,
    bondContractHelperABI: BondHelperContract,
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

export const wftm14 = new CustomBond({
    name: "wftm14",
    displayName: "WFTM",
    bondToken: "FTM",
    rewardToken: "LUX",
    bondIconSvg: FtmIcon,
    bondContractABI: WftmBondContract,
    reserveContractAbi: StableReserveContract,
    bondContractHelperABI: BondHelperContract,
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

export const wftm28 = new CustomBond({
    name: "wftm28",
    displayName: "WFTM",
    bondToken: "FTM",
    rewardToken: "LUX",
    bondIconSvg: FtmIcon,
    bondContractABI: WftmBondContract,
    reserveContractAbi: StableReserveContract,
    bondContractHelperABI: BondHelperContract,
    networkAddrs: {
        [Networks.FTM]: {
            bondAddress: "0x89EA4331183730F289DEAfc926cF0541364F169D",
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
    displayName: "LUX-DAI",
    bondToken: "DAI",
    rewardToken: "LUX",
    bondIconSvg: DaiLuxorIcon,
    bondContractABI: DaiLpBondContract,
    reserveContractAbi: LpReserveContract,
    bondContractHelperABI: BondHelperContract,
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

export const daiLuxor7 = new LPBond({
    name: "dai_lux_lp_7",
    displayName: "LUX-DAI",
    bondToken: "DAI",
    rewardToken: "LUX",
    bondIconSvg: DaiLuxorIcon,
    bondContractABI: DaiLpBondContract,
    reserveContractAbi: LpReserveContract,
    bondContractHelperABI: BondHelperContract,
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

export const daiLuxor14 = new LPBond({
    name: "dai_lux_lp_14",
    displayName: "LUX-DAI",
    bondToken: "DAI",
    rewardToken: "LUX",
    bondIconSvg: DaiLuxorIcon,
    bondContractABI: DaiLpBondContract,
    reserveContractAbi: LpReserveContract,
    bondContractHelperABI: BondHelperContract,
    networkAddrs: {
        [Networks.FTM]: {
            // token0: DAI
            bondAddress: "0xaFADcDca5Aa1F187B357499f2e3BA94D3Cc32ad1",
            reserveAddress: "0x46729c2AeeabE7774a0E710867df80a6E19Ef851",
        },
        [Networks.BSC]: {
            bondAddress: "",
            reserveAddress: "",
        },
    },
    lpUrl: "https://app.soulswap.finance/exchange/add/0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E/0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b",
});

export const daiLuxor28 = new LPBond({
    name: "dai_lux_lp_28",
    displayName: "LUX-DAI",
    bondToken: "DAI",
    rewardToken: "LUX",
    bondIconSvg: DaiLuxorIcon,
    bondContractABI: DaiLpBondContract,
    reserveContractAbi: LpReserveContract,
    bondContractHelperABI: BondHelperContract,
    networkAddrs: {
        [Networks.FTM]: {
            // token0: DAI
            bondAddress: "0xAE08cf625d4232935D2F1b331517aC0089163DB2",
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
    bondContractHelperABI: BondHelperContract,
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

export const ftmLuxor7 = new CustomLPBond({
    name: "ftm_lux_lp_7",
    displayName: "LUX-FTM",
    bondToken: "FTM",
    rewardToken: "LUX",
    bondIconSvg: FtmLuxorIcon,
    bondContractABI: FtmLpBondContract,
    reserveContractAbi: LpReserveContract,
    bondContractHelperABI: BondHelperContract,
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

export const ftmLuxor14 = new CustomLPBond({
    name: "ftm_lux_lp_14",
    displayName: "LUX-FTM",
    bondToken: "FTM",
    rewardToken: "LUX",
    bondIconSvg: FtmLuxorIcon,
    bondContractABI: FtmLpBondContract,
    reserveContractAbi: LpReserveContract,
    bondContractHelperABI: BondHelperContract,
    networkAddrs: {
        [Networks.FTM]: {
            // token0: WFTM
            bondAddress: "0x0A98e728f0537f40e8dC261D633fe4a00E1aFA72",
            reserveAddress: "0x951BBB838e49F7081072895947735b0892cCcbCD",
        },
        [Networks.BSC]: {
            bondAddress: "",
            reserveAddress: "",
        },
    },
    lpUrl: "https://app.soulswap.finance/exchange/add/ETH/0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b",
});

export const ftmLuxor28 = new CustomLPBond({
    name: "ftm_lux_lp_28",
    displayName: "LUX-FTM",
    bondToken: "FTM",
    rewardToken: "LUX",
    bondIconSvg: FtmLuxorIcon,
    bondContractABI: FtmLpBondContract,
    reserveContractAbi: LpReserveContract,
    bondContractHelperABI: BondHelperContract,
    networkAddrs: {
        [Networks.FTM]: {
            // token0: WFTM
            bondAddress: "0xAbeEd495A87fccc2988F0CdaCf314F23AF52B685",
            reserveAddress: "0x951BBB838e49F7081072895947735b0892cCcbCD",
        },
        [Networks.BSC]: {
            bondAddress: "",
            reserveAddress: "",
        },
    },
    lpUrl: "https://app.soulswap.finance/exchange/add/ETH/0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b",
});

export default [dai, dai7, dai14, dai28, daiLuxor, daiLuxor7, daiLuxor14, daiLuxor28, ftmLuxor, ftmLuxor7, ftmLuxor14, ftmLuxor28, wftm, wftm7, wftm14, wftm28];
