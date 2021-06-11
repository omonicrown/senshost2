import Axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";
import configs from '../../configs';
import { History } from 'history';
import { navigate } from '../../utils/navigateUtil';
import { AppRoutes } from '../../enums/routes';

import { store } from "../../store/configureStore";
import { toggleNotification, signoutUser } from '../../actions';
import { NotificationProps } from "@sebgroup/react-components/dist/notification/Notification";
import { AuthState } from "../../interfaces/states";


export class AxiosGlobal {
    private _token: string;
    private _requestType: string
    public axios: AxiosInstance;
    private history: History;

    toJSON(strOrObject: string | object): object {
        if (typeof strOrObject === "object") {
            return strOrObject;
        } else if (typeof strOrObject === "string") {
            return this.toJSON(JSON.parse(strOrObject));
        } else {
            return strOrObject;
        }
    }

    get requestType() {
        return this._requestType;
    }

    set requestType(type: string) {
        this._requestType = type;
        this.axios.defaults.headers["Content-Type"] = type;
    }

    constructor() {
        const tokenObj: AuthState = store.getState().auth;
        this.history = configs.history;
        let headers = {
            'Content-Type': 'application/json',
            callerType: 'web'
        };

        if (tokenObj?.auth?.identityToken) {
            headers['Authorization'] = `JWT ${tokenObj?.auth?.identityToken}`;
        }

        this.axios = Axios.create({
            baseURL: `${configs.context}/api`,
            timeout: configs.requestTimeOut,
            headers: headers
        });
        // Add a request interceptor
        this.axios.interceptors.request.use((config) => {
            return config;
        }, (error: AxiosError) => {
            if (error.request && error.request.data) {
                return Promise.reject(error.request);
            } else {
                return Promise.reject(error);

            }
        });

        // Add a response interceptor
        this.axios.interceptors.response.use((response: AxiosResponse) => {
            return response;
        }, (error: AxiosError) => {
            if (error && error.response && error.response.status && (error.response.status === 401)) {
                const notification: NotificationProps = {
                    theme: "danger",
                    title: "unAuthenticated",
                    message: `Please login to proceed`,
                    toggle: true,
                    onDismiss: () => { }
                };
                if (error?.response?.data?.message || error?.response?.data?.ErrorMessage) {
                    if (error.response.data.name && error.response.data.name === 'TokenExipredError') {
                        store.dispatch(signoutUser());
                    }
                    notification.message = error.response.data.message || error.response.data?.ErrorMessage;
                }
                store.dispatch(toggleNotification(notification));
                store.dispatch(signoutUser());

                navigate(AppRoutes.Account, true);
                return Promise.reject({ ...error });
            } else if (error && error.response && error.response.status === 403) {
                const notification: NotificationProps = {
                    theme: "danger",
                    title: "Unauthorized",
                    message: `You dont have permisiion to access this action`,
                    toggle: true,
                    onDismiss: () => { }
                };
                if (error?.response?.data?.message || error?.response?.data?.ErrorMessage) {
                    notification.message = error.response.data.message || error.response.data.ErrorMessage;
                }
                store.dispatch(toggleNotification(notification));
                return Promise.reject({ ...error });
            } else if (error && error.response && error.response.status === 400) {
                const notification: NotificationProps = {
                    theme: "danger",
                    title: "Validation Error",
                    message: `One of the field validations failed!`,
                    toggle: true,
                    onDismiss: () => { }
                };

                if (error && Array.isArray(error?.response?.data)) {
                    const arrayOfErrors = error.response.data.map((item: { ErrorMessage: string }) => item?.ErrorMessage);
                    notification.message = arrayOfErrors.join(", ");
                } else if (error?.response?.data?.ErrorMessage) {
                    notification.message = error.response.data?.ErrorMessage;
                } else if (error?.response?.data) {
                    notification.message = error.response.data;
                }

                store.dispatch(toggleNotification(notification));

                return Promise.reject(error);
            } else if (error?.response?.status === 404) {
                const notification: NotificationProps = {
                    theme: "danger",
                    title: "Record not found",
                    message: `Record not found!`,
                    toggle: true,
                    onDismiss: () => { }
                };

                if (error && Array.isArray(error.response.data)) {
                    const arrayOfErrors = error.response.data.map((item: { ErrorMessage: string }) => item.ErrorMessage);
                    notification.message = arrayOfErrors.join(", ");
                } else if (error && error.response && error.response.data && error.response.data?.ErrorMessage) {
                    notification.message = error.response.data.ErrorMessage;
                }

                store.dispatch(toggleNotification(notification));

                return Promise.reject(error);
            } else if (error && error.response && error.response.status === 500) {
                const notification: NotificationProps = {
                    theme: "danger",
                    title: "Server Down!",
                    message: `Internal server error!`,
                    toggle: true,
                    onDismiss: () => { }
                };
                store.dispatch(toggleNotification(notification));

                return Promise.reject(error);
            } else {
                return Promise.reject(error);
            }
        });
    }
}