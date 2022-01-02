import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, OutlinedInput, InputAdornment, Slide, FormControl } from "@material-ui/core";
import { shorten, trim, prettifySeconds } from "../../helpers";
import { changeApproval, bondAsset, calcBondDetails } from "../../store/slices/bond-slice";
import { useWeb3Context } from "../../hooks";
import { IPendingTxn, isPendingTxn, txnButtonText } from "../../store/slices/pending-txns-slice";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import { IAllBondData } from "../../hooks/bonds";
import useDebounce from "../../hooks/debounce";
import { messages } from "../../constants/messages";
import { warning } from "../../store/slices/messages-slice";
import Zapin from "./Zapin";
import "./bond.scss";

interface IBondPurchaseProps {
    bond: IAllBondData;
    slippage: number;
}

function BondPurchase({ bond, slippage }: IBondPurchaseProps) {
    const dispatch = useDispatch();
    const { provider, address, chainID, checkWrongNetwork } = useWeb3Context();

    const [quantity, setQuantity] = useState("");
    const [useWFTM, setUseWFTM] = useState(false);

    const isBondLoading = useSelector<IReduxState, boolean>(state => state.bonding.loading ?? true);
    const [zapinOpen, setZapinOpen] = useState(false);

    const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });

    const vestingPeriod = () => {
        return prettifySeconds(bond.vestingTerm, "day");
    };

    async function onBond() {
        if (await checkWrongNetwork()) return;

        if (quantity === "") {
            dispatch(warning({ text: messages.before_minting }));
            //@ts-ignore
        } else if (isNaN(quantity)) {
            dispatch(warning({ text: messages.before_minting }));
        } else if (bond.interestDue > 0 || bond.pendingPayout > 0) {
            const shouldProceed = window.confirm(messages.existing_mint);
            if (shouldProceed) {
                const trimBalance = trim(Number(quantity), 10);

                await dispatch(
                    bondAsset({
                        value: trimBalance,
                        slippage,
                        bond,
                        networkID: chainID,
                        provider,
                        address,
                        useWFTM,
                    }),
                );
                clearInput();
            }
        } else {
            const trimBalance = trim(Number(quantity), 10);
            await dispatch(
                //@ts-ignore
                bondAsset({
                    value: trimBalance,
                    slippage,
                    bond,
                    networkID: chainID,
                    provider,
                    address,
                    useWFTM,
                }),
            );
            clearInput();
        }
    }

    const clearInput = () => {
        setQuantity("");
    };

    const hasAllowance = useCallback(() => {
        return bond.allowance > 0;
    }, [bond.allowance]);

    const setMax = () => {
        let amount: any = Math.min(bond.maxBondPriceToken * 0.9999, useWFTM ? bond.ftmBalance * 0.99 : bond.balance);

        if (amount) {
            amount = trim(amount);
        }

        setQuantity((amount || "").toString());
    };

    const bondDetailsDebounce = useDebounce(quantity, 1000);

    useEffect(() => {
        dispatch(calcBondDetails({ bond, value: quantity, provider, networkID: chainID }));
    }, [bondDetailsDebounce]);

    const onSeekApproval = async () => {
        if (await checkWrongNetwork()) return;

        dispatch(changeApproval({ address, bond, provider, networkID: chainID }));
    };

    const handleZapinOpen = () => {
        dispatch(calcBondDetails({ bond, value: "0", provider, networkID: chainID }));
        setZapinOpen(true);
    };

    const handleZapinClose = () => {
        dispatch(calcBondDetails({ bond, value: quantity, provider, networkID: chainID }));
        setZapinOpen(false);
    };

    const displayUnits = useWFTM ? "FTM" : bond.displayUnits;

    return (
        <Box display="flex" flexDirection="column">
            <Box display="flex" justifyContent="space-around" flexWrap="wrap">
                {(bond.name === "wftm" || bond.name === "wftm7" || bond.name === "wftm14" || bond.name === "wftm28") && (
                    <FormControl className="lux-input" variant="outlined" color="primary" fullWidth>
                        <div className="ftm-checkbox">
                            <input type="checkbox" checked={!useWFTM} onClick={() => setUseWFTM(!useWFTM)} />
                            <p>Use WFTM</p>
                        </div>
                    </FormControl>
                )}
                <FormControl className="bond-input-wrap" variant="outlined" color="primary" fullWidth>
                    <OutlinedInput
                        placeholder="Amount"
                        type="number"
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                        labelWidth={0}
                        className="bond-input"
                        endAdornment={
                            <InputAdornment position="end">
                                <div className="stake-input-btn" onClick={setMax}>
                                    <p>MAX</p>
                                </div>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                {hasAllowance() || useWFTM ? (
                    <div
                        className="transaction-button bond-approve-btn"
                        onClick={async () => {
                            if (isPendingTxn(pendingTransactions, "bond_" + bond.name)) return;
                            await onBond();
                        }}
                    >
                        <p>{txnButtonText(pendingTransactions, "bond_" + bond.name, "Mint LUXOR")}</p>
                    </div>
                ) : (
                    <div
                        className="transaction-button bond-approve-btn"
                        onClick={async () => {
                            if (isPendingTxn(pendingTransactions, "approve_" + bond.name)) return;
                            await onSeekApproval();
                        }}
                    >
                        <p>{txnButtonText(pendingTransactions, "approve_" + bond.name, "Approve")}</p>
                    </div>
                )}

                {(bond.name === "wftm" ||
                    bond.name === "wftm7" ||
                    bond.name === "wftm14" ||
                    bond.name === "wftm28" ||
                    bond.name === "dai" ||
                    bond.name === "dai7" ||
                    bond.name === "dai14" ||
                    bond.name === "dai28") && (
                    <div className="transaction-button bond-approve-btn" onClick={handleZapinOpen}>
                        <p>ZAP</p>
                    </div>
                )}

                {!hasAllowance() && !useWFTM && (
                    <div className="help-text">
                        <p className="help-text-desc">
                            Note: The "Approve" transaction is only needed when minting for the first time; subsequent minting only requires you to perform the "Mint" transaction.
                        </p>
                    </div>
                )}
            </Box>

            <Slide direction="left" in={true} mountOnEnter unmountOnExit {...{ timeout: 533 }}>
                <Box className="bond-data">
                    <div className="data-row">
                        <p className="bond-balance-title">Your Balance</p>
                        <p className="bond-balance-title">
                            {isBondLoading ? (
                                <Skeleton width="100px" />
                            ) : (
                                <>
                                    {trim(useWFTM ? bond.ftmBalance : bond.balance, 4)} {displayUnits}
                                </>
                            )}
                        </p>
                    </div>

                    <div className="data-row">
                        <p className="bond-balance-title">You Will Get</p>
                        <p className="price-data bond-balance-title">{isBondLoading ? <Skeleton width="100px" /> : `${trim(bond.bondQuote, 4)} LUX`}</p>
                    </div>

                    <div className={`data-row`}>
                        <p className="bond-balance-title">Purchase Limit</p>
                        <p className="price-data bond-balance-title">{isBondLoading ? <Skeleton width="100px" /> : `${trim(bond.maxBondPrice, 4)} LUX`}</p>
                    </div>

                    <div className="data-row">
                        <p className="bond-balance-title">ROI</p>
                        {isBondLoading ? (
                            <Skeleton width="50px" />
                        ) : bond.bondDiscount * 100 > 1 ? (
                            <p className="bond-balance-title-discount-positive"> {trim(bond.bondDiscount * 100, 2)}% </p>
                        ) : (
                            <p className="bond-balance-title-discount-negative">{trim(bond.bondDiscount * 100, 2)}% </p>
                        )}{" "}
                    </div>

                    <div className="data-row">
                        <p className="bond-balance-title">Vesting Term</p>
                        <p className="bond-balance-title">{isBondLoading ? <Skeleton width="100px" /> : vestingPeriod()}</p>
                    </div>

                    <div className="data-row">
                        <p className="bond-balance-title">Minimum Purchase</p>
                        <p className="bond-balance-title">0.01 LUX</p>
                    </div>
                </Box>
            </Slide>
            <Zapin open={zapinOpen} handleClose={handleZapinClose} bond={bond} />
        </Box>
    );
}

export default BondPurchase;
