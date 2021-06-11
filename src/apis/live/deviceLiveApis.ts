import { AxiosGlobal } from "../shared/axios";
import { AxiosPromise } from "axios";
import { Account, PositiveResponse, DeviceModel } from "../../interfaces/models";
import configs from "../../configs";


export class DeviceLiveApis extends AxiosGlobal {
    createDevice(device: DeviceModel): AxiosPromise<DeviceModel> {
        return this.axios.post(`${configs.context}/${configs.apiList.DEVICE}`, device);
    }

    updateDevice(device: DeviceModel): AxiosPromise<DeviceModel> {
        return this.axios.put(`${configs.context}/${configs.apiList.DEVICE}/${device?.id}`, device);
    }

    getDevicesByAccount(account: string): AxiosPromise<Array<DeviceModel>> {
        return this.axios.get(`${configs.context}/${configs.apiList.DEVICE}/account/${account}`);
    }

    getDeviceById(deviceId: string): AxiosPromise<DeviceModel> {
        return this.axios.get(`${configs.context}/${configs.apiList.DEVICE}/${deviceId}`);
    }

    deleteDeviceById(deviceId: string): AxiosPromise<DeviceModel> {
        return this.axios.delete(`${configs.context}/${configs.apiList.DEVICE}/${deviceId}`);
    }
} 