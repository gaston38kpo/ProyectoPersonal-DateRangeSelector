import dayjs from "dayjs";

export const isDateBeforeToday = (current) =>
    current.isBefore(dayjs(), "day");

export const parseDateRangesToDayjs = (dateRangesList) => {
    return dateRangesList.map(({ start, end }) => (
      {
        start: dayjs(start).subtract(1, "day").utc(),
        end: dayjs(end)
      }
    ))
  };

export const sortDateRanges = (dateRangesList) =>
    [...dateRangesList].sort((a, b) =>
      dayjs(a.start).isAfter(dayjs(b.start)) ? 1 : -1
    );

export const removePastRanges = (sortedDateRanges) =>
    sortedDateRanges.filter(({ end }) => dayjs(end).isAfter(dayjs()));

export const adjustFirstRangeForToday = (rangesAfterToday) => {
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
