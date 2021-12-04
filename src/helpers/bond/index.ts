import { Networks } from "../../constants/blockchain";
import { LPBond, CustomLPBond } from "./lp-bond";
import { StableBond, CustomBond } from "./stable-bond";

import DaiIcon from "../../assets/tokens/DAI.svg";
import FtmIcon from "../../assets/tokens/FTM.svg";
import DaiLuxorIcon from "../../assets/tokens/DAI.svg";
import FtmLuxorIcon from "../../assets/tokens/FTM.svg";

import { StableBondContract, LpBondContract, WftmBondContract, StableReserveContract, LpReserveContract } from "../../abi";

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
    },
    tokensInStrategy: "00000000000000000000000000",
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
    },
    tokensInStrategy: "00000000000000000000000",
});

export const daiLuxor = new LPBond({
    name: "dai_lux_lp",
    displayName: "LUX-DAI LP",
    bondToken: "DAI",
    bondIconSvg: DaiLuxorIcon,
    bondContractABI: LpBondContract,
    reserveContractAbi: LpReserveContract,
    networkAddrs: {
        [Networks.FTM]: {
            bondAddress: "0x194C771f142751A0368aE9E92dC4eF7E0B5327D5",
            reserveAddress: "0x46729c2AeeabE7774a0E710867df80a6E19Ef851",
        },
    },
    lpUrl: "https://app.soulswap.finance/exchange/add/0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E/0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b",
});

export const ftmLuxor = new CustomLPBond({
    name: "ftm_lux_lp",
    displayName: "LUX-FTM LP",
    bondToken: "FTM",
    bondIconSvg: FtmLuxorIcon,
    bondContractABI: LpBondContract,
    reserveContractAbi: LpReserveContract,
    networkAddrs: {
        [Networks.FTM]: {
            bondAddress: "0x6fB6368e59621eD69639a44C7b39930780cCCE51",
            reserveAddress: "0x951BBB838e49F7081072895947735b0892cCcbCD",
        },
    },
    lpUrl: "https://app.soulswap.finance/exchange/add/ETH/0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b",
});

export default [dai, wftm, daiLuxor, ftmLuxor];
