import { RadioGroup } from "@sebgroup/react-components/dist/RadioGroup";
import { RadioListModel } from "@sebgroup/react-components/dist/RadioGroup/RadioGroup";
import React from "react";
import { Edge, Elements, FlowElement } from "react-flow-renderer";

interface LineFormProps {
    loading: boolean;
    handleEdgeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    selectedElement: FlowElement & Edge;
    elements: Elements;
}

const LineForm: React.FC<LineFormProps> = (props: LineFormProps): React.ReactElement<void> => {
    const [value, setValue] = React.useState<"AND" | "OR">("AND");

    React.useEffect(() => {
        const element: FlowElement = props.elements?.find((el: FlowElement) => el.id === props.selectedElement?.id);
        setValue(element?.data?.lineType || value)
    }, [props.selectedElement, props.elements, setValue]);

    const list: Array<RadioListModel> = React.useMemo(() => [{
        label: "AND",
        value: "AND",
    }, {
        label: "OR",
        value: "OR",
    }], []);

    return (
        <div className="line-properties-holder">
            <div className="row">
                <RadioGroup
                    name="lineType"
                    disableAll={props.loading}
                    id="lineType"
                    className="col"
                    label="Connection type"
                    value={value}
                    condensed
                    list={list}
                    onChange={props.handleEdgeChange}
                />
            </div>
        </div>
    );
};

export default LineForm;