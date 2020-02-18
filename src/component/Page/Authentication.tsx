import React from "react";
import Loadable from "react-loadable";
import { makeStyles } from "@material-ui/core/styles";
import { blueGrey } from "@material-ui/core/colors";

const SignIn = Loadable({
  loader: () => import(/* webpackChunkName: "SignIn" */ "../Account/SignIn"),
  loading: () => null
});

const useStyles = makeStyles(theme => ({
  root: {
    position: "absolute",
    backgroundColor: blueGrey[500],
    height: "100%",
    width: "100%"
  },
  backgroundImage: {
    opacity: 0.7,
    height: "100%",
    width: "100%",
    position: "absolute",
    backgroundImage:
      'url("https://images.pexels.com/photos/106344/pexels-photo-106344.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260")',
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover"
  },
  gridParent: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    position: "relative",
    overflow: "auto"
  },
  grid: {
    display: "flex",
    justifyContent: "center"
  },
  appBar: {
    padding: "16px 12px",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    zIndex: 2,
    height: 64,
    width: "100%",
    position: "absolute"
  }
}));

export interface AuthenticationProps {}

const AuthenAppBar = () => {
  const classes = useStyles();
  return <nav className={classes.appBar}>App bar</nav>;
};

const AuthenGrid = (props: any) => {
  const classes = useStyles();
  return (
    <div className={classes.gridParent}>
      <div style={{ flex: 1 }} />
      <div className={classes.grid}>{props.children}</div>
      <div style={{ flex: 1 }} />
    </div>
  );
};

const Authentication: React.FC<AuthenticationProps> = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {/* <AuthenAppBar /> */}
      <div className={classes.backgroundImage} />
      <AuthenGrid>
        <SignIn />
      </AuthenGrid>
    </div>
  );
};
export default Authentication;
