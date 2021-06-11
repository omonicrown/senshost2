import { Dropdown, DropdownItem } from "@sebgroup/react-components/dist/Dropdown/Dropdown";
import { RadioGroup } from "@sebgroup/react-components/dist/RadioGroup";
import { TextBoxGroup } from "@sebgroup/react-components/dist/TextBoxGroup";
import { AxiosResponse } from "axios";
import React from "react";
import { Edge, Elements, FlowElement } from "react-flow-renderer";
import { useSelector } from "react-redux";
import { SensorApis } from "../../../apis/sensorApis";
import { NUMBERRULEOPERATORS, STRINGRULEOPRATORS, TIMERULEOPERATORS } from "../../../constants";
import { TimeRuleCadenceEnums } from "../../../enums";
import { DeviceModel, SensorModel } from "../../../interfaces/models";
import { DeviceState, States } from "../../../interfaces/states";
import { DatasourceType } from "../../dashboardItem/modals/AddDashboardItem";

import { DEVICEDATASOURCETYPE, DEVICEDATASOURCES } from "../../dashboardItem/modals/sections/DataSources";

interface RulesFormProps {
    loading: boolean;
    handleRulesDropDownChange: (value: DropdownItem, field: "device" | "deviceSource" | "sensor" | "operator" | "cadence") => void;
    selectedElement: FlowElement & Edge;
    elements: Elements;
    handleDataSourceChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleRuleOperatorValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleRuleTitleValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface DataSourceProps {
    type?: DatasourceType;
    title?: string;
    deviceSource?: DropdownItem;
    device?: DropdownItem;
    sensor?: DropdownItem;
    attribute?: string;
}

interface OperatorProps {
    operator: DropdownItem;
    value: string;
    cadence?: DropdownItem;
}

const RulesForm: React.FC<RulesFormProps> = (props: RulesFormProps): React.ReactElement<void> => {
    const [dataSource, setDataSource] = React.useState<DataSourceProps>({ type: "device", });
    const [operatorObj, setOperator] = React.useState<OperatorProps>({ operator: null, value: "" });

    const [sensors, setSensors] = React.useState<Array<DropdownItem>>([{ label: 'Please select', value: null }]);

    const deviceState: DeviceState = useSelector((states: States) => states?.devices);
    const devices: Array<DropdownItem> = React.useMemo(() => {
        const updatedDevices: Array<DropdownItem> = deviceState?.devices?.map((device: DeviceModel) => ({ label: device.name, value: device.id }));
        return [{ label: 'Please select', value: null }, ...updatedDevices];
    }, [deviceState?.devices]);

    const operators: Array<DropdownItem> = React.useMemo(() => {
        const firstWord: string = props.selectedElement?.id?.split("-")[0];

        switch (firstWord) {
            case "time":
                return [{ label: "Select", value: null }, ...TIMERULEOPERATORS];
            case "string":
                return [{ label: "Select", value: null }, ...STRINGRULEOPRATORS];
            case "number":
                return [{ label: "Select", value: null }, ...NUMBERRULEOPERATORS];
            default:
                return [{ label: "Select", value: null }]
        }

    }, [props.selectedElement]);

    const timeRuleCadences: Array<DropdownItem> = React.useMemo((): Array<DropdownItem> => [
        { label: "Select ", value: null },
        { label: "Minutes", value: TimeRuleCadenceEnums.MINUTES },
        { label: "Hours", value: TimeRuleCadenceEnums.HOURS },
        { label: "Months", value: TimeRuleCadenceEnums.MONTHS },
        { label: "Years", value: TimeRuleCadenceEnums.YEARS },
    ], []);

    const firstWord: string = React.useMemo(() => {
        return props.selectedElement?.id?.split("-")[0];
    }, [props.selectedElement]);

    React.useEffect(() => {
        if (dataSource?.device?.value) {
            SensorApis.getSensorsByDeviceId(dataSource?.device?.value)
                .then((response: AxiosResponse<Array<SensorModel>>) => {
                    if (response.data) {
                        const updatedSensors: Array<DropdownItem> = response.data.map((sensor: SensorModel) => ({ label: sensor?.name, value: sensor?.id }));
                        setSensors([...sensors, ...updatedSensors]);
                    }
                })
        } else {
            setSensors([{ label: 'Please select', value: null }]);
        }
    }, [dataSource?.device]);

    React.useEffect(() => {
        const element: FlowElement = props.elements?.find((el: FlowElement) => el.id === props.selectedElement?.id);
        const selectedSensor: DropdownItem = sensors?.find((sensor: DropdownItem) => sensor?.value === element?.data?.nodeControls?.rules?.sensor);
        const deviceSource: DropdownItem = DEVICEDATASOURCES?.find((source: DropdownItem) => source?.value === element?.data?.nodeControls?.rules?.deviceSource);
        const selectedDevice: DropdownItem = devices?.find((device: DropdownItem) => device?.value === element?.data?.nodeControls?.rules?.device);
        setDataSource({
            ...dataSource,
            title: element?.data?.nodeControls?.rules?.title,
            sensor: selectedSensor,
            deviceSource: deviceSource,
            device: selectedDevice,
            type: element?.data?.nodeControls?.rules?.type || dataSource?.type,
        })
    }, [props.selectedElement, props.elements, setDataSource]);

    React.useEffect(() => {
        const element: FlowElement = props.elements?.find((el: FlowElement) => el.id === props.selectedElement?.id);
        const selectedOperator: DropdownItem = operators?.find((operator: DropdownItem) => operator?.value === element?.data?.nodeControls?.rules?.operator);
        const selectedCadence: DropdownItem = timeRuleCadences?.find((cadence: DropdownItem) => cadence?.value === element?.data?.nodeControls?.rules?.cadence);

        setOperator({
            ...operatorObj,
            value: element?.data?.nodeControls?.rules?.operatorValue,
            operator: selectedOperator,
            cadence: selectedCadence
        });
    }, [props.selectedElement, props.elements, setOperator]);

    return (
        <div className="rule-properties-holder">
            <div className="row">
                <TextBoxGroup
                    name="title"
                    type="text"
                    className="col"
                    label="Title"
                    placeholder="Title"
                    value={dataSource?.title || ""}
                    onChange={props.handleRuleTitleValueChange}
                    disabled={props.loading}
                />
            </div>
            <fieldset className="properties-holder border my-2 p-2">
                <legend className="w-auto"><h6 className="custom-label"> Datasource Type </h6></legend>
                <div className="row">
                    <RadioGroup
                        list={DEVICEDATASOURCETYPE}
                        name="dataSourceType"
                        label=""
                        className="col"
                        value={dataSource.type}
                        onChange={props.handleDataSourceChange}
                        disableAll={props.loading}
                        condensed
                    />
                </div>
            </fieldset>

            { dataSource?.type === 'aggregateField' ?
                <fieldset className="aggregatefield-datasource-properties border my-2 p-2">
                    <legend className="w-auto"><h6 className="custom-label"> Aggregate field </h6></legend>

                </fieldset>
                :
                <fieldset className="device-datasource-properties border my-2 p-2">
                    <legend className="w-auto"><h6 className="custom-label"> Datasource Value </h6></legend>
                    <div className="row pt-2">
                        <Dropdown
                            label="Device"
                            name="device"
                            list={devices}
                            className="col"
                            disabled={props?.loading}
                            selectedValue={dataSource?.device}
                            error={null}
                            onChange={(value: DropdownItem) => props.handleRulesDropDownChange(value, "device")}
                        />
                    </div>
                    <div className="row">
                        <Dropdown
                            label="Device source"
                            name="deviceSource"
                            className="col"
                            list={DEVICEDATASOURCES}
                            disabled={props?.loading}
                            selectedValue={dataSource?.deviceSource}
                            error={null}
                            onChange={(value: DropdownItem) => props.handleRulesDropDownChange(value, "deviceSource")}
                        />
                    </div>
                    {dataSource?.deviceSource?.value === 'sensor' &&
                        <div className="row">
                            <Dropdown
                                label="Sensors"
                                name="sensor"
                                list={sensors}
                                className="col"
                                disabled={props?.loading}
                                selectedValue={dataSource?.sensor}
                                error={null}
                                onChange={(value: DropdownItem) => props.handleRulesDropDownChange(value, "sensor")}
                            />
                        </div>
                    }
                </fieldset>
            }

            <fieldset className="rule-operators border my-2 p-2">
                <legend className="w-auto"><h6 className="custom-label"> Datasource Value </h6></legend>
                <div className="row pt-2">
                    <Dropdown
                        label="Operator"
                        name="operator"
                        list={operators}
                        className="col"
                        disabled={props?.loading}
                        selectedValue={operatorObj?.operator}
                        error={null}
                        onChange={(value: DropdownItem) => props.handleRulesDropDownChange(value, "operator")}
                    />
                </div>
                <div className="row">
                    <TextBoxGroup
                        name="operatorValue"
                        type="text"
                        className="col"
                        label="Value"
                        placeholder="Operator value"
                        value={operatorObj?.value || ""}
                        onChange={props.handleRuleOperatorValueChange}
                        disabled={props.loading}
                    />
                </div>

                {firstWord === "time" && <div className="row">
                    <Dropdown
                        label="Cadence"
                        name="cadence"
                        list={timeRuleCadences}
                        className="col"
                        disabled={props?.loading}
                        selectedValue={operatorObj?.cadence}
                        error={null}
                        onChange={(value: DropdownItem) => props.handleRulesDropDownChange(value, "cadence")}
                    />
                </div>
                }

            </fieldset>

        </div>
    )
};

export default RulesForm;