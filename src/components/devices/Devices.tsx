import React from "react";
import { } from "history";

import { Pagination } from "@sebgroup/react-components/dist/Pagination";

import PortalComponent from "../shared/Portal";

import { SharedProps } from "../home/Home";
import { Modal, ModalProps } from "@sebgroup/react-components/dist/Modal/Modal";
import AddAndEditDevice from "./add-edit-device/AddAndEditDevice";

import { DeviceApis } from "../../apis/deviceApis";
import { States, AuthState } from "../../interfaces/states";
import { useSelector, useDispatch } from "react-redux";
import { AxiosResponse, AxiosError } from "axios";
import { DeviceModel, ActuatorModel } from "../../interfaces/models";
import { Column, Table, DataItem, TableRow, TableHeader, PrimaryActionButton, FilterProps, FilterItem } from "@sebgroup/react-components/dist/Table/Table";
import { DEVICETYPES, initialState } from "../../constants";
import { DropdownItem, Dropdown } from "@sebgroup/react-components/dist/Dropdown/Dropdown";
import configs from "../../configs";
import { Button } from "@sebgroup/react-components/dist/Button";
import { NotificationProps } from "@sebgroup/react-components/dist/notification/Notification";
import { toggleNotification } from "../../actions";
import { Dispatch } from "redux";
import { useHistory } from "react-router";
import { History } from "history";
import { AppRoutes, ViewDeviceRoutes } from "../../enums/routes";
import PageTitle from "../shared/PageTitle";
import { receiveDevices } from "../../actions/deviceActions";

export interface DevicesProps extends SharedProps {
  onToggle: (value: boolean) => void;
}

const Devices: React.FunctionComponent<DevicesProps> = (props: DevicesProps): React.ReactElement<void> => {
  const [paginationValue, setPaginationValue] = React.useState<number>(1);


  const [loading, setLoading] = React.useState<boolean>(false);

  const [paginationSize, setPaginationSize] = React.useState<number>(0);

  const [selectedDeviceType, setSelectedDeviceType] = React.useState<DropdownItem>(null);
  const deviceTypes: Array<DropdownItem> = React.useMemo(() => DEVICETYPES, []);
  const [toggleAddDeviceModal, setToggleAddDeviceModal] = React.useState<ModalProps>({ ...initialState });

  const history: History = useHistory();

  const primaryButton: PrimaryActionButton = React.useMemo(() => ({
    label: "View",
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, selectedRow: TableRow) => {
      history.push(ViewDeviceRoutes.ViewDevice.toString().replace(":deviceId", selectedRow["id"]));
    },
  }), [history]);

  // actions
  const { devices } = useSelector((states: States) => states?.devices);
  const authState: AuthState = useSelector((states: States) => states?.auth);
  const dispatch: Dispatch = useDispatch();

  React.useEffect(() => {
    if (!authState?.auth?.identityToken) {
      const notification: NotificationProps = {
        theme: "danger",
        title: "Unauthenticated user",
        message: `Please login to proceed`,
        onDismiss: () => { },
        toggle: true
      };

      dispatch(toggleNotification(notification));
      history.replace(AppRoutes.Account);
    }
  }, [authState]);

  // memos
  const data: Array<DataItem> = React.useMemo(() => devices?.map((device: DeviceModel) => {
    const selectedDeviceType: string = deviceTypes?.find((item: DropdownItem) => item?.value === device.type)?.label;
    return ({ name: device.name, type: device.type, deviceType: selectedDeviceType, accountId: device?.accountId, id: device.id });
  }), [devices, deviceTypes]);

  const columns: Array<Column> = React.useMemo((): Array<Column> => [
    {
      label: "Device Name",
      accessor: "name"
    },
    {
      label: "Device type",
      accessor: "deviceType"
    },
    {
      label: "type",
      accessor: "type",
      isHidden: true
    },
    {
      label: "id",
      accessor: "id",
      isHidden: true
    }
  ], []);

  const [filters, setFilters] = React.useState<Array<FilterItem>>(columns.map((column: Column) => ({ accessor: column.accessor, filters: [] })));

  const onSave = React.useCallback((e: React.FormEvent<HTMLFormElement>, device: DeviceModel) => {
    const createDeviceModel: DeviceModel = {
      ...device,
      accountId: authState.auth?.account.id,
      actuators: device?.actuators?.map((actuator: ActuatorModel) => {
        return { ...actuator, propertise: JSON.stringify(actuator?.propertise) as any }
      })
    };

    setLoading(true);
    DeviceApis.createDevice(createDeviceModel).then((response: AxiosResponse<DeviceModel>) => {
      if (response?.data) {
        const notification: NotificationProps = {
          theme: "success",
          title: "device added successfully",
          message: `Deivce added successfully`,
          toggle: true,
          onDismiss: () => { }
        };

        dispatch(toggleNotification(notification));

        dispatch(receiveDevices([...devices, response.data]));

        setToggleAddDeviceModal({ ...toggleAddDeviceModal, toggle: false });
      }
    }).catch((err: AxiosError) => {
      console.log(err);
    }).finally(() => {
      setLoading(false);
    });

  }, [toggleAddDeviceModal, devices, dispatch, setToggleAddDeviceModal, toggleNotification]);

  const onDismissModal = React.useCallback(() => {
    setToggleAddDeviceModal({ ...toggleAddDeviceModal, toggle: false });
  }, [toggleAddDeviceModal, setToggleAddDeviceModal]);

  const onAddDevice = React.useCallback(() => {
    setToggleAddDeviceModal({ ...toggleAddDeviceModal, toggle: true });
  }, [setToggleAddDeviceModal]);

  const filterProps: FilterProps = React.useMemo(() => ({
    onAfterFilter: (rows: Array<TableRow>) => {
      setPaginationSize(rows?.length);
      setPaginationValue(1);
    },
    filterItems: filters,
  }), [filters]);

  React.useEffect(() => {
    const updatedFilterItems: Array<FilterItem> = filters?.map((filterItem: FilterItem) => {
      if (filterItem.accessor === "type" && selectedDeviceType?.value) {
        return { ...filterItem, filters: [selectedDeviceType?.value] };
      }
      return filterItem;
    });
    setFilters(updatedFilterItems);
  }, [selectedDeviceType]);


  React.useEffect(() => {
    setPaginationSize(devices?.length);
  }, [devices]);

  return (
    <div className="device-container">
      <PageTitle title="Devices" />
      <div className="device-holder">
        <div className="table-filter-and-control-holder d-flex flex-sm-row flex-column">
          <Dropdown
            placeholder="Filter By type"
            list={deviceTypes}
            searchable
            selectedValue={selectedDeviceType}
            onChange={(value: DropdownItem) => setSelectedDeviceType(value)}
          />
          <Button
            label="Add"
            theme="outline-primary"
            id="btnAdd"
            size="sm"
            title="Add" onClick={onAddDevice} />
        </div>
        <div className="row">
          <div className="col">
            <div className="card">
              <div className="card-body">
                <Table
                  columns={columns}
                  data={data}
                  offset={configs.tablePageSize}
                  currentpage={paginationValue}
                  primaryActionButton={primaryButton}
                  filterProps={filterProps}
                  footer={data?.length ?
                    <Pagination value={paginationValue} onChange={setPaginationValue} size={paginationSize} useFirstAndLast={true} />
                    : null
                  }
                  sortProps={{
                    onAfterSorting: (rows: Array<TableRow>, sortByColumn: TableHeader) => { },
                  }} />
              </div>
            </div>
          </div>
        </div>

      </div>

      <PortalComponent>
        <Modal
          {...toggleAddDeviceModal}
          size="modal-lg"
          onDismiss={onDismissModal}
          header={toggleAddDeviceModal?.toggle ? <h3>Create Device</h3> : null}
          body={
            toggleAddDeviceModal?.toggle ?
              <AddAndEditDevice
                onSave={onSave}
                loading={loading}
                onCancel={onDismissModal}
                toggle={toggleAddDeviceModal?.toggle}
              />
              : null
          }
        />
      </PortalComponent>

    </div>
  );

};

export default Devices;
