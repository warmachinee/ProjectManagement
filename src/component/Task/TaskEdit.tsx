import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "../../AppContext";
import {
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";

const useStyles = makeStyles(theme => ({
  textField: { marginBottom: 12 }
}));

export interface TaskEditProps {
  data: any;
}

const TaskEdit: React.FC<TaskEditProps> = ({ data }) => {
  const classes = useStyles();
  const { projectDetail, useForm, _dateToString, booleanReducer } = useContext(
    AppContext
  );
  const [form, formOnChange, setForm] = useForm({
    taskname: "",
    ownerlist: "",
    contact: ""
  });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [priority, setPriority] = useState<string | unknown>("LOW");
  const [status, setStatus] = useState<string | unknown>("inprogress");

  function setInitialData() {
    setForm({
      taskname: data.taskname,
      ownerlist: data.ownerlist,
      contact: data.contact
    });
    setPriority(data.priority);
    setStartDate(new Date(data.startdate));
    setEndDate(new Date(data.enddate));
  }

  useEffect(() => {
    setInitialData();
  }, []);

  return (
    <div>
      <TextField
        fullWidth
        className={classes.textField}
        variant="outlined"
        label="Task name"
        name="taskname"
        value={form.taskname}
        onChange={formOnChange}
      />
      <FormControl fullWidth variant="outlined" className={classes.textField}>
        <InputLabel>Priority</InputLabel>
        <Select
          value={priority}
          onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
            setPriority(e.target.value)
          }
        >
          <MenuItem value={"LOW"}>LOW</MenuItem>
          <MenuItem value={"MEDIUM"}>MEDIUM</MenuItem>
          <MenuItem value={"HIGH"}>HIGH</MenuItem>
        </Select>
      </FormControl>
      <div style={{ display: "flex", marginBottom: 12 }}>
        <DatePicker
          autoOk
          variant="inline"
          inputVariant="outlined"
          label="Start date"
          value={startDate}
          onChange={(date: any) => setStartDate(new Date(date))}
          views={["year", "month", "date"]}
        />
        <div style={{ width: 8 }} />
        <DatePicker
          autoOk
          variant="inline"
          inputVariant="outlined"
          label="End date"
          value={endDate}
          onChange={(date: any) => setEndDate(new Date(date))}
        />
      </div>
      <FormControl fullWidth variant="outlined" className={classes.textField}>
        <InputLabel>Task status</InputLabel>
        <Select
          value={status}
          onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
            setStatus(e.target.value)
          }
        >
          <MenuItem value={"inprogress"}>Inprogress</MenuItem>
          <MenuItem value={"pending"}>Pending</MenuItem>
          <MenuItem value={"complete"}>Complete</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        className={classes.textField}
        variant="outlined"
        label="Owner list"
        name="ownerlist"
        value={form.ownerlist || ""}
        onChange={formOnChange}
      />
      <TextField
        fullWidth
        className={classes.textField}
        variant="outlined"
        label="Contact"
        name="contact"
        value={form.contact || ""}
        onChange={formOnChange}
      />
      <Button
        style={{ width: "100%", marginTop: 12 }}
        variant="contained"
        color="primary"
        size="large"
      >
        Save
      </Button>
    </div>
  );
};
export default TaskEdit;
