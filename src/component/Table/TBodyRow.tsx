import React, { useContext, useRef, useState, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TableRow, TableCell, IconButton } from "@material-ui/core";
import { AppContext } from "../../AppContext";
import { useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import { XYCoord } from "dnd-core";
import { Note, Add } from "@material-ui/icons";
import Percent from "../Chart/Percent";

const ItemTypes = {
  CARD: "card"
};

const useStyles = makeStyles(theme => ({}));

export interface TBodyRowProps {
  subtask?: boolean;
  index: number;
  data: {
    id: number;
    owner: string;
    task: string;
    subtask: string;
  };
  moveTask: (dragIndex: number, hoverIndex: number) => void;
  target: any;
}

export interface DragItem {
  index: number;
  data: number;
  type: string;
}

const TBodyRow: React.FC<TBodyRowProps> = props => {
  const classes = useStyles();
  const { index, data, moveTask, target, subtask } = props;
  const { _dateToString } = useContext(AppContext);
  const percent = Math.floor(Math.random() * Math.floor(100));
  const ref = useRef<HTMLTableRowElement>(null);
  const [{ isOver, isOverCurrent }, drop] = useDrop({
    accept: ItemTypes.CARD,
    hover(item: DragItem, monitor: DropTargetMonitor) {
      const dragIndex = item.index;
      const hoverIndex = index;
      if (!ref.current) {
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
      isOverCurrent: monitor.isOver()
    })
  });
  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.CARD, data, index },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging()
    })
  });

  const onDragEnd = useCallback(() => {
    console.log("DragEnd", {
      current: index + 1,
      target: target + 1
    });
  }, [target]);

  const opacity = isDragging ? 0.2 : 1;
  drag(drop(ref));

  let backgroundColor = "#fff";

  if (isOverCurrent || isOver) {
    backgroundColor = "#ddd";
  }

  return (
    <TableRow
      ref={ref}
      style={{ cursor: "move", opacity, backgroundColor }}
      onDragEnd={onDragEnd}
    >
      <TableCell align="right">{subtask ? "" : index + 1}</TableCell>
      <TableCell>{data[subtask ? "subtask" : "task"]}</TableCell>
      <TableCell>{subtask ? "Sub task note" : data.owner}</TableCell>
      <TableCell align="center">
        {subtask
          ? ""
          : (function() {
              const number = Math.floor(Math.random() * Math.floor(3));
              switch (number) {
                case 0:
                  return "High";
                case 1:
                  return "Medium";
                case 2:
                  return "Low";
                default:
                  return "Priority";
              }
            })()}
      </TableCell>
      <TableCell>
        {subtask
          ? ""
          : _dateToString(
              new Date(
                `${Math.floor(Math.random() * 12 + 1)}-${Math.floor(
                  Math.random() * 28 + 1
                )}-20${Math.floor(Math.random() * 2 + 19)}`
              )
            )}
      </TableCell>
      <TableCell>
        {subtask
          ? ""
          : _dateToString(
              new Date(
                `${Math.floor(Math.random() * 12 + 1)}-${Math.floor(
                  Math.random() * 28 + 1
                )}-20${Math.floor(Math.random() * 2 + 19)}`
              )
            )}
      </TableCell>
      <TableCell align="right">
        {subtask ? "" : Math.floor(Math.random() * 100)}
      </TableCell>
      <TableCell align="center">
        {subtask ? "" : <Percent percent={percent} />}
      </TableCell>
      <TableCell align="center">
        {subtask ? "" : percent === 100 ? "Done" : "-"}
      </TableCell>
      <TableCell>{subtask ? "" : "Mr.A"}</TableCell>
      <TableCell>
        {subtask ? (
          <IconButton disabled={index % 3 === 0}>
            <Note />
          </IconButton>
        ) : (
          "-"
        )}
      </TableCell>
    </TableRow>
  );
};
export default TBodyRow;
