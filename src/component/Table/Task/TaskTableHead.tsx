import React, { useContext } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { AppContext } from "../../../AppContext";
import { blueGrey } from "@material-ui/core/colors";
import { TableCell, TableHead, TableRow } from "@material-ui/core";
import { _getWidth } from "../../../api/Handler";

const useStyles = makeStyles(theme => ({
  index: { ..._getWidth(36) },
  task: { ..._getWidth("25%", 300) },
  duration: { ..._getWidth(300) },
  date: { ..._getWidth(100) },
  percent: { ..._getWidth(120) },
  owner: { ..._getWidth(150) },
  contactPerson: { ..._getWidth(150) }
}));

export interface TaskTableHeadProps {}

const TaskTableHead: React.FC<TaskTableHeadProps> = () => {
  const classes = useStyles();
  const { isDarkMode } = useContext(AppContext);

  const StyledTableCell = withStyles(theme => ({
    ...(!isDarkMode && {
      head: {
        backgroundColor: blueGrey[700],
        color: theme.palette.common.white
      }
    })
  }))(TableCell);

  return (
    <TableHead>
      <TableRow>
        <StyledTableCell padding="checkbox"></StyledTableCell>
        <StyledTableCell className={classes.index} align="right">
          #
        </StyledTableCell>
        <StyledTableCell className={classes.task}>Task</StyledTableCell>
        <StyledTableCell className={classes.duration} colSpan={2}>
          Duration
        </StyledTableCell>
        <StyledTableCell className={classes.date} align="center">
          Date
        </StyledTableCell>
        <StyledTableCell className={classes.percent} align="center">
          % Complete
        </StyledTableCell>
        <StyledTableCell className={classes.owner}>Owner</StyledTableCell>
        <StyledTableCell className={classes.contactPerson}>
          Contact Person
        </StyledTableCell>
        <StyledTableCell padding="checkbox"></StyledTableCell>
      </TableRow>
    </TableHead>
  );
};
export default TaskTableHead;
