/* eslint-disable no-console */
const disableFromTo = (start, end) => {
    // eslint-disable-next-line func-style
    function* generateRange (start, end) {
        for (let i = start; i < end; i++)
            yield i;
    }

    return [...generateRange(start, end)];
};

const printJSON = (texto, consoleable) => {
    try {
        console.log(texto + "\n" + JSON.stringify(consoleable, null, "\t"));
    } catch (error) {
        console.log(texto + "\n" + consoleable);
    }
};
const Format = {
    DATE_ONLY: "DD-MM-YYYY",
    UP_TO_MINUTES: "DD-MM-YYYY HH:mm",
    UP_TO_SECONDS: "DD-MM-YYYY HH:mm:ss",
};

export { Format, disableFromTo, printJSON };
