import React from "react";
import { AccountMode } from "../Account";

interface AccountHeaderProps {
    accountMode: AccountMode;
}

const AccountHeader: React.FunctionComponent<AccountHeaderProps> = (props: AccountHeaderProps): React.ReactElement<void> => {
    return (
        <div className="account-header">
            <h3>{props.accountMode === "signin" ?  "Signin" : "Signup"}</h3>
        </div>
    );
};

export default AccountHeader;