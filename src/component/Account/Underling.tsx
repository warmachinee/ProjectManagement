import React, { useContext } from "react";
import Loadable from "react-loadable";
import { makeStyles } from "@material-ui/core/styles";
import { withRouter, RouteComponentProps, Route } from "react-router-dom";
import { AppContext } from "../../AppContext";
import Charts from "../Chart/Charts";

const ProjectTable = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: 'ProjectTable' */ "../Table/Project/ProjectTable"
    ),
  loading: () => null
});

const Project = Loadable({
  loader: () => import(/* webpackChunkName: 'Project' */ "../Project/Project"),
  loading: () => null
});

const useStyles = makeStyles(theme => ({}));

export type UnderlingProps = RouteComponentProps<{ userid: string }>;

const DefaultComponent: React.FC<any> = () => {
  return (
    <div>
      <Charts />
      <ProjectTable />
    </div>
  );
};

const Underling: React.FC<UnderlingProps> = props => {
  const classes = useStyles();
  const { match } = props;
  const passingProps: any = {
    ...useContext(AppContext),
    userid: parseInt(match.params.userid)
  };

  return (
    <AppContext.Provider value={passingProps}>
      <Route exact path={`${match.path}`} component={DefaultComponent} />
      <Route exact path={`${match.path}/:projectid`} component={Project} />
    </AppContext.Provider>
  );
};
export default withRouter(props => <Underling {...props} />);
