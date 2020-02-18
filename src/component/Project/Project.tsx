import React, { useContext, useState } from "react";
import Loadable from "react-loadable";
import { withRouter, RouteComponentProps, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "../../AppContext";
import { Typography, Box, AppBar, Tabs, Tab } from "@material-ui/core";
import {
  List as ListIcon,
  Timeline,
  MonetizationOn,
  BarChart
} from "@material-ui/icons";

const TaskTable = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'TaskTable' */ "../Table/Task/TaskTable"),
  loading: () => <div>Loading ...</div>
});

const CostOverview = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'CostOverview' */ "../Cost/CostOverview"),
  loading: () => <div>Loading ...</div>
});

const useStyles = makeStyles(theme => ({
  root: {
    padding: 16
  },
  textField: { marginBottom: 12 }
}));

export type ProjectProps = RouteComponentProps<{ projectid: string }>;

const Project: React.FC<ProjectProps> = props => {
  const classes = useStyles();
  const { match } = props;
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const passingProps: any = {
    ...useContext(AppContext),
    projectid: parseInt(match.params.projectid)
  };

  const DefaultComponent: React.FC = () => {
    return (
      <div className={classes.root}>
        <TaskTable />
      </div>
    );
  };

  return (
    <AppContext.Provider value={passingProps}>
      <Route exact path={`${match.path}`} component={DefaultComponent} />
    </AppContext.Provider>
  );
};
export default withRouter(props => <Project {...props} />);
