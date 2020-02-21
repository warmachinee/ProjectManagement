import React, { useContext } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { TableHead, TableRow, TableCell } from "@material-ui/core";
import { blueGrey } from "@material-ui/core/colors";
import { AppContext } from "../../../AppContext";
import { _getWidth } from "../../../api/Handler";

const useStyles = makeStyles(theme => ({
  index: { ..._getWidth(36) },
  fullname: { ..._getWidth("40%", 200) },
  projectCost: { ..._getWidth(120) }
}));

export interface UnderlingHeadProps {}

const UnderlingHead: React.FC<UnderlingHeadProps> = () => {
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
        <StyledTableCell className={classes.index} align="right">
          #
        </StyledTableCell>
        <StyledTableCell className={classes.fullname}>
          First name
        </StyledTableCell>
        <StyledTableCell className={classes.fullname}>
          Last name
        </StyledTableCell>
        <StyledTableCell className={classes.projectCost} align="right">
          Budget
        </StyledTableCell>
      </TableRow>
    </TableHead>
  );
};
export default UnderlingHead;
