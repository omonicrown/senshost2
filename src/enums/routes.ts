


export enum AppRoutes {
    Home = "/home",
    Account = "/account",
}

export enum HomeRoutes {
    Devices = AppRoutes.Home + "/devices",
    Dashboard = AppRoutes.Home + "/dashboard",
    DashboardItem = AppRoutes.Home + "/dashboard/:id",
    Groups = AppRoutes.Home + "/groups",
    Users = AppRoutes.Home + "/users",
    Actions = AppRoutes.Home + "/Actions",
    Rules = AppRoutes.Home + "/Rules",
    Triggers = AppRoutes.Home + "/triggers",
}

export enum TriggerRoutes {
    EditTrigger = HomeRoutes.Triggers + "/:triggerId",
    CreateTrigger = HomeRoutes.Triggers + "/create"
}

export enum GroupRoutes {
    ViewGroupdetails = HomeRoutes.Groups + "/:groupId"
}

export enum ViewDeviceRoutes {
    ViewDevice = HomeRoutes.Devices + "/:deviceId",
}