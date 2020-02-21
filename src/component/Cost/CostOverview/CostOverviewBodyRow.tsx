import React, { useContext } from "react";
import { TableRow, TableCell, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "../../../AppContext";
import CellNumber from "../ColumnAndRow/CellNumber";

const useStyles = makeStyles(theme => ({}));

export interface CostOverviewBodyRowProps {}

const CostOverviewBodyRow: React.FC<CostOverviewBodyRowProps | any> = ({
  data,
  index
}) => {
  const classes = useStyles();
  const {
    apiUrl,
    fetchPost,
    projectid,
    _thousandSeperater,
    _checkIsNaN,
    setCostType,
    handleLoadCost
  } = useContext(AppContext);
  const [values, setValues] = React.useState<any>({
    sumest: data.sumest,
    sumact: data.sumact
  });
  const propsToCell: any = {
    onEdit,
    values,
    setValues
  };

  function detectChange() {
    let sendObj = {};
    for (let i in values) {
      const val = _checkIsNaN(values[i], 0);
      if (val !== data[i]) {
        Object.assign(sendObj, {
          [data.type]: val
        });
      }
    }
    return sendObj;
  }

  async function onEdit() {
    const sendObj = {
      action: "edit",
      projectid,
      ...detectChange()
    };
    console.log(sendObj);
    const response = await fetchPost({
      url: apiUrl("projectsystem"),
      body: sendObj
    });
    console.log(response);
    await handleLoadCost();
  }

  return (
    <TableRow>
      <TableCell />
      <TableCell align="right">{index + 1}</TableCell>
      <TableCell>
        <Button
          onClick={() => setCostType(data.type)}
          style={{ textTransform: "capitalize" }}
          color="primary"
        >
          {data.type === "managementfee" ? "Management Fee" : data.type}
        </Button>
      </TableCell>
      {data.type === "entertain" || data.type === "travel" ? (
        <CellNumber
          {...propsToCell}
          data={data.sumest}
          label="Estimate"
          objKey={"sumest"}
        />
      ) : (
        <TableCell align="right">{_thousandSeperater(data.sumact)}</TableCell>
      )}

      <TableCell align="right">{_thousandSeperater(data.sumact)}</TableCell>
      <TableCell />
    </TableRow>
  );
};
export default CostOverviewBodyRow;
