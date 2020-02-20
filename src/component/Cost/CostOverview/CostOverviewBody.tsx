import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TableBody, TableRow, TableCell, Button } from "@material-ui/core";
import { AppContext } from "../../../AppContext";
import AppType from "apptype";

const useStyles = makeStyles(theme => ({}));

export interface CostOverviewBodyProps {}

const CostOverviewBody: React.FC<CostOverviewBodyProps> = () => {
  const classes = useStyles();
  const { costOverview, _thousandSeperater, _totalFromArray } = useContext(
    AppContext
  );

  return (
    <TableBody>
      {costOverview && (
        <React.Fragment>
          {costOverview.detail.map((d: AppType.CostOverviewRow, i: number) => {
            return (
              <TableRow key={i}>
                <TableCell />
                <TableCell align="right">{i + 1}</TableCell>
                <TableCell>
                  <Button
                    style={{ textTransform: "capitalize" }}
                    color="primary"
                  >
                    {d.type === "managementfee" ? "Management Fee" : d.type}
                  </Button>
                </TableCell>
                <TableCell align="right">
                  {_thousandSeperater(d.sumest)}
                </TableCell>
                <TableCell align="right">
                  {_thousandSeperater(d.sumact)}
                </TableCell>
                <TableCell />
              </TableRow>
            );
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
