import React, { useEffect, useContext, useState, useReducer } from "react";
import Loadable from "react-loadable";
import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  TableContainer,
  Table,
  Button,
  Typography,
  Toolbar,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  TextField
} from "@material-ui/core";
import * as AppType from "apptype";
import { AppContext } from "../../../AppContext";

const ProjectTableHead = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'ProjectTableHead' */ "./ProjectTableHead"),
  loading: () => null
});

const ProjectTableBody = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'ProjectTableBody' */ "./ProjectTableBody"),
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
  tablePaper: {
    margin: "0 auto",
    maxWidth: 1200
  },
  table: {
    maxHeight: window.innerHeight * 0.9
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

export interface ProjectTableProps {}

const FormCreateProject: React.FC<{ [keys: string]: any }> = props => {
  const classes = useStyles();
  const {
    projectType,
    setProjectType,
    createProject,
    formOnChange,
    handleCreateProject,
    projectName,
    _onEnter
  } = props;
  return (
    <React.Fragment>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Project Type</FormLabel>
        <RadioGroup
          className={classes.radioGroup}
          value={projectType}
          onChange={e => setProjectType(e.target.value)}
        >
          <FormControlLabel
            value="1"
            control={<Radio color="primary" />}
            label="Normal"
          />
          <FormControlLabel
            value="2"
            control={<Radio color="primary" />}
            label="Maintenance Assistant"
          />
        </RadioGroup>
      </FormControl>
      <TextField
        autoFocus={createProject}
        fullWidth
        variant="outlined"
        placeholder="Project name"
        name="projectName"
        onChange={formOnChange}
        onKeyPress={_onEnter(handleCreateProject)}
      />
      <Button
        disabled={projectName === ""}
        variant="contained"
        color="primary"
        className={classes.createProjectButton}
        onClick={handleCreateProject}
      >
        Create
      </Button>
    </React.Fragment>
  );
};

const ProjectTable: React.FC<ProjectTableProps> = () => {
  const classes = useStyles();
  const {
    apiUrl,
    fetchPost,
    booleanReducer,
    useForm,
    _onEnter,
    _onLocalhostFn
  } = useContext(AppContext);
  const [{ createProject, confirmDelete }, booleanDispatch] = useReducer<
    React.Reducer<AppType.BooleanReducerState, AppType.BooleanReducerActions>
  >(booleanReducer, {
    createProject: false,
    confirmDelete: false
  });
  const [projectList, setProjectList] = useState<AppType.ProjectTable | null>(
    null
  );
  const [projectType, setProjectType] = useState("1");
  const [{ projectName }, formOnChange] = useForm({
    projectName: ""
  });
  const [
    onDeleteProjectData,
    setOnDeleteProjectData
  ] = useState<AppType.ProjectTableRow | null>(null);
  const passingProps: any = {
    ...useContext(AppContext),
    projectList,
    setProjectList,
    booleanDispatch,
    onDeleteProject,
    handleLoadProject,
    handleMoveProject
  };

  function onDeleteProject(projectData: AppType.ProjectTableRow) {
    setOnDeleteProjectData(projectData);
    booleanDispatch({ type: "true", key: "confirmDelete" });
  }

  function onCancelDeleteProject() {
    setOnDeleteProjectData(null);
    booleanDispatch({ type: "false", key: "confirmDelete" });
  }

  async function handleCreateProject() {
    const response = await fetchPost({
      url: apiUrl("projectsystem"),
      body: {
        action: "create",
        type: parseInt(projectType),
        projectname: projectName
      }
    });
    if (response.status === "success") {
      booleanDispatch({ type: "false", key: "createProject" });
    }
    await handleLoadProject();
  }

  async function handleMoveProject(
    current: AppType.ProjectTableRow,
    target: AppType.ProjectTableRow
  ) {
    const response = await fetchPost({
      url: apiUrl("projectsystem"),
      body: {
        action: "move",
        selectseq: current.sequence,
        movetoseq: target.sequence
      }
    });
    await handleLoadProject();
  }

  async function handleDeleteProject() {
    if (onDeleteProjectData) {
      const response = await fetchPost({
        url: apiUrl("projectsystem"),
        body: {
          action: "delete",
          projectid: onDeleteProjectData.projectid
        }
      });
      if (response.status === "success") {
        onCancelDeleteProject();
      }
      await handleLoadProject();
    }
  }

  async function handleLoadProject() {
    const response: AppType.ProjectTable = await fetchPost({
      url: apiUrl("loadproject"),
      body: { action: "list" }
    });
    setProjectList(response);
  }

  function handleFetchTemp() {
    setProjectList({
      list: [
        {
          projectid: 7558969,
          sequence: 2,
          projectname: "IT Project",
          stage_current: 1,
          startdate: null,
          enddate: null,
          projectcost: 0,
          status: "inprogress"
        },
        {
          projectid: 6622391,
          sequence: 3,
          projectname: "Task Management",
          stage_current: 1,
          startdate: null,
          enddate: null,
          projectcost: 0,
          status: "inprogress"
        },
        {
          projectid: 9422312,
          sequence: 3,
          projectname: "Energy Project",
          stage_current: 1,
          startdate: "2020-01-11T17:00:00.000Z",
          enddate: "2020-03-04T17:00:00.000Z",
          projectcost: 20000000,
          status: "inprogress"
        },
        {
          projectid: 6847487,
          sequence: 4,
          projectname: "Smart farm",
          stage_current: 1,
          startdate: null,
          enddate: null,
          projectcost: 0,
          status: "inprogress"
        }
      ],
      totalcost: 20000000
    });
  }

  useEffect(() => {
    _onLocalhostFn(handleFetchTemp, handleLoadProject);
  }, []);

  const TableController: React.FC = () => {
    return (
      <Toolbar className={classes.tableToolbar}>
        <Typography variant="h5" style={{ paddingTop: 16 }}>
          Project
        </Typography>
        <div style={{ display: "flex", width: "100%", padding: "8px 0" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              booleanDispatch({ type: "true", key: "createProject" })
            }
          >
            Add Project
          </Button>
        </div>
      </Toolbar>
    );
  };

  return (
    <AppContext.Provider value={passingProps}>
      <div style={{ padding: 8 }}>
        <Paper elevation={2} className={classes.tablePaper}>
          <TableController />
          <TableContainer className={classes.table}>
            <Table stickyHeader>
              <ProjectTableHead />
              <ProjectTableBody />
            </Table>
          </TableContainer>
        </Paper>
        <GeneralDialog
          open={createProject}
          onClose={() =>
            booleanDispatch({ type: "false", key: "createProject" })
          }
          title="Create Project"
        >
          <FormCreateProject
            {...{
              projectType,
              setProjectType,
              createProject,
              formOnChange,
              handleCreateProject,
              projectName,
              _onEnter
            }}
          />
        </GeneralDialog>
        <ConfirmDialog
          type="delete"
          open={confirmDelete}
          onClose={onCancelDeleteProject}
          onCancel={onCancelDeleteProject}
          onSubmit={handleDeleteProject}
          title="Are you sure you want to delete ?"
        >
          <Typography variant="h6" style={{ fontWeight: 400 }} align="center">
            {onDeleteProjectData && onDeleteProjectData.projectname}
          </Typography>
        </ConfirmDialog>
      </div>
    </AppContext.Provider>
  );
};
export default ProjectTable;
