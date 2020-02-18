import React from "react";
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

export interface FixedCostProps {}

const FixedCost: React.FC<FixedCostProps> = () => {
  const classes = useStyles();
  return (
    <div>
      <Paper elevation={2} className={classes.tablePaper}>
        <TableContainer>
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
              {[
                "Software",
                "Hardware",
                "Customization",
                "Training",
                "Entertain",
                "Travel",
                "Management fee"
              ].map((d, i) => {
                const amount = Math.floor(Math.random() * 5 + 1);
                const price = Math.floor(Math.random() * 10000 + 1000);
                return (
                  <TableRow key={i}>
                    <TableCell align="right">{i + 1}</TableCell>
                    <TableCell>{d}</TableCell>
                    <TableCell align="right">{amount * price}</TableCell>
                    <TableCell align="right">
                      <TextField
                        style={{ textAlign: "right" }}
                        value={amount * price - 1000}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Total</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <TableContainer style={{ marginTop: 24 }}>
          <Typography variant="h6" component="span">
            Cost [Hardware, Software]
          </Typography>
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
                <StyledTableCell className={classes.price}>
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
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((d, i) => {
                const amount = Math.floor(Math.random() * 5 + 1);
                const price = Math.floor(Math.random() * 10) * 10000 + 1000;
                return (
                  <TableRow key={i}>
                    <TableCell align="right">{i + 1}</TableCell>
                    <TableCell>Item {i + 1}</TableCell>
                    <TableCell align="center">{amount}</TableCell>
                    <TableCell>
                      <TextField
                        value={price
                          .toString()
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {(amount * price)
                        .toString()
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        style={{ textAlign: "right" }}
                        value={(amount * price - 1000)
                          .toString()
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Total</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer style={{ marginTop: 24 }}>
          <Typography variant="h6" component="span">
            Cost [Customization]
          </Typography>
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
                <StyledTableCell className={classes.price}>
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
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((d, i) => {
                const amount = Math.floor(Math.random() * 10 + 1);
                const salary = Math.floor(Math.random() * 35) * 1000 + 1000;
                const manmonth = Math.floor(Math.random() * 10 + 1);
                return (
                  <TableRow key={i}>
                    <TableCell align="right">{i + 1}</TableCell>
                    <TableCell>Item {i + 1}</TableCell>
                    <TableCell align="center">ป.ตรี</TableCell>
                    <TableCell>
                      {Math.floor(Math.random() * 5 + 1) + " ปี"}
                    </TableCell>
                    <TableCell align="right">
                      {salary
                        .toString()
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                    </TableCell>
                    <TableCell align="right">
                      {amount
                        .toString()
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        style={{ textAlign: "right" }}
                        value={manmonth}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {(salary * amount * manmonth)
                        .toString()
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        style={{ textAlign: "right" }}
                        value={(salary * amount * manmonth - 5000)
                          .toString()
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Total</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <TableContainer style={{ marginTop: 24 }}>
          <Typography variant="h6" component="span">
            Cost [Training]
          </Typography>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell className={classes.index} align="right">
                  #
                </StyledTableCell>
                <StyledTableCell className={classes.item}>Item</StyledTableCell>
                <StyledTableCell className={classes.amount} align="right">
                  Man day
                </StyledTableCell>
                <StyledTableCell className={classes.price} align="center">
                  Amount
                </StyledTableCell>
                <StyledTableCell className={classes.estimate} align="right">
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
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((d, i) => {
                const manday = Math.floor(Math.random() * 30) * 1000 + 1000;
                const amount = Math.floor(Math.random() * 10 + 1);
                const day = Math.floor(Math.random() * 31 + 1);
                return (
                  <TableRow key={i}>
                    <TableCell align="right">{i + 1}</TableCell>
                    <TableCell>Item {i + 1}</TableCell>
                    <TableCell align="right">{manday}</TableCell>
                    <TableCell align="center">{amount}</TableCell>
                    <TableCell align="right">{day}</TableCell>
                    <TableCell align="right">
                      {(manday * amount * day)
                        .toString()
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                    </TableCell>
                    <TableCell align="right">
                      {(manday * amount * day - 1000)
                        .toString()
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Total</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};
export default FixedCost;
