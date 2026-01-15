# Copilot instructions

## Project overview
- React + Vite demo app centered on `DateRangeSelector`, an Ant Design `RangePicker` wrapper that enforces allowed date/time windows. Entry point is [src/App.jsx](src/App.jsx) -> [src/components/Dashboard/Dashboard.jsx](src/components/Dashboard/Dashboard.jsx).
- Allowed windows (“ranges”) are provided by the parent as `{ start, end }` and normalized to dayjs/UTC by `useAdjustDateRangesFromToday` before being passed to the selector. See [src/components/dateRangeSelector/hooks/useAdjustDateRangesFromToday.js](src/components/dateRangeSelector/hooks/useAdjustDateRangesFromToday.js) and [src/components/dateRangeSelector/utils/dateUtils.js](src/components/dateRangeSelector/utils/dateUtils.js).
- `DateRangeSelector` uses `useDisabledDate` and `useDisabledTime` to restrict selectable days/times based on the current range. See [src/components/dateRangeSelector/DateRangeSelector.jsx](src/components/dateRangeSelector/DateRangeSelector.jsx), [src/components/dateRangeSelector/hooks/useDisabledDate.js](src/components/dateRangeSelector/hooks/useDisabledDate.js), and [src/components/dateRangeSelector/hooks/useDisabledTime.js](src/components/dateRangeSelector/hooks/useDisabledTime.js).

## Data flow & domain rules
- Ranges are inclusive and evaluated with dayjs `isBetween(..., "[]")`. The current active range is stored in a ref and reused across date/time constraints. See [src/components/dateRangeSelector/hooks/useDisabledDate.js](src/components/dateRangeSelector/hooks/useDisabledDate.js).
- Incoming ranges are sorted, past ranges removed, and the first range can be cropped to start “today.” Then they’re converted to dayjs and the start is shifted by -1 day (UTC) to implement an exclusive lower bound in the calendar logic. See [src/components/dateRangeSelector/utils/dateUtils.js](src/components/dateRangeSelector/utils/dateUtils.js).
- Selection adjustment: when the user picks midnight values, `adjustSelection` snaps to min/max allowed times; if the format omits seconds, it nudges edges by ±1 second to preserve exclusivity. See [src/components/dateRangeSelector/utils/selectionUtils.js](src/components/dateRangeSelector/utils/selectionUtils.js).
- Formatting defaults live in `defaultDateRangeConfigs`, with `Format` constants in [src/components/dateRangeSelector/utils/utils.js](src/components/dateRangeSelector/utils/utils.js). `DateRangeSelector` converts `showTime=false` into a date-only format automatically.

## Localization and time handling
- dayjs is configured globally with `utc` and `isBetween`, and locale `es`. Import [src/components/dateRangeSelector/utils/setupDayjs.js](src/components/dateRangeSelector/utils/setupDayjs.js) wherever date logic is used.
- UI locale is set via Ant Design `ConfigProvider` in [src/components/dateRangeSelector/DateRangeSelectorLayout.jsx](src/components/dateRangeSelector/DateRangeSelectorLayout.jsx).

## Dev workflows
- Dev server: `npm run dev` (Vite, http://localhost:5173).
- Build/preview: `npm run build`, `npm run preview`.
- Lint: `npm run lint`.
- Tests: `npm run test` (Jest with `--experimental-vm-modules`; tests freeze time with `jest.setSystemTime`). See [src/components/dateRangeSelector/tests/dateUtils.test.js](src/components/dateRangeSelector/tests/dateUtils.test.js).

## Conventions & examples
- The demo presets live in [src/components/Dashboard/Dashboard.jsx](src/components/Dashboard/Dashboard.jsx); use `mkRange` to build UTC ranges quickly.
- Component props: `DateRangeSelector` expects `ranges` as an array of `{ start, end }` where each value can be a `dayjs`, `Date`, or ISO string (validated via PropTypes).
