import { AxiosPromise } from "axios";
import configs from "../../configs";
import { DashboardItemModel, DashboardModel, PositiveResponse } from "../../interfaces/models";
import { AxiosGlobal } from "../shared/axios";


export class DashboardLiveApis extends AxiosGlobal {

    getDashboardsByAccountId(accountId: string): AxiosPromise<Array<DashboardModel>> {
        return this.axios.get(`${configs.context}/${configs.apiList.Dashboard}/account/${accountId}`);
    }

    getDashboardById(id: string): AxiosPromise<DashboardModel> {
        return this.axios.get(`${configs.context}/${configs.apiList.Dashboard}/${id}`);
    }

    addDashboard(dashboard: DashboardModel): AxiosPromise<DashboardModel> {
        return this.axios.post(`${configs.context}/${configs.apiList.Dashboard}`, dashboard);
    }

    editDashboardById(dashboard: DashboardModel): AxiosPromise<DashboardModel> {
        return this.axios.put(`${configs.context}/${configs.apiList.Dashboard}/${dashboard.id}`, dashboard);
    }

    deleteDashboardById(id: string): AxiosPromise<PositiveResponse> {
        return this.axios.delete(`${configs.context}/${configs.apiList.Dashboard}/${id}`);
    }

    getDashboardItemsByDashboardId(dashboardId: string): AxiosPromise<Array<DashboardItemModel>> {
        return this.axios.get(`${configs.context}/${configs.apiList.DashboardItem}/dashboard/${dashboardId}`);
    }

    addDashboardItem(dashboardItem: DashboardItemModel): AxiosPromise<DashboardItemModel> {
        return this.axios.post(`${configs.context}/${configs.apiList.DashboardItem}`, dashboardItem);
    }

    updateDashboardItemById(dashboardItem: DashboardItemModel): AxiosPromise<DashboardItemModel> {
        return this.axios.put(`${configs.context}/${configs.apiList.DashboardItem}/${dashboardItem?.id}`, dashboardItem);
    }

    deleteDashboardItemById(id: string): AxiosPromise<PositiveResponse> {
        return this.axios.delete(`${configs.context}/${configs.apiList.DashboardItem}/${id}`);
    }

}