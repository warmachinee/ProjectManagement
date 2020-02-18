import React, { useState, useContext, useReducer } from "react";
import Loadable from "react-loadable";
import * as AppType from "apptype";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Typography, TextField, Button } from "@material-ui/core";
import { AppContext } from "../../AppContext";
import { grey } from "@material-ui/core/colors";

const GeneralDialog = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'GeneralDialog' */ "../Dialog/GeneralDialog"),
  loading: () => null
});

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2, 3),
    backgroundColor: "white",
    opacity: 0.96,
    maxWidth: 300,
    width: "100%",
    height: "max-content"
  },
  textField: {
    marginBottom: 12
  },
  submitButton: {
    marginTop: 12,
    marginBottom: 8,
    width: "100%"
  },
  sendForgotButton: {
    width: "100%",
    margin: theme.spacing(2, 0)
  }
}));

export interface SignInProps {}

const SignIn: React.FC<SignInProps> = props => {
  const classes = useStyles();
  const {
    apiUrl,
    fetchPost,
    handleCheckSession,
    booleanReducer,
    useForm,
    _onEnter
  } = useContext(AppContext);
  const [{ forgot }, booleanDispatch] = useReducer<
    React.Reducer<AppType.BooleanReducerState, AppType.BooleanReducerActions>
  >(booleanReducer, { forgot: false });
  const [{ username, password, forgotEmail }, formOnChange] = useForm({
    username: "",
    password: "",
    forgotEmail: ""
  });
  const [errorMsg, setErrMsg] = useState({
    username: { state: false, message: "" },
    password: { state: false, message: "" }
  });

  async function handleLogIn() {
    setErrMsg({
      username: { state: false, message: "" },
      password: { state: false, message: "" }
    });
    const response = await fetchPost({
      url: apiUrl("login"),
      body: {
        username: username,
        password: password
      }
    });
    switch (response.status) {
      case "wrong email":
        setErrMsg({
          username: { state: true, message: "Wrong email" },
          password: { state: false, message: "" }
        });
        break;
      case "wrong password":
        setErrMsg({
          username: { state: false, message: "" },
          password: { state: true, message: "Wrong password" }
        });
        break;
      case "success":
        await handleCheckSession();
        break;
      default:
        setErrMsg({
          username: { state: false, message: "" },
          password: { state: false, message: "" }
        });
        break;
    }
  }

  async function handleRecoverPassword() {
    console.log(forgotEmail);
    const response = await fetchPost({
      url: apiUrl("forgotpassword"),
      body: {
        email: forgotEmail
      }
    });
    console.log(response);
    if (response.status) {
      booleanDispatch({ type: "false", key: "forgot" });
    }
    await handleCheckSession();
  }

  // useRenderCheck("SignIn", []);
  return (
    <Paper elevation={4} className={classes.root}>
      <Typography
        gutterBottom
        variant="h5"
        style={{ marginBottom: 24, marginTop: 24 }}
        align="center"
      >
        Sign in
      </Typography>
      <TextField
        autoFocus
        error={errorMsg.username.state}
        helperText={errorMsg.username.message}
        className={classes.textField}
        fullWidth
        name="username"
        placeholder="Username"
        variant="outlined"
        // label="Username"
        onChange={formOnChange}
        onKeyPress={_onEnter(handleLogIn)}
      />
      <TextField
        error={errorMsg.password.state}
        helperText={errorMsg.password.message}
        className={classes.textField}
        fullWidth
        name="password"
        placeholder="Password"
        variant="outlined"
        // label="Password"
        type="password"
        onChange={formOnChange}
        onKeyPress={_onEnter(handleLogIn)}
      />
      <Button
        disabled={username === "" || password === ""}
        className={classes.submitButton}
        size="large"
        color="primary"
        variant="contained"
        onClick={handleLogIn}
      >
        Sign in
      </Button>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          size="small"
          style={{ color: grey[600] }}
          onClick={() =>
            booleanDispatch({
              type: "true",
              key: "forgot"
            })
          }
        >
          Forgot ?
        </Button>
      </div>
      <GeneralDialog
        open={forgot}
        onClose={() => booleanDispatch({ type: "false", key: "forgot" })}
        title="Recover password"
      >
        <div style={{ textAlign: "center" }}>
          <TextField
            autoFocus={forgot}
            name="forgotEmail"
            className={classes.textField}
            fullWidth
            variant="outlined"
            placeholder="Input your email"
            onChange={formOnChange}
            onKeyPress={_onEnter(handleRecoverPassword)}
          />
          <Button
            color="primary"
            variant="contained"
            className={classes.sendForgotButton}
            size="large"
            onClick={handleRecoverPassword}
          >
            Send
          </Button>
        </div>
      </GeneralDialog>
    </Paper>
  );
};
export default SignIn;
