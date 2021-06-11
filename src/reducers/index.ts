import auth from "./authReducer";
import notification from "./notificationReducer";
import groups from "./groupReducers";
import devices from "./deviceReducers";

import { combineReducers } from 'redux';

export default combineReducers({
    auth,
    notification,
    groups,
    devices
});
