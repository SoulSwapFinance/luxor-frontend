import { ethers } from "ethers";
import { LpReserveContract } from "../abi";
import { daiLuxor } from "../helpers/bond";
import { Networks } from "../constants/blockchain";

export async function getMarketPrice(networkID: Networks, provider: ethers.Signer | ethers.providers.Provider): Promise<number> {
    const daiLuxorAddress = daiLuxor.getAddressForReserve(networkID);
    const pairContract = new ethers.Contract(daiLuxorAddress, LpReserveContract, provider);
    const reserves = await pairContract.getReserves();
    const marketPrice = reserves[1] / reserves[0];
    return marketPrice;
}
