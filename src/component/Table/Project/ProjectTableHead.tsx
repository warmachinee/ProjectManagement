import React, { useContext } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { TableHead, TableRow, TableCell } from "@material-ui/core";
import { blueGrey } from "@material-ui/core/colors";
import { AppContext } from "../../../AppContext";
import { _getWidth } from "../../../api/Handler";

const useStyles = makeStyles(theme => ({
  index: { ..._getWidth(36) },
  projectName: { ..._getWidth("40%", 200) },
  stage: { ..._getWidth(64) },
  start: { ..._getWidth(100) },
  end: { ..._getWidth(100) },
  projectCost: { ..._getWidth(120) },
  status: { ..._getWidth(48) }
}));

export interface ProjectTableHeadProps {}

const ProjectTableHead: React.FC<ProjectTableHeadProps> = () => {
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
        <StyledTableCell className={classes.projectName}>
          Project
        </StyledTableCell>
        <StyledTableCell className={classes.stage} align="center">
          Stage
        </StyledTableCell>
        <StyledTableCell className={classes.start} align="center">
          Start
        </StyledTableCell>
        <StyledTableCell className={classes.end} align="center">
          End
        </StyledTableCell>
        <StyledTableCell className={classes.projectCost} align="right">
          Budget
        </StyledTableCell>
        <StyledTableCell className={classes.status} align="center">
          Status
        </StyledTableCell>
        <StyledTableCell padding="checkbox"></StyledTableCell>
      </TableRow>
    </TableHead>
  );
};
export default ProjectTableHead;
