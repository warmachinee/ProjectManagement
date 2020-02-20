import React, { useState, useContext } from "react";
import { TableCell, InputBase, Button } from "@material-ui/core";
import { AppContext } from "../../../../AppContext";

const CellText: React.FC<any> = ({
  projectid,
  taskid,
  label,
  data,
  objKey
}) => {
  const { apiUrl, fetchPost, handleLoadProjectDetail } = useContext(AppContext);
  const thisData = data ? data : "";
  const [value, setValue] = useState(thisData);

  async function onEdit() {
    console.log({ action: "edit", projectid, taskid, [objKey]: value });
    const response = await fetchPost({
      url: apiUrl("tasksystem"),
      body: { action: "edit", projectid, taskid, [objKey]: value }
    });
    console.log(response);
    await handleLoadProjectDetail();
  }

  return (
    <TableCell>
      <InputBase
        fullWidth
        multiline
        rowsMax="6"
        value={value}
        placeholder={label}
        onChange={e => setValue(e.target.value)}
      />
      {value !== thisData && (
        <Button
          style={{ marginTop: "auto" }}
          variant="contained"
          color="primary"
          size="small"
          onClick={onEdit}
        >
          Save
        </Button>
      )}
    </TableCell>
  );
};

export default CellText;
