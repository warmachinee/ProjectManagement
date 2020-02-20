import React, { useState, useContext, useCallback, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  TableRow,
  TableCell,
  IconButton,
  InputBase,
  Button,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip
} from "@material-ui/core";
import { useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import AppType, { ProjectTask, TaskStatus, SubtaskStatus } from "apptype";
import { AppContext } from "../../../AppContext";
import { grey, green, amber } from "@material-ui/core/colors";
import {
  DragIndicator,
  Delete,
  CheckCircle,
  Schedule,
  Pause,
  Description,
  NoteAdd,
  AttachMoney
} from "@material-ui/icons";
import ItemTypes from "../ItemTypes";
import { DatePicker } from "@material-ui/pickers";

const useStyles = makeStyles(theme => ({
  dateInput: { cursor: "pointer" },
  tooltip: { fontSize: 14 }
}));

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
  taskid
}) => {
  const [value, setValue] = useState(subtaskName);

  async function onEditSubtaskName() {
    const response = await fetchPost({
      url: apiUrl("subtasksystem"),
      body: {
        action: "edit",
        projectid,
        taskid: taskid,
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
  taskid,
  data,
  subtaskid,
  label,
  date,
  _dateToString,
  _dateToAPI,
  keys,
  task
}) => {
  const classes = useStyles();
  async function onEditDate(date: Date) {
    console.log({
      action: "edit",
      projectid,
      taskid: taskid,
      subtaskid,
      [keys]: _dateToAPI(date)
    });
    const response = await fetchPost({
      url: apiUrl("subtasksystem"),
      body: {
        action: "edit",
        projectid,
        taskid: taskid,
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
      return { maxDate: new Date(detail.enddate), maxDateMessage: "" };
    }
    return {};
  }

  return (
    <TableCell>
      <DatePicker
        fullWidth
        inputVariant="outlined"
        label={label}
        value={date ? new Date(date) : new Date()}
        minDate={getMinDate()}
        minDateMessage=""
        {...getMaxDate()}
        onChange={(d: any) => onEditDate(new Date(d))}
        labelFunc={() => {
          return date ? _dateToString(new Date(date)) : "Select date";
        }}
      />
    </TableCell>
  );
};

const CellStatus: React.FC<{ status: TaskStatus } | any> = ({
  status,
  apiUrl,
  fetchPost,
  handleLoadSubtask,
  projectid,
  subtaskid,
  taskid
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function getIconFromStatus() {
    switch (status) {
      case "inprogress":
        return <Schedule style={{ color: amber[600] }} />;
      case "pending":
        return <Pause />;
      case "complete":
        return <CheckCircle style={{ color: green[600] }} />;
      default:
        break;
    }
  }

  async function handleChangeStatus(value: SubtaskStatus) {
    const response = await fetchPost({
      url: apiUrl("subtasksystem"),
      body: {
        action: "edit",
        projectid,
        taskid: taskid,
        subtaskid: subtaskid,
        status: value
      }
    });
    console.log(response);
    handleClose();
    await handleLoadSubtask();
  }

  return (
    <TableCell>
      <IconButton onClick={handleClick}>{getIconFromStatus()}</IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => handleChangeStatus("inprogress")}>
          <ListItemIcon>
            <Schedule style={{ color: amber[600] }} />
          </ListItemIcon>
          <Typography>Inprogress</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleChangeStatus("pending")}>
          <ListItemIcon>
            <Pause />
          </ListItemIcon>
          <Typography>Pending</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleChangeStatus("complete")}>
          <ListItemIcon>
            <CheckCircle style={{ color: green[600] }} />
          </ListItemIcon>
          <Typography>Complete</Typography>
        </MenuItem>
      </Menu>
    </TableCell>
  );
};

const CellAction: React.FC<any> = ({ isHover, data, task }) => {
  const classes = useStyles();
  const { onDeleteSubtask, onClickAction } = useContext(AppContext);
  function getNoteIcon() {
    switch (true) {
      case data.note !== null && data.note.length > 0:
        return (
          <Tooltip
            title="Note"
            placement="top"
            classes={{ tooltip: classes.tooltip }}
          >
            <IconButton
              onClick={() => onClickAction("note", { task, subtask: data })}
            >
              <Description />
            </IconButton>
          </Tooltip>
        );
      default:
        return isHover ? (
          <Tooltip
            title="Note"
            placement="top"
            classes={{ tooltip: classes.tooltip }}
          >
            <IconButton
              onClick={() => onClickAction("note", { task, subtask: data })}
            >
              <NoteAdd />
            </IconButton>
          </Tooltip>
        ) : (
          <div style={{ width: 24, height: 24, padding: 12 }} />
        );
    }
  }
  return (
    <TableCell padding="checkbox" colSpan={4}>
      <div style={{ display: "flex" }}>
        {getNoteIcon()}
        {isHover ? (
          <React.Fragment>
            <Tooltip
              title="Cost"
              placement="top"
              classes={{ tooltip: classes.tooltip }}
            >
              <IconButton
                onClick={() =>
                  onClickAction("addCost", { task, subtask: data })
                }
              >
                <AttachMoney />
              </IconButton>
            </Tooltip>
            <Tooltip
              title="Delete subtask"
              placement="top"
              classes={{ tooltip: classes.tooltip }}
            >
              <IconButton
                onClick={() =>
                  onDeleteSubtask({ action: "delete", item: data })
                }
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </React.Fragment>
        ) : (
          <div style={{ width: 24, height: 24, padding: 12 }} />
        )}
      </div>
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
    subtaskid: data.subtaskid,
    taskid: task && task.taskid,
    project,
    task,
    data
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
      <CellStatus {...propsToCell} status={data.status} />
      <CellSubtaskName {...propsToCell} subtaskName={data.subtaskname} />
      <CellDate
        {...propsToCell}
        {...{ _dateToString, _dateToAPI }}
        date={data.startdate}
        label="Start"
        keys="startdate"
      />
      <CellDate
        {...propsToCell}
        {...{ _dateToString, _dateToAPI }}
        date={data.enddate}
        label="End"
        keys="enddate"
      />
      <TableCell align="center">
        {(function() {
          const diff = _getDifferenceDate(data.startdate, data.enddate);
          const suffix =
            data.startdate && data.enddate ? ` day${diff > 1 ? "s" : ""}` : "";
          return diff + suffix;
        })()}
      </TableCell>
      <CellAction {...propsToCell} {...{ isHover, data }} />
    </TableRow>
  );
};

export default SubtaskRow;
