import { useSelector } from "react-redux";
import { secondsUntilBlock, prettifySeconds } from "../../helpers";
import { Box } from "@material-ui/core";
import "./rebasetimer.scss";
import { Skeleton } from "@material-ui/lab";
import { useMemo } from "react";
import { IReduxState } from "../../store/slices/state.interface";

function RebaseTimer() {
    const currentBlockTime = useSelector<IReduxState, number>(state => {
        return state.app.currentBlockTime;
    });

    const currentEpoch = useSelector<IReduxState, number>(state => {
        return state.app.currentEpoch;
    });

    const nextRebase = useSelector<IReduxState, number>(state => {
        return state.app.nextRebase;
    });

    const epochEnd = useSelector<IReduxState, number>(state => {
        return state.account.warmup.expiry;
    });

    const remainingPeriods = useSelector<IReduxState, number>(state => {
        return epochEnd - currentEpoch; // remaining epochs
    });

    const secsPerEpoch = 28800; // epoch = 8hrs = 60secs * 60mins * 8hrs

    const remainingWarmupTime = remainingPeriods * secsPerEpoch;

    const epochEndTime = useSelector<IReduxState, number>(state => {
        return Number(currentBlockTime) + Number(remainingWarmupTime);
    });

    const timeUntilEpochEnd = useMemo(() => {
        if (currentEpoch && epochEnd) {
            const seconds = secondsUntilBlock(currentBlockTime, epochEndTime);
            return prettifySeconds(seconds);
        }
    }, [Number(currentEpoch), Number(epochEnd)]);

    const timeUntilRebase = useMemo(() => {
        if (currentBlockTime && nextRebase) {
            const seconds = secondsUntilBlock(currentBlockTime, nextRebase);
            return prettifySeconds(seconds);
        }
    }, [currentBlockTime, nextRebase]);

    return (
        <Box className="rebase-timer">
            <p>
                {currentBlockTime ? (
                    timeUntilRebase ? (
                        <>
                            Next Rebase:{" "}
                            <strong>
                                {timeUntilRebase}
                                <br />
                                Warmup Period: 7 Days
                            </strong>
                            <br />
                            {Number(remainingPeriods) > 0 ? <strong>Remaining Periods: {Number(remainingPeriods)}</strong> : ""}
                        </>
                    ) : (
                        <strong>Rebasing...</strong>
                    )
                ) : (
                    <Skeleton width="200px" />
                )}
            </p>
        </Box>
    );
}

export default RebaseTimer;
