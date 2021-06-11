import React from "react";
import { SharedProps } from "../home/Home";
import { HomeRoutes } from "../../enums/routes";
import { Link, useHistory, useLocation } from "react-router-dom";
import { DashboardModel, GroupModel, PositiveResponse } from "../../interfaces/models";
import { DashboardApis } from "../../apis/dashboardApis";
import { useDispatch, useSelector } from "react-redux";
import { GroupState, States, AuthState } from "../../interfaces/states";
import { AxiosResponse } from "axios";
import { NotificationProps } from "@sebgroup/react-components/dist/notification/Notification";

import { Dispatch } from "redux";

import { toggleNotification } from "../../actions";
import { Modal, ModalProps } from "@sebgroup/react-components/dist/Modal/Modal";

import AddDashboard from "./modals/AddDashboard";

import PortalComponent from "../shared/Portal";
import { initialState } from "../../constants";
import { Button } from "@sebgroup/react-components/dist/Button";
import { Pagination } from "@sebgroup/react-components/dist/Pagination";

import queryString from 'query-string';

import { History, Location } from "history";
import { icontypesEnum, SvgElement } from "../../utils/svgElement";
import { Loader } from "@sebgroup/react-components/dist/Loader";
import PageTitle from "../shared/PageTitle";
import { formatDateTime } from "../../utils/functions";


export interface DashboardProps extends SharedProps {

}

interface DashboardDisplayModel extends DashboardModel {
    group?: string;
    time?: string;
}
interface PaginationProps {
    value: number;
    size: number;
    offset: number;
}
const Dashboard: React.FunctionComponent<DashboardProps> = React.memo((props: DashboardProps): React.ReactElement<void> => {
    const [dashboards, setDashboards] = React.useState<Array<DashboardDisplayModel>>([]);
    const [dashboard, setDashboard] = React.useState<DashboardDisplayModel>(null);
    const [paginationProps, setPaginationProps] = React.useState<PaginationProps>({
        offset: 10,
        size: 0,
        value: 1
    });
    const [loading, setLoading] = React.useState<boolean>(false);
    const [fetching, setFetching] = React.useState<boolean>(false);
    const [modalProps, setModalProps] = React.useState<ModalProps>({ ...initialState });
    const [modalDeleteDashboardProps, setModalDeleteDashboardProps] = React.useState<ModalProps>({ ...initialState });

    const arrayTemp: Array<number> = React.useMemo(() => [1, 2, 3, 4], []);

    const authState: AuthState = useSelector((states: States) => states.auth);
    const groupState: GroupState = useSelector((states: States) => states.groups);

    const dispatch: Dispatch = useDispatch();
    const history: History = useHistory();
    const location: Location = useLocation();

    const onCancel = React.useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setDashboard(null);
        setModalProps({ ...modalProps, toggle: false });
    }, [modalProps]);

    const onPaginationChange = React.useCallback((value: number) => {
        history.push({ pathname: HomeRoutes.Dashboard.toString(), search: '?page=' + value, state: { page: value } });
    }, [paginationProps])

    const onAddDashboard = React.useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setDashboard(null);
        setModalProps({ ...modalProps, toggle: true });
    }, [modalProps]);

    const onEditDashboard = React.useCallback((e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, dashboard: DashboardDisplayModel) => {
        setDashboard(dashboard);
        setModalProps({ ...modalProps, toggle: true });
    }, [modalProps]);

    const onDeleteDashboardClick = React.useCallback((e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, dashboard: DashboardDisplayModel) => {
        setDashboard(dashboard);
        setModalDeleteDashboardProps({ ...modalDeleteDashboardProps, toggle: true });
    }, [modalDeleteDashboardProps]);

    const handleDismissDeleteDashboard = React.useCallback((e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setModalDeleteDashboardProps({ ...modalDeleteDashboardProps, toggle: false });
        setDashboard({} as DashboardDisplayModel)
    }, [modalDeleteDashboardProps]);


    const handleDeleteDashboard = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        setLoading(true);
        DashboardApis.deleteDashboardById(dashboard?.id)
            .then((response: AxiosResponse<PositiveResponse>) => {
                const indexOfItemToBeRemoved: number = dashboards?.findIndex((item: DashboardDisplayModel) => item.id === dashboard?.id);

                const updatedItems: Array<DashboardDisplayModel> = [
                    ...dashboards.slice(0, indexOfItemToBeRemoved),
                    ...dashboards?.slice(indexOfItemToBeRemoved + 1)
                ];

                setDashboards(updatedItems);
                const notification: NotificationProps = {
                    theme: "success",
                    title: "Dashboard Item delete",
                    message: `Dashboard item deleted successfully`,
                    toggle: true,
                    onDismiss: () => { }
                };
                dispatch(toggleNotification(notification));
                setModalDeleteDashboardProps({ ...modalDeleteDashboardProps, toggle: false });
            })
            .finally(() => {
                setLoading(false);
                setDashboard({} as DashboardDisplayModel);
            });
    }, [dashboards, dashboard, modalDeleteDashboardProps]);

    const handleSave = React.useCallback((e: React.FormEvent<HTMLFormElement>, localDashboard: DashboardModel) => {
        setLoading(true);
        if (localDashboard?.id) {
            DashboardApis.editDashboardById(localDashboard)
                .then((response: AxiosResponse<DashboardModel>) => {
                    const updatedDashboardGroups: Array<DashboardDisplayModel> = dashboards?.map((dashboard: DashboardModel) => {
                        const selectedGroup: GroupModel = groupState?.groups?.find((group: GroupModel) => group.id === localDashboard.groupId);

                        if (dashboard.id === response?.data?.id) {
                            return { ...response.data, group: selectedGroup?.name };
                        }
                        return {
                            ...dashboard, group: selectedGroup?.name
                        }
                    });

                    setDashboards(updatedDashboardGroups);

                    const notification: NotificationProps = {
                        theme: "success",
                        title: "Dashboard update",
                        message: `Dashboard updated successfully`,
                        toggle: true,
                        onDismiss: () => { }
                    };
                    dispatch(toggleNotification(notification));

                    setModalProps({ ...modalProps, toggle: false });
                }).finally(() => {
                    setLoading(false);
                    setDashboard(null);
                });
        } else {
            DashboardApis.addDashboard(localDashboard)
                .then((response: AxiosResponse) => {
                    const selectedGroup: GroupModel = groupState?.groups?.find((group: GroupModel) => group.id === localDashboard.groupId);

                    setDashboards([...dashboards, { ...response.data, group: selectedGroup?.name }]);

                    const notification: NotificationProps = {
                        theme: "success",
                        title: "Dashboard added",
                        message: `Dashboard added successfully`,
                        toggle: true,
                        onDismiss: () => { }
                    };

                    dispatch(toggleNotification(notification));

                    setModalProps({ ...modalProps, toggle: false });
                }).finally(() => {
                    setLoading(false);
                });
        }
    }, [dashboards, groupState]);

    React.useEffect(() => {
        setFetching(true);
        DashboardApis.getDashboardsByAccountId(authState?.auth.account?.id)
            .then((response: AxiosResponse<Array<DashboardModel>>) => {
                if (response.data) {
                    const updatedDashboardGroups: Array<DashboardDisplayModel> = response.data?.map((dashboard: DashboardModel) => {
                        const selectedGroup: GroupModel = groupState?.groups?.find((group: GroupModel) => group.id === dashboard.groupId);
                        return {
                            ...dashboard, group: selectedGroup?.name
                        }
                    });

                    setDashboards(updatedDashboardGroups);

                }
            })
            .finally(() => {
                setFetching(false);
            });

    }, [groupState?.groups]);

    React.useEffect(() => {
        setPaginationProps({ ...paginationProps, size: dashboards?.length });
    }, [dashboards]);

    React.useEffect(() => {
        if (location.search) {
            const search = queryString.parse(location.search);

            if (search?.page) {
                setPaginationProps({ ...paginationProps, value: Number(search.page) });
            }
        }
    }, [location])

    return (
        <div className="dashboard-container">
            <div className="px-3">
                <PageTitle title="Dashboard" />
            </div>
            <div className="d-flex flex-sm-row flex-column dashboards-holder">
                {fetching ? arrayTemp.map((key: number) =>
                    <div className="card dashboard-card" key={`loader${key}`}>
                        <div className="skeleton-loader skeleton-loader-fill rounded " />
                    </div>
                ) :
                    dashboards.length ?
                        dashboards?.map((localDashboard: DashboardDisplayModel) =>
                            <div className="card dashboard-card" key={localDashboard.id}>
                                <h4 className="card-header">
                                    {localDashboard.name}
                                </h4>
                                <div className="card-body">
                                    <h5 className="card-subtitle text-muted">{localDashboard.group}</h5>
                                    <p className="card-text">{localDashboard.description}.</p>
                                    <div className="controls-holder d-flex flex-row">
                                        <Link to={`#`} className="card-link" onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => onEditDashboard(e, localDashboard)}>
                                            <span className="icon-holder">
                                                <SvgElement type={icontypesEnum.PENCIL} />
                                                Edit
                                            </span>

                                        </Link>
                                        <Link to={`${HomeRoutes.DashboardItem?.toString()?.replace(":id", localDashboard.id)}`} className="card-link">
                                            <span className="icon-holder">
                                                <SvgElement type={icontypesEnum.COG} />
                                                Manage
                                            </span>

                                        </Link>
                                        <Link to={`#`} id="deleteDashbordBtn" className="card-link" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => onDeleteDashboardClick(e, localDashboard)}>
                                            <span className="icon-holder">
                                                <SvgElement type={icontypesEnum.TRASH} />
                                                Delete
                                            </span>

                                        </Link>
                                    </div>
                                </div>
                                <div className="card-footer text-muted">
                                    Last received date: {formatDateTime(localDashboard.creationDate)}
                                </div>
                            </div>
                        ) :
                        <div className="card dashboard-card empty-card">
                            <span className="text-primary text-primary">
                                Dashboard empty
                            </span>
                        </div>

                }

                <div className="card dashboard-card">
                    <Button disabled={loading || fetching} className="card-body" theme="outline-primary" label="Add" size="sm" name="btnAdd" onClick={onAddDashboard} />
                </div>

            </div>
            <Pagination
                className="pagination-holder"
                value={paginationProps.value}
                onChange={onPaginationChange}
                size={paginationProps.size}
                offset={paginationProps.offset}
                useFirstAndLast={true}
            />

            <PortalComponent>
                <Modal
                    {...modalProps}
                    onDismiss={() => setModalProps({ ...modalProps, toggle: false })}
                    header={<h4>{dashboard ? 'Edit Dashboard' : 'Add Dashboard'}</h4>}
                    body={
                        modalProps?.toggle ?
                            <AddDashboard
                                onSave={handleSave}
                                onCancel={onCancel}
                                loading={loading}
                                dashboard={dashboard}
                                authState={authState}
                            />
                            : null
                    }
                />


                <Modal
                    {...modalDeleteDashboardProps}
                    onDismiss={handleDismissDeleteDashboard}
                    header={modalDeleteDashboardProps?.toggle ? <h4>Delete {dashboard?.name} ?</h4> : null}
                    body={
                        modalDeleteDashboardProps?.toggle ?
                            <p>Are you sure you want to delete this ?</p>
                            : null
                    }
                    footer={
                        modalDeleteDashboardProps?.toggle ?
                            <div className="controls-holder d-flex flex-sm-row flex-column">
                                <Button label="Cancel" disabled={loading} theme="outline-primary" onClick={handleDismissDeleteDashboard} />
                                <Button label="Delete" theme="danger" onClick={handleDeleteDashboard}>
                                    {<Loader toggle={loading} size='sm' />}
                                </Button>
                            </div>
                            : null
                    }
                />
            </PortalComponent>
        </div >
    );
});

export default Dashboard;