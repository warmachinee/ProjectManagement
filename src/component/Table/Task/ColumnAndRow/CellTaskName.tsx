import React, { useState, useContext } from "react";
import {
  TableCell,
  InputBase,
  IconButton,
  Button,
  useTheme
} from "@material-ui/core";
import { KeyboardArrowUp, KeyboardArrowDown } from "@material-ui/icons";
import { AppContext } from "../../../../AppContext";

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
  const { sess } = useContext(AppContext);
  const theme = useTheme();
  const [value, setValue] = useState(taskname);

  async function onEditTaskName() {
    const response = await fetchPost({
      url: apiUrl("tasksystem"),
      body: { action: "edit", projectid, taskid, taskname: value }
    });
    console.log(response);
    await handleLoadProjectDetail();
  }

  let color = sess.type === "manager" ? theme.palette.text.primary : undefined;

  return (
    <TableCell>
      <div style={{ display: "flex" }}>
        <InputBase
          fullWidth
          disabled={sess.type === "manager"}
          style={{ color }}
          multiline
          rowsMax="6"
          value={value}
          placeholder="Task name"
          onChange={e => setValue(e.target.value)}
        />
        {sess.type === "user" && (
          <React.Fragment>
            <IconButton
              style={{ marginTop: "auto", padding: 4 }}
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
          </React.Fragment>
        )}
      </div>
    </TableCell>
  );
};

export default CellTaskName;
