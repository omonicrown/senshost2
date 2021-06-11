import { TextLabel } from "@sebgroup/react-components/dist/TextLabel";
import React from "react";
import { ChartType } from "../../../../constants";
import { AuthState } from "../../../../interfaces/states";
import { AddDashboardItemControls } from "../AddDashboardItem";


interface DashboardItemSummaryProps {
    fetching: boolean;
    authState: AuthState;
    itemControls: AddDashboardItemControls;
}

const DashboardItemSummary: React.FC<DashboardItemSummaryProps> = (props: DashboardItemSummaryProps): React.ReactElement<void> => {
    const renderOptionalProperties = () => {
        switch (props.itemControls?.type?.value) {
            case ChartType.Tank:
                return (
                    <div className="row">
                        <div className="col">
                            <TextLabel label="Item name" value={props.itemControls?.tankProperties?.capacity} />
                        </div>
                    </div>
                );
            case ChartType.Gauge:
                return (
                    <div className="row">
                        <div className="col">
                            <TextLabel label="Min value" value={props.itemControls?.gaugeProperties?.min} />
                        </div>
                        <div className="col">
                            <TextLabel label="Max value" value={props.itemControls?.gaugeProperties?.max} />
                        </div>
                    </div>
                );
            case ChartType.LineGraph:
            case ChartType.BarGraph:
            case ChartType.PieChart:
            case ChartType.Doughnut:
                return (
                    <div className="row">
                        <div className="col">
                            <TextLabel label="Category column" value={props.itemControls?.chartProperties?.categoryColumn} />
                        </div>
                        <div className="col">
                            <TextLabel label="Value value" value={props.itemControls?.chartProperties?.valueColumn} />
                        </div>
                    </div>
                );
        }
    };

    return (
        <React.Fragment>
            <div className="card">
                <div className={"card-body" + (props.fetching ? " skeleton-loader" : "")}>
                    <h4 className="card-title">Dashboard Item</h4>
                    <div className="row">
                        <div className="col">
                            <TextLabel label="Item name" value={props?.itemControls?.name} />
                        </div>
                        <div className="col">
                            <TextLabel label="Item type" value={props.itemControls.type.label} />
                        </div>
                    </div>
                    {renderOptionalProperties()}
                </div>
            </div>
            <div className="card my-2">
                <div className={"card-body" + (props.fetching ? " skeleton-loader" : "")}>
                    <h4 className="card-title">Datasource</h4>
                    {props.itemControls?.dataSource?.type === "device" ?
                        <React.Fragment>
                            <div className="row">
                                <div className="col">
                                    <TextLabel label="Device" value={props.itemControls?.dataSource?.device?.label} />
                                </div>
                                <div className="col">
                                    {props.itemControls?.dataSource?.deviceSource.value === "sensor" ?
                                        <TextLabel label="Sensor" value={props.itemControls?.dataSource?.sensor.label} />
                                        :
                                        null
                                    }
                                </div>
                            </div>
                        </React.Fragment>
                        :
                        null
                    }
                </div>
            </div>
        </React.Fragment>
    );

};


export default DashboardItemSummary;