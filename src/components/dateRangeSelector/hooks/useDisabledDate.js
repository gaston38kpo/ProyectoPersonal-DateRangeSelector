import dayjs from "dayjs";

const useDisabledDate = ({
  currentMode,
  currentNamedValueSelected,
  ranges,
  currentRange,
  isSelectingValue,
  value,
  setCurrentNamedValueSelected,
  setIsSelectingValue,
}) => {
    const handleDisabledDate = (currentCalendarDate) => {
        // Aqui comienza, se ejecuta secuencialmente por cada dia mostrado en el calendario
        // habilitandolo (false) y deshabilitandolo (true).
        if (currentMode[0] !== "date") return false;

        return isSelectingValue
            ? !isDateBetweenSelectedRange(currentCalendarDate)
            : !isDateInSomeValidRange(currentCalendarDate);
    };

    const isDateBetweenSelectedRange = (currentCalendarDate) => {
        if (!isSelectingValue) return;

        const range = getCurrentRange();

        if (!range) return;

        const { start, end } = range;

        currentRange.current = [dayjs(start), dayjs(end)];

        return currentCalendarDate.isBetween(start, end, null, "[]");
    };

    const getCurrentRange = () => {
        const [start, end] = value.current;

        const currentDateRangeFind = ranges.find(({ start: dateRangeStart, end: dateRangeEnd }) => {
                const startInRange = !start || adjustAccordingNamedValueSelected(start).isBetween(dateRangeStart, dateRangeEnd, null, "[]");
                const endInRange = !end || adjustAccordingNamedValueSelected(end).isBetween(dateRangeStart, dateRangeEnd, null, "[]");

                return startInRange && endInRange;
            },
        );

        return currentDateRangeFind || null;
    };

    const adjustAccordingNamedValueSelected = (date) => {
        const [start, end] = value.current;
        
        if (!currentNamedValueSelected)
            return date;
        
        if (currentNamedValueSelected === "start")
            return end ? date.endOf("day") : date.startOf("day");
        
        if (currentNamedValueSelected === "end")
            return start ? date.startOf("day") :  date.endOf("day");
    };

    const isDateInSomeValidRange = (currentCalendarDate) => {
        return ranges.some(({ start: rangeStart, end: rangeEnd }) =>
            currentCalendarDate.isBetween(rangeStart, rangeEnd, null, "[]"),
        );
    };

    const handleOnCalendarChange = (dates, _, info) => {
        const { range } = info;

        setCurrentNamedValueSelected(range)

        const [selectedValueStart, selectedValueEnd] = dates;

        value.current = [selectedValueStart, selectedValueEnd];

        setIsSelectingValue(Boolean(selectedValueStart || selectedValueEnd));
    };

    return {
        handleDisabledDate,
        handleOnCalendarChange,
    };
};

export default useDisabledDate;
