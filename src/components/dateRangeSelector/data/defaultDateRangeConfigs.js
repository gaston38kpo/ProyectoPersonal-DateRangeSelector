const defaultDateRangeConfigs = (userProps = {}) => {
    return {
        allowEmpty: [true, true],
        format: {
            format: "DD-MM-YYYY HH:mm:ss",
            type: "mask",
        },
        showTime: true,
        ...userProps,
    };
};

export default defaultDateRangeConfigs;
