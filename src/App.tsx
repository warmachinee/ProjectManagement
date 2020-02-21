import React, { useState, useEffect } from "react";
import Loadable from "react-loadable";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider
} from "@material-ui/core/styles";
import { AppContext } from "./AppContext";
import * as API from "./api";
import * as AppType from "apptype";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import { blue } from "@material-ui/core/colors";
const api: any = API.exportApi;

const AppPage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "AppPage" */ "./component/Page/AppPage"),
  loading: () => null
});

const useStyles = makeStyles(theme => ({
  root: {}
}));

interface AppProps {}

const App: React.FC<AppProps> = () => {
  const classes = useStyles();
  const [sess, setSess] = useState<AppType.Session>(
    api._onLocalhost({
      type: "manager",
      fullname: "Sippakorn",
      lastname: "Suphapinyo",
      photopath: null
    })
  );
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const appTheme = createMuiTheme({
    palette: {
      type: isDarkMode ? "dark" : "light",
      primary: blue
    }
  });

  const passingProps: any = {
    ...api,
    sess,
    isDarkMode,
    toggleDarkMode,
    handleCheckSession
  };

  function toggleDarkMode() {
    setIsDarkMode(state => !state);
  }

  async function handleCheckSession() {
    const response = await api.fetchGet(api.apiUrl("session"));
    console.log(response);
    setSess(response);
  }

  useEffect(() => {
    handleCheckSession();
  }, []);

  return (
    <AppContext.Provider value={passingProps}>
      <ThemeProvider theme={appTheme}>
        <div className={classes.root}>
          <DndProvider backend={Backend}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <AppPage />
            </MuiPickersUtilsProvider>
          </DndProvider>
        </div>
      </ThemeProvider>
    </AppContext.Provider>
  );
};
export default App;
