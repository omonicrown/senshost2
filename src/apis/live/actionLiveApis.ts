import { AxiosPromise } from "axios";
import { ActionModel, PositiveResponse } from "../../interfaces/models";
import { AxiosGlobal } from "../shared/axios";
import configs from "../../configs";


export class ActionLiveApis extends AxiosGlobal {
    getActionsByAccountId(accountId: string): AxiosPromise<Array<ActionModel>> {
        return this.axios.get(`${configs.context}/${configs.apiList.Action}/account/${accountId}`);
    }

    createAction(action: ActionModel): AxiosPromise<ActionModel> {
        return this.axios.post(`${configs.context}/${configs.apiList.Action}`, action);
    }

    updateAction(action: ActionModel): AxiosPromise<ActionModel> {
        return this.axios.put(`${configs.context}/${configs.apiList.Action}/${action?.id}`, action);
    }

    deleteAction(id: string): AxiosPromise<PositiveResponse> {
        return this.axios.delete(`${configs.context}/${configs.apiList.Action}/${id}`);
    }
}