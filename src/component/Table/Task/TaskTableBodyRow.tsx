import React, { useState, useContext, useCallback, useEffect } from "react";
import Loadable from "react-loadable";
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
import AppType from "apptype";
import { AppContext } from "../../../AppContext";
import { grey } from "@material-ui/core/colors";
import {
  DragIndicator,
  Delete,
  KeyboardArrowDown,
  KeyboardArrowUp
} from "@material-ui/icons";
import ItemTypes from "../ItemTypes";
import Percent from "../../Chart/Percent";
import { DatePicker } from "@material-ui/pickers";

const SubtaskBody = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'SubtaskBody' */ "../Subtask/SubtaskBody"),
  loading: () => null
});

const useStyles = makeStyles(theme => ({ dateInput: { cursor: "pointer" } }));

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

const CellTaskName: React.FC<any> = ({
  apiUrl,
  fetchPost,
  handleLoadProjectDetail,
  projectid,
  taskid,
  taskname,
  expand,
  setExpand
}) => {
  const [value, setValue] = useState(taskname);

  async function onEditTaskName() {
    const response = await fetchPost({
      url: apiUrl("tasksystem"),
      body: { action: "edit", projectid, taskid, taskname: value }
    });
    console.log(response);
    await handleLoadProjectDetail();
  }

  return (
    <TableCell>
      <div style={{ display: "flex" }}>
        <InputBase
          fullWidth
          multiline
          rowsMax="6"
          value={value}
          placeholder="Task name"
          onChange={e => setValue(e.target.value)}
        />
        <IconButton
          style={{ marginTop: "auto" }}
          onClick={() => setExpand((prev: boolean) => !prev)}
        >
          {expand ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
        {value !== taskname && (
          <Button
            style={{ marginTop: "auto" }}
            variant="contained"
            color="primary"
            size="small"
            onClick={onEditTaskName}
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
  handleLoadProjectDetail,
  projectid,
  project,
  data,
  taskid,
  label,
  date,
  _dateToString,
  _dateToAPI,
  keys
}) => {
  const classes = useStyles();
  async function onEditDate(date: Date) {
    const response = await fetchPost({
      url: apiUrl("tasksystem"),
      body: { action: "edit", projectid, taskid, [keys]: _dateToAPI(date) }
    });
    await handleLoadProjectDetail();
  }
  const detail: any = project.projectdetail;

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
        onChange={(d: any) => onEditDate(new Date(d))}
        views={["year", "month", "date"]}
        labelFunc={() => {
          return date ? _dateToString(new Date(date)) : "Select date";
        }}
      />
    </TableCell>
  );
};

const Task: React.FC<TaskProps & {
  expand: boolean;
  setExpand: React.Dispatch<React.SetStateAction<boolean>>;
}> = props => {
  const classes = useStyles();
  const theme = useTheme();
  const { itemIndex, data, moveTask, movingItem, expand, setExpand } = props;
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
    project
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

  useEffect(() => {
    if (!expand) {
      setIsHover(false);
    }
  }, [expand]);

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
        {!expand && isHover ? (
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
        <Percent percent={data.percent} />
      </TableCell>
      <TableCell align="center">
        {data.ownerlist ? data.ownerlist : "-"}
      </TableCell>
      <TableCell align="center">{data.contact ? data.contact : "-"}</TableCell>
      <TableCell align="center">{data.note}</TableCell>
      <TableCell padding="checkbox">
        {!expand && isHover ? (
          <IconButton
            onClick={() => onDeleteTask({ action: "delete", item: data })}
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

const TaskTableBodyRow: React.FC<TaskProps> = props => {
  const classes = useStyles;
  const [expand, setExpand] = useState<boolean>(false);
  const { data } = props;
  const passingProps: any = { ...props, expand, setExpand };
  return (
    <React.Fragment>
      <Task {...passingProps} />
      {expand && <SubtaskBody task={data} />}
    </React.Fragment>
  );
};

export default TaskTableBodyRow;
