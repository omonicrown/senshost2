import { icontypesEnum } from "../utils/svgElement";

export interface MenuItem {
    name: string;
    iconType: icontypesEnum;
    title: string;
    onClick: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
}