import { Dropdown, DropdownItem } from "@sebgroup/react-components/dist/Dropdown/Dropdown";
import { TextBoxGroup } from "@sebgroup/react-components/dist/TextBoxGroup";
import { TextArea } from "@sebgroup/react-components/dist/TextArea";

import React from "react";
import { ActionModel } from "../../../../interfaces/models";
import { HTTPREQUESTMETHODS } from "../../../../constants";
import { Edge, Elements, FlowElement } from "react-flow-renderer";
import { TriggerActionType } from "../../../../enums/status";


interface NewActionSectionProps {
    action: ActionModel;
    loading: boolean;
    actionTypes: Array<DropdownItem>
    handleActionsDropdownChange: (value: DropdownItem, field: "action" | "actionType") => void;
    handleActionsPropertyDropdownChange: (value: DropdownItem, type: "httpMethod") => void;
    handleActionsTextChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
    handleActionsPropertyTextChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
    selectedElement: FlowElement & Edge;
    elements: Elements;
}

interface PropertyProps {
    url?: string;
    mobileNo?: string;
    message?: string;
    subject?: string;
    emailId?: string;
    topic?: string;
    payload?: string;
    body?: string;
    httpMethod?: string;
}

interface ActionErrorModel extends PropertyProps, ActionModel {
    actionType: string;
}

interface NewActionObject extends ActionModel {
    property: PropertyProps;
}

const NewActionSection: React.FC<NewActionSectionProps> = (props: NewActionSectionProps): React.ReactElement<void> => {
    const [action, setAction] = React.useState<NewActionObject>({
        name: "", id: null,
        property: {
            url: "",
            httpMethod: "",
            body: "",
            mobileNo: "",
            message: "",
            subject: "",
            emailId: "",
            topic: "",
            payload: "",
        }
    } as NewActionObject);
    const [actionError, setActionError] = React.useState<NewActionObject>({ name: "" } as NewActionObject);
    const httpMethods: Array<DropdownItem> = [{ label: "Please select", value: null }, ...HTTPREQUESTMETHODS];


    const [selectedType, setSelectedType] = React.useState<DropdownItem>({} as DropdownItem)
    const [selectedHttpMethod, setSelectedHttpMethod] = React.useState<DropdownItem>({} as DropdownItem);

    React.useEffect(() => {
        const element: FlowElement = props.elements?.find((el: FlowElement) => el.id === props.selectedElement?.id);
        const selectedActionType: DropdownItem = props.actionTypes?.find((type: DropdownItem) => type.value === element?.data?.nodeControls?.actions?.newAction?.actionType);
        const httpMethod: DropdownItem = httpMethods?.find((method: DropdownItem) => method?.value === element?.data?.nodeControls?.actions?.newAction?.property?.httpMethod);

        setAction({
            ...action,
            property: {
                ...action?.property,
                httpMethod: element?.data?.nodeControls?.actions?.newAction?.property?.httpMethod,
                body: element?.data?.nodeControls?.actions?.newAction?.property?.body || "",
                url: element?.data?.nodeControls?.actions?.newAction?.property?.url || "",
                mobileNo: element?.data?.nodeControls?.actions?.newAction?.property?.mobileNo || action?.property?.mobileNo,
                message: element?.data?.nodeControls?.actions?.newAction?.property?.message || action?.property?.message,
                subject: element?.data?.nodeControls?.actions?.newAction?.property?.subject || action?.property?.subject,
                emailId: element?.data?.nodeControls?.actions?.newAction?.property?.emailId || action?.property?.emailId,
                topic: element?.data?.nodeControls?.actions?.newAction?.property?.topic || action?.property?.topic,
                payload: element?.data?.nodeControls?.actions?.newAction?.property?.payload || action?.property?.payload
            },
            name: element?.data?.nodeControls?.actions?.newAction?.name || "",
            type: element?.data?.nodeControls?.actions?.newAction?.actionType
        });

        setSelectedType(selectedActionType);

        setSelectedHttpMethod(httpMethod)
    }, [props.selectedElement, props.elements, setAction, setSelectedType]);


    const renderRestTypeAction = () => {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col">
                        <TextBoxGroup
                            name="url"
                            label="Url"
                            placeholder="Url Path"
                            value={action?.property?.url}
                            disabled={props?.loading}
                            error={actionError?.name}
                            onChange={props.handleActionsPropertyTextChange}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <Dropdown
                            label="Http Method"
                            list={httpMethods}
                            error={actionError?.property?.httpMethod as any}
                            selectedValue={selectedHttpMethod}
                            onChange={(value: DropdownItem) => props.handleActionsPropertyDropdownChange(value, "httpMethod")}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <TextArea id="body" name="body" cols={3} onChange={props.handleActionsPropertyTextChange} error={actionError?.property?.body} value={action?.property?.body} placeholder="Action body" />
                    </div>
                </div>
            </React.Fragment>
        )
    };

    const renderSMSTypeAction = () => {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col">
                        <TextBoxGroup
                            name="mobileNo"
                            type="number"
                            label="Mobile No."
                            placeholder="Mobile number"
                            value={action?.property?.mobileNo}
                            disabled={props?.loading}
                            error={actionError?.property?.mobileNo}
                            onChange={props.handleActionsPropertyTextChange}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <TextArea id="message" name="message" cols={2} onChange={props.handleActionsPropertyTextChange} error={actionError?.property?.message} value={action?.property?.message} placeholder="Message" />
                    </div>
                </div>
            </React.Fragment>
        );
    };

    const renderMqttActionType = () => {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col">
                        <TextBoxGroup
                            name="topic"
                            label="Topic"
                            placeholder="Topic "
                            value={action?.property?.topic}
                            disabled={props?.loading}
                            error={actionError?.property?.topic}
                            onChange={props.handleActionsPropertyTextChange}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <TextArea id="payload" label="Payload" name="payload" cols={2} onChange={props.handleActionsPropertyTextChange} error={actionError?.property?.payload} value={action?.property?.payload} placeholder="Message payload" />
                    </div>
                </div>

            </React.Fragment>
        );
    }

    const renderEmailTypeAction = () => {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col">
                        <TextBoxGroup
                            name="emailId"
                            label="Email ID."
                            placeholder="email Id."
                            value={action?.property?.emailId}
                            disabled={props?.loading}
                            error={actionError?.property?.emailId}
                            onChange={props.handleActionsPropertyTextChange}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <TextBoxGroup
                            name="subject"
                            label="Email subject"
                            placeholder="email subject"
                            value={action?.property?.subject}
                            disabled={props?.loading}
                            error={actionError?.property?.subject}
                            onChange={props.handleActionsPropertyTextChange}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <TextArea id="body" name="body" cols={2} onChange={props.handleActionsPropertyTextChange} error={actionError?.property?.body} value={action?.property?.body} placeholder="Message body" />
                    </div>
                </div>
            </React.Fragment>
        );
    }
    return (
        <div className="new-action-section">
            <div className="row">
                <div className="col-12">
                    <TextBoxGroup
                        name="name"
                        label="Action name"
                        placeholder="Name"
                        value={action?.name}
                        disabled={props?.loading}
                        error={actionError?.name}
                        onChange={props.handleActionsTextChange}
                    />
                </div>
            </div>
            <div className="row">
                <div className=" col-12">
                    <Dropdown
                        label="Action type"
                        list={props.actionTypes}
                        error={actionError?.type?.toString()}
                        selectedValue={selectedType}
                        onChange={(value: DropdownItem) => props.handleActionsDropdownChange(value, "actionType")}
                    />
                </div>
            </div>


            {selectedType?.value === TriggerActionType.RestServiceAction && renderRestTypeAction()}
            {selectedType?.value === TriggerActionType.SMS && renderSMSTypeAction()}
            {selectedType?.value === TriggerActionType.Email && renderEmailTypeAction()}
            {selectedType?.value === TriggerActionType.MqttPublishAction && renderMqttActionType()}
        </div>
    );
}

export default NewActionSection;