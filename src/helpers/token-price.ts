import axios from "axios";

const cache: { [key: string]: number } = {};

export const loadTokenPrices = async () => {
    const url = "https://api.coingecko.com/api/v3/simple/price?ids=olympus,olympus,fantom,dai&vs_currencies=usd";
    const { data } = await axios.get(url);

    cache["LUX"] = data["olympus"].usd; // TODO
    cache["OHM"] = data["olympus"].usd; // TODO
    cache["FTM"] = data["fantom"].usd;
    cache["DAI"] = data["dai"].usd;
};

export const getTokenPrice = (symbol: string): number => {
    return Number(cache[symbol]);
};
