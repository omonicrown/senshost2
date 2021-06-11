import React from "react";
import { History } from "history";
import { ActuatorModel, DeviceModel, SensorModel } from "../../interfaces/models";
import { AxiosResponse } from "axios";

import SummaryForm from "../devices/add-edit-device/sections/SummaryForm";
import EditDeviceModal from "./modals/EditDeviceModal";

import { DeviceApis } from "../../apis/deviceApis";
import { match, useHistory, useRouteMatch } from "react-router";
import { Button } from "@sebgroup/react-components/dist/Button";
import { initialState } from "../../constants";
import { Modal, ModalProps } from "@sebgroup/react-components/dist/Modal/Modal";
import PortalComponent from "../shared/Portal";
import { Loader } from "@sebgroup/react-components/dist/Loader";
import { NotificationProps } from "@sebgroup/react-components/dist/notification/Notification";
import { useDispatch, useSelector } from "react-redux";
import { AuthState, States } from "../../interfaces/states";
import { Dispatch } from "redux";
import { toggleNotification } from "../../actions";
import { ActionLinkItem, TableRow } from "@sebgroup/react-components/dist/Table/Table";
import ActuatorFormAddAndEditForm from "../shared/ActuatorAddAndEditForm";
import { ActuatorApis } from "../../apis/actuatorApis";
import SensorFormAddAndEditForm from "../shared/SensorAddAndEditForm";
import { SensorApis } from "../../apis/sensorApis";

export interface ViewDeviceProps {
}

interface ActuatorRow {
    accountId: string;
    name: string;
    value: string;
    message: string;
    type: string;
    ON: string;
    OFF: string;
}

const ViewDevice: React.FunctionComponent<ViewDeviceProps> = (props: ViewDeviceProps) => {
    const [device, setDevice] = React.useState<DeviceModel>({} as DeviceModel);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [actuator, setActuator] = React.useState<ActuatorModel>({} as ActuatorModel);
    const [sensor, setSensor] = React.useState<SensorModel>({} as SensorModel);

    const [modalEditActuatorModalProps, setModalEditActuatorProps] = React.useState<ModalProps>({ ...initialState });
    const [modalEditSensorModalProps, setModalEditSensorProps] = React.useState<ModalProps>({ ...initialState });

    const [modalDeleteSensorProps, setModalDeleteSensorProps] = React.useState<ModalProps>({ ...initialState });

    const [modalDeleteActuatorProps, setModalDeleteActuatorProps] = React.useState<ModalProps>({ ...initialState });

    const [modalEditDeviceModal, setModalEditDeviceModal] = React.useState<ModalProps>({ ...initialState });
    const [modalDeleteDeviceProps, setModalDeleteDeviceProps] = React.useState<ModalProps>({ ...initialState });

    const history: History = useHistory();

    const match: match<{ deviceId: string }> = useRouteMatch();

    // immutable props --------------------------------------------------------------------------------

    const sensorsActionLinks: Array<ActionLinkItem> = React.useMemo(() => [
        {
            label: "Edit",
            onClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, selectedRow: TableRow) => {
                setSensor({
                    name: selectedRow["name"],
                    id: selectedRow["id"],
                    dataType: selectedRow["dataType"],
                    deviceId: selectedRow["deviceId"]
                });

                setModalEditSensorProps({ ...modalEditActuatorModalProps, toggle: true });
            }
        },
        {
            label: "Delete", onClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, selectedRow: TableRow) => {
                setSensor({
                    name: selectedRow["name"],
                    id: selectedRow["id"],
                    dataType: selectedRow["dataType"],
                    deviceId: selectedRow["deviceId"]
                });

                setModalDeleteSensorProps({ ...modalDeleteActuatorProps, toggle: true });
            }
        },
    ], [sensor, modalDeleteSensorProps, modalEditSensorModalProps, modalDeleteActuatorProps, modalEditActuatorModalProps]);

    const actuatorsActionLinks: Array<ActionLinkItem> = React.useMemo(() => [
        {
            label: "Edit",
            onClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, selectedRow: TableRow) => {
                setActuator({
                    accountId: selectedRow['accountId'],
                    name: selectedRow["name"],
                    propertise: { ON: selectedRow["ON"], OFF: selectedRow["OFF"], message: selectedRow["message"], value: selectedRow["value"] },
                    deviceId: selectedRow["deviceId"],
                    type: selectedRow["type"],
                    id: selectedRow["id"],
                });

                setModalEditActuatorProps({ ...modalEditActuatorModalProps, toggle: true });
            }
        },
        {
            label: "Delete", onClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, selectedRow: TableRow) => {
                setActuator({
                    accountId: selectedRow['accountId'],
                    name: selectedRow["name"],
                    propertise: { ON: selectedRow["ON"], OFF: selectedRow["OFF"], message: selectedRow["message"], value: selectedRow["value"] },
                    deviceId: selectedRow["deviceId"],
                    type: selectedRow["type"],
                    id: selectedRow["id"],
                    creationDate: selectedRow["creationDate"]
                });

                setModalDeleteActuatorProps({ ...modalDeleteActuatorProps, toggle: true });
            }
        },
    ], [actuator, modalDeleteActuatorProps, modalEditActuatorModalProps]);


    // actions---------------------------------------------------------------------------------
    const authState: AuthState = useSelector((states: States) => states?.auth);
    const dispatch: Dispatch = useDispatch();

    // event-----------------------------------------------------------------------------------

    const handleActuatorSubmitChange = React.useCallback((updatedActuator: ActuatorModel) => {
        let updatedActuators: Array<ActuatorModel> = [];
        if (actuator?.id) {
            updatedActuators = device.actuators?.map((newActuator: ActuatorModel) => {
                if (newActuator.id === updatedActuator.id) {
                    return updatedActuator;
                }
                return newActuator;
            });
        } else {
            updatedActuators = [...device.actuators, updatedActuator];
        }
        setDevice({ ...device, actuators: updatedActuators });
        setModalEditActuatorProps({ ...modalEditActuatorModalProps, toggle: false });
    }, [device, modalEditActuatorModalProps]);

    const handleSensorSubmitChange = React.useCallback((sensors: Array<SensorModel>) => {
        setDevice({ ...device, fields: sensors });
        setModalEditSensorProps({ ...modalEditSensorModalProps, toggle: false });
    }, [device, modalEditSensorModalProps]);

    const onUpdateDevice = React.useCallback((receivedDevice: DeviceModel) => {
        const notification: NotificationProps = {
            theme: "success",
            title: "device update",
            message: `Device updated successfully`,
            toggle: true,
            onDismiss: () => { }
        };

        dispatch(toggleNotification(notification));
        setDevice({ ...device, name: receivedDevice?.name, type: receivedDevice?.type });
        setModalEditDeviceModal({ ...modalEditDeviceModal, toggle: false });
    }, [modalEditDeviceModal, device, toggleNotification]);

    const onEditDevice = React.useCallback((e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setModalEditDeviceModal({ ...modalEditDeviceModal, toggle: true });
    }, [modalEditDeviceModal]);

    const onDismissModal = React.useCallback((e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setModalEditDeviceModal({ ...modalEditDeviceModal, toggle: false });
        setModalDeleteDeviceProps({ ...modalDeleteDeviceProps, toggle: false });
        setModalEditActuatorProps({ ...modalEditActuatorModalProps, toggle: false });
        setModalDeleteActuatorProps({ ...modalDeleteActuatorProps, toggle: false });
        setModalEditSensorProps({ ...modalEditSensorModalProps, toggle: false });
        setModalDeleteSensorProps({ ...modalDeleteSensorProps, toggle: false });
    }, [modalEditDeviceModal, modalDeleteDeviceProps, modalDeleteActuatorProps, modalEditActuatorModalProps, modalDeleteSensorProps, modalEditSensorModalProps]);

    const onDeleteDevice = React.useCallback((e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setModalDeleteDeviceProps({ ...modalDeleteDeviceProps, toggle: true })
    }, [modalDeleteDeviceProps]);

    const onAddActuatorClick = React.useCallback((e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setActuator({} as ActuatorModel);

        setModalEditActuatorProps({ ...modalEditActuatorModalProps, toggle: true });
    }, [modalEditActuatorModalProps]);

    const onAddSensorClick = React.useCallback((e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setSensor({} as SensorModel);

        setModalEditSensorProps({ ...modalEditSensorModalProps, toggle: true });
    }, [modalEditSensorModalProps])

    // apis


    const handleDeleteSensor = React.useCallback((e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (sensor) {
            setLoading(true);
            SensorApis.deleteSensorById(sensor?.id)
                .then(() => {
                    const notification: NotificationProps = {
                        theme: "success",
                        title: "Sensor deleted",
                        message: `Sensor deleted successfully`,
                        toggle: true,
                        onDismiss: () => { }
                    };

                    const indexOfSensorTobeDeleted: number = device.fields?.findIndex((sen: SensorModel) => sen.id === sensor.id);

                    const updatedSensors: Array<SensorModel> = [
                        ...device.fields?.slice(0, indexOfSensorTobeDeleted),
                        ...device.fields?.slice(indexOfSensorTobeDeleted + 1)
                    ];

                    setDevice({ ...device, fields: updatedSensors });

                    setSensor({} as SensorModel);
                    dispatch(toggleNotification(notification));
                }).catch(() => {
                    setSensor({} as SensorModel);
                })
                .finally(() => {
                    setLoading(false);
                    setModalDeleteSensorProps({ ...modalDeleteSensorProps, toggle: false });
                });
        }
        e.preventDefault();
    }, [sensor, modalDeleteSensorProps]);

    const handleDeleteActuator = React.useCallback((e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (actuator) {
            setLoading(true);
            ActuatorApis.deleteActuatorById(actuator?.id)
                .then(() => {
                    const notification: NotificationProps = {
                        theme: "success",
                        title: "Actuator deleted",
                        message: `Actuator deleted successfully`,
                        toggle: true,
                        onDismiss: () => { }
                    };

                    const indexOfActautorTobeDeleted: number = device.actuators?.findIndex((acc: ActuatorModel) => acc.id === actuator.id);

                    const updatedActuators: Array<ActuatorModel> = [
                        ...device.actuators?.slice(0, indexOfActautorTobeDeleted),
                        ...device.actuators?.slice(indexOfActautorTobeDeleted + 1)
                    ];

                    setDevice({ ...device, actuators: updatedActuators });

                    setActuator({} as ActuatorModel);
                    dispatch(toggleNotification(notification));
                }).catch(() => {
                    setActuator({} as ActuatorModel);
                })
                .finally(() => {
                    setLoading(false);
                    setModalDeleteActuatorProps({ ...modalDeleteDeviceProps, toggle: false });
                });
        }
        e.preventDefault();
    }, [actuator, modalDeleteDeviceProps]);

    const handleDeleteDevice = React.useCallback((e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setLoading(true);
        DeviceApis.deleteDeviceById(device?.id)
            .then(() => {
                const notification: NotificationProps = {
                    theme: "success",
                    title: "device deleted",
                    message: `Device deleted successfully`,
                    toggle: true,
                    onDismiss: () => { }
                };

                dispatch(toggleNotification(notification));

                history.goBack();
            })
            .finally(() => {
                setLoading(false);
                setModalDeleteDeviceProps({ ...modalDeleteDeviceProps, toggle: false });
            });

        e.preventDefault();

    }, [device, modalDeleteDeviceProps, setLoading]);

    // effects

    React.useEffect(() => {
        const deviceId: string = match?.params.deviceId;
        DeviceApis.getDeviceById(deviceId)
            .then((response: AxiosResponse<DeviceModel>) => {
                if (response?.data) {
                    setDevice(response?.data);
                }
            })

        return () => null;
    }, [])

    return (
        <div className="view-device-container">
            <div className="control-holder  d-flex">
                <Button id="btnBack" name="btnBack" label="Back" theme="outline-primary" size="sm" onClick={() => { history?.goBack(); }} />
                <div className="edit-and-delete-controls">
                    <Button id="btnDelete" name="btnDelete" label="Delete" theme="danger" size="sm" onClick={onDeleteDevice} />
                </div>
            </div>
            <SummaryForm
                device={device}
                viewType="detail"
                actuatorsActionLinks={actuatorsActionLinks}
                sensorsActionLinks={sensorsActionLinks}
                onAddSensorClick={onAddSensorClick}
                onAddActuatorClick={onAddActuatorClick}
                onEditDeviceClick={onEditDevice}
            />

            <PortalComponent>
                <Modal
                    {...modalDeleteDeviceProps}
                    onDismiss={onDismissModal}
                    header={modalDeleteDeviceProps?.toggle ? <h4>Delete {device?.name} ?</h4> : null}
                    body={
                        modalDeleteDeviceProps?.toggle ?
                            <p>Are you sure you want to delete this ?</p>
                            : null
                    }
                    footer={
                        modalDeleteDeviceProps?.toggle ?
                            <div className="controls-holder d-flex flex-sm-row flex-column">
                                <Button label="Cancel" disabled={loading} theme="outline-primary" onClick={onDismissModal} />
                                <Button label="Delete" theme="danger" onClick={handleDeleteDevice}>
                                    {<Loader toggle={loading} size='sm' />}
                                </Button>
                            </div>
                            : null
                    }
                />

                <Modal
                    {...modalEditDeviceModal}
                    size="modal-lg"
                    onDismiss={onDismissModal}
                    header={modalEditDeviceModal?.toggle ? <h3>Edit Device</h3> : null}
                    body={
                        modalEditDeviceModal?.toggle ?
                            <EditDeviceModal
                                handleSubmitUpdateDevice={onUpdateDevice}
                                device={device}
                                onDismiss={onDismissModal}
                            />
                            : null
                    }
                />

                <Modal
                    {...modalDeleteActuatorProps}
                    onDismiss={onDismissModal}
                    header={modalDeleteActuatorProps?.toggle ? <h4>Delete {device?.name} ?</h4> : null}
                    body={
                        modalDeleteActuatorProps?.toggle ?
                            <p>Are you sure you want to delete this ?</p>
                            : null
                    }
                    footer={
                        modalDeleteActuatorProps?.toggle ?
                            <div className="controls-holder d-flex flex-sm-row flex-column">
                                <Button label="Cancel" disabled={loading} theme="outline-primary" onClick={onDismissModal} />
                                <Button label="Delete" theme="danger" onClick={handleDeleteActuator}>
                                    {<Loader toggle={loading} size='sm' />}
                                </Button>
                            </div>
                            : null
                    }
                />

                <Modal
                    {...modalDeleteSensorProps}
                    onDismiss={onDismissModal}
                    header={modalDeleteSensorProps?.toggle ? <h4>Delete {sensor?.name} ?</h4> : null}
                    body={
                        modalDeleteSensorProps?.toggle ?
                            <p>Are you sure you want to delete this ?</p>
                            : null
                    }
                    footer={
                        modalDeleteSensorProps?.toggle ?
                            <div className="controls-holder d-flex flex-sm-row flex-column">
                                <Button label="Cancel" disabled={loading} theme="outline-primary" onClick={onDismissModal} />
                                <Button label="Delete" theme="danger" onClick={handleDeleteSensor}>
                                    {<Loader toggle={loading} size='sm' />}
                                </Button>
                            </div>
                            : null
                    }
                />

                <Modal
                    {...modalEditSensorModalProps}
                    size="modal-lg"
                    onDismiss={onDismissModal}
                    header={modalEditSensorModalProps?.toggle ? <h3>{sensor.id
                        ? "Edit sensor" : "Add sensor"}</h3> : null}
                    body={
                        modalEditSensorModalProps?.toggle ?
                            <SensorFormAddAndEditForm
                                device={device}
                                sensor={sensor}
                                handleSensorSubmitChange={handleSensorSubmitChange}
                                viewType="detail"
                                onDismiss={onDismissModal}
                            />
                            : null
                    }
                />

                <Modal
                    {...modalEditActuatorModalProps}
                    size="modal-lg"
                    onDismiss={onDismissModal}
                    header={modalEditActuatorModalProps?.toggle ? <h3>{actuator.id
                        ? "Edit actuator" : "Add actuator"}</h3> : null}
                    body={
                        modalEditActuatorModalProps?.toggle ?
                            <ActuatorFormAddAndEditForm
                                device={device}
                                actuator={actuator}
                                viewType="detail"
                                handleActuatorSubmitChange={handleActuatorSubmitChange}
                                onDismiss={onDismissModal}
                            />
                            : null
                    }
                />
            </PortalComponent>
        </div>
    )

};

export default ViewDevice;