import React, { useContext, useState } from "react";
import {
  TextField,
  makeStyles,
  Button,
  InputAdornment
} from "@material-ui/core";
import { AppContext } from "../../../AppContext";
import NumberFormatCustom from "../../Utils/NumberFormatCustom";

const useStyles = makeStyles(theme => ({
  createTextField: { display: "flex" },
  textField: { marginRight: 8, flexGrow: 1 },
  costTextField: { marginBottom: 12 }
}));

interface State {
  costValue: string;
}

const CreateCost: React.FC<{ [keys: string]: any }> = props => {
  const classes = useStyles();
  const { costType } = props;
  const {
    apiUrl,
    fetchPost,
    projectid,
    _onEnter,
    handleLoadCost,
    booleanDispatch
  } = useContext(AppContext);
  const [content, setContent] = useState("");
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
        type: costType,
        content,
        ...(costType === "managementfee" && {
          value: parseInt(values.costValue)
        })
      }
    });
    console.log(response);
    if (response.status === "success") {
      booleanDispatch({ type: "false", key: "create" });
    }
    await handleLoadCost();
  }

  return (
    <div>
      <TextField
        fullWidth
        autoFocus
        className={classes.costTextField}
        variant="outlined"
        label="Cost"
        value={content}
        onChange={e => setContent(e.target.value)}
        onKeyPress={_onEnter(handleCreate)}
      />
      {costType === "managementfee" && (
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
      )}

      <Button
        disabled={content === ""}
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
export default CreateCost;
