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
    _onLocalhostFn,
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

  function handleFetchTemp() {
    setProject({
      projectdetail: {
        projectname: "Energy Project",
        type: 1,
        stage_current: 1,
        startdate: "2020-02-28T07:13:15.000Z",
        enddate: null,
        contractbegin: null,
        projectcost: 20000000,
        profitcost: 0,
        summary: "This is summary",
        op: 1740000,
        op_percent: 8.7,
        mf: 0,
        mf_percent: 5,
        guarantee_percent: 5,
        guarantee_period: 90,
        potential: "HIGH",
        createdate: "2020-01-28T07:13:15.000Z",
        status: "inprogress"
      },
      tasklist: [
        {
          taskid: 36942471,
          sequence: 1,
          taskname: "Implement -1",
          ownerlist: null,
          startdate: "2020-01-11T17:00:00.000Z",
          enddate: "2020-03-16T17:00:00.000Z",
          attachmentfile: null,
          percent: -1,
          note: null,
          contact: null,
          status: "complete"
        },
        {
          sequence: 2,
          taskid: 369424723,
          taskname: "Implement 0",
          ownerlist: null,
          startdate: null,
          enddate: null,
          attachmentfile: null,
          percent: 0,
          note: null,
          contact: null,
          status: "inprogress"
        },
        {
          sequence: 3,
          taskid: 36942472,
          taskname: "Implement",
          ownerlist: null,
          startdate: null,
          enddate: null,
          attachmentfile: null,
          percent: 9,
          note: null,
          contact: null,
          status: "inprogress"
        },
        {
          sequence: 4,
          taskid: 48358047,
          taskname: "Contract",
          ownerlist: null,
          startdate: null,
          enddate: null,
          attachmentfile: null,
          percent: 19,
          note: null,
          contact: null,
          status: "inprogress"
        },
        {
          sequence: 5,
          taskid: 97245082,
          taskname: "Prososal",
          ownerlist: null,
          startdate: null,
          enddate: null,
          attachmentfile: null,
          percent: 29,
          note: null,
          contact: null,
          status: "inprogress"
        },
        {
          sequence: 6,
          taskid: 972450825,
          taskname: "Task 4",
          ownerlist: null,
          startdate: null,
          enddate: null,
          attachmentfile: null,
          percent: 39,
          note: null,
          contact: null,
          status: "inprogress"
        },
        {
          sequence: 7,
          taskid: 972450824,
          taskname: "Task 5",
          ownerlist: null,
          startdate: null,
          enddate: null,
          attachmentfile: null,
          percent: 49,
          note: null,
          contact: null,
          status: "inprogress"
        },
        {
          sequence: 8,
          taskid: 972850825,
          taskname: "Task 6",
          ownerlist: null,
          startdate: null,
          enddate: null,
          attachmentfile: null,
          percent: 59,
          note: null,
          contact: null,
          status: "inprogress"
        },
        {
          sequence: 9,
          taskid: 972410825,
          taskname: "Task 7",
          ownerlist: null,
          startdate: null,
          enddate: null,
          attachmentfile: null,
          percent: 69,
          note: null,
          contact: null,
          status: "inprogress"
        },
        {
          sequence: 10,
          taskid: 972459825,
          taskname: "Task 8",
          ownerlist: null,
          startdate: null,
          enddate: null,
          attachmentfile: null,
          percent: 79,
          note: null,
          contact: null,
          status: "inprogress"
        },
        {
          sequence: 11,
          taskid: 972450925,
          taskname: "Task 9",
          ownerlist: null,
          startdate: null,
          enddate: null,
          attachmentfile: null,
          percent: 89,
          note: null,
          contact: null,
          status: "inprogress"
        },
        {
          sequence: 12,
          taskid: 97245082572,
          taskname: "Task 10",
          ownerlist: null,
          startdate: null,
          enddate: null,
          attachmentfile: null,
          percent: 99,
          note: null,
          contact: null,
          status: "inprogress"
        },
        {
          sequence: 13,
          taskid: 97245082571,
          taskname: "Percent 100",
          ownerlist: null,
          startdate: null,
          enddate: null,
          attachmentfile: null,
          percent: 100,
          note: null,
          contact: null,
          status: "inprogress"
        },
        {
          sequence: 4,
          taskid: 97245082573,
          taskname: "Percent 1000",
          ownerlist: null,
          startdate: null,
          enddate: null,
          attachmentfile: null,
          percent: 1000,
          note: null,
          contact: null,
          status: "inprogress"
        }
      ]
    });
  }

  useEffect(() => {
    _onLocalhostFn(handleFetchTemp, handleLoadProjectDetail);
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
