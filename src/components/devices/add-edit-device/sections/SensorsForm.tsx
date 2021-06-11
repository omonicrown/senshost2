import React from "react";
import { Table } from "@sebgroup/react-components/dist/Table";

import { DeviceModel, SensorModel } from "../../../../interfaces/models";
import { DropdownItem } from "@sebgroup/react-components/dist/Dropdown/Dropdown";
import { TableHeader, DataItem, PrimaryActionButton, TableRow } from "@sebgroup/react-components/dist/Table/Table";
import { SENSORSTYPES, SENSORSTYPESCOLUMN } from "../../../../constants";
import SensorFormAddAndEditForm from "../../../shared/SensorAddAndEditForm";

interface SensorsFormProps {
    handleSensorSubmitChange: (sensors: Array<SensorModel>) => void;
    device: DeviceModel;
}
const SensorsForm: React.FunctionComponent<SensorsFormProps> = (props: SensorsFormProps) => {

    const [sensors, setSensors] = React.useState<Array<SensorModel>>([]);
    const [sensorData, setSensorData] = React.useState<Array<DataItem<SensorModel>>>([]);

    const primaryButton: PrimaryActionButton = React.useMemo(() => ({
        label: "Delete",
        onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, selectedRow: TableRow) => {
            const indexOfSensorToBeRemoved: number = sensors?.findIndex((s: SensorModel) => s.name === selectedRow["name"]);
            const updatedSensors: Array<SensorModel> = [
                ...sensors?.slice(0, indexOfSensorToBeRemoved),
                ...sensors?.slice(indexOfSensorToBeRemoved + 1)
            ];

            const updatedSensorData: Array<DataItem<SensorModel>> = [
                ...sensorData?.slice(0, selectedRow.rowIndex),
                ...sensorData?.slice(selectedRow.rowIndex + 1)
            ];

            setSensorData(updatedSensorData);
            setSensors(updatedSensors);
            props?.handleSensorSubmitChange(updatedSensors);
        },
    }), [sensors, sensorData, setSensorData, setSensors, props]);

    const sensorColumns: Array<TableHeader> = React.useMemo(() => SENSORSTYPESCOLUMN, []);

    const sensorsData: Array<DataItem> = React.useMemo(() => {
        return sensorData?.map((sensorItem: SensorModel) => {
            const sensorType: DropdownItem = SENSORSTYPES?.find((type: DropdownItem) => type.value === sensorItem.dataType);

            return { ...sensorItem, sensorDataType: sensorType.label };
        });
    }, [sensorData]);
    

    React.useEffect(() => {
        const data: Array<DataItem<SensorModel>> = sensors?.map((sensor) => ({ dataType: sensor.dataType, name: sensor.name })) as Array<DataItem<SensorModel>>;
        setSensorData(data);
    }, [sensors]);

    React.useEffect(() => {
        setSensors(props?.device?.fields);
    }, [props.device?.fields]);

    return (
        <React.Fragment>
            <SensorFormAddAndEditForm
                viewType="accordion"
                device={props.device}
                handleSensorSubmitChange={props.handleSensorSubmitChange}
            />
            <div className="row">
                <div className="col">
                    <div className="card my-3">
                        <div className="card-body">
                            <Table columns={sensorColumns} data={sensorsData} primaryActionButton={primaryButton} />
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default SensorsForm;