import React from "react";

import { Pagination } from "@sebgroup/react-components/dist/Pagination";

import PortalComponent from "../shared/Portal";

import { SharedProps } from "../home/Home";
import { Modal, ModalProps } from "@sebgroup/react-components/dist/Modal/Modal";

import { GroupApis } from "../../apis/groupApis";
import { States, AuthState } from "../../interfaces/states";
import { useSelector, useDispatch } from "react-redux";
import { AxiosResponse, AxiosError } from "axios";
import { GroupModel } from "../../interfaces/models";
import { Column, Table, DataItem, TableRow, TableHeader, PrimaryActionButton, FilterProps, FilterItem, ActionLinkItem } from "@sebgroup/react-components/dist/Table/Table";
import { DropdownItem, Dropdown } from "@sebgroup/react-components/dist/Dropdown/Dropdown";
import configs from "../../configs";
import { Button } from "@sebgroup/react-components/dist/Button";


import AddAndEditGroup from "./forms/AddAndEditGroup";
import { initialState } from "../../constants";
import { toggleNotification } from "../../actions";
import { NotificationProps } from "@sebgroup/react-components/dist/notification/Notification";

import GroupDetails from "./GroupDetails";
import { useHistory } from "react-router";
import { Dispatch } from "redux";
import { History } from "history";
import { AppRoutes, GroupRoutes } from "../../enums/routes";
import { Loader } from "@sebgroup/react-components/dist/Loader";
import PageTitle from "../shared/PageTitle";
import { formatDateTime } from "../../utils/functions";

export interface GroupsProps extends SharedProps {
}

const GroupHolder: React.FunctionComponent<GroupsProps> = (props: GroupsProps): React.ReactElement<void> => {
  const authState: AuthState = useSelector((states: States) => states?.auth);

  const history: History = useHistory();

  // actions
  const dispatch: Dispatch = useDispatch();

  const [paginationValue, setPagination] = React.useState<number>(1);
  const [groups, setGroups] = React.useState<Array<GroupModel>>(null);
  const [group, setGroup] = React.useState<GroupModel>({} as GroupModel);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [paginationSize, setPaginationSize] = React.useState<number>(0);
  const [selectedStatus, setSelectedStatus] = React.useState<DropdownItem>(null);
  const statuses: Array<DropdownItem> = React.useMemo(() => [
    { label: "All", value: null }, { label: "Active", value: 0 }, { label: "inActive", value: 1 }
  ], []);

  const [modalProps, setModalProps] = React.useState<ModalProps>({ ...initialState });

  const [groupDetailsModalProps, setGroupDetailsModalProps] = React.useState<ModalProps>({ ...initialState });
  const [groupDeleteModalProps, setGroupDeleteModalProps] = React.useState<ModalProps>({ ...initialState });

  const primaryButton: PrimaryActionButton = React.useMemo(() => ({
    label: "View",
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, selectedRow: TableRow) => {
      history.push(GroupRoutes.ViewGroupdetails.toString().replace(":groupId", selectedRow["id"]));
    },
  }), []);


  const actionLinks: Array<ActionLinkItem> = React.useMemo(() => [
    {
      label: "Edit", onClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, selectedRow: TableRow) => {
        setGroup({
          accountId: selectedRow['accountId'],
          name: selectedRow["name"],
          status: selectedRow["status"],
          id: selectedRow["id"],
          creationDate: selectedRow["creationDate"]
        });

        setModalProps({ ...modalProps, toggle: true });
      }
    },
    {
      label: "Delete", onClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, selectedRow: TableRow) => {
        setGroup({
          accountId: selectedRow['accountId'],
          name: selectedRow["name"],
          status: selectedRow["status"],
          id: selectedRow["id"],
          creationDate: selectedRow["creationDate"]
        });

        setGroupDeleteModalProps({ ...groupDeleteModalProps, toggle: true });
      }
    },
  ], [setGroup, setModalProps, setGroupDeleteModalProps]);

  // memos
  const data: Array<DataItem> = React.useMemo(() => groups?.map((group: GroupModel) => {
    const newGroup: string = statuses?.find((item: DropdownItem) => item?.value === group.status)?.label;
    return ({ ...group, statusType: newGroup, account: authState?.auth?.account?.name, creationDate: formatDateTime(group.creationDate) });
  }), [groups, statuses]);

  const columns: Array<Column> = React.useMemo((): Array<Column> => [
    {
      label: "Group Name",
      accessor: "name"
    },
    {
      label: "Status",
      accessor: "statusType"
    },
    {
      label: "Status",
      accessor: "status",
      isHidden: true
    },
    {
      label: "Date",
      accessor: "creationDate",
      isHidden: false
    },
    {
      label: "Account",
      accessor: "account",
      isHidden: false
    },
  ], []);

  const [filters, setFilters] = React.useState<Array<FilterItem>>(columns.map((column: Column) => ({ accessor: column.accessor, filters: [] })));

  const handleDeleteGroup = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);

    GroupApis.deleteGroup(group?.id)
      .then((response: AxiosResponse) => {
        const notification: NotificationProps = {
          theme: "success",
          title: "Group deleted",
          message: `Group deleted successfully`,
          toggle: true,
          onDismiss: () => { }
        };
        const indexOfGroupTobeDeleted: number = groups?.findIndex((newGroup: GroupModel) => newGroup?.id === group?.id);
        const updatedGroups = [
          ...groups?.slice(0, indexOfGroupTobeDeleted),
          ...groups?.slice(indexOfGroupTobeDeleted + 1)
        ];

        dispatch(toggleNotification(notification));

        setGroups(updatedGroups);
        setGroup({ name: "", id: null } as GroupModel);
      })
      .finally(() => {
        setGroupDeleteModalProps({ ...groupDeleteModalProps, toggle: false });
        setLoading(false);
      });
  }, [setGroup, group, setGroupDeleteModalProps]);


  const onDismissDeleteGroup = React.useCallback(() => {
    setGroup({ name: "", id: null } as GroupModel);
    setGroupDeleteModalProps({ ...groupDeleteModalProps, toggle: false });
  }, [setGroupDeleteModalProps, setGroup])


  const handleSave = React.useCallback((e: React.FormEvent<HTMLFormElement>, newGroup: GroupModel) => {
    setLoading(true);
    if (newGroup?.id) {
      GroupApis.updateGroup(newGroup)
        .then((response: AxiosResponse<GroupModel>) => {
          if (response.data) {
            const notification: NotificationProps = {
              theme: "success",
              title: "Group updated",
              message: `Group updated successfully`,
              toggle: true,
              onDismiss: () => { }
            };

            dispatch(toggleNotification(notification));
            const updatedGroups: Array<GroupModel> = groups?.map((newGroup: GroupModel) => {
              if (newGroup?.id === newGroup?.id) {
                return response?.data;
              }

              return newGroup;
            })
            setGroups(updatedGroups);
          }
        })
        .finally(() => {
          setGroup({ name: "", id: null } as GroupModel);
          setModalProps({ ...modalProps, toggle: false });
          setLoading(false);
        });
    } else {
      GroupApis.createGroup({ ...newGroup, accountId: authState?.auth?.account?.id })
        .then((response: AxiosResponse<GroupModel>) => {
          if (response.data) {
            const notification: NotificationProps = {
              theme: "success",
              title: "Group added",
              message: `Group added successfully`,
              toggle: true,
              onDismiss: () => { }
            };

            dispatch(toggleNotification(notification));
            setGroups([...groups, response.data]);
          }
        })
        .finally(() => {
          setGroup({ name: "", id: null } as GroupModel);
          setModalProps({ ...modalProps, toggle: false });
          setLoading(false);
        });
    }
  }, [modalProps, setGroups, setModalProps, setGroup]);

  const onCancel = React.useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setModalProps({ ...modalProps, toggle: false });
    setGroup({ name: "", id: null } as GroupModel);
  }, [modalProps, setGroup]);

  const onDismissGroupModal = React.useCallback(() => {
    setGroup({ name: "", id: null } as GroupModel);
    setModalProps({ ...modalProps, toggle: false });
  }, [setModalProps, setGroup]);

  const onAddGroup = React.useCallback(() => {
    setGroup({ name: "", id: null } as GroupModel);
    setModalProps({ ...modalProps, toggle: true });
  }, [setGroup, setModalProps]);

  const filterProps: FilterProps = React.useMemo(() => ({
    onAfterFilter: (rows: Array<TableRow>) => {
      setPaginationSize(rows?.length);
    },
    filterItems: filters,
  }), [filters]);

  React.useEffect(() => {
    const updatedFilterItems: Array<FilterItem> = filters?.map((filterItem: FilterItem) => {
      if (filterItem.accessor === "status" && selectedStatus?.value) {
        return { ...filterItem, filters: [selectedStatus?.value] };
      }
      return { ...filterItem, filters: [] };
    });

    setFilters(updatedFilterItems);
  }, [selectedStatus, setFilters]);

  React.useEffect(() => {
    GroupApis.getGroupsByAccount(authState?.auth?.account?.id)
      .then((response: AxiosResponse<Array<GroupModel>>) => {
        if (response?.data) {
          setGroups(response?.data || []);
          setPaginationSize(response?.data?.length)
        }
      }).catch((error: AxiosError) => {
        setGroups([]);
      })
  }, []);

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

  return (
    <div className="groups-container">
      <PageTitle title="Groups" />
      <div className="group-holder">
        <div className="table-filter-and-control-holder d-flex flex-sm-row flex-column">
          <Dropdown
            placeholder="Filter By Status"
            list={statuses}
            selectedValue={selectedStatus}
            onChange={(value: DropdownItem) => setSelectedStatus(value)}
          />
          <Button label="Add" id="addBtn" size="sm" theme="outline-primary" title="Add" onClick={onAddGroup} />
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
                  actionLinks={actionLinks}
                  footer={data?.length ?
                    <Pagination value={paginationValue} onChange={setPagination} size={paginationSize} useFirstAndLast={true} />
                    : null}
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
          {...modalProps}
          onDismiss={onDismissGroupModal}
          header={modalProps?.toggle ? <h3>{group?.id ? 'Edit Group' : 'Create Group'}</h3> : null}
          body={
            modalProps?.toggle ?
              <AddAndEditGroup
                onSave={handleSave}
                onCancel={onCancel}
                loading={loading}
                group={group} />
              : null
          }
        />
        <Modal
          {...groupDeleteModalProps}
          onDismiss={onDismissDeleteGroup}
          header={groupDeleteModalProps?.toggle ? <h4>Delete {group?.name} ?</h4> : null}
          body={
            groupDeleteModalProps?.toggle ?
              <p>Are you sure you want to delete this ?</p>
              : null
          }
          footer={
            groupDeleteModalProps?.toggle ?
              <div className="controls-holder d-flex flex-sm-row flex-column">
                <Button label="Cancel" disabled={loading} theme="outline-primary" onClick={onDismissDeleteGroup} />
                <Button label="Delete" theme="danger" onClick={handleDeleteGroup}>
                  {<Loader toggle={loading} size='sm' />}
                </Button>
              </div>
              : null
          }
        />
      </PortalComponent>
    </div>
  );

};

export default GroupHolder;
