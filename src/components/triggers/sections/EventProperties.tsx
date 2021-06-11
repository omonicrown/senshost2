import { DropdownItem } from "@sebgroup/react-components/dist/Dropdown/Dropdown";
import React from "react";
import { FlowElement, Edge, Elements } from "react-flow-renderer";

import TriggerForm from "../forms/Trigger";
import LineForm from "../forms/Line";
import RuleForm from "../forms/Rules";
import ActionsForm from "../forms/Actions";
import { ActionModel } from "../../../interfaces/models";
import { RuleActionTypes } from "./EventBody";

interface EventPropertiesProps {
    element: FlowElement & Edge;
    elements: Elements;
    loading: boolean;

    handleTriggerTextChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleEdgeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleTriggerDropDownChange: (value: DropdownItem, type: "deviceId" | "sourceId" | "sourceType") => void;
    handleRulesDropDownChange: (value: DropdownItem, field: "device" | "deviceSource" | "sensor" | "operator" | "cadence") => void;
    handleDataSourceChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleTriggerStartDateChange: (value: Date) => void;
    handleRuleOperatorValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleRuleTitleValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

    handleActionsDropdownChange: (value: DropdownItem | ActionModel, field: "action" | "actionType") => void;
    handleActionsPropertyDropdownChange: (value: DropdownItem, type: "httpMethod") => void;
    handleActionsTextChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
    handleActionsPropertyTextChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
    handleActionStatusChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const EventProperties: React.FC<EventPropertiesProps> = (props: EventPropertiesProps): React.ReactElement<void> => {
    const isRuleEdge: boolean = React.useMemo(() => {
        const firstWord: string = props.element?.source?.split("-")[0];
        const targetWord: string = props.element?.target?.split("-")[0];
        return (
            firstWord === "string" ||
            firstWord === "time" ||
            firstWord === "number"
        ) && !(
            targetWord === "Email" as RuleActionTypes ||
            targetWord === "MqttPublishAction" as RuleActionTypes ||
            targetWord === "SMS" as RuleActionTypes ||
            targetWord === "RestServiceAction" as RuleActionTypes
        )
    }, [props.element]);

    const isEngineNode = React.useMemo(() => {
        const firstWord: string = props.element?.id?.split("-")[0];
        return (
            firstWord === "dataReceived" || firstWord === "schedule"
        )
    }, [props.element]);

    const isRuleNode = React.useMemo(() => {
        const firstWord: string = props.element?.id?.split("-")[0];
        return (
            firstWord === "string" ||
            firstWord === "number" ||
            firstWord === "time"
        )
    }, [props.element]);


    const isRuleAction = React.useMemo(() => {
        const firstWord: string = props.element?.id?.split("-")[0];

        return (
            firstWord === "Email" as RuleActionTypes ||
            firstWord === "MqttPublishAction" as RuleActionTypes ||
            firstWord === "SMS" as RuleActionTypes ||
            firstWord === "RestServiceAction" as RuleActionTypes
        )
    }, [props.element]);

    return (
        <aside className="properties-holder">
            <div className="description">properties</div>
            {isEngineNode && <TriggerForm
                loading={props.loading}
                handleTriggerTextChange={props.handleTriggerTextChange}
                handleTriggerStartDateChange={props.handleTriggerStartDateChange}
                handleTriggerDropDownChange={props.handleTriggerDropDownChange}
                selectedElement={props.element} elements={props.elements}
            />}
            {isRuleEdge && <LineForm loading={props.loading} elements={props.elements} handleEdgeChange={props.handleEdgeChange} selectedElement={props.element} />}
            {isRuleNode && <RuleForm
                handleRuleOperatorValueChange={props.handleRuleOperatorValueChange}
                handleRuleTitleValueChange={props.handleRuleTitleValueChange}
                loading={props.loading}
                handleRulesDropDownChange={props.handleRulesDropDownChange}
                elements={props.elements}
                selectedElement={props.element}
                handleDataSourceChange={props.handleDataSourceChange}
            />}
            {isRuleAction && <ActionsForm
                loading={props.loading}
                elements={props.elements}
                selectedElement={props.element}
                handleActionsDropDownChange={props.handleActionsDropdownChange}
                handleActionsPropertyDropdownChange={props.handleActionsPropertyDropdownChange}
                handleActionsTextChange={props.handleActionsTextChange}
                handleActionsPropertyTextChange={props.handleActionsPropertyTextChange}
                handleActionStatusChange={props.handleActionStatusChange}
            />}
        </aside>
    );
};

export default EventProperties;
