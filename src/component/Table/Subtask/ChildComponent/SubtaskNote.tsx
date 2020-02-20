import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button } from "@material-ui/core";
import { AppContext } from "../../../../AppContext";

const useStyles = makeStyles(theme => ({
  textField: { marginBottom: 12 }
}));

export interface SubtaskNoteProps {
  [keys: string]: any;
}

const SubtaskNote: React.FC<SubtaskNoteProps | any> = props => {
  const classes = useStyles();
  const { handleLoadSubtask, booleanDispatch, dataOnClickAction } = props;
  const { apiUrl, fetchPost, projectid } = useContext(AppContext);
  const [note, setNote] = useState(
    dataOnClickAction.subtask.note ? dataOnClickAction.subtask.note : ""
  );

  async function onEditSubtaskNote() {
    const response = await fetchPost({
      url: apiUrl("subtasksystem"),
      body: {
        action: "edit",
        projectid,
        taskid: dataOnClickAction.task.taskid,
        subtaskid: dataOnClickAction.subtask.subtaskid,
        note,
        boolnote: "true"
      }
    });
    if (response.note === "success") {
      booleanDispatch({ type: "false", key: "note" });
    }
    console.log(response);
    await handleLoadSubtask();
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
        disabled={note === dataOnClickAction.subtask.note}
        style={{ width: "100%", marginTop: 12 }}
        variant="contained"
        color="primary"
        size="large"
        onClick={onEditSubtaskNote}
      >
        Save
      </Button>
    </div>
  );
};
export default SubtaskNote;
