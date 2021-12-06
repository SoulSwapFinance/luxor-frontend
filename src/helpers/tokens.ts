import FtmIcon from "../assets/tokens/FTM.svg";
import LuxorIcon from "../assets/tokens/LUX.svg";
import LumensIcon from "../assets/tokens/LUM.svg";
// import BnbIcon from "../assets/tokens/BNB.png";
// import IceIcon from "../assets/tokens/ICE.png";
import DaiIcon from "../assets/tokens/DAI.svg";
// import UsdcIcon from "../assets/tokens/USDC.e.png";
// import UsdtIcon from "../assets/tokens/USDT.e.png";
import WftmIcon from "../assets/tokens/WFTM.png";
// import WBtcIcon from "../assets/tokens/WBTC.e.png";
// import WethIcon from "../assets/tokens/WETH.e.png";

export interface IToken {
    name: string;
    address: string;
    img: string;
    isFtm?: boolean;
    decimals: number;
}

export const ftm: IToken = {
    name: "FTM",
    isFtm: true,
    img: FtmIcon,
    address: "",
    decimals: 18,
};

// const bnb: IToken = {
//     name: "BNB",
//     address: "0xD67de0e0a0Fd7b15dC8348Bb9BE742F3c5850454",
//     img: BnbIcon,
//     decimals: 18,
// };

export const dai: IToken = {
    name: "DAI",
    address: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
    img: DaiIcon,
    decimals: 18,
};

// const ice: IToken = {
//     name: "ICE",
//     address: "0xf16e81dce15B08F326220742020379B855B87DF9",
//     img: IceIcon,
//     decimals: 18,
// };

// const usdt: IToken = {
//     name: "USDT",
//     address: "0x049d68029688eAbF473097a2fC38ef61633A3C7A",
//     img: UsdtIcon,
//     decimals: 6,
// };

export const lux: IToken = {
    name: "LUX",
    address: "0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b",
    img: LuxorIcon,
    decimals: 9,
};

export const lum: IToken = {
    name: "LUM",
    address: "0x4290b33158F429F40C0eDc8f9b9e5d8C5288800c",
    img: LumensIcon,
    decimals: 9,
};

// const usdc: IToken = {
//     name: "USDC",
//     address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
//     img: UsdcIcon,
//     decimals: 6,
// };

export const wftm: IToken = {
    name: "WFTM",
    address: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
    img: WftmIcon,
    decimals: 18,
};

// const wbtc: IToken = {
//     name: "WBTC",
//     address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
//     img: WBtcIcon,
//     decimals: 8,
// };

// const weth: IToken = {
//     name: "WETH",
//     address: "0x74b23882a30290451A17c44f4F05243b6b58C76d",
//     img: WethIcon,
//     decimals: 18,
// };

export default [dai, lux, lum, ftm, wftm];
