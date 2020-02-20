import React, { useState } from "react";
import { TableCell, InputBase, IconButton, Button } from "@material-ui/core";
import { KeyboardArrowUp, KeyboardArrowDown } from "@material-ui/icons";

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
      </div>
    </TableCell>
  );
};

export default CellTaskName;
