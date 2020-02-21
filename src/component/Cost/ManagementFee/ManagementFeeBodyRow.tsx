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

export interface HardwareSoftwareBodyRowProps {}

interface DragItem {
  index: number;
  type: string;
}

const HardwareSoftwareBodyRow: React.FC<HardwareSoftwareBodyRowProps | any> = ({
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
    handleMoveCost,
    sess
  } = useContext(AppContext);
  const [isHover, setIsHover] = useState<boolean>(false);
  const [values, setValues] = React.useState<any>({
    content: data.content,
    estimate_value: data.estimate_value,
    actual_value: data.actual_value
  });
  const propsToCell: any = {
    raw: data,
    costid: data.costid,
    values,
    setValues,
    onEdit
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

  function getKeys(key: string) {
    switch (key) {
      case "actual_value":
        return "value";
      case "estimate_value":
        return "estimate";
      default:
        return key;
    }
  }

  function detectChange() {
    let sendObj = {};
    for (let i in values) {
      const val = i === "content" ? values[i] : _checkIsNaN(values[i], 0);
      if (val !== data[i]) {
        Object.assign(sendObj, {
          [getKeys(i)]: val
        });
      }
    }
    return sendObj;
  }

  async function onEdit() {
    const sendObj = {
      action: "edit",
      type: costType,
      projectid,
      costid: data.costid,
      ...detectChange(),
      content: values.content
    };
    console.log(sendObj);
    const response = await fetchPost({
      url: apiUrl("costmanagement"),
      body: sendObj
    });
    console.log(response);
    await handleLoadCost();
  }

  return (
    <TableRow
      {...(sess.type === "user" && {
        ref: drop,
        onDragEnd,
        onMouseEnter: () => setIsHover(true),
        onMouseLeave: () => setIsHover(false)
      })}
      style={{ backgroundColor, transition: ".2s" }}
    >
      <TableCell padding="checkbox">
        {isHover && sess.type === "user" ? (
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
      <CellNumber
        {...propsToCell}
        data={data.estimate_value}
        label="Estimate cost"
        objKey={"estimate_value"}
      />
      <CellNumber
        {...propsToCell}
        data={data.actual_value}
        label="Actual cost"
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
          {isHover && sess.type === "user" ? (
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
export default HardwareSoftwareBodyRow;
