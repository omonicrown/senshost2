import * as React from "react";

import * as echarts from 'echarts';
import { ItemChartProps } from "../dashboardItem/section/ItemChart";

interface GaugeProps {
    data: ItemChartProps;
}


const Doughnut: React.FunctionComponent<GaugeProps> = (props: GaugeProps): React.ReactElement<void> => {
    const doughnutRef: React.MutableRefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
    const styles = React.useMemo(() => ({ height: '100%' }), []);

    React.useEffect(() => {
        const doughnutChart = echarts.init(doughnutRef.current);
        const doughnutData: Array<{ name: string, value: number }> = props?.data?.categoryColumnData?.map((column: string, index: number) => ({
            name: column as string,
            value: props?.data?.valueColumnData[index] as number || 0
        }));

        const option: any = {
            title: {
                text: '',
                subtext: '',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            series: [
                {
                    name: props?.data?.name,
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '10',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: doughnutData || []
                }
            ]
        };

        option && doughnutChart.setOption(option);

    }, [doughnutRef.current, props.data]);

    return (
        <div className="doughnut-graph" ref={doughnutRef} style={styles} />
    );
}

export default Doughnut;
