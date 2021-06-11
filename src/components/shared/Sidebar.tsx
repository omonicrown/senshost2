import React from "react";
import { Icon } from "@sebgroup/react-components/dist/Icon";
import { SvgElement, icontypesEnum } from "../../utils/svgElement";
import { useHistory } from "react-router";
import { History } from 'history';
import { Link } from "react-router-dom";

interface SidebarProps {
    toggle: boolean;
}

interface MenuItem {
    name: string;
    iconType: icontypesEnum;
    title: string;
}

const Sidebar: React.FunctionComponent<SidebarProps> = (props: SidebarProps): React.ReactElement<void> => {
    const history: History = useHistory();

    const isActiveTab = React.useCallback((tabName: string) => {
        const historyArr = history.location?.pathname?.split("/");
        return historyArr?.some((tab: string) => tab === tabName);
    }, [history?.location.pathname]);


    const menuItems: Array<MenuItem> = [
        {
            name: "dashboard",
            iconType: icontypesEnum.DASHBAORD,
            title: "Dashboard"
        },
        {
            name: "devices",
            iconType: icontypesEnum.DEVICES,
            title: "Devices"
        },
        {
            name: "triggers",
            iconType: icontypesEnum.TRIGGERS,
            title: "Rules engine"
        },
        {
            name: "actions",
            iconType: icontypesEnum.ACTIONS,
            title: "Actions"
        },
        {
            name: "groups",
            iconType: icontypesEnum.GROUPS,
            title: "Groups"
        },
        {
            name: "users",
            iconType: icontypesEnum.USERS,
            title: "Users"
        },
    ];

    return (
        <aside className={"left-side-container " + (props.toggle ? "sidemenu-opened" : "sidemenu-closed")}>
            <div className="sidebar-content">
                <div className="row">
                    <div className="sidebar-sticky col">
                        <ul className="nav d-flex flex-column">
                            {menuItems?.map((menu: MenuItem) =>
                                <li className={"nav-item"} key={menu.name}>
                                    <Link className={"title-holder d-flex " + (isActiveTab(menu.name) ? " active" : "")} to={`/home/${menu.name}`}>
                                        <Icon src={<SvgElement type={menu.iconType} />} />
                                        <span className="title">{menu.title}</span>
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </aside>
    )
};

export default Sidebar;