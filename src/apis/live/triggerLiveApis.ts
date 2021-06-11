import { AxiosGlobal } from "../shared/axios";
import { AxiosPromise } from "axios";
import { PositiveResponse, TriggerModel } from "../../interfaces/models";
import configs from "../../configs";


export class TriggerLiveApis extends AxiosGlobal {
    getTriggerById(id: string): AxiosPromise<TriggerModel> {
        return this.axios.get(`${configs.context}/${configs.apiList.Trigger}/${id}`);
    }

    getTriggersByAccountId(accountId: string): AxiosPromise<Array<TriggerModel>> {
        return this.axios.get(`${configs.context}/${configs.apiList.Trigger}/account/${accountId}`);

    }

    createTrigger(trigger: TriggerModel): AxiosPromise<TriggerModel> {
        return this.axios.post(`${configs.context}/${configs.apiList.Trigger}`, trigger);
    }

    updateTriggerById(trigger: TriggerModel): AxiosPromise<TriggerModel> {
        return this.axios.put(`${configs.context}/${configs.apiList.Trigger}/${trigger?.id}`, trigger);
    }

    deleteTriggerById(triggerId: string): AxiosPromise<PositiveResponse> {
        return this.axios.delete(`${configs.context}/${configs.apiList.Trigger}/${triggerId}`);
    }
}