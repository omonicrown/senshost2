import { NotificationProps } from "@sebgroup/react-components/dist/notification/Notification";

import {
    TOGGLE_NOTIFICATION
} from "../constants";
import { NotificationState } from '../interfaces/states';
import { notificationActions } from "../actions/notificationActions";

const initialState: NotificationState = {
    notification: {} as NotificationProps
};

export default (state = initialState, action: notificationActions) => {
    switch (action.type) {
        case TOGGLE_NOTIFICATION: {
            return { ...state, notification: action.notification };
        }
        default: {
            return state;
        }

    }

}