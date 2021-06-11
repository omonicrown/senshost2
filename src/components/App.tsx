import * as React from "react";
import { Loader } from "@sebgroup/react-components/dist/Loader";
import { AppRoute } from "../utils/functions";
import { Redirect, Switch, RouteComponentProps, withRouter } from "react-router";

import { actionTypes } from "../types";
import NotificationHook from "./shared/NotificationHook";
import { AppRoutes } from "../enums/routes";


const NotFound: React.LazyExoticComponent<React.FunctionComponent<RouteComponentProps>> = React.lazy(() => import("./notFound/404"));
const Home: any = React.lazy(() => import("./home/Home"));
const Account: any = React.lazy(() => import("./account/Account"));


export interface SharedProps extends RouteComponentProps {
  actions: actionTypes;
}

const App: React.FunctionComponent<SharedProps> = React.memo((props: SharedProps): React.ReactElement<void> => {
  return (
    <div className="main-app-container">
      <NotificationHook />
      <React.Suspense fallback={<Loader toggle={true} />}>
        <Switch>
          <Redirect exact from="/" to={AppRoutes.Account} />
          <AppRoute path={AppRoutes.Account} component={(Account)} props={props} />
          <AppRoute path={AppRoutes.Home} component={(Home)} props={props} />
          <AppRoute path="*" component={NotFound} props={props} />
        </Switch>
      </React.Suspense>
    </div>
  );

});


export default withRouter<any, any>(App);