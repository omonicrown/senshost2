import { NotificationProps } from "@sebgroup/react-components/dist/notification/Notification";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Dispatch } from "redux";
import { AuthState, States } from "../interfaces/states";
import { History } from "history";
import { toggleNotification } from "../actions";
import { AppRoutes } from "../enums/routes";

const requireLogin: React.FC = () => {
    const authState: AuthState = useSelector((states: States) => states?.auth);
    const dispatch: Dispatch = useDispatch();

    const history: History = useHistory();

    React.useEffect(() => {
        if (!authState?.auth?.identityToken) {
            const notification: NotificationProps = {
                theme: "danger",
                title: "Unauthenticated user",
                message: `Please login to proceed`,
                onDismiss: () => { },
                toggle: true
            };

            dispatch(toggleNotification(notification));
            history.replace(AppRoutes.Account);
        }
    }, [authState]);


    return null

};

export default requireLogin;