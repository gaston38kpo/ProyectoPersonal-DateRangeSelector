/* eslint-disable no-magic-numbers */
import { disableFromTo } from "../utils/utils";


const useDisabledTime = ({
    currentMode,
    currentRange,
    hasSecondsPrecision,
    isSelectingValue,
    value,
}) => {
    const handleDisabledTime = (_, type) => {
        // Aqui comienza, se ejecuta en cada dia elegido del calendario
        // habilitando ([]) y deshabilitando ([1,2,3...]) las horas, min y seg
        if (currentMode[0] !== "date") return false;
        const [currentRangeStart, currentRangeEnd] = currentRange.current;

        if (!isSelectingValue || !currentRange.current.length)
            return {
                disabledHours: () => [],
                disabledMinutes: () => [],
                disabledSeconds: () => [],
            };

        const [valueStart, valueEnd] = value.current;

        const baseDate = type === "start" ? valueStart : valueEnd;

        if (!baseDate) return;

        const isBaseDateSameCurrentRangeStart = baseDate.isSame(currentRangeStart.add(1, "day"), "day");
        const isBaseDateSameCurrentRangeEnd = baseDate.isSame(currentRangeEnd, "day");

        if (isBaseDateSameCurrentRangeStart)
            return {
                disabledHours: () => getDisabledHoursFromRangeStart(currentRangeStart),
                disabledMinutes: () => getDisabledMinutesFromRangeStart(currentRangeStart, baseDate),
                disabledSeconds: () => hasSecondsPrecision ? getDisabledSecondsFromRangeStart(currentRangeStart, baseDate) : [],
            };


        if (isBaseDateSameCurrentRangeEnd)
            return {
                disabledHours: () => getDisabledHoursFromRangeEnd(currentRangeEnd),
                disabledMinutes: () => getDisabledMinutesFromRangeEnd(currentRangeEnd, baseDate),
                disabledSeconds: () => hasSecondsPrecision ? getDisabledSecondsFromRangeEnd(currentRangeEnd, baseDate) : [],
            };

    };


    // Horario limite dada la hora de inicio del rango actual
    const getDisabledHoursFromRangeStart = (currentRangeStart) => {
        return disableFromTo(0, currentRangeStart.hour());
    };

    const getDisabledMinutesFromRangeStart = (currentRangeStart, baseDate) => {
        return currentRangeStart.hour() === baseDate.hour()
            ? disableFromTo(0, currentRangeStart.minute())
            : [];
    };

    const getDisabledSecondsFromRangeStart = (currentRangeStart, baseDate) => {
        return currentRangeStart.hour() === baseDate.hour()
            && currentRangeStart.minute() === baseDate.minute()
            ? disableFromTo(0, currentRangeStart.second() + 1)
            : [];
    };


    // Horario limite dada la hora de fin del rango actual
    const getDisabledHoursFromRangeEnd = (currentRangeEnd) => {
        // Si el fin es exacto en la hora (HH:00:00), deshabilitar esa hora completa;
        // en caso contrario, permitir la hora fin y deshabilitar solo las posteriores.
        const endH = currentRangeEnd.hour();
        const endM = currentRangeEnd.minute();
        const endS = currentRangeEnd.second();
        const from = endM === 0 && endS === 0 ? endH : endH + 1;
        return disableFromTo(from, 24);
    };

    const getDisabledMinutesFromRangeEnd = (currentRangeEnd, baseDate) => {
        if (currentRangeEnd.hour() !== baseDate.hour()) return [];
        const endM = currentRangeEnd.minute();
        const endS = currentRangeEnd.second();
        // Si el fin tiene segundos > 0, permitir el minuto final y restringir solo segundos;
        // si es exacto (HH:MM:00), deshabilitar el minuto final completo.
        const fromMinute = endS === 0 ? endM : endM + 1;
        return disableFromTo(fromMinute, 60);
    };

    const getDisabledSecondsFromRangeEnd = (currentRangeEnd, baseDate) => {
        return currentRangeEnd.hour() === baseDate.hour()
            && currentRangeEnd.minute() === baseDate.minute()
            // Deshabilitar desde el segundo final inclusive (límite exclusivo)
            ? disableFromTo(currentRangeEnd.second(), 60)
            : [];
    };

    return { handleDisabledTime };
};

export default useDisabledTime;
