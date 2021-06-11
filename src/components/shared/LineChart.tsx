import * as React from "react";

import * as echarts from 'echarts';
import { EChartOption } from "echarts";
import { ItemChartProps } from "../dashboardItem/section/ItemChart";

interface GaugeProps {
    data: ItemChartProps;
}


interface ChartOption extends EChartOption {
    tooltip: {
        formatter: string
    },
    toolbox?: {
        feature: {
            restore: {},
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        data: Array<string>
    },
    series: Array<
        {
            name: string,
            type: string,
            detail: Option,
            data: Array<number>,
            smooth: boolean
        }
    >
}

type Option = {
    [k: string]: any;
}

const LineChart: React.FunctionComponent<GaugeProps> = (props: GaugeProps): React.ReactElement<void> => {
    const lineGraphRef: React.MutableRefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
    const styles = React.useMemo(() => ({ height: '100%' }), []);

    React.useEffect(() => {
        const lineChart = echarts.init(lineGraphRef.current);

        const option: ChartOption = {
            xAxis: {
                type: 'category',
                data: props?.data?.categoryColumnData as Array<string> || []
            },
            yAxis: {
                type: 'value'
            },
            tooltip: {
                formatter: '{a} <br/>{b} : {c}'
            },
            grid: {
                left: '3%',
                containLabel: true
            },
            series: [{
                name: 'LineGraph',
                data: props?.data?.valueColumnData as any || [],
                type: 'line',
                detail: { formatter: '{value}%', fontSize: 20 },
                smooth: true
            }]
        };

        option && lineChart.setOption(option);

    }, [lineGraphRef.current, props.data]);

    return (
        <div className="line-graph" ref={lineGraphRef} style={styles} />
    );
}

export default LineChart;
