import React from "react";

import { Pagination } from "@sebgroup/react-components/dist/Pagination";

import PortalComponent from "../shared/Portal";

import { SharedProps } from "../home/Home";
import { Modal, ModalProps } from "@sebgroup/react-components/dist/Modal/Modal";
import { States } from "../../interfaces/states";
import { useSelector, useDispatch } from "react-redux";
import { AxiosResponse, AxiosError } from "axios";
import { GroupModel, UserModel } from "../../interfaces/models";
import { Column, Table, DataItem, TableRow, TableHeader, FilterProps, FilterItem, ActionLinkItem } from "@sebgroup/react-components/dist/Table/Table";
import { DropdownItem, Dropdown } from "@sebgroup/react-components/dist/Dropdown/Dropdown";
import configs from "../../configs";
import { Button } from "@sebgroup/react-components/dist/Button";


import AddAndEditUser from "./forms/AddAndEditUser";
import { initialState } from "../../constants";
import { UserApis } from "../../apis/userApis";
import { NotificationProps } from "@sebgroup/react-components/dist/notification/Notification";
import { toggleNotification } from "../../actions";
import { Loader } from "@sebgroup/react-components/dist/Loader";
import { Dispatch } from "redux";
import PageTitle from "../shared/PageTitle";

export interface UsersProps extends SharedProps {
}

const Users: React.FunctionComponent<UsersProps> = (props: UsersProps): React.ReactElement<void> => {
    const authState = useSelector((states: States) => states.auth);
    const [paginationValue, setPagination] = React.useState<number>(1);
    const [paginationSize, setPaginationSize] = React.useState<number>(1);

    const [users, setUsers] = React.useState<Array<UserModel>>(null);
    const [user, setUser] = React.useState<UserModel>({} as UserModel);
    const [loading, setLoading] = React.useState<boolean>(false);
    // actions
    const dispatch: Dispatch = useDispatch();

    const groupState = useSelector((states: States) => states.groups)

    const [selectedGroup, setSelectedGroup] = React.useState<DropdownItem>(null);

    const [modalProps, setModalProps] = React.useState<ModalProps>({ ...initialState });
    const [modalDeleteUserProps, setModalDeleteUserProps] = React.useState<ModalProps>({ ...initialState });

    const actionLinks: Array<ActionLinkItem> = React.useMemo(() => [
        {
            label: "Edit", onClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, selectedRow: TableRow) => {
                setUser({
                    name: selectedRow["name"],
                    email: selectedRow["email"],
                    password: selectedRow["password"],
                    groupId: selectedRow["groupId"],
                    id: selectedRow["id"],
                } as UserModel);
                setModalProps({ ...modalProps, toggle: true });
            }
        },
        {
            label: "Delete", onClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, selectedRow: TableRow) => {
                setUser({
                    name: selectedRow["name"],
                    email: selectedRow["email"],
                    password: selectedRow["password"],
                    groupId: selectedRow["groupId"],
                    id: selectedRow["id"],
                } as UserModel);
                setModalDeleteUserProps({ ...modalDeleteUserProps, toggle: true });
            }
        },
    ], []);

    // memos
    const data: Array<DataItem> = React.useMemo(() => users?.map((user: UserModel) => {
        const group: string = groupState?.groups?.find((item: GroupModel) => item?.id === user.groupId)?.name;

        return ({ ...user, groupName: group });
    }), [users, groupState]);

    // filter and show only used groups from the group list
    const groupOptions: Array<DropdownItem> = React.useMemo(() => {
        const groups: Array<DropdownItem> = groupState?.groups?.filter((group: GroupModel) => users?.some((user: UserModel) => user?.groupId === group.id))
            .map((newGroup: GroupModel): DropdownItem => {
                return { label: newGroup.name, value: newGroup.name }
            }) || [];

        return [{ label: "All Groups", value: null }, ...groups];
    }, [users, groupState?.groups]);

    const columns: Array<Column> = React.useMemo((): Array<Column> => [
        {
            label: "Username",
            accessor: "name"
        },
        {
            label: "Group",
            accessor: "groupName"
        },
        {
            label: "Email",
            accessor: "email"
        },
        {
            label: "GroupID",
            accessor: "groupId",
            isHidden: true
        },
        {
            label: "id",
            accessor: "id",
            isHidden: true
        }
    ], []);

    const [filters, setFilters] = React.useState<Array<FilterItem>>(columns.map((column: Column) => ({ accessor: column.accessor, filters: [] })));

    const handleSave = React.useCallback((e: React.FormEvent<HTMLFormElement>, newUser: UserModel) => {
        setLoading(true);
        if (newUser?.id) {
            UserApis?.updateUser(newUser)
                .then((response: AxiosResponse<UserModel>) => {
                    if (response.data) {
                        const notification: NotificationProps = {
                            theme: "success",
                            title: "User added",
                            message: `User updated successfully`,
                            toggle: true,
                            onDismiss: () => { }
                        };

                        dispatch(toggleNotification(notification));

                        const updatedusers: Array<UserModel> = users?.map((item: UserModel) => {
                            if (item?.id === newUser.id) {
                                return newUser;
                            }

                            return item;
                        });

                        setUsers(updatedusers);
                    }
                })
                .finally(() => {
                    setModalProps({ ...modalProps, toggle: false });
                    setUser({} as UserModel);
                    setLoading(false);
                });

        } else {
            UserApis.createUser({ ...newUser, accountId: authState?.auth?.account?.id })
                .then((response: AxiosResponse<UserModel>) => {
                    if (response.data) {
                        const notification: NotificationProps = {
                            theme: "success",
                            title: "User added",
                            message: `User added successfully`,
                            toggle: true,
                            onDismiss: () => { }
                        };

                        dispatch(toggleNotification(notification));

                        setUsers([response.data, ...users]);
                    }
                })
                .finally(() => {
                    setModalProps({ ...modalProps, toggle: false });
                    setLoading(false);
                });
        }
    }, [modalProps, setModalProps, setLoading, setUsers]);

    const handleDeleteUser = React.useCallback(() => {
        setLoading(true);
        UserApis.deleteUser(user?.id)
            .then((response: AxiosResponse) => {
                const notification: NotificationProps = {
                    theme: "success",
                    title: "User deleted",
                    message: `User delete successfully`,
                    toggle: true,
                    onDismiss: () => { }
                };

                const indexOfUserToBeDeleted: number = users?.findIndex((newUser: UserModel) => newUser.id === user.id);
                const updatedUsers: Array<UserModel> = [
                    ...users?.slice(0, indexOfUserToBeDeleted),
                    ...users?.slice(indexOfUserToBeDeleted + 1)
                ];

                dispatch(toggleNotification(notification));
                setUsers(updatedUsers);
            })
            .finally(() => {
                setModalDeleteUserProps({ ...modalDeleteUserProps, toggle: false });
                setLoading(false);
            });

    }, [setLoading, setModalDeleteUserProps, user, setUsers]);

    const onCancel = React.useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setModalProps({ ...modalProps, toggle: false });
    }, [modalProps]);

    const onDismissDelete = React.useCallback(() => {
        setUser({ name: "", email: "", groupId: null, password: "" } as UserModel);
        setModalDeleteUserProps({ ...modalDeleteUserProps, toggle: false });
    }, [setModalDeleteUserProps, setUser]);

    const onAdduser = React.useCallback(() => {
        setUser({ name: "", email: "", groupId: null, password: "" } as UserModel);
        setModalProps({ ...modalProps, toggle: true });
    }, [setUser, setModalProps]);

    const filterProps: FilterProps = React.useMemo(() => ({
        onAfterFilter: (rows: Array<TableRow>) => {
            setPaginationSize(rows?.length);
        },
        filterItems: filters,
    }), [filters]);

    React.useEffect(() => {
        const updatedFilterItems: Array<FilterItem> = filters?.map((filterItem: FilterItem) => {
            if (filterItem.accessor === "groupName" && selectedGroup?.value) {
                return { ...filterItem, filters: [selectedGroup?.value] };
            }

            return { ...filterItem, filters: [] };
        });

        setFilters(updatedFilterItems);
    }, [selectedGroup, setFilters]);

    React.useEffect(() => {
        UserApis.getUsersByAccountId(authState?.auth?.account?.id)
            .then((response: AxiosResponse<Array<UserModel>>) => {
                if (response?.data) {
                    setUsers(response?.data || []);
                    setPaginationSize(response?.data?.length);
                }
            }).catch((error: AxiosError) => {
                setUsers([]);
            })
    }, []);

    return (
        <div className="users-container">
            <PageTitle title="Users" />

            <div className="users-holder">
                <div className="table-filter-and-control-holder d-flex flex-sm-row flex-column">
                    <Dropdown
                        placeholder="Filter By Group"
                        list={groupOptions}
                        selectedValue={selectedGroup}
                        onChange={(value: DropdownItem) => setSelectedGroup(value)}
                    />

                    <Button label="Add" size="sm" id="addBtn" theme="outline-primary" title="Add" onClick={onAdduser} />

                </div>
                <div className="row">
                    <div className="col">
                        <div className="card">
                            <div className="card-body">
                                <Table
                                    columns={columns}
                                    data={data}
                                    actionLinks={actionLinks}
                                    offset={configs.tablePageSize}
                                    currentpage={paginationValue}
                                    filterProps={filterProps}
                                    footer={data?.length ?
                                        <Pagination value={paginationValue} onChange={setPagination} size={data?.length} useFirstAndLast={true} />
                                        : null}
                                    sortProps={{
                                        onAfterSorting: (rows: Array<TableRow>, sortByColumn: TableHeader) => { },
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <PortalComponent>
                <Modal
                    {...modalProps}
                    onDismiss={() => setModalProps({ ...modalProps, toggle: false })}
                    header={modalProps?.toggle ? <h4>{user?.name ? 'Edit user' : 'Create user'}</h4> : null}
                    body={
                        modalProps?.toggle ?
                            <AddAndEditUser loading={loading} user={user} onSave={handleSave} onCancel={onCancel} groups={groupState?.groups} />
                            : null
                    }
                />

                <Modal
                    {...modalDeleteUserProps}
                    onDismiss={onDismissDelete}
                    header={<h4>Delete {user?.name} ?</h4>}
                    body={
                        modalDeleteUserProps?.toggle ?
                            <p>Are you sure you want to delete this ?</p>
                            : null
                    }
                    footer={
                        modalDeleteUserProps?.toggle ?
                            <div className="controls-holder d-flex flex-sm-row flex-column">
                                <Button label="Cancel" theme="outline-primary" onClick={onDismissDelete} />
                                <Button label="Delete" theme="danger" onClick={handleDeleteUser}>
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

export default Users;
