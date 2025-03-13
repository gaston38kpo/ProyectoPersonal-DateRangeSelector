/* eslint-disable no-magic-numbers */
const dayjs = require("dayjs");
const { adjustFirstRangeForToday, isDateBeforeToday, parseDateRangesToDayjs, removePastRanges, sortDateRanges } = require("../utils/dateUtils");


describe("isDateBeforeToday", () => {
    test("Devuelve true si la fecha es antes de hoy", () => {
        const pastDate = dayjs().subtract(1, "day");
        expect(isDateBeforeToday(pastDate)).toBe(true);
    });

    test("Devuelve false si la fecha es hoy", () => {
        const today = dayjs();
        expect(isDateBeforeToday(today)).toBe(false);
    });

    test("Devuelve false si la fecha es después de hoy", () => {
        const futureDate = dayjs().add(1, "day");
        expect(isDateBeforeToday(futureDate)).toBe(false);
    });
});

describe("parseDateRangesToDayjs", () => {
    test("Convierte y ajusta los rangos de fechas correctamente", () => {
        const dateRangesList = [
            { start: "2024-11-01T10:00:00Z", end: "2024-11-02T10:00:00Z" },
            { start: "2024-11-02T10:00:00Z", end: "2024-11-03T10:00:00Z" },
        ];

        const result = parseDateRangesToDayjs(dateRangesList);

        expect(result[0].start.isSame(dayjs("2024-10-31T10:00:00Z").utc())).toBe(true);
        expect(result[0].end.isSame(dayjs("2024-11-02T10:00:00Z"))).toBe(true);
    });
});

describe("sortDateRanges", () => {
    test("Ordena los rangos de fechas correctamente", () => {
        const unsortedRanges = [
            { start: dayjs("2024-11-02T10:00:00Z"), end: dayjs("2024-11-02T11:00:00Z") },
            { start: dayjs("2024-11-01T10:00:00Z"), end: dayjs("2024-11-01T11:00:00Z") },
        ];

        const sortedRanges = sortDateRanges(unsortedRanges);

        expect(sortedRanges[0].start.isSame(dayjs("2024-11-01T10:00:00Z"))).toBe(true);
    });
});

describe("removePastRanges", () => {
    test("Elimina los rangos pasados y mantiene los futuros", () => {
        const ranges = [
            { start: dayjs("2024-10-30T10:00:00Z"), end: dayjs("2024-10-30T11:00:00Z") },
            { start: dayjs().endOf("day"), end: dayjs().endOf("day").add(1, "day") },
        ];

        const result = removePastRanges(ranges);

        expect(result.length).toBe(1);
        expect(result[0].start.isSame(dayjs().endOf("day"))).toBe(true);
    });
});

describe("adjustFirstRangeForToday", () => {
    test("Ajusta el primer rango para comenzar desde hoy", () => {
        const ranges = [
            { start: dayjs().subtract(4, "day"), end: dayjs().subtract(3, "day") },
            { start: dayjs().add(2, "day"), end: dayjs().add(2, "day") },
        ];

        const adjustedRanges = adjustFirstRangeForToday(ranges);
        const today = dayjs();

        expect(adjustedRanges[0].start.isSame(today, "day")).toBe(true);
    });
});
