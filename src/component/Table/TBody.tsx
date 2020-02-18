import React, { useCallback, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  TableBody,
  TableRow,
  Button,
  TableCell,
  TextField
} from "@material-ui/core";
import update from "immutability-helper";
import TBodyRow from "./TBodyRow";

const useStyles = makeStyles(theme => ({}));

export interface TBodyProps {}

function createObj(number: number) {
  return {
    id: parseInt(`70${number}`),
    owner: `Owner ${number + 1}`,
    task: `Task ${number + 1}`,
    subtask: `Sub task ${number}`
  };
}

const TBody: React.FC<TBodyProps> = () => {
  const classes = useStyles();
  const [target, setTarget] = useState<any>(null);
  const [data, setData] = useState([
    createObj(1),
    createObj(2),
    createObj(3),
    createObj(4),
    createObj(5)
  ]);
  const [data2, setData2] = useState([
    createObj(3),
    createObj(4),
    createObj(5)
  ]);

  const moveTask = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragTask = data[dragIndex];
      // console.log({ dragIndex, hoverIndex, isOver });
      setTarget(hoverIndex);
      setData(
        update(data, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragTask]
          ]
        })
      );
    },
    [data, target]
  );

  return (
    <TableBody>
      <TableRow>
        <TableCell>
          <Button onClick={() => console.log(data[target])}>Check</Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell></TableCell>
        <TableCell>
          <span style={{ display: "flex" }}>
            <TextField style={{ marginRight: 8 }} />
            <Button>Create task</Button>
          </span>
        </TableCell>
      </TableRow>
      {[createObj(0), createObj(1), createObj(2)].map((d, i) => (
        <TBodyRow
          key={i}
          index={i}
          data={d}
          moveTask={moveTask}
          target={target}
        />
      ))}
      <TableRow>
        <TableCell></TableCell>
        <TableCell>
          <span style={{ display: "flex" }}>
            <TextField style={{ marginRight: 8 }} />
            <Button>Create subtask</Button>
          </span>
        </TableCell>
      </TableRow>
      {data.map((d, i) => {
        return (
          <TBodyRow
            subtask
            key={i}
            index={i}
            data={d}
            moveTask={moveTask}
            target={target}
          />
        );
      })}
      {data2.map((d, i) => {
        return (
          <TBodyRow
            key={i}
            index={i + 3}
            data={d}
            moveTask={moveTask}
            target={target}
          />
        );
      })}
    </TableBody>
  );
};
export default TBody;
