import React from "react";
import {
  makeStyles,
  TableRow,
  TableCell,
  TextField,
  Button
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  createTextField: { display: "flex" },
  textField: { marginRight: 8, flexGrow: 1 },
  costTextField: { marginBottom: 12 }
}));

const CreateSubtaskRow: React.FC<{ [keys: string]: any }> = props => {
  const classes = useStyles();
  const { subtaskName, setSubtaskName, _onEnter, handleCreateSubtask } = props;
  return (
    <TableRow>
      <TableCell colSpan={2} />
      <TableCell colSpan={1}>
        <div className={classes.createTextField}>
          <TextField
            className={classes.textField}
            name="subtaskName"
            size="small"
            value={subtaskName}
            variant="outlined"
            placeholder="Subtask name"
            onChange={e => setSubtaskName(e.target.value)}
            onKeyPress={_onEnter(handleCreateSubtask)}
          />
          <Button
            disabled={subtaskName === ""}
            variant="contained"
            color="primary"
            onClick={handleCreateSubtask}
          >
            Create
          </Button>
        </div>
      </TableCell>
      <TableCell colSpan={8} />
    </TableRow>
  );
};

export default CreateSubtaskRow;
