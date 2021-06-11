import { createBrowserHistory } from 'history';

//API CALL TYPE
const TYPE_LOCAL = "LOCAL";
const TYPE_REST = "REST";

//resources
const API_URL = process.env.NODE_ENV === "production" ? "" : "http://senshost.com:8015/api";
const SOCKET_URL = 'mqtt://senshost.com';
//API contexts
//We will pass this to swagger class constractor if we need different base urls
const DEFAULT = '';
const SECONDARY = '/something';

export enum APILIST {
    AUTH = "Auth",
    ACCOUNT = 'Account',
    DEVICE = 'Device',
    Group = 'Group',
    Sensor = 'DataField',
    SensorValue = 'DataValue',
    Actuator = 'actuator',
    Action = 'Action',
    User = 'User',
    Dashboard = 'dashboard',
    DashboardItem = 'dashboardItem',
    Trigger = 'Trigger'
}

//CONFIG DATA (Please change here only)
const configs = {
    delay: 500,
    port: 8015,
    appName: "senhost",
    toastDelay: 5000,
    tokenStorage: "TOKEN_PERSIST",
    socket: SOCKET_URL,
    type: TYPE_REST,
    context: API_URL,
    history: createBrowserHistory(),
    requestTimeOut: 30000,
    apiList: APILIST,
    tablePageSize: 10
}
export default configs;
