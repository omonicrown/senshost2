
import {
    RECEIVE_GROUPS,
    LOG_GROUP_ERROR
} from "../constants";
import { GroupState } from '../interfaces/states';
import { groupActions } from "../actions/groupActions";

const initialState: GroupState = {
    groups: [],
    isFetching: false,
    error: null,
};

export default (state = initialState, action: groupActions): GroupState => {
    switch (action.type) {
        case RECEIVE_GROUPS: {
            return { ...state, groups: [...state?.groups, ...action?.groups] };
        }
        case LOG_GROUP_ERROR: {
            return { ...state, error: { message: action.error?.message, type: action?.error?.response?.statusText } };
        }
        default: {
            return state;
        }

    }

}