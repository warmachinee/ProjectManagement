import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { _getWidth } from "../../../api/Handler";
import { TableHead, TableRow, TableCell, withStyles } from "@material-ui/core";
import { blueGrey } from "@material-ui/core/colors";
import { AppContext } from "../../../AppContext";

const useStyles = makeStyles(theme => ({
  index: { ..._getWidth(36) },
  item: { minWidth: 300 },
  date: { ..._getWidth(120) },
  value: { ..._getWidth(150) }
}));

export interface EntertainTravelHeadProps {}

const EntertainTravelHead: React.FC<EntertainTravelHeadProps> = () => {
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
        <StyledTableCell className={classes.date} align="center">
          Date
        </StyledTableCell>
        <StyledTableCell className={classes.value} align="right">
          Value
        </StyledTableCell>
        <StyledTableCell padding="checkbox"></StyledTableCell>
      </TableRow>
    </TableHead>
  );
};
export default EntertainTravelHead;
