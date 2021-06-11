import { Button } from "@sebgroup/react-components/dist/Button";
import { Dropdown, DropdownItem } from "@sebgroup/react-components/dist/Dropdown/Dropdown";
import { Loader } from "@sebgroup/react-components/dist/Loader";
import { TextBoxGroup } from "@sebgroup/react-components/dist/TextBoxGroup";
import { AxiosResponse } from "axios";
import React from "react";
import { SensorApis } from "../../apis/sensorApis";
import { SENSORSTYPES } from "../../constants";
import { DeviceModel, SensorModel } from "../../interfaces/models";

interface SensorFormAddAndEditFormProps {
    handleSensorSubmitChange: (sensors: Array<SensorModel>) => void;
    device: DeviceModel;
    viewType: "detail" | "accordion";
    sensor?: SensorModel;
    onDismiss?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const SensorFormAddAndEditForm: React.FC<SensorFormAddAndEditFormProps> = (props: SensorFormAddAndEditFormProps): React.ReactElement<void> => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [sensor, setSensor] = React.useState<{ selectedSensor: DropdownItem, name: string, id: string }>({ selectedSensor: null, name: "", id: null });
    const [sensorError, setSensorError] = React.useState<{ type: string, name: string }>({ type: "", name: "" });

    const sensorTypes = React.useMemo(() => SENSORSTYPES, []);

    const handleSensorNameChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSensor({ ...sensor, name: e.target.value });
    }, [sensor]);

    const handleAddSensor = React.useCallback((e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        let error: { name: string, type: string } = null;
        if (!sensor?.name || !sensor?.selectedSensor) {
            if (!sensor?.name) {
                error = { ...error, name: "Sensor name cannot be empty" };
            }
            if (!sensor?.selectedSensor) {
                error = { ...error, type: "Please select type" };
            }
        } else {
            if (props.viewType === "detail") {
                setLoading(true);
                if (props.sensor?.id) {
                    // update here
                    SensorApis.updateSensorsById(props.sensor?.id, {
                        name: sensor.name,
                        dataType: sensor.selectedSensor.value,
                        deviceId: props.device?.id,
                        id: props.sensor?.id
                    }).then((response: AxiosResponse) => {
                        if (response?.data) {
                            const updatedSensors: Array<SensorModel> = props.device.fields.map((sens: SensorModel) => {
                                if (sens?.id === response.data?.id) {
                                    return response?.data;
                                }

                                return sens;
                            });
                            props?.handleSensorSubmitChange(updatedSensors);
                        }
                    }).finally(() => {
                        setLoading(false);
                    });
                } else {
                    // create
                    SensorApis.createSensor({
                        name: sensor.name,
                        dataType: sensor.selectedSensor.value,
                        deviceId: props.device?.id
                    }).then((response: AxiosResponse) => {
                        if (response?.data) {
                            const updatedSensors: Array<SensorModel> = [...props.device.fields, response.data];
                            props?.handleSensorSubmitChange(updatedSensors);
                        }
                    }).finally(() => {
                        setLoading(false);
                    });
                }
            } else {
                const updatedSensors: Array<SensorModel> = [...props.device.fields, { name: sensor.name, dataType: sensor?.selectedSensor?.value } as SensorModel];;
                setSensor({ selectedSensor: null, name: "", id: null });

                props?.handleSensorSubmitChange(updatedSensors);
            }
        }
        setSensorError(error);
        e.preventDefault();
    }, [sensor, props]);

    const handleDeviceTypeChange = React.useCallback((e: DropdownItem) => {
        setSensor({ ...sensor, selectedSensor: e });
    }, [sensor]);

    React.useEffect(() => {
        if (props.sensor?.id) {
            const selectedSensor: DropdownItem = sensorTypes.find((sen: DropdownItem) => sen.value === props.sensor?.dataType);
            setSensor({ name: props.sensor?.name, selectedSensor, id: props.sensor?.id });
        } else {
            setSensor({ name: "", selectedSensor: null, id: null });
        }
    }, [props.sensor, sensorTypes]);

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-12 col-sm-6">
                    <Dropdown
                        label="Sensor data type"
                        list={sensorTypes}
                        selectedValue={sensor?.selectedSensor}
                        onChange={handleDeviceTypeChange}
                        error={sensorError?.type}
                    />
                </div>
                <div className="col-12 col-sm-6">
                    <TextBoxGroup
                        name="name"
                        label="Sensor name"
                        placeholder="Name"
                        value={sensor?.name}
                        error={sensorError?.name}
                        onChange={handleSensorNameChange}
                    />
                </div>
            </div>
            <div className="row">
                {props.viewType === "detail" &&
                    <div className="col text-left">
                        <Button disabled={loading} label="Cancel" type="button" size="sm" theme="outline-primary" onClick={props.onDismiss} />
                    </div>
                }
                <div className="col text-right">
                    <Button label="Save" id="btnSaveSensor" size="sm" theme="primary" onClick={handleAddSensor}>
                        <Loader toggle={loading} />
                    </Button>
                </div>
            </div>
        </React.Fragment>
    );


};

export default SensorFormAddAndEditForm;