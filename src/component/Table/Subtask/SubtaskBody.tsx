import React, {
  useContext,
  useState,
  useCallback,
  useEffect,
  useReducer
} from "react";
import Loadable from "react-loadable";
import { Typography } from "@material-ui/core";
import update from "immutability-helper";
import AppType, { Subtask } from "apptype";
import { AppContext } from "../../../AppContext";
import SubtaskRow from "./SubtaskRow";
import CreateSubtaskRow from "./ColumnAndRow/CreateSubtaskRow";

const SubtaskNote = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: 'SubtaskNote' */ "./ChildComponent/SubtaskNote"
    ),
  loading: () => null
});

const EntertainAndTravel = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: 'EntertainAndTravelCost' */ "../../Cost/CreateCost/EntertainAndTravel"
    ),
  loading: () => null
});

const GeneralDialog = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: 'GeneralDialog' */ "../../Dialog/GeneralDialog"
    ),
  loading: () => null
});

const ConfirmDialog = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: 'ConfirmDialog' */ "../../Dialog/ConfirmDialog"
    ),
  loading: () => null
});

export interface SubtaskBodyProps {
  task: AppType.ProjectTask;
  setTaskPercent: React.Dispatch<React.SetStateAction<number>>;
}

const SubtaskBody: React.FC<SubtaskBodyProps> = ({ task, setTaskPercent }) => {
  const {
    apiUrl,
    fetchPost,
    projectid,
    _onLocalhostFn,
    _onEnter,
    useConfirmDeleteItem,
    booleanReducer
  } = useContext(AppContext);
  const [{ note, addCost }, booleanDispatch] = useReducer<
    React.Reducer<AppType.BooleanReducerState, AppType.BooleanReducerActions>
  >(booleanReducer, {
    note: false,
    addCost: false
  });
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
  const [dataOnClickAction, setDataOnClickAction] = useState<Subtask | null>(
    null
  );
  const passingProps: any = {
    ...useContext(AppContext),
    handleMoveSubtask,
    onDeleteSubtask,
    booleanDispatch,
    onClickAction
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

  function onClickAction(type: "addCost" | "note", data: Subtask) {
    setDataOnClickAction(data);
    booleanDispatch({ type: "true", key: type });
  }

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
    setTaskPercent(response.percent);
  }

  function handleFetchTemp() {
    setData({
      percent: 0,
      list: [
        {
          subtaskid: 889274205,
          sequence: 1,
          subtaskname: "Subtask1",
          startdate: "2020-01-08T20:40:44.000Z",
          enddate: null,
          note: "This is subtask note.",
          createdate: "2020-01-08T20:40:44.000Z",
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
        {data && task && (
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
        <GeneralDialog
          open={note}
          onClose={() => booleanDispatch({ type: "false", key: "note" })}
          title="Subtask note"
        >
          <SubtaskNote
            {...{ handleLoadSubtask, dataOnClickAction, booleanDispatch }}
          />
        </GeneralDialog>
        <GeneralDialog
          open={addCost}
          onClose={() => booleanDispatch({ type: "false", key: "addCost" })}
          title="Entertainment and Travel cost"
        >
          <EntertainAndTravel
            {...{
              addCost,
              handleLoadSubtask,
              booleanDispatch,
              dataOnClickAction
            }}
          />
        </GeneralDialog>
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
