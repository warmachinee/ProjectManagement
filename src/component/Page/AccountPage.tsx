import React, { useContext, useReducer } from "react";
import Loadable from "react-loadable";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "../../AppContext";

const Manager = Loadable({
  loader: () => import(/* webpackChunkName: 'Manager' */ "../Account/Manager"),
  loading: () => null
});

const User = Loadable({
  loader: () => import(/* webpackChunkName: 'User' */ "../Account/User"),
  loading: () => null
});

const useStyles = makeStyles(theme => ({}));

export interface AccountPageProps {}

const AccountPage: React.FC<AccountPageProps> = props => {
  const classes = useStyles();
  const { sess } = useContext(AppContext);

  switch (sess.type) {
    case "manager":
      return <Manager />;
    case "user":
      return <User />;
    default:
      return <></>;
  }
};
export default AccountPage;
