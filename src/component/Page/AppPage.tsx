import React, { useContext, useState, useReducer } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Loadable from "react-loadable";
import { AppContext } from "../../AppContext";
import { Route, Switch, Redirect } from "react-router-dom";
import * as AppType from "apptype";
import { MenuItem, Menu } from "@material-ui/core";

const Header = Loadable({
  loader: () => import(/* webpackChunkName: 'Header' */ "../Header/Header"),
  loading: () => null
});

const AccountPage = Loadable({
  loader: () => import(/* webpackChunkName: "AccountPage" */ "./AccountPage"),
  loading: () => null
});

const Authentication = Loadable({
  loader: () =>
    import(/* webpackChunkName: "Authentication" */ "./Authentication"),
  loading: () => null
});

const RouteProject = Loadable.Map({
  loader: {
    Project: () =>
      import(/* webpackChunkName: 'RouteProject' */ "../Project/Project")
  },
  render(loaded: any, props: any) {
    let Component = loaded.Project.default;
    return <Route {...props} render={() => <Component {...props} />} />;
  },
  loading: () => null
});

const RouteUnderling = Loadable.Map({
  loader: {
    Underling: () =>
      import(/* webpackChunkName: 'RouteUnderling' */ "../Account/Underling")
  },
  render(loaded: any, props: any) {
    let Component = loaded.Underling.default;
    return <Route {...props} render={() => <Component {...props} />} />;
  },
  loading: () => null
});

const RouteProjectTable = Loadable.Map({
  loader: {
    RouteProjectTable: () =>
      import(
        /* webpackChunkName: 'RouteProjectTable' */ "../Table/Project/ProjectTable"
      )
  },
  render(loaded: any, props: any) {
    let Component = loaded.RouteProjectTable.default;
    return <Route {...props} render={() => <Component {...props} />} />;
  },
  loading: () => null
});

const RouteTestApi = Loadable.Map({
  loader: {
    TestApi: () =>
      import(/* webpackChunkName: 'RouteTestApi' */ "../Utils/TestApi")
  },
  render(loaded: any, props: any) {
    let Component = loaded.TestApi.default;
    return <Route {...props} render={() => <Component {...props} />} />;
  },
  loading: () => null
});

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: window.innerHeight,
    backgroundColor: theme.palette.background.default
  }
}));

export interface AppPageProps {}

const AppPage: React.FC<AppPageProps> = React.memo(props => {
  const classes = useStyles();
  const {
    sess,
    apiUrl,
    fetchGet,
    handleCheckSession,
    booleanReducer
  } = useContext(AppContext);
  const isAuth = sess && sess.status !== "need login before";
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialog, booleanDispatch] = useReducer<
    React.Reducer<AppType.BooleanReducerState, AppType.BooleanReducerActions>
  >(booleanReducer, { createAccount: false });
  const passingProps: any = {
    ...useContext(AppContext),
    dialog,
    booleanDispatch
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  async function handleLogout() {
    await fetchGet(apiUrl("logout"));
    handleCheckSession();
  }

  return (
    <AppContext.Provider value={passingProps}>
      <div className={classes.root}>
        {isAuth && <Header handleClick={handleClick} />}
        <Switch>
          <Route
            exact
            path="/"
            component={isAuth ? AccountPage : Authentication}
          />
          <RouteProject exact path="/project/:projectid" />
          <RouteUnderling path="/:userid" />
          <RouteProjectTable path="/project/" />

          <RouteTestApi path="/testapi" />
        </Switch>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
        >
          {sess && sess.type === "manager" && (
            <MenuItem
              onClick={() =>
                booleanDispatch({ type: "true", key: "createAccount" })
              }
            >
              Create Account
            </MenuItem>
          )}
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
        {!isAuth && <Redirect to="/" />}
      </div>
    </AppContext.Provider>
  );
});
export default AppPage;
