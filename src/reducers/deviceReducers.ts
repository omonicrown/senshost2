
import {
    RECEIVE_DEVICES,
    LOG_DEVICE_ERROR
} from "../constants";
import { DeviceState } from '../interfaces/states';
import { deviceActions } from "../actions/deviceActions";

const initialState: DeviceState = {
    devices: [],
    isFetching: false,
    error: null,
};

export default (state = initialState, action: deviceActions): DeviceState => {
    switch (action.type) {
        case RECEIVE_DEVICES: {
            return { ...state, devices: [...state?.devices, ...action?.devices] };
        }
        case LOG_DEVICE_ERROR: {
            return { ...state, error: { message: action.error?.message, type: action?.error?.response?.statusText } };
        }
        default: {
            return state;
        }

    }

}