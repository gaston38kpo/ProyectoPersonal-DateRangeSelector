// eslint-disable-next-line no-unused-vars
import React, { useRef, useState } from "react";

import PropTypes from "prop-types";
import { DatePicker } from "antd";
import dayjs from "dayjs";

import defaultDateRangeConfigs from "./data/defaultDateRangeConfigs";
import DateRangeSelectorLayout from "./DateRangeSelectorLayout";
import useDisabledDate from "./hooks/useDisabledDate";
import useDisabledTime from "./hooks/useDisabledTime";

const DateRangeSelector = ({ ranges, onChange, ...userProps }) => {
    const currentRange = useRef([]);
    const value = useRef([null, null]);
    
    const [currentMode, setCurrentMode] = useState(['date', 'date']);
    const [isSelectingValue, setIsSelectingValue] = useState(false);

    const { handleDisabledDate, handleOnCalendarChange } = useDisabledDate({
        currentMode,
        ranges,
        currentRange,
        isSelectingValue,
        value,
        setIsSelectingValue,
    });

    const { handleDisabledTime } = useDisabledTime({
        currentMode,
        currentRange,
        isSelectingValue,
        value,
    });

    const combinedConfigs = defaultDateRangeConfigs(userProps);

    const handleOnPanelChange = (_, mode) => {
        // TODO: Testear porque al dar aceptar en un año queda un modo que no es date al mostrar dias
        setCurrentMode(mode);
        console.log(mode)
        setIsSelectingValue(mode[0] !== "date");
    }

    return (
        <DateRangeSelectorLayout>
            <DatePicker.RangePicker
                disabledDate={handleDisabledDate}
                disabledTime={handleDisabledTime}
                onCalendarChange={handleOnCalendarChange}
                onChange={onChange}
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
        }),
    ).isRequired,
    onChange: PropTypes.func
};

export default DateRangeSelector;
