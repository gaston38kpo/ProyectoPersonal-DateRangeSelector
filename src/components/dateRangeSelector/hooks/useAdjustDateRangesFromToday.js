/* eslint-disable no-magic-numbers */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
    parseDateRangesToDayjs,
    removePastRanges,
    sortDateRanges,
    adjustFirstRangeForToday
} from "../utils/dateUtils";

const useAdjustDateRangesFromToday = ({ dateRanges }) => {
    const [adjustedDateRanges, setAdjustedDateRanges] = useState([]);

    useEffect(() => {
        adjustDateRanges();
    }, [dateRanges]);

    const adjustDateRanges = () => {
        const sortedDateRanges = sortDateRanges(dateRanges);
        const dateRangesAfterToday = removePastRanges(sortedDateRanges);
        
        if (dateRangesAfterToday.length === 0) {
            setAdjustedDateRanges([]);
            return;
        }
        
        const dateRangesValidatedFirstRange = adjustFirstRangeForToday(dateRangesAfterToday);
        const parsedDateRanges = parseDateRangesToDayjs(dateRangesValidatedFirstRange);
        setAdjustedDateRanges(parsedDateRanges);
    };

    return { adjustedDateRanges };
};

export default useAdjustDateRangesFromToday;
