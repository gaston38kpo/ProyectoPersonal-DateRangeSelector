const disableFromTo = (start, end) => {
    function* range(start, end) {
        for (let i = start; i < end; i++) {
            yield i;
        }
    }

    return [...range(start, end)];
};

const printJSON = (texto, consoleable) => {
    try {
        console.log(texto + "\n" + JSON.stringify(consoleable, null, "\t"));
    } catch (error) {
        console.log(texto + "\n" + consoleable);
    }
};

export { disableFromTo, printJSON };
