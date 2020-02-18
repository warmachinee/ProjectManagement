import React, { useState, useContext, useCallback, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  TableRow,
  TableCell,
  IconButton,
  InputBase,
  Button,
  Typography
} from "@material-ui/core";
import { useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import AppType, { ProjectTask } from "apptype";
import { AppContext } from "../../../AppContext";
import { grey } from "@material-ui/core/colors";
import { DragIndicator, Delete, KeyboardArrowDown } from "@material-ui/icons";
import ItemTypes from "../ItemTypes";
import Percent from "../../Chart/Percent";
import { DatePicker } from "@material-ui/pickers";

const useStyles = makeStyles(theme => ({ dateInput: { cursor: "pointer" } }));

interface SubtaskRowProps {
  itemIndex: number;
  data: AppType.Subtask;
  moveSubtask: (dragIndex: number, hoverIndex: number) => void;
  movingItem: {
    current: AppType.Subtask | null;
    target: AppType.Subtask | null;
  };
  handleLoadSubtask: () => void;
  task: ProjectTask | null;
}

interface DragItem {
  index: number;
  type: string;
}

const CellSubtaskName: React.FC<any> = ({
  apiUrl,
  fetchPost,
  handleLoadSubtask,
  projectid,
  subtaskid,
  subtaskName,
  task
}) => {
  const [value, setValue] = useState(subtaskName);

  async function onEditSubtaskName() {
    const response = await fetchPost({
      url: apiUrl("subtasksystem"),
      body: {
        action: "edit",
        projectid,
        taskid: task.taskid,
        subtaskid: subtaskid,
        subtaskname: value
      }
    });
    console.log(response);
    await handleLoadSubtask();
  }

  return (
    <TableCell>
      <div style={{ display: "flex" }}>
        <InputBase
          fullWidth
          multiline
          rowsMax="6"
          value={value}
          placeholder="Subtask name"
          onChange={e => setValue(e.target.value)}
        />
        {value !== subtaskName && (
          <Button
            style={{ marginTop: "auto", marginLeft: 8 }}
            variant="contained"
            color="primary"
            size="small"
            onClick={onEditSubtaskName}
          >
            Save
          </Button>
        )}
      </div>
    </TableCell>
  );
};

const CellDate: React.FC<any> = ({
  apiUrl,
  fetchPost,
  handleLoadSubtask,
  projectid,
  task,
  data,
  subtaskid,
  label,
  date,
  _dateToString,
  _dateToAPI,
  keys
}) => {
  const classes = useStyles();
  async function onEditDate(date: Date) {
    console.log({
      action: "edit",
      projectid,
      taskid: task.taskid,
      subtaskid,
      [keys]: _dateToAPI(date)
    });
    const response = await fetchPost({
      url: apiUrl("tasksystem"),
      body: {
        action: "edit",
        projectid,
        taskid: task.taskid,
        subtaskid,
        [keys]: _dateToAPI(date)
      }
    });
    await handleLoadSubtask();
  }
  const detail: any = task;
  function getMinDate() {
    if (keys === "startdate") {
      return detail.startdate
        ? new Date(detail.startdate)
        : new Date(detail.createdate);
    } else {
      return data.startdate
        ? new Date(data.startdate)
        : detail.startdate
        ? new Date(detail.startdate)
        : new Date(detail.createdate);
    }
  }

  function getMaxDate() {
    if (detail.enddate) {
      return { maxDate: new Date(detail.enddate) };
    }
    return {};
  }

  return (
    <TableCell>
      <DatePicker
        autoOk
        fullWidth
        variant="inline"
        inputVariant="outlined"
        label={label}
        value={date ? new Date(date) : new Date()}
        minDate={getMinDate()}
        {...getMaxDate()}
        onChange={(d: any) => onEditDate(new Date(d))}
        views={["year", "month", "date"]}
        labelFunc={() => {
          return date ? _dateToString(new Date(date)) : "Select date";
        }}
      />
    </TableCell>
  );
};

const SubtaskRow: React.FC<SubtaskRowProps> = props => {
  const classes = useStyles();
  const theme = useTheme();
  const {
    itemIndex,
    data,
    moveSubtask,
    movingItem,
    handleLoadSubtask,
    task
  } = props;
  const {
    apiUrl,
    fetchPost,
    onDeleteSubtask,
    handleMoveSubtask,
    _dateToString,
    _dateToAPI,
    _getDifferenceDate,
    projectid,
    project
  } = useContext(AppContext);
  const propsToCell: any = {
    handleLoadSubtask,
    apiUrl,
    fetchPost,
    projectid,
    project,
    task,
    data,
    subtaskid: data.subtaskid
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
      moveSubtask(dragIndex, hoverIndex);
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
    handleMoveSubtask(movingItem.current, movingItem.target);
  }, [movingItem]);

  let backgroundColor = theme.palette.background.paper;

  if (isOverCurrent || isOver) {
    backgroundColor = theme.palette.action.hover;
  }

  return (
    <TableRow
      ref={drop}
      onDragEnd={onDragEnd}
      style={{ backgroundColor, transition: ".2s" }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <TableCell padding="checkbox" colSpan={2}>
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
      <CellSubtaskName {...propsToCell} subtaskName={data.subtaskname} />
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
      <TableCell align="center" colSpan={4}>
        {(function() {
          const diff = _getDifferenceDate(data.startdate, data.enddate);
          const suffix =
            data.startdate && data.enddate ? ` day${diff > 1 ? "s" : ""}` : "";
          return diff + suffix;
        })()}
      </TableCell>
      <TableCell align="center">{data.note}</TableCell>
      <TableCell padding="checkbox">
        {isHover ? (
          <IconButton
            onClick={() => onDeleteSubtask({ action: "delete", item: data })}
          >
            <Delete />
          </IconButton>
        ) : (
          <div style={{ width: 24, height: 24, padding: 12 }} />
        )}
      </TableCell>
    </TableRow>
  );
};

export default SubtaskRow;
