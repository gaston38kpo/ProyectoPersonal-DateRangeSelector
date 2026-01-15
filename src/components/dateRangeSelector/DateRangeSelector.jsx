// eslint-disable-next-line no-unused-vars
/* eslint-disable no-magic-numbers */
import React, { useRef, useState } from "react";

import PropTypes from "prop-types";
import { DatePicker } from "antd";
import dayjs from "dayjs";

import "./utils/setupDayjs";
import defaultDateRangeConfigs from "./data/defaultDateRangeConfigs";
import DateRangeSelectorLayout from "./DateRangeSelectorLayout";
import useDisabledDate from "./hooks/useDisabledDate";
import useDisabledTime from "./hooks/useDisabledTime";
import { adjustSelection } from "./utils/selectionUtils";
import { Format } from "./utils/utils";

const DateRangeSelector = ({ onChange, ranges, ...userProps }) => {
    const currentRange = useRef([]);
    const value = useRef([null, null]);

    const [currentMode, setCurrentMode] = useState(["date", "date"]);
    const [isSelectingValue, setIsSelectingValue] = useState(false);

    const { handleDisabledDate, handleOnCalendarChange } = useDisabledDate({
        currentMode,
        ranges,
        currentRange,
        isSelectingValue,
        value,
        setIsSelectingValue,
    });

    const combinedConfigs = defaultDateRangeConfigs(userProps);
    const normalizedConfigs = {
        ...combinedConfigs,
        format: combinedConfigs.showTime === false
            ? { format: Format.DATE_ONLY, type: "mask" }
            : combinedConfigs.format,
    };
    const getFormatString = (format) => {
        if (typeof format === "string") return format;
        if (Array.isArray(format)) {
            const [first] = format;
            if (typeof first === "string") return first;
            return first?.format;
        }
        return format?.format;
    };

    const formatString = getFormatString(normalizedConfigs.format);
    const hasSecondsPrecision = Boolean(formatString && formatString.includes("ss"));
    const autoAdjustMidnight = normalizedConfigs.autoAdjustMidnight ?? !normalizedConfigs.showTime;

    const { handleDisabledTime } = useDisabledTime({
        currentMode,
        currentRange,
        hasSecondsPrecision,
        isSelectingValue,
        value,
    });

    const handleOnChange = (dates, dateStrings) => {
        if (!onChange) return;

        if (!dates || !dates[0] || !dates[1]) {
            onChange(dates, dateStrings);
            return;
        }

        const { adjustedDates, adjustedStrings } = adjustSelection({
            dates,
            dateStrings,
            currentRange: currentRange.current,
            formatString,
            hasSecondsPrecision,
            autoAdjustMidnight,
        });

        onChange(adjustedDates, adjustedStrings);
    };

    const handleOnPanelChange = (_, mode) => {
        if (mode.includes("year") || mode.includes("month")) {
            setCurrentMode(mode);
            setIsSelectingValue(true);
        } else {
            setCurrentMode(["date", "date"]);
            const [valueStart, valueEnd] = value.current;
            if (!valueStart && !valueEnd)
                setIsSelectingValue(false);
        }
    };

    return (
        <DateRangeSelectorLayout>
            <DatePicker.RangePicker
                disabledDate={handleDisabledDate}
                disabledTime={handleDisabledTime}
                onCalendarChange={handleOnCalendarChange}
                onChange={handleOnChange}
                onPanelChange={handleOnPanelChange}
                preserveInvalidOnBlur={false}
                {...normalizedConfigs}
            />
        </DateRangeSelectorLayout>
    );
};

DateRangeSelector.propTypes = {
    ranges: PropTypes.arrayOf(
        PropTypes.shape({
            start: PropTypes.oneOfType([
                PropTypes.instanceOf(dayjs),
                PropTypes.instanceOf(Date),
                PropTypes.string,
            ]).isRequired,
            end: PropTypes.oneOfType([
                PropTypes.instanceOf(dayjs),
                PropTypes.instanceOf(Date),
                PropTypes.string,
            ]).isRequired,
        })
    ).isRequired,
    onChange: PropTypes.func,
};

export default DateRangeSelector;
