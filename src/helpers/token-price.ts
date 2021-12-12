import axios from "axios";

const cache: { [key: string]: number } = {};

export const loadTokenPrices = async () => {
    const url = "https://api.coingecko.com/api/v3/simple/price?ids=fantom,dai,soul-swap&vs_currencies=usd";
    const { data } = await axios.get(url);

    // cache["LUX"] = data["olympus"].usd; // TODO
    cache["DAI"] = data["dai"].usd;
    cache["FTM"] = data["fantom"].usd;
    cache["SOUL"] = data["soul-swap"].usd;
};

export const getTokenPrice = (symbol: string): number => {
    return Number(cache[symbol]);
};

export function formatCurrency(c: number, precision = 0) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: precision,
        minimumFractionDigits: precision,
    }).format(c);
}
