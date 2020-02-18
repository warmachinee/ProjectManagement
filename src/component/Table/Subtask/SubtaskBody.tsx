import React, { useContext, useState, useCallback, useEffect } from "react";
import Loadable from "react-loadable";
import {
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Button,
  Typography
} from "@material-ui/core";
import update from "immutability-helper";
import { makeStyles } from "@material-ui/core/styles";
import AppType, { Subtask } from "apptype";
import { AppContext } from "../../../AppContext";
import SubtaskRow from "./SubtaskRow";

const ConfirmDialog = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: 'ConfirmDialog' */ "../../Dialog/ConfirmDialog"
    ),
  loading: () => null
});

const useStyles = makeStyles(theme => ({
  createTextField: { display: "flex" },
  textField: { marginRight: 8, flexGrow: 1 }
}));

export interface SubtaskBodyProps {
  task: AppType.ProjectTask;
}

const CreateSubtaskRow: React.FC<{ [keys: string]: any }> = props => {
  const classes = useStyles();
  const { subtaskName, setSubtaskName, _onEnter, handleCreateSubtask } = props;
  return (
    <TableRow>
      <TableCell colSpan={2} />
      <TableCell colSpan={1}>
        <div className={classes.createTextField}>
          <TextField
            className={classes.textField}
            name="subtaskName"
            size="small"
            value={subtaskName}
            variant="outlined"
            placeholder="Subtask name"
            onChange={e => setSubtaskName(e.target.value)}
            onKeyPress={_onEnter(handleCreateSubtask)}
          />
          <Button
            disabled={subtaskName === ""}
            variant="contained"
            color="primary"
            onClick={handleCreateSubtask}
          >
            Create
          </Button>
        </div>
      </TableCell>
      <TableCell colSpan={8} />
    </TableRow>
  );
};

const SubtaskBody: React.FC<SubtaskBodyProps> = ({ task }) => {
  const classes = useStyles();
  const {
    apiUrl,
    fetchPost,
    projectid,
    _onLocalhostFn,
    _onEnter,
    useConfirmDeleteItem
  } = useContext(AppContext);
  const [current, setCurrent] = useState<AppType.Subtask | null>(null);
  const [target, setTarget] = useState<AppType.Subtask | null>(null);
  const [subtaskName, setSubtaskName] = useState<string>("");
  const [data, setData] = useState<{
    percent: number;
    list: Subtask[];
  } | null>(null);
  const [
    { confirmState, item: subtaskOnDelete },
    onDeleteSubtask
  ] = useConfirmDeleteItem();
  const passingProps: any = {
    ...useContext(AppContext),
    handleMoveSubtask,
    onDeleteSubtask
  };

  const moveSubtask = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      if (data) {
        const current = data.list[dragIndex];
        const hover = data.list[hoverIndex];
        setCurrent(current);
        setTarget(hover);
        const updateSubtaskList = update(data.list, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, current]
          ]
        });
        setData({ ...data, list: updateSubtaskList });
      }
    },
    [data, target]
  );

  async function handleMoveSubtask(
    current: AppType.Subtask,
    target: AppType.Subtask
  ) {
    const response = await fetchPost({
      url: apiUrl("subtasksystem"),
      body: {
        action: "move",
        projectid,
        taskid: task.taskid,
        selectseq: current.sequence,
        movetoseq: target.sequence
      }
    });
    await handleLoadSubtask();
  }

  async function handleCreateSubtask() {
    const response = await fetchPost({
      url: apiUrl("subtasksystem"),
      body: {
        action: "create",
        projectid,
        taskid: task.taskid,
        subtaskname: subtaskName
      }
    });
    console.log(response);
    if (response.status === "success") {
      setSubtaskName("");
    }
    await handleLoadSubtask();
  }

  async function handleDeleteSubtask() {
    if (subtaskOnDelete) {
      const response = await fetchPost({
        url: apiUrl("subtasksystem"),
        body: {
          action: "delete",
          projectid,
          taskid: task.taskid,
          subtaskid: subtaskOnDelete.subtaskid
        }
      });
      if (response.status === "success") {
        onDeleteSubtask({ action: "cancel" });
      }
      await handleLoadSubtask();
    }
  }

  async function handleLoadSubtask() {
    const response = await fetchPost({
      url: apiUrl("loadtask"),
      body: {
        action: "detail",
        projectid,
        taskid: task.taskid
      }
    });
    console.log(response);
    setData(response);
  }

  function handleFetchTemp() {
    setData({
      percent: 0,
      list: [
        {
          subtaskid: 889274205,
          sequence: 1,
          subtaskname: "Subtask1",
          startdate: null,
          enddate: null,
          note: null,
          createdate: "2020-02-18T20:40:44.000Z",
          status: "inprogress",
          cost: null
        },
        {
          subtaskid: 985781309,
          sequence: 2,
          subtaskname: "Subtask2",
          startdate: null,
          enddate: null,
          note: null,
          createdate: "2020-02-18T20:48:58.000Z",
          status: "inprogress",
          cost: null
        }
      ]
    });
  }

  useEffect(() => {
    _onLocalhostFn(handleFetchTemp, handleLoadSubtask);
  }, []);

  return (
    <AppContext.Provider value={...passingProps}>
      <React.Fragment>
        <CreateSubtaskRow
          {...{
            subtaskName,
            setSubtaskName,
            _onEnter,
            handleCreateSubtask
          }}
        />
        {data && (
          <React.Fragment>
            {data.list.map((d: AppType.Subtask, i: number) => {
              return (
                <SubtaskRow
                  key={d.subtaskid}
                  data={d}
                  itemIndex={i}
                  moveSubtask={moveSubtask}
                  movingItem={{
                    current: current,
                    target: target
                  }}
                  task={task}
                  handleLoadSubtask={handleLoadSubtask}
                />
              );
            })}
          </React.Fragment>
        )}
        <ConfirmDialog
          type="delete"
          open={confirmState}
          onClose={() => onDeleteSubtask({ action: "cancel" })}
          onCancel={() => onDeleteSubtask({ action: "cancel" })}
          onSubmit={handleDeleteSubtask}
          title="Are you sure you want to delete ?"
        >
          <Typography variant="h6" style={{ fontWeight: 400 }} align="center">
            {subtaskOnDelete && subtaskOnDelete.subtaskname}
          </Typography>
        </ConfirmDialog>
      </React.Fragment>
    </AppContext.Provider>
  );
};
export default SubtaskBody;
