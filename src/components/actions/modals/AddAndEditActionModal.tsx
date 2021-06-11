import { Button } from "@sebgroup/react-components/dist/Button";
import { Dropdown, DropdownItem } from "@sebgroup/react-components/dist/Dropdown/Dropdown";
import { Loader } from "@sebgroup/react-components/dist/Loader";
import { TextBoxGroup } from "@sebgroup/react-components/dist/TextBoxGroup";
import { TextArea } from "@sebgroup/react-components/dist/TextArea";

import React from "react";
import { ActionModel } from "../../../interfaces/models";
import { HTTPREQUESTMETHODS } from "../../../constants";
import { convertStringToJson } from "../../../utils/functions";
import { TriggerActionType } from "../../../enums/status";


interface AddAndEditActionModalProps {
    onSave: (e: React.FormEvent<HTMLFormElement>, action: ActionModel) => void;
    onCancel: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    action: ActionModel;
    loading: boolean;
    actionTypes: Array<DropdownItem>
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

const AddAndEditActionModal: React.FC<AddAndEditActionModalProps> = (props: AddAndEditActionModalProps): React.ReactElement<void> => {
    const [action, setAction] = React.useState<ActionModel>({ name: "" } as ActionModel);
    const [actionError, setActionError] = React.useState<ActionErrorModel>({ name: "" } as ActionErrorModel);
    const [property, setProperty] = React.useState<PropertyProps>({
        url: "",
        httpMethod: "",
        body: "",
        mobileNo: "",
        message: "",
        subject: "",
        emailId: "",
        topic: "",
        payload: "",
    });

    const httpMethods: Array<DropdownItem> = [{ label: "Please select", value: null }, ...HTTPREQUESTMETHODS];


    const [selectedType, setSelectedType] = React.useState<DropdownItem>({} as DropdownItem)
    const [selectedHttpMethod, setSelectedHttpMethod] = React.useState<DropdownItem>({} as DropdownItem)

    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setAction({ ...action, [e.target.name]: e.target.value });
    }, [action]);

    const onCancel = React.useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setAction({ name: "" } as ActionModel);
        props.onCancel(e);
    }, [action]);

    const onSave = React.useCallback((e: React.FormEvent<HTMLFormElement>) => {
        let error: ActionErrorModel;
        if (!action?.name) {
            error = { ...error, name: "Action name is required" };
        }
        if (!selectedType) {
            error = { ...error, actionType: "Action type is required" };
        }

        switch (action?.type) {
            case TriggerActionType.RestServiceAction: {
                if (!property?.body) {
                    error = { ...error, body: "Body is required" };
                }

                if (!property?.httpMethod) {
                    error = { ...error, httpMethod: "Action method is required" };
                }

                if (!property?.url) {
                    error = { ...error, url: "Action url is required" };
                }
                break;
            }
            case TriggerActionType.MqttPublishAction: {
                if (!property?.topic) {
                    error = { ...error, topic: "topic is required" };
                }

                if (!property?.payload) {
                    error = { ...error, payload: "payload method is required" };
                }
                break;
            }
            case TriggerActionType.SMS: {
                if (!property?.mobileNo) {
                    error = { ...error, mobileNo: "mobileNo is required" };
                }

                if (!property?.message) {
                    error = { ...error, message: "Message method is required" };
                }
                break;
            }
            case TriggerActionType.Email: {
                if (!property?.subject) {
                    error = { ...error, subject: "Subject is required" };
                }

                if (!property?.body) {
                    error = { ...error, body: "body method is required" };
                }
                break;
            }
        }
        if (!error) {
            const updatedProperty: string = JSON.stringify(property)
            props?.onSave(e, { ...action, properties: updatedProperty });
        }
        setActionError(error);

        e.preventDefault();
    }, [action, selectedType, property]);

    const handleActionTypeChange = React.useCallback((value: DropdownItem) => {
        setSelectedType(value);
        setAction({ ...action, type: value?.value });
    }, [action]);

    const handleActionHttpChange = React.useCallback((value: DropdownItem) => {
        setSelectedHttpMethod(value);
        setProperty({ ...property, httpMethod: value?.value });
    }, [property]);

    const handlePropertyChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setProperty({ ...property, [e.target.name]: e.target.value });
    }, [property]);

    React.useEffect(() => {
        if (props?.action?.id) {
            const updatedProperty: PropertyProps = convertStringToJson(props?.action?.properties);
            const selectedMethod: DropdownItem = httpMethods?.find((method: DropdownItem) => method?.value === updatedProperty?.httpMethod);
            const type: DropdownItem = props.actionTypes?.find((type: DropdownItem) => type?.value === props?.action?.type);
            setSelectedHttpMethod(selectedMethod);
            setSelectedType(type);
            setProperty({
                ...property,
                body: updatedProperty?.body || property?.body,
                httpMethod: updatedProperty?.httpMethod || property?.httpMethod,
                url: updatedProperty?.url || property?.url,
                mobileNo: updatedProperty?.mobileNo || property?.mobileNo,
                message: updatedProperty?.message || property?.message,
                subject: updatedProperty.subject || property?.subject,
                emailId: updatedProperty?.emailId || property?.emailId,
                topic: updatedProperty?.topic || property?.topic,
                payload: updatedProperty?.payload || property?.payload
            });
            setAction(props?.action);
        }
    }, [props.action]);

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
                            value={property?.mobileNo}
                            disabled={props?.loading}
                            error={actionError?.mobileNo}
                            onChange={handlePropertyChange}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <TextArea id="message" name="message" cols={2} onChange={handlePropertyChange} error={actionError?.message} value={property?.message} placeholder="Message" />
                    </div>
                </div>
            </React.Fragment>
        )
    };

    const renderEmailTypeAction = () => {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col">
                        <TextBoxGroup
                            name="emailId"
                            label="Email ID."
                            placeholder="email Id."
                            value={property?.emailId}
                            disabled={props?.loading}
                            error={actionError?.emailId}
                            onChange={handlePropertyChange}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <TextBoxGroup
                            name="subject"
                            label="Email subject"
                            placeholder="email subject"
                            value={property?.subject}
                            disabled={props?.loading}
                            error={actionError?.subject}
                            onChange={handlePropertyChange}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <TextArea id="body" name="body" cols={2} onChange={handlePropertyChange} error={actionError?.body} value={property?.body} placeholder="Message body" />
                    </div>
                </div>
            </React.Fragment>
        )
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
                            value={property?.topic}
                            disabled={props?.loading}
                            error={actionError?.topic}
                            onChange={handlePropertyChange}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <TextArea id="payload" label="Payload" name="payload" cols={2} onChange={handlePropertyChange} error={actionError?.payload} value={property?.payload} placeholder="Message payload" />
                    </div>
                </div>

            </React.Fragment>
        )
    }
    const renderRestTypeAction = () => {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col">
                        <TextBoxGroup
                            name="url"
                            label="Url"
                            placeholder="Url Path"
                            value={property?.url}
                            disabled={props?.loading}
                            error={actionError?.url}
                            onChange={handlePropertyChange}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <Dropdown
                            label="Http Method"
                            list={httpMethods}
                            error={actionError?.httpMethod}
                            selectedValue={selectedHttpMethod}
                            onChange={handleActionHttpChange}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <TextArea id="body" label="Body" name="body" cols={3} onChange={handlePropertyChange} error={actionError?.body} value={property?.body} placeholder="Action body" />
                    </div>
                </div>
            </React.Fragment>
        )
    }

    return (
        <form className="add-and-edit-actio" onSubmit={onSave}>
            <div className="row">
                <div className="col-sm-6 col-12">
                    <TextBoxGroup
                        name="name"
                        label="Action name"
                        placeholder="Name"
                        value={action?.name}
                        disabled={props?.loading}
                        error={actionError?.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="col-sm-6 col-12">
                    <Dropdown
                        label="Action type"
                        list={props.actionTypes}
                        error={actionError?.actionType}
                        selectedValue={selectedType}
                        onChange={handleActionTypeChange}
                    />
                </div>
            </div>
            {selectedType?.value === TriggerActionType.RestServiceAction && renderRestTypeAction()}
            {selectedType?.value === TriggerActionType.SMS && renderSMSTypeAction()}
            {selectedType?.value === TriggerActionType.Email && renderEmailTypeAction()}
            {selectedType?.value === TriggerActionType.MqttPublishAction && renderMqttActionType()}

            <div className="row controls-holder">
                <div className="col-12 col-sm-6">
                    <Button label="Cancel" size="sm" disabled={props.loading} theme="outline-primary" onClick={onCancel} />
                </div>
                <div className="col-12 col-sm-6 text-right">
                    <Button label="Save" type="submit" size="sm" theme="primary" title="Save" onClick={null}>
                        <Loader toggle={props?.loading} />
                    </Button>
                </div>
            </div>

        </form>
    );
}

export default AddAndEditActionModal;