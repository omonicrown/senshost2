import React from "react";
import { Dropdown, DropdownItem } from "@sebgroup/react-components/dist/Dropdown/Dropdown";
import { TextBoxGroup } from "@sebgroup/react-components/dist/TextBoxGroup";
import { ActuatorModel, DeviceModel } from "../../interfaces/models";
import { ActuatorError } from "../devices/add-edit-device/sections/ActuatorForm";
import { ACTUATORS } from "../../constants";
import { Button } from "@sebgroup/react-components/dist/Button";
import { ActuatorApis } from "../../apis/actuatorApis";
import { AxiosResponse } from "axios";
import { Loader } from "@sebgroup/react-components/dist/Loader";

interface ActuatorFormAddAndEditFormProps {
    device: DeviceModel;
    handleActuatorSubmitChange: (actuator: ActuatorModel) => void;
    onDismiss?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    actuator?: ActuatorModel;
    viewType: "detail" | "accordion";
}

const ActuatorFormAddAndEditForm: React.FC<ActuatorFormAddAndEditFormProps> = (props: ActuatorFormAddAndEditFormProps): React.ReactElement<void> => {
    const [actuatorError, setActuatorError] = React.useState<ActuatorError>(null); //
    const [loading, setLoading] = React.useState<boolean>(false);

    const [selectedActuatorType, setSelectedActuatorType] = React.useState<DropdownItem>(null);

    const actuatorTypes: Array<DropdownItem> = React.useMemo(() => ACTUATORS, []);


    const [actuator, setActuator] = React.useState<ActuatorModel>({
        name: "",
        type: null,
        propertise: { ON: "", OFF: "", message: "", value: "" }
    } as ActuatorModel);


    const handleAddSubmit = React.useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        let error: ActuatorError = null;
        if (!actuator?.name) {
            error = { ...error, name: "Actuator name cannot be empty" };
        }

        if (!actuator?.type === null) {
            error = { ...error, type: "Actuator type cannot be empty" };
        } else {
            if (actuator?.type === 0) {
                if (!actuator?.propertise?.ON) {
                    error = { ...error, ON: "On Value cannot be empty" };
                }

                if (!actuator?.propertise?.OFF) {
                    error = { ...error, OFF: "OFF value cannot be empty" };
                }
            } else if (actuator?.type === 1) {
                if (!actuator?.propertise?.value) {
                    error = { ...error, value: "value cannot be empty" };
                }
            } else {
                if (!actuator?.propertise?.message) {
                    error = { ...error, message: "message cannot be empty" };
                }
            }
        }

        if (!error) {
            if (props.viewType === "detail") {
                setLoading(true);
                if (actuator?.id) {
                    ActuatorApis.updateActuatorById(actuator.id, { ...actuator, propertise: JSON.stringify(actuator?.propertise) as any })
                        .then((response: AxiosResponse<ActuatorModel>) => {
                            if (response?.data) {
                                props?.handleActuatorSubmitChange(response?.data);
                            }

                            setActuator({
                                name: "",
                                propertise: { ON: "", OFF: "", message: "", value: "" }
                            } as ActuatorModel);
                        }).finally(() => {
                            setLoading(false);
                        });
                } else {
                    ActuatorApis.createActuator({ ...actuator, deviceId: props.device?.id, propertise: JSON.stringify(actuator?.propertise) as any })
                        .then((response: AxiosResponse<ActuatorModel>) => {
                            if (response?.data) {
                                props?.handleActuatorSubmitChange(response?.data);
                            }

                            setActuator({
                                name: "",
                                propertise: { ON: "", OFF: "", message: "", value: "" }
                            } as ActuatorModel);
                        }).finally(() => {
                            setLoading(false);
                        });
                }
            } else {
                props?.handleActuatorSubmitChange(actuator);
                setActuator({
                    name: "",
                    type: null,
                    propertise: { ON: "", OFF: "", message: "", value: "" }
                } as ActuatorModel);
            }

        }
        setActuatorError(error);
        e.preventDefault();
    }, [actuator, props]);

    // events --------------------------------------------------------------------------------
    const handleActuatorTypeChange = React.useCallback((e: DropdownItem) => {
        setSelectedActuatorType(e);
        setActuator({ ...actuator, type: e.value });
    }, [selectedActuatorType, actuator]);

    const handleActuatorTextChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setActuator({ ...actuator, [e.target.name]: e.target.value });
    }, [actuator, setActuator]);

    const handleActuatorPropertyChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setActuator({
            ...actuator, propertise: {
                ...actuator?.propertise as any,
                [e.target.name]: e.target.value
            }
        });
    }, [actuator, setActuator]);


    // lifecycle ---------------------------------------------------------------------------

    React.useEffect(() => {
        if (actuator) {
            setActuator({
                ...actuator,
                propertise: {
                    ...actuator.propertise,
                    message: "",
                    value: "",
                    ON: "",
                    OFF: ""
                }
            });
        }
    }, [selectedActuatorType]);

    React.useEffect(() => {
        if (props.actuator?.id) {
            setActuator(props.actuator);
        }
        const selectedActuatorType: DropdownItem = ACTUATORS.find((actuator: DropdownItem) => actuator.value === props.actuator?.type);
        setSelectedActuatorType(selectedActuatorType);
    }, [props.actuator]);

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-12 col-sm-6">
                    <TextBoxGroup
                        name="name"
                        label="Actuator name"
                        placeholder="Name"
                        value={actuator?.name}
                        error={actuatorError?.name}
                        onChange={handleActuatorTextChange}
                    />
                </div>
                <div className="col-12 col-sm-6">
                    <Dropdown
                        label="Actuator type"
                        list={actuatorTypes}
                        selectedValue={selectedActuatorType}
                        error={actuatorError?.type}
                        onChange={handleActuatorTypeChange}
                    />
                </div>

                {actuator?.type === 0 &&
                    <React.Fragment>
                        <div className="col-12 col-sm-6">
                            <TextBoxGroup
                                name="ON"
                                label="On Value"
                                placeholder="ON value"
                                error={actuatorError?.ON}
                                value={actuator?.propertise?.ON}
                                onChange={handleActuatorPropertyChange}
                            />
                        </div>

                        <div className="col-12 col-sm-6">
                            <TextBoxGroup
                                name="OFF"
                                label="Off Value"
                                placeholder="Off value"
                                error={actuatorError?.OFF}
                                value={actuator?.propertise?.OFF}
                                onChange={handleActuatorPropertyChange}
                            />
                        </div>
                    </React.Fragment>
                }
                {actuator?.type === 1 &&
                    <div className="col-12 col-sm-6">
                        <TextBoxGroup
                            name="value"
                            label="value"
                            placeholder="value"
                            error={actuatorError?.value}
                            value={actuator?.propertise?.value}
                            onChange={handleActuatorPropertyChange}
                        />
                    </div>
                }

                {actuator?.type === 2 &&
                    <div className="col-12 col-sm-6">
                        <TextBoxGroup
                            name="message"
                            label="message"
                            placeholder="message"
                            value={actuator.propertise?.message}
                            onChange={handleActuatorPropertyChange}
                        />
                    </div>
                }
            </div>

            <div className="row">
                {props.actuator &&
                    <div className="col text-left">
                        <Button disabled={loading} label="Cancel" type="button" size="sm" theme="outline-primary" onClick={props.onDismiss} />
                    </div>
                }
                <div className="col text-right">
                    <Button label="Add" type="button" size="sm" theme="primary" onClick={handleAddSubmit}>
                        <Loader toggle={loading} />
                    </Button>
                </div>
            </div>
        </React.Fragment>
    )
};

export default ActuatorFormAddAndEditForm;