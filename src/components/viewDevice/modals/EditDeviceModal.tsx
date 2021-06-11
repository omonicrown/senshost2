import { Button } from "@sebgroup/react-components/dist/Button";
import { DropdownItem } from "@sebgroup/react-components/dist/Dropdown/Dropdown";
import { Loader } from "@sebgroup/react-components/dist/Loader";
import { AxiosResponse } from "axios";
import React from "react";
import { DeviceApis } from "../../../apis/deviceApis";
import { DEVICETYPES } from "../../../constants";
import { DeviceModel } from "../../../interfaces/models";
import DeviceForm from "../../devices/add-edit-device/sections/DeviceForm";

export interface DeviceError {
    name?: string;
    type: string;
}

interface EditDeviceModalProps {
    device: DeviceModel;
    handleSubmitUpdateDevice: (device: DeviceModel) => void;
    onDismiss: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const EditDeviceModal: React.FC<EditDeviceModalProps> = (props: EditDeviceModalProps): React.ReactElement<void> => {
    const [device, setDevice] = React.useState<DeviceModel>({} as DeviceModel);
    const [deviceErrors, setDeviceErrors] = React.useState<DeviceError>({} as DeviceError);

    const [loading, setLoading] = React.useState<boolean>(false);

    const [selectedDeviceType, setSelectedDeviceType] = React.useState<DropdownItem>({} as DropdownItem);

    const handleDeviceNameChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setDevice({ ...device, [e.target.name]: e.target.value });
    }, [device, setDevice]);

    const handleDeviceTypeChange = React.useCallback((e: DropdownItem) => {
        setSelectedDeviceType(e);
        setDevice({ ...device, type: e?.value });
    }, [setSelectedDeviceType, device]);

    const handleSubmitDevice = React.useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();

        let errors: DeviceError = null;
        if (!device?.name || Number(device?.type < 0)) {
            if (!device?.name) {
                errors = { ...errors, name: "Name is required" };
            }
            if (Number(device?.type) < 0) {
                errors = { ...errors, type: "Please select device type" };
            }
        } else {
            setLoading(true);
            DeviceApis.updateDevice(device).then((response: AxiosResponse<DeviceModel>) => {
                if (response?.data) {
                    props.handleSubmitUpdateDevice(device);
                }
            }).finally(() => {
                setLoading(false);
            });
        }
        setDeviceErrors(errors);

    }, [device]);

    React.useEffect(() => {
        if (props.device?.id) {
            setDevice(props.device);

            const selectedDeviceType: DropdownItem = DEVICETYPES?.find((item: DropdownItem) => item.value === props?.device?.type);
            setSelectedDeviceType(selectedDeviceType);
        }
    }, [props.device]);

    return (
        <React.Fragment>
            <DeviceForm
                selectedType={selectedDeviceType}
                handleDeviceTypeChange={handleDeviceTypeChange}
                handleDeviceNameChange={handleDeviceNameChange}
                deviceErrors={deviceErrors}
                device={device}
            />
            <div className="row mt-4">
                <div className="col text-left">
                    <Button disabled={loading} label="Cancel" type="reset" size="sm" theme="outline-primary" onClick={props.onDismiss} />
                </div>

                <div className="col text-right">
                    <Button label="Save" id="btnSaveDevice" type="submit" size="sm" theme="primary" onClick={handleSubmitDevice}>
                        <Loader toggle={loading} />
                    </Button>
                </div>
            </div>
        </React.Fragment>
    )
};

export default EditDeviceModal;