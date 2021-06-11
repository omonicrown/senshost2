import { AxiosPromise } from "axios";
import configs from "../configs";
import { PositiveResponse, GroupModel, UserModel } from "../interfaces/models";
import { UserLiveApis } from "./live/userLiveApis";


export class UserApis {
    private static userApis: UserLiveApis = new UserLiveApis();

    static createUser(user: UserModel): AxiosPromise<UserModel> {
        if (configs.type === "LOCAL") {
            return {} as AxiosPromise;
        } else {
            return this.userApis.createUser(user);
        }
    }

    static updateUser(user: UserModel): AxiosPromise<UserModel> {
        if (configs.type === "LOCAL") {
            return {} as AxiosPromise;
        } else {
            return this.userApis.updateUser(user);
        }
    }

    static deleteUser(userId: string): AxiosPromise {
        if (configs.type === "LOCAL") {
            return {} as AxiosPromise;
        } else {
            return this.userApis.deleteUser(userId);
        }
    }
    
    static getUsersByGroupId(groupId: string): AxiosPromise<UserModel[]> {
        if (configs.type === "LOCAL") {
            return {} as AxiosPromise;
        } else {
            return this.userApis.getUsersByGroupId(groupId);
        }
    }

    static getUsersByAccountId(account: string): AxiosPromise<Array<UserModel>> {
        if (configs.type === "LOCAL") {
            return {} as AxiosPromise;
        } else {
            return this.userApis.getUsersByAccount(account);
        }
    }
}