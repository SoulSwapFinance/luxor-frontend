import { AppBar, Toolbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import MenuIcon from "../../assets/icons/hamburger.svg";
import LuxorMenu from "./luxor-menu";
import ConnectButton from "./connect-button";
import WrapButton from "./wrap-button";
import "./header.scss";
import { DRAWER_WIDTH, TRANSITION_DURATION } from "../../constants/style";

interface IHeader {
    handleDrawerToggle: () => void;
    drawe: boolean;
}

const useStyles = makeStyles(theme => ({
    appBar: {
        [theme.breakpoints.up("sm")]: {
            width: "100%",
            padding: "20px 0 30px 0",
        },
        justifyContent: "flex-end",
        alignItems: "flex-end",
        background: "transparent",
        backdropFilter: "none",
        zIndex: 10,
    },
    topBar: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: TRANSITION_DURATION,
        }),
        marginLeft: DRAWER_WIDTH,
    },
    topBarShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: TRANSITION_DURATION,
        }),
        marginLeft: -15,
    },
}));

function Header({ handleDrawerToggle, drawe }: IHeader) {
    const classes = useStyles();
    const isVerySmallScreen = useMediaQuery("(max-width: 400px)");
    const isWrapShow = useMediaQuery("(max-width: 300px)");

    return <div className={`${classes.topBar} ${!drawe && classes.topBarShift}`}></div>;
}

export default Header;
