import { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import Social from "./social";
import RebaseIcon from "../../../assets/icons/rebase.png";
import BridgeIcon from "../../../assets/icons/bridge.png";
import ExchangeIcon from "../../../assets/icons/exchange.png";
import GoldIcon from "../../../assets/icons/gold.png";
import LuxorIcon from "../../../assets/icons/logo.png";
import AnalyticsIcon from "../../../assets/icons/analytics.png";
import { trim, shorten } from "../../../helpers";
import { useAddress } from "../../../hooks";
import useBonds from "../../../hooks/bonds";
import { Link } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import "./drawer-content.scss";
import DocsIcon from "../../../assets/icons/docs.png";
import CalculatorIcon from "../../../assets/icons/calculator.png"; //
import classnames from "classnames";
import ConnectButton from "../../Header/connect-button-side";

function NavContent() {
    const [isActive] = useState();
    const address = useAddress();
    const { bonds } = useBonds();

    const checkPage = useCallback((location: any, page: string): boolean => {
        const currentPath = location.pathname.replace("/", "");
        if (currentPath.indexOf("stake") >= 0 && page === "stake") {
            return true;
        }
        if (currentPath.indexOf("mints") >= 0 && page === "mints") {
            return true;
        }
        if (currentPath.indexOf("calculator") >= 0 && page === "calculator") {
            return true;
        }
        return false;
    }, []);

    return (
        <div className="dapp-sidebar">
            <div className="branding-header">
                <Link href="/" target="_blank">
                    <img alt="" src={LuxorIcon} height="125" />
                </Link>
                {address && (
                    <div className="wallet-link">
                        <Link href={`https://ftmscan.com/address/${address}`} target="_blank">
                            <p>{shorten(address)}</p>
                        </Link>
                    </div>
                )}
                {!address && (
                    // <div className="app-link">
                    //     {/* <Link href={`https://app.luxor.money`} target="_blank">
                    //         <p>Connect Wallet</p>
                    //     </Link> */}
                    // </div>
                    <ConnectButton />
                )}
            </div>
            <div className="dapp-menu-links">
                <div className="dapp-nav">
                    <Link
                        component={NavLink}
                        to="/dashboard"
                        isActive={(match: any, location: any) => {
                            return checkPage(location, "dashboard");
                        }}
                        className={classnames("button-dapp-menu", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            <img alt="" src={AnalyticsIcon} />
                            <p>Dashboard</p>
                        </div>
                    </Link>
                    <Link
                        component={NavLink}
                        to="/stake"
                        isActive={(match: any, location: any) => {
                            return checkPage(location, "stake");
                        }}
                        className={classnames("button-dapp-menu", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            <img alt="" src={RebaseIcon} />
                            <p>Rebase</p>
                        </div>
                    </Link>
                    <Link
                        component={NavLink}
                        id="bond-nav"
                        to="/mints"
                        isActive={(match: any, location: any) => {
                            return checkPage(location, "mints");
                        }}
                        className={classnames("button-dapp-menu", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            <img alt="" src={GoldIcon} />
                            <p>Bonds | 5 Day</p>
                        </div>
                    </Link>
                    <div className="bond-discounts">
                        {/* <p>Mint Discounts</p> */}
                        {bonds.map((bond, i) => (
                            <Link component={NavLink} to={`/mints/${bond.name}`} key={i} className={"bond"}>
                                {!bond.bondDiscount ? (
                                    <Skeleton variant="text" width={"150px"} />
                                ) : !(bond.vestingTerm == 432000) ? (
                                    ""
                                ) : (
                                    <p>
                                        {bond.displayName}
                                        {bond.bondDiscount * 100 > 1 ? (
                                            <span className="bond-pair-roi-green">{bond.vestingTerm && trim(bond.bondDiscount * 100, 2)}%</span>
                                        ) : (
                                            <span className="bond-pair-roi-red">{bond.vestingTerm && trim(bond.bondDiscount * 100, 2)}%</span>
                                        )}
                                    </p>
                                )}
                            </Link>
                        ))}
                    </div>
                    <Link
                        component={NavLink}
                        id="bond-nav"
                        to="/mints"
                        isActive={(match: any, location: any) => {
                            return checkPage(location, "mints");
                        }}
                        className={classnames("button-dapp-menu", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            <img alt="" src={GoldIcon} />
                            <p>Bonds | 7 Day</p>
                        </div>
                    </Link>
                    <div className="bond-discounts">
                        {/* <p>Mint Discounts</p> */}
                        {bonds.map((bond, i) => (
                            <Link component={NavLink} to={`/mints/${bond.name}`} key={i} className={"bond"}>
                                {!bond.bondDiscount ? (
                                    <Skeleton variant="text" width={"150px"} />
                                ) : !(bond.vestingTerm == 604800) ? (
                                    "" // <Skeleton variant="text" width={"150px"} />
                                ) : (
                                    <p>
                                        {bond.displayName}
                                        {bond.bondDiscount * 100 > 1 ? (
                                            <span className="bond-pair-roi-green">{bond.vestingTerm && trim(bond.bondDiscount * 100, 2)}%</span>
                                        ) : (
                                            <span className="bond-pair-roi-red">{bond.vestingTerm && trim(bond.bondDiscount * 100, 2)}%</span>
                                        )}
                                    </p>
                                )}
                            </Link>
                        ))}
                    </div>
                    <Link
                        component={NavLink}
                        id="bond-nav"
                        to="/mints"
                        isActive={(match: any, location: any) => {
                            return checkPage(location, "mints");
                        }}
                        className={classnames("button-dapp-menu", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            <img alt="" src={GoldIcon} />
                            <p>Bonds | 14 Day</p>
                        </div>
                    </Link>
                    <div className="bond-discounts">
                        {/* <p>Mint Discounts</p> */}
                        {bonds.map((bond, i) => (
                            <Link component={NavLink} to={`/mints/${bond.name}`} key={i} className={"bond"}>
                                {!bond.bondDiscount ? (
                                    <Skeleton variant="text" width={"150px"} />
                                ) : !(bond.vestingTerm == 1209600) ? (
                                    "" // <Skeleton variant="text" width={"150px"} />
                                ) : (
                                    <p>
                                        {bond.displayName}
                                        {bond.bondDiscount * 100 > 1 ? (
                                            <span className="bond-pair-roi-green">{bond.vestingTerm && trim(bond.bondDiscount * 100, 2)}%</span>
                                        ) : (
                                            <span className="bond-pair-roi-red">{bond.vestingTerm && trim(bond.bondDiscount * 100, 2)}%</span>
                                        )}
                                    </p>
                                )}
                            </Link>
                        ))}
                    </div>
                    <Link
                        component={NavLink}
                        id="bond-nav"
                        to="/mints"
                        isActive={(match: any, location: any) => {
                            return checkPage(location, "mints");
                        }}
                        className={classnames("button-dapp-menu", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            <img alt="" src={GoldIcon} />
                            <p>Bonds | 28 Day</p>
                        </div>
                    </Link>
                    <div className="bond-discounts">
                        {/* <p>Mint Discounts</p> */}
                        {bonds.map((bond, i) => (
                            <Link component={NavLink} to={`/mints/${bond.name}`} key={i} className={"bond"}>
                                {!bond.bondDiscount ? (
                                    <Skeleton variant="text" width={"150px"} />
                                ) : !(bond.vestingTerm == 2419200) ? (
                                    "" // <Skeleton variant="text" width={"150px"} />
                                ) : (
                                    <p>
                                        {bond.displayName}
                                        {bond.bondDiscount * 100 > 1 ? (
                                            <span className="bond-pair-roi-green">{bond.vestingTerm && trim(bond.bondDiscount * 100, 2)}%</span>
                                        ) : (
                                            <span className="bond-pair-roi-red">{bond.vestingTerm && trim(bond.bondDiscount * 100, 2)}%</span>
                                        )}
                                    </p>
                                )}
                            </Link>
                        ))}
                    </div>
                    {/* <Link
                        component={NavLink}
                        to="/swap"
                        isActive={(match: any, location: any) => {
                            return checkPage(location, "swap");
                        }}
                        className={classnames("button-dapp-menu", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            <img alt="" src={ExchangeIcon} />
                            <p>Exchange</p>
                        </div>
                    </Link> */}
                    <Link
                        component={NavLink}
                        to="/calculator"
                        isActive={(match: any, location: any) => {
                            return checkPage(location, "calculator");
                        }}
                        className={classnames("button-dapp-menu", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            <img alt="" src={CalculatorIcon} />
                            <p>Calculator</p>
                        </div>
                    </Link>
                    <Link
                        component={NavLink}
                        to="/bridge"
                        isActive={(match: any, location: any) => {
                            return checkPage(location, "bridge");
                        }}
                        className={classnames("button-dapp-menu", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            <img alt="" src={BridgeIcon} />
                            <p>Bridge</p>
                        </div>
                    </Link>
                    <Link target="_blank" href={"https://exchange.soulswap.finance"} className={classnames("button-dapp-menu", { active: isActive })}>
                        <div className="dapp-menu-item">
                            <img alt="" src={ExchangeIcon} />
                            <p>Exchange</p>
                        </div>
                    </Link>
                    <Link target="_blank" href={"https://docs.luxor.money"} className={classnames("button-dapp-menu", { active: isActive })}>
                        <div className="dapp-menu-item">
                            <img alt="" src={DocsIcon} />
                            <p>Docs</p>
                        </div>
                    </Link>
                </div>
            </div>
            <Social />
        </div>
    );
}

export default NavContent;
