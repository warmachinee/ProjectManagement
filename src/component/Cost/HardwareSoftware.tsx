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

export interface HardwareSoftwareProps {
  type?: string;
}

const costSoftwareData = [
  {
    label: "Microsoft Window 10 Professtional",
    amount: Math.floor(Math.random() * 5 + 1),
    price: Math.floor(Math.random() * 10) * 10000 + 1000
  },
  {
    label: "Some Google Software License",
    amount: Math.floor(Math.random() * 5 + 1),
    price: Math.floor(Math.random() * 10) * 10000 + 1000
  },
  {
    label: "Antivirus",
    amount: Math.floor(Math.random() * 5 + 1),
    price: Math.floor(Math.random() * 10) * 10000 + 1000
  },
  {
    label: "Microsoft Visual Studio",
    amount: Math.floor(Math.random() * 5 + 1),
    price: Math.floor(Math.random() * 10) * 10000 + 1000
  },
  {
    label: "Adobe XD",
    amount: Math.floor(Math.random() * 5 + 1),
    price: Math.floor(Math.random() * 10) * 10000 + 1000
  },
  {
    label: "Adobe Illustrator",
    amount: Math.floor(Math.random() * 5 + 1),
    price: Math.floor(Math.random() * 10) * 10000 + 1000
  }
];

const costHardwareData = [
  {
    label: "Ram Corsair 32 GB",
    amount: Math.floor(Math.random() * 5 + 1),
    price: Math.floor(Math.random() * 10) * 10000 + 1000
  },
  {
    label: "Monitor Samsung 42 inch.",
    amount: Math.floor(Math.random() * 5 + 1),
    price: Math.floor(Math.random() * 10) * 10000 + 1000
  },
  {
    label: "CPU Intel Core i9",
    amount: Math.floor(Math.random() * 5 + 1),
    price: Math.floor(Math.random() * 10) * 10000 + 1000
  },
  {
    label: "Nvidia Tital 2080",
    amount: Math.floor(Math.random() * 5 + 1),
    price: Math.floor(Math.random() * 10) * 10000 + 1000
  },
  {
    label: "Mainboard",
    amount: Math.floor(Math.random() * 5 + 1),
    price: Math.floor(Math.random() * 10) * 10000 + 1000
  },
  {
    label: "Tower Case Large Size",
    amount: Math.floor(Math.random() * 5 + 1),
    price: Math.floor(Math.random() * 10) * 10000 + 1000
  }
];

function getTotal(array: any[]) {
  let total = 0;
  for (let i = 0; i < array.length; i++) {
    total += array[i].amount * array[i].price;
  }
  return total;
}

function getTotalDis(array: any[]) {
  let total = 0;
  for (let i = 0; i < array.length; i++) {
    total += array[i].amount * (array[i].price - 500);
  }
  return total;
}

const HardwareSoftware: React.FC<HardwareSoftwareProps> = ({ type }) => {
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
                <StyledTableCell className={classes.amount} align="center">
                  Amount
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
              </TableRow>
            </TableHead>
            <TableBody>
              {(type === "software" ? costSoftwareData : costHardwareData).map(
                (d, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell align="right">{i + 1}</TableCell>
                      <TableCell>{d.label}</TableCell>
                      <TableCell align="center">{d.amount}</TableCell>
                      <TableCell align="right">
                        {_thousandSeperater(d.price)}
                      </TableCell>
                      <TableCell align="right">
                        {_thousandSeperater(d.amount * d.price)}
                      </TableCell>
                      <TableCell align="right">
                        {_thousandSeperater(d.amount * (d.price - 1000))}
                      </TableCell>
                    </TableRow>
                  );
                }
              )}
              <TableRow>
                <TableCell></TableCell>
                <TableCell style={{ fontWeight: 900 }}>Total</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell align="right" style={{ fontWeight: 900 }}>
                  {_thousandSeperater(
                    getTotal(
                      type === "software" ? costSoftwareData : costHardwareData
                    )
                  )}
                </TableCell>
                <TableCell align="right" style={{ fontWeight: 900 }}>
                  {_thousandSeperater(
                    getTotalDis(
                      type === "software" ? costSoftwareData : costHardwareData
                    )
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};
export default HardwareSoftware;
