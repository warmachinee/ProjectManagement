import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import BudgetProject from "./Pie/BudgetProject";

const useStyles = makeStyles(theme => ({}));

export interface ChartsProps {}

const Charts: React.FC<ChartsProps> = () => {
  const classes = useStyles();

  return (
    <div>
      <BudgetProject />
    </div>
  );
};
export default Charts;
