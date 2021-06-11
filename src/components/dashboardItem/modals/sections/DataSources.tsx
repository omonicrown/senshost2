import { Dropdown, DropdownItem } from "@sebgroup/react-components/dist/Dropdown/Dropdown";
import { RadioGroup } from "@sebgroup/react-components/dist/RadioGroup";
import { AxiosResponse } from "axios";
import React from "react";
import { useSelector } from "react-redux";
import { SensorApis } from "../../../../apis/sensorApis";
import { DeviceDataSourceEnums } from "../../../../enums";
import { DeviceModel, SensorModel } from "../../../../interfaces/models";
import { AuthState, DeviceState, States } from "../../../../interfaces/states";
import { AddDashboardItemControls } from "../AddDashboardItem";

export const DEVICEDATASOURCES: Array<DropdownItem> = [
    { label: 'Please select', value: null },
    {
        label: "Sensors",
        value: "sensor" as (keyof typeof DeviceDataSourceEnums)
    },
    {
        label: "Attributes",
        value: "attribute" as (keyof typeof DeviceDataSourceEnums)
    }
];

export const DEVICEDATASOURCETYPE = [
    { value: "device", label: "Device" },
    { value: "aggregateField", label: "Aggregate Field" }
];

interface DataSourcesProps {
    loading: boolean;
    fetching: boolean;
    itemControls: AddDashboardItemControls;
    deviceDataSourcesDropdownChange: (e: DropdownItem) => void;
    deviceSensorChange: (e: DropdownItem) => void;
    deviceDropdownChange: (e: DropdownItem) => void;
    dataSourceTypeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    authState: AuthState;
}

const DataSources: React.FC<DataSourcesProps> = (props: DataSourcesProps): React.ReactElement<void> => {

    const [sensors, setSensors] = React.useState<Array<DropdownItem>>([{ label: 'Please select', value: null }]);

    const deviceState: DeviceState = useSelector((states: States) => states?.devices);
    const devices: Array<DropdownItem> = React.useMemo(() => {
        const updatedDevices: Array<DropdownItem> = deviceState?.devices?.map((device: DeviceModel) => ({ label: device.name, value: device.id }));
        return [{ label: 'Please select', value: null }, ...updatedDevices];
    }, [deviceState?.devices]);

    React.useEffect(() => {
        if (props.itemControls?.dataSource?.device?.value) {
            SensorApis.getSensorsByDeviceId(props.itemControls?.dataSource?.device?.value)
                .then((response: AxiosResponse<Array<SensorModel>>) => {
                    if (response.data) {
                        const updatedSensors: Array<DropdownItem> = response.data.map((sensor: SensorModel) => ({ label: sensor?.name, value: sensor?.id }));
                        setSensors([...sensors, ...updatedSensors]);
                    }
                })
        } else {
            setSensors([{ label: 'Please select', value: null }]);
        }
    }, [props.itemControls?.dataSource?.device]);

    return (
        <React.Fragment>
            <fieldset className="properties-holder border my-2 p-2">
                <legend className="w-auto"><h5 className="custom-label"> Datasource Type </h5></legend>
                <div className="row">
                    <div className="col">
                        <RadioGroup list={DEVICEDATASOURCETYPE}
                            name="dataSourceType"
                            label=""
                            value={props.itemControls?.dataSource?.type}
                            onChange={props.dataSourceTypeChange}
                            disableAll={props?.loading || props.fetching}
                            condensed
                            inline
                        />
                    </div>
                </div>
            </fieldset>
            { props.itemControls?.dataSource?.type === 'aggregateField' ?
                <fieldset className="aggregatefield-datasource-properties border my-2 p-2">
                    <legend className="w-auto"><h5 className="custom-label"> Aggregate field </h5></legend>

                </fieldset>
                :
                <fieldset className="device-datasource-properties border my-2 p-2">
                    <legend className="w-auto"><h5 className="custom-label"> Datasource Value </h5></legend>
                    <div className="row pt-2">
                        <div className="col-12 col-sm-6">
                            <Dropdown
                                label="Device"
                                list={devices}
                                disabled={props?.loading || props.fetching}
                                selectedValue={props?.itemControls?.dataSource?.device}
                                error={null}
                                onChange={props.deviceDropdownChange}
                            />
                        </div>
                        <div className="col-12 col-sm-6">
                            <Dropdown
                                label="Device source"
                                list={DEVICEDATASOURCES}
                                disabled={props?.loading || props.fetching}
                                selectedValue={props.itemControls?.dataSource?.deviceSource}
                                error={null}
                                onChange={props.deviceDataSourcesDropdownChange}
                            />
                        </div>
                    </div>
                    {props.itemControls?.dataSource?.deviceSource?.value === 'sensor' &&
                        <div className="row">
                            <div className="col-12 col-sm-6">
                                <Dropdown
                                    label="Sensors"
                                    list={sensors}
                                    disabled={props?.loading || props.fetching}
                                    selectedValue={props.itemControls?.dataSource?.sensor}
                                    error={null}
                                    onChange={props.deviceSensorChange}
                                />
                            </div>
                        </div>
                    }
                </fieldset>
            }
        </React.Fragment>
    );

};

export default DataSources;