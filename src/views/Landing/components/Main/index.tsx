import React from "react";
import { Link } from "@material-ui/core";
import "./main.scss";
import LuxImg from "../../../../assets/icons/LUXOR.svg";

function Main() {
    return (
        <div className="landing-main">
            <div className="landing-main-img-wrap">
                <img src={LuxImg} alt="" />
            </div>
            <div className="landing-main-btns-wrap">
                <Link href="https://luxor.money" target="_blank" rel="noreferrer">
                    <div className="landing-main-btn">
                        <p>Enter App</p>
                    </div>
                </Link>
                <Link href="https://docs.luxor.money" target="_blank" rel="noreferrer">
                    <div className="landing-main-btn">
                        <p>Documentation</p>
                    </div>
                </Link>
            </div>
            <div className="landing-main-title-wrap">
                <p>Luxor Money</p>
            </div>
            <div className="landing-main-help-text-wrap">
                <p>Financial tools to grow your wealth - stake</p>
                <p>and earn compounding interest.</p>
            </div>
        </div>
    );
}

export default Main;
