import React from "react";
import { connect } from "react-redux";
import { States } from "../../../interfaces/states";
import { Dispatch, bindActionCreators } from "redux";

import * as actions from "../../../actions";
import { SharedProps } from "../../home/Home";

import { TextBoxGroup } from "@sebgroup/react-components/dist/TextBoxGroup";
import { Button } from "@sebgroup/react-components/dist/Button";
import { Loader } from "@sebgroup/react-components/dist/Loader";


import { AuthApis } from "../../../apis/authApis";
import { HttpBasicAuth, AuthResponseModel } from "../../../interfaces/models";
import { AxiosResponse, AxiosError } from "axios";
import { Link } from "react-router-dom";
import { AppRoutes } from "../../../enums/routes";


const userIcon: JSX.Element = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 170">
        <title>regular_black</title>
        <path d="M149.1,165h-6V132.3c0-18.8-14.2-34.8-32.5-36.8l-24,15.9a3,3,0,0,1-3.3,0L59.2,95.5C41,97.7,26.9,113.6,26.9,132.3V165h-6V132.3c0-22.5,16.7-40.9,38.8-42.9a3,3,0,0,1,1.9.5L85,105.3l23.2-15.4a3,3,0,0,1,1.9-.5c21.9,1.8,39,20.7,39,42.9Z" />
        <path d="M85,86.4A31.7,31.7,0,0,1,53.4,54.8V36.6a31.6,31.6,0,1,1,63.3,0V54.8A31.7,31.7,0,0,1,85,86.4Zm0-75.5A25.7,25.7,0,0,0,59.4,36.6V54.8a25.6,25.6,0,0,0,51.3,0V36.6A25.7,25.7,0,0,0,85,10.9Z" />
    </svg>
);

const keyIcon: JSX.Element = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M336 32c79.529 0 144 64.471 144 144s-64.471 144-144 144c-18.968 0-37.076-3.675-53.661-10.339L240 352h-48v64h-64v64H32v-80l170.339-170.339C195.675 213.076 192 194.968 192 176c0-79.529 64.471-144 144-144m0-32c-97.184 0-176 78.769-176 176 0 15.307 1.945 30.352 5.798 44.947L7.029 379.716A24.003 24.003 0 0 1 0 396.686V488c0 13.255 10.745 24 24 24h112c13.255 0 24-10.745 24-24v-40h40c13.255 0 24-10.745 24-24v-40h19.314c6.365 0 12.47-2.529 16.971-7.029l30.769-30.769C305.648 350.055 320.693 352 336 352c97.184 0 176-78.769 176-176C512 78.816 433.231 0 336 0zm48 108c11.028 0 20 8.972 20 20s-8.972 20-20 20-20-8.972-20-20 8.972-20 20-20m0-28c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z" /></svg>
)


interface SigninProps extends SharedProps {
    setAccountMode: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
}

interface SigninStates {
    auth: HttpBasicAuth;
    errors: HttpBasicAuth;
    loading: boolean;

}

class SigninForm extends React.Component<SigninProps, SigninStates> {
    constructor(props: SigninProps) {
        super(props);

        this.state = {
            auth: {
                username: "",
                password: ""
            },
            errors: {
                username: "",
                password: ""
            },

            loading: false
        };
    }

    onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ auth: { ...this.state.auth, [e.target.name]: e.target.value } });
    }

    onSignIn = (e: React.FormEvent<HTMLFormElement>) => {
        let errors: HttpBasicAuth;
        this.setState({ errors: { ...this.state.errors, username: "", password: "" }, loading: true }, () => {
            if (!this.state?.auth?.username) {
                errors = { ...errors, username: "username cannot be empty" }
            }

            if (!this.state?.auth?.password) {
                errors = { ...errors, password: "password cannot be empty" };
            }

            if (!errors) {
                AuthApis.login(this.state.auth).then((response: AxiosResponse<AuthResponseModel>) => {
                    this.props.actions.receiveAuth(response.data);
                    this.props.history?.push(AppRoutes.Home);
                }).catch((err: AxiosError) => {
                    this.props.actions?.logAuthError(err);
                }).finally(() => {
                    this.setState({ loading: false });
                });
            } else {
                this.setState({ errors,loading: false })
            }
        });
        e.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.onSignIn} className="account-forms-container">
                <div className="row title-holder">
                    <div className="col text-left">
                        or
                        <Link className="ml-2" to="#" onClick={this.props.setAccountMode} id="signup">create an account</Link>
                    </div>
                </div>

                <div className="row">
                    <TextBoxGroup
                        name="username"
                        type="text"
                        className="col"
                        placeholder="Username"
                        value={this.state?.auth?.username}
                        onChange={this.onChange}
                        rightIcon={userIcon}
                        error={this.state.errors.username}
                        disabled={this.state.loading}
                    />
                </div>
                <div className="row">
                    <TextBoxGroup
                        name="password"
                        type="password"
                        className="col"
                        placeholder="password"
                        value={this.state?.auth?.password}
                        onChange={this.onChange}
                        rightIcon={keyIcon}
                        error={this.state.errors.password}
                        disabled={this.state.loading}
                    />
                </div>
                <div className="row">
                    <div className="col text-right">
                        <Button
                            title="Click me"
                            label="Signin"
                            onClick={null}
                            theme="primary"
                            type="submit"
                            size="md"
                            disabled={this.state.loading}
                        >
                            {this.state.loading && <Loader toggle={true} />}
                        </Button>
                    </div>
                </div>
            </form>
        );
    }
}


const mapStateToProps = (states: States) => {
    return {
        auth: states.auth
    }
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SigninForm);
