import React from "react";

import { StepTracker } from "@sebgroup/react-components/dist/StepTracker";
import { DropdownItem } from "@sebgroup/react-components/dist/Dropdown/Dropdown";

import { DeviceModel, SensorModel, ActuatorModel } from "../../../interfaces/models";
import { Button } from "@sebgroup/react-components/dist/Button";
import { Icon } from "@sebgroup/react-components/dist/Icon";
import { SvgElement, icontypesEnum } from "../../../utils/svgElement";
import DeviceForm from "./sections/DeviceForm";
import SensorsForm from "./sections/SensorsForm";
import ActuatorForm from "./sections/ActuatorForm";
import SummaryForm from "./sections/SummaryForm";

import { useSelector, useDispatch } from "react-redux";
import { States } from "../../../interfaces/states";
import { ACTUATORS, DEVICETYPES } from "../../../constants";
import { Dispatch } from "redux";
import { Loader } from "@sebgroup/react-components/dist/Loader";

interface AddAndEditDeviceProps {
    onSave: (e: React.FormEvent<HTMLFormElement>, device: DeviceModel) => void;
    onCancel: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    toggle: boolean;
    loading: boolean;
    device?: DeviceModel;
}

const AddAndEditDevice: React.FunctionComponent<AddAndEditDeviceProps> = (props: AddAndEditDeviceProps) => {
    const [stepTracker, setStepTracker] = React.useState<number>(0);
    const stepList: Array<string> = React.useMemo(() => ["Device", "Sensor", "Actuator", "Summary"], []);

    const deviceTypes: Array<DropdownItem> = React.useMemo(() => DEVICETYPES, []);

    // actions
    const dispatch: Dispatch = useDispatch();

    // account or profile ----------------------------
    const authState = useSelector((states: States) => states.auth);

    const [device, setDevice] = React.useState<DeviceModel>({
        name: "",
        actuators: [],
        accountId: null,
        groupId: null,
        fields: []
    } as DeviceModel);

    // actuator props---------------------------------------------------
    const [selectedActuatorType, setSelectedActuatorType] = React.useState<DropdownItem>(ACTUATORS[0]);

    // device props ----------------------------------
    const [selectedDeviceType, setSelectedDeviceType] = React.useState<DropdownItem>({} as DropdownItem);
    const handleDeviceTypeChange = React.useCallback((e: DropdownItem) => {
        setSelectedDeviceType(e);
    }, [setSelectedDeviceType]);

    const handleDeviceNameChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setDevice({ ...device, [e.target.name]: e.target.value });
    }, [device, setDevice]);

    const onCancel = React.useCallback((e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setDevice({ name: "" } as DeviceModel);
        props.onCancel(e);
    }, [device, setDevice]);

    const handleSubmit = React.useCallback((e: React.FormEvent<HTMLFormElement>) => {
        props?.onSave(e, device);

        e.preventDefault();
    }, [device, authState.auth]);

    const handleSensorSubmitChange = React.useCallback((values: Array<SensorModel>) => {
        setDevice({ ...device, fields: values });
    }, [device]);

    const handleActuatorSubmitChange = React.useCallback((values: Array<ActuatorModel>) => {
        setDevice({ ...device, actuators: values });
    }, [device]);


    React.useEffect(() => {
        setDevice({ ...device, type: selectedDeviceType?.value });
    }, [selectedDeviceType]);

    React.useEffect(() => {
        setDevice({
            name: "",
            actuators: [],
            accountId: null,
            groupId: null,
            fields: []
        } as DeviceModel);
    }, [props?.toggle]);

    React.useEffect(() => {
        if (props?.device) {
            setDevice(props.device);

            const deviceType: DropdownItem = deviceTypes?.find((item: DropdownItem) => item?.value === props?.device?.type);
            setSelectedDeviceType(deviceType);
        }
    }, [props.device, deviceTypes])

    return (
        <div className="add-and-edit-device">
            <StepTracker step={stepTracker} list={stepList} onClick={(index: number) => setStepTracker(index)} />
            <form className='add-and-edit-form' onSubmit={handleSubmit}>
                {stepTracker === 0 &&
                    <DeviceForm
                        selectedType={selectedDeviceType}
                        handleDeviceTypeChange={handleDeviceTypeChange}
                        handleDeviceNameChange={handleDeviceNameChange}
                        device={device}
                    />
                }
                {stepTracker === 1 &&
                    <SensorsForm
                        device={device}
                        handleSensorSubmitChange={handleSensorSubmitChange}
                    />
                }
                {stepTracker === 2 &&
                    <ActuatorForm
                        device={device}
                        selectedActuatorType={selectedActuatorType}
                        handleActuatorSubmitChange={handleActuatorSubmitChange}
                    />
                }
                {stepTracker === 3 &&
                    <SummaryForm device={device} viewType="accordion" />
                }
                <div className="row controls-holder">
                    <div className="col-12 col-sm-6">
                        <Button label="Cancel" size="sm" theme="outline-primary" onClick={onCancel} />
                    </div>
                    <div className="col-12 col-sm-6">
                        <div className="d-flex justify-content-end next-and-previous">
                            {stepTracker > 0 && <Button label="" size="sm" theme="outline-primary" title="Previous" onClick={() => setStepTracker(stepTracker - 1)}>
                                <Icon src={<SvgElement type={icontypesEnum.PREVIOUS} />} />
                            </Button>}
                            {stepTracker < 3 &&
                                <Button label="" size="sm" theme="primary" title="Next" onClick={() => setStepTracker(stepTracker + 1)}>
                                    <Icon src={<SvgElement type={icontypesEnum.NEXT} />} />
                                </Button>
                            }

                            {stepTracker === 3 &&
                                <Button label="Save" type="submit" size="sm" theme="primary" title="Save" onClick={null}>
                                    <Loader toggle={props.loading} />
                                </Button>
                            }
                        </div>
                    </div>
                </div>
            </form>
        </div>

    );
};

export default AddAndEditDevice;