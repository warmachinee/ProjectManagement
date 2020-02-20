import React, { useState, useContext, useCallback } from "react";
import Loadable from "react-loadable";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { TableRow, TableCell, IconButton, Tooltip } from "@material-ui/core";
import { useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import AppType from "apptype";
import { AppContext } from "../../../AppContext";
import { grey } from "@material-ui/core/colors";
import {
  DragIndicator,
  Delete,
  Description,
  NoteAdd
} from "@material-ui/icons";
import ItemTypes from "../ItemTypes";
import Percent from "../../Chart/Percent";
import CellTaskName from "./ColumnAndRow/CellTaskName";
import CellDate from "./ColumnAndRow/CellDate";
import CellText from "./ColumnAndRow/CellText";

const SubtaskBody = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'SubtaskBody' */ "../Subtask/SubtaskBody"),
  loading: () => null
});

const useStyles = makeStyles(theme => ({
  dateInput: { cursor: "pointer" },
  tooltip: { fontSize: 14 }
}));

interface TaskProps {
  itemIndex: number;
  data: AppType.ProjectTask;
  moveTask: (dragIndex: number, hoverIndex: number) => void;
  movingItem: {
    current: AppType.ProjectTask | null;
    target: AppType.ProjectTask | null;
  };
}

interface DragItem {
  index: number;
  type: string;
}

const Task: React.FC<TaskProps & {
  expand: boolean;
  setExpand: React.Dispatch<React.SetStateAction<boolean>>;
  taskPercent: number;
}> = props => {
  const classes = useStyles();
  const theme = useTheme();
  const {
    itemIndex,
    data,
    moveTask,
    movingItem,
    expand,
    setExpand,
    taskPercent
  } = props;
  const {
    isDarkMode,
    apiUrl,
    fetchPost,
    handleLoadProjectDetail,
    handleMoveTask,
    onDeleteTask,
    _dateToString,
    _dateToAPI,
    _getDifferenceDate,
    projectid,
    project,
    onClickAction
  } = useContext(AppContext);
  const propsToCell: any = {
    handleLoadProjectDetail,
    apiUrl,
    fetchPost,
    projectid,
    project,
    data,
    taskid: data.taskid,
    expand,
    setExpand
  };
  const [isHover, setIsHover] = useState<boolean>(false);
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
    handleMoveTask(movingItem.current, movingItem.target);
  }, [movingItem]);

  let backgroundColor = isDarkMode
    ? theme.palette.grey[700]
    : theme.palette.grey[100];

  if (isOverCurrent || isOver) {
    backgroundColor = isDarkMode
      ? theme.palette.grey[900]
      : theme.palette.grey[300];
  }

  function getNoteIcon() {
    switch (true) {
      case data.note !== null && data.note.length > 0:
        return (
          <Tooltip
            title="Task note"
            placement="top"
            classes={{ tooltip: classes.tooltip }}
          >
            <IconButton onClick={() => onClickAction("note", data)}>
              <Description />
            </IconButton>
          </Tooltip>
        );
      default:
        return isHover ? (
          <Tooltip
            title="Task note"
            placement="top"
            classes={{ tooltip: classes.tooltip }}
          >
            <IconButton onClick={() => onClickAction("note", data)}>
              <NoteAdd />
            </IconButton>
          </Tooltip>
        ) : (
          <div style={{ width: 24, height: 24, padding: 12 }} />
        );
    }
  }

  return (
    <TableRow
      {...(!expand && {
        ref: drop,
        onDragEnd,
        onMouseEnter: () => setIsHover(true),
        onMouseLeave: () => setIsHover(false)
      })}
      style={{ backgroundColor, transition: ".2s" }}
    >
      <TableCell padding="checkbox">
        {expand ? (
          <div style={{ width: 24, height: 24 }} />
        ) : isHover ? (
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
      <CellTaskName {...propsToCell} taskname={data.taskname} />
      <CellDate
        {...propsToCell}
        date={data.startdate}
        label="Start"
        keys="startdate"
        _dateToString={_dateToString}
        _dateToAPI={_dateToAPI}
      />
      <CellDate
        {...propsToCell}
        date={data.enddate}
        label="End"
        keys="enddate"
        _dateToString={_dateToString}
        _dateToAPI={_dateToAPI}
      />
      <TableCell align="center">
        {(function() {
          const diff = _getDifferenceDate(data.startdate, data.enddate);
          const suffix =
            data.startdate && data.enddate ? ` day${diff > 1 ? "s" : ""}` : "";
          return diff + suffix;
        })()}
      </TableCell>
      <TableCell align="center">
        <Percent backgroundColor={backgroundColor} percent={taskPercent} />
      </TableCell>
      <CellText
        {...propsToCell}
        data={data.ownerlist}
        label="Owner"
        objKey="ownerlist"
      />
      <CellText
        {...propsToCell}
        data={data.contact}
        label="Contact"
        objKey="contact"
      />
      <TableCell padding="checkbox">
        <div style={{ display: "flex" }}>
          {getNoteIcon()}
          {expand ? (
            <div style={{ width: 24, height: 24, padding: 12 }} />
          ) : isHover ? (
            <Tooltip
              title="Delete task"
              placement="top"
              classes={{ tooltip: classes.tooltip }}
            >
              <IconButton
                onClick={() => onDeleteTask({ action: "delete", item: data })}
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

const TaskTableBodyRow: React.FC<TaskProps> = props => {
  const [expand, setExpand] = useState<boolean>(false);
  const { data } = props;
  const [taskPercent, setTaskPercent] = useState<number>(data.percent);
  const passingProps: any = { ...props, expand, setExpand, taskPercent };
  return (
    <React.Fragment>
      <Task {...passingProps} />
      {expand && <SubtaskBody task={data} setTaskPercent={setTaskPercent} />}
    </React.Fragment>
  );
};

export default TaskTableBodyRow;
