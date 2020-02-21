import React, { useContext, useState } from "react";
import { DatePicker } from "@material-ui/pickers";
import {
  TextField,
  makeStyles,
  Button,
  InputAdornment
} from "@material-ui/core";
import { AppContext } from "../../../AppContext";
import NumberFormatCustom from "../../Utils/NumberFormatCustom";
import SelectCostType from "./ChilComponent/SelectCostType";

const useStyles = makeStyles(theme => ({
  createTextField: { display: "flex" },
  textField: { marginRight: 8, flexGrow: 1 },
  costTextField: { marginBottom: 12 }
}));

interface State {
  costValue: string;
}

const EntertainAndTravel: React.FC<{ [keys: string]: any }> = props => {
  const classes = useStyles();
  const {
    addCost,
    handleLoadSubtask,
    booleanDispatch,
    dataOnClickAction
  } = props;
  const { apiUrl, fetchPost, projectid, _dateToAPI, _onEnter } = useContext(
    AppContext
  );
  const [type, setType] = useState("entertain");
  const [content, setContent] = useState("");
  const [setupdate, setSetupdate] = useState<Date>(new Date());
  const [values, setValues] = React.useState<State>({
    costValue: "0"
  });

  const handleChange = (name: keyof State) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValues({
      ...values,
      [name]: event.target.value
    });
  };

  async function handleCreate() {
    const response = await fetchPost({
      url: apiUrl("costmanagement"),
      body: {
        action: "create",
        projectid,
        subtaskid: dataOnClickAction.subtask.subtaskid,
        type,
        content,
        value: parseInt(values.costValue),
        setupdate: _dateToAPI(setupdate) ? _dateToAPI(setupdate) : ""
      }
    });
    console.log(response);
    booleanDispatch({ type: "false", key: "addCost" });
    await handleLoadSubtask();
  }

  return (
    <div>
      <div style={{ display: "flex" }}>
        <SelectCostType {...{ type, setType }} />
        <div style={{ width: 8 }} />
        <DatePicker
          clearable
          autoOk
          fullWidth
          className={classes.costTextField}
          variant="inline"
          inputVariant="outlined"
          label="Date"
          value={setupdate}
          onChange={(d: any) => setSetupdate(d ? new Date(d) : d)}
          views={["year", "month", "date"]}
        />
      </div>
      <TextField
        fullWidth
        autoFocus={addCost}
        className={classes.costTextField}
        variant="outlined"
        label="Cost"
        value={content}
        onChange={e => setContent(e.target.value)}
        onKeyPress={_onEnter(handleCreate)}
      />
      <TextField
        fullWidth
        className={classes.costTextField}
        variant="outlined"
        label="Price"
        value={values.costValue}
        onChange={handleChange("costValue")}
        InputProps={{
          startAdornment: <InputAdornment position="start">฿</InputAdornment>,
          inputComponent: NumberFormatCustom as any
        }}
        onFocus={e => e.target.select()}
        onKeyPress={_onEnter(handleCreate)}
      />
      <Button
        disabled={content === "" || values.costValue === ""}
        style={{ width: "100%", marginTop: 12 }}
        variant="contained"
        color="primary"
        size="large"
        onClick={handleCreate}
      >
        Save
      </Button>
    </div>
  );
};
export default EntertainAndTravel;
