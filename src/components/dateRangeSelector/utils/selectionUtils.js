/* eslint-disable no-magic-numbers */

const getMinTimeForDate = (date, rangeStart) => {
    if (!date) return null;
    if (!rangeStart) return date.startOf("day");
    // Día de inicio real del rango: start+1d; mínimo permitido es start+1s (límite exclusivo)
    const firstDay = rangeStart.add(1, "day");
    return date.isSame(firstDay, "day")
        ? firstDay.add(1, "second")
        : date.startOf("day");
};

const getMaxTimeForDate = (date, rangeEnd) => {
    if (!date) return null;
    if (!rangeEnd) return date.endOf("day");
    // Máximo permitido es end-1s (límite exclusivo en el tope del rango)
    return date.isSame(rangeEnd, "day")
        ? rangeEnd.subtract(1, "second")
        : date.endOf("day");
};

const isMidnight = (d) => d && d.hour() === 0 && d.minute() === 0 && d.second() === 0;

const adjustSelection = ({
    autoAdjustMidnight,
    currentRange,
    dates,
    dateStrings,
    formatString,
    hasSecondsPrecision,
}) => {
    let [start, end] = dates;
    const [rangeStart, rangeEnd] = currentRange || [];

    // Si no se eligió hora explícita, usar min/max disponible del día
    if (autoAdjustMidnight && isMidnight(start)) start = getMinTimeForDate(start, rangeStart);

    if (autoAdjustMidnight && isMidnight(end)) end = getMaxTimeForDate(end, rangeEnd);

    // Ajuste cuando el formato no incluye segundos: corregir segundos en bordes del rango
    if (!hasSecondsPrecision) {
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

    return { adjustedDates, adjustedStrings };
};

export { adjustSelection, getMaxTimeForDate, getMinTimeForDate, isMidnight };
