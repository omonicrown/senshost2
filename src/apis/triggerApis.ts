import { AxiosPromise } from "axios";
import configs from "../configs";
import { PositiveResponse, TriggerModel } from "../interfaces/models";
import { TriggerLiveApis } from "./live/triggerLiveApis";


export class TriggerApis {
    private static triggerApis: TriggerLiveApis = new TriggerLiveApis();

    static getTriggerById(id: string): AxiosPromise<TriggerModel> {
        if (configs.type === "LOCAL") {
            return {} as AxiosPromise;
        } else {
            return this.triggerApis.getTriggerById(id);
        }
    }

    static getTriggersByAccountId(accountId: string): AxiosPromise<Array<TriggerModel>> {
        if (configs.type === "LOCAL") {
            return {} as AxiosPromise;
        } else {
            return this.triggerApis.getTriggersByAccountId(accountId);
        }
    }

    static createTrigger(trigger: TriggerModel): AxiosPromise<TriggerModel> {
        if (configs.type === "LOCAL") {
            return {} as AxiosPromise;
        } else {
            return this.triggerApis.createTrigger(trigger);
        }
    }

    static updateTriggerById(trigger: TriggerModel): AxiosPromise<TriggerModel> {
        if (configs.type === "LOCAL") {
            return {} as AxiosPromise;
        } else {
            return this.triggerApis.updateTriggerById(trigger);
        }
    }

    static deleteTriggerById(triggerId: string): AxiosPromise<PositiveResponse> {
        if (configs.type === "LOCAL") {
            return {} as AxiosPromise;
        } else {
            return this.triggerApis.deleteTriggerById(triggerId);
        }
    }
}