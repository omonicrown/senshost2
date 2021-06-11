import * as React from "react";

import * as echarts from 'echarts';
import { ItemChartProps } from "../dashboardItem/section/ItemChart";

interface GaugeProps {
    data: ItemChartProps;
}

const BarGraph: React.FunctionComponent<GaugeProps> = (props: GaugeProps): React.ReactElement<void> => {
    const chartRef: React.MutableRefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();

    React.useEffect(() => {
        const barChart = echarts.init(chartRef.current);

        const option: echarts.EChartOption = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: props?.data?.categoryColumnData,
            },
            yAxis: {
                type: 'value',
            },
            series: [{
                data: props?.data?.valueColumnData,
                type: 'bar'
            }]
        };
        if (option && typeof option === 'object') {
            option && barChart.setOption(option);
        }
    }, [chartRef.current, props.data]);

    const styles = React.useMemo(() => ({ height: '100%' }), []);

    return (
        <div className="bar-chart" ref={chartRef} style={styles} />
    );
}

export default BarGraph;
