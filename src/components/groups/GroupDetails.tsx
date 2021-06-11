import React from "react";
import { UserApis } from "../../apis/userApis";
import { AxiosResponse, AxiosError } from "axios";
import { GroupModel, UserModel } from "../../interfaces/models";
import { Column, Table } from "@sebgroup/react-components/dist/Table/Table";
import { match, useRouteMatch } from "react-router";
import PageTitle from "../shared/PageTitle";
import { GroupApis } from "../../apis/groupApis";

interface GroupDetailsProps {
}

const GroupDetails: React.FunctionComponent<GroupDetailsProps> = (props: GroupDetailsProps): React.ReactElement<void> => {
    const [users, setUsers] = React.useState<Array<UserModel>>(null);
    const [group, setGroup] = React.useState<GroupModel>({} as GroupModel);

    const match: match<{ groupId: string }> = useRouteMatch();

    const columns: Array<Column> = React.useMemo((): Array<Column> => [
        {
            label: "Username",
            accessor: "name"
        },
        {
            label: "Email",
            accessor: "email",
            isHidden: false
        },
        {
            label: "date",
            accessor: "creationDate"
        }
    ], []);

    React.useEffect(() => {
        if (match?.params?.groupId) {
            UserApis?.getUsersByGroupId(match?.params?.groupId)
                .then((response: AxiosResponse<Array<UserModel>>) => {
                    if (response?.data) {
                        setUsers(response.data);
                    }
                })
                .catch((error: AxiosError) => setUsers([]));

            GroupApis.getGroupById(match?.params?.groupId)
                .then((response: AxiosResponse<GroupModel>) => {
                    if (response?.data) {
                        setGroup(response.data);
                    }
                })
                .catch((error: AxiosError) => setGroup({} as GroupModel));
        }

    }, [match?.params?.groupId]);

    return (
        <div className="groups-container">
            <PageTitle title={`${group?.name || ''} users`} />
            <div className="group-holder">
                <div className="row">
                    <div className="col">
                        <div className="card">
                            <div className="card-body">
                                <Table
                                    columns={columns}
                                    data={users}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

};

export default GroupDetails;