import React from "react";
import Loadable from "react-loadable";
import { makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";

const TContainer = Loadable({
  loader: () => import(/* webpackChunkName: 'TContainer' */ "./TContainer"),
  loading: () => null
});

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: grey[50],
    minHeight: window.innerHeight - 14
  },
  tablePaper: {
    margin: 8
  }
}));

export interface TTableProps {}

const TTable: React.FC<TTableProps> = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper elevation={2} className={classes.tablePaper}>
        <TContainer />
      </Paper>
    </div>
  );
};
export default TTable;
