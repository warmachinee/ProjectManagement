import React, { useContext, useState } from "react";
import { TableBody, TableRow, TableCell, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "../../../AppContext";
import UnderlingBodyRow from "./UnderlingBodyRow";

const useStyles = makeStyles(theme => ({}));

export interface UnderlingBodyProps {}

const UnderlingBody: React.FC<UnderlingBodyProps> = () => {
  const classes = useStyles();
  const { userList, setUserList, _thousandSeperater } = useContext(AppContext);

  return (
    <TableBody>
      {userList && (
        <React.Fragment>
          {userList.map((d: any, i: number) => {
            return <UnderlingBodyRow key={d.userid} data={d} itemIndex={i} />;
          })}
        </React.Fragment>
      )}
    </TableBody>
  );
};
export default UnderlingBody;
