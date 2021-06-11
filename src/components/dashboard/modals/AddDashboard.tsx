import { Button } from "@sebgroup/react-components/dist/Button";
import { Dropdown, DropdownItem } from "@sebgroup/react-components/dist/Dropdown/Dropdown";
import { Loader } from "@sebgroup/react-components/dist/Loader";
import { TextArea } from "@sebgroup/react-components/dist/TextArea";
import { TextBoxGroup } from "@sebgroup/react-components/dist/TextBoxGroup";
import React from "react";
import { useSelector } from "react-redux";
import { DashboardModel, GroupModel } from "../../../interfaces/models";
import { AuthState, States } from "../../../interfaces/states";

interface AddDashboardProps {
    authState: AuthState;
    onSave: (e: React.FormEvent<HTMLFormElement>, dashboard: DashboardModel) => void;
    onCancel: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    loading: boolean;
    dashboard?: DashboardModel;
}

const AddDashboard: React.FC<AddDashboardProps> = (props: AddDashboardProps): React.ReactElement<void> => {
    const [dashboard, setDashboard] = React.useState<DashboardModel>({ name: "" } as DashboardModel);
    const [dashboardErrors, setDashboardErrors] = React.useState<DashboardModel>(null);
    const [selectedGroup, setSelectedGroup] = React.useState<DropdownItem>({} as DropdownItem);

    const groupState = useSelector((states: States) => states.groups);

    const groupOptions: Array<DropdownItem> = React.useMemo(() => groupState?.groups.map((group: GroupModel) => ({ label: group.name, value: group.id })), [groupState?.groups])


    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setDashboard({ ...dashboard, [e.target.name]: e.target.value });
    }, [setDashboard, dashboard]);

    const handleGroupDropdownChange = React.useCallback((localGroup: DropdownItem) => {
        setSelectedGroup(localGroup);

        setDashboard({ ...dashboard, groupId: localGroup?.value });
    }, [setSelectedGroup, dashboard]);

    const onSave = React.useCallback((e: React.FormEvent<HTMLFormElement>) => {
        let errors: DashboardModel = null;

        if (!dashboard?.description) {
            errors = { ...errors, description: "description is required" };

        }
        if (!dashboard.name) {
            errors = { ...errors, name: "name is required" };
        }
        if (!dashboard.groupId) {
            errors = { ...errors, groupId: "Please select a group" };
        }

        if (!errors) {
            props?.onSave(e, { ...dashboard, accountId: props?.authState?.auth?.account?.id });
        }

        setDashboardErrors(errors);
        e.preventDefault();

    }, [props?.authState?.auth, dashboard]);

    React.useEffect(() => {
        if (props.dashboard) {
            setDashboard(props.dashboard);
        }
    }, [props.dashboard]);

    React.useEffect(() => {
        const selectedGroup: GroupModel = groupState?.groups?.find((group: GroupModel) => group.id === dashboard.groupId);
        setSelectedGroup({ label: selectedGroup?.name, value: selectedGroup?.id });
    }, [dashboard?.groupId]);

    return (
        <form className="add-dashboard" onSubmit={onSave}>
            <div className="row">
                <div className="col-12 col-sm-6">
                    <Dropdown
                        label="Group"
                        searchable={true}
                        list={groupOptions}
                        disabled={props?.loading}
                        selectedValue={selectedGroup}
                        error={dashboardErrors?.groupId}
                        onChange={handleGroupDropdownChange}
                    />
                </div>
                <div className="col-12 col-sm-6">
                    <TextBoxGroup
                        name="name"
                        label="Name"
                        type="text"
                        disabled={props?.loading}
                        placeholder="Dashboard name"
                        value={dashboard?.name}
                        error={dashboardErrors?.name}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <TextArea value={dashboard?.description}
                        label="Description"
                        error={dashboardErrors?.description}
                        id="description"
                        name="description"
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className="d-flex flex-sm-row flex-column controls-holder">
                <Button label="Cancel" size="sm" theme="outline-primary" onClick={props.onCancel} />
                <Button label="Save" type="submit" size="sm" theme="primary" title="Save" onClick={null}>
                    <Loader toggle={props.loading} />
                </Button>
            </div>
        </form>
    );
};

export default AddDashboard;