import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TableBody, TableRow, TableCell } from "@material-ui/core";
import { AppContext } from "../../../AppContext";
import AppType from "apptype";
import CostOverviewBodyRow from "./CostOverviewBodyRow";

const useStyles = makeStyles(theme => ({}));

export interface CostOverviewBodyProps {}

const CostOverviewBody: React.FC<CostOverviewBodyProps> = () => {
  const classes = useStyles();
  const {
    costOverview,
    _thousandSeperater,
    _totalFromArray,
    setCostType
  } = useContext(AppContext);
  return (
    <TableBody>
      {costOverview && (
        <React.Fragment>
          {costOverview.detail.map((d: AppType.CostOverviewRow, i: number) => {
            return <CostOverviewBodyRow key={i} data={d} index={i} />;
          })}
          <TableRow>
            <TableCell colSpan={2} />
            <TableCell style={{ fontWeight: 900 }}>Total</TableCell>
            <TableCell align="right" style={{ fontWeight: 900 }}>
              {_thousandSeperater(
                _totalFromArray(costOverview.detail, "sumest")
              )}
            </TableCell>
            <TableCell align="right" style={{ fontWeight: 900 }}>
              {_thousandSeperater(
                _totalFromArray(costOverview.detail, "sumact")
              )}
            </TableCell>
            <TableCell />
          </TableRow>
        </React.Fragment>
      )}
    </TableBody>
  );
};
export default CostOverviewBody;
