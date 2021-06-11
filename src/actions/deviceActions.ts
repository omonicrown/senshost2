import { Dispatch } from "redux";

import * as constants from '../constants';
import { DeviceActions } from '../interfaces/actions';
import { DeviceModel } from '../interfaces/models';
import { AxiosResponse, AxiosError } from 'axios';
import { DeviceApis } from "../apis/deviceApis";

export function receiveDevices(devices: Array<DeviceModel>): DeviceActions {
    return {
        type: constants.RECEIVE_DEVICES,
        devices,
    }
}

export function logGroupsError(error: AxiosError): DeviceActions {
    return {
        type: constants.LOG_GROUP_ERROR,
        error,
    }
}

export const getDevicesByAccount = (account: string) => {
    return (dispatch: Dispatch<DeviceActions | any>) => {
        return DeviceApis.getDevicesByAccount(account)
            .then((json: AxiosResponse<Array<DeviceModel>>) => {
                if (json?.data) {
                    dispatch(receiveDevices(json.data));
                }
            })
            .catch((err: AxiosError) => dispatch(logGroupsError(err)));
    };
}

export type deviceActions = DeviceActions;