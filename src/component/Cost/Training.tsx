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

export interface TrainingProps {}

const costTraining = [
  {
    label: "Data Analytics",
    amount: Math.floor(Math.random() * 10 + 1),
    manday: Math.floor(Math.random() * 30) * 100 + 500,
    day: Math.floor(Math.random() * 10 + 1)
  },
  {
    label: "Data Mining",
    amount: Math.floor(Math.random() * 10 + 1),
    manday: Math.floor(Math.random() * 30) * 100 + 500,
    day: Math.floor(Math.random() * 10 + 1)
  },
  {
    label: "Data Warehouse",
    amount: Math.floor(Math.random() * 10 + 1),
    manday: Math.floor(Math.random() * 30) * 100 + 500,
    day: Math.floor(Math.random() * 10 + 1)
  },
  {
    label: "Machine Learning",
    amount: Math.floor(Math.random() * 10 + 1),
    manday: Math.floor(Math.random() * 30) * 100 + 500,
    day: Math.floor(Math.random() * 10 + 1)
  },
  {
    label: "Big Data",
    amount: Math.floor(Math.random() * 10 + 1),
    manday: Math.floor(Math.random() * 30) * 100 + 500,
    day: Math.floor(Math.random() * 10 + 1)
  },
  {
    label: "ReactJs + Webpack",
    amount: Math.floor(Math.random() * 10 + 1),
    manday: Math.floor(Math.random() * 30) * 100 + 500,
    day: Math.floor(Math.random() * 10 + 1)
  },
  {
    label: "Typescript",
    amount: Math.floor(Math.random() * 10 + 1),
    manday: Math.floor(Math.random() * 30) * 100 + 500,
    day: Math.floor(Math.random() * 10 + 1)
  },
  {
    label: "UX/UI",
    amount: Math.floor(Math.random() * 10 + 1),
    manday: Math.floor(Math.random() * 30) * 100 + 500,
    day: Math.floor(Math.random() * 10 + 1)
  }
];

function getTotal(array: any[]) {
  let total = 0;
  for (let i = 0; i < array.length; i++) {
    total += array[i].amount * array[i].day * array[i].manday;
  }
  return total;
}

function getTotalDis(array: any[]) {
  let total = 0;
  for (let i = 0; i < array.length; i++) {
    total += array[i].amount * array[i].day * array[i].manday - 2000;
  }
  return total;
}

const Training: React.FC<TrainingProps> = () => {
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
                <StyledTableCell className={classes.price} align="center">
                  Man day
                </StyledTableCell>
                <StyledTableCell className={classes.price} align="center">
                  Amount
                </StyledTableCell>
                <StyledTableCell className={classes.price} align="center">
                  Day
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
              {costTraining.map((d, i) => {
                return (
                  <TableRow key={i}>
                    <TableCell align="right">{i + 1}</TableCell>
                    <TableCell>{d.label}</TableCell>
                    <TableCell align="center">{d.manday}</TableCell>
                    <TableCell align="center">{d.amount}</TableCell>
                    <TableCell align="center">{d.day}</TableCell>
                    <TableCell align="right">
                      {_thousandSeperater(d.day * d.amount * d.manday)}
                    </TableCell>
                    <TableCell align="right">
                      {_thousandSeperater(d.day * d.amount * d.manday - 2000)}
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell></TableCell>
                <TableCell style={{ fontWeight: 900 }}>Total</TableCell>
                <TableCell colSpan={3}></TableCell>
                <TableCell align="right" style={{ fontWeight: 900 }}>
                  {_thousandSeperater(getTotal(costTraining))}
                </TableCell>
                <TableCell align="right" style={{ fontWeight: 900 }}>
                  {_thousandSeperater(getTotalDis(costTraining))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};
export default Training;
