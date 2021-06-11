import { AxiosPromise } from "axios";
import configs from "../configs";
import { PositiveResponse, GroupModel } from "../interfaces/models";
import { GroupLiveApis } from "./live/groupLiveApis";


export class GroupApis {
    private static groupApis: GroupLiveApis = new GroupLiveApis();

    static createGroup(group: GroupModel): AxiosPromise<GroupModel> {
        if (configs.type === "LOCAL") {
            return {} as AxiosPromise;
        } else {
            return this.groupApis.createGroup(group);
        }
    }

    static updateGroup(group: GroupModel): AxiosPromise<GroupModel> {
        if (configs?.type === "LOCAL") {
            return {} as AxiosPromise;
        } else {
            return this.groupApis.updateGroup(group);
        }
    }

    static deleteGroup(groupId?: string): AxiosPromise {
        if (configs?.type === "LOCAL") {
            return {} as AxiosPromise;
        } else {
            return this.groupApis.deleteGroup(groupId);
        }
    }

    static getGroupById(groupId: string): AxiosPromise<GroupModel> {
        if (configs.type === "LOCAL") {
            return {} as AxiosPromise;
        } else {
            return this.groupApis.getGroupById(groupId);
        }
    }

    static getGroupsByAccount(account: string): AxiosPromise<Array<GroupModel>> {
        if (configs.type === "LOCAL") {
            return {} as AxiosPromise;
        } else {
            return this.groupApis.getGroupByAccount(account);
        }
    }
}