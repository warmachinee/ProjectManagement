import React, { useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { TableHead, TableRow, TableCell } from "@material-ui/core";
import { blueGrey } from "@material-ui/core/colors";

function _getWidth(
  width: number | string,
  minWidth: number | string | null = null
) {
  if (minWidth) {
    return { width: width, minWidth: minWidth };
  }
  return { width: width, minWidth: width };
}

const useStyles = makeStyles(theme => ({
  index: { ..._getWidth(36) },
  task: { ..._getWidth("25%", 200) },
  owner: { ..._getWidth(100) },
  priority: { ..._getWidth(64) },
  start: { ..._getWidth(100) },
  end: { ..._getWidth(100) },
  est: { ..._getWidth(36) },
  percent: { ..._getWidth(120) },
  done: { ..._getWidth(48) },
  contactPerson: { ..._getWidth(100) },
  note: { ..._getWidth("15%", 200) }
}));

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: blueGrey[700],
    color: theme.palette.common.white
  }
}))(TableCell);

export interface THeadProps {}

const THead: React.FC<THeadProps> = () => {
  const classes = useStyles();

  return (
    <TableHead>
      <TableRow>
        <StyledTableCell className={classes.index} align="right">
          #
        </StyledTableCell>
        <StyledTableCell className={classes.task}>Task</StyledTableCell>
        <StyledTableCell className={classes.owner}>Owner</StyledTableCell>
        <StyledTableCell className={classes.priority} align="center">
          Priority
        </StyledTableCell>
        <StyledTableCell className={classes.start}>Start</StyledTableCell>
        <StyledTableCell className={classes.end}>End</StyledTableCell>
        <StyledTableCell className={classes.est} align="right">
          Date
        </StyledTableCell>
        <StyledTableCell className={classes.percent} align="center">
          % Complete
        </StyledTableCell>
        <StyledTableCell className={classes.done} align="center">
          Done
        </StyledTableCell>
        <StyledTableCell className={classes.contactPerson}>
          Contact Person
        </StyledTableCell>
        <StyledTableCell className={classes.note}>Note</StyledTableCell>
      </TableRow>
    </TableHead>
  );
};
export default THead;
