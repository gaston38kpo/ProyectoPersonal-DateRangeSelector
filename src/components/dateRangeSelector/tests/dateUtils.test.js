/* eslint-disable no-magic-numbers */
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isBetween from "dayjs/plugin/isBetween";
import { adjustFirstRangeForToday, isDateBeforeToday, parseDateRangesToDayjs, removePastRanges, sortDateRanges } from "../utils/dateUtils";

// Configurar plugins de dayjs para las pruebas
dayjs.extend(utc);
dayjs.extend(isBetween);

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

    test("Maneja correctamente fechas en el límite (medianoche)", () => {
        const todayStart = dayjs().startOf("day");
        expect(isDateBeforeToday(todayStart)).toBe(false);
        
        const yesterdayEnd = dayjs().subtract(1, "day").endOf("day");
        expect(isDateBeforeToday(yesterdayEnd)).toBe(true);
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

    test("Maneja correctamente un array vacío", () => {
        const result = parseDateRangesToDayjs([]);
        expect(result).toEqual([]);
    });

    test("Maneja correctamente objetos dayjs como entrada", () => {
        const dateRangesList = [
            { 
                start: dayjs("2024-11-01T10:00:00Z"), 
                end: dayjs("2024-11-02T10:00:00Z"), 
            },
        ];

        const result = parseDateRangesToDayjs(dateRangesList);
        
        expect(result[0].start.isSame(dayjs("2024-10-31T10:00:00Z").utc())).toBe(true);
        expect(result[0].end.isSame(dayjs("2024-11-02T10:00:00Z"))).toBe(true);
    });

    test("Maneja correctamente objetos Date como entrada", () => {
        const dateRangesList = [
            { 
                start: new Date("2024-11-01T10:00:00Z"), 
                end: new Date("2024-11-02T10:00:00Z"), 
            },
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

    test("Mantiene el orden cuando los rangos ya están ordenados", () => {
        const alreadySortedRanges = [
            { start: dayjs("2024-11-01T10:00:00Z"), end: dayjs("2024-11-01T11:00:00Z") },
            { start: dayjs("2024-11-02T10:00:00Z"), end: dayjs("2024-11-02T11:00:00Z") },
        ];

        const sortedRanges = sortDateRanges(alreadySortedRanges);

        expect(sortedRanges[0].start.isSame(dayjs("2024-11-01T10:00:00Z"))).toBe(true);
        expect(sortedRanges[1].start.isSame(dayjs("2024-11-02T10:00:00Z"))).toBe(true);
    });

    test("Maneja correctamente un array vacío", () => {
        const result = sortDateRanges([]);
        expect(result).toEqual([]);
    });

    test("Maneja correctamente rangos con la misma fecha de inicio", () => {
        const rangesWithSameStart = [
            { start: dayjs("2024-11-01T10:00:00Z"), end: dayjs("2024-11-02T11:00:00Z") },
            { start: dayjs("2024-11-01T10:00:00Z"), end: dayjs("2024-11-01T11:00:00Z") },
        ];

        const sortedRanges = sortDateRanges(rangesWithSameStart);
        
        // Verificamos que ambos rangos tengan la misma fecha de inicio
        expect(sortedRanges[0].start.isSame(sortedRanges[1].start)).toBe(true);
    });

    test("Maneja correctamente fechas como strings", () => {
        const unsortedRanges = [
            { start: "2024-11-02T10:00:00Z", end: "2024-11-02T11:00:00Z" },
            { start: "2024-11-01T10:00:00Z", end: "2024-11-01T11:00:00Z" },
        ];

        const sortedRanges = sortDateRanges(unsortedRanges);

        expect(dayjs(sortedRanges[0].start).isSame(dayjs("2024-11-01T10:00:00Z"))).toBe(true);
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

    test("Devuelve un array vacío si todos los rangos son pasados", () => {
        const pastRanges = [
            { start: dayjs().subtract(5, "day"), end: dayjs().subtract(4, "day") },
            { start: dayjs().subtract(3, "day"), end: dayjs().subtract(2, "day") },
        ];

        const result = removePastRanges(pastRanges);
        expect(result.length).toBe(0);
    });

    test("Mantiene todos los rangos si todos son futuros", () => {
        const futureRanges = [
            { start: dayjs().add(1, "day"), end: dayjs().add(2, "day") },
            { start: dayjs().add(3, "day"), end: dayjs().add(4, "day") },
        ];

        const result = removePastRanges(futureRanges);
        expect(result.length).toBe(2);
    });

    test("Maneja correctamente un array vacío", () => {
        const result = removePastRanges([]);
        expect(result).toEqual([]);
    });

    test("Maneja correctamente rangos que terminan exactamente hoy", () => {
        const todayEndRanges = [
            { start: dayjs().subtract(1, "day"), end: dayjs().endOf("day") },
        ];

        const result = removePastRanges(todayEndRanges);
        expect(result.length).toBe(1);
    });
});

describe("adjustFirstRangeForToday", () => {
    test("Ajusta el primer rango para comenzar desde hoy", () => {
        const ranges = [
            { start: dayjs().subtract(4, "day"), end: dayjs().add(1, "day") },
            { start: dayjs().add(2, "day"), end: dayjs().add(3, "day") },
        ];

        const adjustedRanges = adjustFirstRangeForToday(ranges);
        const today = dayjs();

        // Corregido: convertimos el string a objeto dayjs antes de usar isSame
        expect(dayjs(adjustedRanges[0].start).isSame(today, "day")).toBe(true);
        // Verificamos que el resto del array se mantiene igual
        expect(adjustedRanges.length).toBe(2);
        expect(dayjs(adjustedRanges[1].start).isSame(dayjs(ranges[1].start))).toBe(true);
    });

    test("No ajusta el primer rango si ya comienza después de hoy", () => {
        const ranges = [
            { start: dayjs().add(1, "day"), end: dayjs().add(2, "day") },
            { start: dayjs().add(3, "day"), end: dayjs().add(4, "day") },
        ];

        const adjustedRanges = adjustFirstRangeForToday(ranges);
        
        // Verificamos que el array se mantiene igual
        expect(adjustedRanges).toEqual(ranges);
    });

    test("Maneja correctamente un array vacío", () => {
        const result = adjustFirstRangeForToday([]);
        expect(result).toEqual([]);
    });

    test("No ajusta el rango si termina antes de hoy", () => {
        const ranges = [
            { start: dayjs().subtract(4, "day"), end: dayjs().subtract(3, "day") },
            { start: dayjs().add(2, "day"), end: dayjs().add(3, "day") },
        ];

        const adjustedRanges = adjustFirstRangeForToday(ranges);
        
        // Verificamos que el primer rango no se ajusta porque termina antes de hoy
        expect(dayjs(adjustedRanges[0].start).isSame(dayjs(ranges[0].start))).toBe(true);
        expect(dayjs(adjustedRanges[0].end).isSame(dayjs(ranges[0].end))).toBe(true);
    });

    test("Ajusta correctamente cuando el primer rango comienza hoy", () => {
        const ranges = [
            { start: dayjs().startOf("day"), end: dayjs().add(1, "day") },
            { start: dayjs().add(2, "day"), end: dayjs().add(3, "day") },
        ];

        const adjustedRanges = adjustFirstRangeForToday(ranges);
        
        // Corregido: comparamos solo a nivel de día para evitar problemas con milisegundos
        const startDate = dayjs(adjustedRanges[0].start);
        const todayStart = dayjs().startOf("day");
        expect(startDate.format("YYYY-MM-DD")).toBe(todayStart.format("YYYY-MM-DD"));
    });
});
