import { AxiosGlobal } from "../shared/axios";
import { AxiosPromise } from "axios";
import { PositiveResponse, GroupModel } from "../../interfaces/models";
import configs from "../../configs";


export class GroupLiveApis extends AxiosGlobal {
    getGroupById(groupId: string): AxiosPromise<GroupModel> {
        return this.axios.get(`${configs.context}/${configs.apiList.Group}/${groupId}`);
    }

    updateGroup(group: GroupModel): AxiosPromise<GroupModel> {
        return this.axios.put(`${configs.context}/${configs.apiList.Group}/${group?.id}`, group);
    }

    createGroup(group: GroupModel): AxiosPromise<GroupModel> {
        return this.axios.post(`${configs.context}/${configs.apiList.Group}`, group);
    }

    deleteGroup(groupId?: string): AxiosPromise {
        return this.axios.delete(`${configs.context}/${configs.apiList.Group}/${groupId}`);
    }

    getGroupByAccount(account: string): AxiosPromise<Array<GroupModel>> {
        return this.axios.get(`${configs.context}/${configs.apiList.Group}/account/${account}`);
    }
} 