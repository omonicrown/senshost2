import { AxiosGlobal } from "../shared/axios";
import { AxiosRequestConfig, AxiosPromise } from "axios";
import { AuthResponseModel, HttpBasicAuth, Account, PositiveResponse } from "../../interfaces/models";
import configs from "../../configs";


export class AuthLiveApis extends AxiosGlobal {
    loginUser(auth: HttpBasicAuth): AxiosPromise<AuthResponseModel> {
        let axiosConfig: AxiosRequestConfig = {
            auth,
            headers: { callerType: 'web' }
        };
        return this.axios.get(`${configs.context}/${configs.apiList.AUTH}/login`, axiosConfig);
    }

    signupUser(user: Account): AxiosPromise<PositiveResponse> {
        return this.axios.post(`${configs.context}/${configs.apiList.AUTH}/signup`, null, { params: { ...user } });
    }

}