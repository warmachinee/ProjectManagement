import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  Button,
  Typography,
  IconButton,
  Divider
} from "@material-ui/core";
import { AppContext } from "../../AppContext";
import { Close, Edit } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({}));

export interface TaskNoteProps {}

const NoteItem: React.FC<{
  index: any;
  onDeleteNote: any;
  data: any;
  taskNoteArr: any;
  setTaskNoteArr: any;
}> = props => {
  const classes = useStyles();
  const { index, onDeleteNote, data, taskNoteArr, setTaskNoteArr } = props;

  function onEditNote(note: string) {
    let arr: any = [...taskNoteArr];
    arr[index] = note;
    setTaskNoteArr(arr);
  }

  return (
    <div style={{ display: "flex", alignItems: "center", padding: "4px 0" }}>
      <TextField
        fullWidth
        value={data}
        onChange={e => onEditNote(e.target.value)}
      />
      <div style={{ width: 8 }} />
      <IconButton size="small" onClick={() => onDeleteNote(index)}>
        <Close />
      </IconButton>
    </div>
  );
};

const TaskNote: React.FC<TaskNoteProps> = () => {
  const classes = useStyles();
  const { _onEnter } = useContext(AppContext);
  const [taskNoteArr, setTaskNoteArr] = useState([]);
  const [noteText, setNoteText] = useState("");

  function insertNote() {
    let arr: any = [...taskNoteArr];
    arr.push(noteText);
    setNoteText("");
    setTaskNoteArr(arr);
  }

  function onDeleteNote(index: number) {
    let arr: any = [...taskNoteArr];
    if (index > -1) {
      arr.splice(index, 1);
    }
    setTaskNoteArr(arr);
  }

  return (
    <div>
      {taskNoteArr.map((d: any, i: number) => (
        <NoteItem
          key={i}
          index={i}
          onDeleteNote={onDeleteNote}
          data={d}
          taskNoteArr={taskNoteArr}
          setTaskNoteArr={setTaskNoteArr}
        />
      ))}
      <div style={{ display: "flex", marginTop: 12 }}>
        <TextField
          autoFocus
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Note"
          value={noteText}
          onChange={e => setNoteText(e.target.value)}
          onKeyPress={_onEnter(insertNote)}
        />
        <div style={{ width: 8 }} />
        <Button size="small" variant="contained" color="primary">
          Add
        </Button>
      </div>
    </div>
  );
};
export default TaskNote;
