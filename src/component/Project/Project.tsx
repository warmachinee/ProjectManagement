import React, { useContext, useState, useEffect } from "react";
import Loadable from "react-loadable";
import { withRouter, RouteComponentProps, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "../../AppContext";
import {
  List as ListIcon,
  Timeline,
  MonetizationOn,
  BarChart
} from "@material-ui/icons";
import { ButtonGroup, Button } from "@material-ui/core";
import EstimateActual from "../Chart/Bar/EstimateActual";

const TaskTable = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'TaskTable' */ "../Table/Task/TaskTable"),
  loading: () => <div>Loading ...</div>
});

const Cost = Loadable({
  loader: () => import(/* webpackChunkName: 'Cost' */ "../Cost/Cost"),
  loading: () => <div>Loading ...</div>
});

const useStyles = makeStyles(theme => ({
  root: {
    padding: 16
  },
  toggleContainer: {
    margin: theme.spacing(2, 0)
  },
  textField: { marginBottom: 12 },
  tabMenu: {},
  tabMenuIcon: { fontSize: 36 }
}));

export type ProjectProps = RouteComponentProps<{
  projectid: string;
  userid: string;
}>;

const PageMenu: React.FC<{
  page: string | null;
  changePage: (p: string) => void;
}> = ({ page, changePage }) => {
  const classes = useStyles();
  return (
    <div style={{ overflow: "auto" }}>
      <ButtonGroup>
        <Button
          startIcon={<ListIcon className={classes.tabMenuIcon} />}
          variant={page === "task" ? "contained" : "outlined"}
          color={page === "task" ? "primary" : "default"}
          size="large"
          className={classes.tabMenu}
          onClick={() => changePage("task")}
        >
          Task
        </Button>
        <Button
          startIcon={<MonetizationOn className={classes.tabMenuIcon} />}
          variant={page === "cost" ? "contained" : "outlined"}
          color={page === "cost" ? "primary" : "default"}
          size="large"
          className={classes.tabMenu}
          onClick={() => changePage("cost")}
        >
          Cost
        </Button>
        <Button
          disabled
          startIcon={<Timeline className={classes.tabMenuIcon} />}
          variant={page === "timeline" ? "contained" : "outlined"}
          color={page === "timeline" ? "primary" : "default"}
          size="large"
          className={classes.tabMenu}
          onClick={() => changePage("timeline")}
        >
          Timeline
        </Button>
        <Button
          startIcon={<BarChart className={classes.tabMenuIcon} />}
          variant={page === "chart" ? "contained" : "outlined"}
          color={page === "chart" ? "primary" : "default"}
          size="large"
          className={classes.tabMenu}
          onClick={() => changePage("chart")}
        >
          Chart
        </Button>
      </ButtonGroup>
    </div>
  );
};

const DefaultComponent: React.FC = () => {
  const classes = useStyles();
  const { _onLocalhost } = useContext(AppContext);
  const [page, setPage] = React.useState<string | null>(
    _onLocalhost("chart", "task")
  );
  const [maxWidth, setMaxWidth] = React.useState<any | null>(1200);

  function changePage(p: string) {
    setPage(p);
  }

  function getComponent() {
    switch (page) {
      case "task":
        return <TaskTable />;
      case "cost":
        return <Cost {...{ setMaxWidth }} />;
      case "timeline":
        return <div>Timeline</div>;
      case "chart":
        return (
          <div>
            <EstimateActual />
          </div>
        );
      default:
        return null;
    }
  }

  let margin = page === "cost" ? "inherit" : "auto";

  useEffect(() => {
    switch (page) {
      case "task":
        setMaxWidth("none");
        break;
      case "cost":
        setMaxWidth(1200);
        break;
      case "timeline":
        setMaxWidth(1200);
        break;
      case "chart":
        setMaxWidth(1200);
        break;
      default:
        setMaxWidth(1200);
        break;
    }
  }, [page]);

  return (
    <div className={classes.root}>
      <div style={{ maxWidth, margin }}>
        <PageMenu {...{ page, changePage }} />
        {getComponent()}
      </div>
    </div>
  );
};

const Project: React.FC<ProjectProps> = props => {
  const classes = useStyles();
  const { match } = props;

  const passingProps: any = {
    ...useContext(AppContext),
    userid: parseInt(match.params.userid),
    projectid: parseInt(match.params.projectid)
  };

  return (
    <AppContext.Provider value={passingProps}>
      <Route exact path={`${match.path}`} component={DefaultComponent} />
    </AppContext.Provider>
  );
};
export default withRouter(props => <Project {...props} />);
