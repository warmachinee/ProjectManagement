import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { _getWidth } from "../../../api/Handler";
import { TableHead, TableRow, TableCell, withStyles } from "@material-ui/core";
import { blueGrey } from "@material-ui/core/colors";
import { AppContext } from "../../../AppContext";

const useStyles = makeStyles(theme => ({
  index: { ..._getWidth(36) },
  item: { minWidth: 300 },
  educational: { ..._getWidth(100) },
  experience: { ..._getWidth(36) },
  salary: { ..._getWidth(100) },
  amount: { ..._getWidth(36) },
  manmonth: { ..._getWidth(100) },
  estimate: { ..._getWidth(150) },
  actual: { ..._getWidth(150) }
}));

export interface CustomizationHeadProps {}

const CustomizationHead: React.FC<CustomizationHeadProps> = () => {
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
        <StyledTableCell className={classes.item}>Item</StyledTableCell>
        <StyledTableCell className={classes.educational} align="center">
          Educational
        </StyledTableCell>
        <StyledTableCell className={classes.experience} align="center">
          Experience
        </StyledTableCell>
        <StyledTableCell className={classes.salary} align="right">
          Salary
        </StyledTableCell>
        <StyledTableCell className={classes.amount} align="right">
          Amount
        </StyledTableCell>
        <StyledTableCell className={classes.manmonth} align="right">
          Man month
        </StyledTableCell>
        <StyledTableCell className={classes.estimate} align="right">
          Estimate
        </StyledTableCell>
        <StyledTableCell className={classes.actual} align="right">
          Actual
        </StyledTableCell>
        <StyledTableCell padding="checkbox"></StyledTableCell>
      </TableRow>
    </TableHead>
  );
};
export default CustomizationHead;
