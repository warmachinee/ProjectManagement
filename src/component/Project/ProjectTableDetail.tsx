import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import * as AppType from "apptype";
import { Toolbar, Typography, Button, Chip, useTheme } from "@material-ui/core";
import { AppContext } from "../../AppContext";

const useStyles = makeStyles(theme => ({
  tableToolbar: {
    padding: theme.spacing(2, 1, 2, 2)
  },
  detail: { flexGrow: 1 },
  projectTitle: {
    flexGrow: 1
  },
  chipGrid: {
    marginTop: 16,
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5)
    }
  }
}));

export interface ProjectTableDetailProps {}

const ProjectTableDetail: React.FC<ProjectTableDetailProps> = () => {
  const classes = useStyles();
  const theme = useTheme();
  const {
    _dateToString,
    project,
    dialog,
    booleanDispatch,
    _thousandSeperater
  } = useContext(AppContext);
  const detail = project && project.projectdetail;

  function getLabelFromStatus(status: AppType.ProjectStatus) {
    switch (status) {
      case "inprogress":
        return "Inprogress";
      case "pending":
        return "Pending";
      case "pm":
        return "PM";
      case "complete":
        return "Complete";
      case "fail":
        return "Fail";
      default:
        return "None";
    }
  }

  function getLabelFromStage(stage: AppType.ProjectStage) {
    switch (stage) {
      case 1:
        return "Proposal";
      case 2:
        return "Contract";
      case 3:
        return "Implement";
      case 4:
        return "PM";
      default:
        return "None";
    }
  }

  return (
    <Toolbar className={classes.tableToolbar}>
      {detail && (
        <div className={classes.detail}>
          <div style={{ display: "flex" }}>
            <div className={classes.projectTitle}>
              <Typography variant="h5">
                {detail.projectname + `${detail.type === 1 ? " (MA)" : ""}`}
              </Typography>
              <Typography variant="body2">
                {_dateToString(detail.startdate)}
                {" - "}
                {_dateToString(detail.enddate)}
              </Typography>
            </div>
            <div>
              <Button
                color="primary"
                onClick={() =>
                  booleanDispatch({ type: "true", key: "editProject" })
                }
              >
                Edit
              </Button>
            </div>
          </div>
          <div className={classes.chipGrid}>
            <Chip
              label={`Status : ${getLabelFromStatus(detail.status)}`}
              color="primary"
              variant="outlined"
            />
            <Chip
              label={`Stage : ${getLabelFromStage(detail.stage_current)}`}
              color="primary"
              variant="outlined"
            />
            <Chip
              label={`Budget : ${_thousandSeperater(detail.projectcost)}`}
              color="primary"
              variant="outlined"
            />
          </div>
        </div>
      )}
    </Toolbar>
  );
};
export default ProjectTableDetail;
