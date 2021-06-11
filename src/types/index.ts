import * as actions from "../actions";

export type actionTypes = {
    [k in keyof typeof actions]
}