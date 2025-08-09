/* eslint-disable no-console */
/* eslint-disable no-magic-numbers */
/* eslint-disable sort-keys */
import React, { useMemo, useState } from "react";

import { Button, Card, Divider, Select, Space, Switch, Tag, Typography } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import DateRangeSelector from "../dateRangeSelector/DateRangeSelector";
import useAdjustDateRangesFromToday from "../dateRangeSelector/hooks/useAdjustDateRangesFromToday";
import { Format } from "../dateRangeSelector/utils/utils";

dayjs.extend(utc);

const { Text, Title } = Typography;

// Helper para construir rangos relativos a hoy (en UTC ISO)
const mkRange = ({ endDays = 0, endH = 23, endM = 59, startDays = 0, startH = 0, startM = 0 }) => {
    const start = dayjs().add(startDays, "day").hour(startH).minute(startM).second(0).utc().format();
    const end = dayjs().add(endDays, "day").hour(endH).minute(endM).second(0).utc().format();
    return { start, end };
};

const presets = {
    basico: [
        mkRange({ startDays: 0, startH: 8, startM: 0, endDays: 2, endH: 18, endM: 0 }),
        mkRange({ startDays: 4, startH: 9, startM: 30, endDays: 6, endH: 17, endM: 30 }),
    ],
    dosVentanas: [
        mkRange({ startDays: 1, startH: 0, startM: 0, endDays: 7, endH: 23, endM: 59 }),
        mkRange({ startDays: 10, startH: 0, startM: 0, endDays: 14, endH: 23, endM: 59 }),
        mkRange({ startDays: 18, startH: 8, startM: 0, endDays: 21, endH: 18, endM: 0 }),
    ],
    conHoras: [
        mkRange({ startDays: 0, startH: 13, startM: 0, endDays: 0, endH: 18, endM: 0 }),
        mkRange({ startDays: 2, startH: 9, startM: 0, endDays: 3, endH: 12, endM: 30 }),
        mkRange({ startDays: 5, startH: 14, startM: 0, endDays: 7, endH: 19, endM: 0 }),
    ],
};

const Dashboard = () => {
    const [scenario, setScenario] = useState("basico");
    const [rawRanges, setRawRanges] = useState(presets["basico"]);
    const [showTime, setShowTime] = useState(true);
    const [fmt, setFmt] = useState(Format.UP_TO_SECONDS);
    const [selected, setSelected] = useState([null, null]);

    const { adjustedDateRanges } = useAdjustDateRangesFromToday({ dateRanges: rawRanges });

    const formatOptions = useMemo(
        () => [
            { value: Format.UP_TO_SECONDS, label: "DD-MM-YYYY HH:mm:ss" },
            { value: Format.UP_TO_MINUTES, label: "DD-MM-YYYY HH:mm" },
        ],
        []
    );

    const scenarioOptions = useMemo(
        () => [
            { value: "basico", label: "Básico (3 días + 3 días)" },
            { value: "dosVentanas", label: "Dos/3 ventanas a futuro" },
            { value: "conHoras", label: "Con horas restringidas" },
        ],
        []
    );

    const handleScenarioChange = (value) => {
        setScenario(value);
        setRawRanges(presets[value] ?? []);
        setSelected([null, null]);
    };

    const handleRandomize = () => {
        // Genera 2-4 rangos aleatorios a los próximos 30 días
        const count = Math.floor(Math.random() * 3) + 2; // 2..4
        const list = Array.from({ length: count }, () => {
            const s = Math.floor(Math.random() * 25); // día de inicio 0..24
            const e = s + Math.floor(Math.random() * 5) + 1; // duración 1..5 días
            const startH = [8, 9, 13, 14][Math.floor(Math.random() * 4)];
            const endH = [12, 17, 18, 19, 23][Math.floor(Math.random() * 5)];
            return mkRange({ startDays: s, startH, startM: 0, endDays: e, endH, endM: 0 });
        }).sort((a, b) => (dayjs(a.start).isAfter(dayjs(b.start)) ? 1 : -1));
        setRawRanges(list);
        setScenario("custom");
        setSelected([null, null]);
    };

    const handleOnChange = (range) => {
        setSelected(range);
        if (range?.[0] && range?.[1]) console.log("Seleccion:", range[0].format(), "->", range[1].format());
    };

    return (
        <Space direction="vertical" size={16} style={{ padding: 16, width: "100%" }}>
            <Title level={3}>
                Dashboard de pruebas - DateRangeSelector
            </Title>

            <Card size="small" title="Configuración">
                <Space style={{ gap: 8 }} wrap>
                    <Space direction="vertical" size={2}>
                        <Text strong>
                            Escenario
                        </Text>
                        <Select
                            onChange={handleScenarioChange}
                            options={scenarioOptions}
                            style={{ minWidth: 240 }}
                            value={scenario}
                        />
                    </Space>

                    <Space direction="vertical" size={2}>
                        <Text strong>
                            Formato
                        </Text>
                        <Select
                            onChange={setFmt}
                            options={formatOptions}
                            style={{ minWidth: 240 }}
                            value={fmt}
                        />
                    </Space>

                    <Space direction="vertical" size={2}>
                        <Text strong>
                            Tiempo
                        </Text>
                        <Switch checked={showTime} onChange={setShowTime} />
                    </Space>

                    <Button onClick={handleRandomize}>
                        Generar aleatorios
                    </Button>
                </Space>
            </Card>

            <Card size="small" title="Selector">
                <DateRangeSelector
                    allowEmpty={[true, true]}
                    format={{ format: fmt, type: "mask" }}
                    onChange={handleOnChange}
                    ranges={adjustedDateRanges}
                    showTime={showTime}
                />
            </Card>

            <Card size="small" title="Estado">
                <Space direction="vertical" size={8} style={{ width: "100%" }}>
                    <div>
                        <Text strong>
                            Rangos activos (
                            {adjustedDateRanges.length}
                            ):
                        </Text>
                        <Space style={{ marginTop: 8 }} wrap>
                            {adjustedDateRanges.length === 0 && (
                                <Text type="secondary">
                                    Sin rangos válidos respecto de hoy
                                </Text>
                            )}
                            {adjustedDateRanges.map((r, idx) => (
                                <Tag color="blue" key={`${r.start}-${r.end}-${idx}`}>
                                    {dayjs(r.start).format("DD/MM HH:mm")}
                                    <span>
                                        →
                                    </span>
                                    {dayjs(r.end).format("DD/MM HH:mm")}
                                </Tag>
                            ))}
                        </Space>
                    </div>

                    <Divider style={{ margin: "8px 0" }} />

                    <div>
                        <Text strong>
                            Selección:
                        </Text>
                        {selected?.[0] && selected?.[1] ? (
                            <Text>
                                {selected[0].format("DD/MM/YYYY HH:mm:ss")}
                                <span>
                                    →
                                </span>
                                {selected[1].format("DD/MM/YYYY HH:mm:ss")}
                            </Text>
                        ) : (
                            <Text type="secondary">
                                (vacío)
                            </Text>
                        )}
                    </div>
                </Space>
            </Card>
        </Space>
    );
};

export default Dashboard;
