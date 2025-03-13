/* eslint-disable no-console */
/* eslint-disable no-magic-numbers */
/* eslint-disable no-unused-vars */
import React from "react";

import DateRangeSelector from "./components/dateRangeSelector/DateRangeSelector";
import useAdjustDateRangesFromToday from "./components/dateRangeSelector/hooks/useAdjustDateRangesFromToday";

const dateRanges = [
    { start: "2025-03-02T00:00:00Z", end: "2025-04-05T00:00:00Z" },
    { start: "2025-04-07T12:20:00Z", end: "2025-04-11T10:00:00Z" },
    { start: "2025-04-11T15:20:00Z", end: "2025-04-17T12:20:00Z" },
    { start: "2025-04-19T12:20:01Z", end: "2025-04-25T12:20:00Z" },
];

const App = () => {
    const { adjustedDateRanges } = useAdjustDateRangesFromToday({ dateRanges });

    const handleOnChange = (range) => {
        console.log("start", range?.at(0)?.format());
        console.log("end", range?.at(1)?.format());
    };

    return (
        <DateRangeSelector
            // mode={["date", "date"]}
            onChange={handleOnChange}
            ranges={adjustedDateRanges}
        />
    );
};

export default App;
