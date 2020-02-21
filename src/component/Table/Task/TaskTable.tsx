import React, { useEffect, useContext, useState, useReducer } from "react";
import Loadable from "react-loadable";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, TableContainer, Table, Typography } from "@material-ui/core";
import * as AppType from "apptype";
import { AppContext } from "../../../AppContext";
import TaskTableBody from "./TaskTableBody";
import TaskTableHead from "./TaskTableHead";
import ProjectTableDetail from "../../Project/ProjectTableDetail";

const TaskNote = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'TaskNote' */ "./ChildComponent/TaskNote"),
  loading: () => null
});

const ProjectDetail = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: 'ProjectDetail' */ "../../Project/ProjectDetail"
    ),
  loading: () => null
});

const GeneralDialog = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: 'GeneralDialog' */ "../../Dialog/GeneralDialog"
    ),
  loading: () => null
});

const ConfirmDialog = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: 'ConfirmDialog' */ "../../Dialog/ConfirmDialog"
    ),
  loading: () => null
});

const useStyles = makeStyles(theme => ({
  table: {
    // maxHeight: window.innerHeight * 0.9
  },
  tableToolbar: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    flexDirection: "column"
  },
  formControl: { margin: theme.spacing(1, 0) },
  radioGroup: { flexDirection: "row" },
  textField: { marginBottom: 12 },
  createProjectButton: {
    width: "100%",
    margin: theme.spacing(2, 0, 1, 0)
  }
}));

export interface TaskTableProps {}

const TaskTable: React.FC<TaskTableProps> = () => {
  const classes = useStyles();
  const {
    apiUrl,
    fetchPost,

    projectid,
    useConfirmDeleteItem,
    booleanReducer,
    userid,
    sess
  } = useContext(AppContext);
  const [{ editProject, note }, booleanDispatch] = useReducer<
    React.Reducer<AppType.BooleanReducerState, AppType.BooleanReducerActions>
  >(booleanReducer, {
    editProject: false,
    note: false
  });
  const [project, setProject] = useState<AppType.ProjectDetail | null>(null);
  const [
    { confirmState, item: taskOnDelete },
    onDeleteTask
  ] = useConfirmDeleteItem();
  const [
    dataOnClickAction,
    setDataOnClickAction
  ] = useState<AppType.ProjectTask | null>(null);
  const passingProps: any = {
    ...useContext(AppContext),
    project,
    setProject,
    handleMoveTask,
    handleLoadProjectDetail,
    onDeleteTask,
    booleanDispatch,
    onClickAction
  };

  function onClickAction(type: "note", data: AppType.ProjectTask) {
    setDataOnClickAction(data);
    booleanDispatch({ type: "true", key: type });
  }

  async function handleMoveTask(
    current: AppType.ProjectTask,
    target: AppType.ProjectTask
  ) {
    const response = await fetchPost({
      url: apiUrl("tasksystem"),
      body: {
        action: "move",
        projectid,
        selectseq: current.sequence,
        movetoseq: target.sequence
      }
    });
    await handleLoadProjectDetail();
  }

  async function handleDeleteTask() {
    if (taskOnDelete) {
      const response = await fetchPost({
        url: apiUrl("tasksystem"),
        body: { action: "delete", projectid, taskid: taskOnDelete.taskid }
      });
      if (response.status === "success") {
        onDeleteTask({ action: "cancel" });
      }
      await handleLoadProjectDetail();
    }
  }

  async function handleLoadProjectDetail() {
    const response: any | AppType.ProjectDetail = await fetchPost({
      url: apiUrl("loadproject"),
      body: {
        action: "detail",
        projectid,
        ...(sess.type === "manager" && userid && { userid })
      }
    });
    setProject(response);
  }

  useEffect(() => {
    handleLoadProjectDetail();
  }, []);

  return (
    <AppContext.Provider value={passingProps}>
      <React.Fragment>
        {project && (
          <Paper elevation={2} style={{ paddingTop: 16 }}>
            <ProjectTableDetail />
            <TableContainer className={classes.table}>
              <Table stickyHeader>
                <TaskTableHead />
                <TaskTableBody />
              </Table>
            </TableContainer>
          </Paper>
        )}

        <GeneralDialog
          open={editProject}
          onClose={() => booleanDispatch({ type: "false", key: "editProject" })}
          title="Edit Project"
          maxWidth="sm"
        >
          <ProjectDetail />
        </GeneralDialog>
        <GeneralDialog
          open={note}
          onClose={() => booleanDispatch({ type: "false", key: "note" })}
          title="Task note"
        >
          <TaskNote
            {...{ handleLoadProjectDetail, dataOnClickAction, booleanDispatch }}
          />
        </GeneralDialog>
        <ConfirmDialog
          type="delete"
          open={confirmState}
          onClose={() => onDeleteTask({ action: "cancel" })}
          onCancel={() => onDeleteTask({ action: "cancel" })}
          onSubmit={handleDeleteTask}
          title="Are you sure you want to delete ?"
        >
          <Typography variant="h6" style={{ fontWeight: 400 }} align="center">
            {taskOnDelete && taskOnDelete.taskname}
          </Typography>
        </ConfirmDialog>
      </React.Fragment>
    </AppContext.Provider>
  );
};
export default TaskTable;
