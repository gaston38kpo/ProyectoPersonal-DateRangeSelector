/* eslint-disable no-unused-vars */
import React from "react";

import DateRangeSelector from "./components/dateRangeSelector/DateRangeSelector";
import useAdjustDateRangesFromToday from "./components/dateRangeSelector/hooks/useAdjustDateRangesFromToday";

const dateRanges = [
    { start: "2024-11-02T00:00:00Z", end: "2024-12-05T00:00:00Z" },
    { start: "2024-12-07T12:20:00Z", end: "2024-12-11T12:20:00Z" },
    { start: "2024-12-15T12:20:00Z", end: "2024-12-17T12:20:00Z" },
    { start: "2024-12-19T12:20:01Z", end: "2024-12-25T12:20:00Z" },
];

function App() {
    const { adjustedDateRanges } = useAdjustDateRangesFromToday({ dateRanges });

    const handleOnChange = (range) => {
        console.log("start", range?.at(0)?.format());
        console.log("end", range?.at(1)?.format());
    };

    return (
        <DateRangeSelector
            ranges={adjustedDateRanges}
            onChange={handleOnChange}
        />
    );
}

export default App;
