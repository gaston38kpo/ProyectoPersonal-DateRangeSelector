/* eslint-disable no-magic-numbers */
import React, { useState } from "react";

import { Card, Layout, Select, Space, Switch, Tooltip, Typography } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import DateRangeSelector from "../dateRangeSelector/DateRangeSelector";
import useAdjustDateRangesFromToday from "../dateRangeSelector/hooks/useAdjustDateRangesFromToday";
import { Format } from "../dateRangeSelector/utils/utils";

dayjs.extend(utc);

const { Content, Footer, Header } = Layout;
const { Text, Title } = Typography;

// Rango simple por defecto (ajustado a hoy dinámicamente) con soporte de segundos
const mkRange = ({ endDays = 3, endH = 18, endM = 0, endS = 0, startDays = 0, startH = 8, startM = 0, startS = 0 }) => {
    const start = dayjs().add(startDays, "day").hour(startH).minute(startM).second(startS).utc().format();
    const end = dayjs().add(endDays, "day").hour(endH).minute(endM).second(endS).utc().format();
    return { start, end };
};

const DEFAULT_RANGES = [
    mkRange({ startDays: 0, startH: 8, startM: 0, endDays: 2, endH: 18, endM: 0 }),
    mkRange({ startDays: 4, startH: 9, startM: 30, endDays: 6, endH: 17, endM: 30 }),
];

const Dashboard = () => {
    const [selected, setSelected] = useState([null, null]);
    const [rawRanges, setRawRanges] = useState(DEFAULT_RANGES);
    const [showTime, setShowTime] = useState(false);
    const { adjustedDateRanges } = useAdjustDateRangesFromToday({ dateRanges: rawRanges });

    const handleOnChange = (range) => {
        setSelected(range);
    };

    const eligiblePresets = [
        {
            label: "Básico",
            ranges: [
                mkRange({ endDays: 2, endH: 18, endM: 0, startDays: 0, startH: 8, startM: 0 }),
                mkRange({ endDays: 6, endH: 17, endM: 30, startDays: 4, startH: 9, startM: 30 }),
            ],
        },
        {
            label: "Dos ventanas",
            ranges: [
                mkRange({ endDays: 7, endH: 23, endM: 59, startDays: 1, startH: 0, startM: 0 }),
                mkRange({ endDays: 14, endH: 23, endM: 59, startDays: 10, startH: 0, startM: 0 }),
            ],
        },
        {
            label: "Con horas",
            ranges: [
                mkRange({ endDays: 0, endH: 18, endM: 0, startDays: 0, startH: 13, startM: 0 }),
                mkRange({ endDays: 3, endH: 12, endM: 30, startDays: 2, startH: 9, startM: 0 }),
            ],
        },
        {
            label: "Segundos cortos",
            ranges: [
                mkRange({ endDays: 1, endH: 10, endM: 15, endS: 45, startDays: 1, startH: 10, startM: 15, startS: 10 }),
                mkRange({ endDays: 1, endH: 12, endM: 0, endS: 1, startDays: 1, startH: 12, startM: 0, startS: 0 }),
            ],
        },
        {
            label: "Minutos pico",
            ranges: [
                mkRange({ endDays: 2, endH: 9, endM: 1, endS: 0, startDays: 2, startH: 8, startM: 59, startS: 0 }),
                mkRange({ endDays: 2, endH: 17, endM: 31, endS: 0, startDays: 2, startH: 17, startM: 29, startS: 30 }),
            ],
        },
        {
            label: "Medianoche exacta",
            ranges: [
                mkRange({ endDays: 2, endH: 0, endM: 0, endS: 0, startDays: 1, startH: 22, startM: 0, startS: 0 }),
                mkRange({ endDays: 3, endH: 0, endM: 0, endS: 0, startDays: 3, startH: 0, startM: 0, startS: 0 }),
            ],
        },
        {
            label: "Fin en hora exacta",
            ranges: [
                mkRange({ endDays: 5, endH: 12, endM: 0, endS: 0, startDays: 5, startH: 8, startM: 0, startS: 0 }),
                mkRange({ endDays: 5, endH: 18, endM: 0, endS: 0, startDays: 5, startH: 13, startM: 15, startS: 0 }),
            ],
        },
        {
            label: "Superpuestas",
            ranges: [
                mkRange({ endDays: 6, endH: 12, endM: 0, endS: 0, startDays: 6, startH: 9, startM: 0, startS: 0 }),
                mkRange({ endDays: 6, endH: 15, endM: 0, endS: 0, startDays: 6, startH: 11, startM: 0, startS: 0 }),
                mkRange({ endDays: 6, endH: 19, endM: 0, endS: 0, startDays: 6, startH: 14, startM: 30, startS: 0 }),
            ],
        },
        {
            label: "Dispersas múltiples",
            ranges: [
                mkRange({ endDays: 7, endH: 23, endM: 59, endS: 59, startDays: 7, startH: 0, startM: 0, startS: 0 }),
                mkRange({ endDays: 9, endH: 10, endM: 45, endS: 0, startDays: 9, startH: 10, startM: 0, startS: 0 }),
                mkRange({ endDays: 12, endH: 18, endM: 5, endS: 15, startDays: 12, startH: 16, startM: 20, startS: 30 }),
                mkRange({ endDays: 15, endH: 20, endM: 0, endS: 0, startDays: 15, startH: 8, startM: 0, startS: 0 }),
            ],
        },
        {
            label: "Ventanas muy cortas",
            ranges: [
                mkRange({ endDays: 1, endH: 9, endM: 0, endS: 5, startDays: 1, startH: 9, startM: 0, startS: 0 }),
                mkRange({ endDays: 1, endH: 9, endM: 0, endS: 12, startDays: 1, startH: 9, startM: 0, startS: 10 }),
                mkRange({ endDays: 1, endH: 9, endM: 1, endS: 1, startDays: 1, startH: 9, startM: 1, startS: 0 }),
            ],
        },
    ];

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header style={{ background: "#fff", padding: "12px 16px", borderBottom: "1px solid #f0f0f0" }}>
                <Title level={4} style={{ margin: 0 }}>
                    Demo DateRangeSelector
                </Title>
            </Header>
            <Content style={{ padding: 16 }}>
                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                    <Card
                        size="small"
                        title={
                            <Space size={4}>
                                <span>
                                    Elegibles (raw)
                                </span>
                                <Tooltip title="Rangos tal como vienen del preset (sin normalización).">
                                    <InfoCircleOutlined />
                                </Tooltip>
                            </Space>
                        }
                    >
                        {rawRanges.length === 0 ? (
                            <Text type="secondary">
                                (vacío)
                            </Text>
                        ) : (
                            <Space direction="vertical" size={4} style={{ width: "100%" }}>
                                {rawRanges.map((r, idx) => (
                                    <Text key={`${r.start}-${r.end}-${idx}`}>
                                        <span title={dayjs(r.start).toISOString()}>
                                            {dayjs(r.start).format("DD/MM/YYYY HH:mm")}
                                        </span>
                                        <span>
                                            →
                                        </span>
                                        <span title={dayjs(r.end).toISOString()}>
                                            {dayjs(r.end).format("DD/MM/YYYY HH:mm")}
                                        </span>
                                    </Text>
                                ))}
                            </Space>
                        )}
                    </Card>

                    <Card
                        size="small"
                        title={
                            <Space size={4}>
                                <span>
                                    Elegibles (ajustados)
                                </span>
                                <Tooltip title="Rangos normalizados respecto a hoy: se quitan pasados, se recorta el primero si toca hoy y se convierten a dayjs para la lógica del selector.">
                                    <InfoCircleOutlined />
                                </Tooltip>
                            </Space>
                        }
                    >
                        {adjustedDateRanges.length === 0 ? (
                            <Text type="secondary">
                                (vacío)
                            </Text>
                        ) : (
                            <Space direction="vertical" size={4} style={{ width: "100%" }}>
                                {adjustedDateRanges.map((r, idx) => (
                                    <Text key={`${r.start}-${r.end}-${idx}`}>
                                        <span title={dayjs(r.start).toISOString()}>
                                            {dayjs(r.start).format("DD/MM/YYYY HH:mm")}
                                        </span>
                                        <span>
                                            →
                                        </span>
                                        <span title={dayjs(r.end).toISOString()}>
                                            {dayjs(r.end).format("DD/MM/YYYY HH:mm")}
                                        </span>
                                    </Text>
                                ))}
                            </Space>
                        )}
                    </Card>
                    <Card size="small" title="Fechas predefinidas (elegibles)">
                        <Select
                            onChange={(key) => {
                                const preset = eligiblePresets.find((p) => p.label === key);
                                if (preset) {
                                    setSelected([null, null]);
                                    setRawRanges(preset.ranges);
                                }
                            }}
                            options={eligiblePresets.map((p) => ({ label: p.label, value: p.label }))}
                            placeholder="Selecciona un preset de elegibles"
                            style={{ minWidth: 260 }}
                            value={null}
                        />
                    </Card>
                    <Card
                        size="small"
                        title="Selecciona un rango"
                        extra={(
                            <Space size={8}>
                                <Text>
                                    Mostrar horas
                                </Text>
                                <Switch
                                    checked={showTime}
                                    onChange={setShowTime}
                                    size="small"
                                />
                            </Space>
                        )}
                    >
                        <DateRangeSelector
                            allowEmpty={[true, true]}
                            format={{ format: Format.UP_TO_MINUTES, type: "mask" }}
                            onChange={handleOnChange}
                            ranges={adjustedDateRanges}
                            showTime={showTime}
                        />
                    </Card>

                    <Card size="small" title="Resultado">
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
                    </Card>
                </Space>
            </Content>
            <Footer style={{ textAlign: "center" }}>
                DateRangeSelector • Ant Design
            </Footer>
        </Layout>
    );
};

export default Dashboard;
