import LuxImg from "../assets/tokens/LUX.svg";
import LumImg from "../assets/tokens/LUM.svg";

function toUrl(tokenPath: string): string {
    const host = window.location.origin;
    return `${host}/${tokenPath}`;
}

export function getTokenUrl(name: string) {
    if (name === "lux") {
        return toUrl(LuxImg);
    }

    if (name === "lum") {
        return toUrl(LumImg);
    }

    throw Error(`Token url doesn't support: ${name}`);
}
