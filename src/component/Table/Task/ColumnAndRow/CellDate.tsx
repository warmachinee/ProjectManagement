import React from "react";
import { DatePicker } from "@material-ui/pickers";
import { TableCell } from "@material-ui/core";

const CellDate: React.FC<any> = ({
  apiUrl,
  fetchPost,
  handleLoadProjectDetail,
  projectid,
  project,
  data,
  taskid,
  label,
  date,
  _dateToString,
  _dateToAPI,
  keys
}) => {
  async function onEditDate(date: Date) {
    const response = await fetchPost({
      url: apiUrl("tasksystem"),
      body: { action: "edit", projectid, taskid, [keys]: _dateToAPI(date) }
    });
    await handleLoadProjectDetail();
  }
  const detail: any = project.projectdetail;

  function getMinDate() {
    if (keys === "startdate") {
      return detail.startdate
        ? new Date(detail.startdate)
        : new Date(detail.createdate);
    } else {
      return data.startdate
        ? new Date(data.startdate)
        : detail.startdate
        ? new Date(detail.startdate)
        : new Date(detail.createdate);
    }
  }

  function getMaxDate() {
    if (detail.enddate) {
      return { maxDate: new Date(detail.enddate), maxDateMessage: "" };
    }
    return {};
  }

  return (
    <TableCell>
      <DatePicker
        fullWidth
        inputVariant="outlined"
        label={label}
        value={date ? new Date(date) : new Date()}
        minDate={getMinDate()}
        minDateMessage=""
        {...getMaxDate()}
        onChange={(d: any) => onEditDate(new Date(d))}
        labelFunc={() => {
          return date ? _dateToString(new Date(date)) : "Select date";
        }}
      />
    </TableCell>
  );
};

export default CellDate;
