import { Dropdown, DropdownItem } from "@sebgroup/react-components/dist/Dropdown/Dropdown";
import React from "react";
import { TriggerDataSourceTypeEnums } from "../../../../enums";
import { TriggerFormModel } from "../Trigger";

interface DataReceivedProps {
    loading: boolean;
    trigger: TriggerFormModel;
    devices: Array<DropdownItem>;
    actuators: Array<DropdownItem>;
    sensors: Array<DropdownItem>;
    sourceTypes: Array<DropdownItem>;
    handleTriggerDropDownChange: (value: DropdownItem, type: "deviceId" | "sourceId" | "sourceType") => void;
}
const DataReceived: React.FC<DataReceivedProps> = (props: DataReceivedProps): React.ReactElement<void> => {
    return (
        <React.Fragment>
            <div className="row">
                <Dropdown
                    label="Source Type"
                    name="sourceType"
                    list={props?.sourceTypes}
                    className="col"
                    disabled={props?.loading}
                    selectedValue={props.trigger?.sourceType}
                    error={null}
                    onChange={(value: DropdownItem) => props.handleTriggerDropDownChange(value, "sourceType")}
                />
            </div>

            <div className="row">
                <Dropdown
                    label="Device"
                    name="deviceId"
                    list={props?.devices}
                    className="col"
                    disabled={props?.loading}
                    selectedValue={props.trigger?.deviceId as DropdownItem}
                    error={null}
                    onChange={(value: DropdownItem) => props.handleTriggerDropDownChange(value, "deviceId")}
                />
            </div>

            {props?.trigger?.sourceType?.value === TriggerDataSourceTypeEnums.sensor && <div className="row">
                <Dropdown
                    label="Sensor"
                    name="sourceId"
                    list={props?.sensors}
                    className="col"
                    disabled={props?.loading}
                    selectedValue={props.trigger?.sourceId as DropdownItem}
                    error={null}
                    onChange={(value: DropdownItem) => props.handleTriggerDropDownChange(value, "sourceId")}
                />
            </div>}

            {props?.trigger?.sourceType?.value === TriggerDataSourceTypeEnums.actuator && <div className="row">
                <Dropdown
                    label="Actuator"
                    name="sourceId"
                    list={props?.actuators}
                    className="col"
                    disabled={props?.loading}
                    selectedValue={props.trigger?.sourceId as DropdownItem}
                    error={null}
                    onChange={(value: DropdownItem) => props.handleTriggerDropDownChange(value, "sourceId")}
                />
            </div>}

        </React.Fragment>
    );
};

export default DataReceived;