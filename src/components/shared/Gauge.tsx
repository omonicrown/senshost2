import * as React from "react";

import * as echarts from 'echarts';
import { ItemChartProps } from "../dashboardItem/section/ItemChart";

interface GaugeProps {
    data: ItemChartProps;
}

const Gauge: React.FunctionComponent<GaugeProps> = (props: GaugeProps): React.ReactElement<void> => {
    const gaugeRef: React.MutableRefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
    const styles = React.useMemo(() => ({ height: '100%' }), []);

    React.useEffect(() => {
        const gaugeChart = echarts.init(gaugeRef.current);


        const option = props?.data?.value ? {
            tooltip: {
                formatter: '{a} <br/>{b} : {c}'
            },
            series: [{
                name: props?.data?.name,
                type: 'gauge',
                min: props?.data?.min,
                max: props?.data?.max,
                progress: {
                    show: true,
                    roundCap: true,
                },
                axisLabel: {
                    distance: 20,
                    fontSize: 10
                },
                title: {
                    show: false
                },
                detail: {
                    backgroundColor: '#fff',
                    borderColor: '#999',
                    width: '30%',
                    valueAnimation: true,
                    formatter: function (value) {
                        return '{value|' + value.toFixed(0) + '}';
                    },
                    rich: {
                        value: {
                            fontSize: 20,
                            fontWeight: 'bolder',
                            color: '#777'
                        },
                    }
                },
                data: [{ value: props?.data?.value }]
            }]
        } : {};

        option && gaugeChart.setOption(option as any);

    }, [gaugeRef.current, props.data]);

    return (
        <div className="gauge-graph" ref={gaugeRef} style={styles} />
    );
}

export default Gauge;
