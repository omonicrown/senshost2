import { AxiosPromise } from "axios";
import configs from "../configs";
import { PositiveResponse, ActuatorModel, ActionModel } from "../interfaces/models";
import { ActionLiveApis } from "./live/actionLiveApis";


export class ActionApis {
    private static actionApis: ActionLiveApis = new ActionLiveApis();

    static getActionsByAccountId(accountId: string): AxiosPromise<Array<ActionModel>>{
        if (configs.type === "LOCAL") {
            return {} as AxiosPromise;
        } else {
            return this.actionApis.getActionsByAccountId(accountId);
        }
    }

    static createAction(action: ActionModel): AxiosPromise<ActionModel> {
        if (configs.type === "LOCAL") {
            return {} as AxiosPromise;
        } else {
            return this.actionApis.createAction(action);
        }
    }

    static updateAction(action: ActionModel): AxiosPromise<ActionModel> {
        if (configs.type === "LOCAL") {
            return {} as AxiosPromise;
        } else {
            return this.actionApis.updateAction(action);
        }
    }

    static deleteAction(id: string): AxiosPromise<PositiveResponse> {
        if (configs.type === "LOCAL") {
            return {} as AxiosPromise;
        } else {
            return this.actionApis.deleteAction(id);
        }
    }
}
