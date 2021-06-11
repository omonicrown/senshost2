import { Modal, ModalProps } from '@sebgroup/react-components/dist/Modal/Modal';
import { AxiosResponse } from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardApis } from '../../apis/dashboardApis';
import { ChartType, initialState } from '../../constants';
import { DashboardItemModel, DashboardModel, PositiveResponse } from '../../interfaces/models';
import { States } from '../../interfaces/states';
import { Dispatch } from "redux";
import { History } from "history";

import ItemChart from "./section/ItemChart";

import { toggleNotification } from '../../actions';
import { NotificationProps } from '@sebgroup/react-components/dist/notification/Notification';
import { match, useHistory, useRouteMatch } from 'react-router';
import { Breadcrumb } from '@sebgroup/react-components/dist/Breadcrumb/Breadcrumb';
import { Button } from '@sebgroup/react-components/dist/Button';
import { HomeRoutes } from '../../enums/routes';
import PortalComponent from '../shared/Portal';

import AddDashboardItem from "./modals/AddDashboardItem";

import CardAction from './modals/CardAction';
import { Loader } from '@sebgroup/react-components/dist/Loader';
import { formatDateTime } from '../../utils/functions';


const DashboardItem: React.FC = () => {
    const [dashboardItems, setDashboardItems] = React.useState<Array<DashboardItemModel>>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [toggleAction, setToggleAction] = React.useState<boolean>(false);

    const [fetching, setFetching] = React.useState<boolean>(false);
    const [modalProps, setModalProps] = React.useState<ModalProps>({ ...initialState, size: 'modal-lg' });
    const [modalDeleteItemProps, setModalDeleteItemProps] = React.useState<ModalProps>({ ...initialState, size: 'modal-sm' });


    const [dashboard, setDashboard] = React.useState<DashboardModel>(null);
    const [dashboardItem, setDashboardItem] = React.useState<DashboardItemModel>(null);

    const match: match = useRouteMatch();
    const history: History = useHistory();

    const dashboardId: string = React.useMemo(() => match?.params["id"], [match?.params]);

    const breadcrumbList: Array<string> = React.useMemo(() => {
        return ['Dashboard list', dashboard?.name || dashboardId];
    }, [dashboardId, dashboard]);

    const onEditDashboardItem = React.useCallback((e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, dashboardItem: DashboardItemModel) => {
        setDashboardItem(dashboardItem);
        setModalProps({ ...modalProps, toggle: true });
    }, [modalProps]);

    const onDeleteDashboardItem = React.useCallback((e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, dashboardItem: DashboardItemModel) => {
        setDashboardItem(dashboardItem);
        setModalDeleteItemProps({ ...modalDeleteItemProps, toggle: true });
    }, [modalDeleteItemProps]);

    const onAddDashboardItem = React.useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setDashboardItem(null);
        setModalProps({ ...modalProps, toggle: true });
    }, [modalProps]);

    const onBreadcrumbClick = React.useCallback((i: number) => {
        if (i === 0) {
            history.push(HomeRoutes.Dashboard.toString());
        }
    }, [history]);

    const arrayTemp: Array<number> = React.useMemo(() => [1, 2, 3, 4], []);

    const authState = useSelector((states: States) => states.auth);
    const dispatch: Dispatch = useDispatch();

    const onCancel = React.useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setModalProps({ ...modalProps, toggle: false });
    }, [modalProps]);

    const handleSave = React.useCallback((e: React.FormEvent<HTMLFormElement>, dashboardItem: DashboardItemModel) => {
        setDashboardItems([...dashboardItems, dashboardItem]);
        const notification: NotificationProps = {
            theme: "success",
            title: "Dashboard item added",
            message: `Dashboard item added successfully`,
            toggle: true,
            onDismiss: () => { }
        };
        dispatch(toggleNotification(notification));
        setModalProps({ ...modalProps, toggle: false });

    }, [dashboardItems, modalProps]);

    const handleUpdateItem = React.useCallback((e: React.FormEvent<HTMLFormElement>, dashboardItem: DashboardItemModel) => {
        const updatedItems: Array<DashboardItemModel> = dashboardItems?.map((item: DashboardItemModel) => {
            if (item?.id === dashboardItem?.id) {
                return dashboardItem;
            }
            return item;
        })
        setDashboardItems(updatedItems);
        const notification: NotificationProps = {
            theme: "success",
            title: "Dashboard Item update",
            message: `Dashboard item updated successfully`,
            toggle: true,
            onDismiss: () => { }
        };
        dispatch(toggleNotification(notification));
        setModalProps({ ...modalProps, toggle: false });

    }, [dashboardItems, modalProps]);

    const handleDeleteItem = React.useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setLoading(true);
        DashboardApis.deleteDashboardItemById(dashboardItem?.id)
            .then((response: AxiosResponse<PositiveResponse>) => {
                const indexOfItemToBeRemoved: number = dashboardItems?.findIndex((item: DashboardItemModel) => item.id === dashboardItem?.id);

                const updatedItems: Array<DashboardItemModel> = [
                    ...dashboardItems.slice(0, indexOfItemToBeRemoved),
                    ...dashboardItems?.slice(indexOfItemToBeRemoved + 1)
                ];

                setDashboardItems(updatedItems);
                const notification: NotificationProps = {
                    theme: "success",
                    title: "Dashboard Item delete",
                    message: `Dashboard item deleted successfully`,
                    toggle: true,
                    onDismiss: () => { }
                };
                dispatch(toggleNotification(notification));
                setModalDeleteItemProps({ ...modalDeleteItemProps, toggle: false });
            })
            .finally(() => {
                setLoading(false);
                setDashboardItem({} as DashboardItemModel)
            });
    }, [modalDeleteItemProps, dashboardItems, dashboardItem]);

    const handleDismissDeleteDashboardItem = React.useCallback((e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setModalDeleteItemProps({ ...modalDeleteItemProps, toggle: false });
        setDashboardItem({} as DashboardItemModel)
    }, [modalDeleteItemProps]);

    React.useEffect(() => {
        setFetching(true);
        DashboardApis.getDashboardItemsByDashboardId(dashboardId)
            .then((response: AxiosResponse<Array<DashboardItemModel>>) => {
                if (response.data) {
                    setDashboardItems(response.data);
                }
            })
            .finally(() => {
                setFetching(false);
            });

        DashboardApis.getDashboardById(dashboardId)
            .then((response: AxiosResponse<DashboardModel>) => {
                if (response.data) {
                    setDashboard(response.data);
                }
            })
            .finally(() => {
                setFetching(false);
            });

    }, [dashboardId]);

    return (
        <div className="dashboard-item-container" onClick={() => { setToggleAction(!toggleAction); }}>
            <Breadcrumb className="dashboard-breadcrumb" id="2" list={breadcrumbList} onClick={onBreadcrumbClick} />
            <div className="d-flex flex-sm-row flex-column dashboards-holder">
                {fetching ? arrayTemp.map((key: number) =>
                    <div className="card dashboard-card" key={`loader${key}`}>
                        <div className="skeleton-loader skeleton-loader-fill rounded " />
                    </div>
                ) :
                    <div className="row no-gutters">
                        {
                            dashboardItems.length ?
                                dashboardItems?.map((dashboardItem: DashboardItemModel, index: number) =>
                                    <div className={"card dashboard-card " + (dashboardItem?.type === ChartType.LineGraph || dashboardItem?.type === ChartType.BarGraph ? "col-4 wide-card" : "col-3")} key={dashboardItem?.id}>
                                        <h4 className="card-header">
                                            {dashboardItem.name}
                                            <div className="float-right">
                                                <CardAction
                                                    toggle={toggleAction}
                                                    onDeleteCardItem={onDeleteDashboardItem}
                                                    onEditCardItem={onEditDashboardItem}
                                                    dashboardItem={dashboardItem}
                                                />
                                            </div>
                                        </h4>
                                        <div className="card-body">
                                            <div className="chart-holder">
                                                <ItemChart {...dashboardItem} />
                                            </div>
                                        </div>
                                        <div className="card-footer text-muted">
                                            Last received date: {formatDateTime(dashboardItem?.creationDate)}
                                        </div>
                                    </div>
                                ) :
                                <div className="card dashboard-card empty-card">
                                    <span className="text-primary text-primary">
                                        Dashboard empty
                                    </span>
                                </div>
                        }
                    </div>

                }

                <div className="card dashboard-card">
                    <Button disabled={loading || fetching} className="card-body" theme="outline-primary" label="Add" size="sm" name="btnAdd" onClick={onAddDashboardItem} />
                </div>
            </div>

            <PortalComponent>
                <Modal
                    {...modalProps}
                    onDismiss={() => setModalProps({ ...modalProps, toggle: false })}
                    header={<h4>{dashboardItem?.id ? `Edit ${dashboardItem?.name}` : 'Add Dashboard Item'}</h4>}
                    body={
                        modalProps?.toggle ?
                            <AddDashboardItem
                                onSave={handleSave}
                                onUpdate={handleUpdateItem}
                                onCancel={onCancel}
                                loading={loading}
                                dashboardItem={dashboardItem}
                                authState={authState}
                                dashboardId={dashboardId}
                            />

                            : null
                    }
                />

                <Modal
                    {...modalDeleteItemProps}
                    onDismiss={handleDismissDeleteDashboardItem}
                    header={modalDeleteItemProps?.toggle ? <h4>Delete {dashboardItem?.name} ?</h4> : null}
                    body={
                        modalDeleteItemProps?.toggle ?
                            <p>Are you sure you want to delete this ?</p>
                            : null
                    }
                    footer={
                        modalDeleteItemProps?.toggle ?
                            <div className="controls-holder d-flex flex-sm-row flex-column">
                                <Button label="Cancel" disabled={loading} theme="outline-primary" onClick={handleDismissDeleteDashboardItem} />
                                <Button label="Delete" theme="danger" onClick={handleDeleteItem}>
                                    {<Loader toggle={loading} size='sm' />}
                                </Button>
                            </div>
                            : null
                    }
                />
            </PortalComponent>
        </div >
    );
};

export default DashboardItem;