import { ethers, BigNumber } from "ethers";
import { getAddresses } from "../../constants";
import { Networks } from "../../constants/blockchain";
import { useAddress, useWeb3Context } from "../../hooks";
import { wLumTokenContract as wLUM, IERC20, wLumTokenContract } from "../../abi";
import { clearPendingTxn, fetchPendingTxns, getWrappingTypeText } from "./pending-txns-slice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, loadAccountDetails } from "./account-slice";
import { error, info, success, warning } from "./messages-slice";
import { messages } from "../../constants/messages";
import { IActionValueAsyncThunk, IChangeApprovalAsyncThunk, IJsonRPCError } from "./interfaces";
import { sleep } from "../../helpers/sleep";
import { metamaskErrorWrap } from "../../helpers/metamask-error-wrap";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { getGasPrice } from "src/helpers/get-gas-price";

interface IUAData {
    address: string;
    value: string;
    approved: boolean;
    txHash: string | null;
    type: string | null;
}

function alreadyApprovedToken(token: string, wrapAllowance: BigNumber, unwrapAllowance: BigNumber) {
    // set defaults
    let bigZero = BigNumber.from("0");
    let applicableAllowance = bigZero;

    // determine which allowance to check
    if (token === "lum") {
        applicableAllowance = wrapAllowance;
    } else if (token === "wlum") {
        applicableAllowance = unwrapAllowance;
    }

    // check if allowance exists
    if (applicableAllowance.gt(bigZero)) return true;

    return false;
}

export const changeApproval = createAsyncThunk("wrap/changeApproval", async ({ token, provider, address, networkID }: IChangeApprovalAsyncThunk, { dispatch }) => {
    if (!provider) {
        //   dispatch(error("Please connect your wallet!"));
        return;
    }

    const signer = provider.getSigner();
    const addresses = getAddresses(networkID);
    const lumensAddress = new ethers.Contract(addresses.LUMENS_ADDRESS, IERC20, signer);
    const wlumensAddress = new ethers.Contract(addresses.WLUM_ADDRESS, wLUM, signer);
    let approveTx;
    let wrapAllowance = await lumensAddress.allowance(address, addresses.WLUM_ADDRESS);
    let unwrapAllowance = await wlumensAddress.allowance(address, addresses.WLUM_ADDRESS);

    // return early if approval has already happened
    if (alreadyApprovedToken(token, wrapAllowance, unwrapAllowance)) {
        //   dispatch(info("Approval completed."));
        return dispatch(
            fetchAccountSuccess({
                wrapping: {
                    luxWrap: +wrapAllowance,
                    luxUnwrap: +unwrapAllowance,
                },
            }),
        );
    }

    try {
        if (token === "lum") {
            // won't run if wrapAllowance > 0
            approveTx = await lumensAddress.approve(addresses.WLUM_ADDRESS, ethers.utils.parseUnits("1000000000", "gwei").toString());
        } else if (token === "wlum") {
            approveTx = await wlumensAddress.approve(addresses.WLUM_ADDRESS, ethers.utils.parseUnits("1000000000", "gwei").toString());
        }

        const text = "Approve " + (token === "lum" ? "Wrapping" : "Unwrapping");
        const pendingTxnType = token === "lum" ? "approve_wrapping" : "approve_unwrapping";
        if (approveTx) {
            dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));

            await approveTx.wait();
            dispatch(success({ text: messages.tx_successfully_send }));
        }
    } catch (e: any) {
        return metamaskErrorWrap(e, dispatch);
    } finally {
        if (approveTx) {
            dispatch(clearPendingTxn(approveTx.hash));
        }
    }

    await sleep(2);
    // go get fresh allowances
    wrapAllowance = await lumensAddress.allowance(address, addresses.WLUM_ADDRESS);
    unwrapAllowance = await wlumensAddress.allowance(address, addresses.WLUM_ADDRESS);

    return dispatch(
        fetchAccountSuccess({
            wrapping: {
                luxWrap: +wrapAllowance,
                luxUnwrap: +unwrapAllowance,
            },
        }),
    );
});

export interface IWrapDetails {
    isWrap: boolean;
    value: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
}

const calcWrapValue = async ({ isWrap, value, provider, networkID }: IWrapDetails): Promise<number> => {
    const addresses = getAddresses(networkID);

    const amountInWei = isWrap ? ethers.utils.parseUnits(value, "gwei") : ethers.utils.parseEther(value);

    let wrapValue = 0;

    const wlumContract = new ethers.Contract(addresses.WLUM_ADDRESS, wLumTokenContract, provider);

    if (isWrap) {
        const wlumValue = await wlumContract.LUMTowLUM(amountInWei);
        wrapValue = wlumValue / Math.pow(10, 18);
    } else {
        const lumensValue = await wlumContract.wLUMToLUM(amountInWei);
        wrapValue = lumensValue / Math.pow(10, 9);
    }

    return wrapValue;
};

export interface IChangeWrap {
    isWrap: boolean;
    value: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
    address: string;
}

export const changeWrap = createAsyncThunk("wrapping/changeWrap", async ({ isWrap, value, provider, networkID, address }: IChangeWrap, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }

    const signer = provider.getSigner();
    const addresses = getAddresses(networkID);
    const amountInWei = isWrap ? ethers.utils.parseUnits(value, "gwei") : ethers.utils.parseEther(value);
    const wlumensAddress = new ethers.Contract(addresses.WLUM_ADDRESS, wLUM, signer);
    const wlumContract = new ethers.Contract(addresses.WLUM_ADDRESS, wLumTokenContract, provider);
    let wrapTx;
    let uaData: IUAData = {
        address: address,
        value: value,
        approved: true,
        txHash: null,
        type: null,
    };
    try {
        const gasPrice = await getGasPrice(provider);

        if (isWrap) {
            wrapTx = await wlumContract.wrap(amountInWei, { gasPrice });
        } else {
            wrapTx = await wlumContract.unwrap(amountInWei, { gasPrice });
        }

        const pendingTxnType = isWrap ? "wrapping" : "unwrapping";
        dispatch(fetchPendingTxns({ txnHash: wrapTx.hash, text: getWrappingTypeText(isWrap), type: pendingTxnType }));
        await wrapTx.wait();
        dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (wrapTx) {
            dispatch(clearPendingTxn(wrapTx.hash));
        }
    }

    await sleep(10);
    dispatch(info({ text: messages.your_balance_update_soon }));
    await sleep(15);
    await dispatch(loadAccountDetails({ networkID: 250, address, provider: provider })); // todo: make dynamic for chainId
    dispatch(info({ text: messages.your_balance_updated }));
});
