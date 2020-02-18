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
  Typography,
  Button
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

export interface CostOverviewProps {}

const costOverviewData = [
  {
    label: "Software",
    amount: Math.floor(Math.random() * 5 + 1),
    estimate: Math.floor(Math.random() * 10) * 10000 + 3000
  },
  {
    label: "Hardware",
    amount: Math.floor(Math.random() * 5 + 1),
    estimate: Math.floor(Math.random() * 10) * 10000 + 3000
  },
  {
    label: "Customization",
    amount: Math.floor(Math.random() * 5 + 1),
    estimate: Math.floor(Math.random() * 10) * 10000 + 3000
  },
  {
    label: "Training",
    amount: Math.floor(Math.random() * 5 + 1),
    estimate: Math.floor(Math.random() * 10) * 10000 + 3000
  },
  {
    label: "Entertain",
    amount: Math.floor(Math.random() * 5 + 1),
    estimate: Math.floor(Math.random() * 10) * 10000 + 3000
  },
  {
    label: "Travel",
    amount: Math.floor(Math.random() * 5 + 1),
    estimate: Math.floor(Math.random() * 10) * 10000 + 3000
  },
  {
    label: "Management fee",
    amount: Math.floor(Math.random() * 5 + 1),
    estimate: Math.floor(Math.random() * 10) * 10000 + 3000
  }
];

const CostOverview: React.FC<CostOverviewProps> = () => {
  const classes = useStyles();
  const { _thousandSeperater, _totalFromArray, setCostType } = useContext(
    AppContext
  );
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
              {costOverviewData.map((d, i) => {
                return (
                  <TableRow key={i}>
                    <TableCell align="right">{i + 1}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => setCostType(d.label.toLowerCase())}
                        style={{ textTransform: "none" }}
                        color="primary"
                      >
                        {d.label}
                      </Button>
                    </TableCell>
                    <TableCell align="right">
                      {_thousandSeperater(d.estimate)}
                    </TableCell>
                    <TableCell align="right">
                      {/* <TextField
                        style={{ textAlign: "right" }}
                        value={amount * price - 1000}
                      /> */}
                      {_thousandSeperater(d.estimate - 1000)}
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell></TableCell>
                <TableCell style={{ fontWeight: 900 }}>Total</TableCell>
                <TableCell align="right" style={{ fontWeight: 900 }}>
                  {_thousandSeperater(
                    _totalFromArray(costOverviewData, "estimate")
                  )}
                </TableCell>
                <TableCell align="right" style={{ fontWeight: 900 }}>
                  {_thousandSeperater(
                    _totalFromArray(costOverviewData, "estimate") -
                      costOverviewData.length * 1000
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
export default CostOverview;
