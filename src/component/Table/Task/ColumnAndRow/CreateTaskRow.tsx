import React from "react";
import {
  TableRow,
  TableCell,
  TextField,
  Button,
  useTheme
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  createTextField: { display: "flex" },
  textField: { marginRight: 8, flexGrow: 1 }
}));

const CreateTaskRow: React.FC<{ [keys: string]: any }> = props => {
  const classes = useStyles();
  const theme = useTheme();
  const {
    taskName,
    setTaskName,
    _onEnter,
    handleCreateTask,
    isDarkMode
  } = props;

  let backgroundColor = isDarkMode
    ? theme.palette.grey[700]
    : theme.palette.grey[100];

  return (
    <TableRow style={{ backgroundColor }}>
      <TableCell colSpan={2} />
      <TableCell colSpan={1}>
        <div className={classes.createTextField}>
          <TextField
            className={classes.textField}
            name="taskName"
            size="small"
            value={taskName}
            variant="outlined"
            placeholder="Task name"
            onChange={e => setTaskName(e.target.value)}
            onKeyPress={_onEnter(handleCreateTask)}
          />
          <Button
            disabled={taskName === ""}
            variant="contained"
            color="primary"
            onClick={handleCreateTask}
          >
            Create
          </Button>
        </div>
      </TableCell>
      <TableCell colSpan={8} />
    </TableRow>
  );
};

export default CreateTaskRow;
