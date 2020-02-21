import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { _getWidth } from "../../../api/Handler";
import { TableHead, TableRow, TableCell, withStyles } from "@material-ui/core";
import { blueGrey } from "@material-ui/core/colors";
import { AppContext } from "../../../AppContext";

const useStyles = makeStyles(theme => ({
  index: { ..._getWidth(36) },
  item: { minWidth: 300 },
  amount: { ..._getWidth(100) },
  unit: { ..._getWidth(100) },
  price: { ..._getWidth(120) },
  estimate: { ..._getWidth(150) },
  actual: { ..._getWidth(150) }
}));

export interface HardwareSoftwareHeadProps {}

const HardwareSoftwareHead: React.FC<HardwareSoftwareHeadProps> = () => {
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
        <StyledTableCell className={classes.amount} align="right">
          Amount
        </StyledTableCell>
        <StyledTableCell className={classes.unit} align="right">
          Unit
        </StyledTableCell>
        <StyledTableCell className={classes.price} align="right">
          Price
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
export default HardwareSoftwareHead;
