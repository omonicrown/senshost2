import * as React from "react";
import { createPortal } from "react-dom";

export default class PortalComponent extends React.PureComponent<{ children: any }, {}> {
    private el: HTMLDivElement;
    private portalRoot: HTMLElement;

    constructor(props: { children: any }) {
        super(props);
        this.el = document.createElement("div");
        this.portalRoot = document.getElementById("portal");
    }

    componentDidMount = () => {
        this.portalRoot?.appendChild(this.el);
    };

    componentWillUnmount = () => {
        this.portalRoot?.removeChild(this.el);
    };

    render() {
        const { children } = this.props;
        return createPortal(children, this.el);
    }
}