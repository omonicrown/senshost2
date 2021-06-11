import { AxiosPromise } from "axios";
import configs from "../configs";
import { AuthResponseModel, HttpBasicAuth, Account, PositiveResponse } from "../interfaces/models";
import { AuthLiveApis } from "./live/authLiveApis";



export class AuthApis {
    private static authApi: AuthLiveApis = new AuthLiveApis();

    static login(info: HttpBasicAuth): AxiosPromise<AuthResponseModel> {
        if (configs.type === "LOCAL") {
            return {} as AxiosPromise;
        } else {
            return this.authApi.loginUser(info);
        }
    }

    static signup(user: Account): AxiosPromise<PositiveResponse> {
        if (configs.type === "LOCAL") {
            return {} as AxiosPromise;
        } else {
            return this.authApi.signupUser(user);
        }
    }
}