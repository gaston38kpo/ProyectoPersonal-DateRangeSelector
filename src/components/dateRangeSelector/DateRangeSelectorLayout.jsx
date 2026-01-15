// eslint-disable-next-line no-unused-vars
import React from "react";

import PropTypes from "prop-types";
import { ConfigProvider } from "antd";

import locale from "antd/es/locale/es_ES";

const DateRangeSelectorLayout = ({ children }) => {
    return (
        <ConfigProvider locale={locale}>
            { children }
        </ConfigProvider>
    );
};

DateRangeSelectorLayout.propTypes = { children: PropTypes.element.isRequired };

export default DateRangeSelectorLayout;
