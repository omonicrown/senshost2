import React from "react";
import { TextBoxGroup } from "@sebgroup/react-components/dist/TextBoxGroup";
import { Button } from "@sebgroup/react-components/dist/Button";
import { UserModel, GroupModel } from "../../../interfaces/models";
import { Dropdown, DropdownItem } from "@sebgroup/react-components/dist/Dropdown/Dropdown";
import { Loader } from "@sebgroup/react-components/dist/Loader";
import { AuthState, States } from "../../../interfaces/states";
import { useSelector } from "react-redux";

interface AddAndEditUserProps {
    groups: Array<GroupModel>;
    user: UserModel;
    loading: boolean;
    onSave: (e: React.FormEvent<HTMLFormElement>, group: UserModel) => void;
    onCancel: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}
const AddAndEditUser: React.FunctionComponent<AddAndEditUserProps> = (props: AddAndEditUserProps): React.ReactElement<void> => {
    const [user, setUser] = React.useState<UserModel>({ name: "", email: "", password: "", accountId: null, groupId: null } as UserModel);
    const [userError, setUserError] = React.useState<UserModel>({ name: "", email: "", password: "" } as UserModel);

    const [selectedGroup, setSelectedGroup] = React.useState<DropdownItem>({} as DropdownItem);

    const groupOptions: Array<DropdownItem> = React.useMemo(() => props?.groups?.map((group: GroupModel) => ({ label: group.name, value: group.id })), [props?.groups])

    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }, [setUser, user]);

    const authState: AuthState = useSelector((states: States) => states.auth);

    const onCancel = React.useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setUser({ name: "", email: "", password: "" } as UserModel);
        props.onCancel(e);
    }, [setUser]);

    const handleDropdownChange = React.useCallback((value: DropdownItem) => {
        setSelectedGroup(value);
    }, [setSelectedGroup]);

    const onSave = React.useCallback((e: React.FormEvent<HTMLFormElement>) => {
        let errors: UserModel = null
        if (!user?.name) {
            errors = { ...errors, name: "Name is required" };
        }

        if (!user?.email) {
            errors = { ...errors, email: "Email is required" };
        }

        if (!user?.password) {
            errors = { ...errors, password: "Password is required" };
        }

        if (!user?.groupId) {
            errors = { ...errors, groupId: "Select group" };
        }

        if (!errors) {
            props?.onSave(e, {...user,  accountId: authState?.auth?.account?.id });
        }

        setUserError(errors);

        e.preventDefault();
    }, [user, authState?.auth]);

    React.useEffect(() => {
        setUser({ ...user, groupId: selectedGroup?.value });
    }, [selectedGroup]);

    React.useEffect(() => {
        setUser(props?.user);
    }, [props?.user, setUser]);

    React.useEffect(() => {
        const selectedGroup: DropdownItem = groupOptions?.find((item: DropdownItem) => item?.value === props.user?.groupId);
        setSelectedGroup(selectedGroup)
    }, [props?.user, groupOptions]);

    return (
        <form className="add-and-edit-group" onSubmit={onSave}>
            <div className="row">
                <div className="col-12 col-sm-6">
                    <Dropdown
                        label="Group"
                        searchable={true}
                        list={groupOptions}
                        disabled={props?.loading}
                        selectedValue={selectedGroup}
                        error={userError?.groupId}
                        onChange={handleDropdownChange}
                    />
                </div>
                <div className="col-12 col-sm-6">
                    <TextBoxGroup
                        name="email"
                        label="Email"
                        type="email"
                        disabled={props?.loading}
                        placeholder="Email"
                        value={user?.email}
                        error={userError?.email}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-sm-6">
                    <TextBoxGroup
                        name="name"
                        label="Username"
                        placeholder="username"
                        disabled={props?.loading}
                        value={user?.name}
                        error={userError?.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="col-12 col-sm-6">
                    <TextBoxGroup
                        name="password"
                        label="Password"
                        type="password"
                        disabled={props?.loading}
                        placeholder="Password"
                        value={user?.password}
                        error={userError?.password}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className="d-flex flex-sm-row flex-column controls-holder">
                <Button label="Cancel" size="sm" theme="outline-primary" onClick={onCancel} />
                <Button label="Save" type="submit" size="sm" theme="primary" title="Save" onClick={null}>
                    <Loader toggle={props.loading} />
                </Button>
            </div>

        </form>
    );
};

export default AddAndEditUser;