import { ErrorModel } from "./states";
import { AuthResponseModel, DeviceModel, GroupModel } from "./models";

import { NotificationProps } from "@sebgroup/react-components/dist/notification/Notification";
import { AxiosError } from "axios";


export interface AccountActions {
    type: string;
    error?: ErrorModel;
    account?: Account;
}

export interface AuthActions {
    type: string;
    error?: ErrorModel;
    auth?: AuthResponseModel;
}

export interface NotificationActions {
    type: string;
    notification: NotificationProps
}

export interface GroupActions {
    type: string;
    groups?: Array<GroupModel>;
    error?: AxiosError;

}


export interface DeviceActions {
    type: string;
    devices?: Array<DeviceModel>;
    error?: AxiosError;

}