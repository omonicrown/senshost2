import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { PersistGate } from "redux-persist/integration/react";
import { Loader } from "@sebgroup/react-components/dist/Loader";

import {  HashRouter as Browser } from "react-router-dom";
import "url-search-params-polyfill";

import App from "./components/App";
import * as serviceWorker from "./serviceWorker";

import "./styles/main.scss";
import { store, persistor } from "./store/configureStore";

import 'dayjs/locale/es' // load on demand


ReactDOM.render(
  <Provider store={store}>
      <PersistGate loading={<Loader toggle={true} />} persistor={persistor}>
        <Browser>
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </Browser>
      </PersistGate>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
