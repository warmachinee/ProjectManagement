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

export interface CustomizationProps {}

const costCustomization = [
  {
    label: "Big Data",
    educational: "ป.โท",
    experience: Math.floor(Math.random() * 10 + 1),
    amount: Math.floor(Math.random() * 10 + 1),
    salary: Math.floor(Math.random() * 35) * 1000 + 1000,
    manmonth: Math.floor(Math.random() * 10 + 1)
  },
  {
    label: "UX/UI",
    educational: "ป.ตรี",
    experience: Math.floor(Math.random() * 10 + 1),
    amount: Math.floor(Math.random() * 10 + 1),
    salary: Math.floor(Math.random() * 35) * 1000 + 1000,
    manmonth: Math.floor(Math.random() * 10 + 1)
  },
  {
    label: "Data Science",
    educational: "ป.เอก",
    experience: Math.floor(Math.random() * 10 + 1),
    amount: Math.floor(Math.random() * 10 + 1),
    salary: Math.floor(Math.random() * 35) * 1000 + 1000,
    manmonth: Math.floor(Math.random() * 10 + 1)
  },
  {
    label: "Machine Learning",
    educational: "ป.ตรี",
    experience: Math.floor(Math.random() * 10 + 1),
    amount: Math.floor(Math.random() * 10 + 1),
    salary: Math.floor(Math.random() * 35) * 1000 + 1000,
    manmonth: Math.floor(Math.random() * 10 + 1)
  },
  {
    label: "Data Visualization",
    educational: "ป.ตรี",
    experience: Math.floor(Math.random() * 10 + 1),
    amount: Math.floor(Math.random() * 10 + 1),
    salary: Math.floor(Math.random() * 35) * 1000 + 1000,
    manmonth: Math.floor(Math.random() * 10 + 1)
  },
  {
    label: "ReactJs + Webpack",
    educational: "ป.ตรี",
    experience: Math.floor(Math.random() * 10 + 1),
    amount: Math.floor(Math.random() * 10 + 1),
    salary: Math.floor(Math.random() * 35) * 1000 + 1000,
    manmonth: Math.floor(Math.random() * 10 + 1)
  },
  {
    label: "Typescript",
    educational: "ป.ตรี",
    experience: Math.floor(Math.random() * 10 + 1),
    amount: Math.floor(Math.random() * 10 + 1),
    salary: Math.floor(Math.random() * 35) * 1000 + 1000,
    manmonth: Math.floor(Math.random() * 10 + 1)
  }
];

function getTotal(array: any[]) {
  let total = 0;
  for (let i = 0; i < array.length; i++) {
    total += array[i].amount * array[i].salary * array[i].manmonth;
  }
  return total;
}

function getTotalDis(array: any[]) {
  let total = 0;
  for (let i = 0; i < array.length; i++) {
    total += array[i].amount * array[i].salary * array[i].manmonth - 2000;
  }
  return total;
}

const Customization: React.FC<CustomizationProps> = () => {
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
                  Educational
                </StyledTableCell>
                <StyledTableCell className={classes.price} align="right">
                  Experience
                </StyledTableCell>
                <StyledTableCell className={classes.estimate} align="right">
                  Salary
                </StyledTableCell>
                <StyledTableCell className={classes.estimate} align="right">
                  Amount
                </StyledTableCell>
                <StyledTableCell className={classes.actual} align="right">
                  Man month
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
              {costCustomization.map((d, i) => {
                return (
                  <TableRow key={i}>
                    <TableCell align="right">{i + 1}</TableCell>
                    <TableCell>{d.label}</TableCell>
                    <TableCell align="center">{d.educational}</TableCell>
                    <TableCell align="right">{`${d.experience} ปี`}</TableCell>
                    <TableCell align="right">
                      {_thousandSeperater(d.salary)}
                    </TableCell>
                    <TableCell align="right">{d.amount}</TableCell>
                    <TableCell align="right">{d.manmonth}</TableCell>
                    <TableCell align="right">
                      {_thousandSeperater(d.salary * d.amount * d.manmonth)}
                    </TableCell>
                    <TableCell align="right">
                      {_thousandSeperater(
                        d.salary * d.amount * d.manmonth - 2000
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell></TableCell>
                <TableCell style={{ fontWeight: 900 }}>Total</TableCell>
                <TableCell colSpan={5}></TableCell>
                <TableCell align="right" style={{ fontWeight: 900 }}>
                  {_thousandSeperater(getTotal(costCustomization))}
                </TableCell>
                <TableCell align="right" style={{ fontWeight: 900 }}>
                  {_thousandSeperater(getTotalDis(costCustomization))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};
export default Customization;
