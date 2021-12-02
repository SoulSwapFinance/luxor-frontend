import LuxImg from "../assets/tokens/TIME.svg";
import LumImg from "../assets/tokens/MEMO.png";

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
