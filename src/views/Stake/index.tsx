import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Grid, InputAdornment, OutlinedInput, Tooltip, Typography, Zoom } from "@material-ui/core";
import RebaseTimer from "../../components/RebaseTimer";
import { prettifySeconds, secondsUntilBlock, trim } from "../../helpers";
import { changeStake, changeApproval, claimWarmup, forfeitStake } from "../../store/slices/stake-thunk";
import "./stake.scss";
import { useWeb3Context } from "../../hooks";
import { IPendingTxn, isPendingTxn, txnButtonText } from "../../store/slices/pending-txns-slice";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import { messages } from "../../constants/messages";
import classnames from "classnames";
import { warning } from "../../store/slices/messages-slice";
import { IAppSlice } from "src/store/slices/app-slice";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

function Stake() {
    const dispatch = useDispatch();
    const { provider, address, connect, chainID, checkWrongNetwork } = useWeb3Context();

    const [view, setView] = useState(0);
    const [quantity, setQuantity] = useState<string>("");

    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const app = useSelector<IReduxState, IAppSlice>(state => state.app);

    const fiveDayRate = useSelector<IReduxState, number>(state => {
        return state.app.fiveDayRate;
    });
    const luxorBalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.luxor;
    });
    const lumensBalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.lumens;
    });
    const stakeAllowance = useSelector<IReduxState, number>(state => {
        return state.account.staking && state.account.staking.luxor;
    });
    const unstakeAllowance = useSelector<IReduxState, number>(state => {
        return state.account.staking && state.account.staking.lumens;
    });
    const stakingRebase = useSelector<IReduxState, number>(state => {
        return state.app.stakingRebase;
    });
    const currentEpochNumber = useSelector<IReduxState, number>(state => {
        return state.app.currentEpoch;
    });

    const warmUpAmount = useSelector<IReduxState, number>(state => {
        return state.account.warmup && state.account.warmup.warmUpAmount;
    });

    const depositAmount = useSelector<IReduxState, number>(state => {
        return state.account.warmup && state.account.warmup.depositAmount;
    });

    const expiry = useSelector<IReduxState, number>(state => {
        return state.account.warmup && state.account.warmup.expiry;
    });
    const stakingAPY = useSelector<IReduxState, number>(state => {
        return state.app.stakingAPY;
    });
    const stakingTVL = useSelector<IReduxState, number>(state => {
        return state.app.stakingTVL;
    });

    const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });

    const setMax = () => {
        if (view === 0) {
            setQuantity(luxorBalance);
        } else {
            setQuantity(lumensBalance);
        }
    };

    const timeUntilEpochEnd = () => {
        const seconds = secondsUntilBlock(currentEpochNumber, expiry);
        return prettifySeconds(seconds);
    };

    const onSeekApproval = async (token: string) => {
        if (await checkWrongNetwork()) return;
        await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
    };

    const onChangeStake = async (action: string) => {
        if (await checkWrongNetwork()) return;
        if (quantity === "" || parseFloat(quantity) === 0) {
            dispatch(warning({ text: action === "stake" ? messages.before_stake : messages.before_unstake }));
        } else {
            await dispatch(changeStake({ address, action, value: String(quantity), provider, networkID: chainID }));
            setQuantity("");
        }
    };

    async function onForfeitStake() {
        if (await checkWrongNetwork()) return;
        await dispatch(forfeitStake({ address, networkID: chainID, provider }));
    }

    async function onClaimWarmup() {
        if (await checkWrongNetwork()) return;
        await dispatch(claimWarmup({ address, networkID: chainID, provider }));
    }

    const hasAllowance = useCallback(
        token => {
            if (token === "luxor") return stakeAllowance > 0;
            if (token === "lumens") return unstakeAllowance > 0;
            return 0;
        },
        [stakeAllowance],
    );

    const changeView = (newView: number) => () => {
        setView(newView);
        setQuantity("");
    };

    const trimmedLumensBalance = trim(Number(lumensBalance), 6);
    const trimmedStakingAPY = trim(stakingAPY * 100, 1);
    const stakingRebasePercentage = trim(stakingRebase * 100, 4);
    const nextRewardValue = trim((Number(stakingRebasePercentage) / 100) * Number(trimmedLumensBalance), 6);
    const remainingPeriods = expiry - Number(currentEpochNumber);
    const totalPendingRewards = warmUpAmount + Number(nextRewardValue);

    const useStyles = makeStyles(theme =>
        createStyles({
            customWidth: {
                maxWidth: 250,
                fontSize: theme.typography.pxToRem(14),
                backgroundColor: theme.palette.common.black,
            },
        }),
    );

    const classes = useStyles();

    return (
        <div className="stake-view">
            <Zoom in={true}>
                <div className="stake-card">
                    <Grid className="stake-card-grid" container direction="column" spacing={2}>
                        <Grid item>
                            <div className="stake-card-header">{/* <p className="stake-card-header-title">Luxor Staking</p> */}</div>
                        </Grid>

                        <Grid item>
                            <div className="stake-card-metrics">
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={4} md={4} lg={4}>
                                        <div className="stake-card-apy">
                                            <p className="stake-card-metrics-title">APY</p>
                                            <p className="stake-card-metrics-value">
                                                {stakingAPY ? <>{new Intl.NumberFormat("en-US").format(Number(trimmedStakingAPY))}%</> : <Skeleton width="150px" />}
                                            </p>
                                        </div>
                                    </Grid>

                                    <Grid item xs={6} sm={4} md={4} lg={4}>
                                        <div className="stake-card-tvl">
                                            <p className="stake-card-metrics-title">TVL</p>
                                            <p className="stake-card-metrics-value">
                                                {stakingTVL ? (
                                                    new Intl.NumberFormat("en-US", {
                                                        style: "currency",
                                                        currency: "USD",
                                                        maximumFractionDigits: 0,
                                                        minimumFractionDigits: 0,
                                                    }).format(stakingTVL)
                                                ) : (
                                                    <Skeleton width="150px" />
                                                )}
                                            </p>
                                        </div>
                                    </Grid>

                                    <Grid item xs={6} sm={4} md={4} lg={4}>
                                        <div className="stake-card-tvl">
                                            <p className="stake-card-metrics-title">LUX Price</p>
                                            <p className="stake-card-metrics-value">
                                                {stakingTVL ? (
                                                    new Intl.NumberFormat("en-US", {
                                                        style: "currency",
                                                        currency: "USD",
                                                        maximumFractionDigits: 0,
                                                        minimumFractionDigits: 0,
                                                    }).format(app.marketPrice)
                                                ) : (
                                                    <Skeleton width="150px" />
                                                )}
                                            </p>
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                        </Grid>

                        <div className="stake-card-area">
                            {!address && (
                                <div className="stake-card-wallet-notification">
                                    <div className="stake-card-wallet-connect-btn" onClick={connect}>
                                        <p>Connect Wallet</p>
                                    </div>
                                    <p className="stake-card-wallet-desc-text">Connect Wallet to stake LUX</p>
                                </div>
                            )}
                            {address && (
                                <div>
                                    <div className="stake-card-action-area">
                                        <div className="stake-card-action-stage-btns-wrap">
                                            <div onClick={changeView(0)} className={classnames("stake-card-action-stage-btn", { active: !view })}>
                                                <p>Stake</p>
                                            </div>
                                            <div onClick={changeView(1)} className={classnames("stake-card-action-stage-btn", { active: view })}>
                                                <p>Unstake</p>
                                            </div>
                                        </div>

                                        <div className="stake-card-action-row">
                                            <OutlinedInput
                                                type="number"
                                                placeholder="Amount"
                                                className="stake-card-action-input"
                                                value={quantity}
                                                onChange={e => setQuantity(e.target.value)}
                                                labelWidth={0}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <div onClick={setMax} className="stake-card-action-input-btn">
                                                            <p>MAX</p>
                                                        </div>
                                                    </InputAdornment>
                                                }
                                            />

                                            {view === 0 && (
                                                <div className="stake-card-tab-panel">
                                                    {address && hasAllowance("luxor") ? (
                                                        <div
                                                            className="stake-card-tab-panel-btn"
                                                            onClick={() => {
                                                                if (isPendingTxn(pendingTransactions, "staking")) return;
                                                                onChangeStake("stake");
                                                            }}
                                                        >
                                                            <p>{txnButtonText(pendingTransactions, "staking", "Stake LUX")}</p>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="stake-card-tab-panel-btn"
                                                            onClick={() => {
                                                                if (isPendingTxn(pendingTransactions, "approve_staking")) return;
                                                                onSeekApproval("luxor");
                                                            }}
                                                        >
                                                            <p>{txnButtonText(pendingTransactions, "approve_staking", "Approve")}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {view === 1 && (
                                                <>
                                                    <div className="stake-card-tab-panel">
                                                        {address && hasAllowance("lumens") ? (
                                                            <div
                                                                className="stake-card-tab-panel-btn"
                                                                onClick={() => {
                                                                    if (isPendingTxn(pendingTransactions, "unstaking")) return;
                                                                    onChangeStake("unstake");
                                                                }}
                                                            >
                                                                <p>{txnButtonText(pendingTransactions, "unstaking", "Unstake")}</p>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                className="stake-card-tab-panel-btn"
                                                                onClick={() => {
                                                                    if (isPendingTxn(pendingTransactions, "approve_unstaking")) return;
                                                                    onSeekApproval("lumens");
                                                                }}
                                                            >
                                                                <p>{txnButtonText(pendingTransactions, "approve_unstaking", "Approve")}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {Number(expiry) > 0 && (
                                                        <div className="stake-card-tab-panel">
                                                            <div
                                                                className="stake-card-tab-panel-btn"
                                                                onClick={() => {
                                                                    if (isPendingTxn(pendingTransactions, "forfeit")) return;
                                                                    onForfeitStake();
                                                                }}
                                                            >
                                                                <p>{txnButtonText(pendingTransactions, "forfeit", "Forfeit")}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {Number(expiry) == 0 && Number(remainingPeriods) == 0 && (
                                                        <div className="stake-card-tab-panel">
                                                            <div
                                                                className="stake-card-tab-panel-btn"
                                                                onClick={() => {
                                                                    if (isPendingTxn(pendingTransactions, "claim")) return;
                                                                    onClaimWarmup();
                                                                }}
                                                            >
                                                                <p>{txnButtonText(pendingTransactions, "claim", "Claim")}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>

                                        <div className="stake-card-action-help-text">
                                            {address && ((!hasAllowance("luxor") && view === 0) || (!hasAllowance("lumens") && view === 1)) && (
                                                <p>
                                                    Note: The "Approve" transaction is only needed when staking/unstaking for the first luxor; subsequent staking/unstaking only
                                                    requires you to perform the "Stake" or "Unstake" transaction.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <RebaseTimer />
                                    <div className="stake-user-data">
                                        <div className="data-row">
                                            <p className="data-row-name">Luxor Balance</p>
                                            <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(luxorBalance), 2)} LUX</>}</p>
                                        </div>

                                        <div className="data-row">
                                            <p className="data-row-name">Lumens Balance</p>
                                            <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(trimmedLumensBalance), 2)} LUM</>}</p>
                                        </div>
                                        {Number(remainingPeriods) > 0 && (
                                            <div className="data-row">
                                                <p className="data-row-name-warmup">Warmup Balance</p>
                                                <p className="data-row-value-warmup">{isAppLoading ? <Skeleton width="80px" /> : <>{trim(warmUpAmount, 2)} LUX</>}</p>
                                            </div>
                                        )}
                                        <div className="data-row">
                                            <p className="data-row-name">Next Reward Amount</p>
                                            <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(nextRewardValue), 2)} LUM</>}</p>
                                        </div>
                                        {Number(remainingPeriods) > 0 && (
                                            <div className="data-row">
                                                <p className="data-row-name-warmup">Total Reward Amount</p>
                                                <p className="data-row-value-warmup">{isAppLoading ? <Skeleton width="80px" /> : <>{trim(totalPendingRewards, 2)} LUM</>}</p>
                                            </div>
                                        )}
                                        <div className="data-row">
                                            <p className="data-row-name">Next Reward Yield</p>
                                            <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{stakingRebasePercentage}%</>}</p>
                                        </div>

                                        <div className="data-row">
                                            <p className="data-row-name">ROI (5-Day Rate)</p>
                                            <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(fiveDayRate) * 100, 4)}%</>}</p>
                                        </div>
                                        {Number(remainingPeriods) > 0 && (
                                            <div className="data-row">
                                                <p className="data-row-name-warmup">Remaining Periods</p>
                                                <p className="data-row-value-warmup">{isAppLoading ? <Skeleton width="80px" /> : <>{remainingPeriods}</>}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Grid>
                </div>
            </Zoom>
        </div>
    );
}

export default Stake;
