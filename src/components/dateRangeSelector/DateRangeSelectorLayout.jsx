// eslint-disable-next-line no-unused-vars
import React from 'react';

import { ConfigProvider, DatePicker } from 'antd';
// import es from "antd/locale/es_ES";

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/es";

import locale from "antd/es/locale/es_ES";

// dayjs.locale("es");
dayjs.extend(utc);
dayjs.extend(isBetween);

const DateRangeSelectorLayout = ({ children }) => {
    return (
        <ConfigProvider locale={locale}>
            { children }
        </ConfigProvider>
    );
};

DateRangeSelectorLayout.propTypes = {
    children: (props, propName, componentName) => {
        const child = props[propName];

        if (child && child.type !== DatePicker.RangePicker) {
            return new Error(
                `${componentName} espera un elemento 'DatePicker.RangePicker' como children.`
            );
        }
    }
};

export default DateRangeSelectorLayout;
