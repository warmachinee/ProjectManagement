import React, { useContext, useState, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TableBody, TableRow, TableCell } from "@material-ui/core";
import update from "immutability-helper";
import { AppContext } from "../../../AppContext";
import HardwareSoftwareBodyRow from "./HardwareSoftwareBodyRow";

const useStyles = makeStyles(theme => ({}));

export interface HardwareSoftwareBodyProps {}

const HardwareSoftwareBody: React.FC<HardwareSoftwareBodyProps> = () => {
  const classes = useStyles();
  const {
    _thousandSeperater,
    _totalFromArray,
    costData,
    setCostData
  } = useContext(AppContext);
  const [current, setCurrent] = useState<any | null>(null);
  const [target, setTarget] = useState<any | null>(null);
  const moveTask = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const current = costData[dragIndex];
      const hover = costData[hoverIndex];
      setCurrent(current);
      setTarget(hover);
      const updateCostList = update(costData, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, current]
        ]
      });
      setCostData(updateCostList);
    },
    [costData, target]
  );

  return (
    <TableBody>
      {costData && (
        <React.Fragment>
          {costData.map((d: any, i: number) => (
            <HardwareSoftwareBodyRow
              key={d.costid}
              index={i}
              data={d}
              itemIndex={i}
              moveTask={moveTask}
              movingItem={{
                current: current,
                target: target
              }}
            />
          ))}
          <TableRow>
            <TableCell colSpan={2} />
            <TableCell style={{ fontWeight: 900 }} colSpan={3}>
              Total
            </TableCell>
            <TableCell align="right" style={{ fontWeight: 900 }}>
              {_thousandSeperater(_totalFromArray(costData, "estimate_value"))}
            </TableCell>
            <TableCell align="right" style={{ fontWeight: 900 }}>
              {_thousandSeperater(_totalFromArray(costData, "actual_value"))}
            </TableCell>
            <TableCell />
          </TableRow>
        </React.Fragment>
      )}
    </TableBody>
  );
};
export default HardwareSoftwareBody;
