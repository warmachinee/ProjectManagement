import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button } from "@material-ui/core";
import { AppContext } from "../../../../AppContext";

const useStyles = makeStyles(theme => ({
  textField: { marginBottom: 12 }
}));

export interface TaskNoteProps {
  [keys: string]: any;
}

const TaskNote: React.FC<TaskNoteProps | any> = props => {
  const classes = useStyles();
  const { handleLoadProjectDetail, booleanDispatch, dataOnClickAction } = props;
  const { apiUrl, fetchPost, projectid } = useContext(AppContext);
  const [note, setNote] = useState(
    dataOnClickAction.note ? dataOnClickAction.note : ""
  );

  async function onEditTaskNote() {
    const response = await fetchPost({
      url: apiUrl("tasksystem"),
      body: {
        action: "edit",
        projectid,
        taskid: dataOnClickAction.taskid,
        note,
        boolnote: "true"
      }
    });
    if (response.note === "success") {
      booleanDispatch({ type: "false", key: "note" });
    }
    console.log(response);
    await handleLoadProjectDetail();
  }

  return (
    <div>
      <TextField
        fullWidth
        autoFocus
        multiline
        rows="6"
        rowsMax="20"
        className={classes.textField}
        variant="outlined"
        label="Note"
        value={note}
        onChange={e => setNote(e.target.value)}
      />
      <Button
        disabled={note === dataOnClickAction.note}
        style={{ width: "100%", marginTop: 12 }}
        variant="contained"
        color="primary"
        size="large"
        onClick={onEditTaskNote}
      >
        Save
      </Button>
    </div>
  );
};
export default TaskNote;
