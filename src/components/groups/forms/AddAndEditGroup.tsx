import React from "react";
import { TextBoxGroup } from "@sebgroup/react-components/dist/TextBoxGroup";
import { GroupModel } from "../../../interfaces/models";
import { Button } from "@sebgroup/react-components/dist/Button";
import { Loader } from "@sebgroup/react-components/dist/Loader";

interface AddAndEditGroupProps {
    onSave: (e: React.FormEvent<HTMLFormElement>, group: GroupModel) => void;
    onCancel: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    group: GroupModel;
    loading: boolean;
}
const AddAndEditGroup: React.FunctionComponent<AddAndEditGroupProps> = (props: AddAndEditGroupProps): React.ReactElement<void> => {
    const [group, setGroup] = React.useState<GroupModel>({ name: "" } as GroupModel);
    const [groupError, setGroupError] = React.useState<GroupModel>({ name: "" } as GroupModel);

    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setGroup({ ...group, [e.target.name]: e.target.value });
    }, [group]);

    const onCancel = React.useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setGroup({ name: "" } as GroupModel);
        props.onCancel(e);
    }, [group]);


    const onSave = React.useCallback((e: React.FormEvent<HTMLFormElement>) => {
        if (!group?.name) {
            setGroupError({ ...groupError, name: "Group name is required" } as GroupModel);
        } else {
            props?.onSave(e, group);
        }

        e.preventDefault();
    }, [group]);

    React.useEffect(() => {
        setGroup(props?.group);
    }, [props.group]);

    return (
        <form className="add-and-edit-group" onSubmit={onSave}>
            <div className="row">
                <div className="col">
                    <TextBoxGroup
                        name="name"
                        label="Group name"
                        placeholder="Name"
                        value={group?.name}
                        disabled={props?.loading}
                        error={groupError?.name}
                        onChange={handleChange}
                    />
                </div>
            </div>
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
};

export default AddAndEditGroup;