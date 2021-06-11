import React from "react";
import { DeviceModel, ActuatorModel } from "../../../../interfaces/models";
import { DropdownItem } from "@sebgroup/react-components/dist/Dropdown/Dropdown";
import { ACTUATORCOLUMNS } from "../../../../constants";
import { Table } from "@sebgroup/react-components/dist/Table";
import { TableHeader, PrimaryActionButton, TableRow } from "@sebgroup/react-components/dist/Table/Table";
import ActuatorFormAddAndEditForm from "../../../shared/ActuatorAddAndEditForm";

interface ActuatorFormProps {
    device: DeviceModel;
    selectedActuatorType: DropdownItem;
    handleActuatorSubmitChange: (actuators: Array<ActuatorModel>) => void;
}

export interface ActuatorTableData {
    name: string;
    value: string;
    message: string;
    type: number;
    ON: string
    OFF: string;
    id?: string;
    deviceId?: string;
    accountId?: string;
}

export type ActuatorError = {
    [k in keyof ActuatorTableData]: string;
};

const ActuatorForm: React.FunctionComponent<ActuatorFormProps> = (props: ActuatorFormProps) => {
    const actuatorColumns: Array<TableHeader> = React.useMemo(() => ACTUATORCOLUMNS, []);

    const actuatorRows = React.useMemo((): Array<ActuatorTableData> => {
        return props?.device?.actuators?.map((actuator: ActuatorModel): ActuatorTableData => {
            return {
                name: actuator.name,
                value: actuator?.propertise?.value,
                message: actuator?.propertise?.message,
                type: actuator?.type,
                ON: actuator?.propertise?.ON,
                OFF: actuator?.propertise?.OFF
            }
        })
    }, [props.device?.actuators]);


    const primaryButton: PrimaryActionButton = React.useMemo(() => ({
        label: "Delete",
        onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, selectedRow: TableRow) => {
            const indexOfActuatorToBeRemoved: number = actuatorRows?.findIndex((a: ActuatorTableData) => a.name === selectedRow["name"]);

            const updatedActuators: Array<ActuatorModel> = [
                ...props.device?.actuators?.slice(0, indexOfActuatorToBeRemoved),
                ...props.device?.actuators?.slice(indexOfActuatorToBeRemoved + 1)
            ];

            props?.handleActuatorSubmitChange(updatedActuators);
        },
    }), [actuatorRows, props]);

    const handleActuatorSubmitChange = (actuator: ActuatorModel) => {
        const updatedActuators: Array<ActuatorModel> = [...props.device?.actuators, actuator];

        props.handleActuatorSubmitChange(updatedActuators)
    }

    return (
        <div className="actuator-holder">
            <ActuatorFormAddAndEditForm
                device={props.device}
                viewType="accordion"
                handleActuatorSubmitChange={handleActuatorSubmitChange}
            />

            <div className="row">
                <div className="col">
                    <div className="card my-4">
                        <div className="card-body">
                            <Table columns={actuatorColumns} data={actuatorRows} primaryActionButton={primaryButton} />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );

};

export default ActuatorForm;