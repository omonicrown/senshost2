import { AxiosGlobal } from "../shared/axios";
import { AxiosPromise } from "axios";
import { PositiveResponse, GroupModel, SensorModel, SensorValue } from "../../interfaces/models";
import configs from "../../configs";


export class SensorLiveApis extends AxiosGlobal {
    getSensorsByDeviceId(deviceId: string): AxiosPromise<Array<SensorModel>> {
        return this.axios.get(`${configs.context}/${configs.apiList.Sensor}/device/${deviceId}`);
    }

    getSensorValuesById(sensorId: string): AxiosPromise<Array<SensorValue>> {
        return this.axios.get(`${configs.context}/${configs.apiList.SensorValue}/field/${sensorId}`);
    }

    updateSensorsByDeviceId(deviceId: string): AxiosPromise<Array<SensorModel>> {
        return this.axios.put(`${configs.context}/${configs.apiList.Sensor}/device/${deviceId}`);
    }


    deleteSensorById(id: string): AxiosPromise<PositiveResponse> {
        return this.axios.delete(`${configs.context}/${configs.apiList.Sensor}/${id}`);
    }


    updateSensorById(id: string, sensor: SensorModel): AxiosPromise<SensorModel> {
        return this.axios.put(`${configs.context}/${configs.apiList.Sensor}/${id}`, sensor);
    }

    createSensor(sensor: SensorModel): AxiosPromise<SensorModel> {
        return this.axios.post(`${configs.context}/${configs.apiList.Sensor}`, sensor);
    }
} 