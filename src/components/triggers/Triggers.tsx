import { Button } from "@sebgroup/react-components/dist/Button";
import React from "react";
import { useHistory } from "react-router";
import { History } from "history";
import { SharedProps } from "../home/Home";
import PageTitle from "../shared/PageTitle";
import { TriggerRoutes } from "../../enums/routes";
import { Table } from "@sebgroup/react-components/dist/Table";
import { ActionLinkItem, Column, DataItem, TableHeader, TableRow } from "@sebgroup/react-components/dist/Table/Table";
import { Pagination } from "@sebgroup/react-components/dist/Pagination";
import { TriggerApis } from "../../apis/triggerApis";
import { AuthState, States } from "../../interfaces/states";
import { useDispatch, useSelector } from "react-redux";
import { AxiosResponse } from "axios";
import { TriggerModel } from "../../interfaces/models";
import configs from "../../configs";
import { Modal, ModalProps } from "@sebgroup/react-components/dist/Modal/Modal";
import { initialState } from "../../constants";
import { RuleTriggerTypes } from "../../enums";
import PortalComponent from "../shared/Portal";
import { Loader } from "@sebgroup/react-components/dist/Loader";
import { NotificationProps } from "@sebgroup/react-components/dist/notification/Notification";
import { Dispatch } from "redux";
import { toggleNotification } from "../../actions";

export interface TriggersProps extends SharedProps {

}

const Triggers: React.FunctionComponent<TriggersProps> = (props: TriggersProps): React.ReactElement<void> => {
    const authState: AuthState = useSelector((states: States) => states?.auth);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [data, setData] = React.useState<Array<DataItem>>();
    const [trigger, setTrigger] = React.useState<TriggerModel>();
    const [modalDeleteTriggerProps, setModalDeleteTriggerProps] = React.useState<ModalProps>({ ...initialState });
    const [paginationValue, setPagination] = React.useState<number>(1);

    const dispatch: Dispatch = useDispatch();


    const history: History = useHistory();
    const handleAddTrigger = React.useCallback((e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        history.push(TriggerRoutes.CreateTrigger.toString());
    }, []);

    const onDismissDelete = React.useCallback(() => {
        setModalDeleteTriggerProps({ ...modalDeleteTriggerProps, toggle: false });
    }, [setModalDeleteTriggerProps, setModalDeleteTriggerProps]);

    const handleDeleteTrigger = React.useCallback(() => {
        setLoading(true);
        TriggerApis.deleteTriggerById(trigger?.id)
            .then((response: AxiosResponse) => {
                const notification: NotificationProps = {
                    theme: "success",
                    title: "User deleted",
                    message: `Trigger delete successfully`,
                    toggle: true,
                    onDismiss: () => { }
                };

                const indexOfTriggerToBeDeleted: number = data?.findIndex((newTrigger: TriggerModel) => newTrigger?.id === newTrigger?.id);
                const updatedTriggers: Array<TriggerModel> = [
                    ...data?.slice(0, indexOfTriggerToBeDeleted),
                    ...data?.slice(indexOfTriggerToBeDeleted + 1)
                ];

                dispatch(toggleNotification(notification));
                setData(updatedTriggers || []);

                setTrigger({} as TriggerModel);
            })
            .finally(() => {
                setModalDeleteTriggerProps({ ...modalDeleteTriggerProps, toggle: false });
                setLoading(false);
            });

    }, [setLoading, setModalDeleteTriggerProps, trigger, setData, setTrigger]);


    const columns: Array<Column> = React.useMemo((): Array<Column> => [
        {
            label: "Trigger name",
            accessor: "name"
        },
        {
            label: "Event name",
            accessor: "eventName"
        },
        {
            label: "Trigger type",
            accessor: "triggerType"
        },
        {
            label: "id",
            accessor: "id",
            isHidden: true
        }
    ], []);

    const actionLinks: Array<ActionLinkItem> = React.useMemo(() => [
        {
            label: "Edit", onClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, selectedRow: TableRow) => {
                history.push(TriggerRoutes?.EditTrigger.toString()?.replace(":triggerId", selectedRow["id"]),)
            }
        },
        {
            label: "Delete", onClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, selectedRow: TableRow) => {
                setTrigger({
                    name: selectedRow["name"],
                    eventName: selectedRow["eventName"],
                    type: selectedRow["type"],
                    groupId: selectedRow["groupId"],
                    id: selectedRow["id"],
                } as TriggerModel);
                setModalDeleteTriggerProps({ ...modalDeleteTriggerProps, toggle: true });
            }
        },
    ], []);

    React.useEffect(() => {
        setLoading(true);
        TriggerApis.getTriggersByAccountId(authState?.auth?.account?.id)
            .then((response: AxiosResponse<Array<TriggerModel>>) => {
                if (response?.data) {
                    const updatedData = response.data?.map((trigger: TriggerModel) => ({
                        id: trigger?.id,
                        name: trigger.name,
                        eventName: trigger.eventName,
                        triggerType: trigger.type === RuleTriggerTypes.dataReceived ? "onDataReceived" : "schedule"
                    }))
                    setData(updatedData);
                }
            }).finally(() => {
                setLoading(false);
            })
    }, [])

    return (
        <div className="triggers-container">
            <PageTitle title="Triggers" />

            <div className="triggers-holder">
                <div className="table-filter-and-control-holder d-flex flex-sm-row flex-column">
                    <div />
                    <Button label="Add" size="sm" id="addTriggerBtn" disabled={loading} theme="outline-primary" title="Add" onClick={handleAddTrigger} />
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
                                    footer={data?.length ?
                                        <Pagination
                                            value={paginationValue}
                                            onChange={setPagination}
                                            size={data?.length}
                                            useFirstAndLast={true} />
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
                    {...modalDeleteTriggerProps}
                    onDismiss={onDismissDelete}
                    header={<h4>Delete {trigger?.name} ?</h4>}
                    body={
                        modalDeleteTriggerProps?.toggle ?
                            <p>Are you sure you want to delete this ?</p>
                            : null
                    }
                    footer={
                        modalDeleteTriggerProps?.toggle ?
                            <div className="controls-holder d-flex flex-sm-row flex-column">
                                <Button label="Cancel" theme="outline-primary" onClick={onDismissDelete} />
                                <Button label="Delete" theme="danger" onClick={handleDeleteTrigger}>
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

export default Triggers;
