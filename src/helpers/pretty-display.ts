import BigNumber from "bignumber.js";

function trimVerboseDecimals(number: string): string {
    const decimalIndex = number.indexOf(".");
    if (decimalIndex === -1) {
        return number;
    }

    let zeroDecimals = 0;
    for (let i = decimalIndex + 1; i < number.length; i += 1) {
        if (number[i] === "0") {
            zeroDecimals += 1;
        } else {
            break;
        }
    }
    const MEANINGFUL_DECIMAL_PLACES = 6;
    return number.substring(0, decimalIndex + zeroDecimals + 1 + MEANINGFUL_DECIMAL_PLACES);
}

export function prettyDisplayNumber(number: BigNumber): string {
    if (number.gte(1000)) {
        return number.toFormat(0);
    } else if (number.gt(1)) {
        return number.toFormat(2);
    } else {
        return trimVerboseDecimals(number.toFormat());
    }
}
