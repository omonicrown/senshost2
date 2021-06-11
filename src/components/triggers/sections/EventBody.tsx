import { Button } from "@sebgroup/react-components/dist/Button";
import { DropdownItem } from "@sebgroup/react-components/dist/Dropdown/Dropdown";
import { NotificationProps } from "@sebgroup/react-components/dist/notification/Notification";
import { AxiosResponse } from "axios";
import React from "react";
import { History } from "history";

import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    removeElements,
    Controls,
    Background,
    Elements,
    updateEdge,
    FlowElement,
    Edge,
    getOutgoers,
    Node,
    getConnectedEdges
} from "react-flow-renderer";
import { useDispatch, useSelector } from "react-redux";
import { match, useHistory, useRouteMatch } from "react-router";
import { Dispatch } from "redux";
import { toggleNotification } from "../../../actions";
import { TriggerApis } from "../../../apis/triggerApis";
import { RuleDataSouceTypeEnums, RuleTriggerTypes, RuleTypeEnums } from "../../../enums";
import { TriggerActionType } from "../../../enums/status";
import { ActionModel, RuleModel, TriggerModel } from "../../../interfaces/models";
import { AuthState, States } from "../../../interfaces/states";
import { convertStringToJson } from "../../../utils/functions";
import { DatasourceType } from "../../dashboardItem/modals/AddDashboardItem";
import PageTitle from "../../shared/PageTitle";
import EventControls from "./EventControls";
import EventProperties from "./EventProperties";
import { HomeRoutes } from "../../../enums/routes";


let id = 0;
const getId = () => `dndnode_${id++}`;

export type RuleTypes = "string" | "time" | "number";
export type TriggerTypes = "dataReceived" | "schedule";
export type RuleActionTypes = keyof typeof TriggerActionType;

const EventBody: React.FC = (): React.ReactElement<void> => {
    const reactFlowWrapper = React.useRef<HTMLDivElement>(null);
    const [reactFlowInstance, setReactFlowInstance] = React.useState(null);
    const [elements, setElements] = React.useState<Elements>([]);
    const [selectedElement, setSelectedElement] = React.useState<FlowElement & Edge>();

    const [currenTrigger, setCurrentTrigger] = React.useState<TriggerModel>({} as TriggerModel)

    const authState: AuthState = useSelector((states: States) => states?.auth);
    const match: match<{ triggerId: string }> = useRouteMatch();
    const history: History = useHistory();
    // actions
    const dispatch: Dispatch = useDispatch();

    const [loading, setLoading] = React.useState<boolean>(false);
    // gets called after end of edge gets dragged to another source or target

    const onEdgeUpdate = (oldEdge, newConnection) => {
        return setElements((els) => updateEdge(oldEdge, newConnection, els));
    }

    const onConnect = (params: Edge) => setElements((els: Elements) => {
        const target: string = params?.target?.split("-")[0];
        const source: string = params?.source?.split("-")[0];

        const isRuleEdgeTarget = (
            target === "string" ||
            target === "number" ||
            target === "time"
        );
        const isRuleEdgeSource = (
            source === "string" ||
            source === "number" ||
            source === "time"
        )
        return addEdge((isRuleEdgeTarget && isRuleEdgeSource) ? {
            ...params,
            data: { lineType: "AND" },
            label: "AND"
        } : params, els);
    });

    const onElementsRemove = React.useCallback((elementsToRemove: Elements) => {
        setSelectedElement(null);
        setElements((els) => removeElements(elementsToRemove, els));
    }, [setSelectedElement]);

    const onLoad = (_reactFlowInstance) =>
        setReactFlowInstance(_reactFlowInstance);

    const onDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };

    const getActionNodeLabelByTypeEnum = (type: TriggerActionType) => {
        switch (type) {
            case TriggerActionType.MqttPublishAction:
                return "Mqqt publish action";
            case TriggerActionType.Email:
                return "Email action";
            case TriggerActionType.RestServiceAction:
                return "Rest service action";
            case TriggerActionType.SMS:
                return "SMS action";
        }
    };


    const getActionNodeIdByTypeEnum = (type: TriggerActionType): RuleActionTypes => {
        switch (type) {
            case TriggerActionType.MqttPublishAction:
                return "MqttPublishAction";
            case TriggerActionType.Email:
                return "Email";
            case TriggerActionType.RestServiceAction:
                return "RestServiceAction";
            case TriggerActionType.SMS:
                return "SMS";
        }
    };

    const getNodeLabelById = (type: RuleTypeEnums) => {
        switch (type) {
            case RuleTypeEnums.number:
                return "Number rule";
            case RuleTypeEnums.string:
                return "String rule";
            case RuleTypeEnums.time:
                return "Time rule";
        }
    };

    const getRuleNodeLabelNameById = (type: RuleTypeEnums) => {
        switch (type) {
            case RuleTypeEnums.number:
                return "number";
            case RuleTypeEnums.string:
                return "string";
            case RuleTypeEnums.time:
                return "time";
        }
    };

    const getNodeLabel = (ruleType: RuleActionTypes | RuleTypes | TriggerTypes): string => {
        switch (ruleType) {
            case "SMS":
                return `SMS action`;
            case "Email":
                return "Email action";
            case "number":
                return "Number rule";
            case "string":
                return "String rule";
            case "MqttPublishAction":
                return "Mqtt pubslish action";
            case "RestServiceAction":
                return "Rest service action";
            case "time":
                return "Time rule";
            case "dataReceived":
                return "OndataReceived";
            case "schedule":
                return "Schedule";
            default:
                return "Engine";
        }
    }
    const onDrop = React.useCallback((event) => {
        event.preventDefault();

        const reactFlowBounds = reactFlowWrapper?.current?.getBoundingClientRect();
        const types = event.dataTransfer?.getData('application/reactflow-node-type')?.split("-");
        const type = types[0];
        const nodeCategory = types[1];
        const ruleType = event.dataTransfer?.getData('application/reactflow-rule-type');

        const position = reactFlowInstance?.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        });

        const newNode = {
            id: `${ruleType}-${getId()}`,
            type,
            position,
            style: { backgroundColor: nodeCategory === "trigger" && "#eee" },
            data: {
                label: getNodeLabel(ruleType),
                nodeType: nodeCategory,
                nodeControls: {
                    trigger: {
                        eventName: "",
                        triggerName: ""
                    },
                    rules: {},
                    actions: {},
                }
            },
        };

        setElements((es) => es.concat(newNode));
    }, [reactFlowWrapper, reactFlowInstance, setElements]);


    const onRemoveNode = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        onElementsRemove([selectedElement]);
    }, [setElements, selectedElement]);

    const onElementClick = React.useCallback((event: React.MouseEvent<Element, MouseEvent>, element: FlowElement<any> & Edge) => {
        event.preventDefault();
        setSelectedElement(element);
    }, [setSelectedElement]);

    const onPanelClick = React.useCallback((event: React.MouseEvent<Element, MouseEvent>) => {
        setSelectedElement(null);
    }, [setSelectedElement]);


    const handleTriggerTextChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setElements((els: Elements) =>
            els.map((el: FlowElement & Edge) => {
                if (el.id === selectedElement.id) {
                    // it's important that you create a new object here
                    // in order to notify react flow about the change
                    el.data = {
                        ...el.data,
                        nodeControls: {
                            ...el.data.nodeControls,
                            trigger: {
                                ...el.data.nodeControls.trigger,
                                [event.target.name]: event.target.value
                            }
                        }
                    };
                }
                return el;
            })
        );
    }, [setElements, selectedElement]);

    const handleTriggerStartDateChange = React.useCallback((event: Date) => {
        setElements((els: Elements) =>
            els.map((el: FlowElement & Edge) => {
                if (el.id === selectedElement.id) {
                    // it's important that you create a new object here
                    // in order to notify react flow about the change
                    el.data = {
                        ...el.data,
                        nodeControls: {
                            ...el.data.nodeControls,
                            trigger: {
                                ...el.data.nodeControls.trigger,
                                deviceId: event
                            }
                        }
                    };
                }
                return el;
            })
        );
    }, [setElements, selectedElement]);

    const handleTriggerDropDownChange = React.useCallback((event: DropdownItem, type: "deviceId" | "sourceId" | "sourceType") => {
        setElements((els: Elements) =>
            els.map((el: FlowElement & Edge) => {
                if (el.id === selectedElement.id) {
                    // it's important that you create a new object here
                    // in order to notify react flow about the change
                    el.data = {
                        ...el.data,
                        nodeControls: {
                            ...el.data.nodeControls,
                            trigger: {
                                ...el.data.nodeControls.trigger,
                                [type]: event.value
                            }
                        }
                    };
                }
                return el;
            })
        );
    }, [setElements, selectedElement]);

    const handleEdgeChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setElements((els: Elements) =>
            els.map((el: FlowElement & Edge) => {
                if (el.id === selectedElement.id) {
                    return {
                        ...el,
                        data: { ...el?.data, [event.target.name]: event.target.value as "AND" | "OR" },
                        label: event.target.value
                    };
                }
                return el;
            })
        );

    }, [selectedElement, setElements]);

    const handleRulesDropDownChange = React.useCallback((value: DropdownItem, field: "device" | "deviceSource" | "sensor" | "operator" | "cadence") => {
        setElements((els: Elements) =>
            els.map((el: FlowElement & Edge) => {
                if (el.id === selectedElement.id) {
                    el.data = {
                        ...el.data,
                        nodeControls: {
                            ...el.data.nodeControls,
                            rules: {
                                ...el.data.nodeControls.rules,
                                [field]: value?.value
                            }
                        }
                    };
                }
                return el;
            })
        );
    }, [selectedElement, setElements]);

    const handleRuleTitleValueChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setElements((els: Elements) =>
            els.map((el: FlowElement & Edge) => {
                if (el.id === selectedElement.id) {
                    el.data = {
                        ...el.data,
                        label: event.target.value,
                        nodeControls: {
                            ...el.data.nodeControls,
                            rules: {
                                ...el.data.nodeControls.rules,
                                [event.target.name]: event.target.value
                            }
                        }
                    };
                }
                return el;
            })
        );
    }, [selectedElement, setElements]);


    const handleRuleOperatorValueChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setElements((els: Elements) =>
            els.map((el: FlowElement & Edge) => {
                if (el.id === selectedElement.id) {
                    el.data = {
                        ...el.data,
                        nodeControls: {
                            ...el.data.nodeControls,
                            rules: {
                                ...el.data.nodeControls.rules,
                                [event.target.name]: event.target.value as DatasourceType
                            }
                        }
                    };
                }
                return el;
            })
        );
    }, [selectedElement, setElements]);

    const handleDataSourceChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setElements((els: Elements) =>
            els.map((el: FlowElement & Edge) => {
                if (el.id === selectedElement.id) {
                    el.data = {
                        ...el.data,
                        nodeControls: {
                            ...el.data.nodeControls,
                            rules: {
                                ...el.data.nodeControls.rules,
                                type: event.target.value as DatasourceType
                            }
                        }
                    };
                }
                return el;
            })
        );
    }, [selectedElement, setElements]);

    const handleActionsDropDownChange = React.useCallback((value: DropdownItem & ActionModel, field: "action" | "actionType") => {
        switch (field) {
            case "action": {
                setElements((els: Elements) =>
                    els.map((el: FlowElement & Edge) => {
                        if (el.id === selectedElement.id) {
                            el.data = {
                                ...el.data,
                                nodeControls: {
                                    ...el.data.nodeControls,
                                    actions: {
                                        ...el.data.nodeControls.actions,
                                        action: value?.id ? value : value?.value
                                    }
                                }
                            };
                        }
                        return el;
                    })
                );
                break;
            }
            case "actionType":
                setElements((els: Elements) =>
                    els.map((el: FlowElement & Edge) => {
                        if (el.id === selectedElement.id) {
                            el.data = {
                                ...el.data,
                                nodeControls: {
                                    ...el.data.nodeControls,
                                    actions: {
                                        ...el.data.nodeControls.actions,
                                        newAction: { ...el.data.nodeControls.actions.newAction, [field]: (value as DropdownItem)?.value }
                                    }
                                }
                            };
                        }
                        return el;
                    })
                );
                break;
        }
    }, [selectedElement, setElements]);


    const handleActionsPropertyDropdownChange = React.useCallback((value: DropdownItem, type: "httpMethod") => {
        setElements((els: Elements) =>
            els.map((el: FlowElement & Edge) => {
                if (el.id === selectedElement.id) {
                    el.data = {
                        ...el.data,
                        nodeControls: {
                            ...el.data.nodeControls,
                            actions: {
                                ...el.data.nodeControls.actions,
                                newAction: {
                                    ...el.data.nodeControls.actions.newAction,
                                    property: { ...el.data.nodeControls.actions.newAction.property, [type]: value?.value }
                                }
                            }
                        }
                    };
                }
                return el;
            })
        );
    }, [selectedElement, setElements]);


    const handleActionStatusChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setElements((els: Elements) =>
            els.map((el: FlowElement & Edge) => {
                if (el.id === selectedElement.id) {
                    el.data = {
                        ...el.data,
                        nodeControls: {
                            ...el.data.nodeControls,
                            actions: {
                                ...el.data.nodeControls.actions,
                                actionStatus: event?.target?.value as "NEW" | "EXISTING"
                            }
                        }
                    };
                }
                return el;
            })
        );
    }, [selectedElement, setElements]);

    const handleActionsTextChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setElements((els: Elements) =>
            els.map((el: FlowElement & Edge) => {
                if (el.id === selectedElement.id) {
                    el.data = {
                        ...el.data,
                        nodeControls: {
                            ...el.data.nodeControls,
                            actions: {
                                ...el.data.nodeControls.actions,
                                newAction: { ...el.data.nodeControls.actions.newAction, [e.target.name]: e.target.value }
                            }
                        }
                    };
                }
                return el;
            })
        );
    }, [selectedElement, setElements]);

    const handleActionsPropertyTextChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setElements((els: Elements) =>
            els.map((el: FlowElement & Edge) => {
                if (el.id === selectedElement.id) {
                    el.data = {
                        ...el.data,
                        nodeControls: {
                            ...el.data.nodeControls,
                            actions: {
                                ...el.data.nodeControls.actions,
                                newAction: {
                                    ...el.data.nodeControls.actions.newAction,
                                    property: {
                                        ...el.data.nodeControls?.actions?.newAction?.property,
                                        [e.target.name]: e.target.value
                                    }
                                }
                            }
                        }
                    };
                }
                return el;
            })
        );
    }, [selectedElement, setElements]);

    const handleSave = React.useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

        let rulesNodes: Array<FlowElement> = [];
        let actionsNodes: Array<FlowElement> = [];
        let triggersNodes: Array<FlowElement> = [];
        let edgesNodes: Array<Edge> = [];

        for (let node of elements) {
            switch (node?.data?.nodeType) {
                case "rule":
                    rulesNodes.push(node);
                    break;
                case "action":
                    actionsNodes.push(node);
                    break;
                case "trigger":
                    triggersNodes.push(node);
                    break;
                default:
                    edgesNodes.push(node as Edge);
                    break;
            }
        };


        /**
         * Pseudo
         * 1. Select the first rule edge
         * 2. Select target node 
         */
        const firstRuleEdge: Edge = edgesNodes?.find((edge: Edge) =>
            edge?.source === triggersNodes[0]?.id || edge?.source === triggersNodes[1]?.id
        );

        const selectedTrigger: FlowElement = triggersNodes.find((trigger: FlowElement) => trigger?.id === firstRuleEdge?.source) || triggersNodes[0];

        const actions: Array<ActionModel> = actionsNodes?.map((action: FlowElement) => {
            if (action?.data?.nodeControls?.actions?.newAction) {
                return {
                    id: null,
                    name: action?.data?.nodeControls?.actions?.newAction?.name,
                    type: action?.data?.nodeControls?.actions?.newAction?.actionType,
                    properties: JSON.stringify({ ...action?.data?.nodeControls?.actions?.newAction?.property, position: (action as Node)?.position } || ""),
                    accountId: authState?.auth?.account?.id,
                    creationDate: null
                } as ActionModel;
            }
            return action?.data?.nodeControls?.actions?.action
        });

        const ruleType: string = selectedTrigger?.id?.split("-")[0];
        let trigger: TriggerModel = {
            id: currenTrigger?.id || null,
            name: selectedTrigger?.data?.nodeControls?.trigger?.eventName,
            eventName: selectedTrigger?.data?.nodeControls?.trigger?.triggerName,
            type: RuleTriggerTypes[ruleType],
            sourceType: selectedTrigger?.data?.nodeControls?.trigger?.sourceType,
            sourceId: selectedTrigger?.data?.nodeControls?.trigger?.sourceId,
            accountId: authState?.auth?.account?.id,
            deviceId: selectedTrigger?.data?.nodeControls?.trigger?.deviceId,
            properties: JSON.stringify({ position: (selectedTrigger as Node)?.position }),
            rule: null,
            actions
        };
        const firstRuleNode: Node = getOutgoers((selectedTrigger || {}) as Node, elements)[0];
        let updatedRule: RuleModel;

        const edges: Array<Edge> = getConnectedEdges(rulesNodes as Array<Node>, edgesNodes);

        for (let rule of rulesNodes) {
            const outgoingRules: Array<Node> = getOutgoers(rule as Node, elements);

            const generateRule = (recursiveRuleRule?: RuleModel, sourceId?: string) => {
                if (recursiveRuleRule?.and || recursiveRuleRule?.or) {
                    if (recursiveRuleRule?.and) {
                        generateRule(recursiveRuleRule?.and);
                    }
                    if (recursiveRuleRule?.or) {
                        generateRule(recursiveRuleRule?.or);
                    }
                } else if (!updatedRule) {
                    const nodeDatasourceType: keyof typeof RuleDataSouceTypeEnums = firstRuleNode?.data.nodeControls.rules.type;
                    const nextNextRule: Node = outgoingRules[0];
                    const firstWord: string = updatedRule ? nextNextRule?.id.split("-")[0] : firstRuleNode?.id.split("-")[0]

                    updatedRule = {
                        nodeId: firstRuleNode?.id,
                        title: firstRuleNode?.data.nodeControls.rules?.title,
                        fieldId: firstRuleNode?.data.nodeControls.rules.sensor,
                        deviceId: firstRuleNode?.data.nodeControls.rules.device,
                        operator: firstRuleNode?.data.nodeControls.rules.operator,
                        ruleType: RuleTypeEnums[firstWord],
                        dataFieldSourceType: RuleDataSouceTypeEnums[nodeDatasourceType],
                        value: JSON.stringify({
                            cadence: firstRuleNode?.data.nodeControls.rules?.cadence,
                            value: firstRuleNode?.data.nodeControls.rules?.operatorValue
                        }),
                        properties: JSON.stringify({ position: (firstRuleNode as Node)?.position }),
                        and: null,
                        or: null
                    } as RuleModel;

                    for (let outgoingRule of outgoingRules) {
                        const selectedEdge: Edge = edges?.find((edge: Edge) => edge?.target === outgoingRule?.id);
                        const firstWordDefault: string = outgoingRule?.id.split("-")[0];
                        const nodeDatasourceType: keyof typeof RuleDataSouceTypeEnums = outgoingRule?.data.nodeControls.rules.type;
                        if (selectedEdge?.data?.lineType === "OR") {
                            updatedRule['or'] = {
                                nodeId: outgoingRule?.id,
                                title: outgoingRule?.data.nodeControls.rules?.title,
                                fieldId: outgoingRule?.data.nodeControls.rules.sensor,
                                deviceId: outgoingRule?.data.nodeControls.rules.device,
                                operator: outgoingRule?.data.nodeControls.rules.operator,
                                ruleType: RuleTypeEnums[firstWordDefault],
                                dataFieldSourceType: RuleDataSouceTypeEnums[nodeDatasourceType],
                                value: JSON.stringify({
                                    cadence: outgoingRule?.data.nodeControls.rules?.cadence,
                                    value: outgoingRule?.data.nodeControls.rules?.operatorValue
                                }),
                                properties: JSON.stringify({ position: (outgoingRule as Node)?.position }),
                                and: null,
                                or: null
                            };
                        } else if (selectedEdge?.data?.lineType === "AND") {
                            updatedRule['and'] = {
                                nodeId: outgoingRule?.id,
                                title: outgoingRule?.data.nodeControls.rules?.title,
                                fieldId: outgoingRule?.data.nodeControls.rules.sensor,
                                deviceId: outgoingRule?.data.nodeControls.rules.device,
                                operator: outgoingRule?.data.nodeControls.rules.operator,
                                ruleType: RuleTypeEnums[firstWordDefault],
                                dataFieldSourceType: RuleDataSouceTypeEnums[nodeDatasourceType],
                                value: JSON.stringify({
                                    cadence: outgoingRule?.data.nodeControls.rules?.cadence,
                                    value: outgoingRule?.data.nodeControls.rules?.operatorValue
                                }),
                                properties: JSON.stringify({ position: (outgoingRule as Node)?.position }),
                                and: null,
                                or: null
                            };
                        }
                    }

                } else {
                    for (let outgoingRule of outgoingRules) {
                        const selectedEdge: Edge = edges?.find((edge: Edge) => edge?.target === outgoingRule?.id && edge?.source === recursiveRuleRule?.nodeId);

                        const firstWordDefault: string = outgoingRule?.id.split("-")[0];
                        const nodeDatasourceType: keyof typeof RuleDataSouceTypeEnums = outgoingRule?.data.nodeControls.rules.type
                        if (selectedEdge?.data?.lineType === "OR") {
                            recursiveRuleRule['or'] = {
                                nodeId: outgoingRule?.id,
                                title: outgoingRule?.data.nodeControls.rules?.title,
                                fieldId: outgoingRule?.data.nodeControls.rules.sensor,
                                deviceId: outgoingRule?.data.nodeControls.rules.device,
                                operator: outgoingRule?.data.nodeControls.rules.operator,
                                ruleType: RuleTypeEnums[firstWordDefault],
                                dataFieldSourceType: RuleDataSouceTypeEnums[nodeDatasourceType],
                                value: JSON.stringify({
                                    cadence: outgoingRule?.data.nodeControls.rules?.cadence,
                                    value: outgoingRule?.data.nodeControls.rules?.operatorValue
                                }),
                                properties: JSON.stringify({ position: (outgoingRule as Node)?.position }),
                                and: null,
                                or: null
                            };
                        } else if (selectedEdge?.data?.lineType === "AND") {
                            recursiveRuleRule['and'] = {
                                nodeId: outgoingRule?.id,
                                title: outgoingRule?.data.nodeControls.rules?.title,
                                fieldId: outgoingRule?.data.nodeControls.rules.sensor,
                                deviceId: outgoingRule?.data.nodeControls.rules.device,
                                operator: outgoingRule?.data.nodeControls.rules.operator,
                                ruleType: RuleTypeEnums[firstWordDefault],
                                dataFieldSourceType: RuleDataSouceTypeEnums[nodeDatasourceType],
                                value: JSON.stringify({
                                    cadence: outgoingRule?.data.nodeControls.rules?.cadence,
                                    value: outgoingRule?.data.nodeControls.rules?.operatorValue
                                }),
                                properties: JSON.stringify({ position: (outgoingRule as Node)?.position }),
                                and: null,
                                or: null
                            };
                        }
                    }

                }
            }

            generateRule(updatedRule);
        }

        trigger = { ...trigger, rule: updatedRule };

        setLoading(true);
        if (trigger?.id) {
            TriggerApis.updateTriggerById(trigger)
                .then((response: AxiosResponse<TriggerModel>) => {
                    if (response?.data) {
                        const notification: NotificationProps = {
                            theme: "success",
                            title: "Trigger updated",
                            message: `Trigger updated successfully`,
                            toggle: true,
                            onDismiss: () => { }
                        };

                        dispatch(toggleNotification(notification));
                        setElements([]);
                        setCurrentTrigger(response.data);
                    }

                }).finally(() => {
                    setLoading(false);
                });
        } else {
            TriggerApis.createTrigger(trigger)
                .then((response: AxiosResponse<TriggerModel>) => {
                    const notification: NotificationProps = {
                        theme: "success",
                        title: "Trigger created",
                        message: `Trigger created successfully`,
                        toggle: true,
                        onDismiss: () => { }
                    };

                    dispatch(toggleNotification(notification));

                    history.push(HomeRoutes.Triggers.toString());

                }).finally(() => {
                    setLoading(false);
                });
        }
    }, [elements, setElements]);

    React.useEffect(() => {

        setLoading(true);

        if (match?.params?.triggerId) {
            TriggerApis.getTriggerById(match?.params?.triggerId)
                .then((response: AxiosResponse<TriggerModel>) => {
                    if (response.data) {
                        setCurrentTrigger(response?.data);
                    }
                }).finally(() => {
                    setLoading(false);
                });
        }

    }, [match?.params?.triggerId]);

    React.useEffect(() => {

        const defaultPosition = reactFlowInstance?.project({
            x: 100,
            y: 100,
        });
        if (currenTrigger?.id) {
            // Edges and rules
            const triggerRuleId: string = `${currenTrigger?.type === RuleTriggerTypes.dataReceived ? "dataReceived" : "schedule"}-${getId()}`;

            let edgeNodes: Array<Edge> = [];
            let ruleNodes: Array<FlowElement> = [];

            const generateRulesrecursively = (recursiveRule?: RuleModel) => {

                if (ruleNodes?.length) {
                    if (recursiveRule?.and || recursiveRule?.or) {
                        const parentRuleId: string = `${getRuleNodeLabelNameById(recursiveRule?.ruleType)}-${recursiveRule?.id}`;
                        if (recursiveRule?.and) {
                            const properties: { position: { x: number, y: number } } = convertStringToJson(recursiveRule?.and.properties || "");
                            const ruleId: string = `${getRuleNodeLabelNameById(recursiveRule?.and?.ruleType)}-${recursiveRule?.and.id}`;
                            const value: { value: string, cadence: number } = convertStringToJson(recursiveRule?.and.value || "");

                            edgeNodes.push({
                                id: `edge-${getId()}`,
                                source: parentRuleId,
                                sourceHandle: null,
                                target: ruleId,
                                targetHandle: null,
                                data: { lineType: "AND" },
                                label: "AND"
                            });

                            ruleNodes.push({
                                id: ruleId,
                                position: properties?.position || defaultPosition,
                                type: "default",
                                data: {
                                    label: getNodeLabelById(recursiveRule?.and.ruleType),
                                    nodeType: "rule",
                                    nodeControls: {
                                        trigger: {},
                                        rules: {
                                            device: recursiveRule?.and.deviceId,
                                            dataFieldSourceType: (RuleDataSouceTypeEnums[recursiveRule?.and.dataFieldSourceType]?.toString() === RuleDataSouceTypeEnums.device.toString()) ? "device" : "aggregatedField",
                                            sensor: recursiveRule?.and.fieldId,
                                            deviceSource: recursiveRule?.and.fieldId ? "sensor" : "attribute",
                                            operator: recursiveRule?.and.operator,
                                            operatorValue: value?.value,
                                            cadence: value?.cadence,
                                            title: recursiveRule?.and.title,
                                            ruleType: RuleTypeEnums[recursiveRule?.and.ruleType]
                                        },
                                        actions: {},
                                    }
                                }
                            });
                            generateRulesrecursively(recursiveRule?.and);
                        }

                        if (recursiveRule?.or) {
                            const ruleId: string = `${getRuleNodeLabelNameById(recursiveRule?.or?.ruleType)}-${recursiveRule?.or.id}`;
                            const properties: { position: { x: number, y: number } } = convertStringToJson(recursiveRule?.or.properties || "");
                            const value: { value: string, cadence: number } = convertStringToJson(recursiveRule?.or.value || "");

                            edgeNodes.push({
                                id: `edge-${getId()}`,
                                source: parentRuleId,
                                sourceHandle: null,
                                target: ruleId,
                                targetHandle: null,
                                data: { lineType: "OR" },
                                label: "OR"
                            });

                            ruleNodes.push({
                                id: ruleId,
                                position: properties?.position || defaultPosition,
                                type: "default",
                                data: {
                                    label: getNodeLabelById(recursiveRule?.or?.ruleType),
                                    nodeType: "rule",
                                    nodeControls: {
                                        trigger: {},
                                        rules: {
                                            device: recursiveRule?.or?.deviceId,
                                            type: (RuleDataSouceTypeEnums[recursiveRule?.or.dataFieldSourceType] === "device") ? "device" : "aggregatedField",
                                            sensor: recursiveRule?.or?.fieldId,
                                            deviceSource: recursiveRule?.or?.fieldId ? "sensor" : "attribute",
                                            operator: recursiveRule?.or?.operator,
                                            operatorValue: value?.value,
                                            cadence: value?.cadence,
                                            title: recursiveRule?.or?.title,
                                            ruleType: RuleTypeEnums[recursiveRule?.or?.ruleType]
                                        },
                                        actions: {},
                                    }
                                }
                            });
                            generateRulesrecursively(recursiveRule?.or);
                        }
                    }
                } else {
                    const properties: { position: { x: number, y: number } } = convertStringToJson(currenTrigger?.rule?.properties || "");
                    const ruleId: string = `${getRuleNodeLabelNameById(currenTrigger?.rule?.ruleType)}-${currenTrigger?.rule?.id}`;
                    const value: { value: string, cadence: number } = convertStringToJson(currenTrigger?.rule?.value || "");

                    edgeNodes.push({
                        id: `edge-${getId()}`,
                        source: triggerRuleId,
                        sourceHandle: null,
                        target: ruleId,
                        targetHandle: null,
                        data: { lineType: "AND" },
                    });

                    ruleNodes.push({
                        id: ruleId,
                        position: properties?.position || defaultPosition,
                        type: "default",
                        data: {
                            label: getNodeLabelById(currenTrigger?.rule?.ruleType),
                            nodeType: "rule",
                            nodeControls: {
                                trigger: {},
                                rules: {
                                    device: currenTrigger?.rule?.deviceId,
                                    dataFieldSourceType: RuleDataSouceTypeEnums[currenTrigger?.rule?.dataFieldSourceType],
                                    type: (RuleDataSouceTypeEnums[currenTrigger?.rule.dataFieldSourceType] === "device") ? "device" : "aggregatedField",
                                    sensor: currenTrigger?.rule?.fieldId,
                                    deviceSource: currenTrigger?.rule?.fieldId ? "sensor" : "attribute",
                                    operator: currenTrigger?.rule?.operator,
                                    operatorValue: value?.value,
                                    cadence: value?.cadence,
                                    title: currenTrigger?.rule?.title,
                                    ruleType: RuleTypeEnums[currenTrigger?.rule?.ruleType]
                                },
                                actions: {},
                            }
                        }
                    });

                    if (currenTrigger?.rule?.and || currenTrigger?.rule?.or) {
                        generateRulesrecursively(currenTrigger?.rule);
                    }
                }
            };
            generateRulesrecursively();
            // actions
            const actionNodes: Array<FlowElement> = currenTrigger?.actions?.map((action: ActionModel) => {
                const actionNodeId: string = `${getActionNodeIdByTypeEnum(action?.type)}-${getId()}`;
                const properties: { position: { x: number, y: number } } = convertStringToJson(action.properties || "")
                edgeNodes.push({
                    id: `edge-${getId()}`,
                    source: triggerRuleId,
                    sourceHandle: null,
                    target: actionNodeId,
                    targetHandle: null,
                });

                return {
                    id: actionNodeId,
                    type: "output",
                    position: properties?.position || defaultPosition,
                    data: {
                        label: getActionNodeLabelByTypeEnum(action?.type),
                        nodeType: "action",
                        nodeControls: {
                            trigger: {},
                            rules: {},
                            actions: {
                                newAction: !action?.id ? action : null,
                                action: action?.id ? action : null
                            },
                        }
                    },
                } as FlowElement
            }) || [];

            const triggerProperties: { position: { x: number, y: number } } = convertStringToJson(currenTrigger?.properties || "");
            const triggerNodes = {
                id: triggerRuleId,
                type: "input",
                position: triggerProperties?.position || defaultPosition,
                style: { backgroundColor: "#eee" },
                data: {
                    label: currenTrigger?.type === RuleTriggerTypes.dataReceived ? "onDataReceived" : "schedule",
                    nodeType: "trigger",
                    nodeControls: {
                        trigger: {
                            eventName: currenTrigger?.eventName,
                            triggerName: currenTrigger?.name,
                            sourceType: currenTrigger?.sourceType,
                            deviceId: currenTrigger?.deviceId
                        },
                        rules: {},
                        actions: {},
                    }
                },
            };
            setElements((es) => es.concat([triggerNodes, ...actionNodes, ...ruleNodes, ...edgeNodes]));
        }
    }, [currenTrigger]);

    return (
        <div className="rules-container">
            <PageTitle title={`${currenTrigger?.name ? currenTrigger?.name : ''} Rules engine`}>
                <Button label="Save" id="saveBtn" size="sm" theme="outline-primary" title="Add" onClick={handleSave} />
            </PageTitle>
            <div className="rules-holder">
                <div className="rule-engine-body d-flex">
                    <ReactFlowProvider>
                        <EventControls />
                        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                            <ReactFlow
                                elements={elements}
                                onConnect={onConnect}
                                onElementsRemove={onElementsRemove}
                                onLoad={onLoad}
                                onDrop={onDrop}
                                onDragOver={onDragOver}
                                onEdgeUpdate={onEdgeUpdate}
                                onPaneClick={onPanelClick}
                                onElementClick={onElementClick}
                            >
                                <Controls />
                                <Background color="#aaa" gap={16} />

                                {selectedElement && <div className="controls-holder">
                                    <Button label="Delete" theme="danger" onClick={onRemoveNode} size="sm" id="btnDelete" />
                                </div>
                                }
                            </ReactFlow>
                        </div>
                        <EventProperties
                            element={selectedElement}
                            handleTriggerTextChange={handleTriggerTextChange}
                            loading={loading}
                            handleRuleOperatorValueChange={handleRuleOperatorValueChange}
                            handleRuleTitleValueChange={handleRuleTitleValueChange}
                            elements={elements}
                            handleEdgeChange={handleEdgeChange}
                            handleRulesDropDownChange={handleRulesDropDownChange}
                            handleDataSourceChange={handleDataSourceChange}
                            handleTriggerDropDownChange={handleTriggerDropDownChange}
                            handleTriggerStartDateChange={handleTriggerStartDateChange}
                            handleActionsPropertyDropdownChange={handleActionsPropertyDropdownChange}
                            handleActionsDropdownChange={handleActionsDropDownChange}
                            handleActionsPropertyTextChange={handleActionsPropertyTextChange}
                            handleActionsTextChange={handleActionsTextChange}
                            handleActionStatusChange={handleActionStatusChange}
                        />
                    </ReactFlowProvider>
                </div>
            </div>
        </div>
    );
};

export default EventBody;