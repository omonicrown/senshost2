import * as React from "react"
import { useDispatch, useSelector } from "react-redux";
import PortalComponent from "./Portal";
import { Notification } from "@sebgroup/react-components/dist/Notification";
import { States } from "../../interfaces/states";
import { TOGGLE_NOTIFICATION } from "../../constants";


const NotificationHook: React.FunctionComponent = (): React.ReactElement<void> => {
    const notificationState = useSelector((state: States) => state.notification);
    const dispatch = useDispatch();

    const onDismissNotification = (): void => {
        dispatch({ type: TOGGLE_NOTIFICATION, notification: {...notificationState?.notification, toggle: false} });
    }

    return (
        <PortalComponent>
            <Notification
                toggle={notificationState?.notification?.toggle}
                title={notificationState?.notification?.title}
                message={notificationState?.notification?.message}
                onDismiss={onDismissNotification}
                dismissable={true}
                position="bottom"
                persist={false}
                theme={notificationState?.notification?.theme}
            />
        </PortalComponent>


    )
}


export default NotificationHook;