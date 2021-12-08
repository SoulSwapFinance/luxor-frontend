import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, FormControl, Grid, InputAdornment, InputLabel, OutlinedInput, Paper, Tab, Tabs, Typography, Zoom, makeStyles } from "@material-ui/core";
import TabPanel from "../../components/TabPanel";
import InfoTooltip from "../../components/InfoTooltip/InfoTooltip.jsx";
import classnames from "classnames";

// import { ReactComponent as InfoIcon } from "../../assets/icons/info-fill.svg";
import { trim, formatCurrency } from "../../helpers";
import { changeApproval, changeWrap } from "src/store/slices/wrap-thunk";
import "../Stake/stake.scss";
import { useWeb3Context } from "src/hooks/web3/web3-context";
import { isPendingTxn, txnButtonText } from "src/store/slices/pending-txns-slice";
import { Skeleton } from "@material-ui/lab";
import { error } from "../../store/slices/messages-slice";
import { ethers } from "ethers";
import "./wrap.scss";

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles(theme => ({
    textHighlight: {
        color: theme.palette.highlight,
    },
}));

function Wrap() {
    const dispatch = useDispatch();
    const { provider, address, connected, connect, chainID } = useWeb3Context();

    const [zoomed, setZoomed] = useState(false);
    const [view, setView] = useState(0);
    const [quantity, setQuantity] = useState("");
    const classes = useStyles();

    const isAppLoading = useSelector(state => state.app.loading);
    const currentIndex = useSelector(state => {
        return state.app.currentIndex;
    });

    const LUXPrice = useSelector(state => {
        return state.app.marketPrice;
    });

    const LUMPrice = useSelector(state => {
        return state.app.marketPrice;
    });

    const wLUMPrice = useSelector(state => {
        return state.app.marketPrice * state.app.currentIndex;
    });

    const LumBalance = useSelector(state => {
        return state.account.balances && state.account.balances.lum;
    });
    const wLumBalance = useSelector(state => {
        return state.account.balances && state.account.balances.wlum;
    });
    const wrapAllowance = useSelector(state => {
        return state.account.wrapping && state.account.wrapping.luxWrap;
    });
    const unwrapAllowance = useSelector(state => {
        return state.account.wrapping && state.account.wrapping.luxUnwrap;
    });

    const pendingTransactions = useSelector(state => {
        return state.pendingTransactions;
    });

    const setMax = () => {
        if (view === 0) {
            setQuantity(LumBalance);
        } else {
            setQuantity(wLumBalance);
        }
    };

    const onSeekApproval = async token => {
        await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
    };

    const onChangeWrap = async action => {
        // eslint-disable-next-line no-restricted-globals
        if (isNaN(quantity) || Number(quantity) === 0 || quantity === "") {
            // eslint-disable-next-line no-alert
            return dispatch(error("Please enter a value"));
        }

        // 1st catch if quantity > balance
        if (action === "wrap" && ethers.utils.parseUnits(quantity, "gwei").gt(ethers.utils.parseUnits(LumBalance, "gwei"))) {
            return dispatch(error("You cannot wrap more than your LUM balance."));
        }

        if (action === "unwrap" && ethers.utils.parseUnits(quantity, "ether").gt(ethers.utils.parseUnits(wLumBalance, "ether"))) {
            return dispatch(error("You cannot unwrap more than your wLUM balance."));
        }

        await dispatch(changeWrap({ address, action, value: quantity.toString(), provider, networkID: chainID }));
    };

    const hasAllowance = useCallback(
        token => {
            if (token === "LUM") return wrapAllowance > 0;
            if (token === "wLUM") return wrapAllowance > 0;
            return 0;
        },
        [wrapAllowance, unwrapAllowance],
    );

    const isAllowanceDataLoading = (wrapAllowance == null && view === 0) || (unwrapAllowance == null && view === 1);

    const isUnwrap = view === 1;
    const convertedQuantity = isUnwrap ? (quantity * wLUMPrice) / LUMPrice : (quantity * LUMPrice) / wLUMPrice;

    let modalButton = [];

    modalButton.push(
        <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
            Connect Wallet
        </Button>,
    );

    const changeView = newView => () => {
        setView(newView);
        setQuantity("");
    };

    return (
        <div className="stake-view">
            <Zoom in={true}>
                <div className="stake-card">
                    <Grid className="stake-card-grid" container direction="column" spacing={2}>
                        <Grid item>
                            <div className="stake-card-header">
                                <p className="stake-card-header-title">Wrapping</p>
                            </div>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <div className="stake-card-metrics">
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4} md={4} lg={4}>
                                    <div className="stake-card-apy">
                                        <p className="stake-card-metrics-title">Current Index</p>
                                        <p className="stake-card-metrics-value">
                                            <Typography variant="h4">{currentIndex ? <>{trim(currentIndex, 2)} LUX</> : <Skeleton width="150px" />}</Typography>
                                        </p>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={4} md={4} lg={4}>
                                    <div className="stake-card-apy">
                                        <p className="stake-card-metrics-title">
                                            wLUM Price
                                            {/* <InfoTooltip message={"wLUM = LUM * index\n\nThe price of wLUM is equal to the price of LUX multiplied by the current index"} /> */}
                                        </p>
                                        <p className="stake-card-metrics-value">
                                            <Typography variant="h4">{wLUMPrice ? formatCurrency(wLUMPrice, 2) : <Skeleton width="150px" />}</Typography>
                                        </p>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={4} md={4} lg={4}>
                                    <div className="stake-card-apy">
                                        <p className="stake-card-metrics-title">
                                            LUX Price
                                            {/* <InfoTooltip message={"wLUM = LUM * index\n\nThe price of wLUM is equal to the price of LUX multiplied by the current index"} /> */}
                                        </p>
                                        <p className="stake-card-metrics-value">
                                            <Typography variant="h4">{LUXPrice ? formatCurrency(LUXPrice, 2) : <Skeleton width="150px" />}</Typography>
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
                                            <p>Wrap</p>
                                        </div>
                                        <div onClick={changeView(1)} className={classnames("stake-card-action-stage-btn", { active: view })}>
                                            <p>Unwrap</p>
                                        </div>
                                    </div>

                                    <>
                                        {/* <Box className="stake-action-row " display="flex" alignItems="center" style={{ paddingBottom: 0 }}>
                                        {address && !isAllowanceDataLoading ? (
                                            !hasAllowance("LUM") && view === 0 ? (
                                                <Box className="help-text">
                                                    <Typography variant="body1" className="stake-note" color="textSecondary">
                                                        {view === 0 && (
                                                            <>
                                                                First time wrapping <b>LUM</b>?
                                                                <br />
                                                                Please approve Luxor to use your <b>LUM</b> for wrapping.
                                                            </>
                                                        )}
                                                    </Typography>
                                                </Box>
                                            ) : (
                                                <FormControl className="LUX-input" variant="outlined" color="primary">
                                                    <InputLabel htmlFor="amount-input"></InputLabel>
                                                    <OutlinedInput
                                                        id="amount-input"
                                                        type="number"
                                                        placeholder="Enter an amount"
                                                        className="stake-input"
                                                        value={quantity}
                                                        onChange={e => setQuantity(e.target.value)}
                                                        labelWidth={0}
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                <Button variant="text" onClick={setMax} color="inherit">
                                                                    Max
                                                                </Button>
                                                            </InputAdornment>
                                                        }
                                                    />
                                                </FormControl>
                                            )
                                        ) : (
                                            <Skeleton width="150px" />
                                        )}

                                        <TabPanel value={view} index={0} className="stake-tab-panel">
                                            {address && hasAllowance("LUM") ? (
                                                <Button
                                                    className="stake-button"
                                                    variant="contained"
                                                    color="primary"
                                                    disabled={isPendingTxn(pendingTransactions, "wrapping")}
                                                    onClick={() => {
                                                        onChangeWrap("wrap");
                                                    }}
                                                >
                                                    {txnButtonText(pendingTransactions, "wrapping", "Wrap LUM")}
                                                </Button>
                                            ) : (
                                                <Button
                                                    className="stake-button"
                                                    variant="contained"
                                                    color="primary"
                                                    disabled={isPendingTxn(pendingTransactions, "approve_wrapping")}
                                                    onClick={() => {
                                                        onSeekApproval("lum");
                                                    }}
                                                >
                                                    {txnButtonText(pendingTransactions, "approve_wrapping", "Approve")}
                                                </Button>
                                            )}
                                        </TabPanel>

                                        <TabPanel value={view} index={1} className="stake-tab-panel">
                                            <Button
                                                className="stake-button"
                                                variant="contained"
                                                color="primary"
                                                disabled={isPendingTxn(pendingTransactions, "unwrapping")}
                                                onClick={() => {
                                                    onChangeWrap("unwrap");
                                                }}
                                            >
                                                {txnButtonText(pendingTransactions, "unwrapping", "Unwrap LUM")}
                                            </Button>
                                        </TabPanel>
                                    </Box>

                                    {quantity && (
                                        <Box padding={1}>
                                            <Typography variant="body2" className={classes.textHighlight}>
                                                {isUnwrap
                                                    ? `Unwrapping ${quantity} wLUM will result in ${trim(convertedQuantity, 4)} LUM`
                                                    : `Wrapping ${quantity} LUM will result in ${trim(convertedQuantity, 4)} wLUM`}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box> */}

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
                                                        <p>Max</p>
                                                    </div>
                                                </InputAdornment>
                                            }
                                        />

                                        <div className={`stake-user-data`}>
                                            <div className="data-row">
                                                <Typography variant="body1">Wrappable Balance</Typography>
                                                <Typography variant="body1">{isAppLoading ? <Skeleton width="80px" /> : <>{trim(LumBalance, 4)} LUM</>}</Typography>
                                            </div>
                                            <div className="data-row">
                                                <Typography variant="body1">Unwrappable Balance</Typography>
                                                <Typography variant="body1">{isAppLoading ? <Skeleton width="80px" /> : <>{trim(wLumBalance, 4)} wLUM</>}</Typography>
                                            </div>
                                        </div>
                                    </>
                                    {/* )} */}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Zoom>
        </div>
    );
}

export default Wrap;
