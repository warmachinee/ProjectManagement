import React, { useContext, useState, useCallback } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";
import {
  TableRow,
  TableCell,
  Link,
  IconButton,
  Tooltip
} from "@material-ui/core";
import { useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import AppType from "apptype";
import { AppContext } from "../../../AppContext";
import { grey, green } from "@material-ui/core/colors";
import { DragIndicator, Delete } from "@material-ui/icons";
import ItemTypes from "../ItemTypes";

const useStyles = makeStyles(theme => ({
  tooltip: { fontSize: 14 }
}));

export interface ProjectTableBodyRowProps {
  itemIndex: number;
  data: AppType.ProjectTableRow;
  moveProject: (dragIndex: number, hoverIndex: number) => void;
  movingItem: {
    current: AppType.ProjectTableRow | null;
    target: AppType.ProjectTableRow | null;
  };
}

export interface DragItem {
  index: number;
  type: string;
}

const ProjectTableBodyRow: React.FC<ProjectTableBodyRowProps> = props => {
  const classes = useStyles();
  const theme = useTheme();
  const { itemIndex, data, moveProject, movingItem } = props;
  const {
    _dateToString,
    _thousandSeperater,
    handleMoveProject,
    onDeleteProject,
    sess,
    userid
  } = useContext(AppContext);
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
      moveProject(dragIndex, hoverIndex);
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
    handleMoveProject(movingItem.current, movingItem.target);
  }, [movingItem]);

  let backgroundColor = theme.palette.background.paper;
  if (isOverCurrent || isOver) {
    backgroundColor = theme.palette.action.hover;
  }

  function getLabelFromStatus(status: AppType.ProjectStatus) {
    switch (status) {
      case "inprogress":
        return "Inprogress";
      case "pending":
        return "Pending";
      // case "pm":
      //   return "PM";
      case "complete":
        return "Complete";
      case "fail":
        return "Fail";
      default:
        return "None";
    }
  }

  function getLabelFromStage(stage: AppType.ProjectStage) {
    switch (stage) {
      case 1:
        return "Proposal";
      case 2:
        return "Contract";
      case 3:
        return "Implement";
      case 4:
        return "PM";
      default:
        return "None";
    }
  }

  return (
    <TableRow
      {...(sess.type === "user" && {
        ref: drop,
        onDragEnd,
        onMouseEnter: () => setIsHover(true),
        onMouseLeave: () => setIsHover(false)
      })}
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
      <TableCell>
        <Link
          component={RouterLink}
          to={`/${sess.type === "user" ? "project" : userid}/${data.projectid}`}
        >
          {data.projectname}
        </Link>
      </TableCell>
      <TableCell align="center">
        {getLabelFromStage(data.stage_current)}
      </TableCell>
      <TableCell align="center">
        {data.enddate ? _dateToString(data.startdate) : "-"}
      </TableCell>
      <TableCell align="center">
        {data.enddate ? _dateToString(data.enddate) : "-"}
      </TableCell>
      <TableCell align="right">
        {_thousandSeperater(data.projectcost)}
      </TableCell>
      <TableCell align="center" style={{ textTransform: "capitalize" }}>
        {getLabelFromStatus(data.status)}
      </TableCell>
      <TableCell padding="checkbox">
        {isHover && sess.type === "user" ? (
          <Tooltip
            title="Delete project"
            placement="top"
            classes={{ tooltip: classes.tooltip }}
          >
            <IconButton onClick={() => onDeleteProject(data)}>
              <Delete />
            </IconButton>
          </Tooltip>
        ) : (
          <div style={{ width: 24, height: 24, padding: 12 }} />
        )}
      </TableCell>
    </TableRow>
  );
};
export default ProjectTableBodyRow;
