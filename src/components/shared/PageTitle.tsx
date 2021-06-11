import React from "react";

interface PageTitleProps {
    title: string;
    children?: React.ReactNode;
}

const PageTitle: React.FC<PageTitleProps> = (props: PageTitleProps): React.ReactElement<void> => {
    return (
        <div className="row no-gutters page-title">
            <div className="col">
                <h4 className="title">
                    {props.title}
                </h4>
            </div>
            {props.children && <div className="col text-right">{props.children}</div>}
        </div>
    )
};

export default PageTitle;