import React, { useContext, useState, useCallback } from "react";
import { TableBody, TableRow, TableCell, Typography } from "@material-ui/core";
import update from "immutability-helper";
import { makeStyles } from "@material-ui/core/styles";
import AppType from "apptype";
import { AppContext } from "../../../AppContext";
import ProjectTableBodyRow from "./ProjectTableBodyRow";

const useStyles = makeStyles(theme => ({}));

export interface ProjectTableBodyProps {}

const ProjectTableBody: React.FC<ProjectTableBodyProps> = () => {
  const classes = useStyles();
  const { projectList, setProjectList, _thousandSeperater } = useContext(
    AppContext
  );
  const [current, setCurrent] = useState<AppType.ProjectTableRow | null>(null);
  const [target, setTarget] = useState<AppType.ProjectTableRow | null>(null);
  const moveProject = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const current = projectList.list[dragIndex];
      const hover = projectList.list[hoverIndex];
      setCurrent(current);
      setTarget(hover);
      const updateProjectList = update(projectList.list, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, current]
        ]
      });
      setProjectList({ ...projectList, list: updateProjectList });
    },
    [projectList, target]
  );

  const TableSummary: React.FC = () => {
    return (
      <TableRow>
        <TableCell></TableCell>
        <TableCell>
          <Typography style={{ fontWeight: 600 }}>Total</Typography>
        </TableCell>
        <TableCell colSpan={3}></TableCell>
        <TableCell align="right" colSpan={2}>
          <Typography style={{ fontWeight: 600 }}>
            {_thousandSeperater(projectList.totalcost)}
          </Typography>
        </TableCell>
        <TableCell></TableCell>
      </TableRow>
    );
  };

  return (
    <TableBody>
      {projectList && (
        <React.Fragment>
          {projectList.list.map((d: AppType.ProjectTableRow, i: number) => {
            return (
              <ProjectTableBodyRow
                key={d.projectid}
                data={d}
                itemIndex={i}
                moveProject={moveProject}
                movingItem={{
                  current: current,
                  target: target
                }}
              />
            );
          })}
          <TableSummary />
        </React.Fragment>
      )}
    </TableBody>
  );
};
export default ProjectTableBody;
