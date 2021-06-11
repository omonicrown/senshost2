import React from "react";

import * as actions from "../../../actions";
import { SharedProps } from "../../home/Home";

import { TextBoxGroup } from "@sebgroup/react-components/dist/TextBoxGroup"
import { AuthApis } from "../../../apis/authApis";
import { Account, PositiveResponse } from "../../../interfaces/models";
import { Button } from "@sebgroup/react-components/dist/Button";
import { Loader } from "@sebgroup/react-components/dist/Loader";
import { AxiosResponse } from "axios";
import { Link } from "react-router-dom";
import { NotificationProps } from "@sebgroup/react-components/dist/notification/Notification";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { States } from "../../../interfaces/states";


const userIcon: JSX.Element = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 170">
        <title>regular_black</title>
        <path d="M149.1,165h-6V132.3c0-18.8-14.2-34.8-32.5-36.8l-24,15.9a3,3,0,0,1-3.3,0L59.2,95.5C41,97.7,26.9,113.6,26.9,132.3V165h-6V132.3c0-22.5,16.7-40.9,38.8-42.9a3,3,0,0,1,1.9.5L85,105.3l23.2-15.4a3,3,0,0,1,1.9-.5c21.9,1.8,39,20.7,39,42.9Z" />
        <path d="M85,86.4A31.7,31.7,0,0,1,53.4,54.8V36.6a31.6,31.6,0,1,1,63.3,0V54.8A31.7,31.7,0,0,1,85,86.4Zm0-75.5A25.7,25.7,0,0,0,59.4,36.6V54.8a25.6,25.6,0,0,0,51.3,0V36.6A25.7,25.7,0,0,0,85,10.9Z" />
    </svg>
);



interface SignupFormProps extends SharedProps {
    setAccountMode: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
    onSuccessfullRegister: () => void;
}

interface SignupFormStates {
    auth: Account & { cpassword: string };
    errors: Account & { cpassword: string };
    loading: boolean;
}

class SignupForm extends React.Component<SignupFormProps, SignupFormStates> {
    private authApi: AuthApis;

    constructor(props: SignupFormProps) {
        super(props);
        this.authApi = new AuthApis();

        this.state = {
            auth: {
                name: "",
                password: "",
                email: "",
                id: null,
                creationDate: null,
                cpassword: ""
            },
            errors: {
                name: "",
                password: "",
                email: "",
                id: "",
                creationDate: null,
                cpassword: ""
            },
            loading: false
        };
    }

    onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ auth: { ...this.state.auth, [e.target.name]: e.target.value } });
    }

    onSignUp = (e: React.FormEvent<HTMLFormElement>) => {
        let errors: Account & { cpassword: string };
        this.setState({ errors: { ...this.state.errors, name: "", password: "", cpassword: "" }, loading: true }, () => {
            if (!this.state?.auth?.name) {
                errors = { ...errors, name: "username cannot be empty" }
            }
            if (!this.state?.auth?.email) {
                errors = { ...errors, email: "email cannot be empty" };
            }
            if (!this.state?.auth?.password) {
                errors = { ...errors, password: "password cannot be empty" };
            }
            if (this.state.auth.password !== this.state.auth.cpassword) {
                errors = { ...errors, cpassword: "passwords do not match" }
            }
        
            if (!errors) {
                AuthApis.signup({
                    id: null,
                    name: this.state.auth?.name,
                    email: this.state.auth?.email,
                    password: this.state.auth.password
                }).then((response: AxiosResponse<PositiveResponse>) => {
                    const notification: NotificationProps = {
                        theme: "success",
                        title: "Registration success",
                        message: `Your registration is successful`,
                        toggle: true,
                        onDismiss: () => { }
                    };
                    this.props.actions.toggleNotification(notification);
                    this.props.onSuccessfullRegister();
                }).finally(() => {
                    this.setState({ loading: false });
                });
            } else {
                this.setState({ errors, loading: false });
            }
        });
        e.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.onSignUp} className="account-forms-container">
                <div className="row title-holder">
                    <div className="col text-left">
                        already a member ?
                        <Link className="ml-2" to="#" onClick={this.props.setAccountMode} id="signin">Sign in</Link>
                    </div>
                </div>
                <div className="row">
                    <TextBoxGroup
                        name="name"
                        className="col"
                        placeholder="username"
                        value={this.state?.auth?.name}
                        onChange={this.onChange}
                        rightIcon={userIcon}
                        error={this.state.errors.name}
                    />
                </div>
                <div className="row">
                    <div className="col">
                        <TextBoxGroup
                            name="email"
                            type="email"
                            placeholder="email"
                            value={this.state?.auth?.email}
                            onChange={this.onChange}
                            rightIcon={userIcon}
                            error={this.state.errors.email}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <TextBoxGroup
                            name="password"
                            type="password"
                            placeholder="password"
                            value={this.state?.auth?.password}
                            onChange={this.onChange}
                            rightIcon={userIcon}
                            error={this.state.errors.password}
                        />
                    </div>
                </div>


                <div className="row">
                    <div className="col">
                        <TextBoxGroup
                            name="cpassword"
                            type="password"
                            placeholder="confirm password"
                            value={this.state?.auth?.cpassword}
                            onChange={this.onChange}
                            rightIcon={userIcon}
                            error={this.state.errors.cpassword}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col text-right">
                        <Button
                            title="Click me"
                            label="Signup"
                            id="signupBtn"
                            onClick={null}
                            theme="primary"
                            type="submit"
                            size="md"
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

export default connect(mapStateToProps, mapDispatchToProps)(SignupForm);
