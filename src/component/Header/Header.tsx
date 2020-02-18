import React, { useContext } from "react";
import Loadable from "react-loadable";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar
} from "@material-ui/core";
import { AppContext } from "../../AppContext";
import {
  AccountCircle,
  Brightness5Outlined,
  Brightness4Outlined
} from "@material-ui/icons";

const AppBreadcrumbs = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'AppBreadcrumbs' */ "../Route/AppBreadcrumbs"),
  loading: () => null
});

const useStyles = makeStyles(theme => ({
  avatar: {
    backgroundColor: "white",
    color: theme.palette.primary.dark
  },
  offset: theme.mixins.toolbar
}));

export interface HeaderProps {
  handleClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}

const Header: React.FC<HeaderProps> = props => {
  const classes = useStyles();
  const { webURL, sess, isDarkMode, toggleDarkMode } = useContext(AppContext);
  const { handleClick } = props;
  return (
    <React.Fragment>
      <AppBar position="fixed">
        <Toolbar>
          {sess && (
            <React.Fragment>
              {sess.type === "manager" && (
                <Typography variant="h5" style={{ marginRight: 16 }}>
                  [ Manager ]
                </Typography>
              )}
              <Typography
                variant={sess.type === "manager" ? "body1" : "h6"}
                style={{ marginTop: 4 }}
              >
                {sess ? `${sess.fullname} ${sess.lastname}` : "Username"}
              </Typography>
            </React.Fragment>
          )}
          <div style={{ flex: 1 }} />
          <IconButton onClick={toggleDarkMode}>
            {isDarkMode ? (
              <Brightness5Outlined style={{ color: "white" }} />
            ) : (
              <Brightness4Outlined style={{ color: "white" }} />
            )}
          </IconButton>
          <IconButton onClick={handleClick}>
            {sess ? (
              sess.photopath ? (
                <Avatar src={`${webURL}${sess.photopath}`} />
              ) : (
                <Avatar className={classes.avatar}>
                  {sess.fullname.substring(0, 1)}
                </Avatar>
              )
            ) : (
              <AccountCircle style={{ color: "white" }} fontSize="large" />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>
      <div className={classes.offset} />
      <AppBreadcrumbs />
    </React.Fragment>
  );
};
export default Header;
