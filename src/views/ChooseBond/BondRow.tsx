import { prettyVestingPeriod, priceUnits, prettifySeconds, trim } from "../../helpers";
import BondLogo from "../../components/BondLogo";
import { Box, Paper, TableRow, TableCell, Slide, Link } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import "./choosebond.scss";
import { Skeleton } from "@material-ui/lab";
import { IBondDetails, redeemBond } from "../../store/slices/bond-slice";
import { IAllBondData } from "../../hooks/bonds";
import { IReduxState } from "src/store/slices/state.interface";
import { IUserBondDetails } from "src/store/slices/account-slice";
import { useSelector } from "react-redux";
import { IPendingTxn } from "src/store/slices/pending-txns-slice";
import { Networks } from "../../constants/blockchain";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";

interface IBondProps {
    bond: IAllBondData;
}

export function BondDataCard({ bond }: IBondProps) {
    const isBondLoading = !bond.bondPrice ?? true;
    const maxBondDebt = Number(bond.maxDebt / 1e9);
    const totalBondedDebt = Number(bond.totalBondDebt);
    const bondAddress = bond.getAddressForBond(Networks.FTM);

    return (
        <Slide direction="up" in={true}>
            <Paper className="bond-data-card">
                <div className="bond-pair">
                    <BondLogo bond={bond} />
                    <div className="bond-name">
                        <p className="centered bond-name-title">{bond.displayName}</p>
                        <Link href={`https://ftmscan.com/address/${bondAddress}`} target="_blank">
                            <p className="bond-name-title">Smart Contract</p>
                        </Link>
                        {/* {bond.isLP && (
                            <div>
                                <Link href={bond.lpUrl} target="_blank">
                                    <p className="bond-name-title">Create Pair</p>
                                </Link>
                            </div>
                        )} */}
                    </div>
                </div>

                <div className="data-row">
                    <p className="bond-name-title">Price</p>
                    <p className="bond-price bond-name-title">
                        <>
                            {isBondLoading ? (
                                <Skeleton width="50px" />
                            ) : (
                                new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                    maximumFractionDigits: 0,
                                    minimumFractionDigits: 0,
                                }).format(bond.bondPrice)
                            )}
                        </>
                    </p>
                </div>

                <div className="data-row">
                    <p className="bond-name-title">ROI</p>
                    {isBondLoading ? (
                        <Skeleton width="50px" />
                    ) : bond.bondDiscount * 100 > 1 ? (
                        <p className="bond-name-title-green"> {trim(bond.bondDiscount * 100, 2)}% </p>
                    ) : (
                        <p className="bond-name-title-red">{trim(bond.bondDiscount * 100, 2)}% </p>
                    )}
                </div>
                <div className="data-row">
                    <p className="bond-name-title">Term</p>
                    <p className="bond-name-title">{isBondLoading ? <Skeleton width="50px" /> : `${prettifySeconds(bond.vestingTerm, "day")}`}</p>
                </div>
                <div className="data-row">
                    <p className="bond-name-title">Claimable</p>
                    <p className="bond-name-title">{isBondLoading ? <Skeleton width="50px" /> : `${trim(bond.pendingPayout, 4)}`}</p>
                </div>
                <div className="data-row">
                    <p className="bond-name-title">Available</p>
                    {Number(bond.totalBondDebt) > Number(bond.maxDebt / 1e9) ? (
                        <p className="bond-name-title-red">OUT OF STOCK</p>
                    ) : (
                        <p className="bond-name-title-green">{isBondLoading ? <Skeleton width="100px" /> : trim(100 - (totalBondedDebt / maxBondDebt) * 100, 2)}%</p>
                    )}
                </div>
                <Link component={NavLink} to={`/mints/${bond.name}`}>
                    <div className="bond-table-btn">
                        <p>Mint {bond.rewardToken}</p>
                        {/* <p>Mint with {bond.displayName}</p> */}
                    </div>
                </Link>
            </Paper>
        </Slide>
    );
}

export function BondTableData({ bond }: IBondProps) {
    const isBondLoading = !bond.bondPrice ?? true;

    const currentBlockTime = useSelector<IReduxState, number>(state => {
        return state.app.currentBlockTime;
    });

    const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });

    const bondingState = useSelector<IReduxState, IBondDetails>(state => {
        return state.bonding && state.bonding[bond.name];
    });

    const bondDetails = useSelector<IReduxState, IUserBondDetails>(state => {
        return state.account.bonds && state.account.bonds[bond.name];
    });

    const vestingTime = () => {
        if (!bondDetails) {
            return "";
        }
        return prettyVestingPeriod(currentBlockTime, bondDetails.bondMaturationBlock);
    };

    const vestingPeriod = () => {
        return prettifySeconds(bondingState.vestingTerm, "day");
    };

    const maxBondDebt = Number(bond.maxDebt / 1e9);
    const totalBondedDebt = Number(bond.totalBondDebt);

    return (
        <TableRow>
            <TableCell align="left">
                <BondLogo bond={bond} />
                <div className="bond-name">
                    <p className="bond-name-title">{bond.displayName}</p>
                    {bond.isLP && (
                        <Link color="primary" href={bond.lpUrl} target="_blank">
                            <p className="bond-name-title">Create Pair</p>
                        </Link>
                    )}
                </div>
            </TableCell>
            <TableCell align="center">
                <p className="bond-name-title">
                    <>
                        {/* <span className="currency-icon">{priceUnits(bond)}</span>{" "} */}
                        {isBondLoading ? <Skeleton width="50px" /> : vestingPeriod()}
                    </>
                </p>
            </TableCell>
            <TableCell align="center">
                <p className="bond-name-title">
                    <>
                        {/* <span className="currency-icon">{priceUnits(bond)}</span>{" "} */}
                        {isBondLoading ? (
                            <Skeleton width="50px" />
                        ) : (
                            new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                                maximumFractionDigits: 0,
                                minimumFractionDigits: 0,
                            }).format(bond.bondPrice)
                        )}
                    </>
                </p>
            </TableCell>
            <TableCell align="right">
                <p className="bond-name-title">
                    {bond.bondDiscount * 100 > 1 ? (
                        <span className="bond-name-title-green">{bond.vestingTerm && trim(bond.bondDiscount * 100, 2)}%</span>
                    ) : (
                        <span className="bond-name-title-red">{bond.vestingTerm && trim(bond.bondDiscount * 100, 2)}%</span>
                    )}
                </p>
            </TableCell>
            <TableCell align="right">
                <p className="bond-name-title">{isBondLoading ? <Skeleton width="50px" /> : `${trim(bond.pendingPayout, 2)}`}</p>
            </TableCell>
            <TableCell align="right">
                <p className="bond-name-title">
                    {totalBondedDebt > maxBondDebt ? (
                        <p className="bond-name-title-red">MAXED</p>
                    ) : (
                        <p className="bond-name-title-green">{isBondLoading ? <Skeleton width="100px" /> : trim(100 - (totalBondedDebt / maxBondDebt) * 100, 2)}%</p>
                    )}{" "}
                </p>
            </TableCell>
            <TableCell>
                <Link component={NavLink} to={`/mints/${bond.name}`}>
                    <div className="bond-table-btn">
                        <p>Mint</p>
                    </div>
                </Link>
                {/* <Link component={NavLink} to={`/mints/${bond.name}`}>
                    <div className="bond-table-btn">
                        <p>Claim and Autostake</p>
                    </div>
                </Link> */}
            </TableCell>
        </TableRow>
    );
}
