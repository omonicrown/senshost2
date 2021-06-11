import { Button } from "@sebgroup/react-components/dist/Button";
import { Icon } from "@sebgroup/react-components/dist/Icon";
import React from "react";
import { Link } from "react-router-dom";
import { DashboardItemModel } from "../../../interfaces/models";
import { SvgElement, icontypesEnum } from "../../../utils/svgElement";

interface CardActionprops {
    toggle: boolean;
    onDeleteCardItem: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, card: DashboardItemModel) => void;
    onEditCardItem: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, card: DashboardItemModel) => void;
    dashboardItem: DashboardItemModel;
}

const CardAction: React.FC<CardActionprops> = (props: CardActionprops) => {
    const [toggle, setToggle] = React.useState<boolean>(false);

    const toggleButton = React.useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setToggle(!toggle);

        e.preventDefault();
    }, [toggle]);

    React.useEffect(() => {
        setToggle(false);
    }, [props.toggle])


    return (
        <div className="card-action btn-group" onClick={(e) => e.stopPropagation()}>
            <Button label="" onClick={toggleButton}
                theme="link"
                data-toggle="dropdown" aria-haspopup={toggle}
                aria-expanded={toggle}
                size="sm"
            >
                <Icon src={<SvgElement type={icontypesEnum.BARS} />} />
            </Button>
            <div className={"dropdown-menu" + (toggle ? " show" : "")}>
                <Link className="dropdown-item" to="#" onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => props.onEditCardItem(e, props.dashboardItem)}>Edit</Link>
                <Link className="dropdown-item" to="#" onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => props.onDeleteCardItem(e, props.dashboardItem)}>Delete</Link>
            </div>
        </div>
    )
};

export default CardAction;