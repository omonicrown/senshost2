import { Dropdown, DropdownItem } from "@sebgroup/react-components/dist/Dropdown/Dropdown";
import { TextBoxGroup } from "@sebgroup/react-components/dist/TextBoxGroup";
import React from "react";
import { ChartType, DASHBOARDITEMTYPES } from "../../../../constants";
import { AddDashboardItemControls } from "../AddDashboardItem";

const dashboardItemTypes = [{ label: 'Please select', value: null }, ...DASHBOARDITEMTYPES];

interface ItemPropertyProps {
    loading: boolean;
    fetching: boolean;
    itemControls: AddDashboardItemControls;
    dashboardItemErrors: AddDashboardItemControls;
    handleDashboardItemNameChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleItemTypeDropdownChange: (value: DropdownItem) => void;
    handleItemPropertyChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, type: "tank" | "gauge" | "chart") => void;
}

const ItemProperty: React.FC<ItemPropertyProps> = (props: ItemPropertyProps) => {
    const renderOptionalProperties = () => {
        switch (props.itemControls?.type?.value) {
            case ChartType.Tank:
                return (
                    <div className="row">
                        <div className="col-12 col-sm-6">
                            <TextBoxGroup
                                name="capacity"
                                label="Capacity"
                                type="number"
                                disabled={props?.loading || props.fetching}
                                placeholder="Tank capacity"
                                value={props.itemControls?.tankProperties?.capacity}
                                error={props.dashboardItemErrors?.name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.handleItemPropertyChange(e, "tank")}
                            />
                        </div>
                    </div>
                );
            case ChartType.Gauge:
                return (
                    <div className="row">
                        <div className="col-12 col-sm-6">
                            <TextBoxGroup
                                name="min"
                                label="Minimum value"
                                type="number"
                                disabled={props?.loading || props.fetching}
                                placeholder="Minimum value"
                                value={props.itemControls?.gaugeProperties?.min}
                                error={props.dashboardItemErrors?.name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.handleItemPropertyChange(e, "gauge")}
                            />
                        </div>
                        <div className="col-12 col-sm-6">
                            <TextBoxGroup
                                name="max"
                                label="Maximum value"
                                type="text"
                                disabled={props?.loading || props.fetching}
                                placeholder="max value"
                                value={props.itemControls?.gaugeProperties?.max}
                                error={props.dashboardItemErrors?.name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.handleItemPropertyChange(e, "gauge")}
                            />
                        </div>
                    </div>
                );
            case ChartType.LineGraph:
            case ChartType.BarGraph:
            case ChartType.PieChart:
            case ChartType.Doughnut:
                return (
                    <div className="row">
                        <div className="col-12 col-sm-6">
                            <TextBoxGroup
                                name="categoryColumn"
                                label="Category column"
                                type="text"
                                disabled={props?.loading || props.fetching}
                                placeholder="example x-axis column"
                                value={props.itemControls?.chartProperties?.categoryColumn}
                                error={props.dashboardItemErrors?.name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.handleItemPropertyChange(e, "chart")}
                            />
                        </div>
                        <div className="col-12 col-sm-6">
                            <TextBoxGroup
                                name="valueColumn"
                                label="Category value"
                                type="text"
                                disabled={props?.loading || props.fetching}
                                placeholder="example y-axis column"
                                value={props.itemControls?.chartProperties?.valueColumn}
                                error={props.dashboardItemErrors?.name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.handleItemPropertyChange(e, "chart")}
                            />
                        </div>
                    </div>
                );
        }
    }
    return (
        <React.Fragment>
            <div className="row">
                <div className="col-12 col-sm-6">
                    <TextBoxGroup
                        name="name"
                        label="Name"
                        type="text"
                        disabled={props?.loading}
                        placeholder="Dashboard name"
                        value={props.itemControls?.name}
                        error={props.dashboardItemErrors?.name}
                        onChange={props.handleDashboardItemNameChange}
                    />
                </div>
                <div className="col-12 col-sm-6">
                    <Dropdown
                        label="Item Type"
                        list={dashboardItemTypes}
                        disabled={props?.loading}
                        selectedValue={props.itemControls?.type}
                        error={props.dashboardItemErrors?.type as any}
                        onChange={props.handleItemTypeDropdownChange}
                    />
                </div>
                {/** item static properties */}
            </div>
            { renderOptionalProperties()}
        </React.Fragment>
    )
};

export default ItemProperty;