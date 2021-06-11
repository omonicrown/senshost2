import * as React from "react";

import * as actions from "../../actions";

import { SharedProps } from "../home/Home";
import { bindActionCreators, Dispatch } from "redux";
import { States } from "../../interfaces/states";
import { connect } from "react-redux";
import { Button } from "@sebgroup/react-components/dist/Button";
import { Image } from "@sebgroup/react-components/dist/Image";
import { Modal, ModalProps } from "@sebgroup/react-components/dist/Modal/Modal";

import AccountHeader from "./accountHeader/AccountHeader";
import SigninForm from "./signinForm/SigninForm";
import SignupForm from "./signupForm/SignupForm";


import PortalComponent from "../shared/Portal";
import { navigate } from "../../utils/navigateUtil";
import { AppRoutes } from "../../enums/routes";
import { NotificationProps } from "@sebgroup/react-components/dist/notification/Notification";

export type AccountMode = "signup" | "signin";
interface UserAccountStates {
  modal: ModalProps;
  accountMode: AccountMode;
}

class UserAccount extends React.PureComponent<SharedProps, UserAccountStates> {
  constructor(props: SharedProps) {
    super(props);

    this.state = {
      modal: {
        toggle: false,
        fullscreen: false,
        position: "right",
        disableBackdropDismiss: false,
        onDismiss: this.onModalDismiss
      },
      accountMode: null
    }
  }

  onModalDismiss = () => {

  }

  toggleModal = (e?: React.MouseEvent<HTMLButtonElement>, options?: Partial<ModalProps>): void => {
    let props: Partial<ModalProps> = { ...this.state.modal, toggle: !this.state.modal.toggle };
    if (options) {
      props = { ...props, ...options };
    }
    this.setState({ modal: { ...this.state.modal, ...props }, accountMode: options?.toggle ? this.state.accountMode : null });
  }

  setAccountMode = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    const value: AccountMode = e.currentTarget.id as AccountMode;
    this.setState({ accountMode: this.state.accountMode === value ? null : value, modal: { ...this.state.modal, toggle: !this.state.modal.toggle } });
  }

  setAccountModeOnly = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    const value: AccountMode = e.currentTarget.id as AccountMode;

    this.setState({ accountMode: value });

  }

  onSwictchToSignin = () => {
    this.setState({ accountMode: "signin" });
  }

  componentDidMount() {
    if (this.props.authState && (this.props.authState.isAuthenticated || this.props.authState?.auth?.account)) {
      const notification: NotificationProps = {
        theme: "warning",
        title: "Aauthenticated user",
        message: `You are already loggedIn`,
        onDismiss: () => { },
        toggle: true
      };
      this.props.actions && this.props.actions.toggleNotification(notification);
      this.props.history?.replace(AppRoutes.Home);
    }
  }

  componentWillUnmount() {
    this.setState({
      modal: {
        toggle: false,
        fullscreen: false,
        position: "right",
        disableBackdropDismiss: false,
        onDismiss: this.onModalDismiss
      },
      accountMode: null
    })
  }

  render() {
    return (
      <div className="account-container">
        <div className="container-fluid">
          <div className="menu-holder d-flex flex-row">
            <Image src={require("../../assets/images/logo-inner.png")} height="auto" width="auto" useImgTag={true} />
            <div className="account-holder d-flex flex-row">
              <Button label="Sign in" theme="link" onClick={this.setAccountMode} size="sm" id="signin" />
              <Button label="Sign up" theme="link" onClick={this.setAccountMode} size="sm" id="signup" />
            </div>
          </div>
          <PortalComponent>
            <Modal
              toggle={this.state.modal.toggle}
              className="account-forms"
              fullscreen={this.state.modal.fullscreen}
              disableBackdropDismiss={this.state.modal.disableBackdropDismiss}
              position={this.state.modal.position}
              onDismiss={this.toggleModal}
              header={<AccountHeader accountMode={this.state.accountMode} />}
              body={<>
                {this.state.accountMode === "signin" && <SigninForm history={this.props.history} setAccountMode={this.setAccountModeOnly} />}
                {this.state.accountMode === "signup" && <SignupForm history={this.props.history} setAccountMode={this.setAccountModeOnly} onSuccessfullRegister={this.onSwictchToSignin} />} </>}
              ariaLabel="My Label"
              ariaDescribedby="My Description"
            />
          </PortalComponent>
          <div className="jumbotron bg-info-element text-white company-info-holder">
            <div className="container">
              <div className="row">
                <div className="col">
                  <h1 className="app-intro-title">THE ULTIMATE & POWERFUL IOT DEVICE MONITORING SYSTEM</h1>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <p className="app-intro-desc">In this platform you can add, configure & monitor your devices plus analyse your data & generate report(s) and many more....</p>
                </div>
              </div>

              <div className="row">
                <div className="col text-center">
                  <Button
                    id="contactusBtn"
                    label="Contact us"
                    size="lg"
                    theme="ghost-light"
                    onClick={null}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (states: States) => {
  return {
    authState: states.auth
  }
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserAccount);