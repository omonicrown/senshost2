import React from "react";
import { RouteComponentProps } from "react-router";

const NotFound: React.FunctionComponent<RouteComponentProps> = (
  props: RouteComponentProps
): React.ReactElement<void> => {
  return (
    <React.Fragment>
      <h1>404</h1>
      notFound
    </React.Fragment>
  );
};

export default NotFound;
