import React, { useContext } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Typography
} from "@material-ui/core";
import { grey, blueGrey } from "@material-ui/core/colors";
import { AppContext } from "../../AppContext";

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
  root: {
    backgroundColor: grey[50],
    minHeight: window.innerHeight - 14
  },
  tablePaper: {
    margin: 8
  },
  index: { ..._getWidth(36) },
  item: { ..._getWidth("25%", 200) },
  amount: { ..._getWidth(36) },
  price: { ..._getWidth(120) },
  estimate: { ..._getWidth(120) },
  actual: { ..._getWidth(120) }
}));

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: blueGrey[700],
    color: theme.palette.common.white
  }
}))(TableCell);

export interface ManagementFeeProps {
  type?: string;
}

const costCustomizationData = [
  {
    label: "Mr.A",
    estimate: Math.floor(Math.random() * 10) * 10000 + 1000
  },
  {
    label: "Mr.B",
    estimate: Math.floor(Math.random() * 10) * 10000 + 1000
  },
  {
    label: "Mr.C",
    estimate: Math.floor(Math.random() * 10) * 10000 + 1000
  },
  {
    label: "Mr.D",
    estimate: Math.floor(Math.random() * 10) * 10000 + 1000
  },
  {
    label: "Mr.E",
    estimate: Math.floor(Math.random() * 10) * 10000 + 1000
  },
  {
    label: "Mr.F",
    estimate: Math.floor(Math.random() * 10) * 10000 + 1000
  },
  {
    label: "Mr.G",
    estimate: Math.floor(Math.random() * 10) * 10000 + 1000
  },
  {
    label: "Mr.H",
    estimate: Math.floor(Math.random() * 10) * 10000 + 1000
  },
  {
    label: "Mr.I",
    estimate: Math.floor(Math.random() * 10) * 10000 + 1000
  },
  {
    label: "Mr.J",
    estimate: Math.floor(Math.random() * 10) * 10000 + 1000
  }
];

function getTotal(array: any[]) {
  let total = 0;
  for (let i = 0; i < array.length; i++) {
    total += array[i].estimate;
  }
  return total;
}

function getTotalDis(array: any[]) {
  let total = 0;
  for (let i = 0; i < array.length; i++) {
    total += array[i].estimate - 1000;
  }
  return total;
}

const ManagementFee: React.FC<ManagementFeeProps> = ({ type }) => {
  const classes = useStyles();
  const { _thousandSeperater, _totalFromArray } = useContext(AppContext);
  return (
    <div>
      <Paper elevation={2} className={classes.tablePaper}>
        <TableContainer style={{ marginTop: 24 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell className={classes.index} align="right">
                  #
                </StyledTableCell>
                <StyledTableCell className={classes.item}>Item</StyledTableCell>
                <StyledTableCell className={classes.estimate} align="right">
                  Estimate
                </StyledTableCell>
                <StyledTableCell className={classes.actual} align="right">
                  Actual
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {costCustomizationData.map((d, i) => {
                return (
                  <TableRow key={i}>
                    <TableCell align="right">{i + 1}</TableCell>
                    <TableCell>{d.label}</TableCell>
                    <TableCell align="right">
                      {_thousandSeperater(d.estimate)}
                    </TableCell>
                    <TableCell align="right">
                      {_thousandSeperater(d.estimate - 1000)}
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell></TableCell>
                <TableCell style={{ fontWeight: 900 }}>Total</TableCell>
                <TableCell align="right" style={{ fontWeight: 900 }}>
                  {_thousandSeperater(getTotal(costCustomizationData))}
                </TableCell>
                <TableCell align="right" style={{ fontWeight: 900 }}>
                  {_thousandSeperater(getTotalDis(costCustomizationData))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};
export default ManagementFee;
