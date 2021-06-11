import React from "react";
import mqtt from "mqtt";

import { DashboardItemModel, SensorValue } from "../../../interfaces/models";

import { SensorApis } from "../../../apis/sensorApis";
import { convertStringToJson, covertDateTimeField } from "../../../utils/functions";

//charts

import Gauge from "../../shared/Gauge";
import Tank from "../../shared/Tank";
import LineChart from "../../shared/LineChart";
import BarGraph from "../../shared/BarGraph";
import PieChart from "../../shared/PieChart";
import Doughnut from "../../shared/Doughnut";
import { ChartType, DashboardItemStatus } from "../../../constants";
import { AxiosResponse } from "axios";
import configs from "../../../configs";


export interface ItemChartProps extends DashboardItemModel {
    value?: number | string;
    capacity?: number;
    categoryColumnData?: Array<string | number>;
    valueColumnData?: Array<string | number>;
    min?: number;
    max?: number;
    status?: DashboardItemStatus;
    deviceId?: string;
}

const ItemChart: React.FC<ItemChartProps> = (props: ItemChartProps): React.ReactElement<void> => {

    const [chartItem, setChartItem] = React.useState<ItemChartProps>({} as ItemChartProps);
    const client: mqtt.Client = mqtt.connect(configs.socket,
        {
            port: configs.port,
            path: "/mqtt",
            username: props?.deviceId,
            password: "",
        });


    const calculateChartData = React.useCallback((response: Array<SensorValue>, properties: Array<{ [k: string]: string }>) => {
        switch (props.type) {
            case ChartType.Tank:
            case ChartType.Gauge:
                const latestData: SensorValue = response?.length ? response[0] : {} as SensorValue;
                const updatedData: ItemChartProps = {
                    ...props,
                    value: latestData?.value,
                    capacity: Number(properties[0]?.capacity) || Number(latestData?.value),
                    min: latestData["min"] ? latestData["min"] : properties[0]?.min,
                    max: latestData["max"] ? latestData["max"] : properties[0]?.max,
                    deviceId: properties[0]?.deviceId,
                    status: latestData["status"] ? latestData["status"] : DashboardItemStatus.On
                };
                setChartItem(updatedData);
                break;
            case ChartType.LineGraph:
            case ChartType.BarGraph:
            case ChartType.PieChart:
            case ChartType.Doughnut:
                const categoryColumnName: string = properties?.find((property: { [k: string]: string }) => property.categoryColumn)?.categoryColumn;
                const valueColumn: string = properties?.find((property: { [k: string]: string }) => property.valueColumn)?.valueColumn;
                const columnsData: Array<string | number> = response?.map((sensor: SensorValue) => covertDateTimeField(sensor[categoryColumnName]));
                const rowsData: Array<string | number> = response?.map((sensor: SensorValue) => sensor[valueColumn]);
                setChartItem({
                    ...chartItem,
                    categoryColumnData: columnsData,
                    valueColumnData: rowsData,
                    deviceId: properties[0]?.deviceId,
                });
        }
    }, [props, chartItem]);

    const fetchData = async () => {
        try {
            const properties: Array<{ [k: string]: string }> = convertStringToJson(props?.property);
            const source: { [k: string]: string } = properties?.find((property: { [k: string]: string }) => property?.sourceId);

            const respose: AxiosResponse<Array<SensorValue>> = await SensorApis.getSensorValuesById(source?.sourceId);

            calculateChartData(respose?.data || [], properties);
        } catch (err) {
            console.error(err);
        }
    }

    React.useEffect(() => {
        fetchData();
    }, []);

    const renderCharts = () => {
        switch (props.type) {
            case ChartType.Tank:
                return <Tank type={'rectangle'} data={chartItem} />;
            case ChartType.Gauge:
                return <Gauge data={chartItem} />;
            case ChartType.LineGraph:
                return <LineChart data={chartItem} />;
            case ChartType.BarGraph:
                return <BarGraph data={chartItem} />;
            case ChartType.PieChart:
                return <PieChart data={chartItem} />;
            case ChartType.Doughnut:
                return <Doughnut data={chartItem} />;
            default:
                return <PieChart data={chartItem} />;
        }
    };

    React.useEffect(() => {
        client.on('connect', () => {
            console.log("SOCKET CONNECTED")
            client.subscribe(`${props?.deviceId}/telemetry`, (err) => {
                if (err) {
                    console.error("SUBSCRIPTION FAILED", err);
                }
            });
        });

        client.on('message', (topic, message) => {
            fetchData();
        });

        client.on("error", (error) => {
            console.error("SOCKET failed ", error);
        });

        return () => { client.end() };

    }, [props?.deviceId]);

    return (
        <React.Fragment>
            {renderCharts()}
        </React.Fragment>
    )

};


export default ItemChart;