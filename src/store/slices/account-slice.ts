import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { LuxorTokenContract, LumensTokenContract, DaiTokenContract, wLumTokenContract } from "../../abi";
import { setAll } from "../../helpers";

import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Bond } from "../../helpers/bond/bond";
import { Networks } from "../../constants/blockchain";
import React from "react";
import { RootState } from "../store";
import { IToken } from "../../helpers/tokens";

interface IGetBalances {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IAccountBalances {
    balances: {
        lumens: string;
        luxor: string;
        wlum: string;
    };
}

export const getBalances = createAsyncThunk("account/getBalances", async ({ address, networkID, provider }: IGetBalances): Promise<IAccountBalances> => {
    const addresses = getAddresses(networkID);

    const lumensContract = new ethers.Contract(addresses.LUMENS_ADDRESS, LumensTokenContract, provider);
    const lumensBalance = await lumensContract.balanceOf(address);

    const luxorContract = new ethers.Contract(addresses.LUXOR_ADDRESS, LuxorTokenContract, provider);
    const luxorBalance = await luxorContract.balanceOf(address);

    const wlumContract = new ethers.Contract(addresses.WLUM_ADDRESS, wLumTokenContract, provider);
    const wlumBalance = await wlumContract.balanceOf(address);

    return {
        balances: {
            lumens: ethers.utils.formatUnits(lumensBalance, "gwei"),
            luxor: ethers.utils.formatUnits(luxorBalance, "gwei"),
            wlum: ethers.utils.formatEther(wlumBalance),
        },
    };
});

interface ILoadAccountDetails {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IUserAccountDetails {
    balances: {
        luxor: string;
        lumens: string;
        wlum: string;
    };
    staking: {
        luxor: number;
        lumens: number;
    };
    wrapping: {
        lumens: number;
    };
}

export const loadAccountDetails = createAsyncThunk("account/loadAccountDetails", async ({ networkID, provider, address }: ILoadAccountDetails): Promise<IUserAccountDetails> => {
    let luxorBalance = 0;
    let lumensBalance = 0;

    let wlumBalance = 0;
    let lumWlumAllowance = 0;

    let stakeAllowance = 0;
    let unstakeAllowance = 0;

    const addresses = getAddresses(networkID);

    if (addresses.LUXOR_ADDRESS) {
        const luxorContract = new ethers.Contract(addresses.LUXOR_ADDRESS, LuxorTokenContract, provider);
        luxorBalance = await luxorContract.balanceOf(address);
        stakeAllowance = await luxorContract.allowance(address, addresses.STAKING_HELPER_ADDRESS);
    }

    if (addresses.LUMENS_ADDRESS) {
        const lumensContract = new ethers.Contract(addresses.LUMENS_ADDRESS, LumensTokenContract, provider);
        lumensBalance = await lumensContract.balanceOf(address);
        unstakeAllowance = await lumensContract.allowance(address, addresses.STAKING_ADDRESS);

        if (addresses.WLUM_ADDRESS) {
            lumWlumAllowance = await lumensContract.allowance(address, addresses.WLUM_ADDRESS);
        }
    }
    if (addresses.WLUM_ADDRESS) {
        const wlumContract = new ethers.Contract(addresses.WLUM_ADDRESS, wLumTokenContract, provider);
        wlumBalance = await wlumContract.balanceOf(address);
    }

    return {
        balances: {
            lumens: ethers.utils.formatUnits(lumensBalance, "gwei"),
            luxor: ethers.utils.formatUnits(luxorBalance, "gwei"),
            wlum: ethers.utils.formatEther(wlumBalance),
        },
        staking: {
            luxor: Number(stakeAllowance),
            lumens: Number(unstakeAllowance),
        },
        wrapping: {
            lumens: Number(lumWlumAllowance),
        },
    };
});

interface ICalcUserBondDetails {
    address: string;
    bond: Bond;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
}

export interface IUserBondDetails {
    allowance: number;
    balance: number;
    ftmBalance: number;
    interestDue: number;
    bondMaturationBlock: number;
    pendingPayout: number; //Payout formatted in gwei.
}

export const calculateUserBondDetails = createAsyncThunk("account/calculateUserBondDetails", async ({ address, bond, networkID, provider }: ICalcUserBondDetails) => {
    if (!address) {
        return new Promise<any>(resevle => {
            resevle({
                bond: "",
                displayName: "",
                bondIconSvg: "",
                isLP: false,
                allowance: 0,
                balance: 0,
                interestDue: 0,
                bondMaturationBlock: 0,
                pendingPayout: "",
                ftmBalance: 0,
            });
        });
    }

    const bondContract = bond.getContractForBond(networkID, provider);
    const reserveContract = bond.getContractForReserve(networkID, provider);

    let interestDue, pendingPayout, bondMaturationBlock;

    const bondDetails = await bondContract.bondInfo(address);
    interestDue = bondDetails.payout / Math.pow(10, 9);
    bondMaturationBlock = Number(bondDetails.vesting) + Number(bondDetails.lastTime);
    pendingPayout = await bondContract.pendingPayoutFor(address);

    let allowance,
        balance = "0";

    allowance = await reserveContract.allowance(address, bond.getAddressForBond(networkID));
    balance = await reserveContract.balanceOf(address);
    const balanceVal = ethers.utils.formatEther(balance);

    const ftmBalance = await provider.getSigner().getBalance();
    const ftmVal = ethers.utils.formatEther(ftmBalance);

    const pendingPayoutVal = ethers.utils.formatUnits(pendingPayout, "gwei");

    return {
        bond: bond.name,
        displayName: bond.displayName,
        bondIconSvg: bond.bondIconSvg,
        isLP: bond.isLP,
        allowance: Number(allowance),
        balance: Number(balanceVal),
        ftmBalance: Number(ftmVal),
        interestDue,
        bondMaturationBlock,
        pendingPayout: Number(pendingPayoutVal),
    };
});

interface ICalcUserTokenDetails {
    address: string;
    token: IToken;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
}

export interface IUserTokenDetails {
    allowance: number;
    balance: number;
    isFtm?: boolean;
}

export const calculateUserTokenDetails = createAsyncThunk("account/calculateUserTokenDetails", async ({ address, token, networkID, provider }: ICalcUserTokenDetails) => {
    if (!address) {
        return new Promise<any>(resevle => {
            resevle({
                token: "",
                address: "",
                img: "",
                allowance: 0,
                balance: 0,
            });
        });
    }

    if (token.isFtm) {
        const ftmBalance = await provider.getSigner().getBalance();
        const ftmVal = ethers.utils.formatEther(ftmBalance);

        return {
            token: token.name,
            tokenIcon: token.img,
            balance: Number(ftmVal),
            isFtm: true,
        };
    }

    const addresses = getAddresses(networkID);

    const tokenContract = new ethers.Contract(token.address, DaiTokenContract, provider);

    let allowance,
        balance = "0";

    allowance = await tokenContract.allowance(address, addresses.ZAPIN_ADDRESS);
    balance = await tokenContract.balanceOf(address);

    const balanceVal = Number(balance) / Math.pow(10, token.decimals);

    return {
        token: token.name,
        address: token.address,
        img: token.img,
        allowance: Number(allowance),
        balance: Number(balanceVal),
    };
});

export interface IAccountSlice {
    bonds: { [key: string]: IUserBondDetails };
    balances: {
        lumens: string;
        luxor: string;
        wlum: string;
    };
    loading: boolean;
    staking: {
        luxor: number;
        lumens: number;
    };
    wrapping: {
        lumens: number;
    };
    tokens: { [key: string]: IUserTokenDetails };
}

const initialState: IAccountSlice = {
    loading: true,
    bonds: {},
    balances: { lumens: "", luxor: "", wlum: "" },
    staking: { luxor: 0, lumens: 0 },
    wrapping: { lumens: 0 },
    tokens: {},
};

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        fetchAccountSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loadAccountDetails.pending, state => {
                state.loading = true;
            })
            .addCase(loadAccountDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadAccountDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
            .addCase(getBalances.pending, state => {
                state.loading = true;
            })
            .addCase(getBalances.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(getBalances.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
            .addCase(calculateUserBondDetails.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
                if (!action.payload) return;
                const bond = action.payload.bond;
                state.bonds[bond] = action.payload;
                state.loading = false;
            })
            .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
            .addCase(calculateUserTokenDetails.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(calculateUserTokenDetails.fulfilled, (state, action) => {
                if (!action.payload) return;
                const token = action.payload.token;
                state.tokens[token] = action.payload;
                state.loading = false;
            })
            .addCase(calculateUserTokenDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            });
    },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
