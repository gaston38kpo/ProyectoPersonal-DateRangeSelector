/* eslint-disable no-magic-numbers */
import dayjs from "dayjs";
import { adjustSelection } from "../utils/selectionUtils";

describe("adjustSelection", () => {
    test("Ajusta medianoche al mínimo/máximo permitido del rango (ambigüedad)", () => {
        const rangeStart = dayjs("2026-01-14T08:00:00");
        const rangeEnd = dayjs("2026-01-16T18:00:00");

        const dates = [
            dayjs("2026-01-15T00:00:00"),
            dayjs("2026-01-16T00:00:00"),
        ];

        const { adjustedDates } = adjustSelection({
            dates,
            dateStrings: ["", ""],
            currentRange: [rangeStart, rangeEnd],
            formatString: "DD-MM-YYYY HH:mm:ss",
            hasSecondsPrecision: true,
            autoAdjustMidnight: true,
        });

        expect(adjustedDates[0].format("YYYY-MM-DD HH:mm:ss")).toBe("2026-01-15 08:00:01");
        expect(adjustedDates[1].format("YYYY-MM-DD HH:mm:ss")).toBe("2026-01-16 17:59:59");
    });
});
