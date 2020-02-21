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
import { AppContext } from "../../../AppContext";
import CellNumber from "../ColumnAndRow/CellNumber";
import ItemTypes from "../../Table/ItemTypes";
import { grey } from "@material-ui/core/colors";
import CellDate from "../ColumnAndRow/CellDate";

const useStyles = makeStyles(theme => ({ tooltip: { fontSize: 14 } }));

export interface EntertainTravelBodyRowProps {}

interface DragItem {
  index: number;
  type: string;
}

const EntertainTravelBodyRow: React.FC<EntertainTravelBodyRowProps | any> = ({
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
    _dateToString,
    _dateToAPI,
    _checkIsNaN,
    _isObjectEmpty,
    onDeleteCost,
    handleMoveCost,
    sess
  } = useContext(AppContext);
  const [isHover, setIsHover] = useState<boolean>(false);
  const [values, setValues] = React.useState<any>({
    content: data.content,
    setupdate: data.setupdate,
    value: data.value
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

  function getValueFromKey(key: string) {
    switch (key) {
      case "content":
        return values[key];
      case "setupdate":
        return _dateToAPI(values[key]) ? _dateToAPI(values[key]) : "";
      default:
        return _checkIsNaN(values[key], 0);
    }
  }

  function getValueFromValue(key: string) {
    switch (key) {
      case "content":
        return data[key];
      case "setupdate":
        return _dateToAPI(data[key]) ? _dateToAPI(data[key]) : "";
      default:
        return _checkIsNaN(data[key], 0);
    }
  }

  function detectChange() {
    let sendObj = {};
    for (let i in values) {
      const val = getValueFromKey(i);
      if (val !== getValueFromValue(i)) {
        Object.assign(sendObj, {
          [i]: val
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
      subtaskid: data.subtaskid,
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
      <CellDate
        {...propsToCell}
        label="Date"
        keys="setupdate"
        _dateToString={_dateToString}
      />
      <CellNumber
        {...propsToCell}
        data={data.value}
        label="Value"
        objKey={"value"}
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
export default EntertainTravelBodyRow;
