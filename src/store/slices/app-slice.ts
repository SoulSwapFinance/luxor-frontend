import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { IERC20, DaiTokenContract, StakingContract, LumensTokenContract, LuxorSupplyContract, LuxorTokenContract } from "../../abi";
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
        const ethPrice = getTokenPrice("ETH");
        const ftmPrice = getTokenPrice("FTM");
        // console.log("DAI:%s", daiPrice);
        // console.log("ETH:%s", ethPrice);
        // console.log("FTM:%s", ftmPrice);

        const addresses = getAddresses(networkID);

        const stakingContract = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, provider);
        const luxorSupplyContract = new ethers.Contract(addresses.LUXOR_SUPPLY_ADDRESS, LuxorSupplyContract, provider);
        const currentBlock = await provider.getBlockNumber();
        const currentBlockTime = (await provider.getBlock(currentBlock)).timestamp;
        const lumensContract = new ethers.Contract(addresses.LUM_ADDRESS, LumensTokenContract, provider);
        const luxorContract = new ethers.Contract(addresses.LUX_ADDRESS, LuxorTokenContract, provider);
        const daiContract = new ethers.Contract(addresses.DAI_ADDRESS, DaiTokenContract, provider);
        const ethContract = new ethers.Contract(addresses.ETH_ADDRESS, IERC20, provider);
        const daiFtmContract = new ethers.Contract(addresses.DAI_FTM_ADDRESS, IERC20, provider);
        const ethFtmContract = new ethers.Contract(addresses.ETH_FTM_ADDRESS, IERC20, provider);
        const wftmContract = new ethers.Contract(addresses.WFTM_ADDRESS, IERC20, provider);
        const ftmLendContract = new ethers.Contract(addresses.FTM_LEND_ADDRESS, IERC20, provider);
        const daiLendContract = new ethers.Contract(addresses.DAI_LEND_ADDRESS, IERC20, provider);
        const ethLendContract = new ethers.Contract(addresses.ETH_LEND_ADDRESS, IERC20, provider);
        const wlumFtmContract = new ethers.Contract(addresses.WLUM_FTM_ADDRESS, IERC20, provider);
        // const luxDaiContract = new ethers.Contract(addresses.LUX_DAI_ADDRESS, IERC20, provider);
        // const luxFtmContract = new ethers.Contract(addresses.LUX_FTM_ADDRESS, IERC20, provider);

        const marketPrice = ((await getMarketPrice(networkID, provider)) / Math.pow(10, 9)) * daiPrice;
        // console.log("luxPrice:%s", await Number(marketPrice));

        const totalSupply = (await luxorContract.totalSupply()) / Math.pow(10, 9);
        const circSupply = (await lumensContract.circulatingSupply()) / Math.pow(10, 9);
        const daiReserves = (await daiContract.balanceOf(addresses.TREASURY_ADDRESS)) / Math.pow(10, 18);
        const wftmBalance = (await wftmContract.balanceOf(addresses.TREASURY_ADDRESS)) / Math.pow(10, 18);
        const wftmReserves = wftmBalance * ftmPrice;

        const luxOwned = (await luxorContract.balanceOf(addresses.DAO_ADDRESS)) / Math.pow(10, 9);
        const luxDaiLpAmount = (await luxorContract.balanceOf(addresses.LUX_DAI_ADDRESS)) / Math.pow(10, 9);
        const luxFtmLpAmount = (await luxorContract.balanceOf(addresses.LUX_FTM_ADDRESS)) / Math.pow(10, 9);
        const luxSoulLpAmount = (await luxorContract.balanceOf(addresses.LUX_SOUL_ADDRESS)) / Math.pow(10, 9);

        // console.log("luxDaiLp:%s", luxDaiLpAmount);
        // console.log("luxFtmLp:%s", luxFtmLpAmount);
        // console.log("luxSoulLp:%s", luxSoulLpAmount);
        const pooledLux = luxDaiLpAmount + luxFtmLpAmount + luxSoulLpAmount;
        // console.log("pooledLux:%s", pooledLux);
        const mintableLux = (await luxorSupplyContract.mintableLuxor()) / Math.pow(10, 9);
        // console.log("mintableLux:%s", mintableLux);

        const circulatingLuxor = totalSupply - luxOwned;

        const stakingTVL = circSupply * marketPrice;
        const marketCap = totalSupply * marketPrice;

        const tokenBalPromises = allBonds.map(bond => bond.getTreasuryBalance(networkID, provider));
        const tokenBalances = await Promise.all(tokenBalPromises);
        const rawTreasuryBalance = tokenBalances.reduce((tokenBalance0, tokenBalance1) => tokenBalance0 + tokenBalance1, 0);

        const daiFtmSupply = (await daiFtmContract.totalSupply()) / Math.pow(10, 18);
        const ethFtmSupply = (await ethFtmContract.totalSupply()) / Math.pow(10, 18);
        const wlumFtmSupply = (await wlumFtmContract.totalSupply()) / Math.pow(10, 18);
        const daiFtmLpPrice = ((await daiContract.balanceOf(addresses.DAI_FTM_ADDRESS)) * 2) / daiFtmSupply / Math.pow(10, 18);
        const ethFtmLpPrice = ((await ethContract.balanceOf(addresses.ETH_FTM_ADDRESS)) * 2 * ethPrice) / ethFtmSupply / Math.pow(10, 18);
        const daiFtmLpBalance = (await daiFtmContract.balanceOf(addresses.TREASURY_ADDRESS)) / Math.pow(10, 18);
        const daiFtmInvestmentValue = ((await daiFtmContract.balanceOf(addresses.TREASURY_ADDRESS)) * daiFtmLpPrice) / Math.pow(10, 18);
        const ethFtmInvestmentValue = ((await ethFtmContract.balanceOf(addresses.TREASURY_ADDRESS)) * ethFtmLpPrice) / Math.pow(10, 18);
        const wlumFtmInvestmentValue = ((await wlumFtmContract.balanceOf(addresses.TREASURY_ADDRESS)) * wlumFtmLpPrice) / Math.pow(10, 18);
        const liquidityInvestmentValue = daiFtmInvestmentValue + ethFtmInvestmentValue + wlumFtmInvestmentValue;
        const ethLendInvestmentValue = ((await ethLendContract.balanceOf(addresses.TREASURY_ADDRESS)) * ethPrice) / Math.pow(10, 18);
        const daiLendInvestmentValue = ((await daiLendContract.balanceOf(addresses.TREASURY_ADDRESS)) * daiPrice) / Math.pow(10, 18);
        const ftmLendInvestmentValue = ((await ftmLendContract.balanceOf(addresses.TREASURY_ADDRESS)) * ftmPrice) / Math.pow(10, 18);
        const lendInvestmentValue = ftmLendInvestmentValue + daiLendInvestmentValue + ethLendInvestmentValue;
        // console.log("ethValue:%s", ethLendInvestmentValue);
        // console.log("ethFtmPrice:%s", ethFtmLpPrice);
        // console.log("ethFtmSupply:%s", ethFtmSupply);
        // console.log("ethFtmLpValue:%s", ethFtmInvestmentValue);
        const investmentsValue = lendInvestmentValue + liquidityInvestmentValue;
        // console.log("lpPrice:%s", daiFtmLpPrice);
        // console.log("investedLiquidity:%s", daiFtmLpBalance);
        // console.log("investmentsValue:%s", investmentsValue);
        const treasuryLuxorLiquidity = rawTreasuryBalance / 4;
        const treasuryBalance = treasuryLuxorLiquidity + investmentsValue;
        // console.log("treasuryBalance:%s", treasuryBalance);

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
        const liquidity = treasuryLuxorLiquidity - rawReserves;

        // console.log("treasury:%s", treasuryBalance);
        // console.log("reserves:%s", reserves);
        // console.log("liquidity:%s", liquidity);

        const rfv = rfvTreasury / luxorSupply;

        const epoch = await stakingContract.epoch();
        const stakingReward = epoch.distribute;
        const circ = await lumensContract.circulatingSupply();
        const stakingRebase = stakingReward / circ;
        const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
        const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;

        const currentIndex = await stakingContract.index();
        const nextRebase = epoch.endTime;
        const currentEpoch = epoch.number;

        const treasuryRunway = rfvTreasury / circSupply;
        const runway = Math.log(treasuryRunway) / Math.log(1 + stakingRebase) / 3;

        return {
            currentIndex: Number(ethers.utils.formatUnits(currentIndex, "gwei")), // / 4.5,
            totalSupply,
            circulatingLuxor,
            luxOwned,
            pooledLux,
            mintableLux,
            marketCap,
            currentBlock,
            currentEpoch,
            circSupply,
            fiveDayRate,
            treasuryBalance,
            investmentsValue,
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
    currentEpoch: number;
    currentBlockTime: number;
    fiveDayRate: number;
    treasuryBalance: number;
    investmentsValue: number;
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
    mintableLux: number;
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
