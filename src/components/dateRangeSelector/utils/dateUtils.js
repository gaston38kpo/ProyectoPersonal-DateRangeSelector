import dayjs from "dayjs";

const isDateBeforeToday = (current) =>
    current.isBefore(dayjs(), "day");

const parseDateRangesToDayjs = (dateRangesList) => {
    return dateRangesList.map(({ start, end }) => (
      {
        start: dayjs(start).subtract(1, "day").utc(),
        end: dayjs(end)
      }
    ))
  };

const sortDateRanges = (dateRangesList) =>
    [...dateRangesList].sort((a, b) =>
      dayjs(a.start).isAfter(dayjs(b.start)) ? 1 : -1
    );

const removePastRanges = (sortedDateRanges) =>
    sortedDateRanges.filter(({ end }) => dayjs(end).isAfter(dayjs()));

const adjustFirstRangeForToday = (rangesAfterToday) => {
    const [firstRange, ...remainingRanges] = rangesAfterToday;
    const { start, end } = firstRange;
    
    if (dayjs(start).isAfter(dayjs()))
      return rangesAfterToday;

    const adjustedFirstRange = dayjs().isBefore(dayjs(end))
      ? {
        start: dayjs().utc().format(),
        end
      }
      : firstRange;

    return [adjustedFirstRange, ...remainingRanges];
  };

  export {
    isDateBeforeToday,
    parseDateRangesToDayjs,
    sortDateRanges,
    removePastRanges,
    adjustFirstRangeForToday,
  };