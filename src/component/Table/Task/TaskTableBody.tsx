import React, { useContext, useState, useCallback } from "react";
import {
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Button,
  useTheme
} from "@material-ui/core";
import update from "immutability-helper";
import { makeStyles } from "@material-ui/core/styles";
import AppType from "apptype";
import { AppContext } from "../../../AppContext";
import TaskTableBodyRow from "./TaskTableBodyRow";

const useStyles = makeStyles(theme => ({
  createTextField: { display: "flex" },
  textField: { marginRight: 8, flexGrow: 1 }
}));

export interface TaskTableBodyProps {}

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

const TaskTableBody: React.FC<TaskTableBodyProps> = React.memo(() => {
  const classes = useStyles();
  const {
    apiUrl,
    fetchPost,
    project,
    setProject,
    useForm,
    projectid,
    handleLoadProjectDetail,
    _onEnter,
    isDarkMode
  } = useContext(AppContext);
  const [current, setCurrent] = useState<AppType.ProjectTask | null>(null);
  const [target, setTarget] = useState<AppType.ProjectTask | null>(null);
  const [taskName, setTaskName] = useState<string>("");
  const moveTask = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const current = project.tasklist[dragIndex];
      const hover = project.tasklist[hoverIndex];
      setCurrent(current);
      setTarget(hover);
      const updateTaskList = update(project.tasklist, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, current]
        ]
      });
      setProject({ ...project, tasklist: updateTaskList });
    },
    [project, target]
  );

  async function handleCreateTask() {
    const response = await fetchPost({
      url: apiUrl("tasksystem"),
      body: { action: "create", projectid: projectid, taskname: taskName }
    });
    console.log(response);
    if (response.status === "success") {
      setTaskName("");
    }
    await handleLoadProjectDetail();
  }

  return (
    <TableBody>
      <CreateTaskRow
        {...{ taskName, setTaskName, _onEnter, handleCreateTask, isDarkMode }}
      />
      {project && (
        <React.Fragment>
          {project.tasklist.map((d: AppType.ProjectTask, i: number) => {
            return (
              <TaskTableBodyRow
                key={d.taskid}
                data={d}
                itemIndex={i}
                moveTask={moveTask}
                movingItem={{
                  current: current,
                  target: target
                }}
              />
            );
          })}
        </React.Fragment>
      )}
    </TableBody>
  );
});
export default TaskTableBody;
