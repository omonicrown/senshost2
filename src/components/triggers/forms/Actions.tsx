import { Dropdown, DropdownItem } from "@sebgroup/react-components/dist/Dropdown/Dropdown";
import { RadioGroup } from "@sebgroup/react-components/dist/RadioGroup";
import { RadioListModel } from "@sebgroup/react-components/dist/RadioGroup/RadioGroup";
import { AxiosResponse } from "axios";
import React from "react";
import { Edge, Elements, FlowElement } from "react-flow-renderer";
import { useSelector } from "react-redux";
import { ActionApis } from "../../../apis/actionApis";
import { ACTIONTYPES } from "../../../constants";
import { ActionModel } from "../../../interfaces/models";
import { AuthState, States } from "../../../interfaces/states";
import NewAction from "./sections/NewAction";

interface ActionsFormProps {
    loading: boolean;
    selectedElement: FlowElement & Edge;
    elements: Elements;
    handleActionsDropDownChange: (value: DropdownItem | ActionModel, field: "action" | "actionType") => void;
    handleActionsPropertyDropdownChange: (value: DropdownItem, type: "httpMethod") => void;
    handleActionsTextChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
    handleActionsPropertyTextChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
    handleActionStatusChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ActionsForm: React.FC<ActionsFormProps> = (props: ActionsFormProps) => {
    const authState: AuthState = useSelector((states: States) => states?.auth);
    const [actionsDropdownValue, setActionsDropdownValue] = React.useState<Array<DropdownItem>>([{ label: "Select", value: null }]);
    const [actions, setActions] = React.useState<Array<ActionModel>>([]);
    const [selectedAction, setSelectedAction] = React.useState<DropdownItem>(null);
    const [actionType, setActionType] = React.useState<"NEW" | "EXISTING">("EXISTING");


    const actionTypes: Array<DropdownItem> = [{ label: "Please select", value: null }, ...ACTIONTYPES];

    const list: Array<RadioListModel> = React.useMemo(() => [{
        label: "Existing actions",
        value: "EXISTING",
    }, {
        label: "Create new action",
        value: "NEW",
    }], []);

    const handleActionsDropDownChange = React.useCallback((value: DropdownItem) => {
        const action: ActionModel = actions?.find((ruleAction: ActionModel) => ruleAction?.id === value?.value);

        props.handleActionsDropDownChange(action, "action");
    }, [actions, props.handleActionsDropDownChange]);

    const action: ActionModel = React.useMemo(() => {
        const element: FlowElement = props.elements?.find((el: FlowElement) => el.id === props.selectedElement?.id);

        return element?.data?.nodeControls?.actions?.newAction as ActionModel || {
            name: "",
            type: null,
            properties: null,
            accountId: authState?.auth?.account?.id,
            id: null,
            creationDate: null
        } as ActionModel

    }, [props.selectedElement, props.elements])


    React.useEffect(() => {
        ActionApis.getActionsByAccountId(authState?.auth?.account?.id)
            .then((response: AxiosResponse<Array<ActionModel>>) => {
                const updatedData: Array<DropdownItem> = response?.data?.map((action: ActionModel) => {
                    return (
                        {
                            label: action.name,
                            value: action.id
                        }
                    )
                });
                setActions(response?.data);
                setActionsDropdownValue([...actionsDropdownValue, ...updatedData]);
            });
    }, []);

    React.useEffect(() => {
        const element: FlowElement = props.elements?.find((el: FlowElement) => el.id === props.selectedElement?.id);
        setSelectedAction({
            label: element?.data?.nodeControls?.actions?.action?.name,
            value: element?.data?.nodeControls?.actions?.action?.id
        } as DropdownItem);

        setActionType(element?.data?.nodeControls?.actions?.actionStatus || actionType);
    }, [props.selectedElement, props.elements]);

    return (
        <div className="action-properties-holder">
            <div className="row">
                <RadioGroup
                    name="actionType"
                    className="col"
                    disableAll={props.loading}
                    id="actionType"
                    label="Select action from"
                    value={actionType}
                    condensed
                    list={list}
                    onChange={props.handleActionStatusChange}
                />
            </div>
            {actionType === "EXISTING" &&
                <div className="row">
                    <Dropdown
                        label="Action"
                        name="action"
                        list={actionsDropdownValue}
                        className="col"
                        disabled={props?.loading}
                        selectedValue={selectedAction}
                        error={null}
                        onChange={handleActionsDropDownChange}
                    />
                </div>
            }
            {actionType === "NEW" &&
                <NewAction
                    actionTypes={actionTypes}
                    loading={props.loading}
                    action={action}
                    handleActionsDropdownChange={props.handleActionsDropDownChange}
                    handleActionsPropertyDropdownChange={props.handleActionsPropertyDropdownChange}
                    handleActionsTextChange={props.handleActionsTextChange}
                    handleActionsPropertyTextChange={props.handleActionsPropertyTextChange}
                    selectedElement={props.selectedElement}
                    elements={props.elements}
                />
            }
        </div>
    )
};

export default ActionsForm;
