import { DropdownItem } from "@sebgroup/react-components/dist/Dropdown/Dropdown";
import { TextBoxGroup } from "@sebgroup/react-components/dist/TextBoxGroup";
import { AxiosResponse } from "axios";
import React from "react";
import { Edge, Elements, FlowElement } from "react-flow-renderer";
import { useSelector } from "react-redux";
import { SensorApis } from "../../../apis/sensorApis";
import { ActuatorApis } from "../../../apis/actuatorApis";

import { ActuatorModel, DeviceModel, SensorModel } from "../../../interfaces/models";
import { DeviceState, States } from "../../../interfaces/states";

import DataReceived from "./sections/DataReceive";
import Schedule from "./sections/Schedule";
import { TriggerDataSourceTypeEnums } from "../../../enums";

interface TriggerFormProps {
    loading: boolean;
    handleTriggerTextChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleTriggerDropDownChange: (value: DropdownItem, type: "deviceId" | "sourceId" | "sourceType") => void;
    handleTriggerStartDateChange: (value: Date) => void;
    selectedElement: FlowElement & Edge;
    elements: Elements;
}

export interface TriggerFormModel {
    eventName: string;
    triggerName: string;
    type: number;
    sourceType: DropdownItem;
    deviceId: DropdownItem | string | Date;
    sourceId: DropdownItem | string;
}

const TriggerForm: React.FC<TriggerFormProps> = (props: TriggerFormProps): React.ReactElement<void> => {
    const [fields, setFields] = React.useState<TriggerFormModel>({ eventName: "", triggerName: "", type: null, sourceType: null, deviceId: null, sourceId: null });
    const [sensors, setSensors] = React.useState<Array<DropdownItem>>([{ label: 'Please select', value: null }]);
    const [actuators, setActuators] = React.useState<Array<DropdownItem>>([{ label: 'Please select', value: null }]);

    const deviceState: DeviceState = useSelector((states: States) => states?.devices);
    const devices: Array<DropdownItem> = React.useMemo(() => {
        const updatedDevices: Array<DropdownItem> = deviceState?.devices?.map((device: DeviceModel) => ({ label: device.name, value: device.id }));
        return [{ label: 'Please select', value: null }, ...updatedDevices];
    }, [deviceState?.devices]);

    const elementType: "dataReceived" | "schedule" = React.useMemo(() => {
        const firstWord: string = props.selectedElement?.id?.split("-")[0];
        return firstWord as "dataReceived" | "schedule"
    }, [props.selectedElement]);

    const triggerSouceTypes: Array<DropdownItem> = React.useMemo(() => {
        if (elementType === "dataReceived") {
            return [{
                label: "Select",
                value: null
            }, {
                label: "Device",
                value: TriggerDataSourceTypeEnums.device
            }, {
                label: "Sensor",
                value: TriggerDataSourceTypeEnums.sensor
            }, {
                label: "Attribute",
                value: TriggerDataSourceTypeEnums.attribute
            }, {
                label: "Actuator",
                value: TriggerDataSourceTypeEnums.actuator
            }];
        } else if (elementType === "schedule") {
            return [{
                label: "Select",
                value: null
            }, {
                label: "One time",
                value: TriggerDataSourceTypeEnums.onetime
            }, {
                label: "Recurring",
                value: TriggerDataSourceTypeEnums.recurring
            }];
        }
    }, [elementType]);


    const cadenceValues: Array<DropdownItem> = React.useMemo(() => {
        return [{
            label: "Select",
            value: null
        }, {
            label: "Daily",
            value: "daily"
        }, {
            label: "Weekly",
            value: "wekkly"
        }, {
            label: "Monthly",
            value: "monthly"
        }];
    }, []);

    React.useEffect(() => {
        if ((fields.deviceId as DropdownItem)?.value) {
            SensorApis.getSensorsByDeviceId((fields.deviceId as DropdownItem)?.value)
                .then((response: AxiosResponse<Array<SensorModel>>) => {
                    if (response.data) {
                        const updatedSensors: Array<DropdownItem> = response.data.map((sensor: SensorModel) => ({ label: sensor?.name, value: sensor?.id }));
                        setSensors(updatedSensors);
                    }
                });
            ActuatorApis.getActuatorsByDeviceId((fields.deviceId as DropdownItem)?.value)
                .then((response: AxiosResponse<Array<ActuatorModel>>) => {
                    if (response.data) {
                        const updatedActuators: Array<DropdownItem> = response.data.map((actuator: ActuatorModel) => ({ label: actuator?.name, value: actuator?.id }));
                        setActuators(updatedActuators);
                    }
                });

        } else {
            setSensors([{ label: 'Please select', value: null }]);
            setActuators([{ label: 'Please select', value: null }]);
        }
    }, [fields]);

    React.useEffect(() => {
        const element: FlowElement = props.elements?.find((el: FlowElement) => el.id === props.selectedElement?.id);
        const selctedDevice: DropdownItem = devices?.find((device: DropdownItem) => device?.value === element?.data?.nodeControls?.trigger?.deviceId);
        const sourceType: DropdownItem = triggerSouceTypes.find((source: DropdownItem) => source?.value === element?.data?.nodeControls?.trigger?.sourceType);
        let sourceId: string | DropdownItem;

        if (sourceType?.value === TriggerDataSourceTypeEnums.sensor) {
            sourceId = sensors.find((source: DropdownItem) => source?.value === element?.data?.nodeControls?.trigger?.sourceId);
        } else if (sourceType?.value === TriggerDataSourceTypeEnums.actuator) {
            sourceId = actuators.find((source: DropdownItem) => source?.value === element?.data?.nodeControls?.trigger?.sourceId);
        } else if (sourceType?.value === TriggerDataSourceTypeEnums.recurring) {
            sourceId = cadenceValues?.find((cadence: DropdownItem) => cadence?.value === element?.data?.nodeControls?.trigger?.sourceId);
        }
        
        setFields({
            ...fields,
            eventName: element?.data?.nodeControls?.trigger?.eventName,
            triggerName: element?.data?.nodeControls?.trigger?.triggerName,
            deviceId: (selctedDevice as DropdownItem) || element?.data?.nodeControls?.trigger?.deviceId,
            sourceType: sourceType,
            sourceId: sourceId || element?.data?.nodeControls?.trigger?.sourceId
        });
        
    }, [props.selectedElement, props.elements, setFields, devices]);

    return (
        <div className="rule-properties-holder">
            <div className="row">
                <TextBoxGroup
                    name="eventName"
                    type="text"
                    className="col"
                    label="Event name"
                    placeholder="Event name"
                    value={fields?.eventName}
                    onChange={props.handleTriggerTextChange}
                    disabled={props.loading}
                />
            </div>

            <div className="row">
                <TextBoxGroup
                    name="triggerName"
                    label="Trigger name"
                    type="text"
                    className="col"
                    placeholder="Trigger name"
                    value={fields?.triggerName}
                    onChange={props.handleTriggerTextChange}
                    disabled={props.loading}
                />
            </div>
            {elementType === "schedule" &&
                <Schedule
                    trigger={fields}
                    handleTriggerDropDownChange={props.handleTriggerDropDownChange}
                    loading={props.loading}
                    cadenceValues={cadenceValues}
                    handleTriggerStartDateChange={props.handleTriggerStartDateChange}
                    sourceTypes={triggerSouceTypes}
                    handleTriggerTextChange={props.handleTriggerTextChange}
                />}
            {elementType === "dataReceived" && <DataReceived
                devices={devices}
                trigger={fields}
                actuators={actuators}
                sensors={sensors}
                handleTriggerDropDownChange={props.handleTriggerDropDownChange}
                sourceTypes={triggerSouceTypes}
                loading={props.loading}
            />}
        </div>
    )
};


export default TriggerForm;