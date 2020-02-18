import React from "react";
import Loadable from "react-loadable";
import { makeStyles } from "@material-ui/core/styles";
import BudgetProjectChart from "../Chart/BudgetProjectChart";

const ProjectTable = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: 'ProjectTable' */ "../Table/Project/ProjectTable"
    ),
  loading: () => null
});

const useStyles = makeStyles(theme => ({}));

export interface UserProps {}

const User: React.FC<UserProps> = props => {
  const classes = useStyles();

  return (
    <div>
      <BudgetProjectChart />
      <ProjectTable />
    </div>
  );
};
export default User;
