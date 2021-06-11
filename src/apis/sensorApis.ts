import { AxiosPromise } from "axios";
import configs from "../configs";
import { PositiveResponse, SensorModel, SensorValue } from "../interfaces/models";
import { SensorLiveApis } from "./live/sensorLiveApis";


export class SensorApis {
    private static sensorApis: SensorLiveApis = new SensorLiveApis();

    static getSensorsByDeviceId(deviceId: string): AxiosPromise<Array<SensorModel>> {
        if (configs.type === "LOCAL") {
            return {} as AxiosPromise;
        } else {
            return this.sensorApis.getSensorsByDeviceId(deviceId);
        }
    }

    static createSensor(sensor: SensorModel): AxiosPromise<SensorModel> {
        if (configs.type === "LOCAL") {
            return {} as AxiosPromise;
        } else {
            return this.sensorApis.createSensor(sensor);
        }
    }

    static updateSensorsByDeviceId(deviceId: string): AxiosPromise<Array<SensorModel>> {
        if (configs.type === "LOCAL") {
            return {} as AxiosPromise;
        } else {
            return this.sensorApis.updateSensorsByDeviceId(deviceId);
        }
    }

    static deleteSensorById(id: string): AxiosPromise<PositiveResponse> {
        if (configs.type === "LOCAL") {
            return {} as AxiosPromise;
        } else {
            return this.sensorApis.deleteSensorById(id);
        }
    }

    static updateSensorsById(id: string, sensor: SensorModel): AxiosPromise<SensorModel> {
        if (configs.type === "LOCAL") {
            return {} as AxiosPromise;
        } else {
            return this.sensorApis.updateSensorById(id, sensor);
        }
    }

    static getSensorValuesById(id: string): AxiosPromise<Array<SensorValue>> {
        if (configs.type === "LOCAL") {
            return {} as AxiosPromise;
        } else {
            return this.sensorApis.getSensorValuesById(id);
        }
    }
}