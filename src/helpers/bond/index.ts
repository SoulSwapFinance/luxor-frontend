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
            bondAddress: "0xe36B6905ED81141CCE7f4B67d28EFBf5E6a26d0B",
            reserveAddress: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
        },
    },
});

export const wftm = new CustomBond({
    name: "wftm",
    displayName: "wFTM",
    bondToken: "FTM",
    bondIconSvg: FtmIcon,
    bondContractABI: WftmBondContract,
    reserveContractAbi: StableReserveContract,
    networkAddrs: {
        [Networks.FTM]: {
            bondAddress: "0xa2967b2DACa73cE9D1f89f399F9B8E9810C20934",
            reserveAddress: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
        },
    },
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
            bondAddress: "0x115D63A73Ab988b5f8a2bc61682803D82bbe01b0",
            reserveAddress: "0xf21e7307F8A0C18bF72fe3880EFe82868cC7EeB5",
        },
    },
    lpUrl: "https://app.soulswap.finance/exchange/add/0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E/0x01ABFdF9AA9B1689f5497409112e327B51397783",
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
            bondAddress: "0xD1aBB2e4b53BFfba07eE8c13D9Ea02EE2b5F45df",
            reserveAddress: "0x977d428e3Fca17118ed3d68907845591fB2B7fd7",
        },
    },
    lpUrl: "https://app.soulswap.finance/exchange/add/ETH/0x01ABFdF9AA9B1689f5497409112e327B51397783",
});

export default [dai, wftm, daiLuxor, ftmLuxor];
