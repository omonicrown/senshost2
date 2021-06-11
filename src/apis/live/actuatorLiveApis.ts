import { AxiosGlobal } from "../shared/axios";
import { AxiosPromise } from "axios";
import { PositiveResponse, ActuatorModel } from "../../interfaces/models";
import configs from "../../configs";


export class ActuatorLiveApis extends AxiosGlobal {
    getActuatorsByDeviceId(deviceId: string): AxiosPromise<Array<ActuatorModel>> {
        return this.axios.get(`${configs.context}/${configs.apiList.Actuator}/device/${deviceId}`);
    }

    updateActuatorById(id: string, actuator: ActuatorModel): AxiosPromise<ActuatorModel> {
        return this.axios.put(`${configs.context}/${configs.apiList.Actuator}/${id}`, actuator);
    }

    deleteActuatorById(id: string): AxiosPromise<PositiveResponse> {
        return this.axios.delete(`${configs.context}/${configs.apiList.Actuator}/${id}`)
    }

    createActuator(actuator): AxiosPromise<ActuatorModel> {
        return this.axios.post(`${configs.context}/${configs.apiList.Actuator}`, actuator);
    }
} 