import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { IERC20, DaiTokenContract, StakingContract, LumensTokenContract, LuxorTokenContract } from "../../abi";
import { setAll } from "../../helpers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider } from "@ethersproject/providers";
import { getMarketPrice, getTokenPrice } from "../../helpers";
import { RootState } from "../store";
import allBonds from "../../helpers/bond";
import { dai, wftm } from "src/helpers/tokens";

interface ILoadAppDetails {
    networkID: number;
    provider: JsonRpcProvider;
}

export const loadAppDetails = createAsyncThunk(
    "app/loadAppDetails",
    //@ts-ignore
    async ({ networkID, provider }: ILoadAppDetails) => {
        const daiPrice = getTokenPrice("DAI");
        const ftmPrice = getTokenPrice("FTM");
        console.log("DAI:%s", daiPrice);
        console.log("FTM:%s", ftmPrice);

        const addresses = getAddresses(networkID);

        const stakingContract = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, provider);
        const currentBlock = await provider.getBlockNumber();
        const currentBlockTime = (await provider.getBlock(currentBlock)).timestamp;
        const lumensContract = new ethers.Contract(addresses.LUM_ADDRESS, LumensTokenContract, provider);
        const luxorContract = new ethers.Contract(addresses.LUX_ADDRESS, LuxorTokenContract, provider);
        const daiContract = new ethers.Contract(addresses.DAI_ADDRESS, DaiTokenContract, provider);
        const wftmContract = new ethers.Contract(addresses.WFTM_ADDRESS, IERC20, provider);

        // const luxDaiContract = new ethers.Contract(addresses.LUX_DAI_ADDRESS, IERC20, provider);
        // const luxFtmContract = new ethers.Contract(addresses.LUX_FTM_ADDRESS, IERC20, provider);

        const marketPrice = ((await getMarketPrice(networkID, provider)) / Math.pow(10, 9)) * daiPrice;
        console.log("luxPrice:%s", await Number(marketPrice));

        const totalSupply = (await luxorContract.totalSupply()) / Math.pow(10, 9);
        const circSupply = (await lumensContract.circulatingSupply()) / Math.pow(10, 9);
        const daiReserves = (await daiContract.balanceOf(addresses.TREASURY_ADDRESS)) / Math.pow(10, 18);
        const wftmBalance = (await wftmContract.balanceOf(addresses.TREASURY_ADDRESS)) / Math.pow(10, 18);
        const wftmReserves = wftmBalance * ftmPrice;

        const luxOwned = (await luxorContract.balanceOf(addresses.DAO_ADDRESS)) / Math.pow(10, 9);
        const luxDaiLpAmount = (await luxorContract.balanceOf(addresses.LUX_DAI_ADDRESS)) / Math.pow(10, 9);
        const luxFtmLpAmount = (await luxorContract.balanceOf(addresses.LUX_FTM_ADDRESS)) / Math.pow(10, 9);
        console.log("luxDaiLp:%s", luxDaiLpAmount);
        console.log("luxFtmLp:%s", luxFtmLpAmount);
        const pooledLux = luxDaiLpAmount + luxFtmLpAmount;
        console.log("pooledLux:%s", pooledLux);

        const circulatingLuxor = totalSupply - luxOwned;

        const stakingTVL = circSupply * marketPrice;
        const marketCap = totalSupply * marketPrice;

        const tokenBalPromises = allBonds.map(bond => bond.getTreasuryBalance(networkID, provider));
        const tokenBalances = await Promise.all(tokenBalPromises);
        const treasuryBalance = tokenBalances.reduce((tokenBalance0, tokenBalance1) => tokenBalance0 + tokenBalance1, 0);

        const tokenAmountsPromises = allBonds.map(bond => bond.getTokenAmount(networkID, provider));
        const tokenAmounts = await Promise.all(tokenAmountsPromises);
        const rfvTreasury = tokenAmounts.reduce((tokenAmount0, tokenAmount1) => tokenAmount0 + tokenAmount1, 0);

        const luxorBondsAmountsPromises = allBonds.map(bond => bond.getLuxorAmount(networkID, provider));
        const luxorBondsAmounts = await Promise.all(luxorBondsAmountsPromises);
        const luxorAmount = luxorBondsAmounts.reduce((luxorAmount0, luxorAmount1) => luxorAmount0 + luxorAmount1, 0);
        const luxorSupply = totalSupply - luxorAmount;

        // RESERVES && LIQUIDITY //
        const rawReserves = daiReserves + wftmReserves;
        const reserves = rawReserves;
        const liquidity = treasuryBalance - rawReserves;

        console.log("reserves:%s", reserves);
        console.log("liquidity:%s", liquidity);

        const rfv = rfvTreasury / luxorSupply;

        const epoch = await stakingContract.epoch();
        const stakingReward = epoch.distribute;
        const circ = await lumensContract.circulatingSupply();
        const stakingRebase = stakingReward / circ;
        const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
        const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;

        const currentIndex = await stakingContract.index();
        const nextRebase = epoch.endTime;

        const treasuryRunway = rfvTreasury / circSupply;
        const runway = Math.log(treasuryRunway) / Math.log(1 + stakingRebase) / 3;

        return {
            currentIndex: Number(ethers.utils.formatUnits(currentIndex, "gwei")), // / 4.5,
            totalSupply,
            circulatingLuxor,
            luxOwned,
            pooledLux,
            marketCap,
            currentBlock,
            circSupply,
            fiveDayRate,
            treasuryBalance,
            reserves,
            liquidity,
            stakingAPY,
            stakingTVL,
            stakingRebase,
            marketPrice,
            currentBlockTime,
            nextRebase,
            rfv,
            runway,
        };
    },
);

const initialState = {
    loading: true,
};

export interface IAppSlice {
    loading: boolean;
    stakingTVL: number;
    marketPrice: number;
    marketCap: number;
    circSupply: number;
    currentIndex: string;
    currentBlock: number;
    currentBlockTime: number;
    fiveDayRate: number;
    treasuryBalance: number;
    reserves: number;
    liquidity: number;
    stakingAPY: number;
    stakingRebase: number;
    networkID: number;
    nextRebase: number;
    totalSupply: number;
    circulatingLuxor: number;
    luxOwned: number;
    pooledLux: number;
    rfv: number;
    runway: number;
}

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        fetchAppSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loadAppDetails.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(loadAppDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadAppDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            });
    },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
