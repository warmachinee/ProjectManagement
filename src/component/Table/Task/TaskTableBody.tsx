import React, { useContext, useState, useCallback } from "react";
import { TableBody } from "@material-ui/core";
import update from "immutability-helper";
import AppType from "apptype";
import { AppContext } from "../../../AppContext";
import TaskTableBodyRow from "./TaskTableBodyRow";
import CreateTaskRow from "./ColumnAndRow/CreateTaskRow";

export interface TaskTableBodyProps {}

const TaskTableBody: React.FC<TaskTableBodyProps> = React.memo(() => {
  const {
    apiUrl,
    fetchPost,
    project,
    setProject,
    projectid,
    handleLoadProjectDetail,
    _onEnter,
    isDarkMode,
    sess
  } = useContext(AppContext);
  const [current, setCurrent] = useState<AppType.ProjectTask | null>(null);
  const [target, setTarget] = useState<AppType.ProjectTask | null>(null);
  const [taskName, setTaskName] = useState<string>("");
  const moveTask = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const current = project.tasklist[dragIndex];
      const hover = project.tasklist[hoverIndex];
      setCurrent(current);
      setTarget(hover);
      const updateTaskList = update(project.tasklist, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, current]
        ]
      });
      setProject({ ...project, tasklist: updateTaskList });
    },
    [project, target]
  );

  async function handleCreateTask() {
    const response = await fetchPost({
      url: apiUrl("tasksystem"),
      body: { action: "create", projectid: projectid, taskname: taskName }
    });
    console.log(response);
    if (response.status === "success") {
      setTaskName("");
    }
    await handleLoadProjectDetail();
  }

  return (
    <TableBody>
      {sess.type === "user" && (
        <CreateTaskRow
          {...{ taskName, setTaskName, _onEnter, handleCreateTask, isDarkMode }}
        />
      )}

      {project && (
        <React.Fragment>
          {project.tasklist.map((d: AppType.ProjectTask, i: number) => {
            return (
              <TaskTableBodyRow
                key={d.taskid}
                data={d}
                itemIndex={i}
                moveTask={moveTask}
                movingItem={{
                  current: current,
                  target: target
                }}
              />
            );
          })}
        </React.Fragment>
      )}
    </TableBody>
  );
});
export default TaskTableBody;
