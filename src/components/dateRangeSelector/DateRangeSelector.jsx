// eslint-disable-next-line no-unused-vars
/* eslint-disable no-magic-numbers */
import React, { useRef, useState } from "react";

import PropTypes from "prop-types";
import { DatePicker } from "antd";
import dayjs from "dayjs";

import defaultDateRangeConfigs from "./data/defaultDateRangeConfigs";
import DateRangeSelectorLayout from "./DateRangeSelectorLayout";
import useDisabledDate from "./hooks/useDisabledDate";
import useDisabledTime from "./hooks/useDisabledTime";

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
    const formatString = typeof combinedConfigs.format === "string"
        ? combinedConfigs.format
        : combinedConfigs.format?.format;
    const hasSecondsPrecision = Boolean(formatString && formatString.includes("ss"));

    const { handleDisabledTime } = useDisabledTime({
        currentMode,
        currentRange,
        hasSecondsPrecision,
        isSelectingValue,
        value,
    });

    const getMinTimeForDate = (date) => {
        const [rangeStart] = currentRange.current || [];
        if (!date) return null;
        if (!rangeStart) return date.startOf("day");
        // Día de inicio real del rango: start+1d; mínimo permitido es start+1s (límite exclusivo)
        const firstDay = rangeStart.add(1, "day");
        return date.isSame(firstDay, "day")
            ? firstDay.add(1, "second")
            : date.startOf("day");
    };

    const getMaxTimeForDate = (date) => {
        const [, rangeEnd] = currentRange.current || [];
        if (!date) return null;
        if (!rangeEnd) return date.endOf("day");
        // Máximo permitido es end-1s (límite exclusivo en el tope del rango)
        return date.isSame(rangeEnd, "day")
            ? rangeEnd.subtract(1, "second")
            : date.endOf("day");
    };

    const isMidnight = (d) => d && d.hour() === 0 && d.minute() === 0 && d.second() === 0;

    const handleOnChange = (dates, dateStrings) => {
        if (!onChange) return;

        if (!dates || !dates[0] || !dates[1]) {
            onChange(dates, dateStrings);
            return;
        }

        let [start, end] = dates;

        // Si no se eligió hora explícita, usar min/max disponible del día
        if (isMidnight(start)) start = getMinTimeForDate(start);

        if (isMidnight(end)) end = getMaxTimeForDate(end);

        // Ajuste cuando el formato no incluye segundos: corregir segundos en bordes del rango
        if (!hasSecondsPrecision) {
            const [rangeStart, rangeEnd] = currentRange.current || [];
            if (rangeStart && start) {
                const firstDay = rangeStart.add(1, "day");
                const atStartEdge = start.isSame(firstDay, "day")
                    && start.hour() === rangeStart.hour()
                    && start.minute() === rangeStart.minute();
                if (atStartEdge) start = start.second(Math.min(rangeStart.second() + 1, 59));
            }
            if (rangeEnd && end) {
                const atEndEdge = end.isSame(rangeEnd, "day")
                    && end.hour() === rangeEnd.hour()
                    && end.minute() === rangeEnd.minute();
                if (atEndEdge) end = end.second(Math.max(rangeEnd.second() - 1, 0));
            }
        }

        const adjustedDates = [start, end];

        const adjustedStrings = formatString
            ? [start?.format(formatString) ?? "", end?.format(formatString) ?? ""]
            : dateStrings;

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
                {...combinedConfigs}
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
