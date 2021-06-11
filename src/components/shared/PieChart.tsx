import * as React from "react";

import * as echarts from 'echarts';
import { ItemChartProps } from "../dashboardItem/section/ItemChart";

interface GaugeProps {
    data: ItemChartProps;
}


const PieChart: React.FunctionComponent<GaugeProps> = (props: GaugeProps): React.ReactElement<void> => {
    const pieChartRef: React.MutableRefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
    const styles = React.useMemo(() => ({ height: '100%' }), []);

    React.useEffect(() => {
        const pieChart = echarts.init(pieChartRef.current);

        const pieChartData: Array<{ name: string, value: number }> = props?.data?.categoryColumnData?.map((column: string, index: number) => ({
            name: column as string,
            value: props?.data?.valueColumnData[index] as number || 0
        }));

        const option: echarts.EChartOption = {
            title: {
                text: '',
                subtext: '',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'horizontal',
                left: 'bottom',
            },
            series: [
                {
                    name: props.data?.name,
                    type: 'pie',
                    radius: '50%',
                    data: pieChartData || [],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]

        } as any;

        option && pieChart.setOption(option);

    }, [pieChartRef.current, props.data]);

    return (
        <div className="piechart-graph" ref={pieChartRef} style={styles} />
    );
}

export default PieChart;
