import { ethers } from "ethers";
import { LpReserveContract } from "../abi";
import { ftmLuxor } from "../helpers/bond";
import { Networks } from "../constants/blockchain";

export async function getMarketPrice(networkID: Networks, provider: ethers.Signer | ethers.providers.Provider): Promise<number> {
    const ftmLuxorAddress = ftmLuxor.getAddressForReserve(networkID);
    const pairContract = new ethers.Contract(ftmLuxorAddress, LpReserveContract, provider);
    const reserves = await pairContract.getReserves();
    const marketPrice = reserves[0] / reserves[1];
    return marketPrice;
}
