import { Format } from "../utils/utils";

const defaultDateRangeConfigs = (userProps = {}) => {
    return {
        allowEmpty: [true, true],
        format: {
            format: Format.UP_TO_SECONDS,
            type: "mask",
        },
        // showTime: true,
        ...userProps,
    };
};

export default defaultDateRangeConfigs;
