import { Dispatch } from "redux";

import * as constants from '../constants';
import { GroupActions } from '../interfaces/actions';
import { GroupModel } from '../interfaces/models';
import { GroupApis } from '../apis/groupApis';
import { AxiosResponse, AxiosError } from 'axios';

export function receiveGroups(groups: Array<GroupModel>): GroupActions {
    return {
        type: constants.RECEIVE_GROUPS,
        groups,
    }
}

export function logGroupsError(error: AxiosError): GroupActions {
    return {
        type: constants.LOG_GROUP_ERROR,
        error,
    }
}

export const getGroupsByAccount = (account: string) => {
    return (dispatch: Dispatch<GroupActions | any>) => {
        return GroupApis.getGroupsByAccount(account)
            .then((json: AxiosResponse<Array<GroupModel>>) => {
                if (json?.data) {
                    dispatch(receiveGroups(json.data));
                }
            })
            .catch((err: AxiosError) => dispatch(logGroupsError(err)));
    };
}

export type groupActions = GroupActions;