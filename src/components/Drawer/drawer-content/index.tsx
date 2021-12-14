import { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import Social from "./social";
import BridgeIcon from "../../../assets/icons/bridge.png";
import MarketIcon from "../../../assets/icons/marketplace.png";
import RebaseIcon from "../../../assets/icons/rebase.png";
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
import CalculatorIcon from "../../../assets/icons/calculator.png";
import classnames from "classnames";

function NavContent() {
    const [isActive] = useState();
    const address = useAddress();
    const { bonds } = useBonds();

    const checkPage = useCallback((location: any, page: string): boolean => {
        const currentPath = location.pathname.replace("/", "");
        if (currentPath.indexOf("dashboard") >= 0 && page === "dashboard") {
            return true;
        }
        if (currentPath.indexOf("stake") >= 0 && page === "stake") {
            return true;
        }
        if (currentPath.indexOf("mints") >= 0 && page === "mints") {
            return true;
        }
        // if (currentPath.indexOf("wrap") >= 0 && page === "wrap") {
        //     return true;
        // }
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
                            <p>Analytics</p>
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
                    {/* <Link
                        component={NavLink}
                        to="/wrap"
                        isActive={(match: any, location: any) => {
                            return checkPage(location, "wrap");
                        }}
                        className={classnames("button-dapp-menu", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            <img alt="" src={WrapIcon} />
                            <p>Wrap</p>
                        </div>
                    </Link> */}
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
                            <p>Bonds</p>
                        </div>
                    </Link>

                    <div className="bond-discounts">
                        {/* <p>Mint Discounts</p> */}
                        {bonds.map((bond, i) => (
                            <Link component={NavLink} to={`/mints/${bond.name}`} key={i} className={"bond"}>
                                {!bond.bondDiscount ? (
                                    <Skeleton variant="text" width={"150px"} />
                                ) : (
                                    <p>
                                        {bond.displayName}
                                        <span className="bond-pair-roi">{bond.bondDiscount && trim(bond.bondDiscount * 100, 2)}%</span>
                                    </p>
                                )}
                            </Link>
                        ))}
                    </div>
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
                    <Link target="_blank" href={"https://bonds.luxor.money"} className={classnames("button-dapp-menu", { active: isActive })}>
                        <div className="dapp-menu-item">
                            <img alt="" src={MarketIcon} />
                            <p>Bond Market</p>
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
