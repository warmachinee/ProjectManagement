import React, { useState, useContext } from "react";
import Loadable from "react-loadable";
import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button
} from "@material-ui/core";
import { AppContext } from "../../AppContext";
import * as AppType from "apptype";
import BudgetProfitChart from "../Chart/BudgetProfitChart";

const GeneralDialog = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'GeneralDialog' */ "../Dialog/GeneralDialog"),
  loading: () => null
});

const useStyles = makeStyles(theme => ({
  offset: theme.mixins.toolbar,
  formControl: { margin: theme.spacing(1, 0) },
  radioGroup: { flexDirection: "row" },
  textField: { marginBottom: 12 },
  createAccountButton: {
    width: "100%",
    margin: theme.spacing(2, 0)
  }
}));

export interface ManagerProps {}

const Manager: React.FC<ManagerProps> = props => {
  const classes = useStyles();
  const { fetchPost, apiUrl, useForm, dialog, booleanDispatch } = useContext(
    AppContext
  );

  const [
    { username, password, fullname, lastname },
    formOnChange,
    setForm
  ] = useForm({
    username: "",
    password: "",
    fullname: "",
    lastname: ""
  });
  const [accountType, setAccountType] = useState("user");

  function handleOnKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      if (
        !(
          username === "" ||
          password === "" ||
          fullname === "" ||
          lastname === ""
        )
      ) {
        handleCreateAccount();
      }
    }
  }

  async function handleCreateAccount() {
    const response = await fetchPost({
      url: apiUrl("register"),
      body: {
        username: username,
        password: password,
        fullname: fullname,
        lastname: lastname,
        type: accountType
      }
    });
    console.log(response);
    setForm({
      username: "",
      password: "",
      fullname: "",
      lastname: ""
    });
    setAccountType("user");
    booleanDispatch({ type: "false", key: "createAccount" });
  }

  return (
    <div>
      <BudgetProfitChart />
      <GeneralDialog
        open={dialog.createAccount}
        onClose={() => booleanDispatch({ type: "false", key: "createAccount" })}
        title="Create Account"
      >
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Account Type</FormLabel>
          <RadioGroup
            className={classes.radioGroup}
            value={accountType}
            onChange={e => setAccountType(e.target.value)}
          >
            <FormControlLabel
              value="user"
              control={<Radio color="primary" />}
              label="User"
            />
            <FormControlLabel
              value="manager"
              control={<Radio color="primary" />}
              label="Manager"
            />
          </RadioGroup>
        </FormControl>
        <TextField
          autoFocus
          fullWidth
          className={classes.textField}
          name="username"
          placeholder="Username or email"
          variant="outlined"
          type="text"
          onChange={formOnChange}
          onKeyPress={handleOnKeyPress}
        />
        <TextField
          fullWidth
          className={classes.textField}
          name="password"
          placeholder="Password"
          variant="outlined"
          type="password"
          onChange={formOnChange}
          onKeyPress={handleOnKeyPress}
        />
        <TextField
          fullWidth
          className={classes.textField}
          name="fullname"
          placeholder="First name"
          variant="outlined"
          type="text"
          onChange={formOnChange}
          onKeyPress={handleOnKeyPress}
        />
        <TextField
          fullWidth
          className={classes.textField}
          name="lastname"
          placeholder="Last name"
          variant="outlined"
          type="text"
          onChange={formOnChange}
          onKeyPress={handleOnKeyPress}
        />
        <Button
          disabled={
            username === "" ||
            password === "" ||
            fullname === "" ||
            lastname === ""
          }
          className={classes.createAccountButton}
          color="primary"
          variant="contained"
          size="large"
          onClick={handleCreateAccount}
        >
          Create
        </Button>
      </GeneralDialog>
    </div>
  );
};
export default Manager;
