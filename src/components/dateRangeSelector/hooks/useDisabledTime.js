/* eslint-disable no-magic-numbers */
import { disableFromTo } from "../utils/utils";


const useDisabledTime = ({
    currentMode,
    currentRange,
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
                disabledHours: () => disableFromTo(0, 24),
                disabledMinutes: () => disableFromTo(0, 60),
                disabledSeconds: () => disableFromTo(0, 60),
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
                disabledSeconds: () => getDisabledSecondsFromRangeStart(currentRangeStart, baseDate),
            };
        
        
        if (isBaseDateSameCurrentRangeEnd) 
            return {
                disabledHours: () => getDisabledHoursFromRangeEnd(currentRangeEnd),
                disabledMinutes: () => getDisabledMinutesFromRangeEnd(currentRangeEnd, baseDate),
                disabledSeconds: () => getDisabledSecondsFromRangeEnd(currentRangeEnd, baseDate),
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
        return disableFromTo(currentRangeEnd.hour(), 24);
    };

    const getDisabledMinutesFromRangeEnd = (currentRangeEnd, baseDate) => {
        return currentRangeEnd.hour() === baseDate.hour()
            ? disableFromTo(currentRangeEnd.minute(), 60)
            : [];
    };

    const getDisabledSecondsFromRangeEnd = (currentRangeEnd, baseDate) => {
        return currentRangeEnd.hour() === baseDate.hour()
            && currentRangeEnd.minute() === baseDate.minute()
            ? disableFromTo(currentRangeEnd.second(), 60)
            : [];
    };

    return { handleDisabledTime };
};

export default useDisabledTime;
