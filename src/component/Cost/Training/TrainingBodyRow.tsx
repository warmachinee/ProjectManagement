import React, { useContext, useState, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  TableRow,
  TableCell,
  IconButton,
  Tooltip,
  useTheme
} from "@material-ui/core";
import { Save as SaveIcon, Delete, DragIndicator } from "@material-ui/icons";
import { useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import CellText from "../ColumnAndRow/CellText";
import CellNumberWithEstimate from "../ColumnAndRow/CellNumberWithEstimate";
import { AppContext } from "../../../AppContext";
import CellNumber from "../ColumnAndRow/CellNumber";
import ItemTypes from "../../Table/ItemTypes";
import { grey } from "@material-ui/core/colors";

const useStyles = makeStyles(theme => ({ tooltip: { fontSize: 14 } }));

export interface TrainingBodyRowProps {}

interface DragItem {
  index: number;
  type: string;
}

const TrainingBodyRow: React.FC<TrainingBodyRowProps | any> = ({
  itemIndex,
  data,
  moveTask,
  movingItem
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const {
    apiUrl,
    fetchPost,
    projectid,
    costType,
    handleLoadCost,
    _thousandSeperater,
    _checkIsNaN,
    _isObjectEmpty,
    onDeleteCost,
    handleMoveCost
  } = useContext(AppContext);
  const [isHover, setIsHover] = useState<boolean>(false);
  const [estimate, setEstimate] = useState<any>(data.estimate_value);
  const [values, setValues] = React.useState<any>({
    content: data.content,
    amount: data.amount,
    day: data.day,
    manday: data.manday,
    actual_value: data.actual_value
  });
  const propsToCell: any = {
    raw: data,
    costid: data.costid,
    values,
    setValues,
    estimate,
    setEstimate,
    onEdit,
    estimateSumWithKey
  };
  const [{ isOver, isOverCurrent }, drop] = useDrop({
    accept: ItemTypes.ROW,
    hover(item: DragItem, monitor: DropTargetMonitor) {
      const hoverIndex = itemIndex;
      const dragIndex = item.index;
      if (!drag) {
        return;
      }
      if (dragIndex === hoverIndex) {
        return;
      }
      moveTask(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true })
    })
  });
  const [, drag] = useDrag({
    item: { type: ItemTypes.ROW, index: itemIndex }
  });

  const onDragEnd = useCallback(() => {
    handleMoveCost(movingItem.current, movingItem.target);
  }, [movingItem]);

  let backgroundColor = theme.palette.background.paper;
  if (isOverCurrent || isOver) {
    backgroundColor = theme.palette.action.hover;
  }

  function detectChange() {
    let sendObj = {};
    for (let i in values) {
      const val = i === "content" ? values[i] : _checkIsNaN(values[i], 0);
      if (val !== data[i]) {
        Object.assign(sendObj, {
          [i === "actual_value" ? "value" : i]: val
        });
      }
    }
    return sendObj;
  }

  function detectEstimate() {
    if (estimate !== data.estimate_value) {
      return {
        estimate: estimateSum()
      };
    }
    return {};
  }

  function estimateSum() {
    let arr = [];
    let sum = data.estimate_value;
    for (let i in values) {
      if (i !== "content" && i !== "actual_value") {
        arr.push(_checkIsNaN(values[i], 0));
      }
    }
    for (let j = 0; j < arr.length; j++) {
      if (j === 0) {
        sum = arr[j];
      } else {
        sum = sum * arr[j];
      }
    }
    return sum;
  }

  function estimateSumWithKey(name: any, val: any) {
    let thisVals = { ...values, [name]: val };
    let arr = [];
    let sum = 0;
    for (let i in thisVals) {
      if (i !== "content" && i !== "actual_value") {
        arr.push(_checkIsNaN(thisVals[i], 0));
      }
    }
    for (let j = 0; j < arr.length; j++) {
      if (j === 0) {
        sum = arr[j];
      } else {
        sum = sum * arr[j];
      }
    }
    return sum;
  }

  async function onEdit() {
    console.log({
      action: "edit",
      type: costType,
      projectid,
      costid: data.costid,
      ...detectChange(),
      ...detectEstimate()
    });
    const response = await fetchPost({
      url: apiUrl("costmanagement"),
      body: {
        action: "edit",
        type: costType,
        projectid,
        costid: data.costid,
        ...detectChange(),
        ...detectEstimate()
      }
    });
    console.log(response);
    await handleLoadCost();
  }

  return (
    <TableRow
      {...{ ref: drop, onDragEnd }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={{ backgroundColor, transition: ".2s" }}
    >
      <TableCell padding="checkbox">
        {isHover ? (
          <div ref={drag}>
            <DragIndicator
              fontSize="small"
              style={{ cursor: "move", color: grey[400] }}
            />
          </div>
        ) : (
          <div style={{ width: 24, height: 24 }} />
        )}
      </TableCell>
      <TableCell align="right">{itemIndex + 1}</TableCell>
      <CellText
        {...propsToCell}
        data={data.content}
        label="Cost"
        objKey={"content"}
      />
      <CellNumberWithEstimate
        {...propsToCell}
        data={data.amount}
        label="Amount"
        objKey={"amount"}
      />
      <CellNumberWithEstimate
        {...propsToCell}
        data={data.day}
        label="Day"
        objKey={"day"}
      />
      <CellNumberWithEstimate
        {...propsToCell}
        data={data.manday}
        label="Manday"
        objKey={"manday"}
      />
      <TableCell align="right">{_thousandSeperater(estimate)}</TableCell>
      <CellNumber
        {...propsToCell}
        data={data.actual_value}
        label="Actual price"
        objKey={"actual_value"}
      />
      <TableCell>
        <div style={{ display: "flex" }}>
          {_isObjectEmpty(detectChange()) ? (
            <div style={{ width: 24, height: 24, padding: 12 }} />
          ) : (
            <Tooltip
              title="Save"
              placement="top"
              classes={{ tooltip: classes.tooltip }}
            >
              <IconButton onClick={onEdit}>
                <SaveIcon />
              </IconButton>
            </Tooltip>
          )}
          {isHover ? (
            <Tooltip
              title="Delete cost"
              placement="top"
              classes={{ tooltip: classes.tooltip }}
            >
              <IconButton
                onClick={() => onDeleteCost({ action: "delete", item: data })}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          ) : (
            <div style={{ width: 24, height: 24, padding: 12 }} />
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};
export default TrainingBodyRow;
